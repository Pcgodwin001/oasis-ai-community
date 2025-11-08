import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

export const userService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data ? {
        id: data.id,
        fullName: data.full_name,
        location: data.location,
        zipCode: data.zip_code,
        householdSize: data.household_size,
        monthlyIncome: data.monthly_income,
        childrenCount: data.children_count,
        hasElderly: data.has_elderly,
        hasDisabled: data.has_disabled,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } : null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: updates.fullName,
          location: updates.location,
          zip_code: updates.zipCode,
          household_size: updates.householdSize,
          monthly_income: updates.monthlyIncome,
          children_count: updates.childrenCount,
          has_elderly: updates.hasElderly,
          has_disabled: updates.hasDisabled
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  async createProfile(profile: Partial<UserProfile> & { id: string }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: profile.id,
          full_name: profile.fullName,
          location: profile.location,
          zip_code: profile.zipCode,
          household_size: profile.householdSize,
          monthly_income: profile.monthlyIncome,
          children_count: profile.childrenCount,
          has_elderly: profile.hasElderly,
          has_disabled: profile.hasDisabled
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  }
};
