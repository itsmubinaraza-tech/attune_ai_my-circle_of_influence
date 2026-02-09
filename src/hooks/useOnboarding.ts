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
    title: 'Welcome to Attune',
    description: 'Your personal AI relationship coach that helps you communicate better with the people who matter most.',
    benefit: 'Get personalized advice for any conversation - whether it\'s with family, friends, or colleagues.',
    targetSelector: '[data-onboarding="hero"]',
    position: 'bottom',
    icon: '👋',
  },
  {
    id: 'mood',
    title: 'Step 1: Check in with yourself',
    description: 'Select your current mood. Are you feeling calm, anxious, frustrated, or hopeful?',
    benefit: 'Understanding your emotional state helps us give you advice that matches how you\'re feeling right now.',
    targetSelector: '[data-onboarding="mood-selector"]',
    position: 'bottom',
    icon: '😊',
  },
  {
    id: 'person',
    title: 'Step 2: Choose who you need to talk to',
    description: 'Search for someone in your circle or add a new person. We\'ll personalize advice based on your relationship.',
    benefit: 'The more we know about your relationship, the more specific and helpful our guidance becomes.',
    targetSelector: '[data-onboarding="person-search"]',
    position: 'bottom',
    icon: '👤',
  },
  {
    id: 'outcome',
    title: 'Step 3: Define your goal',
    description: 'What do you want to achieve? Resolve a conflict? Set boundaries? Deepen your connection?',
    benefit: 'Clear goals lead to clear advice. We\'ll guide you toward the outcome you\'re seeking.',
    targetSelector: '[data-onboarding="outcome-selector"]',
    position: 'top',
    icon: '🎯',
  },
  {
    id: 'connect',
    title: 'Step 4: Get personalized guidance',
    description: 'Click "Let\'s Connect" to start your coaching session with actionable advice tailored to your situation.',
    benefit: 'Receive specific phrases to use, topics to address, and approaches that work for your relationship.',
    targetSelector: '[data-onboarding="connect-button"]',
    position: 'top',
    icon: '✨',
  },
  {
    id: 'circle',
    title: 'Your Circle of Influence',
    description: 'View all your important relationships organized by group - work, family, friends, and acquaintances.',
    benefit: 'See relationship health at a glance and identify connections that need nurturing.',
    targetSelector: '[data-onboarding="circle-widget"]',
    position: 'left',
    icon: '🔵',
  },
  {
    id: 'attention',
    title: 'Relationships That Need Attention',
    description: 'We track when you last connected with each person and highlight those who might be feeling neglected.',
    benefit: 'Never lose touch with important people. A quick check-in can strengthen any relationship.',
    targetSelector: '[data-onboarding="needs-attention"]',
    position: 'top',
    icon: '💛',
  },
  {
    id: 'quicktalk',
    title: 'Quick Talk - Voice-First Guidance',
    description: 'Tap the floating microphone to speak naturally and get instant guidance - no typing required.',
    benefit: 'Perfect for when you need advice on-the-go or prefer talking over typing.',
    targetSelector: '[data-onboarding="quick-talk"]',
    position: 'top',
    icon: '🎤',
  },
  {
    id: 'theme',
    title: 'Make It Yours',
    description: 'Choose a theme that suits your style - from warm earth tones to calming ocean depths.',
    benefit: 'A personalized look makes the app feel like home and helps you relax while getting guidance.',
    targetSelector: '[data-onboarding="theme-selector"]',
    position: 'bottom',
    icon: '🎨',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You now know everything you need to start building stronger relationships with Attune.',
    benefit: 'Remember: You can always click "Take a Tour" to see this walkthrough again.',
    targetSelector: '[data-onboarding="hero"]',
    position: 'bottom',
    icon: '🎉',
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
