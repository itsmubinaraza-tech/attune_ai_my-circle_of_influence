import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'attune_anonymous_usage';
const MAX_FREE_MESSAGES = 10;

interface AnonymousUsage {
  messageCount: number;
  firstUsed: string;
  deviceId: string;
}

// Generate a simple device fingerprint
const generateDeviceId = (): string => {
  const nav = window.navigator;
  const screen = window.screen;
  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'anon_' + Math.abs(hash).toString(36);
};

const getStoredUsage = (): AnonymousUsage | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading anonymous usage from storage:', e);
  }
  return null;
};

const saveUsage = (usage: AnonymousUsage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch (e) {
    console.error('Error saving anonymous usage to storage:', e);
  }
};

export function useAnonymousCredits() {
  const [usage, setUsage] = useState<AnonymousUsage | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize usage on mount
  useEffect(() => {
    let storedUsage = getStoredUsage();

    if (!storedUsage) {
      storedUsage = {
        messageCount: 0,
        firstUsed: new Date().toISOString(),
        deviceId: generateDeviceId(),
      };
      saveUsage(storedUsage);
    }

    setUsage(storedUsage);
    setIsInitialized(true);
  }, []);

  // Increment message count
  const useCredit = useCallback((): boolean => {
    if (!usage) return false;

    if (usage.messageCount >= MAX_FREE_MESSAGES) {
      return false; // No credits left
    }

    const newUsage = {
      ...usage,
      messageCount: usage.messageCount + 1,
    };

    saveUsage(newUsage);
    setUsage(newUsage);
    return true;
  }, [usage]);

  // Check if user has credits remaining
  const hasCredits = usage ? usage.messageCount < MAX_FREE_MESSAGES : true;

  // Get remaining credits
  const remainingCredits = usage ? MAX_FREE_MESSAGES - usage.messageCount : MAX_FREE_MESSAGES;

  // Check if user has used any credits (for showing upgrade prompt)
  const hasUsedCredits = usage ? usage.messageCount > 0 : false;

  // Check if limit reached
  const limitReached = usage ? usage.messageCount >= MAX_FREE_MESSAGES : false;

  // Reset usage (for testing purposes)
  const resetUsage = useCallback(() => {
    const newUsage = {
      messageCount: 0,
      firstUsed: new Date().toISOString(),
      deviceId: usage?.deviceId || generateDeviceId(),
    };
    saveUsage(newUsage);
    setUsage(newUsage);
  }, [usage?.deviceId]);

  return {
    isInitialized,
    messageCount: usage?.messageCount ?? 0,
    remainingCredits,
    maxCredits: MAX_FREE_MESSAGES,
    hasCredits,
    hasUsedCredits,
    limitReached,
    useCredit,
    resetUsage,
    deviceId: usage?.deviceId ?? '',
  };
}
