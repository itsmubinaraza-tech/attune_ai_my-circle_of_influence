# Attune - Development Plan

> **Version:** 1.0 | **Created:** January 31, 2026
> **Project:** Attune - My Circle of Influence
> **Methodology:** Feature-by-feature with mandatory testing before progression

---

## Development Principles

1. **No feature advancement without testing** - Each feature must pass all tests before moving forward
2. **Test-driven development** - Write tests alongside implementation
3. **Progress tracking** - Document completion in `progress_document.txt`
4. **Incremental commits** - Commit after each feature completion

---

## Phase 1: Foundation & Setup

### Feature 1.1: Project Configuration & Design System
**Priority:** Critical | **Estimated Effort:** Foundation

#### Tasks
- [ ] Configure Tailwind with custom color palette (warm earth tones)
- [ ] Set up CSS variables for emotion gradients
- [ ] Create base typography styles (Inter font)
- [ ] Configure responsive breakpoints (mobile < 768px, tablet, desktop)
- [ ] Set up Framer Motion for animations
- [ ] Create reusable UI components:
  - [ ] Button (primary, secondary, ghost variants)
  - [ ] Card (with emotion border support)
  - [ ] Input (text, search)
  - [ ] Avatar
  - [ ] Badge (for groups)
  - [ ] Modal/Dialog
  - [ ] Toast notifications

#### Testing Plan
```
TEST 1.1.1: Color System
- [ ] Verify all CSS variables are defined and accessible
- [ ] Test color contrast ratios meet WCAG AA (≥ 4.5:1)
- [ ] Verify emotion gradients render correctly

TEST 1.1.2: Typography
- [ ] Inter font loads correctly (with fallbacks)
- [ ] All heading sizes render properly (h1-h6)
- [ ] Body text is minimum 16px
- [ ] Line heights are readable

TEST 1.1.3: Responsive Breakpoints
- [ ] Components render correctly at 320px (small mobile)
- [ ] Components render correctly at 768px (tablet)
- [ ] Components render correctly at 1024px+ (desktop)

TEST 1.1.4: UI Components
- [ ] Each component renders without errors
- [ ] Each component accepts expected props
- [ ] Interactive states work (hover, focus, active)
- [ ] Animations are smooth (60fps)

TEST 1.1.5: Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels present where needed
```

#### Acceptance Criteria
- All UI components render correctly across breakpoints
- Color system matches PRD specification
- All tests pass

---

### Feature 1.2: Supabase Backend Setup
**Priority:** Critical | **Estimated Effort:** Foundation

#### Tasks
- [ ] Create Supabase project
- [ ] Configure environment variables (.env.local)
- [ ] Set up database schema:
  - [ ] `profiles` table
  - [ ] `people` table
  - [ ] `person_connections` table
  - [ ] `interactions` table
  - [ ] `coaching_sessions` table
  - [ ] `user_credits` table
  - [ ] `reminders` table
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up Supabase client in React
- [ ] Create database types (TypeScript)

#### Testing Plan
```
TEST 1.2.1: Database Connection
- [ ] Supabase client connects successfully
- [ ] Environment variables load correctly
- [ ] Connection works in development mode

TEST 1.2.2: Schema Validation
- [ ] All tables created with correct columns
- [ ] Foreign key relationships work
- [ ] Check constraints validate correctly
- [ ] Default values applied

TEST 1.2.3: RLS Policies
- [ ] Unauthenticated users cannot access any data
- [ ] Users can only read their own data
- [ ] Users can only write to their own data
- [ ] Cross-user data access is blocked

TEST 1.2.4: TypeScript Types
- [ ] Types match database schema
- [ ] Types compile without errors
- [ ] Types provide autocomplete in IDE
```

#### Acceptance Criteria
- Database schema matches PRD specification
- RLS policies prevent unauthorized access
- TypeScript types generated and working

---

### Feature 1.3: Authentication System
**Priority:** Critical | **Estimated Effort:** Foundation

