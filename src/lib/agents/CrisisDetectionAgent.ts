// Crisis Detection Agent - Monitors for financial emergencies and government shutdowns

import { BaseAgent } from './BaseAgent';
import { AgentContext, AgentResponse } from './types';

export class CrisisDetectionAgent extends BaseAgent {
  name = 'Crisis Detection Agent';
  role = 'Financial Crisis Early Warning System';
  description = 'Expert in detecting financial crises, government shutdown risks, and emergency situations for low-income families';

  protected keywords = [
    'crisis', 'emergency', 'shutdown', 'risk', 'warning',
    'threat', 'danger', 'alert', 'urgent', 'critical',
    'overdraft', 'eviction', 'cutoff', 'late', 'due'
  ];

  async analyze(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);

      // Add crisis-specific context
      let crisisContext = systemPrompt;

      if (context.daysUntilCrisis !== undefined) {
        crisisContext += `\n\nCRITICAL: User will run out of money in ${context.daysUntilCrisis} days!`;
      }

      if (context.crisisRisk) {
        crisisContext += `\nCurrent Crisis Risk Level: ${context.crisisRisk.toUpperCase()}`;
      }

      const messages = [
        {
          role: 'user' as const,
          content: `${crisisContext}\n\nUser Query: ${query}\n\nAnalyze the financial crisis risk and provide immediate, actionable steps to prevent or mitigate the crisis. Be specific about deadlines and dollar amounts.`
        }
      ];

      const aiResponse = await this.callAI(messages, context);

      return this.createResponse(
        aiResponse,
        context.daysUntilCrisis && context.daysUntilCrisis < 7 ? 1.0 : 0.85,
        [
          {
            type: 'crisis-analysis',
            description: 'Analyzed financial crisis risk and provided mitigation plan',
            data: {
              query,
              daysUntilCrisis: context.daysUntilCrisis,
              crisisRisk: context.crisisRisk
            }
          }
        ],
        {
          agentType: 'crisis-detection',
          severity: context.daysUntilCrisis && context.daysUntilCrisis < 7 ? 'high' :
                    context.daysUntilCrisis && context.daysUntilCrisis < 14 ? 'medium' : 'low'
        }
      );
    } catch (error) {
      console.error('Error in Crisis Detection Agent:', error);

      return this.createResponse(
        this.getFallbackResponse(query, context),
        0.6,
        [],
        { fallback: true, error: error.message }
      );
    }
  }

  private getFallbackResponse(query: string, context: AgentContext): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('shutdown') || lowerQuery.includes('government')) {
      return `Government Shutdown Risk Alert:\n\n**Current Status:** Monitoring active\n**Your Exposure:** ${context.ebtBalance ? `High - You receive $${context.ebtBalance} in SNAP benefits` : 'Moderate'}\n\n**Immediate Actions:**\n1. Stock up on 2 weeks of essentials NOW\n2. Identify 3 food banks in your area\n3. Apply for any missing benefits BEFORE shutdown\n4. Build a $100 emergency buffer if possible\n\n**Timeline:** Act within the next 7 days to be prepared.`;
    }

    if (context.daysUntilCrisis !== undefined && context.daysUntilCrisis < 7) {
      return `🚨 CRISIS ALERT: You have ${context.daysUntilCrisis} days until you run out of money!\n\n**Immediate Actions (Do TODAY):**\n1. Visit food bank to preserve cash (saves $30-50)\n2. Call 211 for emergency assistance\n3. Apply for gig work (DoorDash, Instacart) - earn $50+ this week\n4. Contact utility companies to delay payments\n\n**Emergency Resources:**\n- Food banks: Open until 5pm today\n- Emergency rent assistance: Call your local Community Action Agency\n- Crisis hotline: 211 (free, 24/7)\n\nDo NOT wait - act now to prevent this crisis.`;
    }

    return `I monitor your finances 24/7 for potential crises:\n\n**Current Status:** ${context.crisisRisk === 'high' ? '⚠️ HIGH RISK' : context.crisisRisk === 'medium' ? '⚡ MODERATE RISK' : '✅ STABLE'}\n\n**What I'm Watching:**\n- Cash flow predictions (next 30 days)\n- Government shutdown risks\n- Bill payment deadlines\n- Emergency fund levels\n\nI'll alert you immediately if I detect any threats to your financial security.`;
  }

  // Method specifically for government shutdown monitoring
  async monitorGovernmentShutdown(
    context: AgentContext
  ): Promise<{ risk: 'low' | 'medium' | 'high'; message: string; deadline?: string }> {
    try {
      const query = "What is the current government shutdown risk and how will it affect me?";
      const response = await this.analyze(query, context);

      // Parse response for risk level
      const content = response.response.toLowerCase();
      const risk = content.includes('high risk') ? 'high' :
                   content.includes('moderate') || content.includes('medium') ? 'medium' : 'low';

      return {
        risk,
        message: response.response,
        deadline: this.extractDeadline(response.response)
      };
    } catch (error) {
      console.error('Error monitoring shutdown:', error);
      return {
        risk: 'low',
        message: 'Unable to assess shutdown risk at this time.'
      };
    }
  }

  private extractDeadline(text: string): string | undefined {
    // Simple deadline extraction (could be enhanced)
    const deadlineMatch = text.match(/(\w+ \d+,? \d{4})/);
    return deadlineMatch ? deadlineMatch[0] : undefined;
  }
}

// Export singleton instance
export const crisisDetectionAgent = new CrisisDetectionAgent();
