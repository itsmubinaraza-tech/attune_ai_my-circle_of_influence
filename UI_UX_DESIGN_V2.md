# Attune - UI/UX Design Specification V2
## Liquid Glass + Dynamic Backgrounds

> **Version:** 2.0 | **Date:** January 31, 2026
> **Updates:** Dynamic themes, extended emotion borders, detailed layouts
> **Status:** AWAITING FINAL APPROVAL

---

## 1. Dynamic Background Themes

Users can choose from 5 distinct background themes. The liquid glass panels float above these backgrounds, creating depth and visual interest.

### Theme 1: Warm Earth (Default)

```
┌─────────────────────────────────────────────────────────────────┐
│  WARM EARTH THEME                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Background: Soft gradient from cream to warm sand              │
│                                                                 │
│  ████████████████████████████████████████████████████████████   │
│  ██  #FDF6E3 (Cream) ────────────────────► #E8DCC8 (Sand)  ██   │
│  ████████████████████████████████████████████████████████████   │
│                                                                 │
│  Glass Panel Color: rgba(253, 246, 227, 0.6)                    │
│  Text Color: #3D3D3D (Charcoal)                                 │
│  Accent: #C4846C (Terracotta)                                   │
│                                                                 │
│  Mood: Nurturing, grounded, calm, professional                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.theme-warm-earth {
  --bg-gradient: linear-gradient(135deg, #FDF6E3 0%, #E8DCC8 50%, #D4C4B0 100%);
  --glass-bg: rgba(253, 246, 227, 0.6);
  --glass-border: rgba(255, 255, 255, 0.3);
  --text-primary: #3D3D3D;
  --text-secondary: #8B6F5C;
  --accent: #C4846C;
}
```

---

### Theme 2: Modern Dark Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  MODERN DARK MODE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Background: Deep charcoal to black gradient                    │
│                                                                 │
│  ████████████████████████████████████████████████████████████   │
│  ██  #1A1A1A (Near Black) ───────────────► #2D2D2D (Char)  ██   │
│  ████████████████████████████████████████████████████████████   │
│                                                                 │
│  Glass Panel Color: rgba(45, 45, 45, 0.7)                       │
│  Glass Border: rgba(255, 255, 255, 0.1)                         │
│  Text Color: #F5F5F5 (Off-white)                                │
│  Accent: #C4846C (Terracotta - warm pop)                        │
│                                                                 │
│  Mood: Sleek, focused, modern, professional                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.theme-dark-mode {
  --bg-gradient: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1F1F1F 100%);
  --glass-bg: rgba(45, 45, 45, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
  --text-primary: #F5F5F5;
  --text-secondary: #A0A0A0;
  --accent: #C4846C;
}
```

---

### Theme 3: Dark Purple Hues

```
┌─────────────────────────────────────────────────────────────────┐
│  DARK PURPLE HUES                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Background: Deep purple to violet gradient                     │
│                                                                 │
│  ████████████████████████████████████████████████████████████   │
│  ██  #1A1625 (Deep Purple) ──────────► #2D2640 (Violet)    ██   │
│  ████████████████████████████████████████████████████████████   │
│                                                                 │
│  Glass Panel Color: rgba(45, 38, 64, 0.7)                       │
│  Glass Border: rgba(155, 123, 184, 0.2)                         │
│  Text Color: #F0EDF5 (Lavender white)                           │
│  Accent: #9B7BB8 (Soft purple)                                  │
│                                                                 │
│  Mood: Creative, introspective, emotional, mysterious           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.theme-dark-purple {
  --bg-gradient: linear-gradient(135deg, #1A1625 0%, #2D2640 50%, #1F1A2E 100%);
  --glass-bg: rgba(45, 38, 64, 0.7);
  --glass-border: rgba(155, 123, 184, 0.2);
  --text-primary: #F0EDF5;
  --text-secondary: #B8A8C8;
  --accent: #9B7BB8;
}
```

---

### Theme 4: Serene Nature (Static Image)

```
┌─────────────────────────────────────────────────────────────────┐
│  SERENE NATURE                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Background: High-quality mountain/river landscape photo        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ⛰️                                              ⛰️     │   │
│  │       ⛰️          ~~~~~~~                    ⛰️        │   │
│  │                    ~~~~~~~                              │   │
│  │    🌲  🌲        ~~~~~~~~~~~~        🌲  🌲  🌲        │   │
│  │  🌲 🌲 🌲 🌲    ~~~~~~~~~~~~~~~~    🌲 🌲 🌲 🌲 🌲     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Image: Calm mountain lake with reflections, soft morning light │
│  Overlay: Subtle dark gradient for text legibility              │
│  Glass Panel Color: rgba(240, 245, 250, 0.5)                    │
│  Text Color: #2D3748 (Slate)                                    │
│                                                                 │
│  Mood: Peaceful, meditative, grounding, natural                 │
│                                                                 │
│  Recommended Images:                                            │
│  - Mountain lake at dawn                                        │
│  - Misty forest with stream                                     │
│  - Rolling hills at golden hour                                 │
│  - Japanese garden with pond                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.theme-serene-nature {
  --bg-image: url('/backgrounds/mountain-lake.jpg');
  --bg-overlay: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2));
  --glass-bg: rgba(240, 245, 250, 0.5);
  --glass-border: rgba(255, 255, 255, 0.4);
  --text-primary: #2D3748;
  --text-secondary: #4A5568;
  --accent: #5B8FA8;
}

