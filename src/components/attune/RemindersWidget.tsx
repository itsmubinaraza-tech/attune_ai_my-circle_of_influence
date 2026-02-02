import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Check,
  Clock,
  MoreHorizontal,
  Plus,
  Repeat,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useUpcomingReminders,
  useOverdueReminders,
  useCompleteReminder,
  useSnoozeReminder,
  useDismissReminder,
  useReminderStats,
} from '@/hooks/useReminders';
import CreateReminderModal from './CreateReminderModal';
import type { Reminder } from '@/types/database';

interface RemindersWidgetProps {
  compact?: boolean;
  onViewAll?: () => void;
}

const groupColors: Record<string, string> = {
  work: 'hsl(239, 84%, 67%)',
  family: 'hsl(330, 81%, 70%)',
  friends: 'hsl(160, 64%, 52%)',
  acquaintances: 'hsl(45, 84%, 55%)',
};

export function RemindersWidget({ compact = false, onViewAll }: RemindersWidgetProps) {
  const { data: upcomingReminders = [], isLoading: upcomingLoading } = useUpcomingReminders();
  const { data: overdueReminders = [], isLoading: overdueLoading } = useOverdueReminders();
  const { data: stats } = useReminderStats();
  const completeReminder = useCompleteReminder();
  const snoozeReminder = useSnoozeReminder();
  const dismissReminder = useDismissReminder();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedReminder, setExpandedReminder] = useState<string | null>(null);

  const isLoading = upcomingLoading || overdueLoading;

  const handleComplete = async (reminderId: string) => {
    try {
      await completeReminder.mutateAsync(reminderId);
      toast.success('Reminder completed!');
    } catch {
      toast.error('Failed to complete reminder');
    }
  };

  const handleSnooze = async (reminderId: string, hours: number = 24) => {
    try {
      const snoozeUntil = new Date();
      snoozeUntil.setHours(snoozeUntil.getHours() + hours);
      await snoozeReminder.mutateAsync({ reminderId, snoozeUntil });
      toast.success(`Snoozed for ${hours} hours`);
    } catch {
      toast.error('Failed to snooze reminder');
    }
  };

  const handleDismiss = async (reminderId: string) => {
    try {
      await dismissReminder.mutateAsync(reminderId);
      toast.success('Reminder dismissed');
    } catch {
      toast.error('Failed to dismiss reminder');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) {
      if (diffHours > -24) return 'Overdue today';
      return `${Math.abs(diffDays)} days overdue`;
    }

    if (diffDays === 0) {
      if (diffHours < 1) return 'Within the hour';
      return `In ${diffHours} hours`;
    }
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const allReminders = [...overdueReminders, ...upcomingReminders].slice(0, compact ? 3 : 10);

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Reminders</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Plus className="h-4 w-4 text-purple-400" />
            </button>
          </div>

          {allReminders.length === 0 ? (
            <p className="text-sm text-white/50 text-center py-2">
              No upcoming reminders
            </p>
          ) : (
            <div className="space-y-2">
              {allReminders.map((reminder: Reminder & { person?: { name: string; group: string } }) => {
                const isOverdue = new Date(reminder.scheduled_for) < new Date();
                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      isOverdue ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                      style={{
                        background: reminder.person
                          ? groupColors[reminder.person.group] || groupColors.acquaintances
                          : 'hsl(270, 50%, 50%)',
                      }}
                    >
                      {reminder.person?.name.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{reminder.title}</p>
                      <p className={`text-[10px] ${isOverdue ? 'text-red-400' : 'text-white/50'}`}>
                        {formatDate(reminder.scheduled_for)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleComplete(reminder.id)}
                      className="p-1 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <Check className="h-3 w-3 text-green-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {onViewAll && allReminders.length > 0 && (
            <button
              onClick={onViewAll}
              className="w-full text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </motion.div>

        <CreateReminderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-400" />
              Reminders
            </CardTitle>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-white">{stats.pending}</p>
                <p className="text-[10px] text-white/50">Pending</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-400">{stats.overdue}</p>
                <p className="text-[10px] text-white/50">Overdue</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-400">{stats.completed}</p>
                <p className="text-[10px] text-white/50">Done</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-purple-400">{stats.completionRate}%</p>
                <p className="text-[10px] text-white/50">Rate</p>
              </div>
            </div>
          )}

          {/* Overdue Reminders */}
          {overdueReminders.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
              {overdueReminders.map((reminder: Reminder & { person?: { name: string; group: string } }) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  isOverdue
                  isExpanded={expandedReminder === reminder.id}
                  onToggle={() => setExpandedReminder(
                    expandedReminder === reminder.id ? null : reminder.id
                  )}
                  onComplete={() => handleComplete(reminder.id)}
                  onSnooze={(hours) => handleSnooze(reminder.id, hours)}
                  onDismiss={() => handleDismiss(reminder.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Upcoming</span>
              </div>
              {upcomingReminders.map((reminder: Reminder & { person?: { name: string; group: string } }) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  isOverdue={false}
                  isExpanded={expandedReminder === reminder.id}
                  onToggle={() => setExpandedReminder(
                    expandedReminder === reminder.id ? null : reminder.id
                  )}
                  onComplete={() => handleComplete(reminder.id)}
                  onSnooze={(hours) => handleSnooze(reminder.id, hours)}
                  onDismiss={() => handleDismiss(reminder.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {allReminders.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 mb-2">No reminders yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Create your first reminder
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateReminderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}

interface ReminderCardProps {
  reminder: Reminder & { person?: { name: string; group: string } };
  isOverdue: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onSnooze: (hours: number) => void;
  onDismiss: () => void;
  formatDate: (date: string) => string;
}

function ReminderCard({
  reminder,
  isOverdue,
  isExpanded,
  onToggle,
  onComplete,
  onSnooze,
  onDismiss,
  formatDate,
}: ReminderCardProps) {
  return (
    <motion.div
      layout
      className={`rounded-xl overflow-hidden ${
        isOverdue ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
      }`}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={onToggle}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
          style={{
            background: reminder.person
              ? groupColors[reminder.person.group] || groupColors.acquaintances
              : 'hsl(270, 50%, 50%)',
          }}
        >
          {reminder.person?.name.charAt(0) || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{reminder.title}</p>
          <div className="flex items-center gap-2">
            <p className={`text-xs ${isOverdue ? 'text-red-400' : 'text-white/50'}`}>
              {formatDate(reminder.scheduled_for)}
            </p>
            {reminder.reminder_type === 'recurring' && (
              <span className="flex items-center gap-1 text-xs text-purple-400">
                <Repeat className="h-3 w-3" />
                {reminder.frequency}
              </span>
            )}
            {reminder.is_smart_nudge && (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Sparkles className="h-3 w-3" />
                Smart
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
        >
          <Check className="h-4 w-4 text-green-400" />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {reminder.message && (
                <p className="text-sm text-white/70 bg-white/5 p-2 rounded-lg">
                  {reminder.message}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onSnooze(1)}
                  className="flex-1 py-2 rounded-lg text-xs bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                >
                  1 hour
                </button>
                <button
                  onClick={() => onSnooze(24)}
                  className="flex-1 py-2 rounded-lg text-xs bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => onSnooze(168)}
                  className="flex-1 py-2 rounded-lg text-xs bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                >
                  1 week
                </button>
                <button
                  onClick={onDismiss}
                  className="py-2 px-3 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <BellOff className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
