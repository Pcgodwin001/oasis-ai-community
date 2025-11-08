import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          location: string | null;
          zip_code: string | null;
          household_size: number | null;
          monthly_income: number | null;
          children_count: number | null;
          has_elderly: boolean | null;
          has_disabled: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          location?: string | null;
          zip_code?: string | null;
          household_size?: number | null;
          monthly_income?: number | null;
          children_count?: number | null;
          has_elderly?: boolean | null;
          has_disabled?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          location?: string | null;
          zip_code?: string | null;
          household_size?: number | null;
          monthly_income?: number | null;
          children_count?: number | null;
          has_elderly?: boolean | null;
          has_disabled?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: string;
          lat: number;
          lng: number;
          phone: string | null;
          hours: string | null;
          services: string[] | null;
          rating: number | null;
          review_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          address: string;
          lat: number;
          lng: number;
          phone?: string | null;
          hours?: string | null;
          services?: string[] | null;
          rating?: number | null;
          review_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          address?: string;
          lat?: number;
          lng?: number;
          phone?: string | null;
          hours?: string | null;
          services?: string[] | null;
          rating?: number | null;
          review_count?: number | null;
          created_at?: string;
        };
      };
      eligibility_results: {
        Row: {
          id: string;
          user_id: string;
          snap_eligible: boolean;
          snap_amount: number | null;
          wic_eligible: boolean;
          wic_amount: number | null;
          tanf_eligible: boolean;
          tanf_amount: number | null;
          eitc_eligible: boolean;
          eitc_amount: number | null;
          liheap_eligible: boolean;
          liheap_amount: number | null;
          total_monthly: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          snap_eligible: boolean;
          snap_amount?: number | null;
          wic_eligible: boolean;
          wic_amount?: number | null;
          tanf_eligible: boolean;
          tanf_amount?: number | null;
          eitc_eligible: boolean;
          eitc_amount?: number | null;
          liheap_eligible: boolean;
          liheap_amount?: number | null;
          total_monthly: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          snap_eligible?: boolean;
          snap_amount?: number | null;
          wic_eligible?: boolean;
          wic_amount?: number | null;
          tanf_eligible?: boolean;
          tanf_amount?: number | null;
          eitc_eligible?: boolean;
          eitc_amount?: number | null;
          liheap_eligible?: boolean;
          liheap_amount?: number | null;
          total_monthly?: number;
          created_at?: string;
        };
      };
      ebt_accounts: {
        Row: {
          id: string;
          user_id: string;
          card_last_four: string | null;
          state: string | null;
          current_balance: number;
          refill_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_last_four?: string | null;
          state?: string | null;
          current_balance: number;
          refill_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_last_four?: string | null;
          state?: string | null;
          current_balance?: number;
          refill_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          ebt_account_id: string | null;
          date: string;
          merchant: string;
          category: string;
          amount: number;
          balance_after: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ebt_account_id?: string | null;
          date: string;
          merchant: string;
          category: string;
          amount: number;
          balance_after: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ebt_account_id?: string | null;
          date?: string;
          merchant?: string;
          category?: string;
          amount?: number;
          balance_after?: number;
          created_at?: string;
        };
      };
    };
  };
};
