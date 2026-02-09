import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import MoodSelector from "@/components/attune/MoodSelector";
import PersonSearch from "@/components/attune/PersonSearch";
import OutcomeSelector from "@/components/attune/OutcomeSelector";
import ThemeSelector, { type ThemeName } from "@/components/attune/ThemeSelector";
import AddPersonModal from "@/components/attune/AddPersonModal";
import PersonProfileModal from "@/components/attune/PersonProfileModal";
import RelationshipGraph from "@/components/attune/RelationshipGraph";
import { CircleInsightsWidget } from "@/components/attune/CircleInsightsWidget";
import QuickTalkModal from "@/components/attune/QuickTalkModal";
import HeroSection from "@/components/landing/HeroSection";
import WalkthroughOverlay from "@/components/onboarding/WalkthroughOverlay";
import UpgradePrompt from "@/components/auth/UpgradePrompt";
import FloatingQuickTalk from "@/components/chat/FloatingQuickTalk";
import { useAuth } from "@/contexts/AuthContext";
import { usePeopleWithAutoSeed, usePeopleNeedingAttention } from "@/hooks/usePeople";
import { useConnections } from "@/hooks/useConnections";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAnonymousCredits } from "@/hooks/useAnonymousCredits";
import { ArrowRight, Sparkles, Clock, AlertCircle, MessageSquare, Menu, X, UserPlus, Briefcase, Heart, Users, Phone, MessageCircle, Copy, Check, LogOut, Mic, HelpCircle, LogIn, UserCog } from "lucide-react";
import { toast } from "sonner";
import type { Person as DbPerson } from "@/types/database";

export type Mood = "calm" | "anxious" | "frustrated" | "hopeful" | "tired" | "motivated" | "uncertain" | "confident";
export type ContextType = "work" | "family" | "friends" | null;

export interface Person {
  id: string;
  name: string;
  photo?: string;
  group: "work" | "family" | "friends" | "acquaintances";
  subgroup?: string;
}

// Mock data for demo - 7 people per group
const mockPeople: Person[] = [
  // Work colleagues (7)
  { id: "w1", name: "Sarah Chen", group: "work", subgroup: "Manager" },
  { id: "w2", name: "Marcus Johnson", group: "work", subgroup: "Team" },
  { id: "w3", name: "Emily Wong", group: "work", subgroup: "Stakeholder" },
  { id: "w4", name: "David Kim", group: "work", subgroup: "Team" },
  { id: "w5", name: "Lisa Patel", group: "work", subgroup: "Manager" },
  { id: "w6", name: "Tom Rodriguez", group: "work", subgroup: "Client" },
  { id: "w7", name: "Nina Okonkwo", group: "work", subgroup: "HR" },
  // Family members (7)
  { id: "f1", name: "Mom", group: "family", subgroup: "Immediate" },
  { id: "f2", name: "Dad", group: "family", subgroup: "Immediate" },
  { id: "f3", name: "Brother Mike", group: "family", subgroup: "Immediate" },
  { id: "f4", name: "Sister Emma", group: "family", subgroup: "Immediate" },
  { id: "f5", name: "Grandma Rose", group: "family", subgroup: "Extended" },
  { id: "f6", name: "Uncle James", group: "family", subgroup: "Extended" },
  { id: "f7", name: "Cousin Priya", group: "family", subgroup: "Extended" },
  // Friends (7)
  { id: "fr1", name: "Alex Rivera", group: "friends", subgroup: "Close" },
  { id: "fr2", name: "Jordan Taylor", group: "friends", subgroup: "Close" },
  { id: "fr3", name: "Jake Miller", group: "friends", subgroup: "Close" },
  { id: "fr4", name: "Sophia Lee", group: "friends", subgroup: "College" },
  { id: "fr5", name: "Chris O'Brien", group: "friends", subgroup: "Gym" },
  { id: "fr6", name: "Mia Santos", group: "friends", subgroup: "Neighborhood" },
  { id: "fr7", name: "Ryan Chen", group: "friends", subgroup: "College" },
  // Acquaintances (7)
  { id: "a1", name: "Dr. Amanda Foster", group: "acquaintances", subgroup: "Professional" },
  { id: "a2", name: "Kevin the Barista", group: "acquaintances", subgroup: "Social" },
  { id: "a3", name: "Linda from Yoga", group: "acquaintances", subgroup: "Social" },
  { id: "a4", name: "Mark the Neighbor", group: "acquaintances", subgroup: "Neighbor" },
  { id: "a5", name: "Rachel from Conference", group: "acquaintances", subgroup: "Professional" },
  { id: "a6", name: "Sam the Trainer", group: "acquaintances", subgroup: "Social" },
  { id: "a7", name: "Tina from Book Club", group: "acquaintances", subgroup: "Social" },
];

