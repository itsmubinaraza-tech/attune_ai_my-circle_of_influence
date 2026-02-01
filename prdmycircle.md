# Attune - Product Requirements Document

> **Version:** 1.0 | **Date:** January 31, 2026  
> **Domain:** attune.ai | **Platform:** Mobile Web (PWA)

---

## 1. Executive Summary

### Vision
Attune is an emotional intelligence companion that helps users build meaningful connections and navigate important conversations with the people who matter most. Unlike generic communication advice, Attune provides hyper-personalized coaching based on your unique relationship history, the specific person you're engaging with, and the outcome you're working toward.

### Core Philosophy
> "The tool helps people create connection and experience joy in their lives—not the source of joy itself."

Attune provides support that feels human, encouragement that understands how you're feeling, and strategic guidance to make positive, lasting impact in your relationships.

### Tagline Options
- "Attune to what matters"
- "Connect with intention"
- "Your emotional intelligence companion"

---

## 2. Target Users

### Primary Personas

#### **The Professional Influencer**
- Managers, leaders, salespeople who need to influence and persuade
- High-stakes conversations: negotiations, performance reviews, client pitches
- Needs: Strategic advantage, script suggestions, response predictions

#### **The Personal Growth Seeker**
- Individuals working on family dynamics, friendships, romantic relationships
- Challenging conversations: setting boundaries, expressing needs, healing rifts
- Needs: Emotional support, empathetic guidance, relationship repair strategies

### User Goals
1. Feel prepared and confident before important conversations
2. Understand others' perspectives and communication styles
3. Express themselves authentically while achieving their objectives
4. Build stronger, more resilient relationships over time
5. Track growth in emotional intelligence and relationship health

---

## 3. Information Architecture

### People Hierarchy
```
└── My Circle
    ├── Work
    │   ├── Team Members
    │   ├── Managers
    │   └── Decision Makers / Stakeholders
    ├── Family
    │   ├── Immediate Family
    │   ├── Extended Family
    │   └── In-Laws
    └── Friends
        ├── Close Friends
        ├── Acquaintances
        └── Community (neighbors, clubs, etc.)
```

### Person Profile Data Model
```typescript
interface Person {
  id: string;
  name: string;
  photo?: string;
  group: 'work' | 'family' | 'friends';
  subgroup: string;
  
  // Communication Profile
  communicationStyle: {
    preferredChannel: 'in-person' | 'phone' | 'text' | 'email' | 'video';
    responsePattern: 'quick' | 'thoughtful' | 'varies';
    decisionStyle: 'analytical' | 'intuitive' | 'collaborative' | 'directive';
    emotionalTone: 'reserved' | 'expressive' | 'balanced';
  };
  
  // What drives them
  motivations: string[];
  values: string[];
  goals: string[];
  pressures: string[];
  
  // Relationship context
  relationshipNotes: string;
  keyDates?: { label: string; date: Date }[];
  
  // Historical data
  interactionHistory: Interaction[];
  coachingSessions: CoachingSession[];
}
```

---

## 4. Core Features (MVP)

### 4.1 Home Screen - The Attune Flow

A single, beautiful screen that captures three essential inputs:

#### Section 1: Emotional Check-In
- **Inspired by:** Animo's mood selection
- **Implementation:** Fluid gesture-based slider or scrollable mood wheel
- **Moods:** Happy, Anxious, Frustrated, Hopeful, Tired, Motivated, Uncertain, Confident
- **Visual:** Soft gradient background that shifts colors based on selected mood
- **Purpose:** Helps AI tailor tone of coaching to your current state

#### Section 2: Person Selection
- **Prompt:** "Who do you need to attune to today?"
- **Implementation:** Smart search bar with recent contacts
- **Shows:** Person's photo, name, group tag (Work/Family/Friends)
- **Quick Access:** Recent people, starred favorites

#### Section 3: Outcome Intent
- **Prompt:** "What outcome are you looking for?"
- **Dynamic Options based on Group:**

| Work | Family | Friends |
|------|--------|---------|
| Make a connection | Strengthen bond | Reconnect |
| Navigate hard conversation | Resolve conflict | Support them |
| Influence decision | Express love | Plan together |
| Request/negotiate | Set boundaries | Have fun |
| Give feedback | Seek understanding | Deep conversation |

- **Color Palette Shift:** Background gradient changes based on:
  - Work: Cool blues, teals (professional, calm)
  - Family: Warm terracotta, soft orange (nurturing, grounded)
  - Friends: Vibrant purple, magenta (playful, energetic)

### 4.2 Scenario Coaching (Core AI)