.theme-serene-nature::before {
  content: '';
  position: fixed;
  inset: 0;
  background: var(--bg-image) center/cover no-repeat;
  z-index: -2;
}

.theme-serene-nature::after {
  content: '';
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: -1;
}
```

---

### Theme 5: Calming Video Background

```
┌─────────────────────────────────────────────────────────────────┐
│  CALMING VIDEO                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Background: Looping ambient video with slow motion             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │    ▶️ LOOPING VIDEO                                     │   │
│  │                                                         │   │
│  │    ～～～～～～～～～～～～～～～～～～～～～～～～～   │   │
│  │    ～～～～ Gentle waves ～～～～～～～～～～～～～～   │   │
│  │    ～～～～～～～～～～～～～～～～～～～～～～～～～   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Glass panels float above the animated background               │
│  Creates the "living" liquid glass effect                       │
│                                                                 │
│  Video Options (user can choose):                               │
│  1. Gentle ocean waves - soft blue movement                     │
│  2. Floating clouds - white/gray drift across sky               │
│  3. Aurora borealis - slow green/purple lights                  │
│  4. Rain on window - drops rolling down glass                   │
│  5. Fireplace embers - warm orange glow                         │
│  6. Flowing river - calm water movement                         │
│                                                                 │
│  Glass Panel Color: rgba(255, 255, 255, 0.3)                    │
│  Text Color: Adapts to video brightness                         │
│                                                                 │
│  Mood: Dynamic, immersive, meditative, premium                  │
│                                                                 │
│  PERFORMANCE NOTE:                                              │
│  - Video auto-pauses when tab not visible                       │
│  - Reduced motion setting disables video                        │
│  - Mobile: Static frame with subtle parallax                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.theme-calming-video {
  --glass-bg: rgba(255, 255, 255, 0.3);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --accent: #C4846C;
}

.video-background {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
}

.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dark overlay for text legibility */
.video-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}
```

---

### Theme Selector UI

```
┌─────────────────────────────────────────────────────────────────┐
│  THEME SELECTOR (in Settings/Me tab)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Choose Your Background                                        │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│   │ ████████│  │ ████████│  │ ████████│                        │
│   │ Warm    │  │ Dark    │  │ Purple  │                        │
│   │ Earth ✓ │  │ Mode    │  │ Hues    │                        │
│   └─────────┘  └─────────┘  └─────────┘                        │
│                                                                 │
│   ┌─────────┐  ┌─────────┐                                     │
│   │ 🏔️     │  │ 🌊     │                                     │
│   │ Serene  │  │ Calming │                                     │
│   │ Nature  │  │ Video   │                                     │
│   └─────────┘  └─────────┘                                     │
│                                                                 │
│   Video Background Options (if selected):                       │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ │
│   │ Waves │ │Clouds │ │Aurora │ │ Rain  │ │ Fire  │ │ River │ │
│   └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Extended Emotion Borders

Emotion gradient borders now apply to more elements beyond just the mood widget.

### Elements with Emotion Borders

