import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scrollingOutcomes = [
  { text: 'deepen connection', color: 'from-pink-400 to-rose-400' },
  { text: 'repair a relationship', color: 'from-purple-400 to-indigo-400' },
  { text: 'set healthy boundaries', color: 'from-teal-400 to-cyan-400' },
  { text: 'express your feelings', color: 'from-amber-400 to-orange-400' },
  { text: 'resolve conflict', color: 'from-blue-400 to-indigo-400' },
  { text: 'show appreciation', color: 'from-green-400 to-emerald-400' },
  { text: 'have difficult conversations', color: 'from-red-400 to-pink-400' },
  { text: 'build trust', color: 'from-violet-400 to-purple-400' },
];

const relationships = ['family', 'coworkers', 'friends', 'partner', 'boss', 'team'];

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [currentOutcomeIndex, setCurrentOutcomeIndex] = useState(0);
  const [currentRelationshipIndex, setCurrentRelationshipIndex] = useState(0);

  // Rotate outcomes every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOutcomeIndex((prev) => (prev + 1) % scrollingOutcomes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate relationships every 2.5 seconds (offset from outcomes)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRelationshipIndex((prev) => (prev + 1) % relationships.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentOutcome = scrollingOutcomes[currentOutcomeIndex];
  const currentRelationship = relationships[currentRelationshipIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-6 sm:py-8 lg:py-12"
    >
      {/* Main headline */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground/90 leading-tight mb-4">
        Practical advice to talk to your{' '}
        <span className="relative inline-block min-w-[120px] sm:min-w-[150px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentRelationship}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {currentRelationship}
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>

      {/* Scrolling outcomes */}
      <div className="h-12 sm:h-14 lg:h-16 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOutcome.text}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2"
          >
            <span className="text-foreground/50 text-lg sm:text-xl lg:text-2xl">to</span>
            <span
              className={`text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r ${currentOutcome.color} bg-clip-text text-transparent`}
            >
              {currentOutcome.text}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-foreground/60 text-sm sm:text-base lg:text-lg mt-4 max-w-xl mx-auto"
      >
        AI-powered relationship coaching that helps you communicate with confidence
      </motion.p>

      {/* Animated dots indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-6">
        {scrollingOutcomes.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentOutcomeIndex
                ? 'bg-purple-400 w-4'
                : 'bg-foreground/20'
            }`}
          />
        ))}
      </div>

      {/* Optional CTA for anonymous users */}
      {onGetStarted && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onGetStarted}
          className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
        >
          Get Started Free
        </motion.button>
      )}
    </motion.div>
  );
}

export default HeroSection;
