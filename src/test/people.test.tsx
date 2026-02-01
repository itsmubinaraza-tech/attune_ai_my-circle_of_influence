import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AddPersonModal from '@/components/attune/AddPersonModal';
import { getDefaultSubgroups } from '@/services/people';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'test-person-id',
          name: 'Test Person',
          group: 'work',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'test-user-id',
          is_archived: false,
        },
        error: null,
      }),
    }),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderWithProviders(component: React.ReactNode) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{component}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('Feature 2.1: Add Person (Smart Progressive)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TEST 2.1.1: Form Rendering', () => {
    it('should render AddPersonModal when open', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      expect(screen.getByText('Add New Person')).toBeInTheDocument();
    });

    it('should have name input field', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      expect(screen.getByPlaceholderText('Enter their name...')).toBeInTheDocument();
    });

    it('should have group selection buttons', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      // The buttons show lowercase capitalized text
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('family')).toBeInTheDocument();
      expect(screen.getByText('friends')).toBeInTheDocument();
      expect(screen.getByText('acquaintances')).toBeInTheDocument();
    });

    it('should show subgroups for selected group', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      // Work subgroups should be shown by default
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.getByText('Team')).toBeInTheDocument();
    });

    it('should have add person button', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      expect(screen.getByText('Add Person')).toBeInTheDocument();
    });

    it('should have cancel button', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      renderWithProviders(
        <AddPersonModal isOpen={false} onClose={() => {}} />
      );

      expect(screen.queryByText('Add New Person')).not.toBeInTheDocument();
    });
  });

  describe('TEST 2.1.2: Validation', () => {
    it('should disable submit button when name is empty', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      const submitButton = screen.getByText('Add Person').closest('button');
      expect(submitButton).toHaveClass('cursor-not-allowed');
    });

    it('should enable submit button when name is entered', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      const nameInput = screen.getByPlaceholderText('Enter their name...');
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const submitButton = screen.getByText('Add Person').closest('button');
      expect(submitButton).not.toHaveClass('cursor-not-allowed');
    });

    it('should show required indicator for name field', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      // Look for the asterisk near "Name"
      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });
  });

  describe('TEST 2.1.3: Group Selection', () => {
    it('should allow switching groups', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      // Click family
      fireEvent.click(screen.getByText('family'));

      // Family subgroups should appear
      expect(screen.getByText('Immediate')).toBeInTheDocument();
      expect(screen.getByText('Extended')).toBeInTheDocument();
    });

    it('should update subgroups when group changes', () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      // Initially Work subgroups
      expect(screen.getByText('Manager')).toBeInTheDocument();

      // Switch to friends
      fireEvent.click(screen.getByText('friends'));

      // Friends subgroups should appear
      expect(screen.getByText('Close')).toBeInTheDocument();
      expect(screen.getByText('College')).toBeInTheDocument();
    });
  });

  describe('TEST 2.1.4: Advanced Fields', () => {
    it('should toggle advanced fields', async () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      // Click to show advanced
      const toggleButton = screen.getByText('Show additional details');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g., Manager, Sister, Best Friend...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('+1 (555) 123-4567')).toBeInTheDocument();
      });
    });

    it('should have notes textarea in advanced fields', async () => {
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={() => {}} />
      );

      fireEvent.click(screen.getByText('Show additional details'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Any notes about this person...')).toBeInTheDocument();
      });
    });
  });

  describe('TEST 2.1.5: Close Modal', () => {
    it('should call onClose when cancel is clicked', () => {
      const onClose = vi.fn();
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={onClose} />
      );

      fireEvent.click(screen.getByText('Cancel'));
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when X button is clicked', () => {
      const onClose = vi.fn();
      renderWithProviders(
        <AddPersonModal isOpen={true} onClose={onClose} />
      );

      const closeButtons = screen.getAllByRole('button');
      const xButton = closeButtons.find((btn) => btn.querySelector('.lucide-x'));
      if (xButton) fireEvent.click(xButton);

      expect(onClose).toHaveBeenCalled();
    });
  });
});

describe('People Service Helper Functions', () => {
  describe('getDefaultSubgroups', () => {
    it('should return work subgroups', () => {
      const subgroups = getDefaultSubgroups('work');
      expect(subgroups).toContain('Manager');
      expect(subgroups).toContain('Team');
      expect(subgroups).toContain('Stakeholder');
    });

    it('should return family subgroups', () => {
      const subgroups = getDefaultSubgroups('family');
      expect(subgroups).toContain('Immediate');
      expect(subgroups).toContain('Extended');
    });

    it('should return friends subgroups', () => {
      const subgroups = getDefaultSubgroups('friends');
      expect(subgroups).toContain('Close');
      expect(subgroups).toContain('College');
      expect(subgroups).toContain('Neighborhood');
    });

    it('should return acquaintances subgroups', () => {
      const subgroups = getDefaultSubgroups('acquaintances');
      expect(subgroups).toContain('Professional');
      expect(subgroups).toContain('Social');
    });
  });
});
