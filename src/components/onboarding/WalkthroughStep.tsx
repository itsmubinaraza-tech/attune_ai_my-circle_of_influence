import { useEffect, useState, useRef } from 'react';
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

  // Find target element and calculate position
  useEffect(() => {
    const findAndPosition = () => {
      const target = document.querySelector(step.targetSelector);
      if (!target) {
        // If target not found, center the tooltip
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        setPosition({
          top: viewportHeight / 2 - 150,
          left: viewportWidth / 2 - 180,
        });
        setTargetRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setTargetRect(rect);

      const tooltipWidth = 360;
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
    };

    findAndPosition();

    // Recalculate on resize
    window.addEventListener('resize', findAndPosition);
    return () => window.removeEventListener('resize', findAndPosition);
  }, [step]);

  // Scroll target into view
  useEffect(() => {
    const target = document.querySelector(step.targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
      className="fixed z-[100] w-[360px] max-w-[90vw]"
      style={{ top: position.top, left: position.left }}
    >
      {/* Tooltip card */}
      <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
        {/* Arrow */}
        <div className={getArrowStyles()} />

        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            {step.icon && (
              <span className="text-2xl">{step.icon}</span>
            )}
            <div>
              <span className="text-xs text-purple-400 font-medium">
                {stepNumber} of {totalSteps}
              </span>
              <h3 className="text-lg font-semibold text-white mt-1">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Benefit highlight */}
        {step.benefit && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/70 leading-relaxed">
              <span className="font-medium text-amber-400">Why it matters:</span> {step.benefit}
            </p>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === stepNumber - 1
                  ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500'
                  : i < stepNumber - 1
                  ? 'bg-purple-500/50'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
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
            onClick={onSkip}
            className="text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            Skip tour
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
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
