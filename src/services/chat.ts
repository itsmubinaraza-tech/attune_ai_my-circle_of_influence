import { supabase } from '@/lib/supabase';
import type { CoachingSession, Json } from '@/types/database';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface CoachingSessionInsert {
  user_id: string;
  person_id?: string | null;
  messages: ChatMessage[];
  mood?: string | null;
  outcome_goal?: string | null;
  summary?: string | null;
  tokens_used?: number | null;
}

export interface CoachingSessionUpdate {
  messages?: ChatMessage[];
  summary?: string | null;
  tokens_used?: number | null;
}

// Get all coaching sessions for the current user
export async function getSessions(): Promise<CoachingSession[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get a single coaching session by ID
export async function getSession(sessionId: string): Promise<CoachingSession | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

// Get sessions for a specific person
export async function getSessionsForPerson(personId: string): Promise<CoachingSession[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('person_id', personId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create a new coaching session
export async function createSession(session: Omit<CoachingSessionInsert, 'user_id'>): Promise<CoachingSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coaching_sessions')
    .insert({
      user_id: user.id,
      person_id: session.person_id || null,
      messages: session.messages as unknown as Json,
      mood: session.mood || null,
      outcome_goal: session.outcome_goal || null,
      summary: session.summary || null,
      tokens_used: session.tokens_used || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a coaching session (add messages, update summary, etc.)
export async function updateSession(sessionId: string, updates: CoachingSessionUpdate): Promise<CoachingSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: Record<string, unknown> = {};
  if (updates.messages !== undefined) {
    updateData.messages = updates.messages as unknown as Json;
  }
  if (updates.summary !== undefined) {
    updateData.summary = updates.summary;
  }
  if (updates.tokens_used !== undefined) {
    updateData.tokens_used = updates.tokens_used;
  }

  const { data, error } = await supabase
    .from('coaching_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a coaching session
export async function deleteSession(sessionId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('coaching_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Get the most recent session (for continuing a conversation)
export async function getMostRecentSession(): Promise<CoachingSession | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

// Helper to parse messages from JSON
export function parseMessages(messagesJson: Json): ChatMessage[] {
  if (!messagesJson) return [];
  if (Array.isArray(messagesJson)) {
    return messagesJson as ChatMessage[];
  }
  return [];
}

// Export as a service object for consistency with other services
export const chatService = {
  getSessions,
  getSession,
  getSessionsForPerson,
  createSession,
  updateSession,
  deleteSession,
  getMostRecentSession,
  parseMessages,
};