#### Tasks
- [ ] Set up Supabase Auth
- [ ] Create authentication pages:
  - [ ] Sign Up page
  - [ ] Sign In page
  - [ ] Password Reset page
- [ ] Implement auth context/provider
- [ ] Create protected route wrapper
- [ ] Handle auth state persistence
- [ ] Create user profile on signup
- [ ] Implement sign out functionality

#### Testing Plan
```
TEST 1.3.1: Sign Up Flow
- [ ] User can create account with email/password
- [ ] Validation errors display for invalid input
- [ ] Password requirements enforced (min 8 chars)
- [ ] Profile created in database after signup
- [ ] User redirected to app after signup

TEST 1.3.2: Sign In Flow
- [ ] User can sign in with valid credentials
- [ ] Error displayed for invalid credentials
- [ ] User redirected to app after signin
- [ ] Auth state persists on page refresh

TEST 1.3.3: Sign Out Flow
- [ ] User can sign out
- [ ] Auth state cleared
- [ ] User redirected to sign in page
- [ ] Protected routes inaccessible after signout

TEST 1.3.4: Password Reset
- [ ] Reset email sends successfully
- [ ] Reset link works correctly
- [ ] New password can be set

TEST 1.3.5: Protected Routes
- [ ] Unauthenticated users redirected to signin
- [ ] Authenticated users can access protected routes
- [ ] Auth loading state handled gracefully
```

#### Acceptance Criteria
- Users can sign up, sign in, and sign out
- Auth state persists across sessions
- Protected routes enforce authentication

---

### Feature 1.4: Responsive Layout Shell
**Priority:** Critical | **Estimated Effort:** Foundation

#### Tasks
- [ ] Create app layout component
- [ ] Implement mobile layout:
  - [ ] Bottom tab navigation (Today, Circle, Reflect, Me)
  - [ ] Content area with safe areas
  - [ ] FAB placeholder (bottom-right)
- [ ] Implement web layout:
  - [ ] Header with logo and navigation
  - [ ] Main content area with max-width
  - [ ] Footer with legal links
- [ ] Implement responsive switching (mobile ↔ web)
- [ ] Add page transition animations

#### Testing Plan
```
TEST 1.4.1: Mobile Layout (< 768px)
- [ ] Bottom tab bar visible and functional
- [ ] All 4 tabs navigate correctly
- [ ] Active tab highlighted
- [ ] Content area fills available space
- [ ] Safe areas respected (notch, home indicator)

TEST 1.4.2: Web Layout (≥ 768px)
- [ ] Header displays logo and navigation
- [ ] Navigation links work correctly
- [ ] Content has comfortable max-width
- [ ] Footer displays at bottom

TEST 1.4.3: Responsive Transition
- [ ] Layout switches smoothly when resizing
- [ ] No layout jump or flash
- [ ] Navigation state preserved across layouts

TEST 1.4.4: Page Transitions
- [ ] Transitions animate smoothly
- [ ] No content flash during navigation
- [ ] Back navigation works correctly
```

#### Acceptance Criteria
- Mobile and web layouts match PRD wireframes
- Navigation works on both layouts
- Smooth responsive transitions

---

## Phase 2: People Management

### Feature 2.1: Add Person (Smart Progressive)
**Priority:** High | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Create "Add Person" button/entry point
- [ ] Build add person form:
  - [ ] Step 1: Name (required) + Group selection (required)
  - [ ] Optional: Photo upload
  - [ ] Optional: Subgroup selection/creation
  - [ ] Optional: Role/title
- [ ] Implement group selection UI (Work, Family, Friends, Acquaintances)
- [ ] Create subgroup management (predefined + custom)
- [ ] Save person to Supabase
- [ ] Show success confirmation
- [ ] Implement form validation

