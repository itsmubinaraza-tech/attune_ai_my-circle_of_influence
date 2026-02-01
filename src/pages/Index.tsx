import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MoodSelector from "@/components/attune/MoodSelector";
import PersonSearch from "@/components/attune/PersonSearch";
import OutcomeSelector from "@/components/attune/OutcomeSelector";
import ThemeSelector, { type ThemeName } from "@/components/attune/ThemeSelector";
import { ArrowRight, Sparkles, Clock, AlertCircle, MessageSquare, Menu, X, UserPlus, Briefcase, Heart, Users, Phone, MessageCircle, Copy, Check } from "lucide-react";

export type Mood = "calm" | "anxious" | "frustrated" | "hopeful" | "tired" | "motivated" | "uncertain" | "confident";
export type ContextType = "work" | "family" | "friends" | null;

export interface Person {
  id: string;
  name: string;
  photo?: string;
  group: "work" | "family" | "friends";
  subgroup?: string;
}

// Mock data for demo
const mockPeople: Person[] = [
  // Work colleagues
  { id: "1", name: "Sarah Chen", group: "work", subgroup: "Manager" },
  { id: "2", name: "Marcus Johnson", group: "work", subgroup: "Team" },
  { id: "7", name: "Emily Wong", group: "work", subgroup: "Stakeholder" },
  { id: "9", name: "David Kim", group: "work", subgroup: "Team" },
  { id: "10", name: "Lisa Patel", group: "work", subgroup: "Manager" },
  { id: "11", name: "Tom Rodriguez", group: "work", subgroup: "Client" },
  { id: "12", name: "Nina Okonkwo", group: "work", subgroup: "HR" },
  // Family members
  { id: "3", name: "Mom", group: "family", subgroup: "Immediate" },
  { id: "4", name: "Dad", group: "family", subgroup: "Immediate" },
  { id: "8", name: "Brother", group: "family", subgroup: "Immediate" },
  { id: "13", name: "Sister", group: "family", subgroup: "Immediate" },
  { id: "14", name: "Grandma", group: "family", subgroup: "Extended" },
  { id: "15", name: "Uncle James", group: "family", subgroup: "Extended" },
  { id: "16", name: "Cousin Priya", group: "family", subgroup: "Extended" },
  // Friends
  { id: "5", name: "Alex Rivera", group: "friends", subgroup: "Close" },
  { id: "6", name: "Jordan Taylor", group: "friends", subgroup: "Close" },
  { id: "17", name: "Jake Miller", group: "friends", subgroup: "Close" },
  { id: "18", name: "Sophia Lee", group: "friends", subgroup: "College" },
  { id: "19", name: "Chris O'Brien", group: "friends", subgroup: "Gym" },
  { id: "20", name: "Mia Santos", group: "friends", subgroup: "Neighborhood" },
  { id: "21", name: "Ryan Chen", group: "friends", subgroup: "College" },
];

// Mock data for dashboard widgets
const needsAttention = [
  { id: "1", name: "Mom", daysAgo: 14, group: "family" as const, phone: "+1234567890" },
  { id: "2", name: "Jake", daysAgo: 10, group: "friends" as const, phone: "+1987654321" },
  { id: "3", name: "Emily Wong", daysAgo: 21, group: "work" as const, phone: "+1555123456" },
];

const recentConversations = [
  { id: "1", name: "Sarah Chen", timeAgo: "Yesterday", topic: "Project update" },
  { id: "2", name: "Dad", timeAgo: "3 days ago", topic: "Weekend plans" },
  { id: "3", name: "Alex Rivera", timeAgo: "1 week ago", topic: "Catch up" },
];