```
┌─────────────────────────────────────────────────────────────────┐
│  ELEMENTS WITH EMOTION BORDERS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. MOOD WIDGET (Primary - Thick border)                        │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  Border: 3px              │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  Glow: Strong             │
│  ┃ ▓▓     How are you feeling?  ▓▓ ┃  Animation: Pulse         │
│  ┃ ▓▓           😌               ▓▓ ┃                           │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃                           │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                           │
│                                                                 │
│  2. ACTIVE CHAT WINDOW (When in conversation)                   │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  Border: 2px              │
│  ┃ ▓▓ Talk to Me                 ▓▓ ┃  Glow: Medium            │
│  ┃ ▓▓ ...                        ▓▓ ┃  Animation: Subtle       │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                           │
│                                                                 │
│  3. SELECTED PERSON CARD (When focused/active)                  │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  Border: 2px              │
│  ┃ ▓▓ 👤 Sarah Mitchell          ▓▓ ┃  Glow: Medium            │
│  ┃ ▓▓    Manager                 ▓▓ ┃  On: focus/active        │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                           │
│                                                                 │
│  4. QUICK ACTIONS CARD                                          │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  Border: 2px              │
│  ┃ ▓▓ 🎤 Talk to Me              ▓▓ ┃  Glow: Subtle            │
│  ┃ ▓▓ ➕ Add Person              ▓▓ ┃  Always visible          │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                           │
│                                                                 │
│  5. FAB BUTTON (Ring glow)                                      │
│       ╭───────╮                       Ring: 4px                 │
│       │  🎤   │                       Glow: Strong              │
│       ╰───────╯                       Animation: Pulse          │
│       ◉◉◉◉◉◉◉◉◉  ← Emotion ring                                │
│                                                                 │
│  6. HEADER ACCENT LINE (Subtle bottom border)                   │
│  ┌───────────────────────────────────┐                         │
│  │ 🌿 Attune    Today  Circle  Me  👤│                         │
│  ╘═══════════════════════════════════╛  ← Thin emotion line    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Emotion Border CSS

```css
/* Base emotion border mixin */
.emotion-border {
  position: relative;
  border: var(--emotion-border-width, 2px) solid transparent;
  background:
    linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box,
    var(--current-emotion-gradient) border-box;
}

/* Add glow effect */
.emotion-border::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  background: var(--current-emotion-gradient);
  opacity: 0.3;
  filter: blur(8px);
  z-index: -1;
}

/* Variants */
.emotion-border--strong {
  --emotion-border-width: 3px;
}
.emotion-border--strong::before {
  opacity: 0.5;
  filter: blur(12px);
}

.emotion-border--subtle {
  --emotion-border-width: 1px;
}
.emotion-border--subtle::before {
  opacity: 0.2;
  filter: blur(4px);
}

/* Pulse animation */
.emotion-border--pulse::before {
  animation: emotion-pulse 3s ease-in-out infinite;
}

@keyframes emotion-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.02); }
}
```

### Emotion Color Mapping (All Themes)

```
┌─────────────────────────────────────────────────────────────────┐
│  EMOTION GRADIENTS (Consistent across all themes)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Emotion      │ Gradient Start → End      │ Meaning            │
│  ─────────────┼───────────────────────────┼──────────────────  │
│  Confident    │ #7D9B7B → #5B8B6F         │ Sage greens        │
│  Anxious      │ #9B8B9B → #7B6B8B         │ Muted lavender     │
│  Frustrated   │ #C4846C → #A86B5C         │ Warm terracotta    │
│  Hopeful      │ #D4A87A → #C4986A         │ Warm gold          │
│  Tired        │ #8B8B8B → #6B6B6B         │ Soft gray          │
│  Uncertain    │ #8B9BAB → #6B7B8B         │ Steel blue         │
│  Determined   │ #8B6B5C → #6B4B3C         │ Deep clay          │
│  Excited      │ #C49B6C → #D4AB7C         │ Bright amber       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Layout Mockups

