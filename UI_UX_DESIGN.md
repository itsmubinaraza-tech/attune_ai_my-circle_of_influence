# Attune - UI/UX Design Specification
## Liquid Glass Design System

> **Version:** 1.0 | **Date:** January 31, 2026
> **Design Philosophy:** Warm Earth Tones + Liquid Glass Glassmorphism
> **Status:** AWAITING APPROVAL

---

## 1. Design Vision

### Core Concept
Attune combines **warm, nurturing earth tones** with the **liquid glass (glassmorphism) trend** to create an interface that feels both emotionally grounding and elegantly modern. The result is a calming, premium experience that supports emotional intelligence work.

### Design Principles
1. **Warmth & Comfort** - Earth tones create a safe, nurturing environment
2. **Depth & Dimension** - Liquid glass layers add visual hierarchy without clutter
3. **Emotional Resonance** - Colors shift based on user's emotional state
4. **Clarity & Focus** - Glassmorphic cards guide attention to what matters
5. **Accessible Beauty** - Visual effects never compromise usability

---

## 2. Color System

### Primary Palette: Warm Earth Tones

```
┌─────────────────────────────────────────────────────────────────┐
│  ATTUNE COLOR PALETTE                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ████████  Cream           #FDF6E3   Primary Background         │
│  ████████  Sand            #E8DCC8   Secondary Background       │
│  ████████  Terracotta      #C4846C   Primary Accent             │
│  ████████  Clay            #8B6F5C   Secondary Accent           │
│  ████████  Charcoal        #3D3D3D   Primary Text               │
│  ████████  Sage            #7D8B6F   Success / Positive         │
│  ████████  Mist            #F5F0E8   Card Background Base       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Group Colors

```
┌─────────────────────────────────────────────────────────────────┐
│  GROUP COLOR CODING                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ████████  Work            #5B8FA8   Professional Teal-Blue     │
│  ████████  Family          #C4846C   Warm Terracotta            │
│  ████████  Friends         #9B7BB8   Soft Purple                │
│  ████████  Acquaintances   #7D9B7B   Sage Green                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Emotion Gradient Colors (For Liquid Glass Borders)

```
┌─────────────────────────────────────────────────────────────────┐
│  EMOTION GRADIENTS                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Confident   ████████████  #7D9B7B → #5B8B6F   Sage Greens      │
│  Anxious     ████████████  #9B8B9B → #7B6B8B   Muted Lavender   │
│  Frustrated  ████████████  #C4846C → #A86B5C   Warm Terracotta  │
│  Hopeful     ████████████  #D4A87A → #C4986A   Warm Gold        │
│  Tired       ████████████  #8B8B8B → #6B6B6B   Soft Gray        │
│  Uncertain   ████████████  #8B9BAB → #6B7B8B   Steel Blue       │
│  Determined  ████████████  #8B6B5C → #6B4B3C   Deep Clay        │
│  Excited     ████████████  #C49B6C → #D4AB7C   Bright Amber     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Liquid Glass Design System

### What is Liquid Glass?
Liquid glass (advanced glassmorphism) creates depth through:
- **Frosted transparency** - See-through with blur
- **Light refraction** - Subtle color shifts based on background
- **Soft shadows** - Floating, layered appearance
- **Gradient borders** - Glowing edges that respond to context

### Core Liquid Glass CSS Properties

```css
/* Base Liquid Glass Card */
.liquid-glass {
  /* Semi-transparent background with warm tint */
  background: rgba(253, 246, 227, 0.6);  /* Cream with 60% opacity */

  /* Frosted blur effect */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Soft glowing border */
  border: 1px solid rgba(255, 255, 255, 0.3);

  /* Layered shadow for depth */
  box-shadow:
    0 4px 24px rgba(139, 111, 92, 0.1),    /* Clay shadow */
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);  /* Inner glow */

  /* Smooth corners */
  border-radius: 20px;
}

