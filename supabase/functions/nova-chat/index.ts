// Supabase Edge Function for NOVA AI Chat
// This function handles Anthropic API calls from the backend to avoid CORS issues

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserContext {
  fullName?: string;
  householdSize?: number;
  monthlyIncome?: number;
  ebtBalance?: number;
  location?: string;
  childrenCount?: number;
}

interface RequestBody {
  messages: Message[];
  userContext?: UserContext;
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate API key
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { messages, userContext }: RequestBody = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(userContext);

    // Call Anthropic API
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Anthropic API error:', error);
      return new Response(
        JSON.stringify({
          error: `Anthropic API error: ${error.error?.message || 'Unknown error'}`
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    const aiMessage = data.content[0].text;

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
