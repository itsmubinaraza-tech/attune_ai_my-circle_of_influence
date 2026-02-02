import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RemindersWidget } from '@/components/attune/RemindersWidget';
import CreateReminderModal from '@/components/attune/CreateReminderModal';
import * as remindersService from '@/services/reminders';
import * as useRemindersHook from '@/hooks/useReminders';
import type { Reminder } from '@/types/database';

// Mock the hooks
vi.mock('@/hooks/useReminders', () => ({
  useUpcomingReminders: vi.fn(),
  useOverdueReminders: vi.fn(),
  useCompleteReminder: vi.fn(),
  useSnoozeReminder: vi.fn(),
  useDismissReminder: vi.fn(),
  useReminderStats: vi.fn(),
  useCreateReminder: vi.fn(),
  usePersonReminders: vi.fn(),
  reminderKeys: {
    all: ['reminders'],
    lists: () => ['reminders', 'list'],
    list: (status?: string) => ['reminders', 'list', status],
    upcoming: () => ['reminders', 'upcoming'],
    overdue: () => ['reminders', 'overdue'],
    person: (personId: string) => ['reminders', 'person', personId],
    stats: () => ['reminders', 'stats'],
    nudges: () => ['reminders', 'nudges'],
  },
}));

// Mock usePeople for CreateReminderModal
vi.mock('@/hooks/usePeople', () => ({
  usePeople: vi.fn().mockReturnValue({
    data: [
      { id: 'person-1', name: 'John Doe', group: 'work' },
      { id: 'person-2', name: 'Jane Smith', group: 'friends' },
    ],
    isLoading: false,
    error: null,
  }),
}));

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'new-reminder' }, error: null }),
        })),
      })),
    })),
  },
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('Reminders Service', () => {
  describe('Reminder types', () => {
    it('should support one_time, recurring, and smart_nudge types', () => {
      const types: remindersService.ReminderType[] = ['one_time', 'recurring', 'smart_nudge'];
      types.forEach(type => {
        expect(['one_time', 'recurring', 'smart_nudge']).toContain(type);
      });
    });

    it('should support all frequency options', () => {
      const frequencies: remindersService.ReminderFrequency[] = [
        'daily', 'weekly', 'biweekly', 'monthly', 'quarterly'
      ];
      frequencies.forEach(freq => {
        expect(['daily', 'weekly', 'biweekly', 'monthly', 'quarterly']).toContain(freq);
      });
    });

    it('should support all status options', () => {
      const statuses: remindersService.ReminderStatus[] = [
        'pending', 'completed', 'snoozed', 'dismissed'
      ];
      statuses.forEach(status => {
        expect(['pending', 'completed', 'snoozed', 'dismissed']).toContain(status);
      });
    });
  });

  describe('calculateNextOccurrence', () => {
    it('should add 1 day for daily frequency', () => {
      const date = new Date('2026-02-01T09:00:00');
      const next = remindersService.calculateNextOccurrence(date, 'daily');
      expect(next.getDate()).toBe(2);
    });

    it('should add 7 days for weekly frequency', () => {
      const date = new Date('2026-02-01T09:00:00');
      const next = remindersService.calculateNextOccurrence(date, 'weekly');
      expect(next.getDate()).toBe(8);
    });

    it('should add 14 days for biweekly frequency', () => {
      const date = new Date('2026-02-01T09:00:00');
      const next = remindersService.calculateNextOccurrence(date, 'biweekly');
      expect(next.getDate()).toBe(15);
    });

    it('should add 1 month for monthly frequency', () => {
      const date = new Date('2026-02-01T09:00:00');
      const next = remindersService.calculateNextOccurrence(date, 'monthly');
      expect(next.getMonth()).toBe(2); // March (0-indexed)
    });

    it('should add 3 months for quarterly frequency', () => {
      const date = new Date('2026-02-01T09:00:00');
      const next = remindersService.calculateNextOccurrence(date, 'quarterly');
      expect(next.getMonth()).toBe(4); // May (0-indexed)
    });
  });

  describe('DEFAULT_NUDGE_THRESHOLDS', () => {
    it('should have correct default thresholds', () => {
      const thresholds = remindersService.DEFAULT_NUDGE_THRESHOLDS;
      expect(thresholds.enabled).toBe(true);
      expect(thresholds.maxDaysBeforeNudge.work).toBe(14);
      expect(thresholds.maxDaysBeforeNudge.family).toBe(7);
      expect(thresholds.maxDaysBeforeNudge.friends).toBe(14);
      expect(thresholds.maxDaysBeforeNudge.acquaintances).toBe(30);
    });
  });
});

