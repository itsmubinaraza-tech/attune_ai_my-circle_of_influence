import { supabase } from '@/lib/supabase';

/**
 * Client-side Stripe service. Holds NO secrets — it only invokes the
 * create-checkout / customer-portal edge functions, which use the Stripe
 * secret key server-side. The user's Supabase session JWT is attached
 * automatically by supabase.functions.invoke for authentication.
 */

export type PaidTier = 'starter' | 'growth' | 'premium';

// Start a subscription checkout for the given tier; returns the hosted Checkout URL.
export async function createCheckoutSession(tier: PaidTier): Promise<string> {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { tier },
  });
  if (error) throw new Error(error.message || 'Failed to start checkout');
  if (!data?.url) throw new Error('No checkout URL returned');
  return data.url as string;
}

// Convenience: send the browser to Stripe Checkout for the given tier.
export async function redirectToCheckout(tier: PaidTier): Promise<void> {
  const url = await createCheckoutSession(tier);
  window.location.href = url;
}

// Get a Stripe Billing Portal URL so the user can manage/cancel their subscription.
export async function getPortalUrl(): Promise<string> {
  const { data, error } = await supabase.functions.invoke('customer-portal', { body: {} });
  if (error) throw new Error(error.message || 'Failed to open billing portal');
  if (!data?.url) throw new Error('No portal URL returned');
  return data.url as string;
}

// Convenience: send the browser to the Stripe Billing Portal.
export async function redirectToPortal(): Promise<void> {
  const url = await getPortalUrl();
  window.location.href = url;
}

export const stripeService = {
  createCheckoutSession,
  redirectToCheckout,
  getPortalUrl,
  redirectToPortal,
};
