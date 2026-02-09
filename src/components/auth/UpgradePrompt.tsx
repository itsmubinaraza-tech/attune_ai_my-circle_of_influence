import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  messagesUsed: number;
  maxMessages: number;
}

export function UpgradePrompt({ isOpen, onClose, messagesUsed, maxMessages }: UpgradePromptProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative liquid-glass p-8 rounded-3xl w-full max-w-md text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground/90 mb-2">
            You've used your free messages!
          </h2>

          {/* Subtitle */}
          <p className="text-foreground/60 mb-6">
            You've explored {messagesUsed} of {maxMessages} free conversations. Create an account to unlock unlimited personalized coaching.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80">50 Monthly Messages</p>
                <p className="text-xs text-foreground/50">Personalized coaching sessions</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80">Your Circle</p>
                <p className="text-xs text-foreground/50">Track all your relationships</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80">Conversation History</p>
                <p className="text-xs text-foreground/50">Access past coaching sessions</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              to="/signup"
              className="block w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
            >
              Create Free Account
            </Link>

            <Link
              to="/signin"
              className="block w-full py-3 px-6 rounded-xl font-medium text-foreground/80 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              Already have an account? Sign In
            </Link>
          </div>

          {/* Fun message */}
          <p className="mt-6 text-xs text-foreground/40">
            Generic advice is everywhere. Get personalized guidance that actually works.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default UpgradePrompt;
