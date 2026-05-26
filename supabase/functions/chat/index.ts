// Supabase Edge Function for Claude AI Chat
// Deploy with: supabase functions deploy chat

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-token',
};

// Rate limiting: Track requests per IP (in-memory, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Content validation: Block obviously malicious requests
function validateContent(messages: Array<{ content: string }>): boolean {
  for (const msg of messages) {
    // Block extremely long messages (potential abuse)
    if (msg.content.length > 10000) return false;

    // Block requests that look like prompt injection attempts
    const lowerContent = msg.content.toLowerCase();
    if (lowerContent.includes('ignore previous instructions') ||
        lowerContent.includes('ignore all instructions') ||
        lowerContent.includes('disregard your instructions')) {
      return false;
    }
  }
  return true;
}

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
4. **EXPERT ADVICE** - Wisdom from relationship experts

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
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(clientIP);
    if (!allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment.', code: 'RATE_LIMITED' }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        }
      );
    }

    // Check for user token (optional - anonymous users allowed)
    // User token is passed in x-user-token header to avoid issues with session JWT validation
    const userToken = req.headers.get('x-user-token');
    let userId = 'anonymous';

    // Model is tier-driven: free/starter -> Haiku, growth/premium -> Sonnet.
    // (Tier->model mapping mirrors src/config/tiers.ts.)
    const HAIKU = 'claude-3-haiku-20240307';
    const SONNET = 'claude-3-5-sonnet-20241022';
    let model = HAIKU;

    if (userToken) {
      // Verify user if token provided
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: `Bearer ${userToken}` } } }
        );

        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
          userId = user.id;

          // Pick the model for this user's subscription tier (RLS: own profile only).
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();
          const tier = profile?.subscription_tier ?? 'free';
          if (tier === 'growth' || tier === 'premium') {
            model = SONNET;
          }
        }
      } catch (e) {
        // Token validation failed, continue as anonymous
        console.warn('User token validation failed:', e);
      }
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

    // Validate content for abuse
    if (!validateContent(messages)) {
      console.warn(`Content validation failed for user: ${userId}, IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Invalid request content', code: 'VALIDATION_ERROR' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit number of messages to prevent context abuse
    if (messages.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Too many messages in conversation', code: 'VALIDATION_ERROR' }),
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

    console.log(`Processing chat for user ${userId}, ${claudeMessages.length} messages`);

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
              model,
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
