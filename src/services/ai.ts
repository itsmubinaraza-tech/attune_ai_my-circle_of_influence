import { supabase, supabaseUrl, supabaseAnonKey } from '@/lib/supabase';
import type { Person } from '@/types/database';
import type { ChatMessage } from './chat';

interface PersonContext {
  name: string;
  group: string;
  subgroup?: string;
  role?: string;
  notes?: string;
  relationshipHealth?: number;
}

interface ChatRequest {
  messages: ChatMessage[];
  personContext?: PersonContext | null;
  mood?: string | null;
  outcomeGoal?: string | null;
}

interface ChatResponse {
  message: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

// Error types for better handling
export enum ChatErrorType {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export class ChatError extends Error {
  type: ChatErrorType;
  statusCode?: number;
  retryable: boolean;

  constructor(message: string, type: ChatErrorType, statusCode?: number) {
    super(message);
    this.name = 'ChatError';
    this.type = type;
    this.statusCode = statusCode;
    this.retryable = type === ChatErrorType.NETWORK_ERROR ||
                     type === ChatErrorType.RATE_LIMITED ||
                     (type === ChatErrorType.SERVER_ERROR && statusCode !== undefined && statusCode >= 500);
  }
}

// Convert a Person to PersonContext
export function personToContext(person: Person | null): PersonContext | null {
  if (!person) return null;

  return {
    name: person.name,
    group: person.group,
    subgroup: person.subgroup || undefined,
    role: person.role || undefined,
    notes: person.notes || undefined,
    relationshipHealth: person.relationship_health || undefined,
  };
}

// Retry helper with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 2
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry on auth errors or client errors
      if (response.status === 401 || response.status === 403) {
        return response;
      }

