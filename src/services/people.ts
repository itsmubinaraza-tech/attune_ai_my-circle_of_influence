import { supabase } from '@/lib/supabase';
import type { Person, PersonInsert, PersonUpdate, GroupType } from '@/types/database';

export interface PersonWithHealth extends Person {
  // Computed properties from joined data
  interactionCount?: number;
}

/**
 * Fetch all people for the current user
 */
export async function getPeople(): Promise<Person[]> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('is_archived', false)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch people by group
 */
export async function getPeopleByGroup(group: GroupType): Promise<Person[]> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('group', group)
    .eq('is_archived', false)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch a single person by ID
 */
export async function getPersonById(id: string): Promise<Person | null> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Create a new person
 */
export async function createPerson(person: Omit<PersonInsert, 'user_id'>): Promise<Person> {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('people')
    .insert({
      ...person,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a person
 */
export async function updatePerson(id: string, updates: PersonUpdate): Promise<Person> {
  const { data, error } = await supabase
    .from('people')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Archive a person (soft delete)
 */
export async function archivePerson(id: string): Promise<void> {
  const { error } = await supabase
    .from('people')
    .update({ is_archived: true })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a person permanently
 */
export async function deletePerson(id: string): Promise<void> {
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Search people by name
 */
export async function searchPeople(query: string): Promise<Person[]> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('is_archived', false)
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(10);

  if (error) throw error;
  return data || [];
}

/**
 * Get people who need attention (haven't been contacted recently)
 */
export async function getPeopleNeedingAttention(daysThreshold: number = 7): Promise<Person[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('is_archived', false)
    .or(`last_contact.is.null,last_contact.lt.${thresholdDate.toISOString()}`)
    .order('last_contact', { ascending: true, nullsFirst: true })
    .limit(10);

  if (error) throw error;
  return data || [];
}

/**
 * Update the last contact date for a person
 */
export async function updateLastContact(id: string, date: Date = new Date()): Promise<void> {
  const { error } = await supabase
    .from('people')
    .update({ last_contact: date.toISOString() })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get subgroups for a given group
 */
export function getDefaultSubgroups(group: GroupType): string[] {
  switch (group) {
    case 'work':
      return ['Manager', 'Team', 'Stakeholder', 'Client', 'HR', 'Executive'];
    case 'family':
      return ['Immediate', 'Extended', 'In-laws'];
    case 'friends':
      return ['Close', 'Casual', 'College', 'School', 'Neighborhood', 'Gym', 'Hobby'];
    case 'acquaintances':
      return ['Professional', 'Social', 'Neighbor'];
    default:
      return [];
  }
}