/* Emotion-Responsive Border */
.liquid-glass--emotion {
  border: 2px solid transparent;
  background:
    linear-gradient(rgba(253, 246, 227, 0.7), rgba(253, 246, 227, 0.7)) padding-box,
    var(--emotion-gradient) border-box;
}
```

### Liquid Glass Variants

```
┌─────────────────────────────────────────────────────────────────┐
│  GLASS INTENSITY LEVELS                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LIGHT GLASS (Subtle)                                           │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐                        │
│  │  background: rgba(253,246,227,0.4) │   blur: 8px            │
│  │  For: Backgrounds, large areas     │                        │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘                        │
│                                                                 │
│  MEDIUM GLASS (Standard)                                        │
│  ┌───────────────────────────────────┐                         │
│  │  background: rgba(253,246,227,0.6) │   blur: 12px           │
│  │  For: Cards, widgets, panels       │                         │
│  └───────────────────────────────────┘                         │
│                                                                 │
│  FROSTED GLASS (Prominent)                                      │
│  ┌███████████████████████████████████┐                         │
│  │  background: rgba(253,246,227,0.8) │   blur: 16px           │
│  │  For: Modals, overlays, focus      │                         │
│  └███████████████████████████████████┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

```
┌─────────────────────────────────────────────────────────────────┐
│  TYPOGRAPHY SCALE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Display Large    32px / 40px   Inter 600   Hero headlines      │
│  Display          28px / 36px   Inter 600   Page titles         │
│  Heading 1        24px / 32px   Inter 600   Section headers     │
│  Heading 2        20px / 28px   Inter 600   Card titles         │
│  Heading 3        18px / 24px   Inter 500   Subsections         │
│  Body Large       18px / 28px   Inter 400   Featured text       │
│  Body             16px / 24px   Inter 400   Default text        │
│  Body Small       14px / 20px   Inter 400   Secondary text      │
│  Caption          12px / 16px   Inter 500   Labels, metadata    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Text Colors
```
Primary Text:    #3D3D3D (Charcoal)    - Main content
Secondary Text:  #8B6F5C (Clay)        - Descriptions, hints
Muted Text:      #A89B8C               - Timestamps, metadata
On Accent:       #FFFFFF               - Text on colored backgrounds
```

---

## 5. Component Designs

### 5.1 Liquid Glass Card

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   STANDARD CARD                                                 │
│                                                                 │
│   ╭─────────────────────────────────────────────────────────╮   │
│   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│   │ ░░                                                   ░░ │   │
│   │ ░░   Card Title                                      ░░ │   │
│   │ ░░   Card content goes here with liquid glass        ░░ │   │
│   │ ░░   background creating depth and elegance.         ░░ │   │
│   │ ░░                                                   ░░ │   │
│   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│   ╰─────────────────────────────────────────────────────────╯   │
│     ↑                                                           │
│     Subtle shadow creates floating effect                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Mood Widget (Animo-Inspired with Liquid Glass)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   MOOD WIDGET - Emotion Border Glows Based on Selection         │
│                                                                 │
│   ╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮   │
│   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓         How are you feeling right now?            ▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓                    😌                             ▓▓ ┃   │
│   ┃ ▓▓                 Hopeful                           ▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓    ← 😰  😤  😌  😴  🤔  💪  😄 →                 ▓▓ ┃   │
│   ┃ ▓▓       ○   ○   ●   ○   ○   ○   ○                   ▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │
│   ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯   │
│     ↑                           ↑                               │
│     Gradient border glows       Horizontal scroll               │
│     with emotion color          with smooth animation           │
│                                                                 │
│   ANIMATION: Border gradient animates/pulses subtly             │
│   INTERACTION: Swipe or click to select emotion                 │
│   EFFECT: Background content visible through frosted glass      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Person Card (Circle Dashboard)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   PERSON CARD - With Group Color Accent                         │
│                                                                 │
│   ╭─────────────────────────────────────────────────────────╮   │
│   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│   │ ░░  ╭─────╮                                          ░░ │   │
│   │ ░░  │     │   Sarah Mitchell                         ░░ │   │
│   │ ░░  │ 👤  │   Senior Manager                         ░░ │   │
│   │ ░░  │     │   ┌──────┐                               ░░ │   │
│   │ ░░  ╰─────╯   │ Work │  ← Group badge (teal)         ░░ │   │
│   │ ░░            └──────┘                               ░░ │   │
│   │ ░░                                                   ░░ │   │
│   │ ░░   Last contact: 3 days ago     ● Thriving         ░░ │   │
│   │ ░░                                 ↑                 ░░ │   │
│   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░Health indicator░░░░ │   │
│   ╰─────────────────────────────────────────────────────────╯   │
│                                                                 │
│   HOVER STATE: Subtle lift (transform: translateY(-2px))        │
│   CLICK: Navigate to profile                                    │
│   HEALTH COLORS: Green=Thriving, Yellow=Stable, Red=Attention   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Relationship Map (Bubble Clusters)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   RELATIONSHIP MAP - Liquid Glass Container                     │
│                                                                 │
│   ╭─────────────────────────────────────────────────────────╮   │
│   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│   │ ░░                                                   ░░ │   │
│   │ ░░       ○ ○                           ○              ░░ │   │
│   │ ░░      ○ WORK ○                     ○ FAMILY ○       ░░ │   │
│   │ ░░       ○ ○ ○                         ○ ○            ░░ │   │
│   │ ░░          ╲                         ╱               ░░ │   │
│   │ ░░            ╲       ╭─────╮       ╱                 ░░ │   │
│   │ ░░              ╲     │ YOU │     ╱                   ░░ │   │
│   │ ░░                ────│     │────                     ░░ │   │
│   │ ░░              ╱     ╰─────╯     ╲                   ░░ │   │
│   │ ░░            ╱                     ╲                 ░░ │   │
│   │ ░░          ╱                         ╲               ░░ │   │
│   │ ░░       ○ ○                           ○ ○            ░░ │   │
│   │ ░░      ○ FRIENDS ○               ○ ACQUAINT ○        ░░ │   │
│   │ ░░       ○ ○ ○                         ○              ░░ │   │
│   │ ░░                                                   ░░ │   │
│   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│   ╰─────────────────────────────────────────────────────────╯   │
│                                                                 │
│   BUBBLES: Gradient fills with group colors                     │
│   CONNECTIONS: Thin lines between linked people                 │
│   ANIMATION: Subtle floating/breathing motion                   │
│   INTERACTION: Tap bubble → Open profile                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Talk to Me Chat Overlay

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   CHAT OVERLAY - Frosted Glass Modal                            │
│                                                                 │
│   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │
│   ┃ ▓▓  Talk to Me                              ✕ Close  ▓▓ ┃   │
│   ┃ ▓▓━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▓▓ ┃   │
│   ┃ ▓▓  👤 Talking about: Sarah (Manager)                ▓▓ ┃   │
│   ┃ ▓▓━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓  ╭─────────────────────────────────────────────╮  ▓▓ ┃   │
│   ┃ ▓▓  │ I have a meeting with Sarah tomorrow about  │  ▓▓ ┃   │
│   ┃ ▓▓  │ asking for more project resources.          │  ▓▓ ┃   │
│   ┃ ▓▓  ╰─────────────────────────────────────────────╯  ▓▓ ┃   │
│   ┃ ▓▓                                          You  ↗   ▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓  ╭─────────────────────────────────────────────╮  ▓▓ ┃   │
│   ┃ ▓▓  │ Based on Sarah's profile, she responds      │  ▓▓ ┃   │
│   ┃ ▓▓  │ well to data-driven proposals...            │  ▓▓ ┃   │
│   ┃ ▓▓  │                                             │  ▓▓ ┃   │
│   ┃ ▓▓  │ **Suggested approach:**                     │  ▓▓ ┃   │
│   ┃ ▓▓  │ • Lead with project impact metrics          │  ▓▓ ┃   │
│   ┃ ▓▓  │ • Present 2-3 options with trade-offs       │  ▓▓ ┃   │
│   ┃ ▓▓  ╰─────────────────────────────────────────────╯  ▓▓ ┃   │
│   ┃ ▓▓  ↖ Attune                                         ▓▓ ┃   │
│   ┃ ▓▓                                                   ▓▓ ┃   │
│   ┃ ▓▓━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▓▓ ┃   │
│   ┃ ▓▓  ╭─────────────────────────────────────╮  ╭────╮ ▓▓ ┃   │
│   ┃ ▓▓  │ Type or tap 🎤 to speak...          │  │ ➤  │ ▓▓ ┃   │
│   ┃ ▓▓  ╰─────────────────────────────────────╯  ╰────╯ ▓▓ ┃   │
│   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │
│   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│                                                                 │
│   BACKDROP: blur(20px) - Heavy frosting                         │
│   USER MESSAGES: Right-aligned, terracotta accent               │
│   AI MESSAGES: Left-aligned, cream background                   │
│   ANIMATION: Messages slide in with spring physics              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.6 Floating Action Button (Talk to Me)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   FAB - TALK TO ME BUTTON                                       │
│                                                                 │
│   Normal State:                    Active/Recording State:      │
│                                                                 │
│       ╭───────────╮                    ╭───────────╮            │
│       │           │                    │    ◉◉◉   │            │
│       │    🎤     │                    │    🎤     │  ← Pulse  │
│       │           │                    │    ◉◉◉   │    ring    │
│       ╰───────────╯                    ╰───────────╯            │
│                                                                 │
│   CSS:                                                          │
│   - background: linear-gradient(135deg, #C4846C, #A86B5C)       │
│   - box-shadow: 0 4px 20px rgba(196,132,108,0.4)               │
│   - border-radius: 50% (or 16px for rounded square)             │
│   - backdrop-filter: blur(8px)                                  │
│                                                                 │
│   ANIMATION: Subtle pulse every 3 seconds to draw attention     │
│   HOVER: Scale 1.05 + deeper shadow                             │
│   ACTIVE: Recording animation with expanding rings              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Layout Designs

### 6.1 Mobile Layout (< 768px)

```
┌───────────────────────────────────────┐
│  ┌─────────────────────────────────┐  │
│  │         STATUS BAR              │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │                                 │  │
│  │                                 │  │
│  │         MAIN CONTENT            │  │
│  │         (Scrollable)            │  │
│  │                                 │  │
│  │                                 │  │
│  │                                 │  │
│  │                                 │  │
│  │                          ╭───╮  │  │
│  │                          │🎤 │  │  │  ← FAB
│  │                          ╰───╯  │  │
│  └─────────────────────────────────┘  │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │
│  ┃ ▓  Today  Circle  Reflect  Me ▓ ┃  │  ← Liquid Glass Nav
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│  └─────────────────────────────────┘  │
│           HOME INDICATOR              │
└───────────────────────────────────────┘
```

### 6.2 Mobile - Today Page

```
┌───────────────────────────────────────┐
│                                       │
│  Good morning, Alex                   │
│  January 31, 2026                     │
│                                       │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │
│  ┃ ▓▓                            ▓▓ ┃  │
│  ┃ ▓▓  How are you feeling?      ▓▓ ┃  │
│  ┃ ▓▓                            ▓▓ ┃  │
│  ┃ ▓▓          😌                ▓▓ ┃  │
│  ┃ ▓▓       Hopeful              ▓▓ ┃  │  ← Mood Widget
│  ┃ ▓▓                            ▓▓ ┃  │    (Liquid Glass)
│  ┃ ▓▓  ← 😰 😤 😌 😴 🤔 💪 😄 →  ▓▓ ┃  │
│  ┃ ▓▓                            ▓▓ ┃  │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│    ↑ Gradient border (Hopeful = Gold) │
│                                       │
│  Needs Attention                      │
│  ╭─────────────────────────────────╮  │
│  │ ░░ 👤 Mom         2 weeks ago ░░│  │
│  │ ░░    ● Needs attention       ░░│  │
│  ╰─────────────────────────────────╯  │
│                                       │
│  Recent Conversations                 │
│  ╭─────────────────────────────────╮  │
│  │ ░░ 👤 Sarah      Yesterday    ░░│  │
│  │ ░░    Promotion discussion    ░░│  │
│  ╰─────────────────────────────────╯  │
│                                       │
│                              ╭─────╮  │
│                              │ 🎤  │  │
│                              ╰─────╯  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   Today   Circle   Reflect    Me      │
└───────────────────────────────────────┘
```

### 6.3 Web Layout (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │
│  ┃ ▓▓  🌿 Attune       Today   Circle   Reflect   Me            👤 Alex ▓▓ ┃  │
│  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                   ↑ Liquid Glass Header                     │
│                                                                             │
│      ┌─────────────────────────────────────────────────────────────────┐    │
│      │                                                                 │    │
│      │   Good afternoon, Alex                                          │    │
│      │                                                                 │    │
│      │   ┏━━━━━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │    │
│      │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓                            ▓▓ ┃   │    │
│      │   ┃ ▓▓  How are you ▓▓ ┃  ┃ ▓▓    RELATIONSHIP MAP        ▓▓ ┃   │    │
│      │   ┃ ▓▓  feeling?    ▓▓ ┃  ┃ ▓▓                            ▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓      ○ ○        ○ ○         ▓▓ ┃   │    │
│      │   ┃ ▓▓    😌        ▓▓ ┃  ┃ ▓▓     WORK      FAMILY       ▓▓ ┃   │    │
│      │   ┃ ▓▓  Hopeful     ▓▓ ┃  ┃ ▓▓       ╲        ╱           ▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓        ╲ [YOU] ╱            ▓▓ ┃   │    │
│      │   ┃ ▓▓ 😰😤😌😴🤔💪😄 ▓▓ ┃  ┃ ▓▓       ╱       ╲            ▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓     FRIENDS   ACQUAINT      ▓▓ ┃   │    │
│      │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  ┃ ▓▓      ○ ○        ○           ▓▓ ┃   │    │
│      │   ┗━━━━━━━━━━━━━━━━━━━━━┛  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │    │
│      │      ↑ Mood Widget         ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │    │
│      │                                                                 │    │
│      │   ┏━━━━━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │    │
│      │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓                            ▓▓ ┃   │    │
│      │   ┃ ▓▓ Quick Actions▓▓ ┃  ┃ ▓▓  Needs Attention           ▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓                            ▓▓ ┃   │    │
│      │   ┃ ▓▓ 🎤 Talk to Me▓▓ ┃  ┃ ▓▓  👤 Mom         2 weeks    ▓▓ ┃   │    │
│      │   ┃ ▓▓ ➕ Add Person ▓▓ ┃  ┃ ▓▓  👤 Jake        10 days    ▓▓ ┃   │    │
│      │   ┃ ▓▓ 📝 Log Interac▓▓ ┃  ┃ ▓▓                            ▓▓ ┃   │    │
│      │   ┃ ▓▓              ▓▓ ┃  ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃   │    │
│      │   ┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │    │
│      │   ┗━━━━━━━━━━━━━━━━━━━━━┛                                       │    │
│      │                                                                 │    │
│      └─────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ ▓▓  Privacy Policy   Terms of Service   © 2026 Attune                ▓▓ ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                           ↑ Liquid Glass Footer                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Animation Specifications

### 7.1 Page Transitions
```
Type: Slide + Fade
Duration: 300ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Direction: Forward = slide left, Back = slide right
```

### 7.2 Card Interactions
```
Hover (web):
  - transform: translateY(-2px)
  - box-shadow: increase spread by 4px
  - duration: 200ms