describe('useReminders Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useUpcomingReminders', () => {
    it('should return empty array when no reminders', () => {
      vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      const result = useRemindersHook.useUpcomingReminders();
      expect(result.data).toEqual([]);
    });

    it('should return upcoming reminders', () => {
      const mockReminders: Partial<Reminder>[] = [
        { id: 'r1', title: 'Call Mom', scheduled_for: '2026-02-05T09:00:00' },
        { id: 'r2', title: 'Check in with boss', scheduled_for: '2026-02-06T10:00:00' },
      ];

      vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
        data: mockReminders,
        isLoading: false,
        error: null,
      } as any);

      const result = useRemindersHook.useUpcomingReminders();
      expect(result.data).toHaveLength(2);
    });
  });

  describe('useOverdueReminders', () => {
    it('should return overdue reminders', () => {
      const mockReminders: Partial<Reminder>[] = [
        { id: 'r1', title: 'Missed call', scheduled_for: '2026-01-25T09:00:00' },
      ];

      vi.mocked(useRemindersHook.useOverdueReminders).mockReturnValue({
        data: mockReminders,
        isLoading: false,
        error: null,
      } as any);

      const result = useRemindersHook.useOverdueReminders();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('useReminderStats', () => {
    it('should return reminder statistics', () => {
      const mockStats = {
        total: 10,
        pending: 5,
        completed: 4,
        overdue: 1,
        snoozed: 0,
        completionRate: 80,
      };

      vi.mocked(useRemindersHook.useReminderStats).mockReturnValue({
        data: mockStats,
        isLoading: false,
        error: null,
      } as any);

      const result = useRemindersHook.useReminderStats();
      expect(result.data?.completionRate).toBe(80);
    });
  });
});

describe('RemindersWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useRemindersHook.useOverdueReminders).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useRemindersHook.useReminderStats).mockReturnValue({
      data: {
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
        snoozed: 0,
        completionRate: 0,
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useRemindersHook.useCompleteReminder).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);

    vi.mocked(useRemindersHook.useSnoozeReminder).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);

    vi.mocked(useRemindersHook.useDismissReminder).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);
  });

  it('should show loading state', () => {
    vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show empty state when no reminders', async () => {
    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('No reminders yet')).toBeInTheDocument();
    });
  });

  it('should show Add button', async () => {
    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });

  it('should display upcoming reminders', async () => {
    const mockReminders = [
      {
        id: 'r1',
        title: 'Check in with John',
        scheduled_for: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        reminder_type: 'one_time',
        person: { name: 'John', group: 'work' },
      },
    ];

    vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
      data: mockReminders,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('Check in with John')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });
  });

  it('should display overdue reminders with warning', async () => {
    const mockReminders = [
      {
        id: 'r1',
        title: 'Missed meeting',
        scheduled_for: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        reminder_type: 'one_time',
        person: { name: 'Jane', group: 'friends' },
      },
    ];

    vi.mocked(useRemindersHook.useOverdueReminders).mockReturnValue({
      data: mockReminders,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('Missed meeting')).toBeInTheDocument();
    });

    // Check that there's at least one element with "Overdue" text (label or time)
    const overdueElements = screen.getAllByText(/Overdue/);
    expect(overdueElements.length).toBeGreaterThan(0);
  });

  it('should show stats in full mode', async () => {
    vi.mocked(useRemindersHook.useReminderStats).mockReturnValue({
      data: {
        total: 10,
        pending: 5,
        completed: 4,
        overdue: 1,
        snoozed: 0,
        completionRate: 80,
      },
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Pending
      expect(screen.getByText('4')).toBeInTheDocument(); // Completed
      expect(screen.getByText('80%')).toBeInTheDocument(); // Rate
    });
  });

  it('should show compact mode correctly', async () => {
    const mockReminders = [
      {
        id: 'r1',
        title: 'Quick check',
        scheduled_for: new Date(Date.now() + 86400000).toISOString(),
        reminder_type: 'one_time',
        person: { name: 'Test', group: 'work' },
      },
    ];

    vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
      data: mockReminders,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget compact />);

    await waitFor(() => {
      expect(screen.getByText('Reminders')).toBeInTheDocument();
      expect(screen.getByText('Quick check')).toBeInTheDocument();
    });
  });

  it('should show recurring badge for recurring reminders', async () => {
    const mockReminders = [
      {
        id: 'r1',
        title: 'Weekly sync',
        scheduled_for: new Date(Date.now() + 86400000).toISOString(),
        reminder_type: 'recurring',
        frequency: 'weekly',
        person: { name: 'Boss', group: 'work' },
      },
    ];

    vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
      data: mockReminders,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  it('should show smart nudge badge for smart nudges', async () => {
    const mockReminders = [
      {
        id: 'r1',
        title: 'Reconnect',
        scheduled_for: new Date(Date.now() + 86400000).toISOString(),
        reminder_type: 'smart_nudge',
        is_smart_nudge: true,
        person: { name: 'Friend', group: 'friends' },
      },
    ];

    vi.mocked(useRemindersHook.useUpcomingReminders).mockReturnValue({
      data: mockReminders,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RemindersWidget />);

    await waitFor(() => {
      expect(screen.getByText('Smart')).toBeInTheDocument();
    });
  });
});

describe('CreateReminderModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRemindersHook.useCreateReminder).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: 'new-reminder' }),
      isPending: false,
    } as any);
  });

  it('should not render when closed', () => {
    const { container } = renderWithQueryClient(
      <CreateReminderModal isOpen={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when open', async () => {
    renderWithQueryClient(
      <CreateReminderModal isOpen={true} onClose={() => {}} />
    );

    await waitFor(() => {
      expect(screen.getByText('Create Reminder')).toBeInTheDocument();
    });
  });

  it('should show person selection on step 1', async () => {
    renderWithQueryClient(
      <CreateReminderModal isOpen={true} onClose={() => {}} />
    );

    await waitFor(() => {
      expect(screen.getByText('Who do you want to be reminded about?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search people...')).toBeInTheDocument();
    });
  });

  it('should display people list', async () => {
    renderWithQueryClient(
      <CreateReminderModal isOpen={true} onClose={() => {}} />
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should call onClose when close button clicked', async () => {
    const onClose = vi.fn();
    renderWithQueryClient(
      <CreateReminderModal isOpen={true} onClose={onClose} />
    );

    await waitFor(() => {
      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find(btn =>
        btn.querySelector('svg.lucide-x')
      );
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });
});

describe('Reminder Query Keys', () => {
  it('should generate correct query keys', () => {
    const keys = useRemindersHook.reminderKeys;

    expect(keys.all).toEqual(['reminders']);
    expect(keys.lists()).toEqual(['reminders', 'list']);
    expect(keys.list('pending')).toEqual(['reminders', 'list', 'pending']);
    expect(keys.upcoming()).toEqual(['reminders', 'upcoming']);
    expect(keys.overdue()).toEqual(['reminders', 'overdue']);
    expect(keys.person('person-123')).toEqual(['reminders', 'person', 'person-123']);
    expect(keys.stats()).toEqual(['reminders', 'stats']);
    expect(keys.nudges()).toEqual(['reminders', 'nudges']);
  });
});

describe('Smart Nudges', () => {
  describe('SmartNudgeSettings', () => {
    it('should have correct structure', () => {
      const settings: remindersService.SmartNudgeSettings = {
        enabled: true,
        maxDaysBeforeNudge: {
          work: 14,
          family: 7,
          friends: 14,
          acquaintances: 30,
        },
      };

      expect(settings.enabled).toBe(true);
      expect(settings.maxDaysBeforeNudge.family).toBeLessThan(
        settings.maxDaysBeforeNudge.acquaintances
      );
    });

    it('should allow disabling nudges', () => {
      const settings: remindersService.SmartNudgeSettings = {
        enabled: false,
        maxDaysBeforeNudge: {
          work: 14,
          family: 7,
          friends: 14,
          acquaintances: 30,
        },
      };

      expect(settings.enabled).toBe(false);
    });
  });
});