After completing the Attune Flow, users enter the coaching experience:

#### Conversation Interface
- Chat-based interaction with the AI coach
- AI personality adapts: Wise Mentor + Supportive Friend + Strategic Coach blend

#### Coaching Outputs
1. **Context Understanding**
   - AI asks clarifying questions about the situation
   - Pulls relevant history from person's profile

2. **Script Suggestions**
   - Word-for-word phrases to open, navigate, and close
   - Variations for different tones (assertive, gentle, neutral)

3. **Response Predictions**
   - "They might say..." scenarios
   - Counter-response strategies for each

4. **Tone & Body Language Guidance**
   - Energy level recommendations
   - Pacing suggestions
   - Non-verbal cues to watch for

5. **Historical Context Integration**
   - "Last time you discussed X, they responded well to Y"
   - Pattern recognition from past interactions

### 4.3 People Management

#### Add Person Flow
1. Basic info: Name, photo (optional), group, subgroup
2. Quick assessment: 3-5 questions about communication style
3. Relationship notes: Free-form context

#### Person Profile View
- Visual summary card
- Communication preferences at a glance
- Interaction timeline
- Coaching session history
- Notes and key dates

#### Group Management
- View all people by group
- Sub-group organization
- Relationship health indicators (based on interaction frequency + outcomes)

### 4.4 Progress Tracking

#### Relationship Health Dashboard
- Visual network map
- Color-coded health status per relationship
- Trends over time

#### Post-Interaction Journaling
- Quick reflection after conversations
- What worked? What didn't?
- How do you feel now?
- AI learns from outcomes

#### Personal EQ Insights
- Communication pattern analysis
- Growth areas identification
- Strengths recognition

#### Goal-Based Milestones
- Set relationship goals ("Improve relationship with manager")
- Track progress toward goals
- Celebrate wins

---

## 5. Design System

### Emotional Tone
**Calm & Introspective** - Like a thoughtful journal or therapy companion
- Spacious layouts with intentional breathing room
- Soft, rounded UI elements
- Gentle transitions and micro-interactions
- Typography that feels warm and readable

### Visual Direction: Soft Gradient Flows

#### Color System
```css
:root {
  /* Base Palette */
  --attune-bg: 240 20% 98%;           /* Soft off-white */
  --attune-fg: 240 10% 15%;            /* Deep charcoal */
  
  /* Emotional States - Gradient anchors */
  --mood-calm: 220 60% 75%;            /* Serene blue */
  --mood-energized: 280 50% 70%;       /* Soft purple */
  --mood-warm: 25 70% 75%;             /* Gentle peach */
  --mood-grounded: 160 40% 65%;        /* Sage green */
  
  /* Context Colors */
  --context-work: 200 70% 60%;         /* Professional teal */
  --context-work-accent: 190 80% 70%;
  --context-family: 20 70% 65%;        /* Warm terracotta */
  --context-family-accent: 30 80% 75%;
  --context-friends: 280 60% 70%;      /* Playful purple */
  --context-friends-accent: 300 70% 80%;
  
  /* Semantic */
  --attune-primary: 240 60% 60%;       /* Balanced indigo */
  --attune-primary-foreground: 0 0% 100%;
  --attune-muted: 240 10% 90%;
  --attune-muted-foreground: 240 10% 45%;
  
  /* Gradients */
  --gradient-calm: linear-gradient(135deg, hsl(220 60% 85%), hsl(200 50% 90%));
  --gradient-warm: linear-gradient(135deg, hsl(20 60% 85%), hsl(40 70% 90%));
  --gradient-energized: linear-gradient(135deg, hsl(280 50% 85%), hsl(320 40% 90%));
}
```

#### Typography
- **Display:** SF Pro Display / Inter (system-fallback-friendly)
- **Body:** SF Pro Text / Inter
- **Sizes:** Generous, accessibility-first (min 16px body)

#### Animations
- **Transitions:** Ease-out, 200-400ms for state changes
- **Gradient shifts:** Smooth 600ms color interpolations
- **Micro-interactions:** Subtle scale/opacity on touch
- **Page transitions:** Horizontal swipe gestures

#### Component Style
- Cards with generous padding and subtle shadows
- Frosted glass effects for overlays
- Rounded corners (12-16px radius)
- Soft borders or no borders

---

## 6. Technical Architecture

### Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **State:** TanStack Query + React Context
- **Backend:** Lovable Cloud (Supabase)
- **AI:** Anthropic Claude API (via Edge Functions)
- **Auth:** Supabase Auth (email/password)

### Data Architecture

