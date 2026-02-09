import { AnimatePresence, motion } from 'framer-motion';
import { useOnboarding } from '@/hooks/useOnboarding';
import { WalkthroughStep } from './WalkthroughStep';

interface WalkthroughOverlayProps {
  onComplete?: () => void;
}

export function WalkthroughOverlay({ onComplete }: WalkthroughOverlayProps) {
  const {
    isOnboardingActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
  } = useOnboarding();

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      onComplete?.();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    onComplete?.();
  };

  if (!isOnboardingActive || !currentStep) return null;

  return (
    <>
      {/* Dark overlay with cutout for target */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={handleSkip}
      />

      {/* Walkthrough step tooltip */}
      <AnimatePresence mode="wait">
        <WalkthroughStep
          key={currentStep.id}
          step={currentStep}
          stepNumber={currentStepIndex + 1}
          totalSteps={totalSteps}
          isFirst={isFirstStep}
          isLast={isLastStep}
          onNext={handleNext}
          onPrev={prevStep}
          onSkip={handleSkip}
        />
      </AnimatePresence>
    </>
  );
}

export default WalkthroughOverlay;
