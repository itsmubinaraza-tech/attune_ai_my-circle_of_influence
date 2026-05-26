-- Migration: Stripe Subscriptions (Phase 2 / Feature A1.1)
-- Purpose: Add subscription state to profiles + an idempotent event log for Stripe webhooks
-- Date: 2026-05-26
--
-- Tiers (see src/config/tiers.ts): free | starter | growth | premium
-- Status mirrors Stripe subscription status: active | past_due | canceled | incomplete

-- 1) Subscription columns on profiles ---------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier   TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS stripe_customer_id  TEXT,
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- Constrain to known values (guards against typos from webhook handlers)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_tier_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_subscription_tier_check
      CHECK (subscription_tier IN ('free', 'starter', 'growth', 'premium'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_subscription_status_check
      CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'incomplete'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_stripe_customer_id_key'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_stripe_customer_id_key UNIQUE (stripe_customer_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- 2) subscription_events: append-only audit log for Stripe webhooks ----------
--    Written exclusively by the stripe-webhook edge function (service role,
--    which bypasses RLS). stripe_event_id is UNIQUE for idempotent processing.
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,
  tier            TEXT,
  raw             JSONB
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id
  ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at
  ON public.subscription_events(created_at DESC);

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Users may read their own billing history; inserts come from the service role only.
DROP POLICY IF EXISTS "Users can view own subscription events" ON public.subscription_events;
CREATE POLICY "Users can view own subscription events"
  ON public.subscription_events
  FOR SELECT
  USING (auth.uid() = user_id);

GRANT SELECT ON public.subscription_events TO authenticated;
