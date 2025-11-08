import { supabase } from '../lib/supabase';
import type { CashFlowPrediction, FinancialHealth } from '../types';
import { financialPlanningAgent } from '../lib/agents/FinancialPlanningAgent';
import type { AgentContext } from '../lib/agents/types';

export const cashflowService = {
  async predictCashFlow(userId: string, days: number = 30): Promise<CashFlowPrediction[]> {
    try {
      // Get current balance
      const { data: ebt } = await supabase
        .from('ebt_accounts')
        .select('current_balance, refill_date')
        .eq('user_id', userId)
        .single();

      // Get user profile for income
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('monthly_income')
        .eq('id', userId)
        .single();

      // Get recent transactions for spending patterns
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

      const currentBalance = ebt?.current_balance || 0;
      const monthlyIncome = profile?.monthly_income || 0;

      // Calculate average daily spending
      const avgDailySpending = this.calculateAverageDailySpending(transactions || []);

      // Generate predictions
      const predictions: CashFlowPrediction[] = [];
      let balance = currentBalance;
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        // Add refill on the 1st of month
        let income = 0;
        if (date.getDate() === 1) {
          income = monthlyIncome;
          balance += income;
        }

        // Subtract daily expenses
        const expenses = avgDailySpending;
        balance -= expenses;

        predictions.push({
          date: date.toISOString().split('T')[0],
          predictedBalance: Math.max(0, balance),
          income,
          expenses,
          type: balance < 0 ? 'expense' : income > 0 ? 'income' : 'balance'
        });
      }

      return predictions;
    } catch (error) {
      console.error('Error predicting cash flow:', error);
      return [];
    }
  },

  calculateAverageDailySpending(transactions: any[]): number {
    if (transactions.length === 0) return 15; // Default estimate

    const total = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const days = transactions.length > 0 ?
      (new Date().getTime() - new Date(transactions[transactions.length - 1].date).getTime()) / (1000 * 60 * 60 * 24) : 1;

    return Math.max(10, total / Math.max(1, days));
  },

  async calculateFinancialHealth(userId: string): Promise<FinancialHealth> {
    try {
      const predictions = await this.predictCashFlow(userId, 30);

      // Find crisis date (when balance hits 0)
      const crisisIndex = predictions.findIndex(p => p.predictedBalance <= 0);
      const crisisDate = crisisIndex >= 0 ? predictions[crisisIndex].date : null;
      const daysUntilCrisis = crisisIndex >= 0 ? crisisIndex : null;

      // Calculate health score (0-100)
      let score = 100;
      if (daysUntilCrisis !== null) {
        if (daysUntilCrisis < 7) score = 30;
        else if (daysUntilCrisis < 14) score = 50;
        else if (daysUntilCrisis < 21) score = 70;
        else score = 85;
      }

      // Generate recommendations
      const recommendations = this.generateRecommendations(predictions, daysUntilCrisis);

      return {
        score,
        crisisDate,
        daysUntilCrisis,
        recommendations
      };
    } catch (error) {
      console.error('Error calculating financial health:', error);
      return {
        score: 50,
        crisisDate: null,
        daysUntilCrisis: null,
        recommendations: []
      };
    }
  },

  generateRecommendations(predictions: CashFlowPrediction[], daysUntilCrisis: number | null): string[] {
    const recs: string[] = [];

    if (daysUntilCrisis !== null && daysUntilCrisis < 14) {
      recs.push(`⚠️ Crisis alert: You'll run out of money in ${daysUntilCrisis} days`);
      recs.push('Visit a food bank today to preserve your EBT balance');
      recs.push('Check eligibility for emergency assistance programs');
    }

    const avgBalance = predictions.reduce((sum, p) => sum + p.predictedBalance, 0) / predictions.length;

    if (avgBalance < 100) {
      recs.push('Consider gig work (DoorDash, Instacart) for extra income');
      recs.push('Apply for additional benefits - you may be missing WIC or TANF');
    }

    if (predictions.some(p => p.expenses > 20)) {
      recs.push('Switch to discount grocers (Aldi, Lidl) to save $80+/month');
    }

    return recs;
  },

  async getAIRecommendations(userId: string, predictions: CashFlowPrediction[], daysUntilCrisis: number | null): Promise<string> {
    try {
      // Build context for AI
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: ebt } = await supabase
        .from('ebt_accounts')
        .select('current_balance')
        .eq('user_id', userId)
        .single();

      const context: AgentContext = {
        fullName: profile?.full_name,
        householdSize: profile?.household_size,
        monthlyIncome: profile?.monthly_income,
        ebtBalance: ebt?.current_balance,
        location: profile?.location,
        childrenCount: profile?.children_count,
        crisisRisk: daysUntilCrisis !== null && daysUntilCrisis < 14 ? 'high' : daysUntilCrisis !== null && daysUntilCrisis < 21 ? 'medium' : 'low',
        daysUntilCrisis: daysUntilCrisis || undefined
      };

      // Ask AI for personalized recommendations
      const response = await financialPlanningAgent.analyze(
        `Based on my cash flow predictions showing I ${daysUntilCrisis !== null ? `will run out of money in ${daysUntilCrisis} days` : 'have stable finances for the next month'}, what specific actions should I take? Give me 3-5 concrete, actionable steps.`,
        context
      );

      return response.response;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return this.generateRecommendations(predictions, daysUntilCrisis).join('\n');
    }
  }
};
