-- =====================================================================
-- AttuneAI — FRESH PROJECT BOOTSTRAP  (run once in a new Supabase project)
-- =====================================================================
-- Paste this whole file into the new project's SQL Editor and Run.
-- It reconstructs the COMPLETE current schema in one shot:
--   base tables + RLS + triggers, consent/legal tables, Stripe subscription
--   columns + subscription_events, and the corrected `reminders` table.
--
-- NOTE: This supersedes the stale schema.sql (whose `reminders` table had
-- drifted from what the app actually uses). After running this, also:
--   1) Authentication > Providers: enable Email (and Google if used)
--   2) Set edge-function secrets (ANTHROPIC_API_KEY, STRIPE_*). See chat notes.
-- =====================================================================

-- Extensions ----------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums ---------------------------------------------------------------
CREATE TYPE group_type AS ENUM ('work', 'family', 'friends', 'acquaintances');
CREATE TYPE connection_type AS ENUM ('knows', 'works_with', 'related_to');
CREATE TYPE interaction_outcome AS ENUM ('successful', 'partial', 'unsuccessful');
CREATE TYPE consent_type AS ENUM (
  'terms_of_service', 'privacy_policy', 'ai_disclaimer',
  'crisis_resources_acknowledgement', 'data_handling', 'marketing_communications'
);
-- (reminders use TEXT + CHECK below — the old reminder_type enum is intentionally dropped.)

-- =====================================================================
-- PROFILES  (incl. Stripe subscription fields)
-- =====================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'starter', 'growth', 'premium')),
  subscription_status TEXT NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'incomplete')),
  stripe_customer_id TEXT UNIQUE,
  subscription_ends_at TIMESTAMPTZ
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- =====================================================================
-- PEOPLE
-- =====================================================================
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nickname TEXT,
  photo_url TEXT,
  "group" group_type NOT NULL,
  subgroup TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  communication_style JSONB,
  motivations TEXT[],
  "values" TEXT[],
  goals TEXT[],
  notes TEXT,
  last_contact TIMESTAMPTZ,
  relationship_health INTEGER CHECK (relationship_health >= 0 AND relationship_health <= 100),
  is_archived BOOLEAN DEFAULT FALSE NOT NULL
);
CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_group ON people("group");
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own people" ON people FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own people" ON people FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own people" ON people FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own people" ON people FOR DELETE USING (auth.uid() = user_id);

-- =====================================================================
-- PERSON CONNECTIONS
-- =====================================================================
CREATE TABLE person_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  person_a_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  person_b_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  connection_type connection_type NOT NULL,
  notes TEXT,
  UNIQUE(person_a_id, person_b_id)
);
CREATE INDEX idx_connections_person_a ON person_connections(person_a_id);
CREATE INDEX idx_connections_person_b ON person_connections(person_b_id);
ALTER TABLE person_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view connections of own people" ON person_connections FOR SELECT
  USING (EXISTS (SELECT 1 FROM people WHERE id = person_a_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert connections for own people" ON person_connections FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM people WHERE id = person_a_id AND user_id = auth.uid()) AND
    EXISTS (SELECT 1 FROM people WHERE id = person_b_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete connections of own people" ON person_connections FOR DELETE
  USING (EXISTS (SELECT 1 FROM people WHERE id = person_a_id AND user_id = auth.uid()));

-- =====================================================================
-- INTERACTIONS
-- =====================================================================
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  interaction_date TIMESTAMPTZ NOT NULL,
  context TEXT,
  outcome interaction_outcome,
  what_worked TEXT,
  what_didnt_work TEXT,
  mood_before TEXT,
  mood_after TEXT,
  notes TEXT
);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_person_id ON interactions(person_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interactions" ON interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interactions" ON interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interactions" ON interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interactions" ON interactions FOR DELETE USING (auth.uid() = user_id);

-- =====================================================================
-- COACHING SESSIONS
-- =====================================================================
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  mood TEXT,
  outcome_goal TEXT,
  summary TEXT,
  tokens_used INTEGER DEFAULT 0
);
CREATE INDEX idx_coaching_user_id ON coaching_sessions(user_id);
CREATE INDEX idx_coaching_person_id ON coaching_sessions(person_id);
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON coaching_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON coaching_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON coaching_sessions FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================================
-- USER CREDITS  (free tier = 10 / month)
-- =====================================================================
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER DEFAULT 10 NOT NULL,
  credits_total INTEGER DEFAULT 10 NOT NULL,
  reset_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month') NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credits" ON user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON user_credits FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================================
-- REMINDERS  (corrected to match the app — replaces stale schema.sql shape)
-- =====================================================================
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('one_time', 'recurring', 'smart_nudge')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'snoozed', 'dismissed')),
  completed_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  is_smart_nudge BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_scheduled_for ON reminders(scheduled_for);
