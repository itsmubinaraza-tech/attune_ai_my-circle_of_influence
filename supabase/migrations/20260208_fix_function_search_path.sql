-- Migration: Fix function search_path security warnings
-- Run this in Supabase SQL Editor to fix the security warnings

-- Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix update_last_contact function
CREATE OR REPLACE FUNCTION public.update_last_contact()
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

-- Fix handle_new_user function (also needs search_path for SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
