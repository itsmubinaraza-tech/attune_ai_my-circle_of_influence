import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatService from '../services/chat';
import type { ChatMessage, CoachingSessionUpdate } from '../services/chat';

const SESSIONS_KEY = ['coaching_sessions'];

// Get all sessions
export function useSessions() {
  return useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: chatService.getSessions,
  });
}

// Get a single session by ID
export function useSession(sessionId: string | null) {
  return useQuery({
    queryKey: [...SESSIONS_KEY, sessionId],
    queryFn: () => sessionId ? chatService.getSession(sessionId) : null,
    enabled: !!sessionId,
  });
}

// Get sessions for a specific person
export function useSessionsForPerson(personId: string | null) {
  return useQuery({
    queryKey: [...SESSIONS_KEY, 'person', personId],
    queryFn: () => personId ? chatService.getSessionsForPerson(personId) : [],
    enabled: !!personId,
  });
}

// Get most recent session
export function useMostRecentSession() {
  return useQuery({
    queryKey: [...SESSIONS_KEY, 'recent'],
    queryFn: chatService.getMostRecentSession,
  });
}

// Create a new session
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });
}

// Update a session
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, updates }: { sessionId: string; updates: CoachingSessionUpdate }) =>
      chatService.updateSession(sessionId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: [...SESSIONS_KEY, variables.sessionId] });
    },
  });
}

// Delete a session
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });
}

// Hook for managing a chat conversation
export function useChatConversation(sessionId: string | null) {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSession(sessionId);
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const messages = session ? chatService.parseMessages(session.messages) : [];

  const addMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];

    if (sessionId && session) {
      await updateSession.mutateAsync({
        sessionId,
        updates: { messages: updatedMessages },
      });
    }

    return newMessage;
  };

  return {
    session,
    messages,
    isLoading,
    addMessage,
    createSession: createSession.mutateAsync,
    updateSession: updateSession.mutateAsync,
  };
}
