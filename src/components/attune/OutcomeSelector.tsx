import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContextType, Mood } from "@/pages/Index";
import {
  MessageCircle,
  Flame,
  TrendingUp,
  Handshake,
  MessageSquare,
  Heart,
  Shield,
  Smile,
  Lightbulb,
  PartyPopper,
  Coffee,
  Sparkles,
  MoreHorizontal,
  Check,
  X,
  type LucideIcon
} from "lucide-react";

interface OutcomeSelectorProps {
  context: ContextType;
  selectedOutcome: string | null;
  onOutcomeSelect: (outcome: string | null) => void;
  currentMood?: Mood | null;
}

interface OutcomeOption {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  bgGradient: string;
}

// Each outcome has its own unique color with darker text colors for visibility
const outcomesByContext: Record<string, OutcomeOption[]> = {
  work: [
    { id: "connection", label: "Build Connection", icon: Handshake, color: "hsl(200, 70%, 45%)", textColor: "#0369A1", bgGradient: "from-sky-400/20 via-blue-500/10 to-cyan-400/20" },
    { id: "hard-conversation", label: "Navigate Tension", icon: Flame, color: "hsl(15, 85%, 50%)", textColor: "#DC2626", bgGradient: "from-orange-400/20 via-red-500/10 to-rose-400/20" },
    { id: "influence", label: "Influence Outcome", icon: TrendingUp, color: "hsl(260, 75%, 55%)", textColor: "#7C3AED", bgGradient: "from-violet-400/20 via-purple-500/10 to-fuchsia-400/20" },
    { id: "negotiate", label: "Negotiate Terms", icon: MessageSquare, color: "hsl(45, 90%, 45%)", textColor: "#B45309", bgGradient: "from-amber-400/20 via-yellow-500/10 to-orange-400/20" },
    { id: "feedback", label: "Give Feedback", icon: MessageCircle, color: "hsl(160, 70%, 40%)", textColor: "#059669", bgGradient: "from-emerald-400/20 via-teal-500/10 to-green-400/20" },
    { id: "other", label: "Other", icon: MoreHorizontal, color: "hsl(220, 55%, 50%)", textColor: "#4F46E5", bgGradient: "from-slate-400/20 via-gray-500/10 to-zinc-400/20" },
  ],
  family: [
    { id: "connection", label: "Build Connection", icon: Handshake, color: "hsl(200, 70%, 45%)", textColor: "#0369A1", bgGradient: "from-sky-400/20 via-blue-500/10 to-cyan-400/20" },
    { id: "strengthen", label: "Strengthen Bond", icon: Heart, color: "hsl(340, 80%, 55%)", textColor: "#DB2777", bgGradient: "from-pink-400/20 via-rose-500/10 to-red-400/20" },
    { id: "resolve", label: "Resolve Conflict", icon: Shield, color: "hsl(25, 85%, 50%)", textColor: "#EA580C", bgGradient: "from-orange-400/20 via-amber-500/10 to-yellow-400/20" },
    { id: "express", label: "Express Love", icon: Sparkles, color: "hsl(320, 75%, 55%)", textColor: "#C026D3", bgGradient: "from-fuchsia-400/20 via-pink-500/10 to-rose-400/20" },
    { id: "understand", label: "Seek Understanding", icon: Lightbulb, color: "hsl(50, 90%, 45%)", textColor: "#CA8A04", bgGradient: "from-yellow-400/20 via-amber-500/10 to-orange-400/20" },
    { id: "other", label: "Other", icon: MoreHorizontal, color: "hsl(280, 55%, 55%)", textColor: "#9333EA", bgGradient: "from-purple-400/20 via-violet-500/10 to-fuchsia-400/20" },
  ],
  friends: [
    { id: "connection", label: "Build Connection", icon: Handshake, color: "hsl(200, 70%, 45%)", textColor: "#0369A1", bgGradient: "from-sky-400/20 via-blue-500/10 to-cyan-400/20" },
    { id: "reconnect", label: "Reconnect", icon: Coffee, color: "hsl(30, 75%, 45%)", textColor: "#C2410C", bgGradient: "from-amber-400/20 via-orange-500/10 to-yellow-400/20" },
    { id: "support", label: "Show Support", icon: Heart, color: "hsl(340, 80%, 55%)", textColor: "#DB2777", bgGradient: "from-pink-400/20 via-rose-500/10 to-red-400/20" },
    { id: "plan", label: "Plan Together", icon: PartyPopper, color: "hsl(280, 70%, 55%)", textColor: "#9333EA", bgGradient: "from-purple-400/20 via-violet-500/10 to-fuchsia-400/20" },
    { id: "fun", label: "Have Fun", icon: Smile, color: "hsl(45, 95%, 45%)", textColor: "#CA8A04", bgGradient: "from-yellow-400/20 via-amber-500/10 to-orange-400/20" },
    { id: "other", label: "Other", icon: MoreHorizontal, color: "hsl(160, 65%, 40%)", textColor: "#059669", bgGradient: "from-teal-400/20 via-emerald-500/10 to-green-400/20" },
  ],
};

