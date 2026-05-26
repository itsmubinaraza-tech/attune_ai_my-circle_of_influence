import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RelationshipSummaryCard } from '@/components/attune/RelationshipSummaryCard';
import { CircleInsightsWidget } from '@/components/attune/CircleInsightsWidget';
import * as summariesService from '@/services/summaries';
import * as useSummariesHook from '@/hooks/useSummaries';
import type { RelationshipSummary, CircleInsights } from '@/services/summaries';

// Mock the hooks
vi.mock('@/hooks/useSummaries', () => ({
  useRelationshipSummary: vi.fn(),
  useCircleInsights: vi.fn(),
  useAISummary: vi.fn(),
  summaryKeys: {
    all: ['summaries'],
    relationship: (personId: string) => ['summaries', 'relationship', personId],
    circle: () => ['summaries', 'circle'],
    ai: (personId: string) => ['summaries', 'ai', personId],
  },
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
          order: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          })),
        })),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
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

describe('Summaries Service', () => {
  describe('RelationshipSummary interface', () => {
    it('should have all required fields', () => {
      const mockSummary: RelationshipSummary = {
        personId: 'test-id',
        personName: 'Test Person',
        group: 'work',
        healthScore: 75,
        healthTrend: 'improving',
        lastContact: '2026-01-15',
        daysSinceContact: 17,
        totalInteractions: 10,
        recentInteractions: 3,
        successRate: 80,
        topInteractionType: 'call',
        moodPattern: 'Usually feel happy after interactions',
        strengths: ['High success rate'],
        areasToImprove: ['More frequent contact'],
        suggestedActions: ['Schedule a catch-up call'],
      };

      expect(mockSummary.personId).toBe('test-id');
      expect(mockSummary.healthTrend).toBe('improving');
      expect(mockSummary.strengths).toHaveLength(1);
    });

    it('should support all health trends', () => {
      const trends: ('improving' | 'stable' | 'declining')[] = ['improving', 'stable', 'declining'];
      trends.forEach(trend => {
        const summary: Partial<RelationshipSummary> = { healthTrend: trend };
        expect(['improving', 'stable', 'declining']).toContain(summary.healthTrend);
      });
    });
  });

  describe('CircleInsights interface', () => {
    it('should have all required fields', () => {
      const mockInsights: CircleInsights = {
        totalPeople: 28,
        totalInteractions: 156,
        averageHealth: 65,
        healthDistribution: {
          healthy: 12,
          moderate: 10,
          needsAttention: 6,
        },
        groupBreakdown: {
          work: 8,
          family: 7,
          friends: 7,
          acquaintances: 6,
        },
        mostConnected: [{ name: 'Mom', interactions: 25 }],
        needsAttention: [{ name: 'Old Friend', daysSinceContact: 45 }],
        recentActivity: [{ date: '2026-01-25', count: 3 }],
        weeklyTrend: 'up',
      };

      expect(mockInsights.totalPeople).toBe(28);
      expect(mockInsights.healthDistribution.healthy).toBe(12);
      expect(mockInsights.weeklyTrend).toBe('up');
    });

    it('should support all weekly trends', () => {
      const trends: ('up' | 'stable' | 'down')[] = ['up', 'stable', 'down'];
      trends.forEach(trend => {
        const insights: Partial<CircleInsights> = { weeklyTrend: trend };
        expect(['up', 'stable', 'down']).toContain(insights.weeklyTrend);
      });
    });
  });
});

describe('useSummaries Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useRelationshipSummary', () => {
    it('should return null when personId is null', () => {
      vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      const result = useSummariesHook.useRelationshipSummary(null);
      expect(result.data).toBeNull();
    });

    it('should return summary data when personId is provided', () => {
      const mockSummary: RelationshipSummary = {
        personId: 'test-id',
        personName: 'Test Person',
        group: 'work',
        healthScore: 75,
        healthTrend: 'improving',
        lastContact: '2026-01-15',
        daysSinceContact: 17,
        totalInteractions: 10,
        recentInteractions: 3,
        successRate: 80,
        topInteractionType: 'call',
        moodPattern: null,
        strengths: [],
        areasToImprove: [],
        suggestedActions: [],
      };

      vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
        data: mockSummary,
        isLoading: false,
        error: null,
      } as any);

      const result = useSummariesHook.useRelationshipSummary('test-id');
      expect(result.data).toEqual(mockSummary);
    });
  });

  describe('useCircleInsights', () => {
    it('should return circle insights', () => {
      const mockInsights: CircleInsights = {
        totalPeople: 15,
        totalInteractions: 50,
        averageHealth: 60,
        healthDistribution: { healthy: 5, moderate: 7, needsAttention: 3 },
        groupBreakdown: { work: 5, family: 4, friends: 4, acquaintances: 2 },
        mostConnected: [],
        needsAttention: [],
        recentActivity: [],
        weeklyTrend: 'stable',
      };

      vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
        data: mockInsights,
        isLoading: false,
        error: null,
      } as any);

      const result = useSummariesHook.useCircleInsights();
      expect(result.data).toEqual(mockInsights);
    });
  });

  describe('useAISummary', () => {
    it('should not fetch when disabled', () => {
      vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      const result = useSummariesHook.useAISummary('test-id', false);
      expect(result.data).toBeNull();
    });

    it('should return AI summary when enabled', () => {
      const mockAISummary = 'Your relationship with John is strong and improving.';

      vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
        data: mockAISummary,
        isLoading: false,
        error: null,
      } as any);

      const result = useSummariesHook.useAISummary('test-id', true);
      expect(result.data).toBe(mockAISummary);
    });
  });
});

