import { useQuery } from '@tanstack/react-query';
import {
  getRelationshipSummary,
  getCircleInsights,
  generateAISummary,
  type RelationshipSummary,
  type CircleInsights,
} from '@/services/summaries';

// Query keys
export const summaryKeys = {
  all: ['summaries'] as const,
  relationship: (personId: string) => [...summaryKeys.all, 'relationship', personId] as const,
  circle: () => [...summaryKeys.all, 'circle'] as const,
  ai: (personId: string) => [...summaryKeys.all, 'ai', personId] as const,
};

// Get relationship summary for a person
export function useRelationshipSummary(personId: string | null) {
  return useQuery({
    queryKey: personId ? summaryKeys.relationship(personId) : ['disabled'],
    queryFn: () => personId ? getRelationshipSummary(personId) : null,
    enabled: !!personId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get circle insights
export function useCircleInsights() {
  return useQuery({
    queryKey: summaryKeys.circle(),
    queryFn: getCircleInsights,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get AI-generated summary for a person
export function useAISummary(personId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: personId ? summaryKeys.ai(personId) : ['disabled'],
    queryFn: () => personId ? generateAISummary(personId) : null,
    enabled: !!personId && enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes (AI summaries don't need frequent refresh)
    retry: false, // Don't retry AI calls on failure
  });
}