#### Testing Plan
```
TEST 2.1.1: Form Rendering
- [ ] Form opens correctly from entry point
- [ ] All form fields render
- [ ] Group options display correctly (4 groups)
- [ ] Subgroup options load based on group selection

TEST 2.1.2: Validation
- [ ] Name is required - error shown if empty
- [ ] Group is required - error shown if not selected
- [ ] Valid form submits successfully
- [ ] Invalid form shows appropriate errors

TEST 2.1.3: Photo Upload
- [ ] Photo upload button works
- [ ] Preview displays after selection
- [ ] Photo uploads to Supabase storage
- [ ] Photo URL saved to person record

TEST 2.1.4: Database Save
- [ ] Person record created in Supabase
- [ ] All fields saved correctly
- [ ] user_id associated correctly
- [ ] created_at timestamp set

TEST 2.1.5: Success Flow
- [ ] Success message/toast displayed
- [ ] User can add another person
- [ ] User can view added person
```

#### Acceptance Criteria
- Users can add people with minimal friction (name + group)
- Additional details are optional
- Person saved to database correctly

---

### Feature 2.2: Person Profile View
**Priority:** High | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Create person profile page/modal
- [ ] Display basic info card:
  - [ ] Photo (or avatar placeholder)
  - [ ] Name and nickname
  - [ ] Group badge (color-coded)
  - [ ] Subgroup
  - [ ] Role/title
- [ ] Display communication style section (if available)
- [ ] Display relationship notes
- [ ] Display last contact date
- [ ] Display relationship health indicator
- [ ] Add "Talk about [Name]" button
- [ ] Add edit functionality
- [ ] Add archive/delete options

#### Testing Plan
```
TEST 2.2.1: Profile Display
- [ ] Profile loads for valid person ID
- [ ] 404/error for invalid person ID
- [ ] All available fields display correctly
- [ ] Missing fields handled gracefully (no errors)

TEST 2.2.2: Visual Elements
- [ ] Photo displays correctly (or placeholder)
- [ ] Group badge has correct color
- [ ] Relationship health indicator shows correct status
- [ ] Layout responsive (mobile + web)

TEST 2.2.3: Actions
- [ ] "Talk about [Name]" button visible and clickable
- [ ] Edit button opens edit form
- [ ] Archive moves person to archived status
- [ ] Delete prompts confirmation before removal

TEST 2.2.4: Edit Flow
- [ ] Edit form pre-fills with existing data
- [ ] Changes save correctly
- [ ] Cancel discards changes
- [ ] Updated data reflects immediately
```

#### Acceptance Criteria
- Person profile displays all available information
- Edit and actions work correctly
- "Talk about" button ready for integration

---

### Feature 2.3: Circle Dashboard (People List)
**Priority:** High | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Create Circle page
- [ ] Fetch all people for current user
- [ ] Display people grouped by category:
  - [ ] Work section with count
  - [ ] Family section with count
  - [ ] Friends section with count
  - [ ] Acquaintances section with count
- [ ] Create person card component:
  - [ ] Photo/avatar
  - [ ] Name
  - [ ] Subgroup/role
  - [ ] Relationship health indicator
- [ ] Implement group expand/collapse
- [ ] Add search/filter functionality
- [ ] Add "Add Person" FAB or button
- [ ] Handle empty states (no people yet)

#### Testing Plan
```
TEST 2.3.1: Data Loading
- [ ] People load on page mount
- [ ] Loading state displays while fetching
- [ ] Error state displays on failure
- [ ] Empty state displays when no people

TEST 2.3.2: Grouping
- [ ] People sorted into correct groups
- [ ] Group counts are accurate
- [ ] Expand/collapse works for each group
- [ ] Subgroups display within groups

TEST 2.3.3: Person Cards
- [ ] Cards display correct information
- [ ] Cards are clickable (navigate to profile)
- [ ] Health indicators show correct status
- [ ] Cards responsive across breakpoints

TEST 2.3.4: Search/Filter
- [ ] Search filters by name
- [ ] Filter by group works
- [ ] Results update in real-time
- [ ] Clear search shows all people

TEST 2.3.5: Empty States
- [ ] Friendly message when no people
- [ ] CTA to add first person
- [ ] Empty state per group if group is empty
```

#### Acceptance Criteria
- All people display organized by groups
- Search and filter work correctly
- Navigation to profile works

