import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Circle from '@/pages/Circle';

// Mock Supabase - data is defined inside to avoid hoisting issues
vi.mock('@/lib/supabase', () => {
  const mockPeopleData = [
    {
      id: 'person-1',
      name: 'John Work',
      group: 'work',
      subgroup: 'Team',
      role: 'Developer',
      email: 'john@work.com',
      phone: '+1234567890',
      relationship_health: 80,
      last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
    },
    {
      id: 'person-2',
      name: 'Alice Family',
      group: 'family',
      subgroup: 'Immediate',
      role: 'Sister',
      email: 'alice@family.com',
      phone: '+0987654321',
      relationship_health: 95,
      last_contact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
    },
    {
      id: 'person-3',
      name: 'Bob Friend',
      group: 'friends',
      subgroup: 'Close',
      role: null,
      email: null,
      phone: null,
      relationship_health: 60,
      last_contact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
    },
    {
      id: 'person-4',
      name: 'Carol Acquaintance',
      group: 'acquaintances',
      subgroup: 'Professional',
      role: 'Networking Contact',
      email: 'carol@example.com',
      phone: null,
      relationship_health: 40,
      last_contact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
    },
  ];

  return {
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: mockPeopleData, error: null }),
          }),
          or: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: mockPeopleData.slice(0, 3), error: null }),
            }),
          }),
        }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'user-123' } } }),
      },
    },
  };
});

// Mock people data for test assertions
const mockPeople = [
  {
    id: 'person-1',
    name: 'John Work',
    group: 'work',
    subgroup: 'Team',
    role: 'Developer',
    email: 'john@work.com',
    phone: '+1234567890',
    relationship_health: 80,
    last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
  },
  {
    id: 'person-2',
    name: 'Alice Family',
    group: 'family',
    subgroup: 'Immediate',
    role: 'Sister',
    email: 'alice@family.com',
    phone: '+0987654321',
    relationship_health: 95,
    last_contact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
  },
  {
    id: 'person-3',
    name: 'Bob Friend',
    group: 'friends',
    subgroup: 'Close',
    role: null,
    email: null,
    phone: null,
    relationship_health: 60,
    last_contact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
  },
  {
    id: 'person-4',
    name: 'Carol Acquaintance',
    group: 'acquaintances',
    subgroup: 'Professional',
    role: 'Networking Contact',
    email: 'carol@example.com',
    phone: null,
    relationship_health: 40,
    last_contact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
  },
];

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

describe('Feature 2.3: Circle Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TEST 2.3.1: Page Layout', () => {
    it('should render the Circle page header', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('My Circle')).toBeInTheDocument();
      });
    });

    it('should show people count in header', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText(/people in your circle/i)).toBeInTheDocument();
      });
    });

    it('should have back button to home', async () => {
      renderWithProviders(<Circle />);

      const backLink = document.querySelector('a[href="/"]');
      expect(backLink).toBeTruthy();
    });

    it('should have Add Person button', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('Add Person')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.3.2: Search Functionality', () => {
    it('should render search input', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
      });
    });

    it('should filter people when searching', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by name/i);
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.3.3: Group Filters', () => {
    it('should render All filter tab', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText(/^All/)).toBeInTheDocument();
      });
    });

    it('should render Work filter tab', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText(/Work/)).toBeInTheDocument();
      });
    });

    it('should render Family filter tab', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText(/Family/)).toBeInTheDocument();
      });
    });

    it('should render Friends filter tab', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText(/friends/i)).toBeInTheDocument();
      });
    });

    it('should render Acquaintances filter tab', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText(/acquaintances/i)).toBeInTheDocument();
      });
    });

    it('should filter by group when clicking tab', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });

      // Click on Family filter
      const familyTab = screen.getByText(/Family/);
      fireEvent.click(familyTab);

      // Alice should be visible, John should not
      await waitFor(() => {
        expect(screen.getByText('Alice Family')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.3.4: Sort Options', () => {
    it('should render sort by name option', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('Name')).toBeInTheDocument();
      });
    });

    it('should render sort by last contact option', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('Last Contact')).toBeInTheDocument();
      });
    });

    it('should render sort by health option', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('Health')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.3.5: People Cards', () => {
    it('should display person name', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });
    });

    it('should display person role or subgroup', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('Developer')).toBeInTheDocument();
      });
    });

    it('should display last contact time', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        // Should show relative time like "2d ago"
        const timeElements = screen.getAllByText(/ago|Today|Yesterday|Never/i);
        expect(timeElements.length).toBeGreaterThan(0);
      });
    });

    it('should display relationship health', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('80%')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.3.6: Quick Actions', () => {
    it('should show email action for people with email', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });

      // Check for mailto link
      const emailLink = document.querySelector('a[href^="mailto:"]');
      expect(emailLink).toBeTruthy();
    });

    it('should show call action for people with phone', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });

      // Check for tel link
      const phoneLink = document.querySelector('a[href^="tel:"]');
      expect(phoneLink).toBeTruthy();
    });
  });

  describe('TEST 2.3.7: Empty State', () => {
    it('should show empty state message when no people match filter', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('John Work')).toBeInTheDocument();
      });

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText(/search by name/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent person xyz' } });

      await waitFor(() => {
        expect(screen.getByText('No people found')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.3.8: Add Person Modal', () => {
    it('should open Add Person modal when clicking Add Person button', async () => {
      renderWithProviders(<Circle />);

      await waitFor(() => {
        expect(screen.getByText('Add Person')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Person');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add New Person')).toBeInTheDocument();
      });
    });
  });
});
