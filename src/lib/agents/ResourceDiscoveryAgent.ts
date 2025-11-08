// Resource Discovery Agent - Finds food banks, jobs, benefits, and community resources

import { BaseAgent } from './BaseAgent';
import { AgentContext, AgentResponse } from './types';

export class ResourceDiscoveryAgent extends BaseAgent {
  name = 'Resource Discovery Agent';
  role = 'Community Resource Specialist';
  description = 'Expert in finding food banks, job opportunities, government benefits, and community resources for low-income families';

  protected keywords = [
    'resource', 'food bank', 'pantry', 'job', 'work', 'benefit',
    'assistance', 'help', 'support', 'program', 'service',
    'nearby', 'near me', 'find', 'locate', 'where'
  ];

  async analyze(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);

      // Add resource-specific context
      let resourceContext = systemPrompt;

      if (context.location) {
        resourceContext += `\n\nUser Location: ${context.location}`;
        resourceContext += `\nProvide resources within 5 miles of this location when possible.`;
      }

      resourceContext += `\n\nFocus on immediate, accessible resources that are free or low-cost.`;

      const messages = [
        {
          role: 'user' as const,
          content: `${resourceContext}\n\nUser Query: ${query}\n\nProvide specific, actionable resources with addresses, phone numbers, and hours when possible. Prioritize resources that are open TODAY and within their area.`
        }
      ];

      const aiResponse = await this.callAI(messages, context);

