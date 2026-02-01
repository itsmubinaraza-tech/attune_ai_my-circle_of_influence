import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Edit3,
  Save,
  Trash2,
  Archive,
  Briefcase,
  Heart,
  Users,
  User2,
  Mail,
  Phone,
  FileText,
  Calendar,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePerson, useUpdatePerson, useArchivePerson, useDeletePerson } from '@/hooks/usePeople';
import { getDefaultSubgroups } from '@/services/people';
import type { GroupType, Person } from '@/types/database';

interface PersonProfileModalProps {
  personId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onPersonUpdated?: (person: Person) => void;
  onPersonDeleted?: (personId: string) => void;
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

export default function PersonProfileModal({
  personId,
  isOpen,
  onClose,
  onPersonUpdated,
  onPersonDeleted,
}: PersonProfileModalProps) {
  const { data: person, isLoading, error } = usePerson(personId);
  const updatePerson = useUpdatePerson();
  const archivePerson = useArchivePerson();
  const deletePerson = useDeletePerson();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [group, setGroup] = useState<GroupType>('work');
  const [subgroup, setSubgroup] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form when person changes
  useEffect(() => {
    if (person) {
      setName(person.name || '');
      setGroup(person.group);
      setSubgroup(person.subgroup || '');
      setRole(person.role || '');
      setEmail(person.email || '');
      setPhone(person.phone || '');
      setNotes(person.notes || '');
    }
  }, [person]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setShowAdvanced(false);
    }
  }, [isOpen]);

  const subgroups = getDefaultSubgroups(group);

  const handleSave = async () => {
    if (!personId || !name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const updatedPerson = await updatePerson.mutateAsync({
        id: personId,
        updates: {
          name: name.trim(),
          group,
          subgroup: subgroup || null,
          role: role || null,
          email: email || null,
          phone: phone || null,
          notes: notes || null,
        },
      });

      toast.success('Person updated successfully');
      setIsEditing(false);

      if (onPersonUpdated) {
        onPersonUpdated(updatedPerson);
      }
    } catch (err) {
      console.error('Error updating person:', err);
      toast.error('Failed to update person');
    }
  };

  const handleArchive = async () => {
    if (!personId) return;

    try {
      await archivePerson.mutateAsync(personId);
      toast.success('Person archived');
      onClose();

      if (onPersonDeleted) {
        onPersonDeleted(personId);
      }
    } catch (err) {
      console.error('Error archiving person:', err);
      toast.error('Failed to archive person');
    }
  };

  const handleDelete = async () => {
    if (!personId) return;

    try {
      await deletePerson.mutateAsync(personId);
      toast.success('Person deleted');
      onClose();

      if (onPersonDeleted) {
        onPersonDeleted(personId);
      }
    } catch (err) {
      console.error('Error deleting person:', err);
      toast.error('Failed to delete person');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getHealthColor = (health: number | null) => {
    if (health === null) return 'bg-gray-500';
    if (health >= 70) return 'bg-green-500';
    if (health >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isOpen) return null;

  const GroupIcon = person ? groupIcons[person.group] : User2;

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
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative liquid-glass p-6 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-foreground/70">Failed to load person details</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          ) : person ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${groupColors[person.group]}, ${groupColors[person.group]}dd)`,
                      boxShadow: `0 4px 20px ${groupColors[person.group]}50`,
                    }}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-xl font-semibold text-foreground/90 bg-white/5 border border-white/10 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-white/20"
                        autoFocus
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-foreground/90">{person.name}</h2>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <GroupIcon
                        className="w-4 h-4"
                        style={{ color: groupColors[person.group] }}
                      />
                      <span
                        className="text-sm font-medium capitalize"
                        style={{ color: groupColors[person.group] }}
                      >
                        {person.group}
                      </span>
                      {person.subgroup && (
                        <>
                          <span className="text-foreground/30">•</span>
                          <span className="text-sm text-foreground/60">{person.subgroup}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-5 h-5 text-foreground/60" />
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updatePerson.isPending}
                        className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
                        title="Save"
                      >
                        {updatePerson.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                        ) : (
                          <Save className="w-5 h-5 text-green-400" />
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-5 h-5 text-foreground/60" />
                      </button>
                      <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="Close"
                      >
                        <X className="w-5 h-5 text-foreground/60" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Relationship Health */}
              <div className="mb-6 p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground/70">Relationship Health</span>
                  <span className="text-sm text-foreground/50">
                    {person.relationship_health !== null ? `${person.relationship_health}%` : 'Not set'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getHealthColor(person.relationship_health)}`}
                    style={{ width: `${person.relationship_health || 0}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-foreground/50">
                  <Calendar className="w-3 h-3" />
                  <span>Last contact: {formatDate(person.last_contact)}</span>
                </div>
              </div>

              {/* Group Selection (Edit Mode) */}
              {isEditing && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground/70 mb-3">Group</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['work', 'family', 'friends', 'acquaintances'] as GroupType[]).map((g) => {
                      const Icon = groupIcons[g];
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setGroup(g);
                            setSubgroup('');
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
              )}

              {/* Subgroup Selection (Edit Mode) */}
              {isEditing && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Subgroup</label>
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
              )}

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {/* Role */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <User2 className="w-5 h-5 text-foreground/40" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Role / Title"
                      className="flex-1 bg-transparent text-foreground/80 placeholder:text-foreground/30 outline-none"
                    />
                  ) : (
                    <span className="text-foreground/70">{person.role || 'No role set'}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Mail className="w-5 h-5 text-foreground/40" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="flex-1 bg-transparent text-foreground/80 placeholder:text-foreground/30 outline-none"
                    />
                  ) : person.email ? (
                    <a
                      href={`mailto:${person.email}`}
                      className="text-purple-400 hover:underline"
                    >
                      {person.email}
                    </a>
                  ) : (
                    <span className="text-foreground/50">No email set</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Phone className="w-5 h-5 text-foreground/40" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="flex-1 bg-transparent text-foreground/80 placeholder:text-foreground/30 outline-none"
                    />
                  ) : person.phone ? (
                    <a
                      href={`tel:${person.phone}`}
                      className="text-purple-400 hover:underline"
                    >
                      {person.phone}
                    </a>
                  ) : (
                    <span className="text-foreground/50">No phone set</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-foreground/40" />
                  <span className="text-sm font-medium text-foreground/70">Notes</span>
                </div>
                {isEditing ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this person..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  />
                ) : (
                  <p className="text-foreground/60 text-sm p-3 rounded-xl bg-white/5 min-h-[80px]">
                    {person.notes || 'No notes yet'}
                  </p>
                )}
              </div>

              {/* Advanced Actions */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground/70 transition-colors mb-4"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
                {showAdvanced ? 'Hide' : 'Show'} advanced options
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-3 pb-4">
                      <button
                        onClick={handleArchive}
                        disabled={archivePerson.isPending}
                        className="flex-1 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        {archivePerson.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Archive className="w-4 h-4" />
                            Archive
                          </>
                        )}
                      </button>

                      {showDeleteConfirm ? (
                        <button
                          onClick={handleDelete}
                          disabled={deletePerson.isPending}
                          className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          {deletePerson.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Confirm Delete'
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Meta info */}
              <div className="text-xs text-foreground/30 text-center pt-4 border-t border-white/5">
                Added {new Date(person.created_at).toLocaleDateString()}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/50">Person not found</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
