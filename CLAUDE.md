# AttuneAI - Claude Code Project Guide

## Project Overview
AttuneAI is a relationship coaching app that helps users strengthen their personal and professional connections. The app uses AI to provide personalized guidance for communication and relationship building.

**App Name**: AttuneAI (or "Attune")
**Production URL**: https://weattuned.com
**Vercel Dashboard**: Configure domain in Vercel project settings

## Tech Stack

### Web App (PWA)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack React Query
- **Database**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: Claude API via Supabase Edge Functions
- **Hosting**: Vercel

### Mobile App (React Native)
- **Framework**: Expo Router + React Native
- **Styling**: NativeWind (Tailwind for RN)
- **State Management**: TanStack React Query
- **Database**: Supabase (shared with web)
- **Animations**: react-native-reanimated
- **Haptics**: expo-haptics

## Project Structure
```
attuneai/
├── src/                    # Web app source
│   ├── components/         # React components
│   ├── contexts/           # React contexts (AuthContext)
│   ├── hooks/              # Custom hooks (usePeople, useChat, etc.)
│   ├── services/           # API services (people, chat, credits, etc.)
│   ├── types/              # TypeScript types (database.ts)
│   └── lib/                # Utilities (supabase client)
├── mobile/                 # React Native Expo app
│   ├── app/                # Expo Router pages
│   │   ├── (tabs)/         # Tab navigation screens
│   │   ├── (auth)/         # Auth screens
│   │   └── person/         # Person detail modals
│   └── src/                # Mobile source (mirrors web structure)
│       ├── contexts/       # AuthContext for mobile
│       ├── hooks/          # Same hooks adapted for mobile
│       ├── services/       # Same services with path updates
│       ├── types/          # Same types (copy from web)
│       └── lib/            # Supabase client with SecureStore
└── supabase/               # Supabase config & migrations
```

## Database Schema (Key Tables)
- `profiles` - User profiles
- `people` - Contacts in user's circle
- `interactions` - Logged interactions with people
- `coaching_sessions` - AI chat history
- `user_credits` - Monthly credit allocation
- `reminders` - Contact reminders

## Key Commands
```bash
# Web Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint check

# Mobile Development
cd mobile
npm run start            # Start Expo dev server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator

# Supabase
npx supabase start       # Start local Supabase
npx supabase db push     # Push migrations
npx supabase functions serve  # Run edge functions locally
```

## Environment Variables
### Web (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Mobile (mobile/.env)
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow React/React Native best practices
- Use TanStack Query for server state
- Prefer hooks over class components
- Keep components small and focused

### Mobile-Specific
- Use haptic feedback for user actions
- Use LinearGradient for gradient backgrounds
- Use Animated from react-native-reanimated
- Test on both iOS and Android

### Authentication
- Supabase Auth with email/password and Google OAuth
- JWT tokens stored securely (SecureStore on mobile)
- Row Level Security (RLS) for data access
- Google OAuth via expo-auth-session and expo-web-browser

### Credits System
- 50 free credits per month
- 1 credit per AI message
- Credits reset on 1st of each month

---

# OAuth Setup

## Google OAuth - IMPLEMENTED

### Code Implementation (Complete)
- `mobile/src/contexts/AuthContext.tsx` - Added `signInWithGoogle()` function
- `mobile/app/(auth)/sign-in.tsx` - Added Google sign-in button
- `mobile/app/(auth)/sign-up.tsx` - Added Google sign-in button
- Uses `expo-auth-session`, `expo-web-browser`, `expo-crypto`
- Deep link scheme: `attune://auth/callback`

### External Configuration Required

