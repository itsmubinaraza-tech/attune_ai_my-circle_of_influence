import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Lightbulb } from 'lucide-react';
import type { OnboardingStep } from '@/hooks/useOnboarding';

interface WalkthroughStepProps {
  step: OnboardingStep;
  stepNumber: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function WalkthroughStep({
  step,
  stepNumber,
  totalSteps,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
}: WalkthroughStepProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 10;
  const retryDelay = 200;

  // Position calculation function
  const calculatePosition = useCallback((target: Element) => {
    const rect = target.getBoundingClientRect();
    setTargetRect(rect);

    const tooltipWidth = Math.min(360, window.innerWidth * 0.9);
    const tooltipHeight = 280;
    const padding = 16;
    const arrowOffset = 12;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'bottom':
        top = rect.bottom + arrowOffset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = rect.top - tooltipHeight - arrowOffset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - arrowOffset;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + arrowOffset;
        break;
    }

    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < padding) left = padding;
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipHeight > viewportHeight - padding) {
      top = viewportHeight - tooltipHeight - padding;
    }

    setPosition({ top, left });
  }, [step.position]);

  // Find target element and calculate position with retry logic
  useEffect(() => {
    retryCountRef.current = 0;

    const findAndPosition = () => {
      const target = document.querySelector(step.targetSelector);
      if (target) {
        calculatePosition(target);
        retryCountRef.current = 0;
        return true;
      }

      // If target not found and we haven't exceeded retries, try again
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(findAndPosition, retryDelay);
        return false;
      }

      // After all retries, center the tooltip
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      setPosition({
        top: viewportHeight / 2 - 150,
        left: viewportWidth / 2 - 180,
      });
      setTargetRect(null);
      return false;
    };

    // Use requestAnimationFrame before initial search
    requestAnimationFrame(() => {
      findAndPosition();
    });

    // Recalculate on resize
    const handleResize = () => {
      const target = document.querySelector(step.targetSelector);
      if (target) {
        calculatePosition(target);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [step, calculatePosition]);

  // Scroll target into view
  useEffect(() => {
    const scrollToTarget = () => {
      const target = document.querySelector(step.targetSelector);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Delay scroll slightly to ensure element is rendered
    requestAnimationFrame(scrollToTarget);
  }, [step.targetSelector]);

  const getArrowStyles = () => {
    if (!targetRect) return 'hidden';
    const arrowBase = 'absolute w-0 h-0 border-8 border-transparent';
    switch (step.position) {
      case 'bottom':
        return `${arrowBase} -top-4 left-1/2 -translate-x-1/2 border-b-black/90`;
      case 'top':
        return `${arrowBase} -bottom-4 left-1/2 -translate-x-1/2 border-t-black/90`;
      case 'left':
        return `${arrowBase} -right-4 top-1/2 -translate-y-1/2 border-l-black/90`;
      case 'right':
        return `${arrowBase} -left-4 top-1/2 -translate-y-1/2 border-r-black/90`;
    }
  };

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed z-[100] w-[90vw] max-w-[360px]"
      style={{ top: position.top, left: position.left }}
    >
      {/* Tooltip card */}
      <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/10">
        {/* Arrow */}
        <div className={getArrowStyles()} />

        {/* Header with Skip Tour button */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-purple-400 font-medium">
            Step {stepNumber} of {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium text-white/80 hover:text-white"
            aria-label="Skip tour"
          >
            <X className="w-3 h-3" />
            Skip Tour
          </button>
        </div>

        {/* Title with icon */}
        <div className="flex items-start gap-3 mb-3">
          {step.icon && (
            <span className="text-2xl flex-shrink-0">{step.icon}</span>
          )}
          <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">{step.title}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed mb-3">
          {step.description}
        </p>

        {/* Benefit highlight */}
        {step.benefit && (
          <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/70 leading-relaxed">
              {step.benefit}
            </p>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === stepNumber - 1
                  ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500'
                  : i < stepNumber - 1
                  ? 'w-2 bg-purple-500/50'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              isFirst
                ? 'text-white/30 cursor-not-allowed'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-1 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
          >
            {isLast ? 'Get Started!' : 'Next'}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Highlight ring around target */}
      {targetRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed pointer-events-none"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: 16,
            border: '2px solid rgba(168, 85, 247, 0.6)',
            boxShadow: '0 0 0 6px rgba(168, 85, 247, 0.15), 0 0 30px rgba(168, 85, 247, 0.4)',
          }}
        />
      )}
    </motion.div>
  );
}

export default WalkthroughStep;
