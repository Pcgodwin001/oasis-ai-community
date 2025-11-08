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
      budget_entries: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          type: 'income' | 'expense';
          date: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          amount: number;
          type: 'income' | 'expense';
          date: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          amount?: number;
          type?: 'income' | 'expense';
          date?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      job_listings: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          pay_rate: string;
          type: string;
          description: string | null;
          requirements: string[] | null;
          posted_date: string | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location: string;
          pay_rate: string;
          type: string;
          description?: string | null;
          requirements?: string[] | null;
          posted_date?: string | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          location?: string;
          pay_rate?: string;
          type?: string;
          description?: string | null;
          requirements?: string[] | null;
          posted_date?: string | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          status: string | null;
          applied_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          status?: string | null;
          applied_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          status?: string | null;
          applied_at?: string | null;
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          author_name: string;
          content: string;
          category: string;
          likes_count: number;
          comments_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author_name: string;
          content: string;
          category: string;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          author_name?: string;
          content?: string;
          category?: string;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          author_name?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
};