Press/Active:
  - transform: scale(0.98)
  - duration: 100ms
```

### 7.3 Mood Widget
```
Auto-cycle:
  - Interval: 2 seconds per emotion
  - Transition: Fade (opacity 0 → 1)
  - Border gradient: Animate color shift 600ms

Selection:
  - Scale bounce: 1.0 → 1.1 → 1.0
  - Duration: 300ms
  - Easing: spring(1, 80, 10)
```

### 7.4 FAB Pulse
```
Idle animation:
  - Box-shadow pulse every 3 seconds
  - Scale: 1.0 → 1.02 → 1.0
  - Duration: 2000ms
  - Easing: ease-in-out

Recording:
  - Expanding rings (3 rings)
  - Ring opacity: 0.4 → 0
  - Ring scale: 1.0 → 2.0
  - Staggered by 400ms
```

### 7.5 Chat Messages
```
Entry animation:
  - Slide up + fade in
  - Duration: 250ms
  - Stagger: 50ms between messages
  - Easing: spring(1, 100, 10)
```

### 7.6 Relationship Map Bubbles
```
Idle:
  - Subtle floating motion
  - Y offset: ±3px
  - Duration: 3-5 seconds (varied per bubble)
  - Easing: ease-in-out

Hover/Focus:
  - Scale: 1.1
  - Glow increase
  - Duration: 200ms