      // Retry on rate limits and server errors
      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        console.log(`Network error, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

// Call the Claude AI via Supabase Edge Function
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const { data: { session } } = await supabase.auth.getSession();

  // Build the function URL
  const functionUrl = `${supabaseUrl}/functions/v1/chat`;

  // Debug logging
  console.log('[AI] URL:', functionUrl);
  console.log('[AI] Has supabaseAnonKey:', !!supabaseAnonKey);
  console.log('[AI] Has session:', !!session);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[AI] Missing config:', { supabaseUrl, hasAnonKey: !!supabaseAnonKey });
    throw new ChatError('Missing Supabase configuration', ChatErrorType.API_ERROR);
  }

  // Build headers - include auth token if logged in, anon key if not
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
  };

  if (session) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    // For anonymous users, use the anon key as bearer token
    headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
  }

  try {
    const response = await fetchWithRetry(functionUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: request.messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        personContext: request.personContext,
        mood: request.mood,
        outcomeGoal: request.outcomeGoal,
      }),
    });

    console.log('[AI] Response status:', response.status);
    console.log('[AI] Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI] Edge Function error:', response.status, errorText);

      // Parse error response if JSON
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error || errorJson.message || errorText;
      } catch {
        // Not JSON, use raw text
      }

      // Categorize error type
      if (response.status === 401 || response.status === 403) {
        throw new ChatError(
          'Authentication failed. Please sign in again.',
          ChatErrorType.NOT_AUTHENTICATED,
          response.status
        );
      } else if (response.status === 429) {
        throw new ChatError(
          'Too many requests. Please wait a moment and try again.',
          ChatErrorType.RATE_LIMITED,
          response.status
        );
      } else if (response.status >= 500) {
        throw new ChatError(
          'The AI service is temporarily unavailable. Using backup responses.',
          ChatErrorType.SERVER_ERROR,
          response.status
        );
      } else {
        throw new ChatError(
          `API error: ${errorDetails}`,
          ChatErrorType.API_ERROR,
          response.status
        );
      }
    }

    const data = await response.json();
    console.log('[AI] Response success:', { hasMessage: !!data.message, usage: data.usage });
    return data;
  } catch (error) {
    console.error('[AI] Caught error:', error);
    if (error instanceof ChatError) {
      throw error;
    }

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ChatError(
        'Network error. Please check your connection.',
        ChatErrorType.NETWORK_ERROR
      );
    }

    // Unknown errors
    throw new ChatError(
      (error as Error).message || 'An unexpected error occurred',
      ChatErrorType.UNKNOWN
    );
  }
}

// Check if error should trigger fallback response
export function shouldUseFallback(error: unknown): boolean {
  if (error instanceof ChatError) {
    return error.type === ChatErrorType.SERVER_ERROR ||
           error.type === ChatErrorType.NETWORK_ERROR ||
           error.type === ChatErrorType.RATE_LIMITED;
  }
  return true;
}

// Fallback responses when API is unavailable - More actionable and practical
const FALLBACK_RESPONSES = {
  greeting: [
    "I'm here to help you build stronger connections. Tell me: who do you want to connect with, and what's the situation? I'll give you specific things to say and do.",
    "Let's make your relationships stronger. Who's on your mind? Share the context and I'll help you with exactly what to say, how to say it, and what to expect.",
    "Ready to help you connect more meaningfully. What relationship would you like to work on? Be specific and I'll give you actionable guidance.",
  ],
  withPerson: (name: string, group: string) => [
    `Let's work on your relationship with ${name}. To give you the best advice, tell me: What's the specific situation? What outcome are you hoping for? Then I'll help you with exactly what to say and how to approach it.`,
    `I want to help you connect better with ${name}. What's happening in this ${group} relationship right now? Share the details and I'll give you specific conversation starters and body language tips.`,
    `${name} - got it. What's the challenge or opportunity here? The more context you give me, the more specific I can be about what to say, how to say it, and what response to expect.`,
  ],
  withMood: (mood: string) => [
    `You're feeling ${mood} - that's important context. This emotional state will influence how you show up in the conversation. Let's work with this energy and channel it productively. What specifically do you need help with?`,
    `Feeling ${mood} is valid. Here's the thing: your emotional state affects your tone and body language. Let's make sure you're prepared. What's the conversation or situation you're facing?`,
  ],
  general: [
    "Let me give you something actionable. **Try this**: Next time you see them, start with a genuine compliment or observation, then ask an open-ended question about something they care about. What specific topic could you ask about?",
    "Here's a practical framework: **1)** Lead with curiosity, not judgment. **2)** Ask 'what' and 'how' questions, not 'why.' **3)** Reflect back what you hear before responding. What part of this feels most relevant to your situation?",
    "**Brené Brown would say**: Vulnerability isn't weakness—it's courage. **Adam Grant would say**: Give before you ask. **Simon Sinek would say**: Start with why you value this relationship. Which approach resonates with you?",
    "One small step you could take today: Send a brief message that shows you were thinking of them. Something like: 'Hey, I saw [something relevant] and thought of you. How are you doing?' Would that work for this situation?",
    "Let's get specific. **What to say**: Start with something genuine you appreciate about them. **How to say it**: Warm tone, relaxed posture, good eye contact. **What to expect**: They may be surprised but will likely appreciate it. What's holding you back from trying this?",
    "Here's the key insight: People remember how you made them feel, not what you said. Focus on being fully present and genuinely curious. What would it look like to bring that energy to your next interaction?",
  ],
};

// Generate a fallback response when the API is unavailable
export function generateFallbackResponse(
  messages: ChatMessage[],
  person: Person | null,
  mood: string | null,
): string {
  const isFirstMessage = messages.filter(m => m.role === 'user').length <= 1;

  // First message - use greeting or person-specific
  if (isFirstMessage) {
    if (person) {
      const responses = FALLBACK_RESPONSES.withPerson(person.name, person.group);
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return FALLBACK_RESPONSES.greeting[Math.floor(Math.random() * FALLBACK_RESPONSES.greeting.length)];
  }

  // Sometimes reference mood
  if (mood && Math.random() > 0.7) {
    const responses = FALLBACK_RESPONSES.withMood(mood);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // General response
  return FALLBACK_RESPONSES.general[Math.floor(Math.random() * FALLBACK_RESPONSES.general.length)];
}

// Export service object
export const aiService = {
  sendChatMessage,
  personToContext,
  generateFallbackResponse,
};
