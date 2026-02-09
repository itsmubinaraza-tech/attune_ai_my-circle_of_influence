import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Sparkles, ArrowRight, X } from 'lucide-react';

interface FeedbackPromptProps {
  personName?: string;
  onRehearse: () => void;
  onTryItOut: () => void;
  onDismiss: () => void;
}

export function FeedbackPrompt({ personName, onRehearse, onTryItOut, onDismiss }: FeedbackPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground/90 mb-2">
            Would you like to rehearse this with me?
          </p>
          <p className="text-xs text-foreground/60 mb-4">
            Practice what you'll say before the real conversation, or go try it out and let me know how it went.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onRehearse}
              className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Let's Rehearse
            </button>
            <button
              onClick={onTryItOut}
              className="px-4 py-2 rounded-lg bg-white/5 text-foreground/70 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              I'll Try It Out
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDismiss}
              className="p-2 rounded-lg text-foreground/40 hover:text-foreground/60 hover:bg-white/5 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface FeedbackFollowUpProps {
  personName?: string;
  onPositive: () => void;
  onNegative: () => void;
  onDismiss: () => void;
}

export function FeedbackFollowUp({ personName, onPositive, onNegative, onDismiss }: FeedbackFollowUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground/90 mb-2">
            How did your conversation{personName ? ` with ${personName}` : ''} go?
          </p>
          <p className="text-xs text-foreground/60 mb-4">
            Share what happened so we can learn and improve together.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onPositive}
              className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              It Went Well!
            </button>
            <button
              onClick={onNegative}
              className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/30 transition-colors flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              Could've Been Better
            </button>
            <button
              onClick={onDismiss}
              className="p-2 rounded-lg text-foreground/40 hover:text-foreground/60 hover:bg-white/5 transition-colors"
              title="Ask me later"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface FeedbackSuccessProps {
  onContinue: () => void;
}

export function FeedbackSuccess({ onContinue }: FeedbackSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <ThumbsUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground/90 mb-2">
            That's wonderful to hear!
          </p>
          <p className="text-xs text-foreground/60 mb-4">
            Your communication skills are growing. What made it work? Understanding this helps for next time.
          </p>
          <button
            onClick={onContinue}
            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors"
          >
            Tell Me More
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default FeedbackPrompt;
