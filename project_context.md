# Attune - Project Context

## Project Overview
**Name:** Attune - My Circle of Influence
**Description:** An emotional intelligence app for managing relationships and personal connections
**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Supabase
**Started:** January 31, 2026

---

## Supabase Configuration

### Credentials
- **URL:** `https://cjtratenqbohkufbyiqb.supabase.co`
- **Anon Key:** `sb_publishable_Loewm_78M4C8qV8K_I6EJw_aNJtExfG`

### Database Tables
1. **profiles** - User profiles (auto-created on signup)
2. **people** - Contacts in user's circle
3. **person_connections** - Relationships between people
4. **interactions** - Logged interactions with people
5. **coaching_sessions** - AI coaching chat sessions
6. **user_credits** - Monthly credit system for AI features
7. **reminders** - User-set and smart nudge reminders

### Setup Instructions
1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Enable Email auth in Authentication > Providers
3. Disable "Confirm email" for development
4. Set up OAuth providers (Google, GitHub, Apple) as needed

---

## Completed Features

### Phase 1: Foundation & Setup (COMPLETE)

#### Feature 1.1: Project Configuration & Design System
- Tailwind with context/mood colors
- 6 dynamic themes (ThemeSelector)
- Glassmorphism design system
- 48 Shadcn UI components
- Framer Motion animations
- **Commit:** `7c52ff2`

#### Feature 1.2: Supabase Backend Setup
- Database schema with 7 tables
- Row Level Security policies
- TypeScript types (`src/types/database.ts`)
- Supabase client (`src/lib/supabase.ts`)
- **Commit:** `a9d323d`

#### Feature 1.3: Authentication System
- AuthContext with useAuth hook
- Sign In / Sign Up / Forgot Password pages
- OAuth support (Google, GitHub, Apple)
- Protected routes
- Sign out functionality
- **Commit:** `7c69dd8`, `a2d0bb2`

#### Feature 1.4: Responsive Layout Shell
- Two-column layout (widgets + dashboard)
- Mobile hamburger menu
- Responsive breakpoints
- **Commit:** `7c52ff2`

### Phase 2: People Management (COMPLETE)

#### Feature 2.1: Add Person (Smart Progressive)
- AddPersonModal component
- People service with CRUD operations
- React Query hooks
- Group selection with subgroups
- **Commit:** `a8888c9`

#### Feature 2.2: Person Profile View (COMPLETE)
- PersonProfileModal component with view/edit modes
- Display all person details (name, group, subgroup, role, email, phone, notes)
- Relationship health indicator with progress bar
- Last contact date display
- Inline editing for all fields
- Group/subgroup selection in edit mode
- Archive and delete functionality with confirmation
- Double-click to open profile from relationship map
- 17 tests added
- **Commit:** `5a15579`

#### Feature 2.3: Circle Dashboard (COMPLETE)
- Dedicated `/circle` page for viewing all people
- Search functionality (by name, email, role)
- Filter tabs by group (All, Work, Family, Friends, Acquaintances)
- Sort options (Name, Last Contact, Relationship Health)
- People cards with avatar, role, last contact, health indicator
- Quick actions (email, call) on hover
- Empty state with add person CTA
- Integrated AddPersonModal and PersonProfileModal
- Navigation links from Index page (desktop and mobile)
- 23 tests added
- **Commit:** `397906b`

#### Feature 2.4: Demo Data & Import System (COMPLETE)
- `seedDemoData()` function creates 28 sample contacts (7 per group)
- All demo contacts have "Mockup" as last name for easy identification
- Demo contacts include notes: "Demo contact - feel free to edit or delete"
- Auto-seed for new accounts with empty circles via `usePeopleWithAutoSeed` hook
- Import dropdown menu in Circle page header with options:
  - Load Demo Data (functional)
  - Phone Contacts (UI ready, coming soon)
  - LinkedIn (UI ready, coming soon)
  - Facebook (UI ready, coming soon)
- Empty state shows import options for new users
- Click-outside handler to close import dropdown

#### Feature 2.5: Connection Web (COMPLETE)
- Connections service (`src/services/connections.ts`) with CRUD operations
- React Query hooks (`src/hooks/useConnections.ts`) for data fetching
- AddConnectionModal component for linking two people
- Three connection types: Knows, Works with, Related to
- PersonProfileModal shows person's connections with ability to add/remove
- Circle page header shows total connection count
- People cards show individual connection count indicator
- "Link" button in Circle page header to create connections
- Connection preview in modal before creating
- 23 tests added for connections feature