// Mock data for dashboard widgets (fallback when no real data)
const mockNeedsAttention = [
  { id: "mock-1", name: "Mom", daysAgo: 14, group: "family" as const, phone: "+1234567890" },
  { id: "mock-2", name: "Jake Miller", daysAgo: 10, group: "friends" as const, phone: "+1987654321" },
  { id: "mock-3", name: "Sarah Chen", daysAgo: 21, group: "work" as const, phone: "+1555123456" },
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
  acquaintances: "hsl(45, 84%, 55%)",
};

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Anonymous credits for users without account
  const {
    remainingCredits: anonymousCredits,
    maxCredits: maxAnonymousCredits,
    limitReached: anonymousLimitReached,
  } = useAnonymousCredits();

  // Onboarding walkthrough
  const {
    hasSeenOnboarding,
    isOnboardingActive,
    startOnboarding,
    resetOnboarding,
  } = useOnboarding();

  // Fetch real data from Supabase (only if authenticated)
  const { data: dbPeople = [], isLoading: peopleLoading } = usePeopleWithAutoSeed();
  const { data: peopleNeedingAttention = [] } = usePeopleNeedingAttention(7);
  const { data: connections = [] } = useConnections();

  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<ContextType>("work");
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("dark-purple");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<"all" | "work" | "family" | "friends" | "acquaintances">("all");
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfilePersonId, setSelectedProfilePersonId] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAttentionPerson, setSelectedAttentionPerson] = useState<{
    id: string;
    name: string;
    daysAgo: number;
    group: "work" | "family" | "friends";
    phone: string;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showQuickTalkModal, setShowQuickTalkModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  // Floating mic is always visible
  const showFloatingMic = true;

  // Start onboarding for new anonymous users
  useEffect(() => {
    if (!user && hasSeenOnboarding === false) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, hasSeenOnboarding, startOnboarding]);

  // Convert database people to display format (merge with mock data for demo)
  const people: Person[] = [
    ...dbPeople.map((p: DbPerson) => ({
      id: p.id,
      name: p.name,
      photo: p.photo_url || undefined,
      group: p.group as "work" | "family" | "friends",
      subgroup: p.subgroup || undefined,
    })),
    // Fallback to mock data if no real data
    ...(dbPeople.length === 0 ? mockPeople : []),
  ];

  // Convert people needing attention to display format
  const needsAttention = peopleNeedingAttention.length > 0
    ? peopleNeedingAttention.slice(0, 3).map((p: DbPerson) => {
        const lastContact = p.last_contact ? new Date(p.last_contact) : null;
        const daysAgo = lastContact
          ? Math.ceil((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
          : 30;
        return {
          id: p.id,
          name: p.name,
          daysAgo,
          group: p.group as "work" | "family" | "friends",
          phone: p.phone || "",
        };
      })
    : mockNeedsAttention;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/signin");
    }
  };


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

  // Open person profile modal
  const handleOpenProfile = (personId: string) => {
    // Only open profile for real database entries (not mock data)
    if (!personId.startsWith("mock-") && !personId.startsWith("custom-") && personId.length > 10) {
      setSelectedProfilePersonId(personId);
      setShowProfileModal(true);
    }
  };

  // Handle person added from AddPersonModal
  const handlePersonAdded = () => {
    // Data will refresh automatically via React Query
    toast.success("Person added to your circle!");
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

      {/* Main content - Responsive layout, single screen height on mobile */}
      <div className="relative z-10 h-screen lg:min-h-screen flex flex-col px-3 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-8 max-w-7xl mx-auto overflow-hidden lg:overflow-visible">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-1 sm:mb-6 lg:mb-8"
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
            <div className="hidden lg:flex items-center gap-3">
              {/* Logo */}
              <img src="/favicon.svg" alt="Attune" className="w-8 h-8" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Attune
              </h1>
            </div>
            <div className="text-center lg:hidden">
              <div className="flex items-center justify-center gap-2">
                <img src="/favicon.svg" alt="Attune" className="w-6 h-6" />
                <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Attune
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-foreground/50 hidden sm:block">
                Connect with intention
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Navigation for web - different for authenticated vs anonymous */}
              {user ? (
                <nav className="hidden lg:flex items-center gap-6 mr-6">
                  <Link to="/" className="text-sm font-medium text-foreground/90 transition-colors">Today</Link>
                  <Link to="/circle" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Circle</Link>
                  <Link to="/chat" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Talk</Link>
                  <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors">Me</a>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </nav>
              ) : (
                <nav className="hidden lg:flex items-center gap-4 mr-6">
                  <button
                    onClick={resetOnboarding}
                    className="text-sm font-medium text-foreground/50 hover:text-foreground/70 transition-colors flex items-center gap-1"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Take a Tour
                  </button>
                  <span className="text-xs text-foreground/30 bg-foreground/5 px-2 py-1 rounded-full">
                    {anonymousCredits}/{maxAnonymousCredits} free messages
                  </span>
                  <Link
                    to="/signin"
                    className="text-sm font-medium text-foreground/70 hover:text-foreground/90 transition-colors flex items-center gap-1"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Sign Up Free
                  </Link>
                </nav>
              )}
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
                  {user ? (
                    <>
                      <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 bg-white/10 transition-colors">Today</Link>
                      <Link to="/circle" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Circle of Influence
                        </span>
                      </Link>
                      <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Talk to Me
                        </span>
                      </Link>
                      <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Conversations
                        </span>
                      </Link>
                      <Link to="/circle" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          Needs Attention
                        </span>
                      </Link>
                      <a href="#" className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <UserCog className="w-4 h-4" />
                          Profile
                        </span>
                      </a>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-2 px-4 mb-2">
                        <span className="text-sm text-foreground/60">Free messages</span>
                        <span className="text-sm font-medium text-purple-400">{anonymousCredits}/{maxAnonymousCredits}</span>
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          resetOnboarding();
                        }}
                        className="w-full py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Take a Tour
                      </button>
                      <Link to="/circle" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Circle of Influence
                        </span>
                      </Link>
                      <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Talk to Me
                        </span>
                      </Link>
                      <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Conversations
                        </span>
                      </Link>
                      <Link to="/circle" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          Needs Attention
                        </span>
                      </Link>
                      <div className="border-t border-white/10 pt-2 mt-2 space-y-2">
                        <Link
                          to="/signin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-3 px-4 rounded-xl text-foreground/80 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-3 px-4 rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 transition-colors text-center font-medium"
                        >
                          Sign Up Free
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Hero Section for anonymous users */}
        {!user && (
          <HeroSection />
        )}

        {/* Main Grid - Mobile: Stack (single screen), Desktop: 2 columns */}
        <div className="flex-1 flex flex-col lg:flex-row gap-2 lg:gap-8 min-h-0">
          {/* Left Column - Main Widgets (fits in mobile viewport without scrolling) */}
          <div className="flex flex-col gap-1 sm:gap-2 lg:gap-4 lg:w-1/2 xl:w-2/5 flex-1 min-h-0">
            {/* Part 1: Mood Check-in */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:flex-1"
              data-onboarding="mood-selector"
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
              data-onboarding="person-search"
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
              data-onboarding="outcome-selector"
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
              className="space-y-2 sm:space-y-3"
            >
              <button
                disabled={!isFlowComplete}
                onClick={() => {
                  // Check if anonymous user has reached limit
                  if (!user && anonymousLimitReached) {
                    setShowUpgradePrompt(true);
                    return;
                  }
                  if (isFlowComplete) {
                    const params = new URLSearchParams();
                    if (selectedPerson) params.set('person', selectedPerson.id);
                    if (selectedMood) params.set('mood', selectedMood);
                    if (selectedOutcome) params.set('outcome', selectedOutcome);
                    navigate(`/chat?${params.toString()}`);
                  }
                }}
                data-onboarding="connect-button"
                className={`w-full py-2 sm:py-3 lg:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white flex items-center justify-center gap-2 sm:gap-3 btn-liquid-primary transition-all text-sm sm:text-base ${
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

          {/* Right Column - Dashboard Widgets (hidden on mobile, visible on desktop) */}
          <div className="hidden lg:flex flex-col gap-3 lg:gap-4 lg:w-1/2 xl:w-3/5">
            {/* Relationship Graph */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="liquid-glass p-4 sm:p-6 lg:flex-1 min-h-[280px]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">Your Circle of Influence</h3>
                <Link
                  to="/circle"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All →
                </Link>
              </div>

              {/* Interactive Relationship Graph */}
              <RelationshipGraph
                people={dbPeople}
                connections={connections}
                selectedPersonId={selectedPerson?.id}
                onPersonClick={(person) => {
                  const p = people.find(pp => pp.id === person.id);
                  if (p) handlePersonSelect(p);
                }}
                onPersonDoubleClick={(person) => handleOpenProfile(person.id)}
              />
            </motion.section>

            {/* Circle Insights */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <CircleInsightsWidget compact />
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
                          // Open profile for real database entries
                          handleOpenProfile(person.id);
                          // Also select the person for the flow
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
      <AddPersonModal
        isOpen={showAddPersonModal}
        onClose={() => setShowAddPersonModal(false)}
        onPersonAdded={handlePersonAdded}
      />

      {/* Person Profile Modal */}
      <PersonProfileModal
        personId={selectedProfilePersonId}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfilePersonId(null);
        }}
      />

      {/* Quick Talk Modal - Voice-first flow */}
      <QuickTalkModal
        isOpen={showQuickTalkModal}
        onClose={() => setShowQuickTalkModal(false)}
      />

      {/* Onboarding Walkthrough for new users */}
      {!user && <WalkthroughOverlay />}

      {/* Upgrade Prompt for anonymous users who hit limit */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        messagesUsed={maxAnonymousCredits - anonymousCredits}
        maxMessages={maxAnonymousCredits}
      />

      {/* Floating Quick Talk button for mobile (shows when scrolled past main button) */}
      <AnimatePresence>
        {showFloatingMic && (
          <FloatingQuickTalk
            onClick={() => {
              if (!user && anonymousLimitReached) {
                setShowUpgradePrompt(true);
                return;
              }
              setShowQuickTalkModal(true);
            }}
            isVisible={showFloatingMic && !showQuickTalkModal && !showUpgradePrompt}
          />
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
