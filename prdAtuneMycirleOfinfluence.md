# Attune - My Circle of Influence
## Product Requirements Document

> **Version:** 3.0 | **Date:** January 31, 2026
> **Product Name:** Attune - My Circle of Influence
> **Platform:** Responsive Web App (Mobile + Desktop) - PWA
> **Domain:** attune.ai

---

## 1. Product Vision

### Mission Statement
Attune is an **emotional intelligence companion** that empowers users to build meaningful connections, influence outcomes, and navigate important conversations with intention. The app helps users understand the people in their lives, prepare for engagements, and create lasting impact through strategic communication.

### Core Philosophy
> "Attune helps people **create connection** and **experience joy** in their lives—it is the tool, not the source of joy itself. People should feel **emotionally connected**, **rewarded**, and have a **sense of accomplishment** from their real relationships."

### Value Proposition
- **For Work:** Influence decision-makers, navigate office dynamics, advance your career
- **For Family:** Strengthen bonds, resolve conflicts, express love authentically
- **For Friends:** Deepen connections, support each other, create shared joy
- **For Acquaintances:** Nurture potential connections into meaningful relationships

---

## 2. Target Users

### Primary Personas

#### The Professional Influencer
- **Who:** Managers, team leads, salespeople, entrepreneurs, anyone navigating workplace relationships
- **Pain Points:**
  - Needs to influence stakeholders without formal authority
  - High-stakes conversations (negotiations, reviews, pitches)
  - Managing up, down, and across the organization
- **Goals:** Career advancement, project success, professional respect

#### The Relationship Builder
- **Who:** Individuals focused on personal growth, family harmony, meaningful friendships
- **Pain Points:**
  - Difficult family dynamics
  - Maintaining long-distance relationships
  - Setting boundaries while staying connected
- **Goals:** Deeper connections, conflict resolution, personal fulfillment

### User Success Looks Like
1. Feeling **prepared and confident** before important conversations
2. Understanding others' **perspectives and communication styles**
3. Expressing themselves **authentically** while achieving objectives
4. Building **stronger, more resilient** relationships over time
5. Experiencing **personal growth** and **prosperity** through better connections

### Expected User Base
- **First 6 months:** 100-1,000 users (early adopter community)
- **Target:** Users who value emotional intelligence and intentional relationships

---

## 3. Circle Organization (Information Architecture)

### Group Hierarchy

```
My Circle of Influence
│
├── WORK
│   ├── Team Members
│   │   └── Direct reports, peers, collaborators
│   ├── Managers
│   │   └── Direct manager, skip-level, mentors
│   └── Decision Makers
│       └── Executives, stakeholders, budget holders,
│           key influencers, clients
│
├── FAMILY
│   ├── Immediate Family
│   │   └── Spouse/partner, children, parents, siblings
│   ├── Extended Family
│   │   └── Grandparents, aunts/uncles, cousins
│   └── In-Laws & Blended
│       └── In-laws, step-family, chosen family
│
├── FRIENDS
│   ├── Close Friends
│   │   └── Inner circle, best friends, confidants
│   ├── Social Circle
│   │   └── Regular friends, activity partners
│   └── Community
│       └── Neighbors, club members, hobby groups
│
└── ACQUAINTANCES (New!)
    ├── Professional Prospects
    │   └── People you want to know better professionally
    ├── Social Prospects
    │   └── Potential friends, interesting people you've met
    └── Evaluating
        └── People you're assessing for deeper relationship
```

### Acquaintances Group Philosophy
The **Acquaintances** group serves as a **"potential connections"** category:
- People you're evaluating for deeper relationships
- May graduate to Work, Family, or Friends groups over time
- Lower engagement frequency expectations
- Focus on: learning about them, finding common ground, building initial rapport

### Dynamic Subgroups
Users can create **custom subgroups** within each main group to reflect their unique life structure (e.g., "Project Alpha Team", "Book Club", "College Friends").

### Connection Web (Relationship Mapping)
People in your circle can be **connected to each other**:
- Mark that Person A knows Person B
- Creates a true network map of your relationships
- Helps identify influence paths and shared connections

---

## 4. Person Profile System

### Profile Data Model

