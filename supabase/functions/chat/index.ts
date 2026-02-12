// Supabase Edge Function for Claude AI Chat
// Deploy with: supabase functions deploy chat

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

// Build a concise system prompt
function buildSystemPrompt(request: ChatRequest): string {
  let prompt = `You are Attune, a practical relationship coach. Give specific, actionable advice.

FORMAT YOUR RESPONSE WITH:
1. **WHAT TO SAY** - 2-3 specific phrases to use
2. **HOW TO SAY IT** - Tone and body language tips
3. **WHAT TO EXPECT** - Likely responses and how to handle them
4. **NEXT STEP** - One clear action to take in 24-48 hours

Be direct, warm, and practical. Keep responses focused and scannable.`;

  // Add person context
  if (request.personContext) {
    const { name, group, role, notes, relationshipHealth } = request.personContext;
    prompt += `\n\nCONTEXT: Helping with ${name} (${group}${role ? `, ${role}` : ''}).`;
    if (notes) prompt += ` Notes: ${notes}`;
    if (relationshipHealth !== undefined) {
      prompt += ` Health: ${relationshipHealth}/100.`;
    }
    prompt += ` Always use their name in advice.`;
  }

  // Add mood
  if (request.mood) {
    prompt += `\n\nUSER MOOD: ${request.mood}. Adapt your tone accordingly.`;
  }

  // Add outcome goal
  if (request.outcomeGoal) {
    const goals: Record<string, string> = {
      resolve: 'resolve conflict',
      connect: 'deepen connection',
      understand: 'better understand them',
      express: 'express feelings clearly',
      support: 'provide support',
      boundaries: 'set healthy boundaries',
    };
    prompt += `\n\nGOAL: Help user ${goals[request.outcomeGoal] || request.outcomeGoal}.`;
  }

  return prompt;
}

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 25000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const request: ChatRequest = await req.json();
    const { messages } = request;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') || Deno.env.get('attune_ai');
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured', code: 'CONFIG_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build prompt
    const systemPrompt = buildSystemPrompt(request);

    // Prepare messages (only last 10 to keep context manageable)
    const recentMessages = messages.slice(-10);
    const claudeMessages = recentMessages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    console.log(`Processing chat for user ${user.id}, ${claudeMessages.length} messages`);

    // Call Claude API with timeout and retry
    let response: Response | null = null;
    let lastError: string = '';
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await fetchWithTimeout(
          'https://api.anthropic.com/v1/messages',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicApiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 1024,
              system: systemPrompt,
              messages: claudeMessages,
            }),
          },
          25000 // 25 second timeout
        );

        // Success
        if (response.ok) {
          break;
        }

        // Non-retryable error
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          const errorText = await response.text();
          console.error(`Claude API error ${response.status}:`, errorText);
          lastError = errorText;
          break;
        }

        // Retry on rate limit or server error
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          console.log(`Retry ${attempt + 1}/${maxRetries} after ${response.status}, waiting ${backoffMs}ms`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Attempt ${attempt + 1} failed:`, errorMessage);
        lastError = errorMessage;

        if (errorMessage.includes('aborted')) {
          lastError = 'Request timeout - AI service took too long';
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Handle failure
    if (!response || !response.ok) {
      console.error('All attempts failed:', lastError);
      return new Response(
        JSON.stringify({
          error: lastError || 'Failed to get AI response',
          code: 'API_ERROR',
          retryable: true,
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse response
    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text || 'I apologize, but I was unable to generate a response. Please try again.';

    console.log(`Success: ${data.usage?.output_tokens || 0} tokens`);

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        usage: {
          inputTokens: data.usage?.input_tokens || 0,
          outputTokens: data.usage?.output_tokens || 0,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('Unhandled error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, code: 'SERVER_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