describe('RelationshipSummaryCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" />);

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show relationship summary when loaded', async () => {
    const mockSummary: RelationshipSummary = {
      personId: 'test-id',
      personName: 'John Doe',
      group: 'work',
      healthScore: 85,
      healthTrend: 'improving',
      lastContact: '2026-01-20',
      daysSinceContact: 12,
      totalInteractions: 15,
      recentInteractions: 5,
      successRate: 90,
      topInteractionType: 'meeting',
      moodPattern: 'Usually feel happy after interactions',
      strengths: ['High success rate', 'Consistent engagement'],
      areasToImprove: [],
      suggestedActions: ['Schedule next meeting'],
    };

    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" personName="John Doe" />);

    await waitFor(() => {
      expect(screen.getByText('Relationship Insights')).toBeInTheDocument();
    });

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Improving')).toBeInTheDocument();
  });

  it('should display strengths as badges', async () => {
    const mockSummary: RelationshipSummary = {
      personId: 'test-id',
      personName: 'Jane Smith',
      group: 'friends',
      healthScore: 72,
      healthTrend: 'stable',
      lastContact: '2026-01-25',
      daysSinceContact: 7,
      totalInteractions: 20,
      recentInteractions: 8,
      successRate: 75,
      topInteractionType: 'call',
      moodPattern: null,
      strengths: ['High success rate', 'Consistent engagement'],
      areasToImprove: ['More in-person meetings'],
      suggestedActions: ['Plan a social activity'],
    };

    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText('High success rate')).toBeInTheDocument();
      expect(screen.getByText('Consistent engagement')).toBeInTheDocument();
    });
  });

  it('should show compact mode correctly', async () => {
    const mockSummary: RelationshipSummary = {
      personId: 'test-id',
      personName: 'Test',
      group: 'family',
      healthScore: 60,
      healthTrend: 'declining',
      lastContact: null,
      daysSinceContact: null,
      totalInteractions: 5,
      recentInteractions: 1,
      successRate: 50,
      topInteractionType: null,
      moodPattern: null,
      strengths: [],
      areasToImprove: ['More contact needed'],
      suggestedActions: ['Schedule a catch-up'],
    };

    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" compact />);

    await waitFor(() => {
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('Needs attention')).toBeInTheDocument();
    });
  });

  it('should return null when no summary data', () => {
    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    const { container } = renderWithQueryClient(<RelationshipSummaryCard personId="invalid-id" />);
    expect(container.firstChild).toBeNull();
  });
});

