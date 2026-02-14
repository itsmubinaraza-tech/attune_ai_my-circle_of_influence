import { supabase } from '../lib/supabase';
import type { Person, PersonInsert, PersonUpdate, GroupType } from '../types/database';

export interface PersonWithHealth extends Person {
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
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

/**
 * Create a new person
 */
export async function createPerson(person: Omit<PersonInsert, 'user_id'>): Promise<Person> {
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

/**
 * Seed demo data with 28 people (7 per group)
 */
export async function seedDemoData(): Promise<Person[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const demoData: Omit<PersonInsert, 'user_id'>[] = [
    // Work colleagues (7)
    { name: 'Sarah Mockup', group: 'work', subgroup: 'Manager', role: 'Engineering Director', email: 'sarah.mockup@demo.com', phone: '+1-555-0101', relationship_health: 85, last_contact: daysAgo(2), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Marcus Mockup', group: 'work', subgroup: 'Team', role: 'Senior Developer', email: 'marcus.mockup@demo.com', relationship_health: 78, last_contact: daysAgo(1), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Priya Mockup', group: 'work', subgroup: 'Team', role: 'UX Designer', email: 'priya.mockup@demo.com', relationship_health: 92, last_contact: daysAgo(3), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'David Mockup', group: 'work', subgroup: 'Stakeholder', role: 'Product Manager', email: 'david.mockup@demo.com', phone: '+1-555-0102', relationship_health: 70, last_contact: daysAgo(7), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Lisa Mockup', group: 'work', subgroup: 'HR', role: 'HR Business Partner', email: 'lisa.mockup@demo.com', relationship_health: 65, last_contact: daysAgo(14), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'James Mockup', group: 'work', subgroup: 'Executive', role: 'VP of Engineering', email: 'james.mockup@demo.com', relationship_health: 55, last_contact: daysAgo(30), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Emily Mockup', group: 'work', subgroup: 'Client', role: 'Account Manager', email: 'emily.mockup@demo.com', phone: '+1-555-0103', relationship_health: 80, last_contact: daysAgo(5), notes: 'Demo contact - feel free to edit or delete' },

    // Family members (7)
    { name: 'Mom Mockup', group: 'family', subgroup: 'Immediate', role: 'Mother', phone: '+1-555-0201', relationship_health: 95, last_contact: daysAgo(1), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Dad Mockup', group: 'family', subgroup: 'Immediate', role: 'Father', phone: '+1-555-0202', relationship_health: 90, last_contact: daysAgo(2), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Alex Mockup', group: 'family', subgroup: 'Immediate', role: 'Brother', phone: '+1-555-0203', email: 'alex.mockup@demo.com', relationship_health: 85, last_contact: daysAgo(4), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Grandma Mockup', group: 'family', subgroup: 'Extended', role: 'Grandmother', phone: '+1-555-0204', relationship_health: 88, last_contact: daysAgo(10), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Uncle Mockup', group: 'family', subgroup: 'Extended', role: 'Uncle', phone: '+1-555-0205', relationship_health: 60, last_contact: daysAgo(45), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Maya Mockup', group: 'family', subgroup: 'Extended', role: 'Cousin', email: 'maya.mockup@demo.com', relationship_health: 72, last_contact: daysAgo(20), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Nina Mockup', group: 'family', subgroup: 'In-laws', role: 'Sister-in-law', email: 'nina.mockup@demo.com', relationship_health: 75, last_contact: daysAgo(8), notes: 'Demo contact - feel free to edit or delete' },

    // Friends (7)
    { name: 'Jake Mockup', group: 'friends', subgroup: 'Close', role: 'Best Friend', phone: '+1-555-0301', email: 'jake.mockup@demo.com', relationship_health: 95, last_contact: daysAgo(1), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Samantha Mockup', group: 'friends', subgroup: 'Close', role: 'Close Friend', phone: '+1-555-0302', relationship_health: 88, last_contact: daysAgo(3), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Mike Mockup', group: 'friends', subgroup: 'College', role: 'College Roommate', email: 'mike.mockup@demo.com', relationship_health: 70, last_contact: daysAgo(21), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Rachel Mockup', group: 'friends', subgroup: 'Gym', role: 'Gym Buddy', phone: '+1-555-0303', relationship_health: 65, last_contact: daysAgo(5), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Tom Mockup', group: 'friends', subgroup: 'Neighborhood', role: 'Neighbor', relationship_health: 55, last_contact: daysAgo(14), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Jessica Mockup', group: 'friends', subgroup: 'Hobby', role: 'Photography Club', email: 'jessica.mockup@demo.com', relationship_health: 60, last_contact: daysAgo(30), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Chris Mockup', group: 'friends', subgroup: 'School', role: 'High School Friend', email: 'chris.mockup@demo.com', relationship_health: 45, last_contact: daysAgo(60), notes: 'Demo contact - feel free to edit or delete' },

    // Acquaintances (7)
    { name: 'Amanda Mockup', group: 'acquaintances', subgroup: 'Professional', role: 'Industry Contact', email: 'amanda.mockup@demo.com', relationship_health: 50, last_contact: daysAgo(45), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Brian Mockup', group: 'acquaintances', subgroup: 'Social', role: 'Barber', relationship_health: 55, last_contact: daysAgo(30), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Carol Mockup', group: 'acquaintances', subgroup: 'Social', role: 'Yoga Classmate', relationship_health: 40, last_contact: daysAgo(7), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Dan Mockup', group: 'acquaintances', subgroup: 'Social', role: 'Coffee Shop Regular', relationship_health: 35, last_contact: daysAgo(3), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Peterson Mockup', group: 'acquaintances', subgroup: 'Neighbor', role: 'Neighbor', relationship_health: 45, last_contact: daysAgo(14), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Eva Mockup', group: 'acquaintances', subgroup: 'Professional', role: 'Conference Contact', email: 'eva.mockup@demo.com', relationship_health: 30, last_contact: daysAgo(90), notes: 'Demo contact - feel free to edit or delete' },
    { name: 'Tina Mockup', group: 'acquaintances', subgroup: 'Social', role: 'Book Club Member', relationship_health: 50, last_contact: daysAgo(21), notes: 'Demo contact - feel free to edit or delete' },
  ];

  const { data, error } = await supabase
    .from('people')
    .insert(demoData.map(person => ({ ...person, user_id: user.id })))
    .select();

  if (error) throw error;
  return data || [];
}

/**
 * Check if user has any people in their circle
 */
export async function hasAnyPeople(): Promise<boolean> {
  const { count, error } = await supabase
    .from('people')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return (count ?? 0) > 0;
}
