// Agent Framework Types for Oasis AI System

import { UserContext } from '../ai';

export interface AgentContext extends UserContext {
  // Transaction history
  transactions?: Transaction[];

  // Financial metrics
  financialHealth?: number;
  crisisRisk?: string;
  daysUntilCrisis?: number;

  // EBT and benefits
  ebtTransactions?: EBTTransaction[];
  benefitsReceived?: string[];

  // User preferences and history
  conversationHistory?: Message[];
  previousRecommendations?: Recommendation[];
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

export interface EBTTransaction {
  id: string;
  amount: number;
  vendor: string;
  date: Date;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Recommendation {
  id: string;
  type: string;
  content: string;
  implemented: boolean;
  createdAt: Date;
}

export interface AgentResponse {
  agentName: string;
  confidence: number; // 0-1
  response: string;
  actions?: AgentAction[];
  metadata?: Record<string, any>;
}

export interface AgentAction {
  type: string;
  description: string;
  data?: any;
}

export interface Agent {
  name: string;
  role: string;
  description: string;

  // Determine if this agent can handle the query
  canHandle(query: string, context: AgentContext): Promise<boolean>;

  // Analyze and generate response
  analyze(query: string, context: AgentContext): Promise<AgentResponse>;
}

export type AgentType =
  | 'orchestrator'
  | 'financial-planning'
  | 'crisis-detection'
  | 'resource-discovery'
  | 'eligibility-optimizer'
  | 'shopping-optimizer'
  | 'income-finder';