```typescript
interface PersonProfile {
  // Basic Information
  id: string;
  name: string;
  nickname?: string;
  photo?: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  group: 'work' | 'family' | 'friends' | 'acquaintances';
  subgroup: string;
  role?: string; // "Senior VP of Engineering", "Older Brother", etc.

  // Communication DNA
  communicationStyle: {
    preferredChannel: 'in-person' | 'phone' | 'text' | 'email' | 'video';
    bestTimeToReach: string;
    responsePattern: 'quick' | 'thoughtful' | 'varies';
    decisionStyle: 'analytical' | 'intuitive' | 'collaborative' | 'directive';
    emotionalTone: 'reserved' | 'expressive' | 'balanced';
    conflictStyle: 'avoidant' | 'confrontational' | 'collaborative' | 'accommodating';
  };

  // What Makes Them Tick
  motivations: string[];      // What drives them
  values: string[];           // What they believe in
  goals: string[];            // What they're working toward
  pressures: string[];        // What stresses them
  triggers: string[];         // What to avoid
  appreciationLanguage: string; // How they like to be recognized

  // Influence Factors (for Work especially)
  influenceProfile?: {
    decisionAuthority: 'final' | 'recommender' | 'influencer' | 'user';
    keyPriorities: string[];
    painPoints: string[];
    successMetrics: string[]; // How they measure success
    politicalAlliances: string[]; // Who they align with
  };

  // Relationship Context
  relationshipNotes: string;
  sharedHistory: string;      // How you met, key moments
  keyDates?: { label: string; date: Date }[];

  // Relationship Status (for sensitive situations)
  relationshipStatus: 'active' | 'complicated' | 'estranged' | 'healing' | 'archived';

  // Connection Web
  connections: string[];      // IDs of other people they know in your circle

  // Interaction Intelligence
  interactionHistory: Interaction[];
  coachingSessions: CoachingSession[];
  lastContact: Date;
  relationshipHealth: 'thriving' | 'stable' | 'needs-attention' | 'strained';

  // Import metadata
  importSource?: 'manual' | 'google-contacts' | 'apple-contacts' | 'linkedin';
  importedAt?: Date;
}
```

### Smart Progressive Profile Creation
Instead of overwhelming users upfront, profiles are built progressively:

1. **Initial Add (Required):** Name + Group only
2. **Smart Prompts:** App prompts for more info based on usage patterns
3. **AI Learning:** As you chat about this person, AI extracts and suggests profile updates
4. **Import Enrichment:** For imported contacts, AI suggests questions to fill in gaps

---

## 5. Core Feature: "Talk to Me" (Quick Coaching Chat)

### Overview
A always-accessible way to quickly discuss interactions with people in your circle—past, present, or upcoming.

### Access Methods

#### 1. Floating Action Button (FAB)
- **Location:** Bottom-right corner on mobile, visible on all screens
- **Design:** Warm, inviting microphone icon with subtle pulse animation
- **Tap behavior:** Opens chat overlay

#### 2. Quick-Access from Person Profile
- **Location:** Button on each person's profile card
- **Label:** "Talk about [Name]"
- **Behavior:** Opens chat with person context pre-loaded

### Interaction Model: Voice-First with Text Fallback

```
┌─────────────────────────────────────────┐
│  Talk to Me                        ✕    │
├─────────────────────────────────────────┤
│                                         │
│  "Who would you like to talk about?"    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎤 Tap to speak or type...     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Recent: Sarah (Manager) • Mom • Jake   │
│                                         │
└─────────────────────────────────────────┘
```

### Voice Processing
- **Technology:** Browser Web Speech API (free, built-in)
- **Fallback:** Text input always available
- **Behavior:** Tap microphone → speak → auto-transcribe → send

### Chat Flow
1. User opens "Talk to Me"
2. Quick name mention or search to identify the person
3. Describe the scenario (voice or text)
4. AI provides contextual coaching based on:
   - Person's profile and communication style
   - Past interaction history
   - Current emotional state (from mood check)

### Conversation Limits
- **Soft limit:** After ~10 exchanges, AI suggests wrapping up
- **Credit display:** Shows remaining coaching credits for the month
- **Upgrade prompt:** When nearing limit, gentle suggestion to upgrade (post-MVP)

### Sample Interaction

**User (voice):** "I need to talk about my meeting with Sarah tomorrow"

**Attune:**
> I see you have Sarah (your manager) in your Work circle. What's the meeting about?

**User:** "I want to ask for more resources for my project"

**Attune:**
> Based on Sarah's profile, she responds well to **data-driven proposals** and appreciates when you've thought through alternatives.
>
> **Suggested approach:**
> - Lead with project impact metrics
> - Present 2-3 options with trade-offs
> - Be prepared for her to ask about timeline implications
>
> Would you like me to help you structure your talking points?

