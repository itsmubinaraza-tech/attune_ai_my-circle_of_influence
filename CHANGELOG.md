# Changelog

All notable changes to Attune - My Circle of Influence will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Fixed - UI/UX Improvements
- PersonSearch component now shows selected person as a chip inside the search box (not in a separate box below)
- Added support for "acquaintances" group in PersonSearch with User icon and yellow color scheme
- Added default fallback colors for undefined groups to prevent crashes
- Replaced Lovable favicon with new Attune-branded SVG favicon (purple-pink gradient with leaf/connection symbol)

### Added - Phase 3: Talk to Me (Core AI Feature)

#### Feature 3.1: Chat Interface
- Chat page (`/chat`) with full conversation UI
- ChatInterface component with message bubbles and animations
- Message input with Enter to send, Shift+Enter for newlines
- Conversation history sidebar with session management
- Context-aware empty state with suggestion prompts
- Session persistence via Supabase coaching_sessions table
- Navigation links in header (Today, Circle, Talk)
- "Let's Connect" button flows to chat with context (person, mood, outcome)

#### Feature 3.2: Voice Input (Web Speech API)
- Voice input button with Web Speech API integration
- Real-time speech-to-text transcription
- Visual feedback during listening (pulse animation)
- Graceful fallback when speech recognition unavailable

#### Feature 3.3: Claude AI Integration
- Supabase Edge Function (`supabase/functions/chat/index.ts`) for secure API calls
- AI service (`src/services/ai.ts`) for frontend integration
- Context-aware system prompts with person, mood, and outcome injection
- Graceful fallback to local responses when API unavailable
- Token usage tracking in responses
- Claude claude-sonnet-4-20250514 model for high-quality coaching responses

#### Feature 3.4: Person Context Injection
- PersonContext builder from database Person records
- Dynamic system prompt generation with relationship details
- Mood and outcome goal integration into AI prompts
- Context bar displays current conversation context

#### Feature 3.5: Conversation Limits & Credits
- Credits service (`src/services/credits.ts`) for usage tracking
- Monthly credit system (50 credits/month default)
- Automatic monthly reset on first of each month
- CreditsDisplay component (compact and full modes)
- Credit deduction per message sent
- Low credits warning (≤10 remaining)
- Empty credits blocking with reset date info
- React Query hooks for credits management

### Added - Feature 2.5: Connection Web
- Connections service (`src/services/connections.ts`) with full CRUD operations
- React Query hooks (`src/hooks/useConnections.ts`) for data fetching
- AddConnectionModal component for creating links between people
- Three connection types: Knows, Works with, Related to
- PersonProfileModal now displays and manages connections
- Circle page header shows total connection count
- People cards show individual connection count indicator
- "Link" button in Circle page header for quick connection creation
- Connection preview before creating
- 23 tests for connections feature

### Added - Interactive Relationship Graph
- New RelationshipGraph component (`src/components/attune/RelationshipGraph.tsx`)
- Force-directed graph layout with physics simulation
- Individual people displayed as nodes with group color coding
- Connection lines (edges) between linked people
- Visual connection type indicators:
  - Knows: gray solid line
  - Works with: indigo dashed line
  - Related to: pink thick line
- Interactive features:
  - Click to select a person
  - Double-click to open person profile
  - Drag nodes to reposition
  - Zoom in/out with controls
  - Pan by dragging background
- Glow effects on hover and selection
- Legends for groups and connection types
- Replaced rigid relationship map on Index page "Your Circle" widget

### Added - Feature 2.4: Demo Data & Import System
- Import dropdown menu with options for Demo Data, Phone, LinkedIn, Facebook
- `seedDemoData()` function to create 28 sample contacts with "Mockup" last names
- `usePeopleWithAutoSeed` hook for automatic demo data seeding on new accounts
- `useSeedDemoData` hook for manual demo data loading
- Click-outside handler for import dropdown

### Changed
- Circle page now uses `usePeopleWithAutoSeed` for auto-seeding
- Index page now uses `usePeopleWithAutoSeed` for auto-seeding
- Empty state in Circle page shows import options (Demo, Phone, LinkedIn, Facebook)
- PersonProfileModal updated to show connections section

---

## [0.3.0] - 2026-02-01

### Added - Feature 2.3: Circle Dashboard
- Dedicated `/circle` page for viewing all people
- Search functionality (by name, email, role, subgroup)
- Filter tabs by group (All, Work, Family, Friends, Acquaintances)
- Sort options (Name, Last Contact, Relationship Health)
- People cards with avatar, role, last contact, health indicator
- Quick actions (email, call) on hover
- Empty state with add person CTA
- Navigation links from Index page (desktop and mobile)
- 23 tests for Circle Dashboard

### Added - Feature 2.2: Person Profile View
- PersonProfileModal component with view/edit modes
- Display all person details (name, group, subgroup, role, email, phone, notes)
- Relationship health indicator with progress bar
- Last contact date display
- Inline editing for all fields
- Group/subgroup selection in edit mode
- Archive and delete functionality with confirmation dialogs
- Double-click to open profile from relationship map
- 17 tests for Person Profile

---

## [0.2.0] - 2026-01-31

### Added - Feature 2.1: Add Person
- AddPersonModal component with smart progressive form
- People service with full CRUD operations
- React Query hooks for data fetching and mutations
- Group selection (Work, Family, Friends, Acquaintances)
- Dynamic subgroup options based on selected group
- 20 tests for People Management

### Added - Feature 1.3: Authentication System
- AuthContext with useAuth hook
- Sign In page with email/password
- Sign Up page with email/password
- Forgot Password page
- OAuth support (Google, GitHub, Apple)
- Protected routes with ProtectedRoute component
- Sign out functionality
- 24 tests for Authentication

---

## [0.1.0] - 2026-01-31

### Added - Feature 1.1: Project Configuration & Design System
- Tailwind CSS with context/mood colors
- 6 dynamic themes via ThemeSelector
- Glassmorphism design system
- 48 Shadcn UI components
- Framer Motion animations
- 20 tests for Design System

### Added - Feature 1.2: Supabase Backend Setup
- Database schema with 7 tables (profiles, people, person_connections, interactions, coaching_sessions, user_credits, reminders)
- Row Level Security (RLS) policies
- TypeScript types in `src/types/database.ts`
- Supabase client configuration
- 18 tests for Supabase integration

### Added - Feature 1.4: Responsive Layout Shell
- Two-column layout (widgets + dashboard)
- Mobile hamburger menu
- Responsive breakpoints

### Added - Phase 4: Visual Polish
- MoodSelector widget with 8 emotions and auto-cycling
- Relationship Map with bubble clusters and SVG edges
- OutcomeSelector widget
- Page transitions and hover/press states
- Floating orb backgrounds

---

## Version History Summary

| Version | Date | Features |
|---------|------|----------|
| 0.3.0 | 2026-02-01 | Circle Dashboard, Person Profile, Demo Data & Import UI |
| 0.2.0 | 2026-01-31 | Add Person, Authentication, OAuth |
| 0.1.0 | 2026-01-31 | Initial setup, Design System, Supabase, Layout |

---

## Test Coverage

| Test Suite | Tests |
|------------|-------|
| design-system.test.tsx | 20 |
| supabase.test.ts | 18 |
| auth.test.tsx | 24 |
| people.test.tsx | 20 |
| person-profile.test.tsx | 17 |
| circle.test.tsx | 23 |
| connections.test.tsx | 23 |
| chat.test.tsx | 33 |
| **Total** | **179** |
