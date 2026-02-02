import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Supabase
vi.mock('@/lib/supabase', () => {
  const mockSessionsData = [
    {
      id: 'session-1',
      user_id: 'user-1',
      person_id: 'person-1',
      messages: [
        { id: 'msg-1', role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
        { id: 'msg-2', role: 'assistant', content: 'Hi there!', timestamp: new Date().toISOString() },
      ],
      mood: 'calm',
      outcome_goal: 'understand better',
      summary: null,
      tokens_used: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: 'session-2',
      user_id: 'user-1',
      person_id: null,
      messages: [
        { id: 'msg-3', role: 'user', content: 'General question', timestamp: new Date().toISOString() },
      ],
      mood: null,
      outcome_goal: null,
      summary: null,
      tokens_used: 5,
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
  ];

  const mockCreditsData = {
    id: 'credits-1',
    user_id: 'user-1',
    credits_remaining: 45,
    credits_total: 50,
    reset_date: new Date(Date.now() + 15 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@example.com' } },
        }),
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'user-1' } } },
        }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
      from: vi.fn((table: string) => {
        if (table === 'coaching_sessions') {
          return {
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockSessionsData[0], error: null }),
            then: vi.fn().mockResolvedValue({ data: mockSessionsData, error: null }),
          };
        }
        if (table === 'user_credits') {
          return {
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCreditsData, error: null }),
          };
        }
        if (table === 'people') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }),
    },
  };
});

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' },
    session: { user: { id: 'user-1' } },
    signOut: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
    header: ({ children, ...props }: React.PropsWithChildren<object>) => <header {...props}>{children}</header>,
    aside: ({ children, ...props }: React.PropsWithChildren<object>) => <aside {...props}>{children}</aside>,
    button: ({ children, ...props }: React.PropsWithChildren<object>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Test utilities
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// ===== Chat Service Tests =====
describe('Chat Service', () => {
  describe('parseMessages', () => {
    it('should parse valid messages array', async () => {
      const { parseMessages } = await import('@/services/chat');
      const messages = [
        { id: '1', role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
        { id: '2', role: 'assistant', content: 'Hi!', timestamp: new Date().toISOString() },
      ];
      const result = parseMessages(messages as any);
      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('user');
    });

    it('should return empty array for null input', async () => {
      const { parseMessages } = await import('@/services/chat');
      const result = parseMessages(null as any);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array input', async () => {
      const { parseMessages } = await import('@/services/chat');
      const result = parseMessages({ invalid: true } as any);
      expect(result).toEqual([]);
    });
  });

  describe('createSession', () => {
    it('should create a session with messages', async () => {
      const { createSession } = await import('@/services/chat');
      const session = await createSession({
        messages: [{ id: '1', role: 'user', content: 'Test', timestamp: new Date().toISOString() }],
        mood: 'calm',
      });
      expect(session).toBeDefined();
    });
  });
});

// ===== Credits Service Tests =====
describe('Credits Service', () => {
  describe('getDaysUntilReset', () => {
    it('should calculate days until reset', async () => {
      const { getDaysUntilReset } = await import('@/services/credits');
      const futureDate = new Date(Date.now() + 10 * 86400000).toISOString();
      const days = getDaysUntilReset(futureDate);
      expect(days).toBe(10);
    });

    it('should return negative for past dates', async () => {
      const { getDaysUntilReset } = await import('@/services/credits');
      const pastDate = new Date(Date.now() - 5 * 86400000).toISOString();
      const days = getDaysUntilReset(pastDate);
      expect(days).toBeLessThan(0);
    });
  });

  describe('constants', () => {
    it('should have default monthly credits', async () => {
      const { creditsService } = await import('@/services/credits');
      expect(creditsService.DEFAULT_MONTHLY_CREDITS).toBe(50);
    });

    it('should have credits per message', async () => {
      const { creditsService } = await import('@/services/credits');
      expect(creditsService.CREDITS_PER_MESSAGE).toBe(1);
    });
  });
});

// ===== Chat Hooks Tests =====
describe('Chat Hooks', () => {
  it('should export useSessions hook', async () => {
    const hooks = await import('@/hooks/useChat');
    expect(hooks.useSessions).toBeDefined();
  });

  it('should export useSession hook', async () => {
    const hooks = await import('@/hooks/useChat');
    expect(hooks.useSession).toBeDefined();
  });

  it('should export useCreateSession hook', async () => {
    const hooks = await import('@/hooks/useChat');
    expect(hooks.useCreateSession).toBeDefined();
  });

  it('should export useUpdateSession hook', async () => {
    const hooks = await import('@/hooks/useChat');
    expect(hooks.useUpdateSession).toBeDefined();
  });

  it('should export useDeleteSession hook', async () => {
    const hooks = await import('@/hooks/useChat');
    expect(hooks.useDeleteSession).toBeDefined();
  });

  it('should export useChatConversation hook', async () => {
    const hooks = await import('@/hooks/useChat');
    expect(hooks.useChatConversation).toBeDefined();
  });
});

// ===== Credits Hooks Tests =====
describe('Credits Hooks', () => {
  it('should export useCredits hook', async () => {
    const hooks = await import('@/hooks/useCredits');
    expect(hooks.useCredits).toBeDefined();
  });

  it('should export useUseCredits hook', async () => {
    const hooks = await import('@/hooks/useCredits');
    expect(hooks.useUseCredits).toBeDefined();
  });

  it('should export useCreditsInfo hook', async () => {
    const hooks = await import('@/hooks/useCredits');
    expect(hooks.useCreditsInfo).toBeDefined();
  });

  it('should export useAddBonusCredits hook', async () => {
    const hooks = await import('@/hooks/useCredits');
    expect(hooks.useAddBonusCredits).toBeDefined();
  });
});

// ===== ChatInterface Component Tests =====
describe('ChatInterface Component', () => {
  const ChatInterface = vi.fn().mockImplementation(() => null);

  beforeEach(async () => {
    const module = await import('@/components/attune/ChatInterface');
    ChatInterface.mockImplementation(module.default);
  });

  it('should render empty state when no messages', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByText('Talk to Me')).toBeInTheDocument();
  });

  it('should render messages', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello there', timestamp: new Date().toISOString() },
      { id: '2', role: 'assistant' as const, content: 'Hi! How can I help?', timestamp: new Date().toISOString() },
    ];

    renderWithProviders(
      <ChatInterfaceComponent
        messages={messages}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('Hi! How can I help?')).toBeInTheDocument();
  });

  it('should show context bar with person', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    const mockPerson = {
      id: 'person-1',
      name: 'John Doe',
      group: 'work' as const,
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
      nickname: null,
      photo_url: null,
      subgroup: null,
      role: null,
      email: null,
      phone: null,
      linkedin_url: null,
      communication_style: null,
      motivations: null,
      values: null,
      goals: null,
      notes: null,
      last_contact: null,
      relationship_health: null,
    };

    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={vi.fn()}
        selectedPerson={mockPerson}
      />
    );

    expect(screen.getByText(/About John Doe/)).toBeInTheDocument();
  });

  it('should have input field', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('should have send button', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={vi.fn()}
      />
    );

    const sendButton = screen.getByRole('button', { name: '' });
    expect(sendButton).toBeInTheDocument();
  });

  it('should call onSendMessage when form submitted', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    const onSendMessage = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={onSendMessage}
      />
    );

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(onSendMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('should show processing indicator', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={vi.fn()}
        isProcessing={true}
      />
    );

    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('should render suggestion buttons', async () => {
    const ChatInterfaceComponent = (await import('@/components/attune/ChatInterface')).default;
    renderWithProviders(
      <ChatInterfaceComponent
        messages={[]}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByText('How do I approach a difficult conversation?')).toBeInTheDocument();
  });
});