---

### Feature 2.4: Connection Web (Person-to-Person Links)
**Priority:** Medium | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Add "Connections" section to person profile
- [ ] Create "Add Connection" UI:
  - [ ] Search/select other people in circle
  - [ ] Select connection type (knows, works_with, related_to)
- [ ] Save connections to `person_connections` table
- [ ] Display existing connections on profile
- [ ] Make connections bidirectional
- [ ] Remove connection functionality

#### Testing Plan
```
TEST 2.4.1: Add Connection
- [ ] Search finds people in user's circle
- [ ] Cannot connect person to themselves
- [ ] Connection type can be selected
- [ ] Connection saves to database

TEST 2.4.2: Bidirectional Links
- [ ] Connection appears on both person profiles
- [ ] Removing from one side removes from both
- [ ] No duplicate connections created

TEST 2.4.3: Display Connections
- [ ] Connections list shows on profile
- [ ] Can click to navigate to connected person
- [ ] Connection type displays correctly

TEST 2.4.4: Remove Connection
- [ ] Remove button/action works
- [ ] Confirmation before removal
- [ ] Connection removed from both sides
```

#### Acceptance Criteria
- Users can link people who know each other
- Connections are bidirectional
- Connections display on profiles

---

## Phase 3: Talk to Me (Core AI Feature)

### Feature 3.1: Chat Interface
**Priority:** Critical | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Create chat UI component:
  - [ ] Message list (scrollable)
  - [ ] User messages (right-aligned)
  - [ ] AI messages (left-aligned)
  - [ ] Input area at bottom
  - [ ] Send button
- [ ] Create chat overlay/modal
- [ ] Implement FAB button (all screens)
- [ ] Implement message state management
- [ ] Add typing indicator for AI
- [ ] Auto-scroll to latest message
- [ ] Handle long messages (expandable)

#### Testing Plan
```
TEST 3.1.1: Chat UI Rendering
- [ ] Chat overlay opens on FAB click
- [ ] Message list renders correctly
- [ ] Input field accepts text
- [ ] Send button is clickable

TEST 3.1.2: Message Display
- [ ] User messages appear right-aligned
- [ ] AI messages appear left-aligned
- [ ] Messages display in correct order
- [ ] Timestamps display correctly

TEST 3.1.3: Interactions
- [ ] Enter key sends message
- [ ] Send button sends message
- [ ] Input clears after sending
- [ ] Auto-scroll works on new message

TEST 3.1.4: States
- [ ] Loading/typing indicator displays
- [ ] Empty state shows welcome message
- [ ] Error state handles failures gracefully
```

#### Acceptance Criteria
- Chat UI matches design specifications
- Messages display correctly
- Basic send functionality works

---

### Feature 3.2: Voice Input (Web Speech API)
**Priority:** High | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Implement Web Speech API integration
- [ ] Create microphone button in chat input
- [ ] Visual feedback during recording:
  - [ ] Pulsing animation
  - [ ] Recording indicator
  - [ ] Waveform or level meter (optional)
- [ ] Transcribe speech to text
- [ ] Insert transcribed text into input
- [ ] Handle browser compatibility (fallback to text-only)
- [ ] Handle permission denied gracefully
- [ ] Handle no speech detected

#### Testing Plan
```
TEST 3.2.1: Voice Button
- [ ] Microphone button visible in chat input
- [ ] Button clickable and responds
- [ ] Permission prompt appears on first use

TEST 3.2.2: Recording
- [ ] Visual feedback during recording
- [ ] Recording stops on button release/tap
- [ ] Recording stops after silence timeout

TEST 3.2.3: Transcription
- [ ] Speech transcribed to text
- [ ] Text appears in input field
- [ ] Punctuation handled reasonably
- [ ] Multiple sentences work

TEST 3.2.4: Error Handling
- [ ] Permission denied shows helpful message
- [ ] No speech detected handled gracefully
- [ ] Browser not supported shows text fallback
- [ ] Network errors handled

TEST 3.2.5: Fallback
- [ ] Text input always available
- [ ] App works without microphone permission
```

