import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'attune_pending_feedback';

interface PendingFeedback {
  sessionId: string;
  personId?: string;
  personName?: string;
  createdAt: string;
  adviceGiven: string;
}

interface FeedbackState {
  pendingFeedback: PendingFeedback[];
}

const getStoredFeedback = (): FeedbackState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading feedback state:', e);
  }
  return { pendingFeedback: [] };
};

const saveFeedbackState = (state: FeedbackState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving feedback state:', e);
  }
};

export function useFeedback() {
  const [state, setState] = useState<FeedbackState>({ pendingFeedback: [] });

  // Load state on mount
  useEffect(() => {
    setState(getStoredFeedback());
  }, []);

  // Mark a session as having pending feedback
  const markFeedbackPending = useCallback((
    sessionId: string,
    adviceGiven: string,
    personId?: string,
    personName?: string
  ) => {
    setState(prev => {
      // Don't add duplicate
      if (prev.pendingFeedback.some(f => f.sessionId === sessionId)) {
        return prev;
      }

      const newState = {
        pendingFeedback: [
          ...prev.pendingFeedback,
          {
            sessionId,
            personId,
            personName,
            adviceGiven,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      saveFeedbackState(newState);
      return newState;
    });
  }, []);

  // Clear pending feedback for a session
  const clearFeedback = useCallback((sessionId: string) => {
    setState(prev => {
      const newState = {
        pendingFeedback: prev.pendingFeedback.filter(f => f.sessionId !== sessionId),
      };
      saveFeedbackState(newState);
      return newState;
    });
  }, []);

  // Get pending feedback for a specific person
  const getPendingForPerson = useCallback((personId: string): PendingFeedback | undefined => {
    return state.pendingFeedback.find(f => f.personId === personId);
  }, [state.pendingFeedback]);

  // Get the most recent pending feedback
  const getMostRecentPending = useCallback((): PendingFeedback | undefined => {
    if (state.pendingFeedback.length === 0) return undefined;
    return state.pendingFeedback.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [state.pendingFeedback]);

  // Check if we should show follow-up prompt (last advice was given more than 1 hour ago)
  const shouldShowFollowUp = useCallback((sessionId: string): boolean => {
    const pending = state.pendingFeedback.find(f => f.sessionId === sessionId);
    if (!pending) return false;

    const hourAgo = Date.now() - 60 * 60 * 1000;
    return new Date(pending.createdAt).getTime() < hourAgo;
  }, [state.pendingFeedback]);

  // Check if any feedback is pending
  const hasPendingFeedback = state.pendingFeedback.length > 0;

  return {
    pendingFeedback: state.pendingFeedback,
    hasPendingFeedback,
    markFeedbackPending,
    clearFeedback,
    getPendingForPerson,
    getMostRecentPending,
    shouldShowFollowUp,
  };
}
