# Changelog

All notable changes to Attune - My Circle of Influence will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added - Phase 7: Quick Talk (Voice-First)

#### Feature 7.1: Quick Talk Voice Flow
- Quick Talk button on main screen (Index page) for instant voice interaction
- QuickTalkModal component with voice-first conversational flow
- Web Speech API integration:
  - SpeechRecognition for voice input
  - SpeechSynthesis for text-to-speech responses
- Multi-step conversation flow:
  - Greeting: App speaks "How are you feeling? Who do you want to talk about?"
  - Listening: Captures user's mood and person mention
  - Confirming: Verifies detected person with user
  - Intent: Asks if user wants guidance or to update on previous conversation
  - Ready: Routes to appropriate destination
- Mood detection from speech (maps synonyms like "anxious"→"nervous", "great"→"happy")
- Person detection with fuzzy name matching against user's circle
- Intent detection: "guidance"/"help"/"advice" vs "update"/"went"/"talked"
- Visual feedback:
  - Animated orbs indicating listening/speaking state
  - Status indicators for each conversation step
  - Pulse animation during voice recording
- Graceful fallbacks when speech APIs unavailable
- Routes to:
  - Chat page with context (guidance intent)
  - Log Interaction modal (update intent)

#### Conversation History Integration
- ConversationHistory component displays past coaching sessions for each person
- Added to PersonProfileModal under "Conversations" section
- Shows session preview, date, and message count
- Click to continue any previous conversation
- Start new conversation button
- All Quick Talk conversations linked to person appear in their profile

### Added - Progressive Web App (PWA) Enhancements

#### PWA Infrastructure
- Web App Manifest (`public/manifest.json`) with full app configuration
- Service Worker (`public/sw.js`) with caching strategies:
  - Static asset caching on install
  - Network-first for API calls
  - Cache-first for static assets
  - Offline fallback page
- Push notification support infrastructure (ready for backend integration)
- Background sync capability for offline actions

#### Enhanced index.html
- Full PWA meta tags (theme-color, apple-mobile-web-app-capable, etc.)
- Apple-specific meta tags and splash screen links
- Microsoft tile configuration
- Service worker registration
- Viewport optimized for native app feel

#### React PWA Components
- `usePWA` hook (`src/hooks/usePWA.ts`):
  - Install prompt detection and handling
  - Online/offline status tracking
  - App update detection
  - Offline action queuing
- `InstallPrompt` component - prompts users to install the app
- `OfflineIndicator` component - shows online/offline status
- `UpdatePrompt` component - notifies users of app updates

#### Mobile App Strategy Documentation
- Comprehensive strategy document (`docs/MOBILE_APP_STRATEGY.md`)
- PWA implementation guide
- React Native with Expo roadmap
- Shared code architecture between web and mobile
- Native feature implementation guides (contacts, notifications, biometrics)
- App store submission checklist

### Added - Service Offering & Pricing Model Documentation
- Comprehensive pricing strategy document (`docs/PRICING_MODEL.md`)
- Four-tier subscription model: Free, Starter ($4.99), Growth ($9.99), Premium ($19.99)
- Credit pack pay-as-you-go options
- Token cost analysis and margin calculations
- Stripe integration roadmap
- Database schema updates for subscriptions
- Competitive analysis

### Enhanced - AI Coaching System with Expert Perspectives

#### Structured Response Format
- **WHAT TO SAY**: Specific phrases, conversation starters, follow-up questions
- **HOW TO SAY IT**: Tone of voice, body language, pacing guidance
- **WHAT TO EXPECT**: Likely responses, handling resistance, signs of success
- **THREE EXPERT PERSPECTIVES**: AI selects 3 most relevant from 10 experts
- **YOUR NEXT STEP**: Clear immediate action within 24-48 hours