#### Database Schema (Supabase)
```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  communication_style JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- People in user's circle
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  group_type TEXT NOT NULL CHECK (group_type IN ('work', 'family', 'friends')),
  subgroup TEXT,
  communication_profile JSONB,
  motivations TEXT[],
  values TEXT[],
  goals TEXT[],
  relationship_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interaction history
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  context TEXT,
  outcome TEXT,
  what_worked TEXT,
  what_didnt TEXT,
  emotional_state_before TEXT,
  emotional_state_after TEXT,
  ai_coaching_used BOOLEAN DEFAULT FALSE
);

-- Coaching sessions
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  emotional_state TEXT,
  desired_outcome TEXT,
  messages JSONB[], -- Chat history
  coaching_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationship goals
CREATE TABLE relationship_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  progress_notes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

#### Security Requirements
- Row Level Security (RLS) on all tables
- Data encrypted at rest (Supabase default)
- HTTPS only (SSL in transit)
- Secure session management
- API keys stored as Supabase secrets

### Edge Functions

1. **`coaching-chat`** - Main AI coaching conversation
   - Receives: user emotional state, person context, desired outcome, message history
   - Returns: AI coaching response with structured guidance

2. **`generate-scripts`** - Generate conversation scripts
   - Receives: scenario details, person profile
   - Returns: Multiple script variations

3. **`analyze-relationship`** - Relationship health analysis
   - Receives: person_id, interaction history
   - Returns: Health score, patterns, recommendations

---

## 7. User Flows

### Flow 1: First-Time User
```
Landing → Sign Up → Welcome Screen → 
Add First Person (guided) → 
First Coaching Session (demo) → 
Main App
```

### Flow 2: Daily Use (Attune Flow)
```
Open App → Home Screen (3-part input) →
Select Mood → Search/Select Person → Choose Outcome →
Enter Coaching Chat → Receive Guidance →
Save Session → Optional: Add Reflection Later
```

### Flow 3: Post-Conversation Reflection
```
Notification/Reminder → Quick Reflection Screen →
Rate Outcome → What Worked/Didn't → 
Emotional State Check → Save →
AI Updates Person Profile
```

### Flow 4: Review Relationship Health
```
Dashboard Tab → Network Visualization →
Select Person → View Profile & History →
Set/Review Goals → View Coaching History
```

---

## 8. Navigation Structure

### Gesture-Based Swipe Navigation
Main sections accessible via horizontal swipe:

```
[Today] ← swipe → [People] ← swipe → [Reflect] ← swipe → [Me]
```

1. **Today (Home):** The Attune Flow - emotional check-in + person + outcome
2. **People:** Your circle organized by groups, add/manage contacts
3. **Reflect:** Journaling, recent sessions, pending reflections
4. **Me:** Profile, settings, EQ insights, relationship dashboard

### Bottom Indicator
- Minimal dots or line indicator showing current position
- Optional subtle tab labels that appear on tap

---

## 9. AI Personality Specification

### Core Traits
The AI coach blends three personas based on context:

#### Wise Mentor (default for complex situations)
- Asks probing questions before giving advice
- Shares insights about human psychology
- Encourages reflection on motivations
- Tone: Thoughtful, measured, insightful

#### Supportive Friend (when user is emotionally vulnerable)
- Validates feelings first
- Uses warm, encouraging language
- Celebrates wins, normalizes struggles
- Tone: Warm, understanding, optimistic

#### Strategic Coach (for high-stakes professional scenarios)
- Direct, actionable guidance
- Focuses on outcomes and tactics
- Provides specific scripts and predictions
- Tone: Confident, clear, empowering

### Response Structure
1. **Acknowledge** - Validate the situation/emotions
2. **Contextualize** - Reference person's profile and history
3. **Guide** - Provide specific, actionable coaching
4. **Prepare** - Anticipate responses and next steps
5. **Encourage** - End with supportive, forward-looking note

### Sample System Prompt
```
You are Attune, an emotional intelligence coach helping users navigate important 
conversations and build meaningful connections.

Your personality adapts to what the user needs:
- For complex emotional situations: Be a Wise Mentor—thoughtful, insightful, 
  asking probing questions
- When the user seems vulnerable: Be a Supportive Friend—warm, validating, 
  encouraging
- For high-stakes professional scenarios: Be a Strategic Coach—direct, 
  outcome-focused, tactical

Current Context:
- User's emotional state: {emotional_state}
- Person they're attuning to: {person_name}
- Relationship type: {group_type} / {subgroup}
- Desired outcome: {desired_outcome}
- Person's communication profile: {communication_profile}
- Recent interaction history: {recent_interactions}

