// Financial Planning Agent - Handles budget planning, cash flow predictions, financial advice

import { BaseAgent } from './BaseAgent';
import { AgentContext, AgentResponse } from './types';

export class FinancialPlanningAgent extends BaseAgent {
  name = 'Financial Planning Agent';
  role = 'Financial Planning Specialist';
  description = 'Expert in budget planning, cash flow forecasting, and financial strategy for low-income families';

  protected keywords = [
    'budget', 'money', 'spending', 'cash flow', 'financial',
    'save', 'savings', 'expense', 'income', 'predict',
    'forecast', 'plan', 'afford', 'cost', 'price'
  ];

  async analyze(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);

      // Build a detailed financial context message
      let contextMessage = systemPrompt;

      // Add transaction data if available
      if (context.transactions && context.transactions.length > 0) {
        const recentTransactions = context.transactions.slice(0, 10);
        contextMessage += `\n\nRecent Transactions:\n`;
        recentTransactions.forEach(t => {
          contextMessage += `- ${t.date}: ${t.category} - $${t.amount} (${t.description || 'N/A'})\n`;
        });

        // Calculate spending by category
        const categoryTotals: Record<string, number> = {};
        context.transactions.forEach(t => {
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
        });

        contextMessage += `\nSpending by Category:\n`;
        Object.entries(categoryTotals).forEach(([category, total]) => {
          contextMessage += `- ${category}: $${total.toFixed(2)}\n`;
        });
      }

      // Create the AI query
      const messages = [
        {
          role: 'user' as const,
          content: `${contextMessage}\n\nUser Query: ${query}\n\nPlease provide specific, actionable financial advice. Include dollar amounts and timeframes where relevant.`
        }
      ];

      const aiResponse = await this.callAI(messages, context);

      return this.createResponse(
        aiResponse,
        0.9,
        [
          {
            type: 'financial-analysis',
            description: 'Analyzed financial situation and provided recommendations',
            data: { query, hasTransactions: !!context.transactions }
          }
        ],
        {
          agentType: 'financial-planning',
          hasTransactionData: !!context.transactions,
          transactionCount: context.transactions?.length || 0
        }
      );
    } catch (error) {
      console.error('Error in Financial Planning Agent:', error);

      // Fallback response
      return this.createResponse(
        this.getFallbackResponse(query, context),
        0.5,
        [],
        { fallback: true, error: error.message }
      );
    }
  }

  // Fallback when AI is unavailable
  private getFallbackResponse(query: string, context: AgentContext): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('budget') || lowerQuery.includes('spending')) {
      return `Based on your monthly income of $${context.monthlyIncome || 0}, here's a basic budget framework:

**Essential Needs (50-60%)**
- Housing: 30% = $${((context.monthlyIncome || 0) * 0.3).toFixed(2)}
- Food: 15% = $${((context.monthlyIncome || 0) * 0.15).toFixed(2)}
- Utilities: 10% = $${((context.monthlyIncome || 0) * 0.1).toFixed(2)}

**Immediate Steps:**
1. Track every expense for the next 7 days
2. Identify your top 3 spending categories
3. Look for ways to reduce discretionary spending by 10-15%

Would you like help finding resources to reduce specific expenses?`;
    }

    if (lowerQuery.includes('save') || lowerQuery.includes('savings')) {
      const suggestedSavings = Math.max(50, (context.monthlyIncome || 0) * 0.05);
      return `Even with a tight budget, building emergency savings is crucial. Here's a realistic plan:

**Savings Goal:** $${suggestedSavings.toFixed(2)}/month (5% of income)

**How to Find the Money:**
1. Round up every purchase to the nearest dollar - save the difference
2. Save any unexpected income (tax refunds, gifts, overtime)
3. Use cashback apps when shopping

**Emergency Fund Target:** $${(suggestedSavings * 6).toFixed(2)} (cover 1 month of essential expenses)

Start small - even $10/week builds up to $520/year!`;
    }

    return `I can help you with financial planning! I specialize in:
- Creating realistic budgets for low-income families
- Predicting cash flow and avoiding overdrafts
- Finding ways to save money on essential expenses
- Planning for emergencies

What specific financial concern can I help you with?`;
  }

  // Method specifically for cash flow prediction (used by services)
  async predictCashFlow(
    context: AgentContext,
    days: number = 30
  ): Promise<{ predictions: any[]; crisisDate?: Date; analysis: string }> {
    try {
      const query = `Analyze my financial situation and predict my cash flow for the next ${days} days.
      Identify any potential crisis points where I might run out of money.
      Be specific about dates and amounts.`;

      const response = await this.analyze(query, context);

      // Parse the response for crisis detection
      // This is a simplified version - in production, you'd use structured output
      const hasCrisis = response.response.toLowerCase().includes('crisis') ||
                       response.response.toLowerCase().includes('run out') ||
                       response.response.toLowerCase().includes('shortfall');

      return {
        predictions: [], // Would be populated with detailed daily predictions
        crisisDate: hasCrisis ? new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) : undefined,
        analysis: response.response
      };
    } catch (error) {
      console.error('Error predicting cash flow:', error);
      return {
        predictions: [],
        analysis: 'Unable to generate detailed cash flow prediction at this time.'
      };
    }
  }
}

// Export singleton instance
export const financialPlanningAgent = new FinancialPlanningAgent();