#### Acceptance Criteria
- Voice input works in supported browsers
- Graceful fallback to text-only
- Clear visual feedback during recording

---

### Feature 3.3: Claude AI Integration
**Priority:** Critical | **Estimated Effort:** Core Feature

#### Tasks
- [ ] Create Supabase Edge Function for AI chat
- [ ] Integrate Anthropic Claude API
- [ ] Design system prompt for Attune coach personality
- [ ] Implement conversation context management
- [ ] Handle API errors and rate limits
- [ ] Implement streaming responses (optional)
- [ ] Store conversations in `coaching_sessions` table
- [ ] Implement credit tracking

#### Testing Plan
```
TEST 3.3.1: Edge Function
- [ ] Edge function deploys successfully
- [ ] Function accessible from frontend
- [ ] API key securely stored
- [ ] CORS configured correctly

TEST 3.3.2: AI Responses
- [ ] AI responds to user messages
- [ ] Responses match coach personality
- [ ] Responses are contextually relevant
- [ ] Response time is reasonable (< 10s)

TEST 3.3.3: Context Management
- [ ] Conversation history maintained
- [ ] AI remembers earlier messages
- [ ] Context doesn't exceed token limits

TEST 3.3.4: Error Handling
- [ ] API errors return friendly message
- [ ] Rate limits handled gracefully
- [ ] Network failures don't crash app

TEST 3.3.5: Session Storage
- [ ] Sessions saved to database
- [ ] Messages stored in correct format
- [ ] Session linked to user and person
```

#### Acceptance Criteria
- AI provides helpful coaching responses
- Conversations persist in database
- Errors handled gracefully

---

### Feature 3.4: Person Context Injection
**Priority:** High | **Estimated Effort:** Core Feature

#### Tasks
- [ ] When chat starts, prompt for person selection
- [ ] Fetch person profile data
- [ ] Inject person context into AI system prompt:
  - [ ] Name and relationship
  - [ ] Communication style
  - [ ] Motivations and values
  - [ ] Past interaction history
- [ ] Show person context in chat header
- [ ] Allow switching person mid-conversation
- [ ] Quick-access from person profile ("Talk about [Name]")

#### Testing Plan
```
TEST 3.4.1: Person Selection
- [ ] "Who do you want to talk about?" prompt appears
- [ ] Recent people shown for quick select
- [ ] Search finds people by name
- [ ] Selection updates chat context

TEST 3.4.2: Context Injection
- [ ] Person data included in AI prompt
- [ ] AI references person by name
- [ ] AI uses person's communication style
- [ ] AI considers past interactions

TEST 3.4.3: Quick Access
- [ ] "Talk about [Name]" button works from profile
- [ ] Chat opens with person pre-selected
- [ ] Context automatically loaded

TEST 3.4.4: Context Display
- [ ] Selected person shown in chat header
- [ ] Person photo/avatar displayed
- [ ] Can change person if needed
```

#### Acceptance Criteria
- AI coaching is personalized to selected person
- Quick access from profile works
- Context clearly displayed in chat

---

### Feature 3.5: Conversation Limits & Credits
**Priority:** Medium | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Track message count per session
- [ ] Implement soft limit (10 exchanges)
- [ ] Show warning when approaching limit
- [ ] Display remaining credits in UI
- [ ] Implement monthly credit system
- [ ] Reset credits monthly
- [ ] Show upgrade prompt when credits low (post-MVP)

#### Testing Plan
```
TEST 3.5.1: Message Counting
- [ ] Message count increments correctly
- [ ] Count persists across page refresh
- [ ] Count resets for new session

TEST 3.5.2: Soft Limit
- [ ] Warning appears at ~8 exchanges
- [ ] Suggestion to wrap up at 10 exchanges
- [ ] User can continue if needed

TEST 3.5.3: Credit Display
- [ ] Credits shown in chat UI
- [ ] Credits decrement after session
- [ ] Zero credits shows appropriate message

TEST 3.5.4: Credit Reset
- [ ] Credits reset at month boundary
- [ ] Reset date tracked correctly
```

