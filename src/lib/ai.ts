const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/nova-chat`;

if (!SUPABASE_URL) {
  console.warn('⚠️ Supabase URL not configured. Please set VITE_SUPABASE_URL in .env.local');
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserContext {
  fullName?: string;
  householdSize?: number;
  monthlyIncome?: number;
  ebtBalance?: number;
  location?: string;
  childrenCount?: number;
}

export async function sendChatMessage(
  messages: Message[],
  userContext?: UserContext
): Promise<string> {
  if (!SUPABASE_URL) {
    // Fallback to mock responses if Supabase not configured
    console.warn('Using mock responses - Supabase URL not configured');
    return getMockResponse(messages[messages.length - 1].content);
  }

  try {
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        messages,
        userContext
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Edge function error:', error);
      throw new Error(`NOVA AI error: ${error.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error calling NOVA AI:', error);
    // Fallback to mock response on error
    return getMockResponse(messages[messages.length - 1].content);
  }
}

function buildSystemPrompt(context?: UserContext): string {
  let prompt = `You are NOVA, an AI financial coach designed to help low-income families navigate government benefits, manage their finances, and access community resources.

Your role is to:
- Provide actionable, practical financial advice
- Help families avoid financial crises
- Guide them to available benefits and resources
- Be empathetic, supportive, and never judgmental
- Give specific dollar amounts and deadlines when relevant
- Prioritize immediate needs (food, shelter) over long-term planning`;

  if (context) {
    prompt += `\n\nUser Context:`;
    if (context.fullName) prompt += `\n- Name: ${context.fullName}`;
    if (context.householdSize) prompt += `\n- Household Size: ${context.householdSize} people`;
    if (context.childrenCount !== undefined) prompt += `\n- Children: ${context.childrenCount}`;
    if (context.monthlyIncome) prompt += `\n- Monthly Income: $${context.monthlyIncome.toFixed(2)}`;
    if (context.ebtBalance !== undefined) prompt += `\n- Current EBT Balance: $${context.ebtBalance.toFixed(2)}`;
    if (context.location) prompt += `\n- Location: ${context.location}`;
  }

  prompt += `\n\nAlways be concise, practical, and focus on immediate actionable steps.`;

  return prompt;
}

// Mock responses for when API key is not configured
function getMockResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes('rent') || message.includes('housing')) {
    return "I understand rent is a major concern. Based on your income, you might qualify for emergency rental assistance. Here's what I suggest:\n\n1. Contact your local Community Action Agency - they often have emergency funds (typically $500-$2,000)\n2. Look into the Emergency Rental Assistance Program (ERAP) in your area\n3. If you're at risk of eviction, legal aid can help delay proceedings\n\nWould you like me to help you find food resources to free up more money for rent?";
  }

  if (message.includes('food') || message.includes('groceries') || message.includes('ebt')) {
    return "Let me help with food resources. I see your EBT balance is running low. Here are immediate steps:\n\n1. Visit the food bank at 2.3 miles away (open until 5pm today)\n2. Switch to shopping at Aldi instead of Walmart - you could save $87/month\n3. Check if you qualify for WIC (Women, Infants, Children) - that's an extra $50-$100/month\n\nWant me to show you the nearest food banks on the map?";
  }

  if (message.includes('shutdown') || message.includes('government')) {
    return "The government shutdown risk is currently at 35%. Here's your preparation plan:\n\n1. Your EBT benefits are protected for 30 days during a shutdown\n2. Build a 2-week emergency food supply now (cost: ~$75)\n3. Identify 3 food banks near you as backup\n4. Apply for any benefits you're missing BEFORE the deadline\n\nYou have 10 days until the funding deadline. Want me to check what benefits you might be eligible for?";
  }

  if (message.includes('job') || message.includes('work') || message.includes('income')) {
    return "Increasing your income is smart thinking. Here are immediate opportunities:\n\n1. DoorDash/Uber Eats: Earn $15-25/hour, start today\n2. Instacart: $12-20/hour shopping, flexible schedule\n3. Local warehouse hiring at $18/hour (Amazon, Target)\n\nEven an extra $400/month would change your situation significantly. Want me to help you figure out childcare so you can work?";
  }

  return "I'm here to help with your financial situation. I can assist with:\n\n- Finding food banks and emergency resources nearby\n- Checking what government benefits you qualify for\n- Creating a budget to stretch your money further\n- Preparing for potential government shutdowns\n- Finding ways to increase your income\n\nWhat would be most helpful for you right now?";
}