1. **Google Cloud Console** (https://console.cloud.google.com):
   - Create OAuth 2.0 credentials (Web application type)
   - Authorized redirect URI: `https://<PROJECT-REF>.supabase.co/auth/v1/callback`
   - Save Client ID and Client Secret

2. **Supabase Dashboard**:
   - Go to Authentication > Providers > Google
   - Enable Google provider
   - Enter Client ID and Client Secret from Google Cloud
   - Add redirect URLs in URL Configuration:
     - `https://weattuned.com/*`
     - `attune://auth/callback`
     - `exp://192.168.x.x:8081/*` (for Expo dev)

## Apple Sign-In (Future)
- Required if any social login is offered on iOS for App Store
- Bundle ID for iOS: `com.attuneai.app`
- Package name for Android: `com.attuneai.app`

---

# Changelog

## [2026-02-14] Bug Fixes and UX Improvements

### Issue 1: Walkthrough Text Punctuation
- Changed em-dashes to colons/periods for better readability in onboarding steps

### Issue 2: Expert Advice Format
- Changed "NEXT STEP" to "EXPERT ADVICE" in AI response format
- Updated fallback responses with structured 4-part format including expert quotes

### Issue 3: Terms Modal Error Handling
- Added toast notification when consent recording fails
- Modal now closes even on error, allowing user to continue

### Issue 4: Console Errors Fixed
- Added `x-user-token` to CORS allowed headers in Edge Function
- Skip demo data seeding for unauthenticated users (prevents 401 errors)

### Issue 5 & 6: Anonymous Person Selection
- Added `mockPerson` prop to PersonProfileModal for demo data viewing
- Anonymous users can now view demo contact profiles in view-only mode
- Added sign-up prompt in view-only modal

### Issue 7: Voice Recording Improvements
- Set `continuous = true` for speech recognition (records through pauses)
- Voice input now appends to existing text instead of replacing
- Added manual stop tracking to prevent auto-restart on user stop

### Files Modified
| File | Changes |
|------|---------|
| `src/contexts/OnboardingContext.tsx` | Updated walkthrough text punctuation |
| `src/services/ai.ts` | Updated fallback responses with 4-part EXPERT ADVICE format |
| `src/components/legal/ConsentModal.tsx` | Added toast import, improved error handling |
| `supabase/functions/chat/index.ts` | Added x-user-token CORS header, changed NEXT STEP to EXPERT ADVICE |
| `src/hooks/usePeople.ts` | Added auth check before demo seeding |
| `src/components/attune/PersonProfileModal.tsx` | Added mockPerson prop, view-only mode, sign-up prompt |
| `src/pages/Index.tsx` | Pass mock person data to modal for demo contacts |
| `src/components/attune/QuickTalkModal.tsx` | Continuous voice recording, manual stop tracking |
| `src/components/attune/ChatInterface.tsx` | Continuous voice recording, append to input |

---

## [2026-02-09] Google OAuth Implementation

### Mobile Google Sign-In - IMPLEMENTED
- [x] Install OAuth packages: `expo-auth-session`, `expo-web-browser`, `expo-crypto`
- [x] Update `AuthContext.tsx` with `signInWithGoogle()` function
- [x] Add Google sign-in button to `sign-in.tsx`
- [x] Add Google sign-in button to `sign-up.tsx`
- [x] Add Google logo SVG component
- [x] Add `expo-web-browser` plugin to `app.json`
- [x] Update documentation in CLAUDE.md

### Files Modified
| File | Changes |
|------|---------|
| `mobile/src/contexts/AuthContext.tsx` | Added signInWithGoogle, WebBrowser imports |
| `mobile/app/(auth)/sign-in.tsx` | Added Google button with logo |
| `mobile/app/(auth)/sign-up.tsx` | Added Google button with logo |
| `mobile/app.json` | Added expo-web-browser plugin |
| `mobile/package.json` | Added OAuth dependencies |

### Pending External Setup
- [ ] Create Google Cloud OAuth credentials
- [ ] Configure Supabase Google provider with credentials
- [ ] Add redirect URLs in Supabase

---

## [2026-02-08] MVP Enhancement - UX, Onboarding & Core Features

### Phase 1: Landing Page & Anonymous Experience - COMPLETED
- [x] Remove auth wall from Index page - anonymous users can access
- [x] Create `useAnonymousCredits` hook for tracking 10 free messages
- [x] Create `HeroSection` component with scrolling headline animation
- [x] Create onboarding walkthrough system:
  - `useOnboarding` hook for state management
  - `WalkthroughOverlay` component
  - `WalkthroughStep` component with highlight rings
- [x] Add `UpgradePrompt` modal for when anonymous limit reached
- [x] Update header with login buttons for anonymous users
- [x] Update mobile menu for anonymous users
- [x] Add data-onboarding attributes to key UI elements

### Phase 2: Bug Fixes - COMPLETED
- [x] Fix Claude API fallback issue:
  - Enhanced error handling with `ChatError` class and error types
  - Added retry logic with exponential backoff in `ai.ts`
  - Added retry logic in Supabase edge function `chat/index.ts`
  - Return specific error codes for different failure types
- [x] Slow down Circle animations:
  - Changed float-orb animation from 8s to 15s
  - Changed floating-orb-delayed from 10s to 20s
  - Reduced movement range from 20px to 10px
  - Added `prefers-reduced-motion` media query support

### Phase 3: Chat History Per Person - COMPLETED
- [x] Add `useSessionsForPerson` hook (already existed in useChat.ts)
- [x] Update Chat.tsx to filter history by selected person
- [x] Auto-load recent conversation when person is selected
- [x] Improved history sidebar with person indicator
- [x] Show "Conversations with [Name]" when person filtered

### Phase 4: Feedback Loop System - COMPLETED
- [x] Create `FeedbackPrompt` component with rehearse/try-it-out options
- [x] Create `FeedbackFollowUp` component for "How did it go?"
- [x] Create `FeedbackSuccess` component for positive feedback
- [x] Create `useFeedback` hook for tracking pending feedback in localStorage

### Phase 5: Circle Improvements - COMPLETED
- [x] Rename "My Circle" to "Circle of Influence"
- [x] Implement 4 orbital rings in RelationshipGraph:
  - Work (innermost, 70px)
  - Family (115px)
  - Friends (160px)
  - Acquaintances (outermost, 205px)
- [x] Add visual orbital ring paths with dashed lines
- [x] Add ring labels

### Phase 6: Mobile Responsive Design - COMPLETED
- [x] Create `FloatingQuickTalk` component with pulse animation
- [x] Add scroll tracking to show floating mic when main button is off-screen
- [x] Mobile hamburger menu already existed and updated

### Files Created
| File | Purpose |
|------|---------|
| `src/hooks/useAnonymousCredits.ts` | Track anonymous user message usage |
| `src/hooks/useOnboarding.ts` | Onboarding walkthrough state management |
| `src/hooks/useFeedback.ts` | Feedback loop state tracking |
| `src/components/landing/HeroSection.tsx` | Animated hero with scrolling outcomes |
| `src/components/onboarding/WalkthroughOverlay.tsx` | Tutorial overlay container |
| `src/components/onboarding/WalkthroughStep.tsx` | Individual tutorial step |
| `src/components/auth/UpgradePrompt.tsx` | Signup prompt for anonymous limit |
| `src/components/chat/FeedbackPrompt.tsx` | Post-advice feedback prompts |
| `src/components/chat/FloatingQuickTalk.tsx` | Floating mic button for mobile |

### Files Modified
| File | Changes |
|------|---------|
| `src/App.tsx` | Remove ProtectedRoute from Index route |
| `src/pages/Index.tsx` | Hero section, anonymous support, onboarding, floating mic |
| `src/pages/Chat.tsx` | Per-person history filtering, improved sidebar |
| `src/pages/Circle.tsx` | Renamed to "Circle of Influence" |
| `src/components/attune/RelationshipGraph.tsx` | 4 orbital rings layout |
| `src/index.css` | Slower animations, prefers-reduced-motion |
| `src/services/ai.ts` | Better error handling, retry logic, error types |
| `supabase/functions/chat/index.ts` | Retry logic, detailed error responses |

---

## [2026-02-07] Mobile Backend Integration

### Phase 1: Foundation & Authentication - COMPLETED
- [x] Copy database types to mobile (`mobile/src/types/database.ts`)
- [x] Create AuthContext for mobile (`mobile/src/contexts/AuthContext.tsx`)
- [x] Create auth screens (sign-in, sign-up, forgot-password)
- [x] Add auth routing to root layout with automatic redirects

### Phase 2: Services Layer - COMPLETED
- [x] Copy and adapt people service (`mobile/src/services/people.ts`)
- [x] Copy and adapt chat service (`mobile/src/services/chat.ts`)
- [x] Copy and adapt credits service (`mobile/src/services/credits.ts`)
- [x] Copy and adapt interactions service (`mobile/src/services/interactions.ts`)
- [x] Copy and adapt reminders service (`mobile/src/services/reminders.ts`)
- [x] Copy and adapt AI service (`mobile/src/services/ai.ts`)

### Phase 3: Hooks Layer - COMPLETED
- [x] Copy and adapt usePeople hook (`mobile/src/hooks/usePeople.ts`)
- [x] Copy and adapt useChat hook (`mobile/src/hooks/useChat.ts`)
- [x] Copy and adapt useCredits hook (`mobile/src/hooks/useCredits.ts`)
- [x] Copy and adapt useInteractions hook (`mobile/src/hooks/useInteractions.ts`)
- [x] Copy and adapt useReminders hook (`mobile/src/hooks/useReminders.ts`)

### Phase 4: Screen Integration - COMPLETED
- [x] Integrate Home screen with useAuth, useCredits, usePeopleNeedingAttention
- [x] Integrate Circle screen with usePeopleWithAutoSeed, useCreatePerson
- [x] Integrate Chat screen with AI service and credits
- [x] Integrate Profile screen with auth and credits display

### Phase 5: Person Detail - COMPLETED
- [x] Create person/[id] modal screen with full functionality
- [x] View/Edit person details
- [x] Log interactions
- [x] Archive/Delete functionality
- [x] Start chat with person context

---

# Test Results

## Phase 1 Tests
| Test | Status | Notes |
|------|--------|-------|
| Auth flow: Sign up | Ready for testing | Screen created with validation |
| Auth flow: Sign in | Ready for testing | Screen created with error handling |
| Auth flow: Password reset | Ready for testing | Screen with success confirmation |
| Session persistence | Ready for testing | Uses SecureStore adapter |

## Phase 2 Tests
| Test | Status | Notes |
|------|--------|-------|
| People service CRUD | Ready for testing | All methods implemented |
| Chat service operations | Ready for testing | Session management working |
| Credits tracking | Ready for testing | Auto-initialization included |

## Phase 3-5 Tests
| Test | Status | Notes |
|------|--------|-------|
| Circle displays people | Ready for testing | Auto-seeds demo data for new users |
| Chat sends messages | Ready for testing | Uses AI service with fallback |
| Profile shows user info | Ready for testing | Displays credits and user data |
| Person detail modal | Ready for testing | Full CRUD + interactions |

---

# Verification Checklist

Before testing, ensure:
1. Mobile `.env` file has valid Supabase credentials
2. Supabase project has RLS policies enabled
3. Edge function for chat is deployed

## Manual Testing Steps

### Auth Flow
1. Open app → Should redirect to sign-in
2. Tap "Sign Up" → Create account
3. Check email for confirmation
4. Sign in with credentials
5. Should redirect to home tab

### Circle
1. Navigate to Circle tab
2. Should auto-seed demo data on first load (or show empty state)
3. Tap + to add person
4. Tap person to open detail modal
5. Edit person details
6. Archive/Delete works

### Chat
1. Navigate to Chat tab
2. Type message and send
3. Should deduct credit
4. Should receive AI response (or fallback)
5. Credit count updates in header

### Profile
1. Navigate to Profile tab
2. Shows user name and email
3. Credits card shows remaining/total
4. Sign out works and redirects to auth
