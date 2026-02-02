import { supabase } from '@/lib/supabase';
import type { PersonConnection, ConnectionType } from '@/types/database';

export type ConnectionInsert = {
  person_a_id: string;
  person_b_id: string;
  connection_type: ConnectionType;
  notes?: string | null;
};

export type ConnectionUpdate = {
  connection_type?: ConnectionType;
  notes?: string | null;
};

export interface ConnectionWithPeople extends PersonConnection {
  person_a: {
    id: string;
    name: string;
    group: string;
  };
  person_b: {
    id: string;
    name: string;
    group: string;
  };
}

/**
 * Get all connections for the current user's people
 */
export async function getConnections(): Promise<ConnectionWithPeople[]> {
  const { data, error } = await supabase
    .from('person_connections')
    .select(`
      *,
      person_a:people!person_connections_person_a_id_fkey(id, name, group),
      person_b:people!person_connections_person_b_id_fkey(id, name, group)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ConnectionWithPeople[];
}

/**
 * Get connections for a specific person
 */
export async function getConnectionsForPerson(personId: string): Promise<ConnectionWithPeople[]> {
  const { data, error } = await supabase
    .from('person_connections')
    .select(`
      *,
      person_a:people!person_connections_person_a_id_fkey(id, name, group),
      person_b:people!person_connections_person_b_id_fkey(id, name, group)
    `)
    .or(`person_a_id.eq.${personId},person_b_id.eq.${personId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ConnectionWithPeople[];
}

/**
 * Get a single connection by ID
 */
export async function getConnectionById(id: string): Promise<ConnectionWithPeople | null> {
  const { data, error } = await supabase
    .from('person_connections')
    .select(`
      *,
      person_a:people!person_connections_person_a_id_fkey(id, name, group),
      person_b:people!person_connections_person_b_id_fkey(id, name, group)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as ConnectionWithPeople;
}

/**
 * Create a new connection between two people
 */
export async function createConnection(connection: ConnectionInsert): Promise<PersonConnection> {
  // Prevent self-connections
  if (connection.person_a_id === connection.person_b_id) {
    throw new Error('Cannot create a connection between a person and themselves');
  }

  // Check if connection already exists (in either direction)
  const { data: existing } = await supabase
    .from('person_connections')
    .select('id')
    .or(`and(person_a_id.eq.${connection.person_a_id},person_b_id.eq.${connection.person_b_id}),and(person_a_id.eq.${connection.person_b_id},person_b_id.eq.${connection.person_a_id})`)
    .single();

  if (existing) {
    throw new Error('A connection between these two people already exists');
  }

  const { data, error } = await supabase
    .from('person_connections')
    .insert(connection)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a connection
 */
export async function updateConnection(id: string, updates: ConnectionUpdate): Promise<PersonConnection> {
  const { data, error } = await supabase
    .from('person_connections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a connection
 */
export async function deleteConnection(id: string): Promise<void> {
  const { error } = await supabase
    .from('person_connections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get connection type display label
 */
export function getConnectionTypeLabel(type: ConnectionType): string {
  switch (type) {
    case 'knows':
      return 'Knows';
    case 'works_with':
      return 'Works with';
    case 'related_to':
      return 'Related to';
    default:
      return type;
  }
}

/**
 * Get all connection type options
 */
export function getConnectionTypeOptions(): { value: ConnectionType; label: string }[] {
  return [
    { value: 'knows', label: 'Knows' },
    { value: 'works_with', label: 'Works with' },
    { value: 'related_to', label: 'Related to' },
  ];
}
