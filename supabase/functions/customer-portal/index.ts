// Supabase Edge Function: return a Stripe Billing Portal URL so users can manage
// or cancel their subscription. Deploy with: supabase functions deploy customer-portal
//
// Required secrets: STRIPE_SECRET_KEY, SITE_URL
// Auto-provided: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno&deno-std=0.168.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    if (!token) return json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, 401);

    const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return json({ error: 'No billing account yet', code: 'NO_CUSTOMER' }, 400);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://weattuned.com';

    const portal = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/me`,
    });

    return json({ url: portal.url });
  } catch (err) {
    console.error('customer-portal error:', err);
    return json({ error: 'Failed to open billing portal', code: 'STRIPE_ERROR' }, 500);
  }
});