#### Acceptance Criteria
- Users aware of usage limits
- Soft limits don't block users
- Credit system ready for monetization

---

## Phase 4: Visual Polish

### Feature 4.1: Mood Widget (Animo-Inspired)
**Priority:** High | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Create mood widget component
- [ ] Implement emotion data:
  - [ ] Confident, Anxious, Frustrated, Hopeful
  - [ ] Tired, Uncertain, Determined, Excited
- [ ] Design horizontal scroll selector
- [ ] Implement auto-cycling animation (before selection)
- [ ] Add color-coded emotion gradients
- [ ] Apply gradient border on selection
- [ ] Store selected mood in state/context
- [ ] Pass mood to AI for tone calibration

#### Testing Plan
```
TEST 4.1.1: Widget Rendering
- [ ] Widget displays on Today/Home page
- [ ] All 8 emotions present
- [ ] Horizontal scroll works on mobile
- [ ] Scroll/select works on web

TEST 4.1.2: Auto-Cycling
- [ ] Emotions cycle automatically on load
- [ ] Animation is smooth
- [ ] Cycling stops on user interaction

TEST 4.1.3: Selection
- [ ] Tap/click selects emotion
- [ ] Selected emotion highlighted
- [ ] Gradient border applies
- [ ] Selection persists

TEST 4.1.4: Integration
- [ ] Selected mood available in chat context
- [ ] AI tone adjusts based on mood
```

#### Acceptance Criteria
- Mood widget matches Animo-inspired design
- Emotion selection works smoothly
- Mood integrates with AI coaching

---

### Feature 4.2: Relationship Map (Bubble Clusters)
**Priority:** Medium | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Create relationship map component
- [ ] Implement bubble cluster visualization:
  - [ ] Work cluster (blue)
  - [ ] Family cluster (orange)
  - [ ] Friends cluster (purple)
  - [ ] Acquaintances cluster (green)
- [ ] Position user at center
- [ ] Size bubbles by interaction frequency or health
- [ ] Draw connection lines between linked people
- [ ] Implement tap-to-view-profile
- [ ] Add to web dashboard
- [ ] Add to "Me" tab on mobile

#### Testing Plan
```
TEST 4.2.1: Map Rendering
- [ ] Map displays without errors
- [ ] All 4 group clusters visible
- [ ] User positioned at center
- [ ] People appear in correct clusters

TEST 4.2.2: Visual Elements
- [ ] Cluster colors match specification
- [ ] Bubble sizes vary appropriately
- [ ] Connection lines render between linked people
- [ ] Health indicators visible on bubbles

TEST 4.2.3: Interactions
- [ ] Tap on bubble opens profile
- [ ] Map responsive to screen size
- [ ] Performance acceptable with 50+ people

TEST 4.2.4: Empty States
- [ ] Empty groups show placeholder
- [ ] Map graceful with no people
```

#### Acceptance Criteria
- Relationship map visualizes user's circle
- Connections between people visible
- Tap navigation to profiles works

---

### Feature 4.3: Animations & Micro-interactions
**Priority:** Medium | **Estimated Effort:** Polish

#### Tasks
- [ ] Implement page transitions (Framer Motion)
- [ ] Add card hover/press states
- [ ] Add button press animations
- [ ] Add loading skeletons
- [ ] Add success/error toast animations
- [ ] Add FAB pulse animation
- [ ] Add emotion gradient transitions
- [ ] Ensure 60fps performance

#### Testing Plan
```
TEST 4.3.1: Page Transitions
- [ ] Transitions smooth between pages
- [ ] No content flash
- [ ] Back navigation animates correctly

TEST 4.3.2: Micro-interactions
- [ ] Buttons respond to press
- [ ] Cards have hover states (web)
- [ ] Inputs have focus states

TEST 4.3.3: Loading States
- [ ] Skeletons display during load
- [ ] Skeletons match content layout
- [ ] Smooth transition to content

TEST 4.3.4: Performance
- [ ] Animations run at 60fps
- [ ] No jank or stutter
- [ ] Performance acceptable on mid-range devices
```

