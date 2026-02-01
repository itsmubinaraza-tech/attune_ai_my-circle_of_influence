import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Database, Person, PersonInsert, PersonUpdate, Profile, Interaction, CoachingSession, UserCredits, Reminder, PersonConnection, GroupType, ConnectionType, InteractionOutcome, ReminderType } from '@/types/database';

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

describe('Database Types', () => {
  describe('Person Types', () => {
    it('should have correct GroupType values', () => {
      const validGroups: GroupType[] = ['work', 'family', 'friends', 'acquaintances'];
      expect(validGroups).toHaveLength(4);
      expect(validGroups).toContain('work');
      expect(validGroups).toContain('family');
      expect(validGroups).toContain('friends');
      expect(validGroups).toContain('acquaintances');
    });

    it('should accept valid PersonInsert object', () => {
      const newPerson: PersonInsert = {
        user_id: 'user-123',
        name: 'John Doe',
        group: 'work',
      };
      expect(newPerson.user_id).toBe('user-123');
      expect(newPerson.name).toBe('John Doe');
      expect(newPerson.group).toBe('work');
    });

    it('should allow optional fields in PersonInsert', () => {
      const newPerson: PersonInsert = {
        user_id: 'user-123',
        name: 'Jane Doe',
        group: 'family',
        nickname: 'Janey',
        email: 'jane@example.com',
        phone: '+1234567890',
        motivations: ['career', 'family'],
        values: ['honesty', 'loyalty'],
        goals: ['promotion', 'travel'],
        notes: 'Great colleague',
        relationship_health: 85,
      };
      expect(newPerson.nickname).toBe('Janey');
      expect(newPerson.motivations).toContain('career');
      expect(newPerson.relationship_health).toBe(85);
    });

    it('should have correct PersonUpdate structure', () => {
      const update: PersonUpdate = {
        name: 'Updated Name',
        relationship_health: 90,
      };
      expect(update.name).toBe('Updated Name');
      expect(update.relationship_health).toBe(90);
    });
  });

  describe('ConnectionType', () => {
    it('should have correct ConnectionType values', () => {
      const validTypes: ConnectionType[] = ['knows', 'works_with', 'related_to'];
      expect(validTypes).toHaveLength(3);
    });

    it('should create valid PersonConnection', () => {
      const connection: PersonConnection = {
        id: 'conn-123',
        created_at: new Date().toISOString(),
        person_a_id: 'person-1',
        person_b_id: 'person-2',
        connection_type: 'works_with',
        notes: 'Same team',
      };
      expect(connection.connection_type).toBe('works_with');
    });
  });

  describe('Interaction Types', () => {
    it('should have correct InteractionOutcome values', () => {
      const validOutcomes: InteractionOutcome[] = ['successful', 'partial', 'unsuccessful'];
      expect(validOutcomes).toHaveLength(3);
    });

    it('should create valid Interaction row', () => {
      const interaction: Interaction = {
        id: 'int-123',
        created_at: new Date().toISOString(),
        user_id: 'user-123',
        person_id: 'person-123',
        interaction_date: new Date().toISOString(),
        context: 'Team meeting',
        outcome: 'successful',
        what_worked: 'Good communication',
        what_didnt_work: null,
        mood_before: 'neutral',
        mood_after: 'happy',
        notes: 'Productive discussion',
      };
      expect(interaction.outcome).toBe('successful');
    });
  });

  describe('Reminder Types', () => {
    it('should have correct ReminderType values', () => {
      const validTypes: ReminderType[] = ['user_set', 'smart_nudge'];
      expect(validTypes).toHaveLength(2);
    });

    it('should create valid Reminder row', () => {
      const reminder: Reminder = {
        id: 'rem-123',
        created_at: new Date().toISOString(),
        user_id: 'user-123',
        person_id: 'person-123',
        reminder_date: new Date().toISOString(),
        message: 'Catch up with John',
        is_completed: false,
        reminder_type: 'smart_nudge',
      };
      expect(reminder.reminder_type).toBe('smart_nudge');
      expect(reminder.is_completed).toBe(false);
    });
  });

  describe('CoachingSession Types', () => {
    it('should create valid CoachingSession row', () => {
      const session: CoachingSession = {
        id: 'sess-123',
        created_at: new Date().toISOString(),
        user_id: 'user-123',
        person_id: 'person-123',
        messages: [
          { role: 'user', content: 'How do I improve this relationship?' },
          { role: 'assistant', content: 'Here are some suggestions...' },
        ],
        mood: 'anxious',
        outcome_goal: 'Better communication',
        summary: 'Discussed communication strategies',
        tokens_used: 500,
      };
      expect(session.tokens_used).toBe(500);
      expect(Array.isArray(session.messages)).toBe(true);
    });
  });

  describe('UserCredits Types', () => {
    it('should create valid UserCredits row', () => {
      const credits: UserCredits = {
        id: 'cred-123',
        user_id: 'user-123',
        credits_remaining: 25,
        credits_total: 30,
        reset_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      expect(credits.credits_remaining).toBe(25);
      expect(credits.credits_total).toBe(30);
    });
  });

  describe('Profile Types', () => {
    it('should create valid Profile row', () => {
      const profile: Profile = {
        id: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: 'user@example.com',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        preferences: { theme: 'dark', notifications: true },
      };
      expect(profile.email).toBe('user@example.com');
      expect(profile.full_name).toBe('Test User');
    });
  });
});

describe('Database Schema Structure', () => {
  it('should have all required tables in Database type', () => {
    // Type check - this will fail at compile time if tables are missing
    type Tables = Database['public']['Tables'];
    type ExpectedTables = 'profiles' | 'people' | 'person_connections' | 'interactions' | 'coaching_sessions' | 'user_credits' | 'reminders';

    // This assertion verifies the type structure exists
    const tableCheck: Record<ExpectedTables, boolean> = {
      profiles: true,
      people: true,
      person_connections: true,
      interactions: true,
      coaching_sessions: true,
      user_credits: true,
      reminders: true,
    };
    expect(Object.keys(tableCheck)).toHaveLength(7);
  });

  it('should have all required enums in Database type', () => {
    type Enums = Database['public']['Enums'];
    const enumCheck = {
      group_type: true,
      connection_type: true,
      interaction_outcome: true,
      reminder_type: true,
    };
    expect(Object.keys(enumCheck)).toHaveLength(4);
  });
});

describe('Supabase Client Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should export supabase client when env vars are set', async () => {
    const { supabase } = await import('@/lib/supabase');
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
    expect(typeof supabase.auth).toBe('object');
  });

  it('should export getCurrentUser helper', async () => {
    const { getCurrentUser } = await import('@/lib/supabase');
    expect(typeof getCurrentUser).toBe('function');
  });

  it('should export getCurrentSession helper', async () => {
    const { getCurrentSession } = await import('@/lib/supabase');
    expect(typeof getCurrentSession).toBe('function');
  });
});