### 3.1 Mobile - Today Page (Complete Detail)

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░░░│  System status bar
├─────────────────────────────────────────┤
│                                         │
│  Good morning, Alex 👋                  │  Greeting + time-based
│  Wednesday, January 31                  │
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓   How are you feeling?       ▓▓ ┃ │  MOOD WIDGET
│  ┃ ▓▓                              ▓▓ ┃ │  - Liquid glass
│  ┃ ▓▓            😌                ▓▓ ┃ │  - Emotion border (3px)
│  ┃ ▓▓         Hopeful              ▓▓ ┃ │  - Glowing pulse
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓  ◀ 😰  😤  😌  😴  🤔  💪 ▶  ▓▓ ┃ │  Horizontal scroll
│  ┃ ▓▓     ○   ○   ●   ○   ○   ○    ▓▓ ┃ │  Dots indicator
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │  ← Gold gradient border
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░  Needs Attention          See all░░ ││  SECTION HEADER
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  └─────────────────────────────────────┘│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░  ╭────╮                       ░░ ││
│  │ ░░  │ 👩 │  Mom                  ░░ ││  PERSON CARD
│  │ ░░  ╰────╯  Last: 2 weeks ago    ░░ ││  - Liquid glass
│  │ ░░          ○ Needs attention    ░░ ││  - Orange dot = attention
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░  ╭────╮                       ░░ ││
│  │ ░░  │ 👨 │  Jake                 ░░ ││  PERSON CARD
│  │ ░░  ╰────╯  Last: 10 days ago    ░░ ││
│  │ ░░          ○ Stable             ░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ░░  Recent Conversations    See all░░ ││  SECTION HEADER
│  └─────────────────────────────────────┘│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  👤 Sarah        Yesterday    ░░ ││  SESSION CARD
│  │ ░░  Discussed promotion...       ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│                                         │
│                            ┏━━━━━━━━━┓  │
│                            ┃ ◉◉◉◉◉◉ ┃  │  FAB with emotion ring
│                            ┃   🎤   ┃  │
│                            ┃ ◉◉◉◉◉◉ ┃  │
│                            ┗━━━━━━━━━┛  │
│                                         │
├─────────────────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┃ ▓▓  🏠     👥     📝     👤   ▓▓ ┃ │  BOTTOM NAV
│  ┃ ▓▓ Today  Circle Reflect  Me   ▓▓ ┃ │  - Liquid glass
│  ┃ ▓▓  ●      ○       ○      ○    ▓▓ ┃ │  - Active indicator
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│═══════════════════════════════════════ │  ← Emotion accent line
├─────────────────────────────────────────┤
│         ▬▬▬ HOME INDICATOR ▬▬▬         │
└─────────────────────────────────────────┘
```

### 3.2 Mobile - Circle Page (People List)

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░░░│
├─────────────────────────────────────────┤
│                                         │
│  My Circle                    ➕ Add    │  Page title + action
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  🔍 Search people...          ░░ ││  SEARCH BAR
│  ╰─────────────────────────────────────╯│  - Liquid glass
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓                              ▓▓ ┃ │  GROUP HEADER
│  ┃ ▓▓  💼 Work                  (5) ▓▓ ┃ │  - Teal accent
│  ┃ ▓▓                          ▼   ▓▓ ┃ │  - Expandable
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░ ╭────╮ Sarah Mitchell        ░░ ││
│  │ ░░ │ 👩 │ Senior Manager        ░░ ││  PERSON CARD
│  │ ░░ ╰────╯ ● Thriving            ░░ ││  - In Work group
│  ╰─────────────────────────────────────╯│
│  ╭─────────────────────────────────────╮│
│  │ ░░ ╭────╮ Michael Chen          ░░ ││
│  │ ░░ │ 👨 │ Team Lead             ░░ ││
│  │ ░░ ╰────╯ ● Stable              ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓  👨‍👩‍👧 Family              (8) ▓▓ ┃ │  GROUP HEADER
│  ┃ ▓▓                          ▼   ▓▓ ┃ │  - Terracotta accent
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░ ╭────╮ Mom                   ░░ ││
│  │ ░░ │ 👩 │ ○ Needs attention     ░░ ││  Orange = attention
│  ╰─────────────────────────────────────╯│
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓  👫 Friends               (12) ▓▓ ┃ │  - Purple accent
│  ┃ ▓▓                          ▶   ▓▓ ┃ │  - Collapsed
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓  🤝 Acquaintances          (3) ▓▓ ┃ │  - Green accent
│  ┃ ▓▓                          ▶   ▓▓ ┃ │  - Collapsed
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│                            ┏━━━━━━━━━┓  │
│                            ┃   🎤   ┃  │  FAB
│                            ┗━━━━━━━━━┛  │
├─────────────────────────────────────────┤
│  ▓▓ Today  Circle  Reflect  Me  ▓▓     │
│      ○      ●       ○       ○          │
│═════════════════════════════════════════│
└─────────────────────────────────────────┘
```

