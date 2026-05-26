import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Zap, Check, Sparkles, CreditCard, LogOut, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, PROFILE_KEY } from '@/hooks/useProfile';
import { useCreditsInfo } from '@/hooks/useCredits';
import { TIERS, getTier, type TierConfig } from '@/config/tiers';
import { redirectToCheckout, redirectToPortal, type PaidTier } from '@/services/stripe';
import type { SubscriptionTier } from '@/types/database';

const TIER_ORDER: SubscriptionTier[] = ['free', 'starter', 'growth', 'premium'];

const Account = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { remaining, total, daysUntilReset } = useCreditsInfo();

  const [busyTier, setBusyTier] = useState<SubscriptionTier | null>(null);
  const [portalBusy, setPortalBusy] = useState(false);

  const currentTier: SubscriptionTier = profile?.subscription_tier ?? 'free';
  const current = getTier(currentTier);
  const status = profile?.subscription_status ?? 'active';

  // Handle return from Stripe Checkout.
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (!checkout) return;
    if (checkout === 'success') {
      toast.success('Payment received! Your plan is being activated.');
      // Webhook updates the tier asynchronously — refetch shortly.
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      queryClient.invalidateQueries({ queryKey: ['user_credits'] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
        queryClient.invalidateQueries({ queryKey: ['user_credits'] });
      }, 3000);
    } else if (checkout === 'cancelled') {
      toast.info('Checkout cancelled — no changes made.');
    }
    searchParams.delete('checkout');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, queryClient]);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    setBusyTier(tier);
    try {
      await redirectToCheckout(tier as PaidTier);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start checkout');
      setBusyTier(null);
    }
  };

  const handleManageBilling = async () => {
    setPortalBusy(true);
    try {
      await redirectToPortal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not open billing portal');
      setPortalBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const creditsLabel = current.unlimited ? 'Unlimited' : `${remaining} of ${total}`;

  return (
    <div className="min-h-screen">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              aria-label="Back to home"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground/90">Account</h1>
              <p className="text-sm text-foreground/50">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        {/* Current plan summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass p-6 rounded-3xl mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground/90">{current.name} plan</h2>
                  {status !== 'active' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 capitalize">
                      {status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-foreground/60 mt-0.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>{creditsLabel} messages</span>
                  {!current.unlimited && daysUntilReset !== null && daysUntilReset > 0 && (
                    <span className="text-foreground/40">· resets in {daysUntilReset}d</span>
                  )}
                </div>
              </div>
            </div>

            {(currentTier !== 'free' || profile?.stripe_customer_id) && (
              <button
                onClick={handleManageBilling}
                disabled={portalBusy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-foreground/80 text-sm font-medium transition-all disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {portalBusy ? 'Opening…' : 'Manage billing'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Plans */}
        <h3 className="text-lg font-semibold text-foreground/80 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Plans
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIER_ORDER.map((tierId) => {
            const tier: TierConfig = TIERS[tierId];
            const isCurrent = tierId === currentTier;
            const isPaid = tierId !== 'free';
            return (
              <motion.div
                key={tierId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border flex flex-col ${
                  isCurrent
                    ? 'border-purple-400/60 bg-purple-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-foreground/90">{tier.name}</h4>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/30 text-purple-200">
                      Current
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-foreground/90">
                    {tier.priceMonthly === 0 ? 'Free' : `$${tier.priceMonthly}`}
                  </span>
                  {tier.priceMonthly > 0 && <span className="text-sm text-foreground/50">/mo</span>}
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/60">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl text-sm font-medium bg-white/5 text-foreground/40 cursor-default"
                  >
                    Your plan
                  </button>
                ) : isPaid ? (
                  <button
                    onClick={() => handleUpgrade(tierId)}
                    disabled={busyTier !== null}
                    className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
                  >
                    {busyTier === tierId ? 'Redirecting…' : currentTier === 'free' ? 'Upgrade' : 'Switch'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl text-sm font-medium bg-white/5 text-foreground/40 cursor-default"
                  >
                    Included
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {profileLoading && (
          <p className="text-center text-sm text-foreground/40 mt-6">Loading your account…</p>
        )}
      </div>
    </div>
  );
};

export default Account;
