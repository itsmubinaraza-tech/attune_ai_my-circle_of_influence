import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Briefcase, Heart, Users, User2, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createPerson, getDefaultSubgroups } from '@/services/people';
import type { GroupType } from '@/types/database';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonAdded?: (person: { id: string; name: string; group: GroupType }) => void;
}

const groupColors = {
  work: 'hsl(239, 84%, 67%)',
  family: 'hsl(330, 81%, 70%)',
  friends: 'hsl(160, 64%, 52%)',
  acquaintances: 'hsl(45, 84%, 55%)',
};

const groupIcons = {
  work: Briefcase,
  family: Heart,
  friends: Users,
  acquaintances: User2,
};

export default function AddPersonModal({ isOpen, onClose, onPersonAdded }: AddPersonModalProps) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState<GroupType>('work');
  const [subgroup, setSubgroup] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subgroups = getDefaultSubgroups(group);

  const resetForm = () => {
    setName('');
    setGroup('work');
    setSubgroup('');
    setRole('');
    setEmail('');
    setPhone('');
    setNotes('');
    setShowAdvanced(false);
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setIsSubmitting(true);

    try {
      const newPerson = await createPerson({
        name: name.trim(),
        group,
        subgroup: subgroup || null,
        role: role || null,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
      });

      setShowSuccess(true);

      // Notify parent
      if (onPersonAdded) {
        onPersonAdded({
          id: newPerson.id,
          name: newPerson.name,
          group: newPerson.group,
        });
      }

      toast.success(`${name} added to your circle!`);

      // Close after showing success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error creating person:', error);
      toast.error('Failed to add person. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
              </motion.div>
              <h2 className="text-xl font-semibold text-foreground/90 mb-2">
                {name} Added!
              </h2>
              <p className="text-sm text-foreground/60">
                Successfully added to your {group} circle
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground/90">Add New Person</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter their name..."
                  className="w-full px-4 py-3 rounded-xl glass-input bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                />
              </div>

              {/* Group Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-3">
                  Group <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['work', 'family', 'friends', 'acquaintances'] as GroupType[]).map((g) => {
                    const Icon = groupIcons[g];
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGroup(g);
                          setSubgroup(''); // Reset subgroup when group changes
                        }}
                        className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${
                          group === g ? 'ring-2 ring-white/30' : 'hover:bg-white/5'
                        }`}
                        style={{
                          background: group === g ? `${groupColors[g]}30` : `${groupColors[g]}10`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: groupColors[g] }} />
                        <span
                          className="text-xs font-medium capitalize"
                          style={{ color: groupColors[g] }}
                        >
                          {g}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subgroup Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Subgroup
                </label>
                <div className="flex flex-wrap gap-2">
                  {subgroups.map((sg) => (
                    <button
                      key={sg}
                      type="button"
                      onClick={() => setSubgroup(subgroup === sg ? '' : sg)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        subgroup === sg
                          ? 'bg-white/20 text-foreground ring-1 ring-white/30'
                          : 'bg-white/5 text-foreground/60 hover:bg-white/10'
                      }`}
                    >
                      {sg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Fields Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground/80 transition-colors mb-4"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
                {showAdvanced ? 'Hide' : 'Show'} additional details
              </button>

              {/* Advanced Fields */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-4">
                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g., Manager, Sister, Best Friend..."
                          className="w-full px-4 py-3 rounded-xl glass-input bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full px-4 py-3 rounded-xl glass-input bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3 rounded-xl glass-input bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any notes about this person..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl glass-input bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl glass-button text-foreground/70 hover:text-foreground/90 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    name.trim() && !isSubmitting
                      ? 'bg-white/20 text-foreground hover:bg-white/30'
                      : 'bg-white/5 text-foreground/30 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Person
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
