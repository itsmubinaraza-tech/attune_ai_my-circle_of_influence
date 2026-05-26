// Supabase Edge Function: Stripe webhook handler.
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt
// (Stripe calls this directly — it must NOT require a Supabase JWT.)
//
// Required secrets:
//   STRIPE_SECRET_KEY      - Stripe secret key
//   STRIPE_WEBHOOK_SECRET  - Signing secret from the Stripe webhook endpoint (whsec_...)
//   STRIPE_PRICE_STARTER / STRIPE_PRICE_GROWTH / STRIPE_PRICE_PREMIUM - Price IDs (for fallback mapping)
// Auto-provided: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno&deno-std=0.168.0';

type Tier = 'free' | 'starter' | 'growth' | 'premium';

// Monthly message allowance per tier. KEEP IN SYNC with src/config/tiers.ts.
const TIER_CREDITS: Record<Tier, number> = {
  free: 10,
  starter: 100,
  growth: 300,
  premium: 999_999, // UNLIMITED_CREDITS sentinel
};

function priceToTier(priceId: string | undefined): Tier | null {
  if (!priceId) return null;
  if (priceId === Deno.env.get('STRIPE_PRICE_STARTER')) return 'starter';
  if (priceId === Deno.env.get('STRIPE_PRICE_GROWTH')) return 'growth';
  if (priceId === Deno.env.get('STRIPE_PRICE_PREMIUM')) return 'premium';
  return null;
}

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Apply a tier change: update the profile and reset the user's credit allowance.
async function applyTier(
  userId: string,
  tier: Tier,
  status: string,
  subscriptionEndsAt: string | null,
) {
  await admin
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_status: status,
      subscription_ends_at: subscriptionEndsAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  const allocation = TIER_CREDITS[tier];
  await admin
    .from('user_credits')
    .update({
      credits_total: allocation,
      credits_remaining: allocation,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
}

serve(async (req) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!stripeKey || !webhookSecret) {
    console.error('Stripe webhook not configured');
    return new Response('Webhook not configured', { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    console.error('Signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotency: record the event; bail if we've already processed it.
  const { error: insertErr } = await admin
    .from('subscription_events')
    .insert({ event_type: event.type, stripe_event_id: event.id });
  if (insertErr) {
    // Unique violation => already handled. Ack so Stripe stops retrying.
    if (insertErr.code === '23505') return new Response('Already processed', { status: 200 });
    console.error('Failed to log subscription event:', insertErr);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.user_id;
        const tier = (session.metadata?.tier as Tier) ?? 'free';
        if (userId) {
          let endsAt: string | null = null;
          if (session.subscription) {
            const sub = await stripe.subscriptions.retrieve(session.subscription as string);
            endsAt = sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null;
          }
          await applyTier(userId, tier, 'active', endsAt);
          await admin
            .from('subscription_events')
            .update({ user_id: userId, tier })
            .eq('stripe_event_id', event.id);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        const tier =
          (sub.metadata?.tier as Tier) ??
          priceToTier(sub.items.data[0]?.price?.id) ??
          'free';
        const status = sub.status === 'active' || sub.status === 'trialing' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : sub.status === 'canceled' ? 'canceled'
          : 'incomplete';
        const endsAt = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        if (userId) await applyTier(userId, status === 'canceled' ? 'free' : tier, status, endsAt);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) await applyTier(userId, 'free', 'canceled', null);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const { data: profile } = await admin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        if (profile?.id) {
          await admin
            .from('profiles')
            .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
            .eq('id', profile.id);
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged without action.
        break;
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return new Response('Handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