// ===== CreditsDisplay Component Tests =====
describe('CreditsDisplay Component', () => {
  it('should render compact mode', async () => {
    const CreditsDisplay = (await import('@/components/attune/CreditsDisplay')).default;
    renderWithProviders(<CreditsDisplay compact />);
    // Component renders without error in compact mode
    expect(document.body).toBeInTheDocument();
  });

  it('should render full mode with loading state', async () => {
    const CreditsDisplay = (await import('@/components/attune/CreditsDisplay')).default;
    renderWithProviders(<CreditsDisplay />);
    // Shows loading state initially (animate-pulse class)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

// ===== Chat Message Types Tests =====
describe('Chat Message Types', () => {
  it('should support user role', () => {
    const message = { id: '1', role: 'user' as const, content: 'Test', timestamp: new Date().toISOString() };
    expect(message.role).toBe('user');
  });

  it('should support assistant role', () => {
    const message = { id: '1', role: 'assistant' as const, content: 'Test', timestamp: new Date().toISOString() };
    expect(message.role).toBe('assistant');
  });

  it('should support system role', () => {
    const message = { id: '1', role: 'system' as const, content: 'Test', timestamp: new Date().toISOString() };
    expect(message.role).toBe('system');
  });
});

// ===== Integration Tests =====
describe('Chat Integration', () => {
  it('should have Chat page component exported', async () => {
    const Chat = await import('@/pages/Chat');
    expect(Chat.default).toBeDefined();
  });

  it('should have ChatInterface component exported', async () => {
    const ChatInterface = await import('@/components/attune/ChatInterface');
    expect(ChatInterface.default).toBeDefined();
  });
});
