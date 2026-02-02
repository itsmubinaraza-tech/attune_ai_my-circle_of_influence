import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Video,
  Users,
  MessageSquare,
  Mail,
  Share2,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInteraction } from "@/hooks/useInteractions";
import {
  INTERACTION_TYPES,
  encodeContext,
  type InteractionType,
  type InteractionOutcome,
} from "@/services/interactions";
import type { Person } from "@/types/database";

interface LogInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person;
}

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Video,
  Users,
  MessageSquare,
  Mail,
  Share2,
  Calendar,
  MoreHorizontal,
};

const outcomeOptions: { value: InteractionOutcome; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'successful', label: 'Went Great', icon: CheckCircle2, color: 'text-green-400' },
  { value: 'partial', label: 'Mixed Results', icon: MinusCircle, color: 'text-yellow-400' },
  { value: 'unsuccessful', label: 'Challenging', icon: AlertCircle, color: 'text-red-400' },
];

const moodOptions = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'stressed', emoji: '😓', label: 'Stressed' },
];

const LogInteractionModal = ({ isOpen, onClose, person }: LogInteractionModalProps) => {
  const [step, setStep] = useState(1);
  const [interactionType, setInteractionType] = useState<InteractionType>('call');
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState<InteractionOutcome | null>(null);
  const [moodBefore, setMoodBefore] = useState<string | null>(null);
  const [moodAfter, setMoodAfter] = useState<string | null>(null);
  const [whatWorked, setWhatWorked] = useState('');
  const [whatDidntWork, setWhatDidntWork] = useState('');
  const [notes, setNotes] = useState('');

  const createInteraction = useCreateInteraction();

  const resetForm = () => {
    setStep(1);
    setInteractionType('call');
    setInteractionDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setOutcome(null);
    setMoodBefore(null);
    setMoodAfter(null);
    setWhatWorked('');
    setWhatDidntWork('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await createInteraction.mutateAsync({
        person_id: person.id,
        interaction_date: new Date(interactionDate).toISOString(),
        context: encodeContext(interactionType, description),
        outcome,
        mood_before: moodBefore,
        mood_after: moodAfter,
        what_worked: whatWorked || null,
        what_didnt_work: whatDidntWork || null,
        notes: notes || null,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to log interaction:', error);
    }
  };

  const canProceedStep1 = interactionType && interactionDate;
  const canProceedStep2 = outcome !== null;
  const canSubmit = canProceedStep1 && canProceedStep2;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50"
          >
            <div className="liquid-glass rounded-2xl overflow-hidden max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Log Interaction</h2>
                      <p className="text-sm text-white/60">with {person.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 mt-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        s <= step ? 'bg-violet-500' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-medium text-white/80">What type of interaction?</h3>

                      {/* Interaction Type Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {INTERACTION_TYPES.map((type) => {
                          const Icon = iconMap[type.icon];
                          const isSelected = interactionType === type.value;
                          return (
                            <button
                              key={type.value}
                              onClick={() => setInteractionType(type.value)}
                              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                                isSelected
                                  ? 'bg-violet-500/30 border border-violet-400/50'
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-violet-300' : 'text-white/60'}`} />
                              <span className={`text-[10px] ${isSelected ? 'text-violet-200' : 'text-white/50'}`}>
                                {type.label.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">When did it happen?</label>
                        <input
                          type="date"
                          value={interactionDate}
                          onChange={(e) => setInteractionDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Brief description (optional)</label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What was it about?"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-medium text-white/80">How did it go?</h3>

                      {/* Outcome Selection */}
                      <div className="space-y-2">
                        {outcomeOptions.map((opt) => {
                          const isSelected = outcome === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setOutcome(opt.value)}
                              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                                isSelected
                                  ? 'bg-violet-500/30 border border-violet-400/50'
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <opt.icon className={`w-6 h-6 ${opt.color}`} />
                              <span className={`font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Mood Before/After */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">Your mood before</label>
                          <div className="flex gap-1">
                            {moodOptions.map((mood) => (
                              <button
                                key={mood.value}
                                onClick={() => setMoodBefore(mood.value)}
                                className={`flex-1 p-2 rounded-lg text-xl transition-all ${
                                  moodBefore === mood.value
                                    ? 'bg-violet-500/30 scale-110'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                                title={mood.label}
                              >
                                {mood.emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">Your mood after</label>
                          <div className="flex gap-1">
                            {moodOptions.map((mood) => (
                              <button
                                key={mood.value}
                                onClick={() => setMoodAfter(mood.value)}
                                className={`flex-1 p-2 rounded-lg text-xl transition-all ${
                                  moodAfter === mood.value
                                    ? 'bg-violet-500/30 scale-110'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                                title={mood.label}
                              >
                                {mood.emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-medium text-white/80">Reflect & Learn (optional)</h3>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-green-400">What worked well?</label>
                        <Textarea
                          value={whatWorked}
                          onChange={(e) => setWhatWorked(e.target.value)}
                          placeholder="Things that went smoothly..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400">What could be better?</label>
                        <Textarea
                          value={whatDidntWork}
                          onChange={(e) => setWhatDidntWork(e.target.value)}
                          placeholder="Areas for improvement..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Additional notes</label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Anything else to remember..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  {step > 1 ? 'Back' : 'Cancel'}
                </Button>

                {step < 3 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || createInteraction.isPending}
                    className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white"
                  >
                    {createInteraction.isPending ? 'Saving...' : 'Log Interaction'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogInteractionModal;