---

## 6. Core Feature: Scenario Coaching (Full Engagement Flow)

### The Engagement Flow

When a user needs deeper preparation, they follow this full flow:

#### Step 1: Select the Person
- Search or browse their circle
- See recent interactions and relationship health at a glance

#### Step 2: Describe the Scenario
- **Prompt:** "What situation are you navigating?"
- Free-form text/voice input with smart suggestions
- Examples: "Asking for a raise", "Discussing holiday plans", "Giving feedback about missed deadline"

#### Step 3: Define Desired Outcome
- **Prompt:** "What outcome do you want?"
- Context-aware suggestions based on group:

| Work Outcomes | Family Outcomes | Friend Outcomes | Acquaintance Outcomes |
|---------------|-----------------|-----------------|----------------------|
| Get buy-in/approval | Strengthen our bond | Reconnect after time apart | Get to know them better |
| Influence a decision | Resolve a conflict | Support them through something | Find common ground |
| Navigate difficult feedback | Set healthy boundaries | Plan something together | Explore collaboration |
| Build an alliance | Express love/appreciation | Have a meaningful conversation | Make a good impression |
| Negotiate terms | Seek understanding | Address tension | Establish rapport |
| Request resources | Share difficult news | Celebrate together | Evaluate fit |

#### Step 4: Emotional Check-In (Animo-Inspired)
- **Design:** Centralized single-emotion display with auto-cycling animations
- **Interaction:** Horizontal scrolling mood selector with color-coded emotions
- **Emotions:** Confident, Anxious, Frustrated, Hopeful, Tired, Uncertain, Determined, Excited
- **Visual:** Selected emotion's color appears as gradient border on the widget
- **Purpose:** Helps AI calibrate its tone and support level

### Coaching Output: The Engagement Guide

Based on the inputs, the AI generates a comprehensive engagement guide:

#### 1. Situation Analysis
- Summary of the dynamic
- Key factors to consider
- What's at stake for both parties

#### 2. Communication Strategy
- **Recommended Approach:** Overall strategy for the conversation
- **Tone of Voice:** Specific guidance (warm but firm, curious and open, direct and confident)
- **Body Language Cues:** Non-verbal communication tips
- **Energy Level:** Calm, enthusiastic, measured, etc.

#### 3. Script Suggestions
- **Opening Lines:** 2-3 ways to start the conversation
- **Key Phrases:** Language to use for main points
- **Transition Statements:** Moving between topics
- **Closing Lines:** How to end positively

#### 4. Response Predictions
- **"They might say..."** - 3-4 likely responses
- **"If they push back..."** - Counter-response strategies
- **"If they're receptive..."** - How to build momentum
- **Red Flags:** Warning signs to watch for

#### 5. Moving Your Interest Forward
- **Immediate Next Steps:** What to do during/after the conversation
- **Follow-Up Strategy:** How to maintain momentum
- **Relationship Building:** How this conversation fits into long-term influence
- **Success Indicators:** How to know if you achieved your outcome

#### 6. Historical Context (if available)
- "Last time you discussed [topic], they responded well to [approach]"
- Patterns from past interactions
- What has worked/not worked before

---

## 7. Core Feature: Visual Relationship Map

### Overview
An interactive bubble cluster visualization showing your entire circle of influence.

### Design: Bubble Clusters by Group

```
        ┌─────────────────────────────────────────────┐
        │                                             │
        │      🔵🔵🔵                 🟠🟠            │
        │    🔵  WORK  🔵           🟠 FAMILY 🟠      │
        │      🔵🔵🔵                 🟠🟠            │
        │                                             │
        │              ⚪ YOU ⚪                       │
        │                                             │
        │      🟣🟣🟣                 🟢🟢            │
        │    🟣 FRIENDS 🟣         🟢 ACQUAINT 🟢    │
        │      🟣🟣🟣                 🟢🟢            │
        │                                             │
        └─────────────────────────────────────────────┘
```

### Visual Elements
- **Bubble Size:** Reflects relationship health or interaction frequency
- **Bubble Color:** Group-coded (Work=Blue, Family=Orange, Friends=Purple, Acquaintances=Green)
- **Connection Lines:** Thin lines between people who know each other
- **Health Indicator:** Subtle border glow (green=thriving, yellow=stable, red=needs attention)

### Interactions
- **View Only:** Static visualization for at-a-glance network overview
- **Tap Bubble:** Opens that person's profile card
- **Tap Group Cluster:** Zooms into that group's people