```

---

## 8. Accessibility Specifications

### Color Contrast Requirements
```
All text on liquid glass backgrounds must meet WCAG AA:
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px bold or 24px): 3:1 minimum

Solutions:
- Use darker text (#3D3D3D) on glass backgrounds
- Add subtle dark overlay to glass when needed
- Ensure background blur provides sufficient contrast
```

### Focus States
```
All interactive elements must have visible focus:
- Outline: 2px solid #C4846C (terracotta)
- Outline-offset: 2px
- No outline on mouse click (only keyboard)
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Targets
```
Minimum touch target: 44x44px
Spacing between targets: 8px minimum
FAB size: 56x56px
```

---

## 9. Component Library Summary

| Component | Glass Level | Emotion Border | Animation |
|-----------|-------------|----------------|-----------|
| Header | Light | No | None |
| Footer | Light | No | None |
| Navigation (Mobile) | Medium | No | Tab transition |
| Mood Widget | Medium | Yes (dynamic) | Auto-cycle, selection |
| Person Card | Medium | No | Hover lift |
| Relationship Map | Medium | No | Float, tap |
| Chat Overlay | Frosted | No | Slide in |
| FAB | Medium | No | Pulse, recording rings |
| Modal/Dialog | Frosted | Optional | Fade + scale |
| Toast | Light | No | Slide + fade |
| Button (Primary) | None (solid) | No | Press scale |
| Button (Ghost) | Light | No | Hover fill |
| Input | Light | No | Focus glow |

---

## 10. CSS Implementation Guide

### Base Variables
```css
:root {
  /* Colors */
  --color-cream: #FDF6E3;
  --color-sand: #E8DCC8;
  --color-terracotta: #C4846C;
  --color-clay: #8B6F5C;
  --color-charcoal: #3D3D3D;
  --color-sage: #7D8B6F;

  /* Group Colors */
  --color-work: #5B8FA8;
  --color-family: #C4846C;
  --color-friends: #9B7BB8;
  --color-acquaintances: #7D9B7B;

  /* Glass Properties */
  --glass-blur-light: 8px;
  --glass-blur-medium: 12px;
  --glass-blur-frosted: 16px;

  --glass-bg-light: rgba(253, 246, 227, 0.4);
  --glass-bg-medium: rgba(253, 246, 227, 0.6);
  --glass-bg-frosted: rgba(253, 246, 227, 0.8);

  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-shadow: 0 4px 24px rgba(139, 111, 92, 0.1);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Liquid Glass Utility Classes
```css
.glass-light {
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-medium {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-frosted {
  background: var(--glass-bg-frosted);
  backdrop-filter: blur(var(--glass-blur-frosted));
  -webkit-backdrop-filter: blur(var(--glass-blur-frosted));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-emotion-border {
  border: 2px solid transparent;
  background:
    linear-gradient(var(--glass-bg-medium), var(--glass-bg-medium)) padding-box,
    var(--current-emotion-gradient) border-box;
}
```

---

## 11. Design Approval Checklist

Please review and approve the following aspects:

### Colors
- [ ] Warm earth tone palette (cream, sand, terracotta, clay)
- [ ] Group colors (work=teal, family=terracotta, friends=purple, acquaintances=green)
- [ ] Emotion gradient colors

### Liquid Glass Effects
- [ ] Glass intensity levels (light, medium, frosted)
- [ ] Blur amounts (8px, 12px, 16px)
- [ ] Transparency levels
- [ ] Shadow styling

### Components
- [ ] Mood Widget design (Animo-inspired with emotion borders)
- [ ] Person Card design
- [ ] Relationship Map visualization
- [ ] Chat Overlay design
- [ ] FAB design

### Layouts
- [ ] Mobile layout with bottom navigation
- [ ] Web dashboard layout with widgets
- [ ] Header/Footer design

### Animations
- [ ] Page transitions
- [ ] Card hover/press states
- [ ] Mood widget animations
- [ ] FAB pulse animation
- [ ] Chat message animations

### Accessibility
- [ ] Color contrast compliance
- [ ] Focus state design
- [ ] Touch target sizes
- [ ] Reduced motion support

---

## Sources & Inspiration

- [Glassmorphism in 2025: How Apple's Liquid Glass is reshaping interface design](https://www.everydayux.net/glassmorphism-apple-liquid-glass-interface-design/)
- [UI Design Trend 2026: Glassmorphism and Liquid Design Make a Comeback](https://medium.com/design-bootcamp/ui-design-trend-2026-2-glassmorphism-and-liquid-design-make-a-comeback-50edb60ca81e)
- [Apple's Liquid Glass UI design + CSS guide](https://dev.to/gruszdev/apples-liquid-glass-revolution-how-glassmorphism-is-shaping-ui-design-in-2025-with-css-code-1221)
- [What is Glassmorphism? UI Design Trend 2026](https://www.designstudiouiux.com/blog/what-is-glassmorphism-ui-trend/)
- [10 Mind-Blowing Glassmorphism Examples For 2026](https://onyx8agency.com/blog/glassmorphism-inspiring-examples/)
- [Animo by Jaden Kim](https://jadenkim.design/animo) - Mood widget inspiration

---

*Design Specification Version 1.0*
*Status: AWAITING APPROVAL*
*Please review and provide feedback before implementation begins*
