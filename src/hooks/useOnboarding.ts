import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'attune_onboarding_completed';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'mood',
    title: 'How are you feeling?',
    description: 'Start by selecting your current mood. This helps us tailor advice to your emotional state.',
    targetSelector: '[data-onboarding="mood-selector"]',
    position: 'bottom',
  },
  {
    id: 'person',
    title: 'Who do you need to attune to?',
    description: 'Search for someone in your circle or add a new person. We\'ll personalize advice based on your relationship.',
    targetSelector: '[data-onboarding="person-search"]',
    position: 'bottom',
  },
  {
    id: 'outcome',
    title: 'What outcome are you seeking?',
    description: 'Choose what you want to achieve from this conversation - whether it\'s resolving conflict, setting boundaries, or deepening connection.',
    targetSelector: '[data-onboarding="outcome-selector"]',
    position: 'top',
  },
  {
    id: 'connect',
    title: 'Let\'s work through this together',
    description: 'When you\'re ready, click here to start a personalized coaching session with actionable advice.',
    targetSelector: '[data-onboarding="connect-button"]',
    position: 'top',
  },
  {
    id: 'quicktalk',
    title: 'Or talk to me directly',
    description: 'Prefer voice? Tap Quick Talk to speak naturally and get instant guidance - no typing required.',
    targetSelector: '[data-onboarding="quick-talk"]',
    position: 'top',
  },
];

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Check if user has completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    setHasSeenOnboarding(completed === 'true');
  }, []);

  // Start onboarding tour
  const startOnboarding = useCallback(() => {
    setCurrentStepIndex(0);
    setIsOnboardingActive(true);
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStepIndex]);

  // Go to previous step
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Skip to a specific step
  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < onboardingSteps.length) {
      setCurrentStepIndex(index);
    }
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
  }, []);

  // Skip onboarding
  const skipOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
  }, []);

  // Reset onboarding (for "Take a Tour" button)
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSeenOnboarding(false);
    startOnboarding();
  }, [startOnboarding]);

  const currentStep = onboardingSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === onboardingSteps.length - 1;
  const progress = ((currentStepIndex + 1) / onboardingSteps.length) * 100;

  return {
    hasSeenOnboarding,
    isOnboardingActive,
    currentStep,
    currentStepIndex,
    totalSteps: onboardingSteps.length,
    isFirstStep,
    isLastStep,
    progress,
    startOnboarding,
    nextStep,
    prevStep,
    goToStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}
