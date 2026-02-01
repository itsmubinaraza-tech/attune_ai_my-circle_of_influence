import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}));

// Test component to access auth context
function TestAuthConsumer() {
  const { user, loading, signIn, signUp, signOut, resetPassword } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
      <button data-testid="signIn" onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button data-testid="signUp" onClick={() => signUp('test@example.com', 'password', 'Test User')}>
        Sign Up
      </button>
      <button data-testid="signOut" onClick={() => signOut()}>
        Sign Out
      </button>
      <button data-testid="resetPassword" onClick={() => resetPassword('test@example.com')}>
        Reset Password
      </button>
    </div>
  );
}

function renderWithAuth(component: React.ReactNode) {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
}

describe('Feature 1.3: Authentication System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TEST 1.3.1: AuthContext Provider', () => {
    it('should provide auth context to children', async () => {
      renderWithAuth(<TestAuthConsumer />);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
      });
    });

    it('should export useAuth hook', () => {
      expect(typeof useAuth).toBe('function');
    });

    it('should throw error when useAuth is used outside provider', () => {
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestAuthConsumer />);
      }).toThrow('useAuth must be used within an AuthProvider');

      console.error = originalError;
    });
  });

  describe('TEST 1.3.2: Sign In Flow', () => {
    it('should provide signIn function', async () => {
      renderWithAuth(<TestAuthConsumer />);

      const signInButton = await screen.findByTestId('signIn');
      expect(signInButton).toBeInTheDocument();
    });

    it('should call supabase signInWithPassword', async () => {
      const { supabase } = await import('@/lib/supabase');

      renderWithAuth(<TestAuthConsumer />);

      const signInButton = await screen.findByTestId('signIn');
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password',
        });
      });
    });
  });

  describe('TEST 1.3.3: Sign Up Flow', () => {
    it('should provide signUp function', async () => {
      renderWithAuth(<TestAuthConsumer />);

      const signUpButton = await screen.findByTestId('signUp');
      expect(signUpButton).toBeInTheDocument();
    });

    it('should call supabase signUp with full name', async () => {
      const { supabase } = await import('@/lib/supabase');

      renderWithAuth(<TestAuthConsumer />);

      const signUpButton = await screen.findByTestId('signUp');
      fireEvent.click(signUpButton);

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password',
          options: {
            data: {
              full_name: 'Test User',
            },
          },
        });
      });
    });
  });

  describe('TEST 1.3.4: Sign Out Flow', () => {
    it('should provide signOut function', async () => {
      renderWithAuth(<TestAuthConsumer />);

      const signOutButton = await screen.findByTestId('signOut');
      expect(signOutButton).toBeInTheDocument();
    });

    it('should call supabase signOut', async () => {
      const { supabase } = await import('@/lib/supabase');

      renderWithAuth(<TestAuthConsumer />);

      const signOutButton = await screen.findByTestId('signOut');
      fireEvent.click(signOutButton);

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled();
      });
    });
  });

  describe('TEST 1.3.5: Password Reset Flow', () => {
    it('should provide resetPassword function', async () => {
      renderWithAuth(<TestAuthConsumer />);

      const resetButton = await screen.findByTestId('resetPassword');
      expect(resetButton).toBeInTheDocument();
    });

    it('should call supabase resetPasswordForEmail', async () => {
      const { supabase } = await import('@/lib/supabase');

      renderWithAuth(<TestAuthConsumer />);

      const resetButton = await screen.findByTestId('resetPassword');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
          'test@example.com',
          expect.objectContaining({
            redirectTo: expect.stringContaining('/reset-password'),
          })
        );
      });
    });
  });
});

describe('Auth Pages', () => {
  describe('SignIn Page', () => {
    it('should have email input', async () => {
      const SignIn = (await import('@/pages/SignIn')).default;
      renderWithAuth(<SignIn />);

      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('should have password input', async () => {
      const SignIn = (await import('@/pages/SignIn')).default;
      renderWithAuth(<SignIn />);

      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('should have submit button', async () => {
      const SignIn = (await import('@/pages/SignIn')).default;
      renderWithAuth(<SignIn />);

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should have link to sign up', async () => {
      const SignIn = (await import('@/pages/SignIn')).default;
      renderWithAuth(<SignIn />);

      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('should have forgot password link', async () => {
      const SignIn = (await import('@/pages/SignIn')).default;
      renderWithAuth(<SignIn />);

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  describe('SignUp Page', () => {
    it('should have full name input', async () => {
      const SignUp = (await import('@/pages/SignUp')).default;
      renderWithAuth(<SignUp />);

      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    });

    it('should have email input', async () => {
      const SignUp = (await import('@/pages/SignUp')).default;
      renderWithAuth(<SignUp />);

      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('should have password input', async () => {
      const SignUp = (await import('@/pages/SignUp')).default;
      renderWithAuth(<SignUp />);

      expect(screen.getByPlaceholderText('At least 6 characters')).toBeInTheDocument();
    });

    it('should have link to sign in', async () => {
      const SignUp = (await import('@/pages/SignUp')).default;
      renderWithAuth(<SignUp />);

      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });

  describe('ForgotPassword Page', () => {
    it('should have email input', async () => {
      const ForgotPassword = (await import('@/pages/ForgotPassword')).default;
      renderWithAuth(<ForgotPassword />);

      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('should have submit button', async () => {
      const ForgotPassword = (await import('@/pages/ForgotPassword')).default;
      renderWithAuth(<ForgotPassword />);

      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    it('should have back to sign in link', async () => {
      const ForgotPassword = (await import('@/pages/ForgotPassword')).default;
      renderWithAuth(<ForgotPassword />);

      expect(screen.getByText(/back to sign in/i)).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoute', () => {
  it('should show loading state initially', async () => {
    // Reset session mock to return loading
    const { supabase } = await import('@/lib/supabase');
    (supabase.auth.getSession as any).mockImplementation(() => new Promise(() => {}));

    const { ProtectedRoute } = await import('@/components/auth/ProtectedRoute');

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
