// Base Agent Class for Oasis AI System

import { Agent, AgentContext, AgentResponse } from './types';
import { sendChatMessage, Message as ChatMessage } from '../ai';

export abstract class BaseAgent implements Agent {
  abstract name: string;
  abstract role: string;
  abstract description: string;

  // Keywords that this agent should respond to
  protected abstract keywords: string[];

  // Default implementation: check if query contains any keywords
  async canHandle(query: string, context: AgentContext): Promise<boolean> {
    const lowerQuery = query.toLowerCase();
    return this.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));
  }

  // Abstract method that each agent must implement
  abstract analyze(query: string, context: AgentContext): Promise<AgentResponse>;

  // Helper method to call AI with agent-specific context
  protected async callAI(
    messages: ChatMessage[],
    context: AgentContext,
    additionalContext?: string
  ): Promise<string> {
    // Build enhanced user context
    const enhancedContext = {
      ...context,
      agentRole: this.role,
      agentDescription: this.description,
    };

    try {
      const response = await sendChatMessage(messages, enhancedContext);
      return response;
    } catch (error) {
      console.error(`Error in ${this.name}:`, error);
      throw error;
    }
  }

  // Helper to build system prompt for this agent
  protected buildSystemPrompt(context: AgentContext): string {
    let prompt = `You are a specialist AI agent with the following role:\n\nROLE: ${this.role}\n\nDESCRIPTION: ${this.description}\n\n`;

    // Add context information
    if (context.fullName) prompt += `User: ${context.fullName}\n`;
    if (context.householdSize) prompt += `Household Size: ${context.householdSize} people\n`;
    if (context.monthlyIncome) prompt += `Monthly Income: $${context.monthlyIncome}\n`;
    if (context.ebtBalance !== undefined) prompt += `EBT Balance: $${context.ebtBalance}\n`;

    // Add financial health if available
    if (context.financialHealth) {
      prompt += `\nFinancial Health Score: ${context.financialHealth}/100\n`;
    }

    // Add crisis information if available
    if (context.crisisRisk) {
      prompt += `Crisis Risk: ${context.crisisRisk}\n`;
      if (context.daysUntilCrisis) {
        prompt += `Days Until Crisis: ${context.daysUntilCrisis}\n`;
      }
    }

    prompt += `\nProvide specific, actionable advice based on your expertise. Focus on immediate, practical steps the user can take.`;

    return prompt;
  }

  // Helper to create a response
  protected createResponse(
    response: string,
    confidence: number = 0.8,
    actions: any[] = [],
    metadata: Record<string, any> = {}
  ): AgentResponse {
    return {
      agentName: this.name,
      confidence,
      response,
      actions,
      metadata,
    };
  }
}