const OutcomeSelector = ({ context, selectedOutcome, onOutcomeSelect, currentMood }: OutcomeSelectorProps) => {
  const activeContext = context || "work";
  const outcomes = outcomesByContext[activeContext];

  // Find current index based on selected outcome or default to 0
  const selectedIndex = outcomes.findIndex(o => o.id === selectedOutcome);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(!selectedOutcome);

  // Auto-cycle through outcomes only when not selected
  useEffect(() => {
    if (!isAutoPlaying || selectedOutcome) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % outcomes.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedOutcome, outcomes.length]);

  // Sync currentIndex when context changes and handle auto-play
  useEffect(() => {
    const newOutcomes = outcomesByContext[activeContext];
    const idx = newOutcomes.findIndex(o => o.id === selectedOutcome);
    setCurrentIndex(idx >= 0 ? idx : 0);

    if (selectedOutcome) {
      setIsAutoPlaying(false);
    } else {
      // Restart auto-play when selection is cleared
      setIsAutoPlaying(true);
    }
  }, [activeContext, selectedOutcome]);

  const currentOutcome = outcomes[currentIndex];

  const handleSelect = () => {
    setIsAutoPlaying(false);
    onOutcomeSelect(currentOutcome.id);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    const newIndex = (currentIndex - 1 + outcomes.length) % outcomes.length;
    setCurrentIndex(newIndex);
    // Update selection when scrolling
    if (selectedOutcome) {
      onOutcomeSelect(outcomes[newIndex].id);
    }
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    const newIndex = (currentIndex + 1) % outcomes.length;
    setCurrentIndex(newIndex);
    // Update selection when scrolling
    if (selectedOutcome) {
      onOutcomeSelect(outcomes[newIndex].id);
    }
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    if (selectedOutcome) {
      onOutcomeSelect(outcomes[index].id);
    }
  };

  const Icon = currentOutcome.icon;
  const isSelected = selectedOutcome === currentOutcome.id;

  return (
    <motion.div
      className="liquid-glass p-2 sm:p-4 lg:p-6 relative overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left side glow - inside widget */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-24 rounded-r-full pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${currentOutcome.color}, transparent)`,
          filter: "blur(25px)",
          opacity: 0.85,
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Right side glow - inside widget */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-24 rounded-l-full pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${currentOutcome.color}, transparent)`,
          filter: "blur(25px)",
          opacity: 0.85,
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Animated background glow based on current outcome */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentOutcome.bgGradient} blur-2xl opacity-60 rounded-3xl`}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h2 className="text-sm sm:text-base lg:text-lg font-medium text-foreground/90">
          What outcome are you seeking?
        </h2>
        <p className="text-[10px] sm:text-xs text-muted-foreground/70 mb-2 sm:mb-4">
          {selectedOutcome ? "Scroll to change" : "Tap to select"}
        </p>

        {/* Centralized Outcome Display - Responsive */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 relative z-20">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full glass-button flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-white/20 active:scale-95 transition-all flex-shrink-0 text-sm cursor-pointer"
            type="button"
          >
            ←
          </button>

          {/* Main Outcome Card - Responsive sizing */}
          <AnimatePresence mode="wait">
            <motion.button
              key={currentOutcome.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={handleSelect}
              className={`relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl transition-all duration-300 flex-shrink-0 ${
                isSelected
                  ? "ring-2 ring-white/50 shadow-2xl scale-105"
                  : "hover:scale-105"
              }`}
              style={{
                background: `linear-gradient(135deg, ${currentOutcome.color}20, ${currentOutcome.color}40)`,
                boxShadow: `0 8px 32px ${currentOutcome.color}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                backdropFilter: "blur(20px)",
                border: isSelected ? `2px solid ${currentOutcome.color}` : "1px solid rgba(255,255,255,0.18)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Floating orb effect */}
              <motion.div
                className="absolute w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full blur-xl opacity-50"
                style={{ background: currentOutcome.color }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="relative z-10 mb-0.5 sm:mb-1"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                  style={{ color: currentOutcome.color }}
                />
              </motion.div>
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-wide relative z-10 text-center px-1 text-foreground/90">
                {currentOutcome.label}
              </span>

              {/* Cancel icon on left when selected */}
              {isSelected && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOutcomeSelect(null);
                  }}
                  className="absolute -top-2 -left-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, #ef4444, #dc2626)`,
                    border: "2px solid rgba(255,255,255,0.5)"
                  }}
                  type="button"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />
                </motion.button>
              )}

              {/* Check icon on right when selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                    border: "2px solid rgba(255,255,255,0.5)"
                  }}
                >
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          </AnimatePresence>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full glass-button flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-white/20 active:scale-95 transition-all flex-shrink-0 text-sm cursor-pointer"
            type="button"
          >
            →
          </button>
        </div>

        {/* Outcome Indicators with colors */}
        <div className="flex justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-4 relative z-20">
          {outcomes.map((outcome, index) => (
            <button
              key={outcome.id}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-3 sm:w-4 lg:w-6"
                  : "w-1 sm:w-1.5 opacity-40 hover:opacity-70"
              }`}
              style={{
                background: index === currentIndex
                  ? outcome.color
                  : "rgba(255,255,255,0.3)"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OutcomeSelector;
