import { supabase } from '@/lib/supabase';
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
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = {
  greeting: [
    "I'm here to help you navigate your relationships with care and understanding. What's on your mind?",
    "Welcome! I'm your emotional intelligence coach. How can I support you today?",
    "I can sense this is important to you. Let's work through it together.",
  ],
  withPerson: (name: string, group: string) => [
    `I understand you want to talk about ${name}. Every relationship has its nuances. What specific aspect would you like to explore?`,
    `${name} is in your ${group} circle. Tell me more about what's happening in this relationship.`,
    `Let's focus on your relationship with ${name}. What's been on your mind about them?`,
  ],
  withMood: (mood: string) => [
    `I notice you're feeling ${mood}. That's completely valid. How do you think this is affecting your approach?`,
    `Feeling ${mood} can influence how we perceive situations. Let's explore this together.`,
  ],
  general: [
    "That's an insightful observation. Can you tell me more about what led to this thought?",
    "I appreciate you sharing that. How does this situation make you feel?",
    "Understanding the other person's perspective can be challenging. What do you think they might be experiencing?",
    "It sounds like you're processing a lot. What would feel like the most supportive next step for you?",
    "Relationships require ongoing effort from both sides. What small step could you take today?",
    "Let's think about this from a different angle. What would your ideal outcome look like?",
    "That's a meaningful reflection. How has this awareness changed your perspective?",
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
