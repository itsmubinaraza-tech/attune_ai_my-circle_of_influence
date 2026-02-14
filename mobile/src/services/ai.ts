import { supabase } from '../lib/supabase';
import type { Person } from '../types/database';
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

// Call the Claude AI via Supabase Edge Function
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  // Get the Supabase URL for the edge function
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/chat`;

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Edge Function error response:', response.status, errorText);
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Fallback responses when API is unavailable
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
    "**Bren\u00e9 Brown would say**: Vulnerability isn't weakness\u2014it's courage. **Adam Grant would say**: Give before you ask. **Simon Sinek would say**: Start with why you value this relationship. Which approach resonates with you?",
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