describe('CircleInsightsWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any);

    renderWithQueryClient(<CircleInsightsWidget />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show circle insights when loaded', async () => {
    const mockInsights: CircleInsights = {
      totalPeople: 28,
      totalInteractions: 100,
      averageHealth: 70,
      healthDistribution: { healthy: 15, moderate: 8, needsAttention: 5 },
      groupBreakdown: { work: 8, family: 7, friends: 8, acquaintances: 5 },
      mostConnected: [
        { name: 'Mom', interactions: 30 },
        { name: 'Best Friend', interactions: 25 },
      ],
      needsAttention: [
        { name: 'Old Colleague', daysSinceContact: 45 },
      ],
      recentActivity: [
        { date: '2026-01-25', count: 5 },
        { date: '2026-01-26', count: 3 },
      ],
      weeklyTrend: 'up',
    };

    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: mockInsights,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<CircleInsightsWidget />);

    await waitFor(() => {
      expect(screen.getByText('Circle Insights')).toBeInTheDocument();
    });

    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('should show compact mode correctly', async () => {
    const mockInsights: CircleInsights = {
      totalPeople: 20,
      totalInteractions: 50,
      averageHealth: 65,
      healthDistribution: { healthy: 10, moderate: 6, needsAttention: 4 },
      groupBreakdown: {},
      mostConnected: [],
      needsAttention: [],
      recentActivity: [],
      weeklyTrend: 'stable',
    };

    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: mockInsights,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<CircleInsightsWidget compact />);

    await waitFor(() => {
      expect(screen.getByText('Circle Health')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
      expect(screen.getByText('20 people')).toBeInTheDocument();
    });
  });

  it('should show error state', async () => {
    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    renderWithQueryClient(<CircleInsightsWidget />);

    await waitFor(() => {
      expect(
        screen.getByText(/don't have data to show health of your relationships/i)
      ).toBeInTheDocument();
    });
  });

  it('should display most connected people', async () => {
    const mockInsights: CircleInsights = {
      totalPeople: 15,
      totalInteractions: 80,
      averageHealth: 72,
      healthDistribution: { healthy: 8, moderate: 5, needsAttention: 2 },
      groupBreakdown: { work: 5, family: 5, friends: 5 },
      mostConnected: [
        { name: 'Alice', interactions: 20 },
        { name: 'Bob', interactions: 15 },
        { name: 'Carol', interactions: 12 },
      ],
      needsAttention: [],
      recentActivity: [],
      weeklyTrend: 'up',
    };

    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: mockInsights,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<CircleInsightsWidget />);

    await waitFor(() => {
      expect(screen.getByText('Most Connected')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Carol')).toBeInTheDocument();
    });
  });

  it('should display people needing attention', async () => {
    const mockInsights: CircleInsights = {
      totalPeople: 25,
      totalInteractions: 60,
      averageHealth: 55,
      healthDistribution: { healthy: 5, moderate: 12, needsAttention: 8 },
      groupBreakdown: {},
      mostConnected: [],
      needsAttention: [
        { name: 'Distant Friend', daysSinceContact: 60 },
        { name: 'Old Mentor', daysSinceContact: 45 },
      ],
      recentActivity: [],
      weeklyTrend: 'down',
    };

    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: mockInsights,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<CircleInsightsWidget />);

    await waitFor(() => {
      expect(screen.getByText('Needs Attention')).toBeInTheDocument();
      expect(screen.getByText('Distant Friend')).toBeInTheDocument();
      expect(screen.getByText('60 days ago')).toBeInTheDocument();
    });
  });

  it('should show weekly trend correctly', async () => {
    const mockInsights: CircleInsights = {
      totalPeople: 10,
      totalInteractions: 30,
      averageHealth: 80,
      healthDistribution: { healthy: 8, moderate: 2, needsAttention: 0 },
      groupBreakdown: {},
      mostConnected: [],
      needsAttention: [],
      recentActivity: [],
      weeklyTrend: 'up',
    };

    vi.mocked(useSummariesHook.useCircleInsights).mockReturnValue({
      data: mockInsights,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<CircleInsightsWidget />);

    await waitFor(() => {
      expect(screen.getByText('More active this week')).toBeInTheDocument();
    });
  });
});

describe('Summary Query Keys', () => {
  it('should generate correct query keys', () => {
    const keys = useSummariesHook.summaryKeys;

    expect(keys.all).toEqual(['summaries']);
    expect(keys.relationship('person-123')).toEqual(['summaries', 'relationship', 'person-123']);
    expect(keys.circle()).toEqual(['summaries', 'circle']);
    expect(keys.ai('person-456')).toEqual(['summaries', 'ai', 'person-456']);
  });
});

describe('Health Score Colors', () => {
  it('should use green for healthy scores (70+)', async () => {
    const mockSummary: RelationshipSummary = {
      personId: 'test-id',
      personName: 'Healthy',
      group: 'work',
      healthScore: 85,
      healthTrend: 'improving',
      lastContact: null,
      daysSinceContact: null,
      totalInteractions: 10,
      recentInteractions: 5,
      successRate: 90,
      topInteractionType: null,
      moodPattern: null,
      strengths: [],
      areasToImprove: [],
      suggestedActions: [],
    };

    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('Improving')).toBeInTheDocument();
    });
  });

  it('should use yellow for moderate scores (40-69)', async () => {
    const mockSummary: RelationshipSummary = {
      personId: 'test-id',
      personName: 'Moderate',
      group: 'friends',
      healthScore: 55,
      healthTrend: 'stable',
      lastContact: null,
      daysSinceContact: null,
      totalInteractions: 5,
      recentInteractions: 2,
      successRate: 60,
      topInteractionType: null,
      moodPattern: null,
      strengths: [],
      areasToImprove: [],
      suggestedActions: [],
    };

    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText('55%')).toBeInTheDocument();
      expect(screen.getByText('Stable')).toBeInTheDocument();
    });
  });

  it('should use red for low scores (<40)', async () => {
    const mockSummary: RelationshipSummary = {
      personId: 'test-id',
      personName: 'NeedsAttention',
      group: 'family',
      healthScore: 25,
      healthTrend: 'declining',
      lastContact: null,
      daysSinceContact: 60,
      totalInteractions: 2,
      recentInteractions: 0,
      successRate: 30,
      topInteractionType: null,
      moodPattern: null,
      strengths: [],
      areasToImprove: ['Long time since contact'],
      suggestedActions: ['Schedule a call'],
    };

    vi.mocked(useSummariesHook.useRelationshipSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useSummariesHook.useAISummary).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithQueryClient(<RelationshipSummaryCard personId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('Needs attention')).toBeInTheDocument();
    });
  });
});