      return this.createResponse(
        aiResponse,
        0.85,
        [
          {
            type: 'resource-search',
            description: 'Found community resources based on user needs',
            data: { query, location: context.location }
          }
        ],
        {
          agentType: 'resource-discovery',
          hasLocation: !!context.location
        }
      );
    } catch (error) {
      console.error('Error in Resource Discovery Agent:', error);

      return this.createResponse(
        this.getFallbackResponse(query, context),
        0.5,
        [],
        { fallback: true, error: error.message }
      );
    }
  }

  private getFallbackResponse(query: string, context: AgentContext): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('food') || lowerQuery.includes('pantry') || lowerQuery.includes('bank')) {
      return `**Food Resources ${context.location ? `Near ${context.location}` : ''}:**\n\n1. **Call 211** - Free, 24/7 hotline to find food banks near you\n2. **Feeding America** - Visit feedingamerica.org to find local food banks\n3. **SNAP/EBT** - ${context.ebtBalance !== undefined ? `Your current balance: $${context.ebtBalance}` : 'Apply at your local DHHS office'}\n\n**Emergency Food Today:**\n- Most food banks open 9am-5pm weekdays\n- No income verification needed\n- Bring ID and proof of address\n- Some offer delivery for homebound individuals\n\n**Next Steps:**\n1. Call 211 now to get addresses and hours\n2. Visit today before 5pm if possible\n3. Ask about weekly vs monthly pickup schedules`;
    }

    if (lowerQuery.includes('job') || lowerQuery.includes('work') || lowerQuery.includes('income') || lowerQuery.includes('earn')) {
      return `**Quick Income Opportunities:**\n\n**Start TODAY:**\n1. **DoorDash** - Earn $15-25/hour, flexible schedule\n   - Sign up: doordash.com/dasher\n   - Start within 24-48 hours\n2. **Instacart** - Shop for groceries, $12-20/hour\n   - Apply: instacart.com/shoppers\n   - Same-day approval possible\n3. **TaskRabbit** - Handyman tasks, $20-40/hour\n   - Sign up: taskrabbit.com\n\n**Warehouse/Retail:**\n- Amazon: $18/hour starting\n- Target: $15/hour\n- Walmart: $14/hour\n\n**With Children:**\n- Work from home customer service: $12-16/hour\n- Evening/weekend shifts while partner watches kids\n\n**Next Step:** Apply to 2-3 gig apps TODAY to start earning this week.`;
    }

    if (lowerQuery.includes('benefit') || lowerQuery.includes('program') || lowerQuery.includes('eligible') || lowerQuery.includes('qualify')) {
      return `**Benefits You May Be Missing:**\n\n**Check Eligibility for:**\n1. **SNAP/Food Stamps** - Up to ${context.householdSize ? `$${this.estimateSNAP(context.householdSize)}/month for household of ${context.householdSize}` : '$500+/month'}\n2. **WIC** - ${context.childrenCount && context.childrenCount > 0 ? `$${context.childrenCount * 50}/month for your ${context.childrenCount} child(ren)` : 'If you have young children or are pregnant'}\n3. **EITC Tax Credit** - ${context.monthlyIncome ? `Up to $${this.estimateEITC(context.childrenCount || 0, context.monthlyIncome * 12)}/year` : 'Up to $7,000+/year'}\n4. **LIHEAP** - Help with heating/cooling bills (~$800/year)\n5. **Lifeline** - Free/discounted phone service\n\n**Apply Today:**\n- Visit benefits.gov for eligibility screening\n- Call 211 for application assistance\n- Visit local DHHS office (bring ID, proof of income, utility bill)\n\n**Timeline:** Most applications process in 7-30 days.`;
    }

    return `I can help you find:\n\n**Food Resources:**\n- Food banks and pantries near you\n- Meal programs and soup kitchens\n- SNAP/EBT balance and benefits\n\n**Income Opportunities:**\n- Gig work (start earning today)\n- Part-time and full-time jobs\n- Work-from-home options\n\n**Government Benefits:**\n- SNAP, WIC, TANF eligibility\n- Tax credits (EITC, CTC)\n- Utility assistance (LIHEAP)\n\n**Community Support:**\n- Emergency financial assistance\n- Legal aid and advocacy\n- Healthcare resources\n\nWhat type of resource do you need most urgently?`;
  }

  private estimateSNAP(householdSize: number): number {
    const maxBenefits: { [key: number]: number } = {
      1: 291, 2: 535, 3: 766, 4: 973, 5: 1155
    };
    return maxBenefits[Math.min(householdSize, 5)] || 1155;
  }

  private estimateEITC(children: number, annualIncome: number): number {
    if (annualIncome > 60000) return 0;
    const maxCredits: { [key: number]: number } = {
      0: 632, 1: 4213, 2: 6960, 3: 7830
    };
    return maxCredits[Math.min(children, 3)] || 7830;
  }

  // Method specifically for finding nearby food banks
  async findFoodBanks(
    context: AgentContext,
    urgency: 'today' | 'this-week' | 'anytime' = 'anytime'
  ): Promise<{ resources: string; urgencyLevel: string }> {
    try {
      const urgencyText = urgency === 'today' ? 'need food TODAY' :
                         urgency === 'this-week' ? 'need food this week' :
                         'looking for food resources';

      const query = `I ${urgencyText}. Find food banks near me.`;
      const response = await this.analyze(query, context);

      return {
        resources: response.response,
        urgencyLevel: urgency
      };
    } catch (error) {
      console.error('Error finding food banks:', error);
      return {
        resources: 'Call 211 to find food banks near you. Available 24/7.',
        urgencyLevel: urgency
      };
    }
  }

  // Method for job search
  async findJobs(
    context: AgentContext,
    type: 'gig' | 'part-time' | 'full-time' | 'any' = 'any'
  ): Promise<{ opportunities: string }> {
    try {
      const typeText = type === 'gig' ? 'gig work I can start immediately' :
                      type === 'part-time' ? 'part-time jobs' :
                      type === 'full-time' ? 'full-time jobs' :
                      'any job opportunities';

      const query = `I need ${typeText}. What are my options?`;
      const response = await this.analyze(query, context);

      return {
        opportunities: response.response
      };
    } catch (error) {
      console.error('Error finding jobs:', error);
      return {
        opportunities: 'Try DoorDash, Instacart, or visit your local workforce center for job assistance.'
      };
    }
  }
}

// Export singleton instance
export const resourceDiscoveryAgent = new ResourceDiscoveryAgent();
