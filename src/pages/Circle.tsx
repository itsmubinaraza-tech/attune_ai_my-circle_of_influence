import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Briefcase,
  Heart,
  Users,
  User2,
  ArrowUpDown,
  Clock,
  Activity,
  Mail,
  Phone,
  ChevronLeft,
  Loader2,
  UserX,
  Download,
  Smartphone,
  Linkedin,
  Facebook,
  ChevronDown,
  Sparkles,
  Link2,
} from 'lucide-react';
import { usePeopleWithAutoSeed, useSeedDemoData } from '@/hooks/usePeople';
import { useConnections } from '@/hooks/useConnections';
import AddPersonModal from '@/components/attune/AddPersonModal';
import PersonProfileModal from '@/components/attune/PersonProfileModal';
import AddConnectionModal from '@/components/attune/AddConnectionModal';
import type { Person, GroupType } from '@/types/database';

type SortOption = 'name' | 'last_contact' | 'relationship_health';
type FilterGroup = 'all' | GroupType;

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

export default function Circle() {
  const { data: people = [], isLoading } = usePeopleWithAutoSeed();
  const { data: connections = [] } = useConnections();
  const seedDemoData = useSeedDemoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<FilterGroup>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddConnectionModal, setShowAddConnectionModal] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const importMenuRef = useRef<HTMLDivElement>(null);

  // Close import menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (importMenuRef.current && !importMenuRef.current.contains(event.target as Node)) {
        setShowImportMenu(false);
      }
    };

    if (showImportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showImportMenu]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // Filter and sort people
  const filteredPeople = useMemo(() => {
    let result = [...people];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.role?.toLowerCase().includes(query) ||
          p.subgroup?.toLowerCase().includes(query)
      );
    }

    // Filter by group
    if (filterGroup !== 'all') {
      result = result.filter((p) => p.group === filterGroup);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'last_contact':
          const dateA = a.last_contact ? new Date(a.last_contact).getTime() : 0;
          const dateB = b.last_contact ? new Date(b.last_contact).getTime() : 0;
          comparison = dateB - dateA; // Most recent first by default
          break;
        case 'relationship_health':
          const healthA = a.relationship_health ?? 0;
          const healthB = b.relationship_health ?? 0;
          comparison = healthB - healthA; // Highest first by default
          break;
      }

      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [people, searchQuery, filterGroup, sortBy, sortAsc]);

  // Count by group
  const groupCounts = useMemo(() => {
    return {
      all: people.length,
      work: people.filter((p) => p.group === 'work').length,
      family: people.filter((p) => p.group === 'family').length,
      friends: people.filter((p) => p.group === 'friends').length,
      acquaintances: people.filter((p) => p.group === 'acquaintances').length,
    };
  }, [people]);

  const handleOpenProfile = (personId: string) => {
    setSelectedPersonId(personId);
    setShowProfileModal(true);
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(true);
    }
  };

  const formatLastContact = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const getHealthColor = (health: number | null) => {
    if (health === null) return 'bg-gray-500/50';
    if (health >= 70) return 'bg-green-500';
    if (health >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground/70" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground/90">My Circle</h1>
                <p className="text-sm text-foreground/50">
                  {people.length} {people.length === 1 ? 'person' : 'people'}
                  {connections.length > 0 && (
                    <span className="text-purple-400"> · {connections.length} {connections.length === 1 ? 'connection' : 'connections'}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Import Dropdown */}
              <div className="relative" ref={importMenuRef}>
                <button
                  onClick={() => setShowImportMenu(!showImportMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-foreground/80 font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showImportMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showImportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            seedDemoData.mutate();
                            setShowImportMenu(false);
                          }}
                          disabled={seedDemoData.isPending}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                        >
                          {seedDemoData.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-purple-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground/90">Load Demo Data</p>
                            <p className="text-xs text-foreground/50">28 sample contacts</p>
                          </div>
                        </button>

                        <div className="my-2 border-t border-white/10" />

                        <button
                          onClick={() => {
                            // TODO: Implement phone contacts import
                            alert('Phone contacts import coming soon!');
                            setShowImportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                        >
                          <Smartphone className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-sm font-medium text-foreground/90">Phone Contacts</p>
                            <p className="text-xs text-foreground/50">Import from your device</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            // TODO: Implement LinkedIn import
                            alert('LinkedIn import coming soon!');
                            setShowImportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                        >
                          <Linkedin className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-foreground/90">LinkedIn</p>
                            <p className="text-xs text-foreground/50">Import connections</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            // TODO: Implement Facebook import
                            alert('Facebook import coming soon!');
                            setShowImportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                        >
                          <Facebook className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-foreground/90">Facebook</p>
                            <p className="text-xs text-foreground/50">Import friends</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShowAddConnectionModal(true)}
                disabled={people.length < 2}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-foreground/80 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title={people.length < 2 ? 'Need at least 2 people to create connections' : 'Link two people together'}
              >
                <Link2 className="w-4 h-4" />
                <span className="hidden sm:inline">Link</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Person</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, role..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterGroup('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterGroup === 'all'
                  ? 'bg-white/20 text-foreground'
                  : 'bg-white/5 text-foreground/60 hover:bg-white/10'
              }`}
            >
              All ({groupCounts.all})
            </button>
            {(['work', 'family', 'friends', 'acquaintances'] as GroupType[]).map((group) => {
              const Icon = groupIcons[group];
              return (
                <button
                  key={group}
                  onClick={() => setFilterGroup(group)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterGroup === group
                      ? 'text-white'
                      : 'text-foreground/60 hover:opacity-80'
                  }`}
                  style={{
                    background:
                      filterGroup === group
                        ? groupColors[group]
                        : `${groupColors[group]}20`,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{group}</span>
                  <span className="opacity-70">({groupCounts[group]})</span>
                </button>
              );
            })}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/50">Sort by:</span>
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortBy === 'name'
                  ? 'bg-white/20 text-foreground'
                  : 'bg-white/5 text-foreground/60 hover:bg-white/10'
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              Name
            </button>
            <button
              onClick={() => handleSort('last_contact')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortBy === 'last_contact'
                  ? 'bg-white/20 text-foreground'
                  : 'bg-white/5 text-foreground/60 hover:bg-white/10'
              }`}
            >
              <Clock className="w-3 h-3" />
              Last Contact
            </button>
            <button
              onClick={() => handleSort('relationship_health')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortBy === 'relationship_health'
                  ? 'bg-white/20 text-foreground'
                  : 'bg-white/5 text-foreground/60 hover:bg-white/10'
              }`}
            >
              <Activity className="w-3 h-3" />
              Health
            </button>
          </div>
        </motion.div>

        {/* People List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
            </div>
          ) : filteredPeople.length === 0 ? (
            <div className="text-center py-20">
              <UserX className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground/70 mb-2">
                {searchQuery || filterGroup !== 'all'
                  ? 'No people found'
                  : 'Your circle is empty'}
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                {searchQuery || filterGroup !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start building your circle by adding people'}
              </p>
              {!searchQuery && filterGroup === 'all' && (
                <div className="space-y-6">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Your First Person
                  </button>

                  <div className="flex items-center gap-4 justify-center">
                    <div className="h-px bg-white/10 w-16" />
                    <span className="text-foreground/40 text-sm">or import from</span>
                    <div className="h-px bg-white/10 w-16" />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => seedDemoData.mutate()}
                      disabled={seedDemoData.isPending}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 transition-all disabled:opacity-50"
                    >
                      {seedDemoData.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      )}
                      Demo Data
                    </button>
                    <button
                      onClick={() => alert('Phone contacts import coming soon!')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 transition-all"
                    >
                      <Smartphone className="w-4 h-4 text-green-400" />
                      Phone
                    </button>
                    <button
                      onClick={() => alert('LinkedIn import coming soon!')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 transition-all"
                    >
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => alert('Facebook import coming soon!')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 transition-all"
                    >
                      <Facebook className="w-4 h-4 text-blue-500" />
                      Facebook
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredPeople.map((person, index) => {
                  const GroupIcon = groupIcons[person.group];
                  const connectionCount = connections.filter(
                    (c) => c.person_a_id === person.id || c.person_b_id === person.id
                  ).length;
                  return (
                    <motion.div
                      key={person.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleOpenProfile(person.id)}
                      className="liquid-glass p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${groupColors[person.group]}, ${groupColors[person.group]}dd)`,
                            boxShadow: `0 4px 12px ${groupColors[person.group]}40`,
                          }}
                        >
                          {person.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground/90 truncate">
                              {person.name}
                            </h3>
                            <GroupIcon
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: groupColors[person.group] }}
                            />
                          </div>

                          {/* Role/Subgroup */}
                          <p className="text-sm text-foreground/50 truncate mb-2">
                            {person.role || person.subgroup || 'No role set'}
                          </p>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 text-xs text-foreground/40">
                            {/* Last contact */}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatLastContact(person.last_contact)}
                            </span>

                            {/* Health indicator */}
                            <span className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getHealthColor(person.relationship_health)}`}
                              />
                              {person.relationship_health !== null
                                ? `${person.relationship_health}%`
                                : 'N/A'}
                            </span>

                            {/* Connections indicator */}
                            {connectionCount > 0 && (
                              <span className="flex items-center gap-1 text-purple-400">
                                <Link2 className="w-3 h-3" />
                                {connectionCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick actions */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {person.email && (
                            <a
                              href={`mailto:${person.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Send email"
                            >
                              <Mail className="w-4 h-4 text-foreground/60" />
                            </a>
                          )}
                          {person.phone && (
                            <a
                              href={`tel:${person.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Call"
                            >
                              <Phone className="w-4 h-4 text-foreground/60" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Person Profile Modal */}
      <PersonProfileModal
        personId={selectedPersonId}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedPersonId(null);
        }}
      />

      {/* Add Connection Modal */}
      <AddConnectionModal
        isOpen={showAddConnectionModal}
        onClose={() => setShowAddConnectionModal(false)}
      />
    </div>
  );
}
