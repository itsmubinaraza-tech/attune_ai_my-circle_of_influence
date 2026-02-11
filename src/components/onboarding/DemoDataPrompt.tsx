import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, Users, X } from 'lucide-react';

interface DemoDataPromptProps {
  isOpen: boolean;
  onKeep: () => void;
  onDelete: () => void;
  onClose: () => void;
  demoCount?: number;
}

export default function DemoDataPrompt({
  isOpen,
  onKeep,
  onDelete,
  onClose,
  demoCount = 28,
}: DemoDataPromptProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Welcome to Attune!</h2>
                  <p className="text-sm text-white/60">Your account is ready</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <p className="text-white/80 mb-4">
                We've added <span className="text-purple-400 font-semibold">{demoCount} sample contacts</span> to
                help you explore the app. Would you like to keep them or start fresh?
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Sample contacts include work colleagues, family, friends, and acquaintances</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onKeep}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Keep Demo Data
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 font-medium transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Start Fresh
                </button>
              </div>

              <p className="text-xs text-white/40 text-center mt-4">
                You can always add, edit, or delete contacts later
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
