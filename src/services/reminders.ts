import { supabase } from '@/lib/supabase';
import type { Reminder, ReminderInsert, ReminderUpdate, Person } from '@/types/database';

export type ReminderType = 'one_time' | 'recurring' | 'smart_nudge';
export type ReminderFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'dismissed';

export interface CreateReminderInput {
  personId: string;
  title: string;
  message?: string;
  reminderType: ReminderType;
  scheduledFor: Date;
  frequency?: ReminderFrequency;
}

export interface SmartNudgeSettings {
  enabled: boolean;
  maxDaysBeforeNudge: {
    work: number;
    family: number;
    friends: number;
    acquaintances: number;
  };
}

// Default smart nudge thresholds (days)
export const DEFAULT_NUDGE_THRESHOLDS: SmartNudgeSettings = {
  enabled: true,
  maxDaysBeforeNudge: {
    work: 14,
    family: 7,
    friends: 14,
    acquaintances: 30,
  },
};

// Create a new reminder
export async function createReminder(input: CreateReminderInput): Promise<Reminder> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const reminderData: ReminderInsert = {
    user_id: user.id,
    person_id: input.personId,
    title: input.title,
    message: input.message || null,
    reminder_type: input.reminderType,
    scheduled_for: input.scheduledFor.toISOString(),
    frequency: input.frequency || null,
    status: 'pending',
    is_smart_nudge: input.reminderType === 'smart_nudge',
  };

  const { data, error } = await supabase
    .from('reminders')
    .insert(reminderData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Get all reminders for the current user
export async function getReminders(status?: ReminderStatus): Promise<Reminder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let query = supabase
    .from('reminders')
    .select(`
      *,
      person:people(id, name, group, photo_url)
    `)
    .eq('user_id', user.id)
    .order('scheduled_for', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

// Get upcoming reminders (next 7 days)
export async function getUpcomingReminders(): Promise<Reminder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const { data, error } = await supabase
    .from('reminders')
    .select(`
      *,
      person:people(id, name, group, photo_url)
    `)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .gte('scheduled_for', now.toISOString())
    .lte('scheduled_for', weekFromNow.toISOString())
    .order('scheduled_for', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// Get overdue reminders
export async function getOverdueReminders(): Promise<Reminder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date();

  const { data, error } = await supabase
    .from('reminders')
    .select(`
      *,
      person:people(id, name, group, photo_url)
    `)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .lt('scheduled_for', now.toISOString())
    .order('scheduled_for', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// Get reminders for a specific person
export async function getRemindersForPerson(personId: string): Promise<Reminder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', user.id)
    .eq('person_id', personId)
    .order('scheduled_for', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// Update a reminder
export async function updateReminder(
  reminderId: string,
  updates: Partial<ReminderUpdate>
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reminderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Complete a reminder
export async function completeReminder(reminderId: string): Promise<Reminder> {
  const reminder = await updateReminder(reminderId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
  });

  // If recurring, create the next occurrence
  if (reminder.reminder_type === 'recurring' && reminder.frequency) {
    const nextDate = calculateNextOccurrence(
      new Date(reminder.scheduled_for),
      reminder.frequency as ReminderFrequency
    );

    await createReminder({
      personId: reminder.person_id,
      title: reminder.title,
      message: reminder.message || undefined,
      reminderType: 'recurring',
      scheduledFor: nextDate,
      frequency: reminder.frequency as ReminderFrequency,
    });
  }

  return reminder;
}

// Snooze a reminder
export async function snoozeReminder(
  reminderId: string,
  snoozeUntil: Date
): Promise<Reminder> {
  return updateReminder(reminderId, {
    status: 'snoozed',
    snoozed_until: snoozeUntil.toISOString(),
  });
}

// Dismiss a reminder
export async function dismissReminder(reminderId: string): Promise<Reminder> {
  return updateReminder(reminderId, { status: 'dismissed' });
}

// Delete a reminder
export async function deleteReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId);

  if (error) throw new Error(error.message);
}

// Calculate next occurrence for recurring reminders
export function calculateNextOccurrence(
  currentDate: Date,
  frequency: ReminderFrequency
): Date {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
  }

  return nextDate;
}

// Generate smart nudges based on contact frequency
export async function generateSmartNudges(
  settings: SmartNudgeSettings = DEFAULT_NUDGE_THRESHOLDS
): Promise<{ person: Person; daysSinceContact: number; suggestedAction: string }[]> {
  if (!settings.enabled) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get all people with their last contact date
  const { data: people, error } = await supabase
    .from('people')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false);

  if (error) throw new Error(error.message);
  if (!people) return [];

  const nudges: { person: Person; daysSinceContact: number; suggestedAction: string }[] = [];
  const now = new Date();

  for (const person of people) {
    const lastContact = person.last_contact ? new Date(person.last_contact) : null;
    const daysSinceContact = lastContact
      ? Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const threshold = settings.maxDaysBeforeNudge[person.group as keyof typeof settings.maxDaysBeforeNudge] || 30;

    if (daysSinceContact >= threshold) {
      // Check if there's already a pending reminder for this person
      const { data: existingReminders } = await supabase
        .from('reminders')
        .select('id')
        .eq('person_id', person.id)
        .eq('status', 'pending')
        .eq('is_smart_nudge', true)
        .limit(1);

      if (!existingReminders || existingReminders.length === 0) {
        nudges.push({
          person,
          daysSinceContact,
          suggestedAction: generateSuggestedAction(person, daysSinceContact),
        });
      }
    }
  }

  // Sort by days since contact (most urgent first)
  nudges.sort((a, b) => b.daysSinceContact - a.daysSinceContact);

  return nudges.slice(0, 10); // Return top 10 nudges
}

// Create smart nudge reminders
export async function createSmartNudgeReminders(
  settings: SmartNudgeSettings = DEFAULT_NUDGE_THRESHOLDS
): Promise<Reminder[]> {
  const nudges = await generateSmartNudges(settings);
  const reminders: Reminder[] = [];

  for (const nudge of nudges) {
    const reminder = await createReminder({
      personId: nudge.person.id,
      title: `Reconnect with ${nudge.person.name}`,
      message: nudge.suggestedAction,
      reminderType: 'smart_nudge',
      scheduledFor: new Date(), // Schedule for now
    });
    reminders.push(reminder);
  }

  return reminders;
}

// Generate suggested action based on person and time
function generateSuggestedAction(person: Person, daysSinceContact: number): string {
  const isLongTime = daysSinceContact > 30;
  const isVeryLongTime = daysSinceContact > 60;

  switch (person.group) {
    case 'family':
      if (isVeryLongTime) {
        return `It's been ${daysSinceContact} days! Give ${person.name} a call and catch up on family news.`;
      }
      if (isLongTime) {
        return `Time to check in with ${person.name}. A quick video call could brighten both your days!`;
      }
      return `Send ${person.name} a message to stay connected. Family bonds need regular nurturing.`;

    case 'work':
      if (isVeryLongTime) {
        return `It's been a while since you connected with ${person.name}. Consider scheduling a coffee chat.`;
      }
      if (isLongTime) {
        return `Touch base with ${person.name} about professional updates or industry news.`;
      }
      return `A quick message to ${person.name} can help maintain your professional network.`;

    case 'friends':
      if (isVeryLongTime) {
        return `You haven't seen ${person.name} in ${daysSinceContact} days! Plan an activity together.`;
      }
      if (isLongTime) {
        return `Reach out to ${person.name} and make plans to catch up. Friends grow apart without effort!`;
      }
      return `Send ${person.name} a fun message or meme to keep the friendship alive.`;

    case 'acquaintances':
    default:
      if (isVeryLongTime) {
        return `Consider if you want to strengthen your connection with ${person.name} or update their status.`;
      }
      return `A simple "thinking of you" message to ${person.name} could open new opportunities.`;
  }
}

// Get reminder statistics
export async function getReminderStats(): Promise<{
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  snoozed: number;
  completionRate: number;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: reminders } = await supabase
    .from('reminders')
    .select('status, scheduled_for')
    .eq('user_id', user.id);

  if (!reminders) {
    return {
      total: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
      snoozed: 0,
      completionRate: 0,
    };
  }

  const now = new Date();
  const pending = reminders.filter(r => r.status === 'pending' && new Date(r.scheduled_for) >= now).length;
  const completed = reminders.filter(r => r.status === 'completed').length;
  const overdue = reminders.filter(r => r.status === 'pending' && new Date(r.scheduled_for) < now).length;
  const snoozed = reminders.filter(r => r.status === 'snoozed').length;
  const total = reminders.length;
  const completedAndDismissed = reminders.filter(r => r.status === 'completed' || r.status === 'dismissed').length;
  const completionRate = total > 0 ? Math.round((completedAndDismissed / total) * 100) : 0;

  return {
    total,
    pending,
    completed,
    overdue,
    snoozed,
    completionRate,
  };
}
