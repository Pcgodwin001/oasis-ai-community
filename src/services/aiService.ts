import { supabase } from '../lib/supabase';
import { sendChatMessage, type Message, type UserContext } from '../lib/ai';
import type { ChatMessage } from '../types';

export const aiService = {
  async sendMessage(
    userId: string,
    conversationId: string,
    message: string,
    userContext?: UserContext
  ): Promise<string> {
    try {
      // Save user message
      await this.saveMessage(userId, conversationId, 'user', message);

      // Get conversation history
      const history = await this.getConversationHistory(conversationId);

      // Send to AI
      const response = await sendChatMessage(history, userContext);

      // Save AI response
      await this.saveMessage(userId, conversationId, 'assistant', response);

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async saveMessage(
    userId: string,
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<void> {
    try {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        conversation_id: conversationId,
        role,
        content
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  },

  async getConversationHistory(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  },

  async getUserContextForAI(userId: string): Promise<UserContext> {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get EBT balance
      const { data: ebt } = await supabase
        .from('ebt_accounts')
        .select('current_balance')
        .eq('user_id', userId)
        .single();

      return {
        fullName: profile?.full_name || undefined,
        householdSize: profile?.household_size || undefined,
        monthlyIncome: profile?.monthly_income || undefined,
        ebtBalance: ebt?.current_balance || undefined,
        location: profile?.location || undefined,
        childrenCount: profile?.children_count || undefined
      };
    } catch (error) {
      console.error('Error fetching user context:', error);
      return {};
    }
  }
};
