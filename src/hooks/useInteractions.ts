import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInteractionsForPerson,
  getAllInteractions,
  getRecentInteractions,
  getInteraction,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  getInteractionStats,
  type Interaction,
  type InteractionInsert,
  type InteractionUpdate,
} from '@/services/interactions';

// Query keys
export const interactionKeys = {
  all: ['interactions'] as const,
  lists: () => [...interactionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...interactionKeys.lists(), filters] as const,
  forPerson: (personId: string) => [...interactionKeys.all, 'person', personId] as const,
  recent: (limit: number) => [...interactionKeys.all, 'recent', limit] as const,
  details: () => [...interactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...interactionKeys.details(), id] as const,
  stats: (personId: string) => [...interactionKeys.all, 'stats', personId] as const,
};

// Get all interactions for a person
export function usePersonInteractions(personId: string | null) {
  return useQuery({
    queryKey: personId ? interactionKeys.forPerson(personId) : ['disabled'],
    queryFn: () => personId ? getInteractionsForPerson(personId) : [],
    enabled: !!personId,
  });
}

// Get all interactions for current user
export function useAllInteractions() {
  return useQuery({
    queryKey: interactionKeys.lists(),
    queryFn: getAllInteractions,
  });
}

// Get recent interactions
export function useRecentInteractions(limit: number = 10) {
  return useQuery({
    queryKey: interactionKeys.recent(limit),
    queryFn: () => getRecentInteractions(limit),
  });
}

// Get single interaction
export function useInteraction(id: string | null) {
  return useQuery({
    queryKey: id ? interactionKeys.detail(id) : ['disabled'],
    queryFn: () => id ? getInteraction(id) : null,
    enabled: !!id,
  });
}

// Get interaction statistics for a person
export function useInteractionStats(personId: string | null) {
  return useQuery({
    queryKey: personId ? interactionKeys.stats(personId) : ['disabled'],
    queryFn: () => personId ? getInteractionStats(personId) : null,
    enabled: !!personId,
  });
}

// Create interaction mutation
export function useCreateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interaction: Omit<InteractionInsert, 'user_id'>) =>
      createInteraction(interaction),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: interactionKeys.all });
      queryClient.invalidateQueries({ queryKey: interactionKeys.forPerson(data.person_id) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.stats(data.person_id) });
      // Also invalidate people query to refresh relationship health
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

// Update interaction mutation
export function useUpdateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: InteractionUpdate }) =>
      updateInteraction(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.all });
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.forPerson(data.person_id) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.stats(data.person_id) });
    },
  });
}

// Delete interaction mutation
export function useDeleteInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInteraction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.all });
    },
  });
}
