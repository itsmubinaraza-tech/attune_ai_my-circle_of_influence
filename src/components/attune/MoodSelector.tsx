import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, X } from "lucide-react";
import type { Mood } from "@/pages/Index";

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood | null) => void;
}

const moods: { value: Mood; label: string; emoji: string; color: string; textColor: string; bgGradient: string }[] = [
  { value: "calm", label: "Calm", emoji: "😌", color: "hsl(180, 70%, 45%)", textColor: "#0D9488", bgGradient: "from-cyan-400/20 via-teal-500/10 to-emerald-400/20" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "hsl(280, 75%, 55%)", textColor: "#9333EA", bgGradient: "from-purple-400/20 via-violet-500/10 to-fuchsia-400/20" },
  { value: "frustrated", label: "Frustrated", emoji: "😤", color: "hsl(15, 85%, 50%)", textColor: "#EA580C", bgGradient: "from-orange-400/20 via-red-500/10 to-rose-400/20" },
  { value: "hopeful", label: "Hopeful", emoji: "🌟", color: "hsl(45, 95%, 45%)", textColor: "#CA8A04", bgGradient: "from-yellow-400/20 via-amber-500/10 to-orange-400/20" },
  { value: "tired", label: "Tired", emoji: "😴", color: "hsl(220, 55%, 50%)", textColor: "#4F46E5", bgGradient: "from-slate-400/20 via-blue-500/10 to-indigo-400/20" },
  { value: "motivated", label: "Motivated", emoji: "💪", color: "hsl(140, 75%, 40%)", textColor: "#16A34A", bgGradient: "from-green-400/20 via-emerald-500/10 to-teal-400/20" },
  { value: "uncertain", label: "Uncertain", emoji: "🤔", color: "hsl(200, 70%, 50%)", textColor: "#0284C7", bgGradient: "from-sky-400/20 via-cyan-500/10 to-blue-400/20" },
  { value: "confident", label: "Confident", emoji: "😊", color: "hsl(330, 75%, 55%)", textColor: "#DB2777", bgGradient: "from-pink-400/20 via-rose-500/10 to-red-400/20" },
];

const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-cycle through moods only when not selected
  useEffect(() => {
    if (!isAutoPlaying || selectedMood) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moods.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedMood]);

  // Sync currentIndex with selectedMood and restart auto-play when deselected
  useEffect(() => {
    if (selectedMood) {
      const index = moods.findIndex(m => m.value === selectedMood);
      if (index !== -1) {
        setCurrentIndex(index);
      }
      setIsAutoPlaying(false);
    } else {
      // Restart auto-play when selection is cleared
      setIsAutoPlaying(true);
    }
  }, [selectedMood]);

  const currentMood = moods[currentIndex];

  const handleSelect = () => {
    setIsAutoPlaying(false);
    onMoodSelect(currentMood.value);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    const newIndex = (currentIndex - 1 + moods.length) % moods.length;
    setCurrentIndex(newIndex);
    // If already selected, update selection to new mood
    if (selectedMood) {
      onMoodSelect(moods[newIndex].value);
    }
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    const newIndex = (currentIndex + 1) % moods.length;
    setCurrentIndex(newIndex);
    // If already selected, update selection to new mood
    if (selectedMood) {
      onMoodSelect(moods[newIndex].value);
    }
  };

  const handleReset = () => {
    setIsAutoPlaying(true);
    // Note: We don't clear selectedMood here as that's controlled by parent
    // This just restarts auto-cycling preview
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    if (selectedMood) {
      onMoodSelect(moods[index].value);
    }
  };

  const isSelected = selectedMood === currentMood.value;

  return (
    <div className="liquid-glass p-3 sm:p-4 lg:p-6 relative overflow-hidden h-full flex flex-col">
      {/* Left side glow - inside widget */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-24 rounded-r-full pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${currentMood.color}, transparent)`,
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
          background: `linear-gradient(to left, ${currentMood.color}, transparent)`,
          filter: "blur(25px)",
          opacity: 0.85,
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Animated background glow based on current emotion */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentMood.bgGradient} blur-2xl opacity-60 rounded-3xl`}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base lg:text-lg font-medium text-foreground/90">
            How are you feeling?
          </h2>
          {selectedMood && (
            <button
              onClick={handleReset}
              className="p-1 sm:p-1.5 rounded-full glass-button text-foreground/50 hover:text-foreground/80 transition-colors"
              title="Reset to auto-cycle"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground/70 mb-2 sm:mb-4">
          {selectedMood ? "Scroll to change" : "Tap to select"}
        </p>

        {/* Centralized Emotion Display - Responsive */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 relative z-20">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            type="button"
            className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full glass-button flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-white/20 active:scale-95 transition-all flex-shrink-0 text-sm cursor-pointer"
          >
            ←
          </button>

          {/* Main Emotion Card - Responsive sizing */}
          <AnimatePresence mode="wait">
            <motion.button
              key={currentMood.value}
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
                background: `linear-gradient(135deg, ${currentMood.color}20, ${currentMood.color}40)`,
                boxShadow: `0 8px 32px ${currentMood.color}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                backdropFilter: "blur(20px)",
                border: isSelected ? `2px solid ${currentMood.color}` : "1px solid rgba(255,255,255,0.18)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Floating orb effect */}
              <motion.div
                className="absolute w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full blur-xl opacity-50"
                style={{ background: currentMood.color }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.span
                className="text-3xl sm:text-4xl lg:text-5xl mb-0.5 sm:mb-1 relative z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {currentMood.emoji}
              </motion.span>
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-wide relative z-10 text-foreground/90">
                {currentMood.label}
              </span>

              {/* Cancel icon on left when selected */}
              {isSelected && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoodSelect(null);
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
            type="button"
            className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full glass-button flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-white/20 active:scale-95 transition-all flex-shrink-0 text-sm cursor-pointer"
          >
            →
          </button>
        </div>

        {/* Mood Indicators */}
        <div className="flex justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-4 relative z-20">
          {moods.map((mood, index) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-3 sm:w-4 lg:w-6"
                  : "w-1 sm:w-1.5 opacity-40 hover:opacity-70"
              }`}
              style={{
                background: index === currentIndex
                  ? mood.color
                  : "rgba(255,255,255,0.3)"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
