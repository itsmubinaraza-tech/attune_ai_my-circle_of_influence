import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReminders,
  getUpcomingReminders,
  getOverdueReminders,
  getRemindersForPerson,
  createReminder,
  updateReminder,
  completeReminder,
  snoozeReminder,
  dismissReminder,
  deleteReminder,
  generateSmartNudges,
  createSmartNudgeReminders,
  getReminderStats,
  type CreateReminderInput,
  type ReminderStatus,
  type SmartNudgeSettings,
} from '@/services/reminders';
import type { ReminderUpdate } from '@/types/database';

// Query keys
export const reminderKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderKeys.all, 'list'] as const,
  list: (status?: ReminderStatus) => [...reminderKeys.lists(), status] as const,
  upcoming: () => [...reminderKeys.all, 'upcoming'] as const,
  overdue: () => [...reminderKeys.all, 'overdue'] as const,
  person: (personId: string) => [...reminderKeys.all, 'person', personId] as const,
  stats: () => [...reminderKeys.all, 'stats'] as const,
  nudges: () => [...reminderKeys.all, 'nudges'] as const,
};

// Get all reminders with optional status filter
export function useReminders(status?: ReminderStatus) {
  return useQuery({
    queryKey: reminderKeys.list(status),
    queryFn: () => getReminders(status),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get upcoming reminders (next 7 days)
export function useUpcomingReminders() {
  return useQuery({
    queryKey: reminderKeys.upcoming(),
    queryFn: getUpcomingReminders,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get overdue reminders
export function useOverdueReminders() {
  return useQuery({
    queryKey: reminderKeys.overdue(),
    queryFn: getOverdueReminders,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get reminders for a specific person
export function usePersonReminders(personId: string | null) {
  return useQuery({
    queryKey: personId ? reminderKeys.person(personId) : ['disabled'],
    queryFn: () => personId ? getRemindersForPerson(personId) : [],
    enabled: !!personId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get reminder statistics
export function useReminderStats() {
  return useQuery({
    queryKey: reminderKeys.stats(),
    queryFn: getReminderStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get smart nudges
export function useSmartNudges(settings?: SmartNudgeSettings) {
  return useQuery({
    queryKey: reminderKeys.nudges(),
    queryFn: () => generateSmartNudges(settings),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Create a reminder
export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReminderInput) => createReminder(input),
    onSuccess: (data) => {
      // Invalidate all reminder queries
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
      // Also invalidate person-specific reminders
      queryClient.invalidateQueries({ queryKey: reminderKeys.person(data.person_id) });
    },
  });
}

// Update a reminder
export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reminderId, updates }: { reminderId: string; updates: Partial<ReminderUpdate> }) =>
      updateReminder(reminderId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}

// Complete a reminder
export function useCompleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => completeReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}

// Snooze a reminder
export function useSnoozeReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reminderId, snoozeUntil }: { reminderId: string; snoozeUntil: Date }) =>
      snoozeReminder(reminderId, snoozeUntil),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}

// Dismiss a reminder
export function useDismissReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => dismissReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}

// Delete a reminder
export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => deleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}

// Create smart nudge reminders
export function useCreateSmartNudges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings?: SmartNudgeSettings) => createSmartNudgeReminders(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}
