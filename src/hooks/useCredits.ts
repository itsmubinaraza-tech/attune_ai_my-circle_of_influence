import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as creditsService from '@/services/credits';

const CREDITS_KEY = ['user_credits'];

// Get user credits
export function useCredits() {
  return useQuery({
    queryKey: CREDITS_KEY,
    queryFn: creditsService.getCredits,
  });
}

// Use credits mutation
export function useUseCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount?: number) => creditsService.useCredits(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREDITS_KEY });
    },
  });
}

// Check if user has credits
export function useHasCredits(amount: number = 1) {
  const { data: credits } = useCredits();
  return credits ? credits.credits_remaining >= amount : false;
}

// Add bonus credits mutation
export function useAddBonusCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creditsService.addBonusCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREDITS_KEY });
    },
  });
}

// Get credits info with computed values
export function useCreditsInfo() {
  const { data: credits, isLoading, error } = useCredits();

  const remaining = credits?.credits_remaining ?? 0;
  const total = credits?.credits_total ?? creditsService.DEFAULT_MONTHLY_CREDITS;
  const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const daysUntilReset = credits?.reset_date
    ? creditsService.getDaysUntilReset(credits.reset_date)
    : null;
  const isLow = remaining <= 10;
  const isEmpty = remaining === 0;

  return {
    credits,
    remaining,
    total,
    percentage,
    daysUntilReset,
    isLow,
    isEmpty,
    isLoading,
    error,
  };
}