#### Acceptance Criteria
- App feels smooth and polished
- All animations at 60fps
- Loading states prevent layout shift

---

## Phase 5: Import & Connections

### Feature 5.1: Manual Add Person (Enhanced)
**Priority:** High | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Enhance add person form with all fields:
  - [ ] Contact info (email, phone, LinkedIn)
  - [ ] Communication style quick assessment
  - [ ] Motivations, values, goals (tags/chips)
  - [ ] Relationship notes
  - [ ] Connection selection ("Who do they know?")
- [ ] Implement smart progressive reveal
- [ ] AI-suggested fields based on group
- [ ] Save all fields to database

#### Testing Plan
```
TEST 5.1.1: Enhanced Form
- [ ] All optional fields available
- [ ] Fields reveal progressively
- [ ] Tag/chip inputs work for multi-value fields

TEST 5.1.2: AI Suggestions
- [ ] Relevant fields suggested based on group
- [ ] Suggestions are helpful, not intrusive

TEST 5.1.3: Connection Selection
- [ ] Can select multiple people as connections
- [ ] Connections saved correctly
```

#### Acceptance Criteria
- Comprehensive person data can be captured
- Form doesn't overwhelm users
- All data saves correctly

---

### Feature 5.2: Google Contacts Import
**Priority:** Medium | **Estimated Effort:** Integration

#### Tasks
- [ ] Set up Google OAuth credentials
- [ ] Implement Google Sign-In for contacts scope
- [ ] Fetch user's Google contacts
- [ ] Map contact data to person schema
- [ ] Display import preview with selection
- [ ] Implement bulk import
- [ ] Smart duplicate detection
- [ ] Group assignment UI

#### Testing Plan
```
TEST 5.2.1: OAuth Flow
- [ ] Google sign-in button works
- [ ] Contacts permission requested
- [ ] Token stored securely

TEST 5.2.2: Contact Fetching
- [ ] Contacts retrieved successfully
- [ ] Data mapped correctly (name, email, phone, photo)
- [ ] Handles contacts without all fields

TEST 5.2.3: Import Preview
- [ ] Contacts displayed for selection
- [ ] Can select/deselect individuals
- [ ] Can select all / deselect all

TEST 5.2.4: Duplicate Detection
- [ ] Existing people detected
- [ ] Merge option presented
- [ ] User can skip duplicates

TEST 5.2.5: Group Assignment
- [ ] Can assign group during import
- [ ] Bulk assignment works
- [ ] Default to Acquaintances option
```

#### Acceptance Criteria
- Contacts import from Google works
- Duplicates handled intelligently
- Easy group assignment

---

### Feature 5.3: LinkedIn Import
**Priority:** Medium | **Estimated Effort:** Integration

#### Tasks
- [ ] Set up LinkedIn OAuth credentials
- [ ] Implement LinkedIn authorization flow
- [ ] Fetch user's LinkedIn connections
- [ ] Map LinkedIn data to person schema
- [ ] Display import preview
- [ ] Implement bulk import
- [ ] Smart duplicate detection
- [ ] Default to Work group

#### Testing Plan
```
TEST 5.3.1: OAuth Flow
- [ ] LinkedIn auth button works
- [ ] Connections permission requested
- [ ] Token handled correctly

TEST 5.3.2: Connection Fetching
- [ ] Connections retrieved successfully
- [ ] Data mapped correctly (name, headline, company, photo)
- [ ] Handles rate limits

TEST 5.3.3: Import Flow
- [ ] Preview displays connections
- [ ] Selection works
- [ ] Duplicate detection works
- [ ] Group assignment works (default: Work)
```

#### Acceptance Criteria
- LinkedIn connections can be imported
- Professional data captured
- Default to Work group

---

## Phase 6: Intelligence & Growth

