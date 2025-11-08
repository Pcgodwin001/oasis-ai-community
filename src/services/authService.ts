import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export const authService = {
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          full_name: fullName
        });
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, session: null, error: error as Error };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, session: null, error: error as Error };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as Error };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as Error };
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.user ?? null);
      }
    );
    return subscription;
  }
};