const groupColors = {
  work: "hsl(239, 84%, 67%)",
  family: "hsl(330, 81%, 70%)",
  friends: "hsl(160, 64%, 52%)",
};

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<ContextType>("work");
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("dark-purple");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<"all" | "work" | "family" | "friends">("all");
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonGroup, setNewPersonGroup] = useState<"work" | "family" | "friends">("work");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAttentionPerson, setSelectedAttentionPerson] = useState<typeof needsAttention[0] | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);


  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("attune-theme") as ThemeName | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme class to body and save to localStorage
  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove(
      "theme-warm-earth",
      "theme-dark-mode",
      "theme-dark-purple",
      "theme-ocean-depth",
      "theme-serene-nature",
      "theme-calming-video"
    );
    // Add current theme class
    document.body.classList.add(`theme-${currentTheme}`);
    // Save to localStorage
    localStorage.setItem("attune-theme", currentTheme);
  }, [currentTheme]);

  // Update context when person is selected
  const handlePersonSelect = (person: Person | null) => {
    setSelectedPerson(person);
    setCurrentContext(person?.group || "work");
  };

  // Generate personalized reconnection message based on relationship
  const generateReconnectMessage = (person: typeof needsAttention[0]) => {
    const messages = {
      family: [
        `Hey ${person.name}! 💕 I was just thinking about you and realized it's been a while since we caught up. How have you been? I'd love to hear what's new in your life. Miss you!`,
        `Hi ${person.name}! 🌟 You crossed my mind today and I wanted to reach out. It's been ${person.daysAgo} days since we last talked - way too long! How are you doing? Let's catch up soon!`,
      ],
      friends: [
        `Hey ${person.name}! 👋 It's been ${person.daysAgo} days since we last hung out and I miss our conversations! What's new with you? We should grab coffee or catch up soon!`,
        `${person.name}! 🙌 Just thinking about you and wanted to check in. How's everything going? It's been too long - let's plan something fun soon!`,
      ],
      work: [
        `Hi ${person.name}, hope you're doing well! It's been a while since we connected and I wanted to reach out. How are things going on your end? Would love to catch up when you have a moment.`,
        `Hey ${person.name}! Hope all is well with you. I was thinking about our last conversation and wanted to check in. Any updates on your projects? Let's sync up soon!`,
      ],
    };
    const groupMessages = messages[person.group];
    return groupMessages[Math.floor(Math.random() * groupMessages.length)];
  };

  // Handle message button click
  const handleMessageClick = (person: typeof needsAttention[0]) => {
    setSelectedAttentionPerson(person);
    setShowMessageModal(true);
    setCopiedMessage(false);
  };

  // Handle call button click
  const handleCallClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Copy message to clipboard
  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Add new person to the list
  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: Person = {
      id: `custom-${Date.now()}`,
      name: newPersonName.trim(),
      group: newPersonGroup,
      subgroup: "Custom",
    };
    setPeople([...people, newPerson]);
    setNewPersonName("");
    setShowAddPersonModal(false);
    // Optionally auto-select the new person
    handlePersonSelect(newPerson);
  };

  // Get context-based colors for ambient effects
  const getContextColors = () => {
    switch (currentContext) {
      case "work":
        return { primary: "rgba(99, 102, 241, 0.25)", secondary: "rgba(139, 92, 246, 0.15)" };
      case "family":
        return { primary: "rgba(244, 114, 182, 0.25)", secondary: "rgba(251, 113, 133, 0.15)" };
      case "friends":
        return { primary: "rgba(52, 211, 153, 0.25)", secondary: "rgba(20, 184, 166, 0.15)" };
      default:
        return { primary: "rgba(139, 92, 246, 0.2)", secondary: "rgba(236, 72, 153, 0.1)" };
    }
  };

  const contextColors = getContextColors();
  const isFlowComplete = selectedMood && selectedPerson && selectedOutcome;

  return (
    <div className="min-h-screen transition-all duration-1000 ease-out">
      {/* Context-aware ambient overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${contextColors.primary} 0%, transparent 60%),
                       radial-gradient(ellipse at 100% 80%, ${contextColors.secondary} 0%, transparent 50%)`,
        }}
        animate={{ opacity: selectedPerson ? 1 : 0.5 }}
        transition={{ duration: 1 }}
      />

      {/* Ambient floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl floating-orb"
          style={{ background: `linear-gradient(to bottom right, ${contextColors.primary}, ${contextColors.secondary})` }}
        />
        <motion.div
          className="absolute top-1/2 -left-48 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/10 blur-3xl floating-orb-delayed"
        />
        <motion.div
          className="absolute -bottom-32 right-1/4 w-72 h-72 rounded-full blur-3xl floating-orb"
          style={{ background: `linear-gradient(to bottom right, ${contextColors.secondary}, transparent)`, animationDelay: "-5s" }}
        />
      </div>

      {/* Main content - Responsive layout */}
      <div className="relative z-10 min-h-screen flex flex-col px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-2 sm:mb-6 lg:mb-8"
        >
          <div className="flex items-center justify-between">
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass-button"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground/70" />
              ) : (
                <Menu className="w-5 h-5 text-foreground/70" />
              )}
            </button>
            <div className="hidden lg:block w-10 lg:w-auto">
              {/* Logo area for web */}
              <span className="text-xl font-bold text-foreground/80">🌿</span>
            </div>
            <div className="text-center lg:text-left lg:flex-1 lg:ml-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground/90 tracking-tight">
                Attune
              </h1>
              <p className="text-xs sm:text-sm text-foreground/50 hidden sm:block">
                Connect with intention
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Navigation for web */}
              <nav className="hidden lg:flex items-center gap-6 mr-6">
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Today</a>
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Circle</a>
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Reflect</a>
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Me</a>
              </nav>
              <ThemeSelector
                currentTheme={currentTheme}
                onThemeChange={setCurrentTheme}
              />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 overflow-hidden"
              >
                <div className="liquid-glass rounded-2xl p-4 space-y-2">
                  <a href="#" className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">Today</a>
                  <a href="#" className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">My Circle</a>
                  <a href="#" className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">Reflect</a>
                  <a href="#" className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">Profile</a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Main Grid - Mobile: Stack, Desktop: 2 columns */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Main Widgets */}
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 lg:w-1/2 xl:w-2/5">
            {/* Part 1: Mood Check-in */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:flex-1"
            >
              <MoodSelector
                selectedMood={selectedMood}
                onMoodSelect={setSelectedMood}
              />
            </motion.section>

            {/* Part 2: Person Search */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:flex-1"
            >
              <PersonSearch
                people={people}
                selectedPerson={selectedPerson}
                onPersonSelect={handlePersonSelect}
                onAddPerson={() => setShowAddPersonModal(true)}
              />
            </motion.section>

            {/* Part 3: Outcome Selector - Always visible */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:flex-1"
            >
              <OutcomeSelector
                context={currentContext}
                selectedOutcome={selectedOutcome}
                onOutcomeSelect={setSelectedOutcome}
                currentMood={selectedMood}
              />
            </motion.section>

            {/* Continue Button - Always visible on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button
                disabled={!isFlowComplete}
                className={`w-full py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white flex items-center justify-center gap-2 sm:gap-3 btn-liquid-primary transition-all text-sm sm:text-base ${
                  isFlowComplete
                    ? currentContext === "work"
                      ? "btn-context-work"
                      : currentContext === "family"
                      ? "btn-context-family"
                      : currentContext === "friends"
                      ? "btn-context-friends"
                      : ""
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Let's Connect</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </motion.div>

          </div>

          {/* Right Column - Dashboard Widgets (visible on all screens) */}
          <div className="flex flex-col gap-3 lg:gap-4 lg:w-1/2 xl:w-3/5 mt-4 lg:mt-0">
            {/* Relationship Map */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="liquid-glass p-4 sm:p-6 lg:flex-1 min-h-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">Your Circle</h3>
              </div>

              {/* Group Filter Buttons */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setActiveGroup("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeGroup === "all"
                      ? "bg-white/20 text-foreground/90"
                      : "bg-white/5 text-foreground/50 hover:bg-white/10"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveGroup("work")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeGroup === "work"
                      ? "text-white"
                      : "text-foreground/50 hover:opacity-80"
                  }`}
                  style={{ background: activeGroup === "work" ? groupColors.work : `${groupColors.work}20` }}
                >
                  Work ({people.filter(p => p.group === "work").length})
                </button>
                <button
                  onClick={() => setActiveGroup("family")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeGroup === "family"
                      ? "text-white"
                      : "text-foreground/50 hover:opacity-80"
                  }`}
                  style={{ background: activeGroup === "family" ? groupColors.family : `${groupColors.family}20` }}
                >
                  Family ({people.filter(p => p.group === "family").length})
                </button>
                <button
                  onClick={() => setActiveGroup("friends")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeGroup === "friends"
                      ? "text-white"
                      : "text-foreground/50 hover:opacity-80"
                  }`}
                  style={{ background: activeGroup === "friends" ? groupColors.friends : `${groupColors.friends}20` }}
                >
                  Friends ({people.filter(p => p.group === "friends").length})
                </button>
              </div>

              {/* Interactive Relationship Map */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[280px] h-[180px] sm:h-[200px]">
                  {/* SVG Edges connecting center to clusters */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {/* Edge to Work (top) */}
                    {(activeGroup === "all" || activeGroup === "work") && (
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="15%"
                        stroke={groupColors.work}
                        strokeWidth="2"
                        strokeOpacity="0.5"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                    {/* Edge to Family (bottom-left) */}
                    {(activeGroup === "all" || activeGroup === "family") && (
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="18%"
                        y2="85%"
                        stroke={groupColors.family}
                        strokeWidth="2"
                        strokeOpacity="0.5"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    )}
                    {/* Edge to Friends (bottom-right) */}
                    {(activeGroup === "all" || activeGroup === "friends") && (
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="82%"
                        y2="85%"
                        stroke={groupColors.friends}
                        strokeWidth="2"
                        strokeOpacity="0.5"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    )}
                  </svg>

                  {/* Center - You */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border-2 border-white/30 z-10 shadow-lg"
                    style={{ boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs font-medium text-foreground/90">You</span>
                  </motion.div>

                  {/* Work cluster - Top */}
                  <AnimatePresence>
                    {(activeGroup === "all" || activeGroup === "work") && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-wrap gap-1 justify-center max-w-[120px]"
                      >
                        {people.filter(p => p.group === "work").slice(0, 5).map((person, i) => (
                          <motion.button
                            key={person.id}
                            onClick={() => handlePersonSelect(person)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white hover:scale-110 transition-transform ${
                              selectedPerson?.id === person.id ? "ring-2 ring-white scale-110" : ""
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${groupColors.work}, ${groupColors.work}dd)`,
                              border: "2px solid rgba(255,255,255,0.4)",
                              boxShadow: `0 4px 16px ${groupColors.work}70, inset 0 1px 0 rgba(255,255,255,0.2)`
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.15 }}
                            title={person.name}
                          >
                            {person.name.charAt(0)}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Family cluster - Bottom Left */}
                  <AnimatePresence>
                    {(activeGroup === "all" || activeGroup === "family") && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute bottom-0 left-0 flex flex-wrap gap-1 max-w-[100px]"
                      >
                        {people.filter(p => p.group === "family").slice(0, 5).map((person, i) => (
                          <motion.button
                            key={person.id}
                            onClick={() => handlePersonSelect(person)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white hover:scale-110 transition-transform ${
                              selectedPerson?.id === person.id ? "ring-2 ring-white scale-110" : ""
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${groupColors.family}, ${groupColors.family}dd)`,
                              border: "2px solid rgba(255,255,255,0.4)",
                              boxShadow: `0 4px 16px ${groupColors.family}70, inset 0 1px 0 rgba(255,255,255,0.2)`
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.15 }}
                            title={person.name}
                          >
                            {person.name.charAt(0)}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Friends cluster - Bottom Right */}
                  <AnimatePresence>
                    {(activeGroup === "all" || activeGroup === "friends") && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute bottom-0 right-0 flex flex-wrap gap-1 justify-end max-w-[100px]"
                      >
                        {people.filter(p => p.group === "friends").slice(0, 5).map((person, i) => (
                          <motion.button
                            key={person.id}
                            onClick={() => handlePersonSelect(person)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white hover:scale-110 transition-transform ${
                              selectedPerson?.id === person.id ? "ring-2 ring-white scale-110" : ""
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${groupColors.friends}, ${groupColors.friends}dd)`,
                              border: "2px solid rgba(255,255,255,0.4)",
                              boxShadow: `0 4px 16px ${groupColors.friends}70, inset 0 1px 0 rgba(255,255,255,0.2)`
                            }}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.15 }}
                            title={person.name}
                          >
                            {person.name.charAt(0)}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <p className="text-xs text-foreground/50 text-center mt-3">Tap a person to select them</p>
            </motion.section>

            {/* Bottom row - stack on mobile, two columns on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Needs Attention */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="liquid-glass p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-medium text-foreground/90">Needs Attention</h3>
                </div>
                {/* Reminder text */}
                <p className="text-[10px] sm:text-xs text-foreground/50 mb-3 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400/70" />
                  It only takes a few minutes to strengthen a relationship
                </p>
                <div className="space-y-2">
                  {needsAttention.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:scale-105 transition-transform"
                        style={{
                          background: `linear-gradient(135deg, ${groupColors[person.group]}, ${groupColors[person.group]}dd)`,
                          boxShadow: `0 2px 8px ${groupColors[person.group]}40`
                        }}
                        onClick={() => {
                          const found = people.find(p => p.name === person.name);
                          if (found) handlePersonSelect(found);
                        }}
                      >
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-foreground/80 truncate">{person.name}</p>
                        <p className="text-xs text-foreground/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {person.daysAgo} days ago
                        </p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMessageClick(person)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          title="Send a message"
                        >
                          <MessageCircle className="w-4 h-4 text-green-400" />
                        </button>
                        <button
                          onClick={() => handleCallClick(person.phone)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          title="Call them"
                        >
                          <Phone className="w-4 h-4 text-blue-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Recent Conversations */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="liquid-glass p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-foreground/60" />
                  <h3 className="text-sm font-medium text-foreground/90">Recent Conversations</h3>
                </div>
                <div className="space-y-3">
                  {recentConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        {conv.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground/80 truncate">{conv.name}</p>
                        <p className="text-xs text-foreground/50 truncate">{conv.topic}</p>
                      </div>
                      <span className="text-xs text-foreground/40 whitespace-nowrap">{conv.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Footer - Desktop only */}
        <footer className="hidden lg:block mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-foreground/40">
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground/60 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground/60 transition-colors">Contact</a>
            </div>
            <p>&copy; 2026 Attune</p>
          </div>
        </footer>
      </div>

      {/* Add Person Modal */}
      <AnimatePresence>
        {showAddPersonModal && (
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAddPersonModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative liquid-glass p-6 rounded-3xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground/90">Add New Person</h2>
                <button
                  onClick={() => setShowAddPersonModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">Name</label>
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="Enter their name..."
                  className="w-full px-4 py-3 rounded-xl glass-input bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Group Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground/70 mb-3">Group</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewPersonGroup("work")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                      newPersonGroup === "work"
                        ? "ring-2 ring-white/30"
                        : "hover:bg-white/5"
                    }`}
                    style={{
                      background: newPersonGroup === "work" ? `${groupColors.work}30` : `${groupColors.work}10`,
                    }}
                  >
                    <Briefcase className="w-4 h-4" style={{ color: groupColors.work }} />
                    <span className="text-sm font-medium" style={{ color: groupColors.work }}>Work</span>
                  </button>
                  <button
                    onClick={() => setNewPersonGroup("family")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                      newPersonGroup === "family"
                        ? "ring-2 ring-white/30"
                        : "hover:bg-white/5"
                    }`}
                    style={{
                      background: newPersonGroup === "family" ? `${groupColors.family}30` : `${groupColors.family}10`,
                    }}
                  >
                    <Heart className="w-4 h-4" style={{ color: groupColors.family }} />
                    <span className="text-sm font-medium" style={{ color: groupColors.family }}>Family</span>
                  </button>
                  <button
                    onClick={() => setNewPersonGroup("friends")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                      newPersonGroup === "friends"
                        ? "ring-2 ring-white/30"
                        : "hover:bg-white/5"
                    }`}
                    style={{
                      background: newPersonGroup === "friends" ? `${groupColors.friends}30` : `${groupColors.friends}10`,
                    }}
                  >
                    <Users className="w-4 h-4" style={{ color: groupColors.friends }} />
                    <span className="text-sm font-medium" style={{ color: groupColors.friends }}>Friends</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddPersonModal(false)}
                  className="flex-1 py-3 rounded-xl glass-button text-foreground/70 hover:text-foreground/90 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPerson}
                  disabled={!newPersonName.trim()}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    newPersonName.trim()
                      ? "bg-white/20 text-foreground hover:bg-white/30"
                      : "bg-white/5 text-foreground/30 cursor-not-allowed"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Person
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Draft Modal */}
      <AnimatePresence>
        {showMessageModal && selectedAttentionPerson && (
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMessageModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative liquid-glass p-6 rounded-3xl w-full max-w-md"
            >
              {/* Header with person info */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${groupColors[selectedAttentionPerson.group]}, ${groupColors[selectedAttentionPerson.group]}dd)`,
                    boxShadow: `0 4px 16px ${groupColors[selectedAttentionPerson.group]}50`
                  }}
                >
                  {selectedAttentionPerson.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground/90">
                    Reconnect with {selectedAttentionPerson.name}
                  </h2>
                  <p className="text-sm text-foreground/50">
                    Last connected {selectedAttentionPerson.daysAgo} days ago
                  </p>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>

              {/* Motivational message */}
              <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <p className="text-sm text-foreground/80 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>
                    A quick message can brighten their day and strengthen your bond.
                    It only takes a moment to show you care!
                  </span>
                </p>
              </div>

              {/* Draft message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Your personalized message
                </label>
                <div className="relative">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-foreground/80 text-sm leading-relaxed min-h-[120px]">
                    {generateReconnectMessage(selectedAttentionPerson)}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopyMessage(generateReconnectMessage(selectedAttentionPerson))}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    copiedMessage
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-white/10 text-foreground/80 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Message
                    </>
                  )}
                </button>
                <a
                  href={`https://wa.me/${selectedAttentionPerson.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generateReconnectMessage(selectedAttentionPerson))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              {/* Call option */}
              <button
                onClick={() => handleCallClick(selectedAttentionPerson.phone)}
                className="w-full mt-3 py-3 rounded-xl font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call {selectedAttentionPerson.name} Instead
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
