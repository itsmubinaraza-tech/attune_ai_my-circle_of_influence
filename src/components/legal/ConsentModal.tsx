import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, FileText, Bot, Database, Check, Phone } from 'lucide-react';
import { useRecordAllConsents } from '@/hooks/useConsent';

interface ConsentModalProps {
  isOpen: boolean;
  email: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentModal({
  isOpen,
  email,
  onAccept,
  onDecline,
}: ConsentModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedSections, setAcceptedSections] = useState({
    terms: false,
    privacy: false,
    ai: false,
    crisis: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const recordConsents = useRecordAllConsents();

  const allAccepted = Object.values(acceptedSections).every(Boolean);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      return () => scrollEl.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleAccept = async () => {
    if (!allAccepted) return;
    setIsSubmitting(true);
    try {
      await recordConsents.mutateAsync(email);
      onAccept();
    } catch (error) {
      console.error('Failed to record consents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: keyof typeof acceptedSections) => {
    setAcceptedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Before You Begin</h2>
                  <p className="text-sm text-white/60">Please review and accept our terms</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
              style={{ maxHeight: 'calc(90vh - 200px)' }}
            >
              {/* CRISIS RESOURCES - PROMINENT */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Important: Crisis Resources
                    </h3>
                    <p className="text-sm text-white/80 mb-3">
                      <strong className="text-red-300">Attune is NOT a crisis service.</strong> If you or someone you know is in danger or experiencing a mental health crisis, please contact professional help immediately:
                    </p>
                    <ul className="text-sm text-white/70 space-y-1 mb-3">
                      <li>US National Suicide Prevention Lifeline: <span className="text-white font-medium">988</span></li>
                      <li>Crisis Text Line: Text <span className="text-white font-medium">HOME</span> to <span className="text-white font-medium">741741</span></li>
                      <li>International Association for Suicide Prevention: <span className="text-white font-medium">https://www.iasp.info/resources/Crisis_Centres/</span></li>
                      <li>Emergency Services: <span className="text-white font-medium">911</span> (US) or your local emergency number</li>
                    </ul>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedSections.crisis}
                        onChange={() => toggleSection('crisis')}
                        className="mt-1 w-4 h-4 rounded border-red-400/50 bg-red-500/10 text-red-500 focus:ring-red-500/30"
                      />
                      <span className="text-sm text-white/80">
                        I understand that Attune is not a substitute for professional mental health care or crisis intervention services
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* AI DISCLAIMER */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-400 mb-2">
                      AI-Powered Guidance Disclaimer
                    </h3>
                    <p className="text-sm text-white/80 mb-3">
                      Attune uses artificial intelligence to provide communication guidance. Please understand:
                    </p>
                    <ul className="text-sm text-white/70 space-y-1 mb-3 list-disc list-inside">
                      <li>AI suggestions are not professional therapy, counseling, or medical advice</li>
                      <li>Responses are generated by AI and may not always be accurate or appropriate for your specific situation</li>
                      <li>You are responsible for your own decisions and actions in conversations</li>
                      <li>For professional relationship or mental health support, consult a licensed professional</li>
                    </ul>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedSections.ai}
                        onChange={() => toggleSection('ai')}
                        className="mt-1 w-4 h-4 rounded border-amber-400/50 bg-amber-500/10 text-amber-500 focus:ring-amber-500/30"
                      />
                      <span className="text-sm text-white/80">
                        I understand that AI guidance is not a substitute for professional advice
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* TERMS OF SERVICE */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Terms of Service
                    </h3>
                    <p className="text-sm text-white/70 mb-3">
                      By using Attune, you agree to our terms including:
                    </p>
                    <ul className="text-sm text-white/60 space-y-1 mb-3 list-disc list-inside">
                      <li>You must be 18 years or older to use this service</li>
                      <li>You will use the service for lawful purposes only</li>
                      <li>You are responsible for maintaining the confidentiality of your account</li>
                      <li>We may modify or discontinue the service at any time</li>
                    </ul>
                    <div className="flex items-center justify-between">
                      <a
                        href="/legal/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 underline"
                      >
                        Read full Terms of Service
                      </a>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptedSections.terms}
                          onChange={() => toggleSection('terms')}
                          className="w-4 h-4 rounded border-white/30 bg-white/5 text-purple-500 focus:ring-purple-500/30"
                        />
                        <span className="text-sm text-white/80">I agree</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRIVACY POLICY */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Privacy Policy & Data Handling
                    </h3>
                    <p className="text-sm text-white/70 mb-3">
                      We take your privacy seriously. Here's how we handle your data:
                    </p>
                    <ul className="text-sm text-white/60 space-y-1 mb-3 list-disc list-inside">
                      <li>Your conversations and contact information are encrypted and stored securely</li>
                      <li>We do not sell your personal data to third parties</li>
                      <li>You can export or delete your data at any time</li>
                      <li>We comply with GDPR, CCPA, and other applicable privacy laws</li>
                    </ul>
                    <div className="flex items-center justify-between">
                      <a
                        href="/legal/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                      >
                        Read full Privacy Policy
                      </a>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptedSections.privacy}
                          onChange={() => toggleSection('privacy')}
                          className="w-4 h-4 rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                        />
                        <span className="text-sm text-white/80">I agree</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Confirmation */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm text-white/80">
                    By creating an account, you confirm that you are <strong>18 years of age or older</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-white/10 bg-black/20">
              <div className="flex gap-3">
                <button
                  onClick={onDecline}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 font-medium transition-all"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!allAccepted || isSubmitting}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    allAccepted && !isSubmitting
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Accept & Continue
                    </>
                  )}
                </button>
              </div>
              {!allAccepted && (
                <p className="text-xs text-white/40 text-center mt-3">
                  Please review and accept all sections above to continue
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