### 3.3 Mobile - Person Profile

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░░░│
├─────────────────────────────────────────┤
│  ◀ Back                          ⋮     │  Navigation
├─────────────────────────────────────────┤
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓         ╭─────────╮          ▓▓ ┃ │  PROFILE HEADER
│  ┃ ▓▓         │         │          ▓▓ ┃ │  - Large avatar
│  ┃ ▓▓         │   👩    │          ▓▓ ┃ │  - Name prominent
│  ┃ ▓▓         │         │          ▓▓ ┃ │
│  ┃ ▓▓         ╰─────────╯          ▓▓ ┃ │
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓       Sarah Mitchell         ▓▓ ┃ │
│  ┃ ▓▓       Senior Manager         ▓▓ ┃ │
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓    ┌──────┐   ● Thriving     ▓▓ ┃ │  Group badge + health
│  ┃ ▓▓    │ Work │                  ▓▓ ┃ │
│  ┃ ▓▓    └──────┘                  ▓▓ ┃ │
│  ┃ ▓▓                              ▓▓ ┃ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓                              ▓▓ ┃ │  QUICK ACTIONS
│  ┃ ▓▓   🎤 Talk about Sarah        ▓▓ ┃ │  - Primary CTA
│  ┃ ▓▓                              ▓▓ ┃ │  - Emotion border
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Communication Style          ░░ ││
│  │ ░░                               ░░ ││  COMMUNICATION
│  │ ░░  Preferred: Email             ░░ ││
│  │ ░░  Style: Analytical            ░░ ││
│  │ ░░  Response: Thoughtful         ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Relationship Notes           ░░ ││
│  │ ░░                               ░░ ││  NOTES
│  │ ░░  "Sarah values data-driven    ░░ ││
│  │ ░░  proposals. She appreciates   ░░ ││
│  │ ░░  when I think through..."     ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Connections (3)              ░░ ││  CONNECTIONS
│  │ ░░                               ░░ ││
│  │ ░░  👤 Michael  👤 Lisa  👤 Tom  ░░ ││  People they know
│  ╰─────────────────────────────────────╯│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Recent Interactions       ▶  ░░ ││  HISTORY
│  ╰─────────────────────────────────────╯│
│                                         │
├─────────────────────────────────────────┤
│  ▓▓ Today  Circle  Reflect  Me  ▓▓     │
└─────────────────────────────────────────┘
```

### 3.4 Mobile - Talk to Me Chat

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░░░│
├─────────────────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓                              ▓▓ ┃ │  CHAT HEADER
│  ┃ ▓▓  Talk to Me              ✕   ▓▓ ┃ │  - Frosted glass
│  ┃ ▓▓                              ▓▓ ┃ │  - Close button
│  ┃ ▓▓  👤 Talking about: Sarah     ▓▓ ┃ │  - Context shown
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│═════════════════════════════════════════│  ← Emotion accent line
│                                         │
│                                         │
│                                         │
│                  ╭──────────────────╮   │
│                  │ I have a meeting │   │  USER MESSAGE
│                  │ with Sarah about │   │  - Right aligned
│                  │ asking for more  │   │  - Terracotta bg
│                  │ project resources│   │
│                  ╰──────────────────╯   │
│                            10:30 AM  ▸  │
│                                         │
│  ╭──────────────────────────────────╮   │
│  │ Based on Sarah's profile, she    │   │  AI MESSAGE
│  │ responds well to **data-driven   │   │  - Left aligned
│  │ proposals**.                     │   │  - Cream bg
│  │                                  │   │
│  │ **Suggested approach:**          │   │
│  │ • Lead with project impact       │   │
│  │ • Present 2-3 options            │   │
│  │ • Be ready for timeline Qs       │   │
│  │                                  │   │
│  │ Would you like me to help        │   │
│  │ structure your talking points?   │   │
│  ╰──────────────────────────────────╯   │
│  ◂ Attune                    10:31 AM   │
│                                         │
│                     ● ● ●               │  TYPING INDICATOR
│                                         │
│                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓                              ▓▓ ┃ │  INPUT AREA
│  ┃ ▓▓  Type or tap 🎤 to speak...  ▓▓ ┃ │  - Liquid glass
│  ┃ ▓▓                          ➤   ▓▓ ┃ │  - Voice button
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │  - Send button
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│  Credits: 3 remaining this month        │  Credit indicator
│                                         │
└─────────────────────────────────────────┘
```

