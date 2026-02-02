import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mic,
  MicOff,
  MessageCircle,
  RefreshCw,
  ArrowRight,
  Loader2,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usePeople } from '@/hooks/usePeople';
import type { Person } from '@/types/database';

interface QuickTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConversationStep = 'greeting' | 'listening_mood_person' | 'confirming_person' | 'asking_intent' | 'listening_intent' | 'ready';
type UserIntent = 'guidance' | 'update' | null;

const MOODS = ['calm', 'anxious', 'frustrated', 'hopeful', 'tired', 'motivated', 'uncertain', 'confident'];

const groupColors: Record<string, string> = {
  work: 'hsl(239, 84%, 67%)',
  family: 'hsl(330, 81%, 70%)',
  friends: 'hsl(160, 64%, 52%)',
  acquaintances: 'hsl(45, 84%, 55%)',
};

export default function QuickTalkModal({ isOpen, onClose }: QuickTalkModalProps) {
  const navigate = useNavigate();
  const { data: people = [] } = usePeople();

  const [step, setStep] = useState<ConversationStep>('greeting');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [detectedPerson, setDetectedPerson] = useState<Person | null>(null);
  const [userIntent, setUserIntent] = useState<UserIntent>(null);
  const [possibleMatches, setPossibleMatches] = useState<Person[]>([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if speech recognition is supported
  const isSpeechSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSpeechSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        handleTranscriptComplete(text);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSpeechSupported]);

  // Speak text using Web Speech API
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
      setIsListening(false);
    }
  }, [isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Find person by name in transcript
  const findPersonInTranscript = useCallback((text: string): Person[] => {
    const lowerText = text.toLowerCase();

    // First try exact match
    const exactMatches = people.filter(p =>
      lowerText.includes(p.name.toLowerCase())
    );
    if (exactMatches.length > 0) return exactMatches;

    // Try partial matches (first name only)
    const partialMatches = people.filter(p => {
      const firstName = p.name.split(' ')[0].toLowerCase();
      return lowerText.includes(firstName) && firstName.length > 2;
    });

    return partialMatches;
  }, [people]);

  // Detect mood from transcript
  const detectMoodInTranscript = useCallback((text: string): string | null => {
    const lowerText = text.toLowerCase();

    // Direct mood mentions
    for (const mood of MOODS) {
      if (lowerText.includes(mood)) return mood;
    }

    // Synonyms and related words
    const moodMappings: Record<string, string[]> = {
      anxious: ['nervous', 'worried', 'stressed', 'anxious', 'overwhelmed', 'scared'],
      frustrated: ['frustrated', 'angry', 'annoyed', 'irritated', 'upset'],
      calm: ['calm', 'relaxed', 'peaceful', 'good', 'fine', 'okay', 'ok', 'great'],
      hopeful: ['hopeful', 'optimistic', 'excited', 'looking forward'],
      tired: ['tired', 'exhausted', 'drained', 'sleepy', 'worn out'],
      motivated: ['motivated', 'energized', 'pumped', 'ready', 'determined'],
      uncertain: ['uncertain', 'confused', 'unsure', 'not sure', 'don\'t know'],
      confident: ['confident', 'sure', 'certain', 'prepared'],
    };

    for (const [mood, keywords] of Object.entries(moodMappings)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) return mood;
      }
    }

    return null;
  }, []);

  // Detect intent from transcript
  const detectIntentInTranscript = useCallback((text: string): UserIntent => {
    const lowerText = text.toLowerCase();

    // Update intent keywords
    const updateKeywords = ['update', 'tell you how', 'went well', 'went great', 'it went',
      'happened', 'result', 'outcome', 'how it went', 'finished', 'completed', 'done'];

    // Guidance intent keywords
    const guidanceKeywords = ['help', 'guidance', 'advice', 'support', 'prepare',
      'going to talk', 'about to', 'need to talk', 'want to talk', 'upcoming', 'before'];

    for (const keyword of updateKeywords) {
      if (lowerText.includes(keyword)) return 'update';
    }

    for (const keyword of guidanceKeywords) {
      if (lowerText.includes(keyword)) return 'guidance';
    }

    return null;
  }, []);

  // Handle completed transcript
  const handleTranscriptComplete = useCallback((text: string) => {
    if (step === 'listening_mood_person') {
      const mood = detectMoodInTranscript(text);
      const matches = findPersonInTranscript(text);

      if (mood) setDetectedMood(mood);

      if (matches.length === 1) {
        setDetectedPerson(matches[0]);
        setPossibleMatches([]);
        setStep('asking_intent');

        const moodText = mood ? `I sense you're feeling ${mood}. ` : '';
        speak(
          `${moodText}Got it, you want to talk about ${matches[0].name}. Are you looking for guidance before a conversation, or updating me on how it went?`,
          () => {
            setStep('listening_intent');
            setTimeout(startListening, 500);
          }
        );
      } else if (matches.length > 1) {
        setPossibleMatches(matches);
        setStep('confirming_person');
      } else {
        // No person found, ask again
        speak(
          "I didn't catch the person's name. Could you tell me again who you want to talk about?",
          () => setTimeout(startListening, 500)
        );
      }
    } else if (step === 'listening_intent') {
      const intent = detectIntentInTranscript(text);

      if (intent) {
        setUserIntent(intent);
        setStep('ready');

        if (intent === 'guidance') {
          speak("Perfect! Let me help you prepare for that conversation.", () => {
            // Navigate to chat with context
            handleNavigateToChat();
          });
        } else {
          speak("Great! Let's log how that conversation went.", () => {
            // Navigate to log interaction
            handleNavigateToUpdate();
          });
        }
      } else {
        speak(
          "Would you like guidance before talking to them, or are you updating me on a conversation you already had?",
          () => setTimeout(startListening, 500)
        );
      }
    }
  }, [step, detectMoodInTranscript, findPersonInTranscript, detectIntentInTranscript, speak, startListening]);

  // Start the conversation flow
  useEffect(() => {
    if (isOpen && step === 'greeting') {
      // Small delay before greeting
      const timer = setTimeout(() => {
        speak(
          "Hi there! How are you feeling today? And who would you like to talk about?",
          () => {
            setStep('listening_mood_person');
            setTimeout(startListening, 500);
          }
        );
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, step, speak, startListening]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('greeting');
      setTranscript('');
      setDetectedMood(null);
      setDetectedPerson(null);
      setUserIntent(null);
      setPossibleMatches([]);
      setIsListening(false);
      window.speechSynthesis?.cancel();
    }
  }, [isOpen]);

  // Handle person selection from list
  const handleSelectPerson = (person: Person) => {
    setDetectedPerson(person);
    setPossibleMatches([]);
    setStep('asking_intent');

    speak(
      `Got it, ${person.name}. Are you looking for guidance before a conversation, or updating me on how it went?`,
      () => {
        setStep('listening_intent');
        setTimeout(startListening, 500);
      }
    );
  };

  // Navigate to chat for guidance
  const handleNavigateToChat = () => {
    if (detectedPerson) {
      const params = new URLSearchParams();
      params.set('person', detectedPerson.id);
      if (detectedMood) params.set('mood', detectedMood);
      params.set('outcome', 'resolve'); // Default outcome for guidance

      onClose();
      navigate(`/chat?${params.toString()}`);
    }
  };

  // Navigate to update/log interaction
  const handleNavigateToUpdate = () => {
    if (detectedPerson) {
      const params = new URLSearchParams();
      params.set('person', detectedPerson.id);
      params.set('action', 'log');
      if (detectedMood) params.set('mood', detectedMood);

      onClose();
      navigate(`/chat?${params.toString()}`);
    }
  };

  // Manual button handlers
  const handleGuidanceClick = () => {
    setUserIntent('guidance');
    handleNavigateToChat();
  };

  const handleUpdateClick = () => {
    setUserIntent('update');
    handleNavigateToUpdate();
  };

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
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Main content */}
          <div className="liquid-glass p-8 rounded-3xl text-center">
            {/* Animated orb */}
            <div className="relative mx-auto mb-6">
              <motion.div
                animate={{
                  scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 1.1, 1] : 1,
                  opacity: isSpeaking || isListening ? 1 : 0.7,
                }}
                transition={{
                  duration: 1,
                  repeat: isSpeaking || isListening ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                  isSpeaking
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : isListening
                    ? 'bg-gradient-to-br from-green-400 to-cyan-500'
                    : 'bg-gradient-to-br from-purple-500/50 to-pink-500/50'
                }`}
                style={{
                  boxShadow: isSpeaking
                    ? '0 0 60px rgba(168, 85, 247, 0.5)'
                    : isListening
                    ? '0 0 60px rgba(34, 197, 94, 0.5)'
                    : '0 0 30px rgba(168, 85, 247, 0.3)',
                }}
              >
                {isSpeaking ? (
                  <Volume2 className="w-12 h-12 text-white" />
                ) : isListening ? (
                  <Mic className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <Sparkles className="w-12 h-12 text-white/80" />
                )}
              </motion.div>
            </div>

            {/* Status text */}
            <div className="mb-6 min-h-[60px]">
              {step === 'greeting' && (
                <p className="text-white/70">Starting conversation...</p>
              )}

              {step === 'listening_mood_person' && (
                <>
                  <p className="text-lg text-white mb-2">
                    {isListening ? "I'm listening..." : "How are you feeling? Who do you want to talk about?"}
                  </p>
                  {transcript && (
                    <p className="text-sm text-purple-300 italic">"{transcript}"</p>
                  )}
                </>
              )}

              {step === 'confirming_person' && (
                <>
                  <p className="text-lg text-white mb-4">Which person did you mean?</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {possibleMatches.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => handleSelectPerson(person)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                          style={{ background: groupColors[person.group] || groupColors.acquaintances }}
                        >
                          {person.name.charAt(0)}
                        </div>
                        <span className="text-white">{person.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {(step === 'asking_intent' || step === 'listening_intent') && detectedPerson && (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ background: groupColors[detectedPerson.group] || groupColors.acquaintances }}
                    >
                      {detectedPerson.name.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{detectedPerson.name}</span>
                    {detectedMood && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-xs capitalize">
                        {detectedMood}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">
                    {isListening ? "I'm listening..." : "What would you like to do?"}
                  </p>
                  {transcript && step === 'listening_intent' && (
                    <p className="text-sm text-purple-300 italic mt-2">"{transcript}"</p>
                  )}
                </>
              )}

              {step === 'ready' && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  <p className="text-white/70">Preparing...</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {(step === 'asking_intent' || step === 'listening_intent') && detectedPerson && !isListening && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={handleGuidanceClick}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors group"
                >
                  <MessageCircle className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">Get Guidance</span>
                  <span className="text-xs text-white/50">Prepare for a conversation</span>
                </button>
                <button
                  onClick={handleUpdateClick}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 hover:border-green-500/50 transition-colors group"
                >
                  <RefreshCw className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">Log Update</span>
                  <span className="text-xs text-white/50">How did it go?</span>
                </button>
              </div>
            )}

            {/* Microphone button */}
            {(step === 'listening_mood_person' || step === 'listening_intent') && (
              <div className="mt-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className={`mx-auto flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      Tap to stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Tap to speak
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Skip to manual selection */}
            {step === 'listening_mood_person' && !isListening && !isSpeaking && (
              <button
                onClick={() => {
                  setPossibleMatches(people.slice(0, 10));
                  setStep('confirming_person');
                }}
                className="mt-4 text-sm text-white/50 hover:text-white/70 transition-colors"
              >
                Or select a person manually
              </button>
            )}

            {/* Not supported fallback */}
            {!isSpeechSupported && (
              <div className="text-center">
                <p className="text-white/70 mb-4">
                  Voice input is not supported in your browser.
                </p>
                <button
                  onClick={() => {
                    setPossibleMatches(people.slice(0, 10));
                    setStep('confirming_person');
                  }}
                  className="px-6 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  Select a person manually
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
