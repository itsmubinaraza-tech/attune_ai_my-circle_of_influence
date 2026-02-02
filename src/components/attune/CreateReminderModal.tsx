import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  Calendar,
  Repeat,
  Sparkles,
  Clock,
  Loader2,
  User,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCreateReminder } from '@/hooks/useReminders';
import { usePeople } from '@/hooks/usePeople';
import type { Person } from '@/types/database';
import type { ReminderFrequency, ReminderType } from '@/services/reminders';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPerson?: Person;
}

const REMINDER_TYPES: { value: ReminderType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'one_time', label: 'One Time', icon: Bell, description: 'A single reminder' },
  { value: 'recurring', label: 'Recurring', icon: Repeat, description: 'Repeats on schedule' },
];

const FREQUENCY_OPTIONS: { value: ReminderFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const groupColors = {
  work: 'hsl(239, 84%, 67%)',
  family: 'hsl(330, 81%, 70%)',
  friends: 'hsl(160, 64%, 52%)',
  acquaintances: 'hsl(45, 84%, 55%)',
};

export default function CreateReminderModal({
  isOpen,
  onClose,
  preselectedPerson,
}: CreateReminderModalProps) {
  const { data: people = [] } = usePeople();
  const createReminder = useCreateReminder();

  const [step, setStep] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(preselectedPerson || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderType, setReminderType] = useState<ReminderType>('one_time');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [frequency, setFrequency] = useState<ReminderFrequency>('weekly');

  // Filter people based on search
  const filteredPeople = people.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    setStep(1);
    setSelectedPerson(preselectedPerson || null);
    setSearchQuery('');
    setReminderType('one_time');
    setTitle('');
    setMessage('');
    setScheduledDate('');
    setScheduledTime('09:00');
    setFrequency('weekly');
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedPerson || !title || !scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);

      await createReminder.mutateAsync({
        personId: selectedPerson.id,
        title,
        message: message || undefined,
        reminderType,
        scheduledFor,
        frequency: reminderType === 'recurring' ? frequency : undefined,
      });

      toast.success('Reminder created!');
      handleClose();
    } catch (error) {
      toast.error('Failed to create reminder');
    }
  };

  // Set default title when person is selected
  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    if (!title) {
      setTitle(`Check in with ${person.name}`);
    }
    setStep(2);
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative liquid-glass p-6 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground/90">
                  Create Reminder
                </h2>
                <p className="text-xs text-foreground/50">
                  Step {step} of 2
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-foreground/60" />
            </button>
          </div>

          {/* Step 1: Select Person */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <p className="text-sm text-foreground/70 mb-4">
                Who do you want to be reminded about?
              </p>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search people..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {/* People List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredPeople.map(person => (
                  <button
                    key={person.id}
                    onClick={() => handlePersonSelect(person)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedPerson?.id === person.id
                        ? 'bg-purple-500/20 ring-2 ring-purple-500/50'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{
                        background: groupColors[person.group] || groupColors.acquaintances,
                      }}
                    >
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground/90">{person.name}</p>
                      <p className="text-xs text-foreground/50 capitalize">{person.group}</p>
                    </div>
                  </button>
                ))}

                {filteredPeople.length === 0 && (
                  <div className="text-center py-8 text-foreground/50">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No people found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Reminder Details */}
          {step === 2 && selectedPerson && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Selected Person */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{
                    background: groupColors[selectedPerson.group] || groupColors.acquaintances,
                  }}
                >
                  {selectedPerson.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground/90">{selectedPerson.name}</p>
                  <p className="text-xs text-foreground/50 capitalize">{selectedPerson.group}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="ml-auto text-xs text-purple-400 hover:text-purple-300"
                >
                  Change
                </button>
              </div>

              {/* Reminder Type */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Reminder Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REMINDER_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setReminderType(type.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                          reminderType === type.value
                            ? 'bg-purple-500/20 ring-2 ring-purple-500/50'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-purple-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground/90">
                            {type.label}
                          </p>
                          <p className="text-xs text-foreground/50">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Weekly check-in"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {/* Message (optional) */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Add notes or context..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              {/* Frequency (for recurring) */}
              {reminderType === 'recurring' && (
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    <Repeat className="inline w-4 h-4 mr-1" />
                    Repeat
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FREQUENCY_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setFrequency(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          frequency === option.value
                            ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                            : 'bg-white/5 text-foreground/70 hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-foreground/80 hover:bg-white/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title || !scheduledDate || createReminder.isPending}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createReminder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Reminder
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