### 3.5 Web Dashboard (Full Detail)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┃ ▓▓                                                                          ▓▓ ┃ │
│  ┃ ▓▓  🌿 Attune                Today    Circle    Reflect    Me       👤 Alex ▓▓ ┃ │
│  ┃ ▓▓                             ●        ○         ○        ○                ▓▓ ┃ │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│  ══════════════════════════════════════════════════════════════════════════════════│
│                          ↑ HEADER with emotion accent line                         │
│                                                                                    │
│     ┌──────────────────────────────────────────────────────────────────────────┐   │
│     │                                                                          │   │
│     │   Good afternoon, Alex                                                   │   │
│     │   Wednesday, January 31, 2026                                            │   │
│     │                                                                          │   │
│     │   ┏━━━━━━━━━━━━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │   │
│     │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃    ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓ How are you      ▓▓ ┃    ┃ ▓▓      RELATIONSHIP MAP        ▓▓ ┃  │   │
│     │   ┃ ▓▓ feeling today?   ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓       ○○○         ○○         ▓▓ ┃  │   │
│     │   ┃ ▓▓      😌          ▓▓ ┃    ┃ ▓▓      ○WORK○     ○FAMILY○     ▓▓ ┃  │   │
│     │   ┃ ▓▓   Hopeful        ▓▓ ┃    ┃ ▓▓       ○○○         ○○         ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓         ╲         ╱          ▓▓ ┃  │   │
│     │   ┃ ▓▓ 😰 😤 😌 😴 🤔 💪 ▓▓ ┃    ┃ ▓▓          ╲ [YOU] ╱           ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓         ╱         ╲          ▓▓ ┃  │   │
│     │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃    ┃ ▓▓       ○○○         ○           ▓▓ ┃  │   │
│     │   ┗━━━━━━━━━━━━━━━━━━━━━━━━┛    ┃ ▓▓     ○FRIENDS○   ○ACQUAINT○   ▓▓ ┃  │   │
│     │      ↑ MOOD WIDGET              ┃ ▓▓       ○○○         ○           ▓▓ ┃  │   │
│     │        Gold border (Hopeful)    ┃ ▓▓                              ▓▓ ┃  │   │
│     │                                 ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │   │
│     │                                 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │   │
│     │                                                                          │   │
│     │   ┏━━━━━━━━━━━━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │   │
│     │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃    ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓ Quick Actions    ▓▓ ┃    ┃ ▓▓  Needs Attention             ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓ ┌──────────────┐ ▓▓ ┃    ┃ ▓▓  ╭────╮                      ▓▓ ┃  │   │
│     │   ┃ ▓▓ │ 🎤 Talk to Me│ ▓▓ ┃    ┃ ▓▓  │ 👩 │ Mom        2 weeks   ▓▓ ┃  │   │
│     │   ┃ ▓▓ └──────────────┘ ▓▓ ┃    ┃ ▓▓  ╰────╯ ○ Needs attention     ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓ ┌──────────────┐ ▓▓ ┃    ┃ ▓▓  ╭────╮                      ▓▓ ┃  │   │
│     │   ┃ ▓▓ │ ➕ Add Person │ ▓▓ ┃    ┃ ▓▓  │ 👨 │ Jake       10 days   ▓▓ ┃  │   │
│     │   ┃ ▓▓ └──────────────┘ ▓▓ ┃    ┃ ▓▓  ╰────╯ ○ Stable              ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓ ┌──────────────┐ ▓▓ ┃    ┃ ▓▓  ╭────╮                      ▓▓ ┃  │   │
│     │   ┃ ▓▓ │ 📝 Log Action │ ▓▓ ┃    ┃ ▓▓  │ 👨 │ Uncle Bob   1 month  ▓▓ ┃  │   │
│     │   ┃ ▓▓ └──────────────┘ ▓▓ ┃    ┃ ▓▓  ╰────╯ ○ Needs attention     ▓▓ ┃  │   │
│     │   ┃ ▓▓                  ▓▓ ┃    ┃ ▓▓                              ▓▓ ┃  │   │
│     │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃    ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │   │
│     │   ┗━━━━━━━━━━━━━━━━━━━━━━━━┛    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │   │
│     │      ↑ QUICK ACTIONS               ↑ NEEDS ATTENTION                     │   │
│     │        Emotion border                People cards                        │   │
│     │                                                                          │   │
│     │   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │   │
│     │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │   │
│     │   ┃ ▓▓                                                            ▓▓ ┃  │   │
│     │   ┃ ▓▓  Recent Coaching Sessions                          See all ▓▓ ┃  │   │
│     │   ┃ ▓▓                                                            ▓▓ ┃  │   │
│     │   ┃ ▓▓  👤 Sarah - Promotion discussion           Yesterday       ▓▓ ┃  │   │
│     │   ┃ ▓▓  👤 Mom - Birthday planning                3 days ago      ▓▓ ┃  │   │
│     │   ┃ ▓▓  👤 Michael - Project handoff              1 week ago      ▓▓ ┃  │   │
│     │   ┃ ▓▓                                                            ▓▓ ┃  │   │
│     │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │   │
│     │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │   │
│     │                         ↑ RECENT SESSIONS (Full width)                   │   │
│     │                                                                          │   │
│     └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ▓▓                                                                          ▓▓ ┃ │
│  ┃ ▓▓    Privacy Policy    Terms of Service    Contact    © 2026 Attune        ▓▓ ┃ │
│  ┃ ▓▓                                                                          ▓▓ ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                            ↑ FOOTER - Liquid glass                 │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Theme Switching Experience

