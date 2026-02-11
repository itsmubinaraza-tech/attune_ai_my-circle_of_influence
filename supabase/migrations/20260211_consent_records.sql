-- Migration: Consent Records System
-- Purpose: Track user consent for Terms of Service, Privacy Policy, and legal documents
-- Date: 2026-02-11

-- consent_type enum for different types of legal documents
CREATE TYPE public.consent_type AS ENUM (
  'terms_of_service',
  'privacy_policy',
  'ai_disclaimer',
  'crisis_resources_acknowledgement',
  'data_handling',
  'marketing_communications'
);

-- consent_records table to store user consent history
CREATE TABLE public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  consent_type consent_type NOT NULL,
  version_hash TEXT NOT NULL,
  document_version TEXT NOT NULL,
  consent_flag BOOLEAN NOT NULL DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  consent_method TEXT DEFAULT 'modal',
  withdrawn_at TIMESTAMPTZ,
  withdrawal_reason TEXT
);

-- legal_document_versions table to track document versions
CREATE TABLE public.legal_document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  document_type consent_type NOT NULL,
  version TEXT NOT NULL,
  version_hash TEXT NOT NULL,
  effective_date DATE NOT NULL,
  title TEXT NOT NULL,
  content_url TEXT,
  is_current BOOLEAN DEFAULT false,
  UNIQUE(document_type, version)
);

-- Create indexes for performance
CREATE INDEX idx_consent_records_user_id ON public.consent_records(user_id);
CREATE INDEX idx_consent_records_email ON public.consent_records(email);
CREATE INDEX idx_consent_records_consent_type ON public.consent_records(consent_type);
CREATE INDEX idx_consent_records_created_at ON public.consent_records(created_at DESC);
CREATE INDEX idx_legal_document_versions_type ON public.legal_document_versions(document_type);
CREATE INDEX idx_legal_document_versions_current ON public.legal_document_versions(is_current) WHERE is_current = true;

-- Enable RLS
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_document_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consent_records
-- Users can view their own consent records
CREATE POLICY "Users can view own consent records"
  ON public.consent_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own consent records
CREATE POLICY "Users can create own consent records"
  ON public.consent_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own consent records (for withdrawal)
CREATE POLICY "Users can update own consent records"
  ON public.consent_records
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for legal_document_versions
-- Everyone can read legal document versions (public information)
CREATE POLICY "Anyone can view legal document versions"
  ON public.legal_document_versions
  FOR SELECT
  USING (true);

-- Function to merge consent records when user signs up
-- (Associates pre-signup consent with user account)
CREATE OR REPLACE FUNCTION public.merge_consent_records_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update any consent records with matching email to link to the new user
  UPDATE public.consent_records
  SET user_id = NEW.id
  WHERE email = NEW.email
    AND user_id IS NULL;

  RETURN NEW;
END;
$$;

-- Trigger to run merge function after user signup
CREATE TRIGGER on_auth_user_created_merge_consent
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.merge_consent_records_on_signup();

-- Insert initial document versions
INSERT INTO public.legal_document_versions (document_type, version, version_hash, effective_date, title, is_current) VALUES
  ('terms_of_service', '1.0.0', 'tos-v1.0.0-2026-02-11', '2026-02-11', 'Terms of Service', true),
  ('privacy_policy', '1.0.0', 'pp-v1.0.0-2026-02-11', '2026-02-11', 'Privacy Policy', true),
  ('ai_disclaimer', '1.0.0', 'ai-v1.0.0-2026-02-11', '2026-02-11', 'AI Disclaimer', true),
  ('crisis_resources_acknowledgement', '1.0.0', 'cr-v1.0.0-2026-02-11', '2026-02-11', 'Crisis Resources Acknowledgement', true),
  ('data_handling', '1.0.0', 'dh-v1.0.0-2026-02-11', '2026-02-11', 'Data Handling Policy', true);

-- Grant necessary permissions
GRANT SELECT ON public.legal_document_versions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.consent_records TO authenticated;
GRANT INSERT ON public.consent_records TO anon;
