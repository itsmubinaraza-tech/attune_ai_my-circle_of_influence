# Attune - UI/UX Design Specification V4
## Final Design - Liquid Glass + 3-Widget Flow

> **Version:** 4.1 | **Date:** January 31, 2026
> **Philosophy:** Attune is a friend, confidant, and guide - NOT a coach or boss
> **Status:** ALIGNED WITH BASELINE CODE

---

## 0. Baseline Code Reference

The initial implementation was created using Lovable and is published at:
- **Live App:** https://attuneai.lovable.app
- **Source Code:** `D:\Attune_AI_my-circle_of_influence\attuneai\src\`

### Existing Components (Use as Foundation)
| Component | File | Status |
|-----------|------|--------|
| MoodSelector | `src/components/attune/MoodSelector.tsx` | ✅ Built |
| PersonSearch | `src/components/attune/PersonSearch.tsx` | ✅ Built |
| OutcomeSelector | `src/components/attune/OutcomeSelector.tsx` | ✅ Built |
| Main Page | `src/pages/Index.tsx` | ✅ Built |
| Glass Styling | `src/index.css` | ✅ Built |
| 48 Shadcn UI Components | `src/components/ui/` | ✅ Available |

### Key Design System Already Implemented
- Liquid glass / glassmorphism effects
- Context-aware colors (Work: indigo, Family: pink, Friends: teal)
- 8 mood states with colors
- Framer Motion animations
- Mobile-first responsive layout
- Progress indicator dots

### What Needs Enhancement
- Add 6 dynamic background themes (currently only gradient backgrounds)
- Add LEFT/RIGHT organic emotion glow to Mood Selector and Outcome Widget
- Update language (remove "coaching" references)
- Add theme selector UI
- Integrate with Supabase backend

---

## 1. Brand Voice & Tone

### What Attune IS:
- A **friend** you can confide in
- A **confidant** who listens without judgment
- A **guide** for navigating relationships
- A **tool** for becoming emotionally intelligent
- A **companion** on your connection journey

### What Attune is NOT:
- ~~A coach~~ (too authoritative)
- ~~A boss~~ (too hierarchical)
- ~~A therapist~~ (too clinical)
- ~~An instructor~~ (too formal)

### Language Guidelines

| Instead of... | Use... |
|---------------|--------|
| Coaching session | Conversation, Attune session |
| Start Coaching | Let's Connect, Start Conversation, Attune Now |
| Coaching history | Past conversations, Session history |
| Coaching credits | Conversation credits, Sessions remaining |
| Get coached | Get guidance, Prepare together |
| Coach response | Attune's thoughts, Guidance |

---

## 2. Six Dynamic Background Themes

### Theme 1: Warm Earth (Default)
```css
.theme-warm-earth {
  --bg-gradient: linear-gradient(135deg, #FDF6E3 0%, #E8DCC8 50%, #D4C4B0 100%);
  --glass-bg: rgba(253, 246, 227, 0.6);
  --text-primary: #3D3D3D;
  --accent: #C4846C;
}
```

### Theme 2: Modern Dark Mode
```css
.theme-dark-mode {
  --bg-gradient: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1F1F1F 100%);
  --glass-bg: rgba(45, 45, 45, 0.7);
  --text-primary: #F5F5F5;
  --accent: #C4846C;
}
```

### Theme 3: Dark Purple Hues
```css
.theme-dark-purple {
  --bg-gradient: linear-gradient(135deg, #1A1625 0%, #2D2640 50%, #1F1A2E 100%);
  --glass-bg: rgba(45, 38, 64, 0.7);
  --text-primary: #F0EDF5;
  --accent: #9B7BB8;
}
```

### Theme 4: Ocean Depth
```css
.theme-ocean-depth {
  --bg-gradient: linear-gradient(135deg, #30CFD0 0%, #1A6B7C 40%, #330867 100%);
  --glass-bg: rgba(48, 207, 208, 0.15);
  --text-primary: #FFFFFF;
  --accent: #30CFD0;
}
```

### Theme 5: Serene Nature (Static Image)
```css
.theme-serene-nature {
  --bg-image: url('/backgrounds/mountain-lake.jpg');
  --glass-bg: rgba(240, 245, 250, 0.5);
  --text-primary: #2D3748;
}
```

### Theme 6: Calming Video (Animated)
- Ocean waves, clouds, aurora, rain, fireplace, river
- Glass panels float above animated background

---

## 3. The Three Main Widgets (Home Screen)

The home screen has **exactly 3 widgets** - **ALL ALWAYS VISIBLE**:

```
┌─────────────────────────────────────────┐
│                                         │
│  FLOW:  Mood → Person → Outcome         │
│  (All 3 widgets visible at all times)   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      WIDGET 1: MOOD SELECTOR    │    │
│  │      (Always visible)           │    │
│  │      + LEFT/RIGHT emotion glow  │    │
│  └─────────────────────────────────┘    │
│                 ↓                        │
│  ┌─────────────────────────────────┐    │
│  │      WIDGET 2: PERSON SEARCH    │    │
│  │      (Always visible)           │    │
│  └─────────────────────────────────┘    │
│                 ↓                        │
│  ┌─────────────────────────────────┐    │
│  │      WIDGET 3: OUTCOME          │    │
│  │      (Always visible)           │    │
│  │      + LEFT/RIGHT emotion glow  │    │
│  │      Context updates on select  │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Widget 1: Mood Selector

### Design Concept
A centralized, single-emotion display with:
- **Auto-cycling animation** before user selects
- **Color-coded emotions** with unique gradients
- **Tap-to-select** interaction
- **LEFT/RIGHT organic glow** based on selected emotion

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  MOOD SELECTOR WIDGET                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STATE 1: Auto-Cycling (Before Selection)                       │
│  ─────────────────────────────────────────                      │
│  ╭─────────────────────────────────────────────────────────╮    │
│  │                                                         │    │
│  │░░░                                                 ░░░ │    │
│  │░░░░░                                             ░░░░░ │    │
│  │░░░░░░░                                         ░░░░░░░ │    │
│  │░░░░░░░░                                       ░░░░░░░░ │    │
│  │░░░░░░░░░                                     ░░░░░░░░░ │    │
│  │░░░░░░░░░░          😌                       ░░░░░░░░░░ │    │
│  │░░░░░░░░░░       (cycling...)               ░░░░░░░░░░ │    │
│  │░░░░░░░░░                                     ░░░░░░░░░ │    │
│  │░░░░░░░░                                       ░░░░░░░░ │    │
│  │░░░░░░░                                         ░░░░░░░ │    │
│  │░░░░░              Tap to select                 ░░░░░ │    │
│  │░░░                                                 ░░░ │    │
│  │                                                         │    │
│  ╰─────────────────────────────────────────────────────────╯    │
│                                                                 │
│  Animation: Emotions cycle every 2 seconds                      │
│  Glow: Subtle gray/neutral while cycling                        │
│                                                                 │
│                                                                 │
│  STATE 2: Selected (User Tapped)                                │
│  ─────────────────────────────────────────                      │
│  ╭─────────────────────────────────────────────────────────╮    │
│  │                                                         │    │
│  │▓▓▓                                                 ▓▓▓ │    │
│  │▓▓▓▓▒                                             ▒▓▓▓▓ │    │
│  │▓▓▓▓▓▒░                                         ░▒▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓░                                         ░▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓░         How are you feeling?          ░▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓▓░                                     ░▓▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓▓░            😌                       ░▓▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓▓░         Hopeful                     ░▓▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓░                                       ░▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓░     ← 😰 😤 😌 😴 🤔 💪 😄 →          ░▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▒░           ○  ○  ●  ○  ○  ○             ░▒▓▓▓▓▓ │    │
│  │▓▓▓▓▒                                             ▒▓▓▓▓ │    │
│  │▓▓▓                                                 ▓▓▓ │    │
│  │                                                         │    │
│  ╰─────────────────────────────────────────────────────────╯    │
│                                                                 │
│  Glow: Emotion color (Gold for Hopeful)                         │
│  Position: LEFT and RIGHT sides only                            │
│  Shape: Organic/curved (not rectangular)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Emotion Options

| Emotion | Emoji | Color | Gradient |
|---------|-------|-------|----------|
| Confident | 💪 | Sage Green | #7D9B7B → #5B8B6F |
| Anxious | 😰 | Muted Lavender | #9B8B9B → #7B6B8B |
| Frustrated | 😤 | Warm Terracotta | #C4846C → #A86B5C |
| Hopeful | 😌 | Warm Gold | #D4A87A → #C4986A |
| Tired | 😴 | Soft Gray | #8B8B8B → #6B6B6B |
| Uncertain | 🤔 | Steel Blue | #8B9BAB → #6B7B8B |
| Determined | 😠 | Deep Clay | #8B6B5C → #6B4B3C |
| Excited | 😄 | Bright Amber | #C49B6C → #D4AB7C |

### Interaction Flow
1. Widget shows auto-cycling emotions on page load
2. User taps anywhere on widget to stop cycling
3. User swipes/scrolls to select their emotion
4. Emotion color glow animates to selected color
5. Widget updates to show selected state

---

## 5. Widget 2: Person Search

### Design Concept
A clean, focused search interface with:
- **Search input** as primary element
- **"Last Attuned"** quick-select chips below
- **Clean, minimal design**

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  PERSON SEARCH WIDGET                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╭─────────────────────────────────────────────────────────╮    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░   Who do you want to connect with?                ░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░   ┌───────────────────────────────────────────┐   ░░ │    │
│  │ ░░   │  🔍  Search your circle...                │   ░░ │    │
│  │ ░░   └───────────────────────────────────────────┘   ░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░   Last Attuned:                                   ░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░   ╭──────╮  ╭──────╮  ╭──────╮  ╭──────╮        ░░ │    │
│  │ ░░   │  👩  │  │  👨  │  │  👩  │  │  👴  │        ░░ │    │
│  │ ░░   │Sarah │  │ Dad  │  │ Lisa │  │Uncle │        ░░ │    │
│  │ ░░   ╰──────╯  ╰──────╯  ╰──────╯  ╰──────╯        ░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  ╰─────────────────────────────────────────────────────────╯    │
│                                                                 │
│  ELEMENTS:                                                      │
│  • "Who do you want to connect with?" - Friendly prompt         │
│  • Search bar with 🔍 icon                                      │
│  • "Last Attuned" - Quick-select recent people                  │
│  • Avatar chips - Tap to select                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Selected State

When a person is selected, the widget shows confirmation:

```
│  ╭─────────────────────────────────────────────────────────╮    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░   Connecting with:                                ░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░   ╭────────────────────────────────────────────╮  ░░ │    │
│  │ ░░   │  ╭────╮                                    │  ░░ │    │
│  │ ░░   │  │ 👩 │  Sarah Mitchell                    │  ░░ │    │
│  │ ░░   │  ╰────╯  Manager • Work            ✕ clear │  ░░ │    │
│  │ ░░   ╰────────────────────────────────────────────╯  ░░ │    │
│  │ ░░                                                   ░░ │    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  ╰─────────────────────────────────────────────────────────╯    │
```

---

## 6. Widget 3: Outcome Widget

### Design Concept
**ALWAYS VISIBLE** on the main screen, even before a person is selected. Shows:
- Context-aware outcome options based on selected person's group
- Custom scenario text input
- "Let's Connect" action button
- LEFT/RIGHT organic emotion glow

### Visibility
- **Always visible** - all 3 widgets shown at all times
- **Context updates** when person is selected to show group-specific outcomes
- **Default state** shows generic outcomes (e.g., Work outcomes as default)

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  OUTCOME WIDGET (Always Visible - Context Updates on Select)    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╭─────────────────────────────────────────────────────────╮    │
│  │                                                         │    │
│  │▓▓▓                                                 ▓▓▓ │    │
│  │▓▓▓▓▒                                             ▒▓▓▓▓ │    │
│  │▓▓▓▓▓▒░                                         ░▒▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓░   What outcome are you hoping for       ░▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓░  with Sarah?                          ░▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓▓░                                     ░▓▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓▓░  Work Outcomes:                     ░▓▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓░                                       ░▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓░   ┌─────────────────────────────┐      ░▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▒░   │ 💼 Get buy-in or approval   │      ░▒▓▓▓▓▓ │    │
│  │▓▓▓▓▒     └─────────────────────────────┘        ▒▓▓▓▓ │    │
│  │▓▓▓       ┌─────────────────────────────┐          ▓▓▓ │    │
│  │          │ 🎯 Influence a decision     │  ← ●         │    │
│  │          └─────────────────────────────┘              │    │
│  │          ┌─────────────────────────────┐              │    │
│  │          │ 💬 Navigate a hard talk     │              │    │
│  │          └─────────────────────────────┘              │    │
│  │          ┌─────────────────────────────┐              │    │
│  │▓▓▓       │ 🤝 Build an alliance        │          ▓▓▓ │    │
│  │▓▓▓▓▒     └─────────────────────────────┘        ▒▓▓▓▓ │    │
│  │▓▓▓▓▓▒░                                         ░▒▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓░   Or describe your situation:           ░▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓░  ┌─────────────────────────────┐      ░▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓▓░ │ Type what's on your mind... │     ░▓▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓▓░  └─────────────────────────────┘      ░▓▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▓░                                         ░▓▓▓▓▓▓ │    │
│  │▓▓▓▓▓▒░   ┌─────────────────────────────┐      ░▒▓▓▓▓▓ │    │
│  │▓▓▓▓▒     │     ▶ Let's Connect         │        ▒▓▓▓▓ │    │
│  │▓▓▓       └─────────────────────────────┘          ▓▓▓ │    │
│  │                                                         │    │
│  ╰─────────────────────────────────────────────────────────╯    │
│                                                                 │
│  Glow: Same emotion color as Mood Selector                      │
│  Position: LEFT and RIGHT sides only                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Context-Aware Outcome Options

| Work | Family | Friends | Acquaintances |
|------|--------|---------|---------------|
| Get buy-in/approval | Strengthen our bond | Reconnect | Get to know them better |
| Influence a decision | Resolve a conflict | Support them | Find common ground |
| Navigate a hard talk | Set healthy boundaries | Plan something together | Make a good impression |
| Build an alliance | Express love/appreciation | Have a deep conversation | Establish rapport |
| Request resources | Seek understanding | Address tension | Explore potential |
| Negotiate terms | Share difficult news | Celebrate together | Evaluate fit |

---

## 7. Complete Mobile Layout - Today Screen

```
┌───────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░│
├───────────────────────────────────────┤
│                                       │
│  Good morning, Alex 👋                │
│  Wednesday, January 31                │
│                                       │
│  ═══════════════════════════════════  │
│  WIDGET 1: MOOD SELECTOR              │
│  (With LEFT/RIGHT emotion glow)       │
│  ═══════════════════════════════════  │
│  ╭───────────────────────────────────╮│
│  │                                   ││
│  │▓▓▓░                         ░▓▓▓ ││
│  │▓▓▓▓▒░                     ░▒▓▓▓▓ ││
│  │▓▓▓▓▓▓░                   ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓▓░     😌          ░▓▓▓▓▓▓▓ ││  Centralized emotion
│  │▓▓▓▓▓▓▓░   Hopeful       ░▓▓▓▓▓▓▓ ││  Auto-cycling until tap
│  │▓▓▓▓▓▓░                   ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▒░  ← 😰😤😌😴🤔💪😄 → ░▒▓▓▓▓ ││
│  │▓▓▓░         ○○●○○○○         ░▓▓▓ ││
│  │                                   ││
│  ╰───────────────────────────────────╯│
│                                       │
│  ═══════════════════════════════════  │
│  WIDGET 2: PERSON SEARCH              │
│  (Clean search + last attuned)        │
│  ═══════════════════════════════════  │
│  ╭───────────────────────────────────╮│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░                              ░░ ││
│  │ ░░  Who do you want to          ░░ ││
│  │ ░░  connect with?               ░░ ││
│  │ ░░                              ░░ ││
│  │ ░░  ┌────────────────────────┐  ░░ ││
│  │ ░░  │ 🔍 Search your circle  │  ░░ ││
│  │ ░░  └────────────────────────┘  ░░ ││
│  │ ░░                              ░░ ││
│  │ ░░  Last Attuned:               ░░ ││
│  │ ░░  ╭────╮╭────╮╭────╮╭────╮   ░░ ││
│  │ ░░  │ 👩 ││ 👨 ││ 👩 ││ 👴 │   ░░ ││
│  │ ░░  │Sara││Dad ││Lisa││Bob │   ░░ ││
│  │ ░░  ╰────╯╰────╯╰────╯╰────╯   ░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  ╰───────────────────────────────────╯│
│                                       │
│                                       │
│  ═══════════════════════════════════  │
│  WIDGET 3: OUTCOME (Always Visible)   │
│  With LEFT/RIGHT emotion glow         │
│  ═══════════════════════════════════  │
│  ╭───────────────────────────────────╮│
│  │▓▓▓░                         ░▓▓▓ ││
│  │▓▓▓▓▒░ What outcome are you  ░▒▓▓▓▓ ││
│  │▓▓▓▓▓░ hoping for?           ░▓▓▓▓▓ ││
│  │▓▓▓▓░  [Build connection  ]   ░▓▓▓▓ ││
│  │▓▓▓░   [Navigate tension ●]    ░▓▓▓ ││
│  │       [Influence outcome ]         ││
│  │▓▓▓░   [Let's Connect ▶  ]    ░▓▓▓ ││
│  │▓▓▓▓▒░                       ░▒▓▓▓▓ ││
│  ╰───────────────────────────────────╯│
│                                       │
│                                       │
│                          ╭─────────╮  │
│                          │   🎤    │  │  Talk to Me FAB
│                          ╰─────────╯  │
│                                       │
├───────────────────────────────────────┤
│  ╭───────────────────────────────────╮│
│  │ ░░ 🏠    👥    📝    👤      ░░ ││
│  │ ░░Today Circle Reflect Me    ░░ ││  Bottom nav
│  │ ░░  ●     ○      ○     ○     ░░ ││
│  ╰───────────────────────────────────╯│
├───────────────────────────────────────┤
│        ▬▬▬ HOME INDICATOR ▬▬▬        │
└───────────────────────────────────────┘
```

### After Person Selected (Context Updates)

```
┌───────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░│
├───────────────────────────────────────┤
│                                       │
│  Good morning, Alex 👋                │
│                                       │
│  ═══════════════════════════════════  │
│  WIDGET 1: MOOD SELECTOR (Compact)    │
│  ═══════════════════════════════════  │
│  ╭───────────────────────────────────╮│
│  │▓▓░   😌 Hopeful              ░▓▓ ││  Compact when
│  │▓▓░   ← 😰😤😌😴🤔💪😄 →      ░▓▓ ││  person selected
│  ╰───────────────────────────────────╯│
│                                       │
│  ═══════════════════════════════════  │
│  WIDGET 2: PERSON (Selected State)    │
│  ═══════════════════════════════════  │
│  ╭───────────────────────────────────╮│
│  │ ░░  Connecting with:            ░░ ││
│  │ ░░  ╭────╮                      ░░ ││
│  │ ░░  │ 👩 │ Sarah Mitchell       ░░ ││  Selected person
│  │ ░░  ╰────╯ Manager • Work   ✕   ░░ ││  Clear button
│  ╰───────────────────────────────────╯│
│                                       │
│  ═══════════════════════════════════  │
│  WIDGET 3: OUTCOME (Now Visible!)     │
│  With LEFT/RIGHT emotion glow         │
│  ═══════════════════════════════════  │
│  ╭───────────────────────────────────╮│
│  │                                   ││
│  │▓▓▓░                         ░▓▓▓ ││
│  │▓▓▓▓▒░ What outcome are you  ░▒▓▓▓▓ ││
│  │▓▓▓▓▓░ hoping for with Sarah? ░▓▓▓▓▓ ││
│  │▓▓▓▓▓▓░                     ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓▓░ Work Outcomes:    ░▓▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓░                     ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▓░  [Get buy-in     ]   ░▓▓▓▓▓ ││  Context-aware
│  │▓▓▓▓░   [Influence ● sel]    ░▓▓▓▓ ││  (Work options)
│  │▓▓▓░    [Hard talk      ]     ░▓▓▓ ││
│  │        [Build alliance ]          ││
│  │                                   ││
│  │        Or describe:               ││
│  │        ┌─────────────────────┐    ││
│  │        │ Type situation...   │    ││
│  │        └─────────────────────┘    ││
│  │                                   ││
│  │▓▓▓░    ┌─────────────────┐   ░▓▓▓ ││
│  │▓▓▓▓▒░  │ ▶ Let's Connect │  ░▒▓▓▓▓ ││  Action button
│  │▓▓▓▓▓░  └─────────────────┘   ░▓▓▓▓▓ ││
│  │                                   ││
│  ╰───────────────────────────────────╯│
│                                       │
│                          ╭─────────╮  │
│                          │   🎤    │  │
│                          ╰─────────╯  │
├───────────────────────────────────────┤
│  ░░ Today Circle Reflect Me ░░       │
└───────────────────────────────────────┘
```

---

## 8. Web Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ╭────────────────────────────────────────────────────────────────────────────────╮│
│  │ ░░ 🌿 Attune              Today    Circle    Reflect    Me          👤 Alex ░░ ││
│  ╰────────────────────────────────────────────────────────────────────────────────╯│
│                                                                                    │
│     ┌──────────────────────────────────────────────────────────────────────────┐   │
│     │                                                                          │   │
│     │   Good afternoon, Alex                                                   │   │
│     │                                                                          │   │
│     │   LEFT COLUMN                           RIGHT COLUMN                     │   │
│     │   ┌─────────────────────────┐          ┌─────────────────────────────┐   │   │
│     │   │▓▓▓░             ░▓▓▓   │          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   │▓▓▓▓▒░         ░▒▓▓▓▓   │          │ ░░                        ░░ │   │   │
│     │   │▓▓▓▓▓░  😌    ░▓▓▓▓▓   │          │ ░░   RELATIONSHIP MAP      ░░ │   │   │
│     │   │▓▓▓▓▓░ Hopeful ░▓▓▓▓▓   │          │ ░░                        ░░ │   │   │
│     │   │▓▓▓▓▒░         ░▒▓▓▓▓   │          │ ░░    ○○○       ○○        ░░ │   │   │
│     │   │▓▓▓░ 😰😤😌😴🤔💪 ░▓▓▓   │          │ ░░   WORK     FAMILY      ░░ │   │   │
│     │   │    MOOD SELECTOR       │          │ ░░     ╲         ╱         ░░ │   │   │
│     │   └─────────────────────────┘          │ ░░      ╲ [YOU] ╱          ░░ │   │   │
│     │                                        │ ░░     ╱         ╲         ░░ │   │   │
│     │   ┌─────────────────────────┐          │ ░░   FRIENDS   ACQUAINT    ░░ │   │   │
│     │   │ ░░░░░░░░░░░░░░░░░░░░░░ │          │ ░░    ○○○       ○○        ░░ │   │   │
│     │   │ ░░ Who do you want to ░░ │          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   │ ░░ connect with?      ░░ │          └─────────────────────────────┘   │   │
│     │   │ ░░                    ░░ │                                            │   │
│     │   │ ░░ [🔍 Search...]     ░░ │          ┌─────────────────────────────┐   │   │
│     │   │ ░░                    ░░ │          │ ░░ Needs Attention        ░░ │   │   │
│     │   │ ░░ Last Attuned:      ░░ │          │ ░░                        ░░ │   │   │
│     │   │ ░░ 👩 👨 👩 👴       ░░ │          │ ░░ 👩 Mom       2 weeks   ░░ │   │   │
│     │   │ ░░░░░░░░░░░░░░░░░░░░░░ │          │ ░░ 👨 Jake      10 days   ░░ │   │   │
│     │   │    PERSON SEARCH       │          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   └─────────────────────────┘          └─────────────────────────────┘   │   │
│     │                                                                          │   │
│     │   ┌─────────────────────────┐          ┌─────────────────────────────┐   │   │
│     │   │▓▓░ OUTCOME WIDGET  ░▓▓ │          │ ░░ Recent Conversations   ░░ │   │   │
│     │   │▓▓░ (Always visible) ░▓▓ │          │ ░░                        ░░ │   │   │
│     │   │▓▓░ What outcome?    ░▓▓ │          │ ░░ 👩 Sarah    Yesterday  ░░ │   │   │
│     │   │▓▓░ [Build connection] ░▓▓ │          │ ░░ 👨 Dad      3 days     ░░ │   │   │
│     │   │▓▓░ [Let's Connect ▶] ░▓▓ │          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   └─────────────────────────┘          └─────────────────────────────┘   │   │
│     │                                                                          │   │
│     └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ╭────────────────────────────────────────────────────────────────────────────────╮│
│  │ ░░    Privacy Policy    Terms of Service    Contact    © 2026 Attune        ░░ ││
│  ╰────────────────────────────────────────────────────────────────────────────────╯│
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Talk to Me Chat Overlay

### Language Updates
- Header: "Talk to Me" (not "Coaching Chat")
- Person label: "Talking about: [Name]"
- AI label: "Attune" (not "Coach")
- Session end: "End Conversation" (not "End Session")
- Credits: "Conversations remaining" (not "Coaching credits")

```
┌─────────────────────────────────────────┐
│  ╭─────────────────────────────────────╮│
│  │ ░░ Talk to Me               ✕    ░░ ││
│  │ ░░─────────────────────────────────░░ ││
│  │ ░░ 👩 Talking about: Sarah       ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│                                         │
│                 ╭───────────────────╮   │
│                 │ I have a meeting  │   │
│                 │ with Sarah about  │   │  User message
│                 │ asking for more   │   │
│                 │ resources...      │   │
│                 ╰───────────────────╯   │
│                                         │
│  ╭──────────────────────────────────╮   │
│  │ Based on what you've shared      │   │
│  │ about Sarah, she responds well   │   │  Attune's response
│  │ to data-driven conversations.    │   │  (friendly, supportive)
│  │                                  │   │
│  │ Here's how I'd approach it:      │   │
│  │                                  │   │
│  │ **Opening:** "Sarah, I wanted    │   │
│  │ to discuss the project..."       │   │
│  │                                  │   │
│  │ Would you like me to help you    │   │
│  │ prepare for specific responses?  │   │
│  ╰──────────────────────────────────╯   │
│  ◂ Attune                               │
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░ Type or tap 🎤 to speak...   ░░ ││
│  │ ░░                          ➤   ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  3 conversations remaining this month   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 10. Emotion Glow CSS (LEFT/RIGHT Only, Organic Shape)

```css
/* Applied to: Mood Selector + Outcome Widget */
.emotion-glow-widget {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  overflow: hidden;
}

/* Left side organic glow */
.emotion-glow-widget::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 25%;
  height: 70%; /* Doesn't reach top/bottom */
  background: radial-gradient(
    ellipse at left center,
    var(--emotion-color) 0%,
    var(--emotion-color-medium) 30%,
    var(--emotion-color-light) 60%,
    transparent 100%
  );
  border-radius: 0 50% 50% 0;
  pointer-events: none;
  opacity: 0.7;
}

/* Right side organic glow */
.emotion-glow-widget::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 25%;
  height: 70%;
  background: radial-gradient(
    ellipse at right center,
    var(--emotion-color) 0%,
    var(--emotion-color-medium) 30%,
    var(--emotion-color-light) 60%,
    transparent 100%
  );
  border-radius: 50% 0 0 50%;
  pointer-events: none;
  opacity: 0.7;
}
```

---

## 11. Component Summary

| Component | Glass Level | Emotion Glow | Notes |
|-----------|-------------|--------------|-------|
| Mood Selector | Medium | **YES - L/R organic** | Auto-cycling, tap to select |
| Person Search | Medium | No | Search + last attuned chips |
| Outcome Widget | Medium | **YES - L/R organic** | **Always visible**, context-aware options |
| Relationship Map | Medium | No | Bubble clusters |
| Person Cards | Medium | No | In Circle page |
| Chat Overlay | Frosted | No | Talk to Me conversations |
| Header/Footer | Light | No | Navigation |
| Bottom Nav | Light | No | Mobile nav |
| FAB | Solid | No | Pulse animation |

---

## 12. Language Reference

### Replace Throughout App

| Don't Say | Say Instead |
|-----------|-------------|
| Coaching | Guidance, Conversation, Attune session |
| Start Coaching | Let's Connect, Start Conversation |
| Coaching session | Conversation, Session |
| Coaching credits | Conversations remaining |
| Coach | Attune (as persona name) |
| Coached | Guided, Supported |
| Get coached | Get guidance, Prepare together |
| Coaching history | Past conversations |

### Tone Examples

**Too Formal (Avoid):**
> "Let me coach you through this interaction."

**Friendly (Use):**
> "Let's think through this together."

**Too Authoritative (Avoid):**
> "You should approach this by..."

**Supportive (Use):**
> "Here's an approach that might work well..."

---

## 13. Final Checklist

### Themes (6)
- [ ] Warm Earth
- [ ] Modern Dark
- [ ] Dark Purple
- [ ] Ocean Depth
- [ ] Serene Nature
- [ ] Calming Video

### Three Main Widgets (ALL ALWAYS VISIBLE)
- [ ] Widget 1: Mood Selector (auto-cycle, tap-select, emotion glow)
- [ ] Widget 2: Person Search (search + last attuned)
- [ ] Widget 3: Outcome (ALWAYS visible, context-aware, emotion glow)

### Emotion Glow
- [ ] LEFT and RIGHT sides only
- [ ] Organic curved shape
- [ ] Applied to Mood Selector AND Outcome Widget
- [ ] Not on top/bottom edges

### Language
- [ ] No "coaching" terminology
- [ ] Friendly, supportive tone
- [ ] "Let's Connect" as main CTA
- [ ] "Attune" as AI persona name

---

*Design Specification Version 4.0*
*Philosophy: Attune is a friend and guide, not a coach*
*Status: READY FOR REVIEW*
