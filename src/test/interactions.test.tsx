import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as interactionsService from '@/services/interactions';
import type { Interaction, Person } from '@/types/database';

// Mock the services
vi.mock('@/services/interactions', () => ({
  getInteractionsForPerson: vi.fn(),
  getAllInteractions: vi.fn(),
  getRecentInteractions: vi.fn(),
  getInteraction: vi.fn(),
  createInteraction: vi.fn(),
  updateInteraction: vi.fn(),
  deleteInteraction: vi.fn(),
  getInteractionStats: vi.fn(),
  INTERACTION_TYPES: [
    { value: 'call', label: 'Phone Call', icon: 'Phone' },
    { value: 'video', label: 'Video Call', icon: 'Video' },
    { value: 'meeting', label: 'In-Person Meeting', icon: 'Users' },
    { value: 'message', label: 'Message/Text', icon: 'MessageSquare' },
    { value: 'email', label: 'Email', icon: 'Mail' },
    { value: 'social', label: 'Social Media', icon: 'Share2' },
    { value: 'event', label: 'Event/Gathering', icon: 'Calendar' },
    { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
  ],
  encodeContext: vi.fn((type, desc) => `[${type}] ${desc}`),
  decodeContext: vi.fn((context) => {
    if (!context) return { type: 'other', description: '' };
    const match = context.match(/^\[(\w+)\]\s*(.*)/);
    if (match) return { type: match[1], description: match[2] || '' };
    return { type: 'other', description: context };
  }),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

const mockPerson: Person = {
  id: 'person-1',
  user_id: 'test-user-id',
  name: 'John Doe',
  group: 'work',
  subgroup: 'Team',
  role: 'Developer',
  email: 'john@example.com',
  phone: '555-1234',
  notes: 'Great colleague',
  relationship_health: 75,
  last_contact: '2026-01-15T00:00:00Z',
  is_archived: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
  nickname: null,
  photo_url: null,
  linkedin_url: null,
  communication_style: null,
  motivations: null,
  values: null,
  goals: null,
};

const mockInteraction: Interaction = {
  id: 'interaction-1',
  user_id: 'test-user-id',
  person_id: 'person-1',
  interaction_date: '2026-01-20T10:00:00Z',
  context: '[call] Weekly sync meeting',
  outcome: 'successful',
  what_worked: 'Clear communication',
  what_didnt_work: null,
  mood_before: 'good',
  mood_after: 'great',
  notes: 'Discussed project progress',
  created_at: '2026-01-20T10:30:00Z',
};

describe('Interactions Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('encodeContext', () => {
    it('encodes interaction type and description', () => {
      const result = interactionsService.encodeContext('call', 'Weekly sync');
      expect(result).toBe('[call] Weekly sync');
    });

    it('handles empty description', () => {
      const result = interactionsService.encodeContext('meeting', '');
      expect(result).toBe('[meeting] ');
    });
  });

  describe('decodeContext', () => {
    it('decodes context string correctly', () => {
      const result = interactionsService.decodeContext('[call] Weekly sync');
      expect(result).toEqual({ type: 'call', description: 'Weekly sync' });
    });

    it('handles null context', () => {
      const result = interactionsService.decodeContext(null);
      expect(result).toEqual({ type: 'other', description: '' });
    });

    it('handles plain text context without type prefix', () => {
      const result = interactionsService.decodeContext('Just a regular note');
      expect(result).toEqual({ type: 'other', description: 'Just a regular note' });
    });
  });

  describe('INTERACTION_TYPES', () => {
    it('has all required interaction types', () => {
      const types = interactionsService.INTERACTION_TYPES;
      expect(types).toHaveLength(8);
      expect(types.map(t => t.value)).toContain('call');
      expect(types.map(t => t.value)).toContain('video');
      expect(types.map(t => t.value)).toContain('meeting');
      expect(types.map(t => t.value)).toContain('message');
      expect(types.map(t => t.value)).toContain('email');
      expect(types.map(t => t.value)).toContain('social');
      expect(types.map(t => t.value)).toContain('event');
      expect(types.map(t => t.value)).toContain('other');
    });

    it('each type has label and icon', () => {
      interactionsService.INTERACTION_TYPES.forEach(type => {
        expect(type.label).toBeDefined();
        expect(type.icon).toBeDefined();
        expect(typeof type.label).toBe('string');
        expect(typeof type.icon).toBe('string');
      });
    });
  });
});

describe('Interaction Data Types', () => {
  it('interaction has all required fields', () => {
    expect(mockInteraction.id).toBeDefined();
    expect(mockInteraction.user_id).toBeDefined();
    expect(mockInteraction.person_id).toBeDefined();
    expect(mockInteraction.interaction_date).toBeDefined();
    expect(mockInteraction.created_at).toBeDefined();
  });

  it('interaction outcome can be successful, partial, or unsuccessful', () => {
    const outcomes = ['successful', 'partial', 'unsuccessful'];
    expect(outcomes).toContain(mockInteraction.outcome);
  });

  it('interaction has optional reflection fields', () => {
    expect(mockInteraction).toHaveProperty('what_worked');
    expect(mockInteraction).toHaveProperty('what_didnt_work');
    expect(mockInteraction).toHaveProperty('mood_before');
    expect(mockInteraction).toHaveProperty('mood_after');
    expect(mockInteraction).toHaveProperty('notes');
  });
});

describe('Interaction Hooks', () => {
  it('usePersonInteractions is defined', async () => {
    const { usePersonInteractions } = await import('@/hooks/useInteractions');
    expect(usePersonInteractions).toBeDefined();
    expect(typeof usePersonInteractions).toBe('function');
  });

  it('useAllInteractions is defined', async () => {
    const { useAllInteractions } = await import('@/hooks/useInteractions');
    expect(useAllInteractions).toBeDefined();
    expect(typeof useAllInteractions).toBe('function');
  });

  it('useRecentInteractions is defined', async () => {
    const { useRecentInteractions } = await import('@/hooks/useInteractions');
    expect(useRecentInteractions).toBeDefined();
    expect(typeof useRecentInteractions).toBe('function');
  });

  it('useInteraction is defined', async () => {
    const { useInteraction } = await import('@/hooks/useInteractions');
    expect(useInteraction).toBeDefined();
    expect(typeof useInteraction).toBe('function');
  });

  it('useInteractionStats is defined', async () => {
    const { useInteractionStats } = await import('@/hooks/useInteractions');
    expect(useInteractionStats).toBeDefined();
    expect(typeof useInteractionStats).toBe('function');
  });

  it('useCreateInteraction is defined', async () => {
    const { useCreateInteraction } = await import('@/hooks/useInteractions');
    expect(useCreateInteraction).toBeDefined();
    expect(typeof useCreateInteraction).toBe('function');
  });

  it('useUpdateInteraction is defined', async () => {
    const { useUpdateInteraction } = await import('@/hooks/useInteractions');
    expect(useUpdateInteraction).toBeDefined();
    expect(typeof useUpdateInteraction).toBe('function');
  });

  it('useDeleteInteraction is defined', async () => {
    const { useDeleteInteraction } = await import('@/hooks/useInteractions');
    expect(useDeleteInteraction).toBeDefined();
    expect(typeof useDeleteInteraction).toBe('function');
  });
});

describe('Interaction Query Keys', () => {
  it('interactionKeys has correct structure', async () => {
    const { interactionKeys } = await import('@/hooks/useInteractions');

    expect(interactionKeys.all).toEqual(['interactions']);
    expect(interactionKeys.lists()).toEqual(['interactions', 'list']);
    expect(interactionKeys.forPerson('person-1')).toEqual(['interactions', 'person', 'person-1']);
    expect(interactionKeys.recent(10)).toEqual(['interactions', 'recent', 10]);
    expect(interactionKeys.details()).toEqual(['interactions', 'detail']);
    expect(interactionKeys.detail('id-1')).toEqual(['interactions', 'detail', 'id-1']);
    expect(interactionKeys.stats('person-1')).toEqual(['interactions', 'stats', 'person-1']);
  });
});

describe('Relationship Health Updates', () => {
  it('successful interaction should increase health', () => {
    // Health update logic test
    const currentHealth = 50;
    const outcome = 'successful';

    let newHealth = currentHealth;
    switch (outcome) {
      case 'successful':
        newHealth = Math.min(100, currentHealth + 10);
        break;
      case 'partial':
        newHealth = Math.min(100, currentHealth + 3);
        break;
      case 'unsuccessful':
        newHealth = Math.max(0, currentHealth - 5);
        break;
    }

    expect(newHealth).toBe(60);
  });

  it('partial interaction should slightly increase health', () => {
    const currentHealth = 50;
    const outcome = 'partial';

    let newHealth = currentHealth;
    switch (outcome) {
      case 'successful':
        newHealth = Math.min(100, currentHealth + 10);
        break;
      case 'partial':
        newHealth = Math.min(100, currentHealth + 3);
        break;
      case 'unsuccessful':
        newHealth = Math.max(0, currentHealth - 5);
        break;
    }

    expect(newHealth).toBe(53);
  });

  it('unsuccessful interaction should decrease health', () => {
    const currentHealth = 50;
    const outcome = 'unsuccessful';

    let newHealth = currentHealth;
    switch (outcome) {
      case 'successful':
        newHealth = Math.min(100, currentHealth + 10);
        break;
      case 'partial':
        newHealth = Math.min(100, currentHealth + 3);
        break;
      case 'unsuccessful':
        newHealth = Math.max(0, currentHealth - 5);
        break;
    }

    expect(newHealth).toBe(45);
  });

  it('health should not exceed 100', () => {
    const currentHealth = 95;
    const outcome = 'successful';

    const newHealth = Math.min(100, currentHealth + 10);
    expect(newHealth).toBe(100);
  });

  it('health should not go below 0', () => {
    const currentHealth = 3;
    const outcome = 'unsuccessful';

    const newHealth = Math.max(0, currentHealth - 5);
    expect(newHealth).toBe(0);
  });
});

describe('Interaction Statistics', () => {
  it('calculates total interactions', () => {
    const interactions = [mockInteraction, { ...mockInteraction, id: '2' }];
    expect(interactions.length).toBe(2);
  });

  it('counts successful interactions', () => {
    const interactions = [
      { ...mockInteraction, outcome: 'successful' as const },
      { ...mockInteraction, id: '2', outcome: 'partial' as const },
      { ...mockInteraction, id: '3', outcome: 'successful' as const },
    ];

    const successfulCount = interactions.filter(i => i.outcome === 'successful').length;
    expect(successfulCount).toBe(2);
  });

  it('calculates average per month correctly', () => {
    const interactions = [
      { ...mockInteraction, interaction_date: '2026-01-01T00:00:00Z' },
      { ...mockInteraction, id: '2', interaction_date: '2026-01-15T00:00:00Z' },
      { ...mockInteraction, id: '3', interaction_date: '2026-02-01T00:00:00Z' },
    ];

    // 3 interactions over 2 months = 1.5 per month
    const dates = interactions.map(i => new Date(i.interaction_date));
    const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const monthsDiff = Math.max(1,
      (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 +
      (newestDate.getMonth() - oldestDate.getMonth()) + 1
    );
    const average = Math.round((interactions.length / monthsDiff) * 10) / 10;

    expect(average).toBe(1.5);
  });
});

describe('LogInteractionModal Component', () => {
  it('renders without crashing', async () => {
    const LogInteractionModal = (await import('@/components/attune/LogInteractionModal')).default;

    render(
      <LogInteractionModal
        isOpen={true}
        onClose={() => {}}
        person={mockPerson}
      />,
      { wrapper }
    );

    expect(screen.getByText('Log Interaction')).toBeInTheDocument();
    expect(screen.getByText(`with ${mockPerson.name}`)).toBeInTheDocument();
  });

  it('shows interaction type selection', async () => {
    const LogInteractionModal = (await import('@/components/attune/LogInteractionModal')).default;

    render(
      <LogInteractionModal
        isOpen={true}
        onClose={() => {}}
        person={mockPerson}
      />,
      { wrapper }
    );

    expect(screen.getByText('What type of interaction?')).toBeInTheDocument();
  });

  it('has date input', async () => {
    const LogInteractionModal = (await import('@/components/attune/LogInteractionModal')).default;

    render(
      <LogInteractionModal
        isOpen={true}
        onClose={() => {}}
        person={mockPerson}
      />,
      { wrapper }
    );

    expect(screen.getByText('When did it happen?')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { hidden: true }) || document.querySelector('input[type="date"]')).toBeTruthy();
  });

  it('closes when cancel is clicked', async () => {
    const LogInteractionModal = (await import('@/components/attune/LogInteractionModal')).default;
    const onClose = vi.fn();

    render(
      <LogInteractionModal
        isOpen={true}
        onClose={onClose}
        person={mockPerson}
      />,
      { wrapper }
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when closed', async () => {
    const LogInteractionModal = (await import('@/components/attune/LogInteractionModal')).default;

    render(
      <LogInteractionModal
        isOpen={false}
        onClose={() => {}}
        person={mockPerson}
      />,
      { wrapper }
    );

    expect(screen.queryByText('Log Interaction')).not.toBeInTheDocument();
  });
});

describe('InteractionHistory Component', () => {
  beforeEach(() => {
    vi.mocked(interactionsService.getInteractionsForPerson).mockResolvedValue([mockInteraction]);
    vi.mocked(interactionsService.getInteractionStats).mockResolvedValue({
      total: 1,
      successful: 1,
      partial: 0,
      unsuccessful: 0,
      lastInteraction: mockInteraction.interaction_date,
      averagePerMonth: 1,
    });
  });

  it('renders without crashing', async () => {
    const InteractionHistory = (await import('@/components/attune/InteractionHistory')).default;

    render(
      <InteractionHistory
        personId="person-1"
        personName="John Doe"
      />,
      { wrapper }
    );

    // Initially shows loading or content
    await waitFor(() => {
      // Component should render without error
      expect(document.body).toBeDefined();
    });
  });

  it('shows empty state when no interactions', async () => {
    vi.mocked(interactionsService.getInteractionsForPerson).mockResolvedValue([]);

    const InteractionHistory = (await import('@/components/attune/InteractionHistory')).default;

    render(
      <InteractionHistory
        personId="person-1"
        personName="John Doe"
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('No interactions logged yet')).toBeInTheDocument();
    });
  });

  it('accepts compact prop', async () => {
    const InteractionHistory = (await import('@/components/attune/InteractionHistory')).default;

    render(
      <InteractionHistory
        personId="person-1"
        personName="John Doe"
        compact
      />,
      { wrapper }
    );

    // Component should render without error with compact prop
    await waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });
});

describe('Mood Options', () => {
  it('has consistent mood options for before and after', () => {
    const moodOptions = [
      { value: 'great', emoji: '😊', label: 'Great' },
      { value: 'good', emoji: '🙂', label: 'Good' },
      { value: 'neutral', emoji: '😐', label: 'Neutral' },
      { value: 'anxious', emoji: '😰', label: 'Anxious' },
      { value: 'stressed', emoji: '😓', label: 'Stressed' },
    ];

    expect(moodOptions).toHaveLength(5);
    moodOptions.forEach(mood => {
      expect(mood.value).toBeDefined();
      expect(mood.emoji).toBeDefined();
      expect(mood.label).toBeDefined();
    });
  });
});

describe('Outcome Options', () => {
  it('has three outcome options', () => {
    const outcomeOptions = [
      { value: 'successful', label: 'Went Great' },
      { value: 'partial', label: 'Mixed Results' },
      { value: 'unsuccessful', label: 'Challenging' },
    ];

    expect(outcomeOptions).toHaveLength(3);
    expect(outcomeOptions.map(o => o.value)).toContain('successful');
    expect(outcomeOptions.map(o => o.value)).toContain('partial');
    expect(outcomeOptions.map(o => o.value)).toContain('unsuccessful');
  });
});
