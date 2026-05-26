// Supabase Edge Function: create a Stripe Checkout Session for a subscription tier.
// Deploy with: supabase functions deploy create-checkout
//
// Required secrets (supabase secrets set ...):
//   STRIPE_SECRET_KEY        - Stripe secret key (sk_test_... in test mode)
//   STRIPE_PRICE_STARTER     - Stripe Price ID for the Starter plan
//   STRIPE_PRICE_GROWTH      - Stripe Price ID for the Growth plan
//   STRIPE_PRICE_PREMIUM     - Stripe Price ID for the Premium plan
//   SITE_URL                 - Base URL for success/cancel redirects (e.g. https://weattuned.com)
// Auto-provided by Supabase: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno&deno-std=0.168.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Tier = 'starter' | 'growth' | 'premium';

const PRICE_ENV: Record<Tier, string> = {
  starter: 'STRIPE_PRICE_STARTER',
  growth: 'STRIPE_PRICE_GROWTH',
  premium: 'STRIPE_PRICE_PREMIUM',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return json({ error: 'Billing not configured', code: 'CONFIG_ERROR' }, 500);

    // Identify the user from their Supabase JWT.
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, 401);

    const { tier } = (await req.json()) as { tier?: Tier };
    if (!tier || !(tier in PRICE_ENV)) return json({ error: 'Invalid tier', code: 'BAD_REQUEST' }, 400);

    const priceId = Deno.env.get(PRICE_ENV[tier]);
    if (!priceId) return json({ error: `Price not configured for ${tier}`, code: 'CONFIG_ERROR' }, 500);

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Service-role client to read/persist the Stripe customer mapping (bypasses RLS).
    const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://weattuned.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/me?checkout=success`,
      cancel_url: `${siteUrl}/me?checkout=cancelled`,
      metadata: { user_id: user.id, tier },
      subscription_data: { metadata: { user_id: user.id, tier } },
      allow_promotion_codes: true,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('create-checkout error:', err);
    return json({ error: 'Failed to create checkout session', code: 'STRIPE_ERROR' }, 500);
  }
});