#### Feature 2.6: Interactive Relationship Graph (COMPLETE)
- New RelationshipGraph component with force-directed layout
- Individual people as nodes with group color coding (Work=indigo, Family=pink, Friends=green, Acquaintances=yellow)
- Connection lines (edges) between linked people with visual type indicators
- Interactive features: click to select, double-click for profile, drag to reposition, zoom/pan controls
- Glow effects on hover and selection
- Legends for groups and connection types
- Replaced rigid relationship map on Index page "Your Circle" widget
- Circle page retains card-based view for people

### Phase 3: Talk to Me (COMPLETE)

#### Feature 3.1: Chat Interface (COMPLETE)
- Chat page (`/chat`) with full conversation UI
- ChatInterface component with message bubbles and animations
- Message input with Enter to send, Shift+Enter for newlines
- Conversation history sidebar with session management
- Context-aware empty state with suggestion prompts
- Session persistence via Supabase coaching_sessions table
- Navigation links added to header (Today, Circle, Talk)
- "Let's Connect" button flows to chat with context (person, mood, outcome)

#### Feature 3.2: Voice Input (COMPLETE)
- Voice input button with Web Speech API integration
- Real-time speech-to-text transcription
- Visual feedback during listening (pulse animation)
- Graceful fallback when speech recognition unavailable
- Type declarations in `src/types/speech.d.ts`

#### Feature 3.3: Claude AI Integration (COMPLETE)
- Supabase Edge Function for secure API calls (`supabase/functions/chat/index.ts`)
- AI service for frontend integration (`src/services/ai.ts`)
- Context-aware system prompts with relationship details
- Graceful fallback to local responses when API unavailable
- Claude claude-sonnet-4-20250514 model for coaching responses
- Token usage tracking

#### Feature 3.4: Person Context Injection (COMPLETE)
- PersonContext builder from database records
- Dynamic system prompt generation with:
  - Person name, group, subgroup, role
  - User's notes about the person
  - Relationship health score
  - Current mood state
  - Desired outcome goal
- Context bar displays conversation context in UI

#### Feature 3.5: Conversation Limits & Credits (COMPLETE)
- Credits service (`src/services/credits.ts`) for usage tracking
- Monthly credit system (50 credits/month default)
- Automatic monthly reset on first of each month
- CreditsDisplay component (compact and full modes)
- Credit deduction per message sent
- Low credits warning (≤10 remaining)
- Empty credits blocking with reset date info
- 33 tests added for chat and credits
- **Total tests: 179 passing**

### Phase 4: Visual Polish (COMPLETE)

#### Feature 4.1: Mood Widget
- 8 emotions with auto-cycling
- Check/cancel icons on selection
- Glow effects

#### Feature 4.2: Relationship Graph (Updated)
- Force-directed graph layout with physics simulation
- Individual people as interactive nodes
- Connection edges with type-specific styling
- Zoom, pan, and drag interactivity
- Group and connection type legends

#### Feature 4.3: Animations & Micro-interactions
- Page transitions
- Hover/press states
- Floating orb backgrounds

---

## Key Files

### Configuration
- `.env.local` - Supabase credentials (not in git)
- `.env.example` - Template for env vars
- `supabase/schema.sql` - Database schema