Guidelines:
1. Always acknowledge emotions before strategizing
2. Reference the specific person's known preferences and patterns
3. Provide concrete phrases they can actually use
4. Anticipate 2-3 possible responses and how to handle each
5. Keep responses concise but complete—mobile-friendly paragraphs
6. End with an encouraging, actionable next step

Remember: You're a tool to help them connect with others—the joy comes from 
their real relationships, not from you. Help them feel prepared, confident, 
and authentic.
```

---

## 10. MVP Scope & Timeline

### Phase 1: Foundation (Week 1-2)
- [ ] Design system implementation
- [ ] Authentication (email/password)
- [ ] Basic profile creation
- [ ] Database schema + RLS policies

### Phase 2: Core Features (Week 2-3)
- [ ] Home screen with Attune Flow
- [ ] People management (CRUD)
- [ ] Group/subgroup organization
- [ ] Person profile views

### Phase 3: AI Integration (Week 3-4)
- [ ] Claude API edge function
- [ ] Coaching chat interface
- [ ] Script generation
- [ ] Session storage

### Phase 4: Polish & Tracking (Week 4+)
- [ ] Post-interaction reflections
- [ ] Basic relationship dashboard
- [ ] Gesture navigation refinement
- [ ] PWA optimization

### Out of Scope for MVP
- Offline support
- Push notifications
- Calendar integration
- Team/shared accounts
- Advanced analytics
- Native mobile apps

---

## 11. Success Metrics

### Engagement
- Daily Active Users (DAU)
- Sessions per user per week
- Coaching sessions completed
- Post-interaction reflections submitted

### Outcome Quality
- User satisfaction ratings (post-session)
- Reported conversation outcomes (success rate)
- Relationship health improvement over time

### Retention
- Week 1, Week 4, Month 3 retention
- People profiles created per user
- Time spent in coaching sessions

### Growth
- Organic signup rate
- Referral rate
- Social shares of insights

---

## 12. Future Considerations

### Potential Features (Post-MVP)
1. **Calendar Integration** - Upcoming meeting prep reminders
2. **Voice Input** - Speak scenarios instead of typing
3. **Relationship Analytics** - Deep patterns across your network
4. **Shared Coaching** - Partner/couples features
5. **Enterprise Version** - Team communication coaching
6. **AI Memory** - Proactive check-ins based on time since last contact

### Monetization Path
1. **Freemium Model:**
   - Free: 5 coaching sessions/month, 10 people max
   - Premium: Unlimited coaching, unlimited people, advanced analytics
   
2. **Pricing Ideas:**
   - $9.99/month or $79.99/year
   - Family/Team plans

### Platform Expansion
1. PWA → Native iOS/Android (Capacitor)
2. Desktop companion app
3. Browser extension for email coaching

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI gives inappropriate relationship advice | Strong guardrails in system prompt; human review of edge cases; clear disclaimers |
| Privacy concerns (sensitive relationship data) | End-to-end encryption roadmap; transparent data policies; user data export/delete |
| Users become dependent on AI for conversations | Design emphasizes tool, not crutch; celebrate independent wins; gradual confidence building |
| Low engagement after initial interest | Post-conversation reminders; relationship health nudges; celebration of streaks |

---

## 14. Open Questions

1. **Onboarding depth:** Should we add a light EQ self-assessment in future versions?
2. **Relationship health algorithm:** What factors determine "healthy" vs "needs attention"?
3. **Cultural sensitivity:** How do we handle communication style differences across cultures?
4. **Couples/shared profiles:** Should two people be able to see each other's notes?

---

## Appendix A: Competitive Landscape

| Product | Positioning | Attune Differentiation |
|---------|-------------|------------------------|
| Therapy apps (BetterHelp, Talkspace) | Professional mental health | Attune is for everyday relationships, not clinical therapy |
| Journaling apps (Day One, Reflectly) | Self-reflection focused | Attune is action-oriented and relationship-specific |
| CRM tools (personal CRMs) | Contact management | Attune focuses on emotional intelligence, not just data |
| Communication courses | Generic training | Attune is personalized and in-the-moment |

---

## Appendix B: Design Inspiration

### Primary Reference
- [Animo by Jaden Kim](https://jadenkim.design/animo) - Emotional input, gradient flows, mobile-first

### Additional Inspiration
- **Headspace** - Calm, spacious, approachable wellness design
- **Notion** - Clean information architecture, flexible views
- **Linear** - Elegant gesture-based navigation
- **Endel** - Dynamic, mood-responsive visuals

---

*Document prepared for Attune v1.0 development*
*Ready for implementation in Lovable*
