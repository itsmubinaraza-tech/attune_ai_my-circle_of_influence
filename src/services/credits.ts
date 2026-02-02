import { supabase } from '@/lib/supabase';
import type { UserCredits } from '@/types/database';

const DEFAULT_MONTHLY_CREDITS = 50;
const CREDITS_PER_MESSAGE = 1;

// Get user credits
export async function getCredits(): Promise<UserCredits | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No credits record exists, create one
      return await initializeCredits();
    }
    throw error;
  }

  // Check if credits need to be reset (monthly reset)
  if (data && shouldResetCredits(data.reset_date)) {
    return await resetMonthlyCredits(data.id);
  }

  return data;
}

// Initialize credits for a new user
export async function initializeCredits(): Promise<UserCredits> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const nextResetDate = getNextResetDate();

  const { data, error } = await supabase
    .from('user_credits')
    .insert({
      user_id: user.id,
      credits_remaining: DEFAULT_MONTHLY_CREDITS,
      credits_total: DEFAULT_MONTHLY_CREDITS,
      reset_date: nextResetDate.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Use credits (deduct from remaining)
export async function useCredits(amount: number = CREDITS_PER_MESSAGE): Promise<UserCredits> {
  const credits = await getCredits();
  if (!credits) throw new Error('No credits record found');

  if (credits.credits_remaining < amount) {
    throw new Error('Insufficient credits');
  }

  const { data, error } = await supabase
    .from('user_credits')
    .update({
      credits_remaining: credits.credits_remaining - amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', credits.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Check if user has enough credits
export async function hasCredits(amount: number = CREDITS_PER_MESSAGE): Promise<boolean> {
  const credits = await getCredits();
  return credits ? credits.credits_remaining >= amount : false;
}

// Add bonus credits (for promotions, etc.)
export async function addBonusCredits(amount: number): Promise<UserCredits> {
  const credits = await getCredits();
  if (!credits) throw new Error('No credits record found');

  const { data, error } = await supabase
    .from('user_credits')
    .update({
      credits_remaining: credits.credits_remaining + amount,
      credits_total: credits.credits_total + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', credits.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Reset monthly credits
async function resetMonthlyCredits(creditsId: string): Promise<UserCredits> {
  const nextResetDate = getNextResetDate();

  const { data, error } = await supabase
    .from('user_credits')
    .update({
      credits_remaining: DEFAULT_MONTHLY_CREDITS,
      credits_total: DEFAULT_MONTHLY_CREDITS,
      reset_date: nextResetDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', creditsId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Check if credits should be reset (past reset date)
function shouldResetCredits(resetDate: string): boolean {
  const reset = new Date(resetDate);
  const now = new Date();
  return now >= reset;
}

// Get next reset date (first of next month)
function getNextResetDate(): Date {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
}

// Get days until reset
export function getDaysUntilReset(resetDate: string): number {
  const reset = new Date(resetDate);
  const now = new Date();
  const diffTime = reset.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Export as service object
export const creditsService = {
  getCredits,
  initializeCredits,
  useCredits,
  hasCredits,
  addBonusCredits,
  getDaysUntilReset,
  DEFAULT_MONTHLY_CREDITS,
  CREDITS_PER_MESSAGE,
};