### Settings Page - Theme Selection

```
┌─────────────────────────────────────────┐
│  Settings                               │
├─────────────────────────────────────────┤
│                                         │
│  Appearance                             │
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Background Theme             ░░ ││
│  │ ░░                               ░░ ││
│  │ ░░  ┌───────┐ ┌───────┐ ┌───────┐░░ ││
│  │ ░░  │███████│ │▓▓▓▓▓▓▓│ │▒▒▒▒▒▒▒│░░ ││
│  │ ░░  │ Warm  │ │ Dark  │ │Purple │░░ ││
│  │ ░░  │ Earth │ │ Mode  │ │ Hues  │░░ ││
│  │ ░░  │  ✓    │ │       │ │       │░░ ││
│  │ ░░  └───────┘ └───────┘ └───────┘░░ ││
│  │ ░░                               ░░ ││
│  │ ░░  ┌───────┐ ┌───────┐          ░░ ││
│  │ ░░  │ 🏔️   │ │ 🌊   │          ░░ ││
│  │ ░░  │Serene │ │Calming│          ░░ ││
│  │ ░░  │Nature │ │ Video │          ░░ ││
│  │ ░░  └───────┘ └───────┘          ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ╭─────────────────────────────────────╮│  (Shown if Video selected)
│  │ ░░  Video Options                ░░ ││
│  │ ░░                               ░░ ││
│  │ ░░  ○ Gentle waves               ░░ ││
│  │ ░░  ● Floating clouds            ░░ ││
│  │ ░░  ○ Aurora borealis            ░░ ││
│  │ ░░  ○ Rain on window             ░░ ││
│  │ ░░  ○ Fireplace embers           ░░ ││
│  │ ░░  ○ Flowing river              ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Final Approval Checklist

### Theme System
- [ ] 5 dynamic background themes implemented
- [ ] Theme selector in settings
- [ ] Theme persists across sessions
- [ ] Video backgrounds with performance optimization
- [ ] Reduced motion support for video themes

### Emotion Borders
- [ ] Mood Widget - 3px strong border with glow
- [ ] Chat Window - 2px medium border
- [ ] Selected Person Card - 2px on focus
- [ ] Quick Actions Card - 2px subtle
- [ ] FAB - Ring glow around button
- [ ] Header - Thin accent line

### Layouts
- [ ] Mobile Today page with all widgets
- [ ] Mobile Circle page with group organization
- [ ] Mobile Person Profile with all sections
- [ ] Mobile Chat overlay
- [ ] Web Dashboard with 2x2 widget grid
- [ ] Web responsive at all breakpoints

### Components
- [ ] Liquid glass cards (3 intensity levels)
- [ ] Mood widget with horizontal scroll
- [ ] Person cards with health indicators
- [ ] Relationship map with bubble clusters
- [ ] Chat interface with voice input
- [ ] FAB with pulse animation

---

*Design Specification Version 2.0*
*Status: AWAITING FINAL APPROVAL*