### Feature 6.1: Interaction Logging
**Priority:** Medium | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Create "Log Interaction" UI
- [ ] Form fields:
  - [ ] Person selection
  - [ ] Date of interaction
  - [ ] Context/description
  - [ ] Outcome (successful, partial, unsuccessful)
  - [ ] What worked
  - [ ] What didn't
  - [ ] Emotional state before/after
- [ ] Save to `interactions` table
- [ ] Update person's `last_contact` date
- [ ] Update `relationship_health` based on interactions

#### Testing Plan
```
TEST 6.1.1: Log Form
- [ ] Form accessible from profile and chat
- [ ] All fields work correctly
- [ ] Date picker works

TEST 6.1.2: Data Saving
- [ ] Interaction saved to database
- [ ] Person's last_contact updated
- [ ] Relationship health recalculated

TEST 6.1.3: History Display
- [ ] Past interactions visible on profile
- [ ] Interactions sorted by date
- [ ] Can view interaction details
```

#### Acceptance Criteria
- Users can log interactions
- Interaction data informs AI coaching
- Relationship health updates automatically

---

### Feature 6.2: Smart Summaries
**Priority:** Low | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Create AI summarization Edge Function
- [ ] Generate weekly summaries:
  - [ ] Sessions count and topics
  - [ ] Patterns identified
  - [ ] Growth insights
- [ ] Generate per-person summaries
- [ ] Display summaries on Reflect page
- [ ] Display on person profile

#### Testing Plan
```
TEST 6.2.1: Summary Generation
- [ ] Summaries generated without errors
- [ ] Content is relevant and helpful
- [ ] Summaries update weekly

TEST 6.2.2: Display
- [ ] Summaries display on Reflect page
- [ ] Per-person summaries on profiles
- [ ] Formatting is readable
```

#### Acceptance Criteria
- AI generates helpful summaries
- Summaries provide growth insights
- Users find value in summaries

---

### Feature 6.3: Reminders System
**Priority:** Low | **Estimated Effort:** Enhancement

#### Tasks
- [ ] Create reminder data model
- [ ] Implement user-set reminders:
  - [ ] "Remind me to check in with X"
  - [ ] Date/time picker
- [ ] Implement smart nudges:
  - [ ] Time since last contact
  - [ ] Declining relationship health
  - [ ] Upcoming key dates
- [ ] Display reminders in app
- [ ] Implement weekly digest email (Supabase Edge Function + email service)

#### Testing Plan
```
TEST 6.3.1: User-Set Reminders
- [ ] Can create reminder for any person
- [ ] Date/time selection works
- [ ] Reminder appears at correct time

TEST 6.3.2: Smart Nudges
- [ ] Nudges generated based on criteria
- [ ] Nudges are actionable
- [ ] Nudges can be dismissed

TEST 6.3.3: Weekly Digest
- [ ] Email sends on schedule
- [ ] Content is accurate
- [ ] Unsubscribe works
```

#### Acceptance Criteria
- Users can set reminders
- Smart nudges help maintain relationships
- Weekly digest provides value

---

## Testing Strategy

### Unit Tests
- Component rendering tests (React Testing Library)
- Utility function tests (Vitest)
- Hook tests

### Integration Tests
- User flows (sign up, add person, start chat)
- Database operations
- API calls

### Manual Testing Checklist
Each feature requires manual testing on:
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (Android)
- [ ] Safari (iOS)

### Accessibility Testing
- Keyboard navigation
- Screen reader testing
- Color contrast verification

---

## Definition of Done

A feature is considered DONE when:
1. All tasks completed
2. All tests pass (unit, integration, manual)
3. Code reviewed (if applicable)
4. Documented in progress_document.txt
5. No known bugs
6. Accessible (WCAG AA)
7. Responsive (mobile + web)
8. Performance acceptable

---

## Progress Tracking

Update `progress_document.txt` after each feature with:
- Feature name and version
- Completion date
- Test results (pass/fail)
- Any issues or notes
- Commit hash (if applicable)

---

*Development Plan Version 1.0*
*Ready to begin implementation*