### When Shown
- **Dashboard widget** (web)
- **"Me" tab** (mobile) - full relationship network view
- **When adding new person** - option to mark who they know

---

## 8. Core Feature: Contact Import & Management

### Import Sources

#### 1. Phone Contacts (Google/Apple)
- **OAuth flow:** Secure permission request
- **What's imported:** Name, phone, email, photo
- **Privacy:** Only imports, never syncs back or accesses without permission

#### 2. LinkedIn Connections
- **OAuth flow:** LinkedIn authorization
- **What's imported:** Name, headline, company, profile photo, connection degree
- **Best for:** Populating Work group and professional Acquaintances

### Import Flow

```
┌─────────────────────────────────────────────────────┐
│  Import Your Connections                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  📱 Phone        │  │  💼 LinkedIn     │        │
│  │  Contacts        │  │  Connections     │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  Or add people manually                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Smart Merge & Duplicate Detection
- **AI Detection:** Identifies potential duplicates by name similarity, shared identifiers
- **User Confirmation:** "Is this the same person?" with merge option
- **Manual Control:** Users always have final say on merges

### Easy Group Assignment

#### During Import
```
┌─────────────────────────────────────────────────────┐
│  Assign to Groups                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  We found 47 contacts to import.                    │
│                                                     │
│  Quick assign by source:                            │
│  • LinkedIn contacts → Work (recommended)           │
│  • Phone contacts → Review individually             │
│                                                     │
│  Or assign all to Acquaintances and sort later      │
│                                                     │
│  [Import to Acquaintances]  [Review Each]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Post-Import Sorting
- Bulk selection and group assignment
- Drag-and-drop between groups (web)
- Swipe to assign (mobile)

### Adding Connections Between People
When adding or editing a person:
- **"Who do they know?"** section
- Search/select other people in your circle
- Creates bidirectional connection shown on relationship map

---

## 9. Responsive Design System

### Design Philosophy
- **Mobile:** Fluid, gesture-friendly, thumb-optimized
- **Web:** Full-width sections with comfortable max-width, dashboard layout
- **Unified:** Same design language, components adapt to screen size

### Mobile Layout (< 768px)

#### Navigation: Bottom Tab Bar + Swipe
```
┌─────────────────────────────┐
│                             │
│         [Content]           │
│                             │
│                             │
│                        🎤   │  ← Talk to Me FAB
│                             │
├─────────────────────────────┤
│  Today │ Circle │ Reflect │ Me │
└─────────────────────────────┘
```

#### Fluid Scaling
- Layouts adjust smoothly with screen width
- Typography scales proportionally
- Touch targets remain 44px+ on all sizes

### Web Layout (≥ 768px)

#### Structure
```
┌──────────────────────────────────────────────────────────────┐
│  🌿 Attune          Today   Circle   Reflect   Me    [Avatar]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────────┐  │
│  │                  │  │                                  │  │
│  │   Mood Widget    │  │     Relationship Map             │  │
│  │   (with emotion  │  │     (Bubble Clusters)            │  │
│  │    color border) │  │                                  │  │
│  │                  │  │                                  │  │
│  └──────────────────┘  └──────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────────┐  │
│  │                  │  │                                  │  │
│  │  Quick Actions   │  │     Recent People / Sessions     │  │
│  │  • Start Chat    │  │                                  │  │
│  │  • Add Person    │  │                                  │  │
│  │                  │  │                                  │  │
│  └──────────────────┘  └──────────────────────────────────┘  │
│                                                              │
│                                              [🎤 Talk to Me] │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Privacy Policy   Terms   © 2026 Attune                      │
└──────────────────────────────────────────────────────────────┘
```

#### Web-Specific Features
- **Dashboard view:** All 4 groups visible at once with relationship maps
- **Multi-column layouts:** Side-by-side widgets
- **Hover states:** Additional context on hover
- **Keyboard navigation:** Full accessibility

### Header (Web)
- **Minimal design:** Logo + primary navigation + user avatar
- **Content:** Today, Circle, Reflect, Me
- **Talk to Me button:** Prominent in header or floating

### Footer (Web)
- **Minimal:** Legal links (Privacy, Terms), copyright
- **No clutter:** Keeps focus on main content

---

## 10. Visual Design System

### Color System: Warm Earth Tones + Emotion Overlays

