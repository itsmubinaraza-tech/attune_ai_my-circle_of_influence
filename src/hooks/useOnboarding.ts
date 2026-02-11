import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'attune_onboarding_completed';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  benefit: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Every great conversation starts with you',
    description: "Attune is your personal guide for the conversations that matter most — at work, at home, and everywhere in between. Let's take 30 seconds to show you how it works.",
    benefit: 'No scripts. No judgment. Just clarity when you need it most.',
    targetSelector: '[data-onboarding="hero"]',
    position: 'bottom',
    icon: '👋',
  },
  {
    id: 'mood',
    title: 'Start by checking in with yourself',
    description: "How you're feeling shapes how you communicate. Tap your current mood — there's no wrong answer, just honest awareness.",
    benefit: 'Self-awareness is the first step to better conversations.',
    targetSelector: '[data-onboarding="mood-selector"]',
    position: 'bottom',
    icon: '😊',
  },
  {
    id: 'person',
    title: "Who's on your mind?",
    description: "Select someone from your circle — a colleague, family member, or friend. We'll tailor our guidance to your unique relationship.",
    benefit: 'Context matters. The same words land differently with different people.',
    targetSelector: '[data-onboarding="person-search"]',
    position: 'bottom',
    icon: '👤',
  },
  {
    id: 'outcome',
    title: 'What do you want to happen?',
    description: 'Every conversation has a purpose. Are you trying to resolve tension? Build connection? Set a boundary? Pick your goal, and we\'ll help you get there.',
    benefit: 'Clear intentions lead to clear communication.',
    targetSelector: '[data-onboarding="outcome-selector"]',
    position: 'top',
    icon: '🎯',
  },
  {
    id: 'connect',
    title: "You're ready to connect",
    description: "Click the button below to start your conversation with Attune. We'll give you specific phrases, topics to explore, and approaches that work for YOUR situation.",
    benefit: "Real guidance, not generic advice. Let's make this conversation count.",
    targetSelector: '[data-onboarding="connect-button"]',
    position: 'top',
    icon: '✨',
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
