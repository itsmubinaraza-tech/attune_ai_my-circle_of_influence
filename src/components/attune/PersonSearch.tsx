import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Briefcase, Heart, Users, UserPlus } from "lucide-react";
import type { Person } from "@/pages/Index";

interface PersonSearchProps {
  people: Person[];
  selectedPerson: Person | null;
  onPersonSelect: (person: Person | null) => void;
  onAddPerson?: () => void;
}

const groupIcons = {
  work: Briefcase,
  family: Heart,
  friends: Users,
};

const groupColors = {
  work: { bg: "rgba(99, 102, 241, 0.15)", text: "hsl(239, 84%, 67%)", border: "rgba(99, 102, 241, 0.3)" },
  family: { bg: "rgba(244, 114, 182, 0.15)", text: "hsl(330, 81%, 70%)", border: "rgba(244, 114, 182, 0.3)" },
  friends: { bg: "rgba(52, 211, 153, 0.15)", text: "hsl(160, 64%, 52%)", border: "rgba(52, 211, 153, 0.3)" },
};

const PersonSearch = ({ people, selectedPerson, onPersonSelect, onAddPerson }: PersonSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return people.filter((person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [people, searchQuery]);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredPeople.length, searchQuery]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [highlightedIndex]);

  const hasQuery = searchQuery.trim().length > 0;
  const showDropdown = hasQuery && !selectedPerson;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredPeople.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredPeople.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredPeople[highlightedIndex]) {
          onPersonSelect(filteredPeople[highlightedIndex]);
          setSearchQuery("");
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchQuery("");
        break;
    }
  };

  const GroupIcon = selectedPerson ? groupIcons[selectedPerson.group] : null;
  const colors = selectedPerson ? groupColors[selectedPerson.group] : null;

  return (
    <div className="liquid-glass p-3 sm:p-4 lg:p-6 relative overflow-hidden h-full flex flex-col">
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        <h2 className="text-sm sm:text-base lg:text-lg font-medium text-foreground/90 text-center">
          Who do you need to attune to?
        </h2>
        <p className="text-[10px] sm:text-xs text-muted-foreground/70 mb-2 sm:mb-4 text-center">
          Search or select from your circle
        </p>

        {/* Glass Search Input */}
        <div className="relative">
          <motion.div
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${
              isFocused
                ? "glass-input-focused"
                : "glass-input"
            }`}
            animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Who do you want to talk about?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 300)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/30 text-xs sm:text-sm"
            />
            {(searchQuery || selectedPerson) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  onPersonSelect(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-foreground/50" />
              </button>
            )}
          </motion.div>

          {/* Dropdown Results */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 liquid-glass-dropdown rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
              >
                {filteredPeople.length > 0 ? (
                  filteredPeople.map((person, index) => {
                    const Icon = groupIcons[person.group];
                    const pColors = groupColors[person.group];
                    const isHighlighted = index === highlightedIndex;
                    return (
                      <motion.button
                        key={person.id}
                        ref={(el) => { itemRefs.current[index] = el; }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          onPersonSelect(person);
                          setSearchQuery("");
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 transition-all duration-200 border-b border-white/10 last:border-0 ${
                          isHighlighted ? "bg-white/25" : "hover:bg-white/20"
                        }`}
                      >
                        <div
                          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: pColors.bg, border: `1px solid ${pColors.border}` }}
                        >
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: pColors.text }} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-white text-xs sm:text-sm truncate">{person.name}</p>
                          <p className="text-[10px] sm:text-xs text-white/70 capitalize">{person.group}</p>
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="p-3 sm:p-4 text-center">
                    <p className="text-xs sm:text-sm text-white/80">No one found matching "{searchQuery}"</p>
                    {onAddPerson && (
                      <button
                        onClick={() => {
                          onAddPerson();
                          setSearchQuery("");
                        }}
                        className="mt-2 text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1 justify-center w-full"
                      >
                        <UserPlus className="w-3 h-3" />
                        Add them to your circle
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Person Display */}
        <AnimatePresence mode="wait">
          {selectedPerson && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="mt-2 sm:mt-3 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3"
              style={{
                background: colors?.bg,
                border: `1px solid ${colors?.border}`,
                boxShadow: `0 4px 16px ${colors?.bg}`,
              }}
            >
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${colors?.text}20`, border: `2px solid ${colors?.text}40` }}
              >
                {GroupIcon && <GroupIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" style={{ color: colors?.text }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground/90 text-xs sm:text-sm lg:text-base truncate">{selectedPerson.name}</p>
                <p className="text-[10px] sm:text-xs text-foreground/60 capitalize truncate">
                  {selectedPerson.group} · {selectedPerson.subgroup}
                </p>
              </div>
              <button
                onClick={() => onPersonSelect(null)}
                className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/50" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Person Button */}
        {onAddPerson && !selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-white/10"
          >
            <button
              onClick={onAddPerson}
              className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl glass-button flex items-center gap-2 justify-center hover:bg-white/10 transition-colors"
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/60" />
              <span className="text-xs sm:text-sm font-medium text-foreground/70">Add someone new</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PersonSearch;