#### 10 Thought Leaders Integrated
1. **Brené Brown** - Vulnerability, courage, shame resilience, wholehearted living
2. **Adam Grant** - Giving, reciprocity, networking, five-minute favors
3. **Simon Sinek** - Start with why, trust, infinite mindset, belonging
4. **Liz Ryan** - Human workplace, authenticity, career ownership
5. **Marshall Goldsmith** - Behavioral change, feedforward, gratitude
6. **Josh Bersin** - Team dynamics, belonging, inclusive leadership
7. **Kim Scott** - Radical Candor, feedback, care personally + challenge directly
8. **Roberta Matuson** - Talent retention, mentorship, reputation as currency
9. **David Green** - Relationship patterns, network analysis, evidence-based
10. **Lily Zheng** - DEI, inclusive communication, allyship, psychological safety

#### Expert Selection by Relationship Type
- **Work**: Kim Scott, Liz Ryan, Marshall Goldsmith, Adam Grant, Roberta Matuson, Josh Bersin
- **Family**: Brené Brown, Simon Sinek, Kim Scott, Marshall Goldsmith
- **Friends**: Brené Brown, Adam Grant, Simon Sinek, David Green
- **Acquaintances**: Adam Grant, Liz Ryan, Lily Zheng, David Green

### Fixed - Mobile Layout Optimization
- Main flow (Mood, Person, Outcome, Let's Connect, Quick Talk) now fits in mobile viewport
- Dashboard widgets appear below the fold, accessible by scrolling
- Reduced padding on mobile for MoodSelector, PersonSearch, OutcomeSelector components
- Added visual separator (border) between main flow and scrollable dashboard
- Optimized button spacing and touch targets for mobile devices
- Tighter gaps between widgets on small screens

### Added - Phase 5: Import Integrations (Features 5.2-5.5)

#### Feature 5.2: Phone Contacts Import
- Contact Picker API integration for mobile devices
- CSV upload fallback for desktop
- Instructions for exporting phone contacts

#### Feature 5.3: LinkedIn Import
- LinkedIn connections CSV file import
- Step-by-step instructions for exporting from LinkedIn
- Field mapping for First Name, Last Name, Email, Company, Position

#### Feature 5.4: Facebook Import
- Facebook friends import via data export
- Instructions for downloading Facebook data
- JSON and CSV format support

#### Feature 5.5: Google Contacts Import
- Google Contacts CSV file import
- Step-by-step instructions for exporting from Google
- Field mapping for Name, Email, Phone, Organization, Title

#### Import Infrastructure
- Import service (`src/services/import.ts`) with CSV parsing
- ImportContactsModal component with multi-step wizard:
  - Step 1: Platform-specific instructions
  - Step 2: File upload with drag & drop
  - Step 3: Contact preview and selection
  - Step 4: Import progress
  - Step 5: Results summary
- Automatic group assignment based on source:
  - LinkedIn → Work
  - Facebook → Friends
  - With company → Work
  - Generic → Acquaintances
- VCard export generation
- 37 tests for import feature
- **Total tests: 278 passing**

### Added - Phase 6: Intelligence & Growth

#### Feature 6.1: Interaction Logging
- Interactions service (`src/services/interactions.ts`) with full CRUD operations
- React Query hooks (`src/hooks/useInteractions.ts`) for data fetching
- LogInteractionModal component with 3-step wizard:
  - Step 1: Type selection (call, video, meeting, message, email, social, event, other) and date
  - Step 2: Outcome selection (successful, partial, unsuccessful) and mood tracking (before/after)
  - Step 3: Reflection notes (what worked, what could improve, additional notes)
- InteractionHistory component for viewing past interactions with a person
- Automatic relationship health updates based on interaction outcomes:
  - Successful: +10 points
  - Partial: +3 points
  - Unsuccessful: -5 points
- Interaction statistics (total, successful count, average per month)
- PersonProfileModal updated with Interactions section and "Log Interaction" button
- Database trigger auto-updates last_contact when interaction is logged
- 37 tests for interactions feature

#### Feature 6.2: Smart Summaries
- Summaries service (`src/services/summaries.ts`) with relationship analysis:
  - `getRelationshipSummary()` - Individual relationship insights
  - `getCircleInsights()` - Overall circle analytics
  - `generateAISummary()` - AI-powered relationship summaries via Claude
- React Query hooks (`src/hooks/useSummaries.ts`) for data fetching:
  - `useRelationshipSummary()` - Get summary for a person
  - `useCircleInsights()` - Get circle-wide insights
  - `useAISummary()` - Get AI-generated summary
- RelationshipSummaryCard component:
  - Health score with trend indicator (improving/stable/declining)
  - Stats grid (days since contact, total interactions, success rate)
  - Mood pattern analysis
  - Strengths and areas to improve badges
  - Suggested actions list
  - AI-powered insights button (uses Claude via edge function)
  - Compact mode for inline display
- CircleInsightsWidget component:
  - Overview stats (total people, interactions, average health)
  - Health distribution bar (healthy/moderate/needs attention)
  - Group breakdown visualization
  - Most connected people list
  - People needing attention list
  - Weekly activity chart
  - Weekly trend indicator
  - Compact mode for dashboard
- PersonProfileModal now shows RelationshipSummaryCard instead of basic health bar
- Index page now shows CircleInsightsWidget in the dashboard
- 25 tests for summaries feature

#### Feature 6.3: Reminders System
- Reminders service (`src/services/reminders.ts`) with full CRUD operations:
  - `createReminder()` - Create one-time, recurring, or smart nudge reminders
  - `getReminders()` - Get all reminders with optional status filter
  - `getUpcomingReminders()` - Get reminders for next 7 days
  - `getOverdueReminders()` - Get past due reminders
  - `completeReminder()` - Mark as complete, auto-creates next occurrence for recurring
  - `snoozeReminder()` - Snooze for specified duration
  - `dismissReminder()` - Dismiss without completing
  - `calculateNextOccurrence()` - Calculate next date for recurring reminders
  - `generateSmartNudges()` - AI-powered nudge suggestions based on contact frequency
- React Query hooks (`src/hooks/useReminders.ts`):
  - `useReminders()` - Get all reminders
  - `useUpcomingReminders()` - Get upcoming reminders
  - `useOverdueReminders()` - Get overdue reminders
  - `usePersonReminders()` - Get reminders for a person
  - `useReminderStats()` - Get reminder statistics
  - `useSmartNudges()` - Get smart nudge suggestions
  - `useCreateReminder()` - Create reminder mutation
  - `useCompleteReminder()` - Complete reminder mutation
  - `useSnoozeReminder()` - Snooze reminder mutation
  - `useDismissReminder()` - Dismiss reminder mutation
- CreateReminderModal component:
  - Step 1: Person selection with search
  - Step 2: Reminder details (type, title, date, frequency)
  - One-time and recurring reminder types
  - Frequency options: daily, weekly, biweekly, monthly, quarterly
- RemindersWidget component:
  - Full and compact display modes
  - Overdue reminders section with warning styling
  - Upcoming reminders section
  - Statistics display (pending, completed, overdue, completion rate)
  - Complete, snooze (1hr, 24hr, 1wk), and dismiss actions
  - Visual indicators for recurring and smart nudge reminders
- Smart Nudge System:
  - Configurable thresholds per group (work: 14d, family: 7d, friends: 14d, acquaintances: 30d)
  - AI-generated suggested actions based on relationship type
  - Automatic nudge creation based on last contact
- Database types updated for enhanced reminder schema
- 30 tests for reminders feature
- **Total tests: 308 passing**

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
| interactions.test.tsx | 37 |
| import.test.tsx | 37 |
| summaries.test.tsx | 25 |
| reminders.test.tsx | 30 |
| **Total** | **308** |
