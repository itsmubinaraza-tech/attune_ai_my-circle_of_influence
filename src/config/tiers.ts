import type { SubscriptionTier } from '@/types/database';

/**
 * Subscription tiers — the single source of truth for pricing, monthly message
 * allowances, and which Claude model each tier uses.
 *
 * Prices are LOCKED (set with the product owner): Free $0, Starter $4.99,
 * Growth $9.99, Premium $19.99. Free = 10 messages/month.
 *
 * Monthly message allowances for paid tiers and the model split are TUNABLE —
 * adjust here and the rest of the app (credits allocation, chat enforcement,
 * Account page) follows automatically.
 */

/** Sentinel stored in user_credits for unlimited tiers (numeric column can't hold Infinity). */
export const UNLIMITED_CREDITS = 999_999;

/** Logical model name per tier; mapped to a concrete model id in the chat edge function (A1.6). */
export type TierModel = 'haiku' | 'sonnet';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  /** Price in USD per month (0 for free). */
  priceMonthly: number;
  /** Messages per month. For unlimited tiers this is UNLIMITED_CREDITS; check `unlimited`. */
  monthlyCredits: number;
  unlimited: boolean;
  model: TierModel;
  /** Short marketing bullet points shown on the Account page. */
  features: string[];
  /** Name of the env var holding this tier's Stripe Price ID (paid tiers only). */
  stripePriceEnv?: string;
}

export const TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    monthlyCredits: 10,
    unlimited: false,
    model: 'haiku',
    features: ['10 coaching messages / month', 'Your full circle of influence', 'Conversation history'],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 4.99,
    monthlyCredits: 100,
    unlimited: false,
    model: 'haiku',
    features: ['100 coaching messages / month', 'Everything in Free', 'Priority responses'],
    stripePriceEnv: 'STRIPE_PRICE_STARTER',
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 9.99,
    monthlyCredits: 300,
    unlimited: false,
    model: 'sonnet',
    features: ['300 coaching messages / month', 'Smarter model (Claude Sonnet)', 'Everything in Starter'],
    stripePriceEnv: 'STRIPE_PRICE_GROWTH',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 19.99,
    monthlyCredits: UNLIMITED_CREDITS,
    unlimited: true,
    model: 'sonnet',
    features: ['Unlimited coaching messages', 'Smartest model (Claude Sonnet)', 'Everything in Growth'],
    stripePriceEnv: 'STRIPE_PRICE_PREMIUM',
  },
};

export const PAID_TIERS: SubscriptionTier[] = ['starter', 'growth', 'premium'];

/** Resolve a tier config, defaulting to free for null/unknown input. */
export function getTier(tier: SubscriptionTier | null | undefined): TierConfig {
  return (tier && TIERS[tier]) || TIERS.free;
}

/** Monthly message allowance for a tier (UNLIMITED_CREDITS for unlimited tiers). */
export function getMonthlyCredits(tier: SubscriptionTier | null | undefined): number {
  return getTier(tier).monthlyCredits;
}

/** Whether a tier has no message cap. */
export function isUnlimited(tier: SubscriptionTier | null | undefined): boolean {
  return getTier(tier).unlimited;
}
