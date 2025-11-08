export interface UserProfile {
  id: string;
  fullName: string | null;
  location: string | null;
  zipCode: string | null;
  householdSize: number | null;
  monthlyIncome: number | null;
  childrenCount: number | null;
  hasElderly: boolean | null;
  hasDisabled: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Resource {
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
  reviewCount: number | null;
  distance?: number; // Calculated field
}

export interface EligibilityResult {
  id: string;
  userId: string;
  snapEligible: boolean;
  snapAmount: number | null;
  wicEligible: boolean;
  wicAmount: number | null;
  tanfEligible: boolean;
  tanfAmount: number | null;
  eitcEligible: boolean;
  eitcAmount: number | null;
  liheapEligible: boolean;
  liheapAmount: number | null;
  totalMonthly: number;
  createdAt: string;
}

export interface EBTAccount {
  id: string;
  userId: string;
  cardLastFour: string | null;
  state: string | null;
  currentBalance: number;
  refillDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  ebtAccountId: string | null;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export interface CashFlowPrediction {
  date: string;
  predictedBalance: number;
  income: number;
  expenses: number;
  type: 'income' | 'expense' | 'balance';
}

export interface FinancialHealth {
  score: number; // 0-100
  crisisDate: string | null; // Date when balance hits $0
  daysUntilCrisis: number | null;
  recommendations: string[];
}
