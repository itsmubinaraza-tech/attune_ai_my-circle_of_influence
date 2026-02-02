// Supabase Edge Function for Claude AI Chat
// Deploy with: supabase functions deploy chat --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  personContext?: {
    name: string;
    group: string;
    subgroup?: string;
    role?: string;
    notes?: string;
    relationshipHealth?: number;
  } | null;
  mood?: string | null;
  outcomeGoal?: string | null;
}

// Build system prompt with context
function buildSystemPrompt(request: ChatRequest): string {
  let systemPrompt = `You are Attune, an emotionally intelligent AI coach specializing in relationship dynamics and interpersonal communication. Your role is to help users navigate their relationships with empathy, insight, and practical guidance.

Your communication style:
- Be warm, supportive, and non-judgmental
- Ask thoughtful clarifying questions to understand the full picture
- Offer specific, actionable advice when appropriate
- Acknowledge emotions and validate feelings
- Help users see different perspectives
- Focus on building healthy communication patterns
- Be concise but thorough - aim for 2-4 paragraphs per response
- Use natural, conversational language`;

  // Add person context if available
  if (request.personContext) {
    const { name, group, subgroup, role, notes, relationshipHealth } = request.personContext;
    systemPrompt += `\n\n## Current Relationship Context
The user wants to discuss their relationship with **${name}**.
- Relationship type: ${group}${subgroup ? ` (${subgroup})` : ''}${role ? `\n- Their role: ${role}` : ''}${notes ? `\n- User's notes about them: ${notes}` : ''}${relationshipHealth !== undefined ? `\n- Relationship health score: ${relationshipHealth}/100` : ''}

Keep this context in mind when providing advice. Reference ${name} by name when relevant.`;
  }

  // Add mood context if available
  if (request.mood) {
    systemPrompt += `\n\n## User's Current Emotional State
The user is currently feeling **${request.mood}**. Be mindful of this emotional state in your responses and acknowledge it when appropriate.`;
  }

  // Add outcome goal if available
  if (request.outcomeGoal) {
    systemPrompt += `\n\n## User's Goal for This Conversation
The user's desired outcome is: "${request.outcomeGoal}". Help guide the conversation toward achieving this goal while being responsive to what the user shares.`;
  }

  return systemPrompt;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the user is authenticated
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const request: ChatRequest = await req.json();
    const { messages, personContext, mood, outcomeGoal } = request;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array is required');
    }

    // Get Claude API key from environment
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Build the system prompt with context
    const systemPrompt = buildSystemPrompt({ messages, personContext, mood, outcomeGoal });

    // Prepare messages for Claude API
    const claudeMessages = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: claudeMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the response content
    const assistantMessage = data.content?.[0]?.text || 'I apologize, but I was unable to generate a response. Please try again.';

    // Return the response
    return new Response(
      JSON.stringify({
        message: assistantMessage,
        usage: {
          inputTokens: data.usage?.input_tokens || 0,
          outputTokens: data.usage?.output_tokens || 0,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
