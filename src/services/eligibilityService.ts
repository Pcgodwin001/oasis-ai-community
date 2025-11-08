import { supabase } from '../lib/supabase';
import type { EligibilityResult } from '../types';

// 2024 Federal Poverty Level for 48 contiguous states
const POVERTY_LEVELS: { [key: number]: number } = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720
};

export const eligibilityService = {
  async calculateEligibility(
    userId: string,
    householdSize: number,
    monthlyIncome: number,
    childrenCount: number = 0,
    hasPregnantWoman: boolean = false
  ): Promise<EligibilityResult> {
    const annualIncome = monthlyIncome * 12;
    const povertyLevel = POVERTY_LEVELS[Math.min(householdSize, 8)] || 52720 + (householdSize - 8) * 5380;

    // SNAP Eligibility (130% of poverty level)
    const snapEligible = annualIncome <= povertyLevel * 1.30;
    const snapAmount = snapEligible ? this.calculateSNAPBenefit(householdSize, monthlyIncome) : 0;

    // WIC Eligibility (185% of poverty level, must have children under 5 or be pregnant)
    const wicEligible = (annualIncome <= povertyLevel * 1.85) &&
                        (childrenCount > 0 || hasPregnantWoman);
    const wicAmount = wicEligible ? this.calculateWICBenefit(childrenCount) : 0;

    // TANF Eligibility (varies by state, using 50% poverty as estimate)
    const tanfEligible = (annualIncome <= povertyLevel * 0.50) && childrenCount > 0;
    const tanfAmount = tanfEligible ? this.calculateTANFBenefit(householdSize) : 0;

    // EITC Eligibility (more complex, simplified here)
    const eitcEligible = annualIncome <= 60000 && monthlyIncome > 0;
    const eitcAmount = eitcEligible ? this.calculateEITCBenefit(childrenCount, annualIncome) / 12 : 0;

    // LIHEAP Eligibility (150% of poverty level)
    const liheapEligible = annualIncome <= povertyLevel * 1.50;
    const liheapAmount = liheapEligible ? this.calculateLIHEAPBenefit() : 0;

    const totalMonthly = snapAmount + wicAmount + tanfAmount + eitcAmount + liheapAmount;

    const result: EligibilityResult = {
      id: '', // Will be set by database
      userId,
      snapEligible,
      snapAmount,
      wicEligible,
      wicAmount,
      tanfEligible,
      tanfAmount,
      eitcEligible,
      eitcAmount,
      liheapEligible,
      liheapAmount,
      totalMonthly,
      createdAt: new Date().toISOString()
    };

    // Save to database
    try {
      await supabase.from('eligibility_results').insert({
        user_id: userId,
        snap_eligible: snapEligible,
        snap_amount: snapAmount,
        wic_eligible: wicEligible,
        wic_amount: wicAmount,
        tanf_eligible: tanfEligible,
        tanf_amount: tanfAmount,
        eitc_eligible: eitcEligible,
        eitc_amount: eitcAmount,
        liheap_eligible: liheapEligible,
        liheap_amount: liheapAmount,
        total_monthly: totalMonthly
      });
    } catch (error) {
      console.error('Error saving eligibility results:', error);
    }

    return result;
  },

  calculateSNAPBenefit(householdSize: number, monthlyIncome: number): number {
    // Max SNAP benefits for 2024
    const maxBenefits: { [key: number]: number } = {
      1: 291,
      2: 535,
      3: 766,
      4: 973,
      5: 1155,
      6: 1386,
      7: 1532,
      8: 1751
    };

    const maxBenefit = maxBenefits[Math.min(householdSize, 8)] || 1751 + (householdSize - 8) * 219;

    // Simplified calculation: reduce by 30% of net income
    const netIncome = Math.max(0, monthlyIncome - 193); // Standard deduction
    const benefit = Math.max(0, maxBenefit - (netIncome * 0.3));

    return Math.round(benefit);
  },

  calculateWICBenefit(childrenCount: number): number {
    // Average WIC benefit per person per month
    const perPersonBenefit = 50;
    return Math.min(childrenCount, 3) * perPersonBenefit; // Max 3 children typically
  },

  calculateTANFBenefit(householdSize: number): number {
    // National average TANF benefits (varies widely by state)
    const baseBenefit = 450;
    return baseBenefit + (householdSize - 2) * 100;
  },

  calculateEITCBenefit(childrenCount: number, annualIncome: number): number {
    // Simplified EITC calculation for 2024
    const maxCredits: { [key: number]: number } = {
      0: 632,
      1: 4213,
      2: 6960,
      3: 7830
    };

    const maxCredit = maxCredits[Math.min(childrenCount, 3)] || 7830;

    // Phase out starts at different income levels
    if (annualIncome > 50000) {
      return Math.max(0, maxCredit * (1 - (annualIncome - 50000) / 20000));
    }

    return maxCredit;
  },

  calculateLIHEAPBenefit(): number {
    // Average monthly LIHEAP benefit (typically annual, divided by 12)
    return Math.round(800 / 12); // ~$67/month
  },

  async getLatestEligibility(userId: string): Promise<EligibilityResult | null> {
    try {
      const { data, error } = await supabase
        .from('eligibility_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        snapEligible: data.snap_eligible,
        snapAmount: data.snap_amount,
        wicEligible: data.wic_eligible,
        wicAmount: data.wic_amount,
        tanfEligible: data.tanf_eligible,
        tanfAmount: data.tanf_amount,
        eitcEligible: data.eitc_eligible,
        eitcAmount: data.eitc_amount,
        liheapEligible: data.liheap_eligible,
        liheapAmount: data.liheap_amount,
        totalMonthly: data.total_monthly,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error fetching eligibility:', error);
      return null;
    }
  }
};