### Authentication
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/components/auth/ProtectedRoute.tsx` - Route guard
- `src/pages/SignIn.tsx` - Sign in with OAuth
- `src/pages/SignUp.tsx` - Sign up with OAuth
- `src/pages/ForgotPassword.tsx` - Password reset

### People Management
- `src/services/people.ts` - CRUD operations + `seedDemoData()` function
- `src/hooks/usePeople.ts` - React Query hooks + `usePeopleWithAutoSeed`, `useSeedDemoData`
- `src/components/attune/AddPersonModal.tsx` - Add person form
- `src/components/attune/PersonProfileModal.tsx` - View/edit person profile with connections
- `src/pages/Circle.tsx` - Circle Dashboard page with Import dropdown and Link button

### Connections
- `src/services/connections.ts` - Connection CRUD operations
- `src/hooks/useConnections.ts` - React Query hooks for connections
- `src/components/attune/AddConnectionModal.tsx` - Create connections between people
- `src/components/attune/RelationshipGraph.tsx` - Force-directed graph visualization

### Interactions
- `src/services/interactions.ts` - Interaction CRUD operations and statistics
- `src/hooks/useInteractions.ts` - React Query hooks for interactions
- `src/components/attune/LogInteractionModal.tsx` - 3-step wizard to log interactions
- `src/components/attune/InteractionHistory.tsx` - Display past interactions

### Chat / Talk to Me
- `src/pages/Chat.tsx` - Main chat page with history sidebar
- `src/components/attune/ChatInterface.tsx` - Chat UI with messages and input
- `src/components/attune/CreditsDisplay.tsx` - Credits usage display
- `src/services/chat.ts` - Coaching session CRUD operations
- `src/services/credits.ts` - Credits management service
- `src/services/ai.ts` - Claude AI integration service
- `src/hooks/useChat.ts` - React Query hooks for chat sessions
- `src/hooks/useCredits.ts` - React Query hooks for credits
- `src/types/speech.d.ts` - Web Speech API type declarations
- `supabase/functions/chat/index.ts` - Edge function for Claude API
- `supabase/functions/README.md` - Edge function setup guide

### UI Components
- `src/components/attune/MoodSelector.tsx` - Mood widget
- `src/components/attune/OutcomeSelector.tsx` - Outcome widget
- `src/components/attune/PersonSearch.tsx` - Person search
- `src/components/attune/ThemeSelector.tsx` - Theme picker

### Tests
- `src/test/design-system.test.tsx` - 20 tests
- `src/test/supabase.test.ts` - 18 tests
- `src/test/auth.test.tsx` - 24 tests
- `src/test/people.test.tsx` - 20 tests
- `src/test/person-profile.test.tsx` - 17 tests
- `src/test/circle.test.tsx` - 23 tests
- `src/test/connections.test.tsx` - 23 tests
- `src/test/chat.test.tsx` - 33 tests
- `src/test/interactions.test.tsx` - 37 tests
- **Total: 216 tests passing**

---

## OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth client ID (Web application)
3. Add redirect URI: `https://cjtratenqbohkufbyiqb.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase > Authentication > Providers > Google

### GitHub OAuth
1. Go to GitHub > Settings > Developer Settings > OAuth Apps
2. Add callback URL: `https://cjtratenqbohkufbyiqb.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret to Supabase > Authentication > Providers > GitHub

### Apple OAuth
1. Set up in Apple Developer Console
2. Add to Supabase > Authentication > Providers > Apple

---

## Git Commits (Recent)

```
ac6f685 docs: Update progress document with add person commit hash
a8888c9 feat(people): Add Person feature with smart progressive form (Feature 2.1)
de6d12f docs: Update progress document with auth commit hash
7c69dd8 feat(auth): Add authentication system (Feature 1.3)
a9d323d feat(supabase): Add Supabase backend setup (Feature 1.2)
ffb312f docs: Update progress document with completed features
7c52ff2 Initial commit: Attune - My Circle of Influence
a2d0bb2 feat(auth): Add OAuth support for Google, GitHub, and Apple
```

---

## Remaining Features

### Phase 2: People Management (COMPLETE)
- [x] Feature 2.2: Person Profile View
- [x] Feature 2.3: Circle Dashboard (People List)
- [x] Feature 2.4: Demo Data & Import System (UI complete, integrations pending)
- [x] Feature 2.5: Connection Web (Person-to-Person Links)

### Phase 3: Talk to Me (Core AI Feature) - COMPLETE
- [x] Feature 3.1: Chat Interface
- [x] Feature 3.2: Voice Input (Web Speech API)
- [x] Feature 3.3: Claude AI Integration
- [x] Feature 3.4: Person Context Injection
- [x] Feature 3.5: Conversation Limits & Credits

### Phase 5: Import & Connections
- [x] Feature 5.1: Demo Data Seeding (28 Mockup contacts)
- [ ] Feature 5.2: Phone Contacts Import (UI ready)
- [ ] Feature 5.3: LinkedIn Import (UI ready)
- [ ] Feature 5.4: Facebook Import (UI ready)
- [ ] Feature 5.5: Google Contacts Import

### Phase 6: Intelligence & Growth
- [x] Feature 6.1: Interaction Logging
- [ ] Feature 6.2: Smart Summaries
- [ ] Feature 6.3: Reminders System

---

## Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint
```

---

## Troubleshooting

### Email confirmation not received
- Go to Supabase > Authentication > Providers > Email
- Turn OFF "Confirm email" for development

### OAuth not working
- Check redirect URI matches exactly in provider settings
- Ensure provider is enabled in Supabase
- Check browser console for errors

### Database errors
- Ensure schema.sql was run in SQL Editor
- Check RLS policies are enabled
- Verify user is authenticated

---

*Last Updated: February 1, 2026*
