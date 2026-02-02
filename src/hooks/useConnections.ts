import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as connectionsService from '@/services/connections';
import type { ConnectionType } from '@/types/database';

const CONNECTIONS_KEY = ['connections'];

/**
 * Hook to fetch all connections
 */
export function useConnections() {
  return useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: connectionsService.getConnections,
  });
}

/**
 * Hook to fetch connections for a specific person
 */
export function useConnectionsForPerson(personId: string | null) {
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, 'person', personId],
    queryFn: () => (personId ? connectionsService.getConnectionsForPerson(personId) : []),
    enabled: !!personId,
  });
}

/**
 * Hook to fetch a single connection
 */
export function useConnection(id: string | null) {
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, id],
    queryFn: () => (id ? connectionsService.getConnectionById(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook to create a connection
 */
export function useCreateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connection: connectionsService.ConnectionInsert) =>
      connectionsService.createConnection(connection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
}

/**
 * Hook to update a connection
 */
export function useUpdateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: connectionsService.ConnectionUpdate }) =>
      connectionsService.updateConnection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
}

/**
 * Hook to delete a connection
 */
export function useDeleteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectionsService.deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
}