CREATE INDEX idx_reminders_status ON reminders(status);
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE USING (auth.uid() = user_id);

-- =====================================================================
-- SUBSCRIPTION EVENTS  (Stripe webhook audit log; service role writes only)
-- =====================================================================
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,
  tier TEXT,
  raw JSONB
);
CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_created_at ON subscription_events(created_at DESC);
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription events" ON subscription_events FOR SELECT USING (auth.uid() = user_id);
GRANT SELECT ON subscription_events TO authenticated;

-- =====================================================================
-- CONSENT / LEGAL
-- =====================================================================
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  consent_type consent_type NOT NULL,
  version_hash TEXT NOT NULL,
  document_version TEXT NOT NULL,
  consent_flag BOOLEAN NOT NULL DEFAULT TRUE,
  ip_address INET,
  user_agent TEXT,
  consent_method TEXT DEFAULT 'modal',
  withdrawn_at TIMESTAMPTZ,
  withdrawal_reason TEXT
);
CREATE TABLE legal_document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  document_type consent_type NOT NULL,
  version TEXT NOT NULL,
  version_hash TEXT NOT NULL,
  effective_date DATE NOT NULL,
  title TEXT NOT NULL,
  content_url TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  UNIQUE(document_type, version)
);
CREATE INDEX idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX idx_consent_records_email ON consent_records(email);
CREATE INDEX idx_consent_records_type ON consent_records(consent_type);
CREATE INDEX idx_legal_doc_versions_current ON legal_document_versions(is_current) WHERE is_current = TRUE;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own consent records" ON consent_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own consent records" ON consent_records FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own consent records" ON consent_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view legal document versions" ON legal_document_versions FOR SELECT USING (TRUE);
GRANT SELECT ON legal_document_versions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON consent_records TO authenticated;
GRANT INSERT ON consent_records TO anon;

INSERT INTO legal_document_versions (document_type, version, version_hash, effective_date, title, is_current) VALUES
  ('terms_of_service', '1.0.0', 'tos-v1.0.0-2026-02-11', '2026-02-11', 'Terms of Service', true),
  ('privacy_policy', '1.0.0', 'pp-v1.0.0-2026-02-11', '2026-02-11', 'Privacy Policy', true),
  ('ai_disclaimer', '1.0.0', 'ai-v1.0.0-2026-02-11', '2026-02-11', 'AI Disclaimer', true),
  ('crisis_resources_acknowledgement', '1.0.0', 'cr-v1.0.0-2026-02-11', '2026-02-11', 'Crisis Resources Acknowledgement', true),
  ('data_handling', '1.0.0', 'dh-v1.0.0-2026-02-11', '2026-02-11', 'Data Handling Policy', true);

-- =====================================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create profile + free credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  INSERT INTO public.user_credits (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update people.last_contact when an interaction is logged
CREATE OR REPLACE FUNCTION public.update_last_contact()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.people
  SET last_contact = NEW.interaction_date
  WHERE id = NEW.person_id
    AND (last_contact IS NULL OR last_contact < NEW.interaction_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER update_person_last_contact AFTER INSERT ON interactions
  FOR EACH ROW EXECUTE FUNCTION public.update_last_contact();

-- Link pre-signup consent records to the new user by email
CREATE OR REPLACE FUNCTION public.merge_consent_records_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.consent_records
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_merge_consent AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.merge_consent_records_on_signup();

-- =====================================================================
-- DONE — remember to enable Email auth (and Google if used) in the dashboard.
-- =====================================================================