#### Base Palette (Warm Earth Tones)
```css
:root {
  /* Primary Earth Tones */
  --attune-cream: #FDF6E3;        /* Warm off-white background */
  --attune-sand: #E8DCC8;         /* Secondary background */
  --attune-terracotta: #C4846C;   /* Primary accent */
  --attune-clay: #8B6F5C;         /* Secondary accent */
  --attune-charcoal: #3D3D3D;     /* Text */
  --attune-sage: #7D8B6F;         /* Success/positive */

  /* Group Colors */
  --group-work: #5B8FA8;          /* Professional teal-blue */
  --group-family: #C4846C;        /* Warm terracotta */
  --group-friends: #9B7BB8;       /* Soft purple */
  --group-acquaintances: #7D9B7B; /* Sage green */
}
```

#### Emotion Color Overlays (Animo-Inspired)
Applied as gradient borders on widgets based on user's selected mood:

```css
:root {
  /* Emotion Gradient Colors */
  --emotion-confident: linear-gradient(135deg, #7D9B7B, #5B8B6F);   /* Sage greens */
  --emotion-anxious: linear-gradient(135deg, #9B8B9B, #7B6B8B);     /* Muted lavender */
  --emotion-frustrated: linear-gradient(135deg, #C4846C, #A86B5C);  /* Warm terracotta */
  --emotion-hopeful: linear-gradient(135deg, #D4A87A, #C4986A);     /* Warm gold */
  --emotion-tired: linear-gradient(135deg, #8B8B8B, #6B6B6B);       /* Soft gray */
  --emotion-uncertain: linear-gradient(135deg, #8B9BAB, #6B7B8B);   /* Steel blue */
  --emotion-determined: linear-gradient(135deg, #8B6B5C, #6B4B3C);  /* Deep clay */
  --emotion-excited: linear-gradient(135deg, #C49B6C, #D4AB7C);     /* Bright amber */
}
```

### Mood Widget Design (Animo-Inspired)

