import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Users, Briefcase, Heart, Search, Loader2 } from 'lucide-react';
import { usePeople } from '@/hooks/usePeople';
import { useCreateConnection } from '@/hooks/useConnections';
import { getConnectionTypeOptions } from '@/services/connections';
import type { Person, ConnectionType } from '@/types/database';
import { toast } from 'sonner';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPersonId?: string | null;
}

const groupColors: Record<string, string> = {
  work: 'hsl(239, 84%, 67%)',
  family: 'hsl(330, 81%, 70%)',
  friends: 'hsl(160, 64%, 52%)',
  acquaintances: 'hsl(45, 84%, 55%)',
};

const connectionTypeIcons: Record<ConnectionType, typeof Users> = {
  knows: Users,
  works_with: Briefcase,
  related_to: Heart,
};

export default function AddConnectionModal({
  isOpen,
  onClose,
  preselectedPersonId,
}: AddConnectionModalProps) {
  const { data: people = [], isLoading: peopleLoading } = usePeople();
  const createConnection = useCreateConnection();

  const [personA, setPersonA] = useState<string | null>(preselectedPersonId || null);
  const [personB, setPersonB] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<ConnectionType>('knows');
  const [notes, setNotes] = useState('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPersonA(preselectedPersonId || null);
      setPersonB(null);
      setConnectionType('knows');
      setNotes('');
      setSearchA('');
      setSearchB('');
    }
  }, [isOpen, preselectedPersonId]);

  const connectionTypeOptions = getConnectionTypeOptions();

  const getPersonById = (id: string | null): Person | undefined => {
    return people.find((p) => p.id === id);
  };

  const filterPeople = (search: string, excludeId: string | null): Person[] => {
    return people.filter((p) => {
      if (excludeId && p.id === excludeId) return false;
      if (!search.trim()) return true;
      return p.name.toLowerCase().includes(search.toLowerCase());
    });
  };

  const handleSubmit = async () => {
    if (!personA || !personB) {
      toast.error('Please select both people to connect');
      return;
    }

    if (personA === personB) {
      toast.error('Cannot connect a person to themselves');
      return;
    }

    try {
      await createConnection.mutateAsync({
        person_a_id: personA,
        person_b_id: personB,
        connection_type: connectionType,
        notes: notes.trim() || null,
      });
      toast.success('Connection created successfully');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create connection');
      }
    }
  };

  const personAData = getPersonById(personA);
  const personBData = getPersonById(personB);

  const PersonSelector = ({
    value,
    onChange,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    excludeId,
    label,
  }: {
    value: string | null;
    onChange: (id: string) => void;
    search: string;
    setSearch: (s: string) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    excludeId: string | null;
    label: string;
  }) => {
    const selectedPerson = getPersonById(value);
    const filteredPeople = filterPeople(search, excludeId);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-foreground/70 mb-2">{label}</label>
        {selectedPerson ? (
          <div
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => {
              onChange('');
              setShowDropdown(true);
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: groupColors[selectedPerson.group] }}
            >
              {selectedPerson.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground/90">{selectedPerson.name}</p>
              <p className="text-xs text-foreground/50 capitalize">{selectedPerson.group}</p>
            </div>
            <X className="w-4 h-4 text-foreground/40" />
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search for a person..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
        )}

        <AnimatePresence>
          {showDropdown && !selectedPerson && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              {filteredPeople.length === 0 ? (
                <p className="p-3 text-sm text-foreground/50 text-center">No people found</p>
              ) : (
                filteredPeople.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => {
                      onChange(person.id);
                      setSearch('');
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: groupColors[person.group] }}
                    >
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/90">{person.name}</p>
                      <p className="text-xs text-foreground/50 capitalize">{person.group}</p>
                    </div>
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <Link2 className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground/90">Add Connection</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {peopleLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-foreground/50" />
                </div>
              ) : people.length < 2 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
                  <p className="text-foreground/60">
                    You need at least 2 people in your circle to create connections.
                  </p>
                </div>
              ) : (
                <>
                  {/* Person A */}
                  <PersonSelector
                    value={personA}
                    onChange={(id) => setPersonA(id || null)}
                    search={searchA}
                    setSearch={setSearchA}
                    showDropdown={showDropdownA}
                    setShowDropdown={setShowDropdownA}
                    excludeId={personB}
                    label="First Person"
                  />

                  {/* Connection Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      Connection Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {connectionTypeOptions.map((option) => {
                        const Icon = connectionTypeIcons[option.value];
                        const isSelected = connectionType === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setConnectionType(option.value)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                : 'bg-white/5 border-white/10 text-foreground/60 hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Person B */}
                  <PersonSelector
                    value={personB}
                    onChange={(id) => setPersonB(id || null)}
                    search={searchB}
                    setSearch={setSearchB}
                    showDropdown={showDropdownB}
                    setShowDropdown={setShowDropdownB}
                    excludeId={personA}
                    label="Second Person"
                  />

                  {/* Connection Preview */}
                  {personAData && personBData && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-sm text-center text-foreground/70">
                        <span className="font-medium text-foreground/90">{personAData.name}</span>
                        {' '}
                        <span className="text-purple-400">
                          {connectionTypeOptions.find((o) => o.value === connectionType)?.label.toLowerCase()}
                        </span>
                        {' '}
                        <span className="font-medium text-foreground/90">{personBData.name}</span>
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Met at company retreat..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {people.length >= 2 && (
              <div className="flex gap-3 p-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/70 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!personA || !personB || createConnection.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createConnection.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  Create Connection
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
