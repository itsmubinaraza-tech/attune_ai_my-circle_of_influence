import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as peopleService from '@/services/people';
import type { Person, PersonInsert, PersonUpdate, GroupType } from '@/types/database';

const PEOPLE_KEY = ['people'];

/**
 * Hook to fetch all people
 */
export function usePeople() {
  return useQuery({
    queryKey: PEOPLE_KEY,
    queryFn: peopleService.getPeople,
  });
}

/**
 * Hook to fetch people by group
 */
export function usePeopleByGroup(group: GroupType) {
  return useQuery({
    queryKey: [...PEOPLE_KEY, 'group', group],
    queryFn: () => peopleService.getPeopleByGroup(group),
  });
}

/**
 * Hook to fetch a single person
 */
export function usePerson(id: string | null) {
  return useQuery({
    queryKey: [...PEOPLE_KEY, id],
    queryFn: () => (id ? peopleService.getPersonById(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook to fetch people who need attention
 */
export function usePeopleNeedingAttention(daysThreshold: number = 7) {
  return useQuery({
    queryKey: [...PEOPLE_KEY, 'needsAttention', daysThreshold],
    queryFn: () => peopleService.getPeopleNeedingAttention(daysThreshold),
  });
}

/**
 * Hook to search people
 */
export function useSearchPeople(query: string) {
  return useQuery({
    queryKey: [...PEOPLE_KEY, 'search', query],
    queryFn: () => peopleService.searchPeople(query),
    enabled: query.length >= 2,
  });
}

/**
 * Hook to create a new person
 */
export function useCreatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (person: Omit<PersonInsert, 'user_id'>) =>
      peopleService.createPerson(person),
    onSuccess: () => {
      // Invalidate all people queries
      queryClient.invalidateQueries({ queryKey: PEOPLE_KEY });
    },
  });
}

/**
 * Hook to update a person
 */
export function useUpdatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: PersonUpdate }) =>
      peopleService.updatePerson(id, updates),
    onSuccess: (data) => {
      // Update the cache for this specific person
      queryClient.setQueryData([...PEOPLE_KEY, data.id], data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: PEOPLE_KEY });
    },
  });
}

/**
 * Hook to archive a person
 */
export function useArchivePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: peopleService.archivePerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEOPLE_KEY });
    },
  });
}

/**
 * Hook to delete a person
 */
export function useDeletePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: peopleService.deletePerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEOPLE_KEY });
    },
  });
}

/**
 * Hook to update last contact
 */
export function useUpdateLastContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, date }: { id: string; date?: Date }) =>
      peopleService.updateLastContact(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEOPLE_KEY });
    },
  });
}

/**
 * Hook to seed demo data for new users
 */
export function useSeedDemoData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: peopleService.seedDemoData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEOPLE_KEY });
    },
  });
}

/**
 * Hook to check if user has any people and auto-seed demo data
 */
export function usePeopleWithAutoSeed() {
  const queryClient = useQueryClient();
  const seedMutation = useSeedDemoData();

  return useQuery({
    queryKey: PEOPLE_KEY,
    queryFn: async () => {
      const people = await peopleService.getPeople();

      // Auto-seed demo data for new users with empty circles
      if (people.length === 0 && !seedMutation.isPending) {
        try {
          const seededPeople = await peopleService.seedDemoData();
          return seededPeople;
        } catch (error) {
          console.error('Failed to seed demo data:', error);
          return people;
        }
      }

      return people;
    },
  });
}
