-- Attune Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE group_type AS ENUM ('work', 'family', 'friends', 'acquaintances');
CREATE TYPE connection_type AS ENUM ('knows', 'works_with', 'related_to');
CREATE TYPE interaction_outcome AS ENUM ('successful', 'partial', 'unsuccessful');
CREATE TYPE reminder_type AS ENUM ('user_set', 'smart_nudge');

-- ============================================
-- PROFILES TABLE
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- PEOPLE TABLE
-- ============================================

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

-- Create index for faster queries
CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_group ON people("group");

-- Enable RLS
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- People policies
CREATE POLICY "Users can view own people" ON people
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own people" ON people
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own people" ON people
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own people" ON people
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PERSON CONNECTIONS TABLE
-- ============================================

CREATE TABLE person_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  person_a_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  person_b_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  connection_type connection_type NOT NULL,
  notes TEXT,
  UNIQUE(person_a_id, person_b_id)
);

-- Create indexes
CREATE INDEX idx_connections_person_a ON person_connections(person_a_id);
CREATE INDEX idx_connections_person_b ON person_connections(person_b_id);

-- Enable RLS
ALTER TABLE person_connections ENABLE ROW LEVEL SECURITY;

-- Connection policies (users can manage connections between their own people)
CREATE POLICY "Users can view connections of own people" ON person_connections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM people WHERE id = person_a_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert connections for own people" ON person_connections
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM people WHERE id = person_a_id AND user_id = auth.uid()) AND
    EXISTS (SELECT 1 FROM people WHERE id = person_b_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete connections of own people" ON person_connections
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM people WHERE id = person_a_id AND user_id = auth.uid())
  );

-- ============================================
-- INTERACTIONS TABLE
-- ============================================

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

-- Create indexes
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_person_id ON interactions(person_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);

-- Enable RLS
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Interaction policies
CREATE POLICY "Users can view own interactions" ON interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" ON interactions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COACHING SESSIONS TABLE
-- ============================================

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

-- Create indexes
CREATE INDEX idx_coaching_user_id ON coaching_sessions(user_id);
CREATE INDEX idx_coaching_person_id ON coaching_sessions(person_id);

-- Enable RLS
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Coaching session policies
CREATE POLICY "Users can view own sessions" ON coaching_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON coaching_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON coaching_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- USER CREDITS TABLE
-- ============================================

CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER DEFAULT 30 NOT NULL,
  credits_total INTEGER DEFAULT 30 NOT NULL,
  reset_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month') NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Credits policies
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- REMINDERS TABLE
-- ============================================

CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  reminder_date TIMESTAMPTZ NOT NULL,
  message TEXT,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  reminder_type reminder_type NOT NULL
);

-- Create indexes
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date);

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Reminder policies
CREATE POLICY "Users can view own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.user_credits (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update last_contact when interaction is logged
CREATE OR REPLACE FUNCTION update_last_contact()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.people
  SET last_contact = NEW.interaction_date
  WHERE id = NEW.person_id
    AND (last_contact IS NULL OR last_contact < NEW.interaction_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

CREATE TRIGGER update_person_last_contact
  AFTER INSERT ON interactions
  FOR EACH ROW EXECUTE FUNCTION update_last_contact();

-- ============================================
-- DONE!
-- ============================================
-- After running this schema, your database is ready.
-- Make sure to enable Email Auth in Authentication settings.
