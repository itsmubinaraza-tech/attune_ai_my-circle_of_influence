import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

export type Interaction = Database['public']['Tables']['interactions']['Row'];
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert'];
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update'];
export type InteractionOutcome = Database['public']['Enums']['interaction_outcome'];

// Interaction types for UI (stored in context field with prefix)
export const INTERACTION_TYPES = [
  { value: 'call', label: 'Phone Call', icon: 'Phone' },
  { value: 'video', label: 'Video Call', icon: 'Video' },
  { value: 'meeting', label: 'In-Person Meeting', icon: 'Users' },
  { value: 'message', label: 'Message/Text', icon: 'MessageSquare' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'social', label: 'Social Media', icon: 'Share2' },
  { value: 'event', label: 'Event/Gathering', icon: 'Calendar' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
] as const;

export type InteractionType = typeof INTERACTION_TYPES[number]['value'];

// Helper to encode/decode interaction type from context
export function encodeContext(type: InteractionType, description: string): string {
  return `[${type}] ${description}`;
}

export function decodeContext(context: string | null): { type: InteractionType; description: string } {
  if (!context) return { type: 'other', description: '' };

  const match = context.match(/^\[(\w+)\]\s*(.*)/);
  if (match) {
    const type = match[1] as InteractionType;
    const validType = INTERACTION_TYPES.find(t => t.value === type) ? type : 'other';
    return { type: validType, description: match[2] || '' };
  }

  return { type: 'other', description: context };
}

// Get all interactions for a person
export async function getInteractionsForPerson(personId: string): Promise<Interaction[]> {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('person_id', personId)
    .order('interaction_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get all interactions for current user
export async function getAllInteractions(): Promise<Interaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', user.id)
    .order('interaction_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get recent interactions (for dashboard)
export async function getRecentInteractions(limit: number = 10): Promise<Interaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', user.id)
    .order('interaction_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Get single interaction
export async function getInteraction(id: string): Promise<Interaction | null> {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// Create interaction
export async function createInteraction(
  interaction: Omit<InteractionInsert, 'user_id'>
): Promise<Interaction> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('interactions')
    .insert({ ...interaction, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  // Update relationship health based on outcome
  await updateRelationshipHealth(interaction.person_id, interaction.outcome);

  return data;
}

// Update interaction
export async function updateInteraction(
  id: string,
  updates: InteractionUpdate
): Promise<Interaction> {
  const { data, error } = await supabase
    .from('interactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete interaction
export async function deleteInteraction(id: string): Promise<void> {
  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Calculate and update relationship health based on interactions
async function updateRelationshipHealth(
  personId: string,
  outcome: InteractionOutcome | null | undefined
): Promise<void> {
  // Get current person data
  const { data: person, error: personError } = await supabase
    .from('people')
    .select('relationship_health')
    .eq('id', personId)
    .single();

  if (personError) return;

  let currentHealth = person?.relationship_health ?? 50;

  // Adjust health based on interaction outcome
  switch (outcome) {
    case 'successful':
      currentHealth = Math.min(100, currentHealth + 10);
      break;
    case 'partial':
      currentHealth = Math.min(100, currentHealth + 3);
      break;
    case 'unsuccessful':
      currentHealth = Math.max(0, currentHealth - 5);
      break;
    default:
      // No outcome specified, small boost for any interaction
      currentHealth = Math.min(100, currentHealth + 2);
  }

  // Update person's relationship health
  await supabase
    .from('people')
    .update({ relationship_health: currentHealth })
    .eq('id', personId);
}

// Get interaction statistics for a person
export async function getInteractionStats(personId: string): Promise<{
  total: number;
  successful: number;
  partial: number;
  unsuccessful: number;
  lastInteraction: string | null;
  averagePerMonth: number;
}> {
  const interactions = await getInteractionsForPerson(personId);

  const stats = {
    total: interactions.length,
    successful: interactions.filter(i => i.outcome === 'successful').length,
    partial: interactions.filter(i => i.outcome === 'partial').length,
    unsuccessful: interactions.filter(i => i.outcome === 'unsuccessful').length,
    lastInteraction: interactions[0]?.interaction_date || null,
    averagePerMonth: 0,
  };

  // Calculate average per month
  if (interactions.length > 0) {
    const dates = interactions.map(i => new Date(i.interaction_date));
    const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const monthsDiff = Math.max(1,
      (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 +
      (newestDate.getMonth() - oldestDate.getMonth()) + 1
    );
    stats.averagePerMonth = Math.round((interactions.length / monthsDiff) * 10) / 10;
  }

  return stats;
}
