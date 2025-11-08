import { supabase } from '../lib/supabase';
import type { EBTAccount, Transaction } from '../types';
import {
  validateEBTCredentials,
  getCardLastFour,
  validateEBTCardNumber,
  validatePIN,
  formatCardNumber
} from '../lib/encryption';
import { mockCheckEBTBalance, mockRefreshBalance, generateMockEBTAccount } from '../lib/mockEBTData';

// Enable/disable mock mode (set to false to use real scraper)
const USE_MOCK_DATA = true; // For hackathon demo

export const ebtService = {
  async getEBTAccount(userId: string): Promise<EBTAccount | null> {
    try {
      const { data, error } = await supabase
        .from('ebt_accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        cardLastFour: data.card_last_four,
        state: data.state,
        currentBalance: data.current_balance,
        refillDate: data.refill_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching EBT account:', error);
      return null;
    }
  },

  async createOrUpdateEBTAccount(
    userId: string,
    balance: number,
    cardLastFour?: string,
    state?: string
  ): Promise<boolean> {
    try {
      // Calculate next refill date (1st of next month)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);

      const { data: existing } = await supabase
        .from('ebt_accounts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from('ebt_accounts')
          .update({
            current_balance: balance,
            card_last_four: cardLastFour,
            state: state,
            refill_date: nextMonth.toISOString().split('T')[0]
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('ebt_accounts')
          .insert({
            user_id: userId,
            current_balance: balance,
            card_last_four: cardLastFour,
            state: state,
            refill_date: nextMonth.toISOString().split('T')[0]
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error creating/updating EBT account:', error);
      return false;
    }
  },

  async getTransactions(userId: string, limit: number = 30): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(t => ({
        id: t.id,
        userId: t.user_id,
        ebtAccountId: t.ebt_account_id,
        date: t.date,
        merchant: t.merchant,
        category: t.category,
        amount: t.amount,
        balanceAfter: t.balance_after,
        createdAt: t.created_at
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  async addTransaction(
    userId: string,
    ebtAccountId: string,
    transaction: {
      date: string;
      merchant: string;
      category: string;
      amount: number;
      balanceAfter: number;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          ebt_account_id: ebtAccountId,
          date: transaction.date,
          merchant: transaction.merchant,
          category: transaction.category,
          amount: transaction.amount,
          balance_after: transaction.balanceAfter
        });

      if (error) throw error;

      // Update EBT account balance
      await supabase
        .from('ebt_accounts')
        .update({ current_balance: transaction.balanceAfter })
        .eq('id', ebtAccountId);

      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  },

  async seedDemoTransactions(userId: string, ebtAccountId: string, currentBalance: number): Promise<void> {
    const demoTransactions = [
      { merchant: "Walmart Supercenter", category: "Groceries", amount: -45.32, daysAgo: 1 },
      { merchant: "Target", category: "Household", amount: -23.15, daysAgo: 3 },
      { merchant: "Kroger", category: "Groceries", amount: -67.88, daysAgo: 5 },
      { merchant: "CVS Pharmacy", category: "Personal Care", amount: -12.45, daysAgo: 7 },
      { merchant: "Aldi", category: "Groceries", amount: -34.20, daysAgo: 9 },
      { merchant: "Dollar General", category: "Household", amount: -18.99, daysAgo: 11 },
      { merchant: "Walmart Supercenter", category: "Groceries", amount: -52.67, daysAgo: 13 },
      { merchant: "Publix", category: "Groceries", amount: -41.53, daysAgo: 15 }
    ];

    let balance = currentBalance;

    for (const trans of demoTransactions) {
      balance -= trans.amount; // amount is negative, so this subtracts

      const date = new Date();
      date.setDate(date.getDate() - trans.daysAgo);

      await this.addTransaction(userId, ebtAccountId, {
        date: date.toISOString().split('T')[0],
        merchant: trans.merchant,
        category: trans.category,
        amount: trans.amount,
        balanceAfter: balance
      });
    }
  },

  /**
   * Add EBT card with credentials (securely)
   * For demo: validates credentials and generates mock data
   * For production: would send to edge function for encryption and real scraping
   */
  async addEBTCard(
    userId: string,
    cardNumber: string,
    pin: string,
    state: string,
    householdSize: number = 1
  ): Promise<{ success: boolean; error?: string; accountId?: string }> {
    try {
      // Validate credentials
      const validation = validateEBTCredentials(cardNumber, pin);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Get user profile for household size if not provided
      if (!householdSize) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('household_size')
          .eq('id', userId)
          .single();

        householdSize = profile?.household_size || 1;
      }

      if (USE_MOCK_DATA) {
        // Demo mode: use mock data
        const mockAccount = await mockCheckEBTBalance(cardNumber, pin, householdSize, state);

        // Save to database
        const success = await this.createOrUpdateEBTAccount(
          userId,
          mockAccount.currentBalance,
          mockAccount.cardLastFour,
          mockAccount.state
        );

        if (!success) {
          return { success: false, error: 'Failed to save EBT account' };
        }

        // Get the saved account ID
        const { data: account } = await supabase
          .from('ebt_accounts')
          .select('id')
          .eq('user_id', userId)
          .single();

        // Save transactions
        if (account) {
          for (const trans of mockAccount.transactions) {
            await this.addTransaction(userId, account.id, {
              date: trans.date,
              merchant: trans.merchant,
              category: trans.category,
              amount: trans.amount,
              balanceAfter: trans.balanceAfter
            });
          }
        }

        return {
          success: true,
          accountId: account?.id
        };
      } else {
        // Production mode: call edge function for real scraping
        // TODO: Implement edge function call
        return {
          success: false,
          error: 'Real EBT scraping not yet implemented. Enable USE_MOCK_DATA for demo.'
        };
      }
    } catch (error) {
      console.error('Error adding EBT card:', error);
      return {
        success: false,
        error: error.message || 'Failed to add EBT card'
      };
    }
  },

  /**
   * Refresh EBT balance and transactions
   * For demo: updates mock data
   * For production: would call scraper again
   */
  async refreshBalance(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const account = await this.getEBTAccount(userId);
      if (!account) {
        return { success: false, error: 'No EBT account found' };
      }

      if (USE_MOCK_DATA) {
        // Get user's household size
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('household_size')
          .eq('id', userId)
          .single();

        const householdSize = profile?.household_size || 1;

        // Generate new mock account data
        const mockAccount = generateMockEBTAccount(householdSize, account.state);

        // Update balance
        await this.createOrUpdateEBTAccount(
          userId,
          mockAccount.currentBalance,
          account.cardLastFour,
          account.state
        );

        // Clear old transactions and add new ones
        await supabase
          .from('transactions')
          .delete()
          .eq('user_id', userId);

        const { data: updatedAccount } = await supabase
          .from('ebt_accounts')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (updatedAccount) {
          for (const trans of mockAccount.transactions) {
            await this.addTransaction(userId, updatedAccount.id, {
              date: trans.date,
              merchant: trans.merchant,
              category: trans.category,
              amount: trans.amount,
              balanceAfter: trans.balanceAfter
            });
          }
        }

        return { success: true };
      } else {
        // Production mode: call edge function
        return {
          success: false,
          error: 'Real EBT scraping not yet implemented'
        };
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
      return {
        success: false,
        error: error.message || 'Failed to refresh balance'
      };
    }
  },

  /**
   * Validate card credentials without saving
   * Useful for "test connection" before adding card
   */
  async validateCardCredentials(
    cardNumber: string,
    pin: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    return validateEBTCredentials(cardNumber, pin);
  },

  /**
   * Remove EBT card from account
   */
  async removeEBTCard(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete transactions first (foreign key constraint)
      await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId);

      // Delete EBT account
      const { error } = await supabase
        .from('ebt_accounts')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error removing EBT card:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove EBT card'
      };
    }
  },

  /**
   * Get formatted card number for display
   */
  getFormattedCardNumber(cardNumber: string, showFull: boolean = false): string {
    return formatCardNumber(cardNumber, showFull);
  }
};
