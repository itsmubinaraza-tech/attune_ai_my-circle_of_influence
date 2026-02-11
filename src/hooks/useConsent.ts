import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as consentService from '@/services/consent';
import type { ConsentType } from '@/services/consent';

const CONSENT_KEY = ['consent'];

/**
 * Hook to get all current document versions
 */
export function useDocumentVersions() {
  return useQuery({
    queryKey: [...CONSENT_KEY, 'versions'],
    queryFn: consentService.getAllCurrentDocumentVersions,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

/**
 * Hook to get a specific document version
 */
export function useDocumentVersion(documentType: ConsentType) {
  return useQuery({
    queryKey: [...CONSENT_KEY, 'version', documentType],
    queryFn: () => consentService.getCurrentDocumentVersion(documentType),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

/**
 * Hook to check if user has consented to a specific document
 */
export function useHasConsented(consentType: ConsentType, userId?: string) {
  return useQuery({
    queryKey: [...CONSENT_KEY, 'hasConsented', consentType, userId],
    queryFn: () => consentService.hasUserConsented(consentType, userId),
    enabled: !!userId,
  });
}

/**
 * Hook to check if user has all required consents
 */
export function useHasAllRequiredConsents(userId?: string) {
  return useQuery({
    queryKey: [...CONSENT_KEY, 'hasAllRequired', userId],
    queryFn: () => consentService.hasAllRequiredConsents(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to get user's consent history
 */
export function useConsentHistory(userId?: string) {
  return useQuery({
    queryKey: [...CONSENT_KEY, 'history', userId],
    queryFn: () => consentService.getConsentHistory(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to record consent
 */
export function useRecordConsent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: consentService.recordConsent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSENT_KEY });
    },
  });
}

/**
 * Hook to record all required consents at once
 */
export function useRecordAllConsents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => consentService.recordAllRequiredConsents(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSENT_KEY });
    },
  });
}

/**
 * Hook to withdraw consent
 */
export function useWithdrawConsent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ consentType, reason }: { consentType: ConsentType; reason?: string }) =>
      consentService.withdrawConsent(consentType, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSENT_KEY });
    },
  });
}
