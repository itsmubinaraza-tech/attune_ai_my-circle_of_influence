import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PersonProfileModal from '@/components/attune/PersonProfileModal';

// Mock useSummaries hooks
vi.mock('@/hooks/useSummaries', () => ({
  useRelationshipSummary: vi.fn().mockReturnValue({
    data: {
      personId: 'test-id-123',
      personName: 'John Doe',
      group: 'work',
      healthScore: 75,
      healthTrend: 'stable',
      lastContact: new Date().toISOString(),
      daysSinceContact: 0,
      totalInteractions: 5,
      recentInteractions: 2,
      successRate: 80,
      topInteractionType: 'call',
      moodPattern: null,
      strengths: ['High success rate'],
      areasToImprove: [],
      suggestedActions: ['Schedule next meeting'],
    },
    isLoading: false,
    error: null,
  }),
  useAISummary: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
  }),
  summaryKeys: {
    all: ['summaries'],
    relationship: (personId: string) => ['summaries', 'relationship', personId],
    circle: () => ['summaries', 'circle'],
    ai: (personId: string) => ['summaries', 'ai', personId],
  },
}));

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'test-id-123',
              name: 'John Doe',
              group: 'work',
              subgroup: 'Team',
              role: 'Developer',
              email: 'john@example.com',
              phone: '+1234567890',
              notes: 'Test notes',
              relationship_health: 75,
              last_contact: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_archived: false,
            },
            error: null,
          }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'test-id-123',
                name: 'John Doe Updated',
                group: 'work',
                subgroup: 'Team',
                role: 'Senior Developer',
                email: 'john@example.com',
                phone: '+1234567890',
                notes: 'Updated notes',
                relationship_health: 75,
                last_contact: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_archived: false,
              },
              error: null,
            }),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
  },
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('PersonProfileModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      const { container } = renderWithProviders(
        <PersonProfileModal
          personId="test-id"
          isOpen={false}
          onClose={() => {}}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders loading state when open', () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );
      // Initially shows loading spinner
      expect(document.querySelector('.animate-spin')).toBeTruthy();
    });

    it('renders person details when data loads', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Display Information', () => {
    it('displays person name', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('displays group badge', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('work')).toBeInTheDocument();
      });
    });

    it('displays contact information', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('+1234567890')).toBeInTheDocument();
      });
    });

    it('displays relationship health percentage', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument();
      });
    });

    it('displays notes', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test notes')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode when edit button clicked', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);

      // In edit mode, name becomes an input
      const nameInput = document.querySelector('input[type="text"]');
      expect(nameInput).toBeTruthy();
    });

    it('shows cancel and save buttons in edit mode', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);

      expect(screen.getByTitle('Cancel')).toBeInTheDocument();
      expect(screen.getByTitle('Save')).toBeInTheDocument();
    });

    it('shows group selection in edit mode', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);

      expect(screen.getByText('Group')).toBeInTheDocument();
      expect(screen.getByText('family')).toBeInTheDocument();
      expect(screen.getByText('friends')).toBeInTheDocument();
      expect(screen.getByText('acquaintances')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button clicked', async () => {
      const onClose = vi.fn();
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={onClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const closeButton = screen.getByTitle('Close');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop clicked', async () => {
      const onClose = vi.fn();
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={onClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Click backdrop
      const backdrop = document.querySelector('.backdrop-blur-sm');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Advanced Options', () => {
    it('shows advanced options toggle', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('Show advanced options')).toBeInTheDocument();
    });

    it('shows archive and delete buttons when advanced expanded', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const advancedToggle = screen.getByText('Show advanced options');
      fireEvent.click(advancedToggle);

      await waitFor(() => {
        expect(screen.getByText('Archive')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });

    it('shows delete confirmation on first delete click', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const advancedToggle = screen.getByText('Show advanced options');
      fireEvent.click(advancedToggle);

      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });
    });
  });

  describe('Meta Information', () => {
    it('displays creation date', async () => {
      renderWithProviders(
        <PersonProfileModal
          personId="test-id-123"
          isOpen={true}
          onClose={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Check for "Added" text
      const addedText = screen.getByText(/Added/);
      expect(addedText).toBeInTheDocument();
    });
  });
});