```
┌─────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════╗  │ ← Emotion gradient border
│ ║                                               ║  │
│ ║      How are you feeling right now?           ║  │
│ ║                                               ║  │
│ ║            😌                                 ║  │ ← Current emotion (large, centered)
│ ║         Hopeful                               ║  │
│ ║                                               ║  │
│ ║    ← 😰 😤 😌 😴 🤔 💪 😄 →                   ║  │ ← Horizontal scroll selector
│ ║                                               ║  │
│ ╚═══════════════════════════════════════════════╝  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Auto-cycling animation:** Emotions cycle with subtle animation until user selects
- **Color association:** Border gradient updates in real-time as user scrolls
- **Tap to select:** Confirms emotion and sets context for coaching

### Typography
- **Font Family:** Inter (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- **Display:** Inter 600/700 for headings
- **Body:** Inter 400 for body text
- **Minimum size:** 16px for accessibility

### Component Style
- **Border radius:** 12-16px (soft, approachable)
- **Shadows:** Subtle, warm-tinted shadows
- **Spacing:** Generous padding (16-24px)
- **Animations:** Smooth ease-out transitions (200-400ms)

---

## 11. AI Integration

### AI Provider: Claude (Anthropic)
- **Model:** Claude 3.5 Sonnet (balance of quality and cost)
- **Why:** Excellent at nuanced conversation, empathetic responses, coaching tone

### AI Personality: The Attune Coach

#### Personality Blend
The AI adapts its personality based on context:

| Mode | When Used | Tone |
|------|-----------|------|
| **Wise Mentor** | Complex situations, need perspective | Thoughtful, probing questions, psychological insights |
| **Supportive Friend** | User is emotionally vulnerable | Warm, validating, encouraging |
| **Strategic Coach** | High-stakes professional scenarios | Direct, tactical, outcome-focused |

#### AI Guidelines
1. Always acknowledge emotions before strategizing
2. Reference the specific person's known preferences
3. Provide concrete phrases users can actually say
4. Anticipate multiple responses and prepare users
5. Keep advice practical and actionable
6. End with encouragement and clear next steps
7. Never judge—always support growth

#### Safety & Ethics
- **Approach:** Minimal restrictions—users are adults
- **Disclaimers:** Clear note that AI is a tool, not a therapist
- **Harmful content:** Refuse to help with manipulation, deception, or harm
- **Professional referral:** If user expresses serious distress, suggest professional help

### Multi-Language Support
- **Approach:** AI-powered translation via Claude
- **User language preference** stored in profile
- **Dynamic translation** of both UI and coaching responses

---

## 12. Technical Architecture

### Stack
- **Frontend:** React + TypeScript + Vite (existing)
- **Styling:** Tailwind CSS + Framer Motion
- **State:** TanStack Query + React Context
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** Anthropic Claude API via Supabase Edge Functions
- **Voice:** Browser Web Speech API (free)
- **PWA:** Service worker for offline queuing

### Database Schema (Supabase)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'en',
  communication_style JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- People in user's circle
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nickname TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  group_type TEXT NOT NULL CHECK (group_type IN ('work', 'family', 'friends', 'acquaintances')),
  subgroup TEXT,
  role TEXT,
  communication_profile JSONB,
  motivations TEXT[],
  values TEXT[],
  goals TEXT[],
  pressures TEXT[],
  triggers TEXT[],
  relationship_notes TEXT,
  shared_history TEXT,
  relationship_status TEXT DEFAULT 'active' CHECK (relationship_status IN ('active', 'complicated', 'estranged', 'healing', 'archived')),
  import_source TEXT,
  imported_at TIMESTAMPTZ,
  last_contact TIMESTAMPTZ,
  relationship_health TEXT DEFAULT 'stable',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connections between people (relationship web)
CREATE TABLE person_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_a_id UUID REFERENCES people(id) ON DELETE CASCADE,
  person_b_id UUID REFERENCES people(id) ON DELETE CASCADE,
  connection_type TEXT, -- 'knows', 'works_with', 'related_to'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, person_a_id, person_b_id)
);

-- Interaction history
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  context TEXT,
  outcome TEXT CHECK (outcome IN ('successful', 'partial', 'unsuccessful', 'ongoing')),
  what_worked TEXT,
  what_didnt TEXT,
  emotional_state_before TEXT,
  emotional_state_after TEXT,
  ai_coaching_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching sessions (Talk to Me conversations)
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  emotional_state TEXT,
  desired_outcome TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  coaching_summary TEXT,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User credits and subscription (for future monetization)
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  monthly_credits INTEGER DEFAULT 5,
  credits_used INTEGER DEFAULT 0,
  people_limit INTEGER DEFAULT 10,
  reset_at TIMESTAMPTZ,
  subscription_tier TEXT DEFAULT 'free'
);

-- Reminders
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('user_set', 'smart_nudge')),
  message TEXT,
  remind_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Offline Support: Queue Actions
- **View:** Can browse existing profiles and history offline
- **Create/Edit:** Changes queued locally, synced when back online
- **Indicator:** Clear offline status indicator
- **Sync:** Automatic sync with conflict resolution when connection restored

### Security & Privacy (GDPR Compliant)
- Row Level Security (RLS) on all tables
- Data encrypted at rest
- HTTPS only
- User data export (JSON/CSV)
- Account deletion with full data purge
- Clear privacy policy

---

## 13. Notifications & Reminders

### Reminder Types

#### 1. Smart Nudges (AI-Generated)
- Based on time since last contact
- Relationship health declining
- Upcoming key dates (birthdays, anniversaries)
- Example: "You haven't connected with Mom in 3 weeks. How about a quick call?"

#### 2. User-Set Reminders
- Manual "Remind me to check in with X in 2 weeks"
- Post-coaching: "Remind me to follow up after my meeting"

#### 3. Weekly Digest Email
- Summary of relationships needing attention
- Coaching sessions from the week
- Wins to celebrate
- Sent via email (configurable day/time)

### Notification Channels
- **In-app:** Badge counts, notification center
- **Email:** Weekly digest, critical reminders
- **Push (future):** Optional mobile push notifications

---

## 14. History & Insights

### Coaching History Organization

#### 1. Timeline Feed
- Chronological feed of all sessions
- Filterable by person, group, outcome
- Search by keywords

#### 2. Smart Summaries (AI-Generated)
- Weekly/monthly AI summaries of patterns
- "This week you had 5 coaching sessions, mostly about work relationships"
- "You're most successful when approaching conversations with curiosity"
- Growth insights and trends

### Per-Person History
- All coaching sessions for that person
- Interaction timeline
- What's worked and what hasn't
- AI-identified patterns

---

## 15. Sensitive Relationship Handling

### Relationship Status Tags
When relationships are complex, users can mark status:
- **Active:** Normal, healthy relationship
- **Complicated:** Tension or ongoing issues
- **Estranged:** Little to no contact, difficult history
- **Healing:** Working on rebuilding
- **Archived:** Remove from active circle without deleting

### Archive Feature
- Removes person from main views
- Preserves all history and data
- Can restore anytime
- Useful for: breakups, fallouts, job changes

### AI Context Awareness
- AI detects sensitivity from conversation context and notes
- Adjusts tone and recommendations accordingly
- More supportive, less tactical for strained relationships

---

## 16. Monetization Strategy

### MVP: Completely Free
- No limits during initial launch
- Focus on product-market fit and user feedback

### Post-MVP: Freemium Model

#### Free Tier
- **5 coaching sessions per month**
- **10 people max** in circle
- Basic features (profiles, manual add, basic coaching)
- Ads-free (no ads ever)

#### Premium Tier (Future)
- **Unlimited** coaching sessions
- **Unlimited** people
- Advanced features: imports, relationship map, analytics
- Priority AI responses
- **Pricing:** TBD (~$9.99/month or $79.99/year)

### Credit Display
- Show remaining credits in UI
- Gentle upgrade prompts when nearing limit
- Never block access aggressively

---

## 17. Accessibility (a11y)

### Requirements
- **WCAG 2.1 AA compliance**
- Screen reader support (ARIA labels)
- Keyboard navigation throughout
- Color contrast ratios ≥ 4.5:1
- Focus indicators visible
- Touch targets ≥ 44x44px
- Reduced motion option

### Testing
- Test with VoiceOver (iOS) and TalkBack (Android)
- Keyboard-only navigation testing
- Color blindness simulation testing

---

## 18. Performance Requirements

### Goals
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Smooth animations:** 60fps
- **No loading spinners** for common actions (optimistic UI)

### Strategies
- Code splitting and lazy loading
- Image optimization (WebP, lazy load)
- Service worker caching
- Optimistic UI updates
- Skeleton loading states

---

## 19. MVP Feature Prioritization

### Phase 1: Foundation
- [x] Project setup (React + Vite + Tailwind) ✓ Already done
- [ ] Supabase setup (auth, database, RLS)
- [ ] User authentication (email/password)
- [ ] Basic responsive layout (mobile + web)
- [ ] Design system implementation (colors, typography, components)

### Phase 2: Core People Management
- [ ] Add person (smart progressive)
- [ ] Person profile view
- [ ] Group organization (Work, Family, Friends, Acquaintances)
- [ ] Circle dashboard with group cards

### Phase 3: Talk to Me (Core AI Feature)
- [ ] Chat interface (text-based)
- [ ] Voice input (Web Speech API)
- [ ] Claude AI integration
- [ ] Person context injection
- [ ] FAB and profile quick-access

### Phase 4: Visual Polish
- [ ] Mood widget (Animo-inspired)
- [ ] Emotion color gradients
- [ ] Relationship map (bubble clusters)
- [ ] Smooth animations (Framer Motion)

### Phase 5: Import & Connections
- [ ] Google Contacts import
- [ ] LinkedIn import
- [ ] Smart duplicate detection
- [ ] Connection web (person-to-person links)

### Phase 6: Intelligence & Growth
- [ ] Interaction logging
- [ ] Post-interaction reflections
- [ ] Smart summaries
- [ ] Reminders (user-set + smart nudges)
- [ ] Weekly digest email

---

## 20. Sharing & Privacy

### Privacy-First Approach
- **No social features** that expose user data
- **No sharing** of personal relationship information
- Completely private experience

### Allowed Sharing
- **Invite friends to app:** Referral link to download/use Attune (separate accounts)
- **Share coaching tips:** Anonymized, generic tips without personal details
- **Export personal insights:** Download own data as PDF for personal use or therapy

---

## 21. Success Metrics

### Engagement Metrics
- Daily/Weekly Active Users
- Coaching sessions per user per week
- People profiles created per user
- "Talk to Me" usage frequency
- Session duration

### Outcome Metrics
- Self-reported engagement success rate
- Relationship health improvements over time
- User satisfaction scores (in-app feedback)

### Retention Metrics
- Day 1, Day 7, Day 30 retention
- Feature adoption rates
- Churn rate and reasons

### Growth Metrics
- Organic signups
- Referral rate
- App store/web ratings

---

## 22. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI advice feels generic | Deep personalization from profiles; continuous learning from reflections |
| Users feel manipulative | Frame as "authentic connection"; ethical AI guardrails |
| Privacy concerns | GDPR compliance; encryption; user data control; clear policies |
| Low engagement after setup | Smart nudges; celebrate wins; easy reflection flow |
| Dependency on AI | Emphasize tool, not crutch; build user confidence |
| Voice recognition accuracy | Always provide text fallback; clear error messaging |
| Web Speech API limitations | Progressive enhancement; works without voice |

---

## 23. Future Considerations (Post-MVP)

### Potential Features
1. **Calendar Integration** - Meeting prep reminders
2. **Advanced Voice** - Whisper API for better accuracy
3. **Relationship Analytics** - Deep patterns, network analysis
4. **Native Mobile Apps** - iOS/Android via Capacitor
5. **Team/Enterprise Version** - Shared relationship coaching
6. **AI Memory** - Proactive check-ins based on patterns

### Platform Expansion
1. PWA (current) → Native iOS/Android
2. Browser extension for email coaching
3. Desktop companion app

---

## Appendix A: User Stories

### Epic: Circle Management
- As a user, I want to add people to my circle so I can track all my important relationships
- As a user, I want to organize people into groups (Work, Family, Friends, Acquaintances) so I can find them easily
- As a user, I want to import contacts from my phone and LinkedIn so I don't have to add everyone manually
- As a user, I want to mark who knows whom so I can see my relationship network
- As a user, I want to see relationship health at a glance so I know who needs attention

### Epic: Talk to Me
- As a user, I want to quickly chat about someone in my circle so I can get fast coaching
- As a user, I want to use voice input so I can describe scenarios naturally
- As a user, I want contextual coaching based on the person's profile so advice is personalized

### Epic: Scenario Coaching
- As a user, I want to describe a situation I'm facing so I can get comprehensive guidance
- As a user, I want to know what tone to use so I communicate effectively
- As a user, I want script suggestions so I know exactly what to say
- As a user, I want to anticipate responses so I'm not caught off guard

### Epic: Reflection & Growth
- As a user, I want to log how conversations went so I can learn from them
- As a user, I want to see patterns in my communication so I can grow
- As a user, I want reminders to check in with people so I maintain relationships

### Epic: Visual Experience
- As a user, I want a beautiful, calming interface so using the app feels good
- As a user, I want the app to work well on both my phone and computer
- As a user, I want to see my relationship map visually so I understand my network

---

## Appendix B: Glossary

- **Circle of Influence:** All the people in a user's life they want to connect with and influence
- **Engagement:** A planned or upcoming conversation/interaction with someone
- **Coaching Session:** AI-guided preparation for an engagement
- **Talk to Me:** Quick chat feature for fast coaching conversations
- **Reflection:** Post-engagement journaling about what happened
- **Relationship Health:** Assessment of connection strength with a person
- **EQ (Emotional Intelligence):** Ability to understand and manage emotions in relationships
- **Connection Web:** The network of relationships between people in your circle
- **Smart Nudge:** AI-generated reminder to maintain a relationship

---

## Appendix C: Interview Summary

### Decisions Made During Product Interview

| Topic | Decision |
|-------|----------|
| Talk to Me Access | Voice-first + text fallback, FAB + profile quick-access |
| Web Layout | Full-width with max-width, dashboard widgets, header/footer |
| Relationship Map | Bubble clusters by group, view only + click to profile |
| Import Sources | Phone contacts (Google/Apple) + LinkedIn |
| Voice Processing | Browser Web Speech API (free) |
| AI Provider | Claude (Anthropic) |
| Backend | Supabase (PostgreSQL + Auth) |
| Connection Model | Full relationship web (Person A knows Person B) |
| Map Interactions | View only + click to profile |
| Add Person Flow | Smart progressive (start minimal, prompt over time) |
| AI Safety | Low restrictions + disclaimers |
| Languages | AI-powered translation |
| Monetization (MVP) | Completely free |
| Acquaintances Group | Potential connections for deeper relationships |
| Sensitive Topics | Status tags + archive + AI context awareness |
| MVP Priority | Core features polished + visual excellence + AI quality |
| Mood Input | Animo-inspired with emotion color borders |
| History | Smart summaries + timeline feed |
| Sharing | Private app + anonymized tip sharing |
| Scale | 100-1,000 users in first 6 months |
| Duplicates | Smart merge suggestions |
| Offline | Queue actions for sync |
| Chat Limits | Soft limits + upgrade prompts + credits display |
| Reminders | Smart nudges + weekly digest + user-set |
| Free Tier (post-MVP) | 5 sessions/month + 10 people max |
| Web Header | Minimal (logo + nav only) |
| Colors | Warm earth tones + emotion gradient overlays |
| Critical Requirements | GDPR compliance + Accessibility + Performance |

---

*Document Version 3.0 - Comprehensive PRD based on stakeholder interview*
*Ready for development*
