import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

// Fetch the current user's profile (includes subscription fields). Null if signed out.
export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // no row
    throw error;
  }
  return data;
}

export const profileService = { getProfile };
