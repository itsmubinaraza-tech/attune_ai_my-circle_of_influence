import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, MessageSquare } from 'lucide-react';

interface FloatingQuickTalkProps {
  onClick: () => void;
  isVisible?: boolean;
}

export function FloatingQuickTalk({ onClick, isVisible = true }: FloatingQuickTalkProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-medium whitespace-nowrap"
          >
            Talk to me
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center relative overflow-hidden group"
      >
        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Icon */}
        <Mic className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Label for mobile */}
      <span className="mt-1.5 text-xs text-foreground/50 font-medium lg:hidden">
        Quick Talk
      </span>
    </motion.div>
  );
}

export default FloatingQuickTalk;
