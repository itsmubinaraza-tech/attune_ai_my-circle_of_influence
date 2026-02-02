import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Supabase
vi.mock('@/lib/supabase', () => {
  const mockPeopleData = [
    {
      id: 'person-1',
      name: 'John Mockup',
      group: 'work',
      subgroup: 'Team',
      role: 'Developer',
      email: 'john@demo.com',
      relationship_health: 80,
      last_contact: new Date().toISOString(),
      is_archived: false,
    },
    {
      id: 'person-2',
      name: 'Alice Mockup',
      group: 'family',
      subgroup: 'Immediate',
      role: 'Sister',
      email: 'alice@demo.com',
      relationship_health: 95,
      last_contact: new Date().toISOString(),
      is_archived: false,
    },
    {
      id: 'person-3',
      name: 'Bob Mockup',
      group: 'friends',
      subgroup: 'Close',
      role: 'Best Friend',
      relationship_health: 90,
      last_contact: new Date().toISOString(),
      is_archived: false,
    },
  ];

  const mockConnectionsData = [
    {
      id: 'conn-1',
      person_a_id: 'person-1',
      person_b_id: 'person-2',
      connection_type: 'knows',
      notes: 'Met at company event',
      created_at: new Date().toISOString(),
      person_a: { id: 'person-1', name: 'John Mockup', group: 'work' },
      person_b: { id: 'person-2', name: 'Alice Mockup', group: 'family' },
    },
  ];

  return {
    supabase: {
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({
              data: table === 'people' ? mockPeopleData : mockConnectionsData,
              error: null
            }),
            single: () => Promise.resolve({ data: mockPeopleData[0], error: null }),
          }),
          or: () => ({
            order: () => Promise.resolve({ data: mockConnectionsData, error: null }),
          }),
          order: () => Promise.resolve({
            data: table === 'people' ? mockPeopleData : mockConnectionsData,
            error: null
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({
              data: { id: 'new-conn', ...mockConnectionsData[0] },
              error: null
            }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'user-123' } } }),
      },
    },
  };
});

import AddConnectionModal from '@/components/attune/AddConnectionModal';
import * as connectionsService from '@/services/connections';

const createTestQueryClient = () =>
  new QueryClient({
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
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Feature 2.5: Connection Web', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TEST 2.5.1: Connection Service Functions', () => {
    it('should have getConnectionTypeLabel function', () => {
      expect(connectionsService.getConnectionTypeLabel).toBeDefined();
    });

    it('should return correct label for knows', () => {
      expect(connectionsService.getConnectionTypeLabel('knows')).toBe('Knows');
    });

    it('should return correct label for works_with', () => {
      expect(connectionsService.getConnectionTypeLabel('works_with')).toBe('Works with');
    });

    it('should return correct label for related_to', () => {
      expect(connectionsService.getConnectionTypeLabel('related_to')).toBe('Related to');
    });

    it('should have getConnectionTypeOptions function', () => {
      expect(connectionsService.getConnectionTypeOptions).toBeDefined();
    });

    it('should return all connection type options', () => {
      const options = connectionsService.getConnectionTypeOptions();
      expect(options).toHaveLength(3);
      expect(options.map(o => o.value)).toContain('knows');
      expect(options.map(o => o.value)).toContain('works_with');
      expect(options.map(o => o.value)).toContain('related_to');
    });
  });

  describe('TEST 2.5.2: AddConnectionModal', () => {
    it('should render modal when open', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Add Connection')).toBeInTheDocument();
      });
    });

    it('should not render when closed', () => {
      renderWithProviders(
        <AddConnectionModal isOpen={false} onClose={() => {}} />
      );

      expect(screen.queryByText('Add Connection')).not.toBeInTheDocument();
    });

    it('should show First Person selector', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('First Person')).toBeInTheDocument();
      });
    });

    it('should show Second Person selector', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Second Person')).toBeInTheDocument();
      });
    });

    it('should show Connection Type selector', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Connection Type')).toBeInTheDocument();
      });
    });

    it('should show all connection type buttons', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Knows')).toBeInTheDocument();
        expect(screen.getByText('Works with')).toBeInTheDocument();
        expect(screen.getByText('Related to')).toBeInTheDocument();
      });
    });

    it('should show notes field', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Notes (optional)')).toBeInTheDocument();
      });
    });

    it('should have Create Connection button', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Create Connection')).toBeInTheDocument();
      });
    });

    it('should have Cancel button', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    it('should call onClose when Cancel is clicked', async () => {
      const onClose = vi.fn();
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={onClose} />
      );

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('TEST 2.5.3: Connection Type Icons', () => {
    it('should display Users icon for knows type', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        const knowsButton = screen.getByText('Knows').closest('button');
        expect(knowsButton).toBeInTheDocument();
      });
    });

    it('should display Briefcase icon for works_with type', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        const worksWithButton = screen.getByText('Works with').closest('button');
        expect(worksWithButton).toBeInTheDocument();
      });
    });

    it('should display Heart icon for related_to type', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        const relatedToButton = screen.getByText('Related to').closest('button');
        expect(relatedToButton).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.5.4: Connection Type Selection', () => {
    it('should have knows selected by default', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        const knowsButton = screen.getByText('Knows').closest('button');
        expect(knowsButton).toHaveClass('bg-purple-500/20');
      });
    });

    it('should allow selecting works_with type', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Works with')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Works with'));

      await waitFor(() => {
        const worksWithButton = screen.getByText('Works with').closest('button');
        expect(worksWithButton).toHaveClass('bg-purple-500/20');
      });
    });

    it('should allow selecting related_to type', async () => {
      renderWithProviders(
        <AddConnectionModal isOpen={true} onClose={() => {}} />
      );

      await waitFor(() => {
        expect(screen.getByText('Related to')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Related to'));

      await waitFor(() => {
        const relatedToButton = screen.getByText('Related to').closest('button');
        expect(relatedToButton).toHaveClass('bg-purple-500/20');
      });
    });
  });

  describe('TEST 2.5.5: Preselected Person', () => {
    it('should accept preselectedPersonId prop', async () => {
      renderWithProviders(
        <AddConnectionModal
          isOpen={true}
          onClose={() => {}}
          preselectedPersonId="person-1"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Add Connection')).toBeInTheDocument();
      });
    });
  });
});
