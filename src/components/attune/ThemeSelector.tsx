import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Sun, Moon, Sparkles, Mountain, Video, Waves } from "lucide-react";

export type ThemeName =
  | "warm-earth"
  | "dark-mode"
  | "dark-purple"
  | "ocean-depth"
  | "serene-nature"
  | "calming-video";

interface Theme {
  id: ThemeName;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: {
    gradient: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: "warm-earth",
    name: "Warm Earth",
    description: "Light, warm, earthy tones",
    icon: <Sun className="w-4 h-4" />,
    preview: {
      gradient: "linear-gradient(135deg, #FDF6E3 0%, #E8DCC8 50%, #D4C4B0 100%)",
      accent: "#C4846C",
    },
  },
  {
    id: "dark-mode",
    name: "Modern Dark",
    description: "Sleek, dark interface",
    icon: <Moon className="w-4 h-4" />,
    preview: {
      gradient: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1F1F1F 100%)",
      accent: "#C4846C",
    },
  },
  {
    id: "dark-purple",
    name: "Purple Hues",
    description: "Dark with purple accents",
    icon: <Sparkles className="w-4 h-4" />,
    preview: {
      gradient: "linear-gradient(135deg, #1A1625 0%, #2D2640 50%, #1F1A2E 100%)",
      accent: "#9B7BB8",
    },
  },
  {
    id: "ocean-depth",
    name: "Ocean Depth",
    description: "Cyan to deep purple",
    icon: <Waves className="w-4 h-4" />,
    preview: {
      gradient: "linear-gradient(135deg, #30CFD0 0%, #1A6B7C 40%, #330867 100%)",
      accent: "#30CFD0",
    },
  },
  {
    id: "serene-nature",
    name: "Serene Nature",
    description: "Peaceful nature backdrop",
    icon: <Mountain className="w-4 h-4" />,
    preview: {
      gradient: "linear-gradient(135deg, #87CEEB 0%, #98D8C8 50%, #7CB9A8 100%)",
      accent: "#4A9079",
    },
  },
  {
    id: "calming-video",
    name: "Calming Video",
    description: "Animated video background",
    icon: <Video className="w-4 h-4" />,
    preview: {
      gradient: "linear-gradient(135deg, #1E2A3A 0%, #2A3A4A 50%, #1A2530 100%)",
      accent: "#5BA4D0",
    },
  },
];

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTheme = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass-button text-foreground/80 hover:text-foreground transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Choose Theme</span>
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 z-50 w-72 p-3 rounded-2xl liquid-glass-dropdown"
            >
              <div className="mb-2 px-2">
                <h3 className="text-sm font-semibold text-foreground/90">Choose Theme</h3>
                <p className="text-xs text-foreground/50">Personalize your experience</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setIsOpen(false);
                    }}
                    className={`relative p-3 rounded-xl text-left transition-all ${
                      currentTheme === theme.id
                        ? "ring-2 ring-white/30"
                        : "hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Theme Preview */}
                    <div
                      className="w-full h-12 rounded-lg mb-2 relative overflow-hidden"
                      style={{ background: theme.preview.gradient }}
                    >
                      {/* Glass preview overlay */}
                      <div className="absolute inset-2 rounded-md bg-white/10 backdrop-blur-sm" />

                      {/* Accent dot */}
                      <div
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.preview.accent }}
                      />

                      {/* Selected checkmark */}
                      {currentTheme === theme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-gray-800" />
                        </motion.div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground/60">{theme.icon}</span>
                      <span className="text-xs font-medium text-foreground/80 truncate">
                        {theme.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
