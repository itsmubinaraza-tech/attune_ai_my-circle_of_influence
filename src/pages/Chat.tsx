import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, History, Plus, Trash2, Zap, User, ChevronDown, MessageSquare } from 'lucide-react';
import ChatInterface from '@/components/attune/ChatInterface';
import CreditsDisplay from '@/components/attune/CreditsDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useSessions, useCreateSession, useSession, useUpdateSession, useDeleteSession, useSessionsForPerson } from '@/hooks/useChat';
import { usePeople } from '@/hooks/usePeople';
import { useCreditsInfo, useUseCredits } from '@/hooks/useCredits';
import { useAnonymousCredits } from '@/hooks/useAnonymousCredits';
import { parseMessages, type ChatMessage } from '@/services/chat';
import { sendChatMessage, personToContext, generateFallbackResponse, shouldUseFallback } from '@/services/ai';
import type { Person, CoachingSession } from '@/types/database';
import { toast } from 'sonner';

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // URL parameters
  const sessionIdParam = searchParams.get('session');
  const personIdParam = searchParams.get('person');
  const moodParam = searchParams.get('mood');
  const outcomeParam = searchParams.get('outcome');

  // State
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionIdParam);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Queries - only fetch if user is logged in
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: currentSession, isLoading: sessionLoading } = useSession(currentSessionId);
  const { data: people = [] } = usePeople();
  const { data: personSessions = [] } = useSessionsForPerson(personIdParam);

  // Credits - use anonymous credits for non-logged in users
  const { remaining: authCreditsRemaining, isEmpty: authNoCredits } = useCreditsInfo();
  const { remainingCredits: anonCreditsRemaining, hasCredits: anonHasCredits, useCredit: useAnonCredit, limitReached: anonLimitReached } = useAnonymousCredits();
  const useCreditsAuth = useUseCredits();

  // Determine which credits to use based on auth state
  const creditsRemaining = user ? authCreditsRemaining : anonCreditsRemaining;
  const noCredits = user ? authNoCredits : anonLimitReached;

  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  // Filter sessions to show - if person selected, show only their sessions; otherwise show all
  const displayedSessions = useMemo(() => {
    if (personIdParam && personSessions.length > 0) {
      return personSessions;
    }
    return sessions;
  }, [personIdParam, personSessions, sessions]);

  // Set selected person from URL param
  useEffect(() => {
    if (personIdParam && people.length > 0) {
      const person = people.find(p => p.id === personIdParam);
      if (person) setSelectedPerson(person);
    }
  }, [personIdParam, people]);

  // Auto-load most recent session for the person if no session is specified
  useEffect(() => {
    if (personIdParam && !sessionIdParam && personSessions.length > 0) {
      // Only auto-load if the most recent session is from the last 24 hours
      const mostRecent = personSessions[0];
      const sessionAge = Date.now() - new Date(mostRecent.created_at).getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (sessionAge < oneDayMs) {
        // Continue the recent conversation
        setCurrentSessionId(mostRecent.id);
        setSearchParams({ session: mostRecent.id, person: personIdParam });
      }
    }
  }, [personIdParam, sessionIdParam, personSessions]);

  // Load messages from current session
  useEffect(() => {
    if (currentSession) {
      setMessages(parseMessages(currentSession.messages));
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  // Generate AI response using Claude API with fallback
  const generateAIResponse = async (
    conversationMessages: ChatMessage[],
    context: {
      person?: Person | null;
      mood?: string | null;
      outcome?: string | null;
    }
  ): Promise<string> => {
    // For anonymous users, use fallback responses directly (no API auth)
    if (!user) {
      return generateFallbackResponse(
        conversationMessages,
        context.person || null,
        context.mood || null
      );
    }

    try {
      // Try to call Claude API via Edge Function (authenticated users only)
      const response = await sendChatMessage({
        messages: conversationMessages,
        personContext: personToContext(context.person || null),
        mood: context.mood,
        outcomeGoal: context.outcome,
      });

      return response.message;
    } catch (error) {
      console.warn('Claude API unavailable, using fallback:', error);
      // Fall back to local responses if API fails
      return generateFallbackResponse(
        conversationMessages,
        context.person || null,
        context.mood || null
      );
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    // Check for credits
    if (noCredits) {
      if (user) {
        toast.error('No credits remaining. Your credits will reset next month.');
      } else {
        toast.error('You\'ve used all 10 free messages. Sign up to continue!', {
          action: {
            label: 'Sign Up',
            onClick: () => navigate('/signup'),
          },
        });
      }
      return;
    }

    setIsProcessing(true);

    try {
      // Use a credit for this message
      if (user) {
        await useCreditsAuth.mutateAsync(1);
      } else {
        const credited = useAnonCredit();
        if (!credited) {
          toast.error('You\'ve used all 10 free messages. Sign up to continue!');
          setIsProcessing(false);
          return;
        }
      }

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Only save sessions for logged-in users
      let sessionId = currentSessionId;

      if (user) {
        if (!sessionId) {
          // Create new session
          const newSession = await createSession.mutateAsync({
            person_id: selectedPerson?.id || null,
            messages: updatedMessages,
            mood: moodParam || null,
            outcome_goal: outcomeParam || null,
          });
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          setSearchParams({ session: sessionId });
        } else {
          // Update existing session
          await updateSession.mutateAsync({
            sessionId,
            updates: { messages: updatedMessages },
          });
        }
      }

      // Generate AI response
      const aiResponseContent = await generateAIResponse(updatedMessages, {
        person: selectedPerson,
        mood: moodParam,
        outcome: outcomeParam,
      });

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Save AI response to session (only for logged-in users)
      if (user && sessionId) {
        await updateSession.mutateAsync({
          sessionId,
          updates: { messages: finalMessages },
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setSelectedPerson(null);
    setSearchParams({});
  };

  // Handle selecting a session from history
  const handleSelectSession = (session: CoachingSession) => {
    setCurrentSessionId(session.id);
    setSearchParams({ session: session.id });
    setShowHistory(false);

    // Set selected person if session has one
    if (session.person_id) {
      const person = people.find(p => p.id === session.person_id);
      if (person) setSelectedPerson(person);
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await deleteSession.mutateAsync(sessionId);
      toast.success('Conversation deleted');

      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  // Format session preview
  const getSessionPreview = (session: CoachingSession) => {
    const msgs = parseMessages(session.messages);
    const lastUserMsg = [...msgs].reverse().find(m => m.role === 'user');
    return lastUserMsg?.content.slice(0, 50) + (lastUserMsg && lastUserMsg.content.length > 50 ? '...' : '') || 'New conversation';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 px-4 py-3 border-b border-white/10 bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground/90">Talk to Me</h1>
              {selectedPerson && (
                <p className="text-xs text-foreground/50">
                  About {selectedPerson.name} • {selectedPerson.group}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Credits Display */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Zap className={`w-4 h-4 ${noCredits ? 'text-red-400' : creditsRemaining <= 10 ? 'text-amber-400' : 'text-purple-400'}`} />
              <span className={`text-sm font-medium ${noCredits ? 'text-red-400' : creditsRemaining <= 10 ? 'text-amber-400' : 'text-foreground/70'}`}>
                {creditsRemaining}{!user && '/10 free'}
              </span>
            </div>

            {/* Sign Up prompt for anonymous users */}
            {!user && (
              <Link
                to="/signup"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm font-medium"
              >
                Sign Up
              </Link>
            )}

            {/* History Button - only for logged in users */}
            {user && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  showHistory ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 hover:bg-white/10 text-foreground/70'
                }`}
                title="Chat history"
              >
                <History className="w-5 h-5" />
              </button>
            )}

            {/* New Chat Button - only for logged in users */}
            {user && (
              <button
                onClick={handleNewChat}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-foreground/70"
                title="New chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}

            {/* Circle Link - only for logged in users */}
            {user && (
              <Link
                to="/circle"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-foreground/70"
                title="My Circle"
              >
                <Users className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-4xl mx-auto w-full">
        {/* History Sidebar - only for logged in users */}
        <AnimatePresence>
          {user && showHistory && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-72 border-r border-white/10 flex flex-col bg-white/5"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium text-foreground/90">
                      {selectedPerson ? `Conversations with ${selectedPerson.name}` : 'Conversation History'}
                    </h2>
                    <p className="text-xs text-foreground/50 mt-1">
                      {displayedSessions.length} conversation{displayedSessions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {selectedPerson && (
                    <button
                      onClick={() => {
                        setSelectedPerson(null);
                        setSearchParams(currentSessionId ? { session: currentSessionId } : {});
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Show all
                    </button>
                  )}
                </div>

                {/* Person indicator */}
                {selectedPerson && (
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground/80 truncate">{selectedPerson.name}</p>
                      <p className="text-xs text-foreground/50 capitalize">{selectedPerson.group}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {sessionsLoading ? (
                  <div className="p-4 text-center text-foreground/50 text-sm">Loading...</div>
                ) : displayedSessions.length === 0 ? (
                  <div className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-foreground/50">
                      {selectedPerson ? `No conversations with ${selectedPerson.name} yet` : 'No conversations yet'}
                    </p>
                    <p className="text-xs text-foreground/40 mt-1">Start chatting to create your first one</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {displayedSessions.map((session) => {
                      const person = session.person_id ? people.find(p => p.id === session.person_id) : null;
                      const isActive = session.id === currentSessionId;

                      return (
                        <div
                          key={session.id}
                          onClick={() => handleSelectSession(session)}
                          className={`p-3 cursor-pointer transition-colors group ${
                            isActive ? 'bg-purple-500/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {person && !selectedPerson && (
                                <p className="text-xs text-purple-400 mb-1">About {person.name}</p>
                              )}
                              <p className="text-sm text-foreground/80 truncate">
                                {getSessionPreview(session)}
                              </p>
                              <p className="text-xs text-foreground/40 mt-1">
                                {formatDate(session.created_at)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-foreground/40 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={sessionLoading}
            isProcessing={isProcessing}
            selectedPerson={selectedPerson}
            selectedMood={moodParam}
            selectedOutcome={outcomeParam}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
