-- Migration: Free-tier credit allowance (Phase 2 / Feature A1.2)
-- Purpose: Align the DB with the new tier model — free tier is 10 messages/month
--          (previously the table default was 30 and the app used 50). New users are
--          created free by the signup trigger, so the column default drives their
--          initial allowance.
-- Date: 2026-05-26

-- 1) New free users start with 10 credits ----------------------------------
ALTER TABLE public.user_credits ALTER COLUMN credits_remaining SET DEFAULT 10;
ALTER TABLE public.user_credits ALTER COLUMN credits_total     SET DEFAULT 10;

-- 2) Align existing free-tier users to the new allowance --------------------
--    (All current accounts are 'free' after A1.1's default.) Never increase a
--    user's remaining balance; only cap it to the new total.
UPDATE public.user_credits uc
SET credits_total = 10,
    credits_remaining = LEAST(uc.credits_remaining, 10),
    updated_at = NOW()
FROM public.profiles p
WHERE p.id = uc.user_id
  AND p.subscription_tier = 'free';
