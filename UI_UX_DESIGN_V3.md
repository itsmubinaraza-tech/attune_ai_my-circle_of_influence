# Attune - UI/UX Design Specification V3
## Final Design with 6 Themes & Emotion Glow Effect

> **Version:** 3.0 | **Date:** January 31, 2026
> **Updates:** Ocean Depth theme, inner emotion glow, Intended Outcome widget
> **Status:** READY FOR VISUAL MOCKUPS

---

## 1. Six Dynamic Background Themes

### Theme 1: Warm Earth (Default)
```css
.theme-warm-earth {
  --bg-gradient: linear-gradient(135deg, #FDF6E3 0%, #E8DCC8 50%, #D4C4B0 100%);
  --glass-bg: rgba(253, 246, 227, 0.6);
  --glass-border: rgba(255, 255, 255, 0.3);
  --text-primary: #3D3D3D;
  --accent: #C4846C;
}
```
**Mood:** Nurturing, grounded, calm

---

### Theme 2: Modern Dark Mode
```css
.theme-dark-mode {
  --bg-gradient: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1F1F1F 100%);
  --glass-bg: rgba(45, 45, 45, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
  --text-primary: #F5F5F5;
  --accent: #C4846C;
}
```
**Mood:** Sleek, focused, professional

---

### Theme 3: Dark Purple Hues
```css
.theme-dark-purple {
  --bg-gradient: linear-gradient(135deg, #1A1625 0%, #2D2640 50%, #1F1A2E 100%);
  --glass-bg: rgba(45, 38, 64, 0.7);
  --glass-border: rgba(155, 123, 184, 0.2);
  --text-primary: #F0EDF5;
  --accent: #9B7BB8;
}
```
**Mood:** Creative, introspective, mysterious

---

### Theme 4: Ocean Depth (NEW)
```
┌─────────────────────────────────────────────────────────────────┐
│  OCEAN DEPTH THEME                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Background: Vibrant teal to deep purple gradient               │
│                                                                 │
│  ████████████████████████████████████████████████████████████   │
│  ██  #30CFD0 (Bright Teal) ─────────────► #330867 (Deep)   ██   │
│  ████████████████████████████████████████████████████████████   │
│                                                                 │
│  Glass Panel: rgba(48, 207, 208, 0.15) - teal tinted            │
│  Glass Border: rgba(48, 207, 208, 0.3)                          │
│  Text Color: #FFFFFF (White)                                    │
│  Accent: #30CFD0 (Bright Teal)                                  │
│                                                                 │
│  Mood: Energizing, fresh, modern, dynamic                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```css
.theme-ocean-depth {
  --bg-gradient: linear-gradient(135deg, #30CFD0 0%, #1A6B7C 40%, #330867 100%);
  --glass-bg: rgba(48, 207, 208, 0.15);
  --glass-border: rgba(48, 207, 208, 0.3);
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --accent: #30CFD0;
}
```

---

### Theme 5: Serene Nature (Static Image)
```css
.theme-serene-nature {
  --bg-image: url('/backgrounds/mountain-lake.jpg');
  --bg-overlay: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2));
  --glass-bg: rgba(240, 245, 250, 0.5);
  --text-primary: #2D3748;
  --accent: #5B8FA8;
}
```
**Image options:** Mountain lake, misty forest, Japanese garden

---

### Theme 6: Calming Video
```css
.theme-calming-video {
  --glass-bg: rgba(255, 255, 255, 0.3);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-primary: #FFFFFF;
  --accent: #C4846C;
}
```
**Video options:** Ocean waves, clouds, aurora, rain, fireplace, river

---

## 2. Emotion Glow Effect (Mood Widget + Outcome Widget)

### Design Concept: Side-Only Organic Inner Glow

The emotion color creates a **soft organic gradient glow** on the **LEFT and RIGHT sides only** (not top/bottom). The glow has an organic, curved shape that fades naturally toward the center.

### Applied To:
1. **Mood Widget** - Primary emotion display
2. **Intended Outcome Widget** - When actively selecting

```
┌─────────────────────────────────────────────────────────────────┐
│  EMOTION SIDE GLOW EFFECT (Organic Shape)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╭─────────────────────────────────────────────────────────╮    │
│  │                                                         │    │
│  │ ▓▓▓                                               ▓▓▓  │    │
│  │ ▓▓▓▓▒▒                                         ▒▒▓▓▓▓  │    │
│  │ ▓▓▓▓▓▒▒▒░                                   ░▒▒▒▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▒▒▒░░                               ░░▒▒▒▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▒▒▒░░                             ░░▒▒▒▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▓▒▒░░   How are you feeling?    ░░▒▒▓▓▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▓▓▒░░                           ░░▒▓▓▓▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▓▓▓░░          😌              ░░▓▓▓▓▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▓▓▓░░       Hopeful            ░░▓▓▓▓▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▓▓▒░░                           ░░▒▓▓▓▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▓▒▒░░                           ░░▒▒▓▓▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▓▒▒▒░░  ← 😰 😤 😌 😴 🤔 💪 → ░░▒▒▒▓▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▓▒▒▒░░                               ░░▒▒▒▓▓▓▓▓▓  │    │
│  │ ▓▓▓▓▓▒▒▒░                                   ░▒▒▒▓▓▓▓▓  │    │
│  │ ▓▓▓▓▒▒                                         ▒▒▓▓▓▓  │    │
│  │ ▓▓▓                                               ▓▓▓  │    │
│  │                                                         │    │
│  ╰─────────────────────────────────────────────────────────╯    │
│                                                                 │
│  KEY FEATURES:                                                  │
│  • Glow only on LEFT and RIGHT sides                           │
│  • TOP and BOTTOM remain clear (no glow)                       │
│  • Organic curved shape (like a soft wave/lens)                │
│  • Gradient fades from edge → 25% toward center                │
│  • Shape is elliptical/organic, NOT rectangular                │
│                                                                 │
│  LEGEND:                                                        │
│  ▓▓ = Strong emotion color (outer edge)                         │
│  ▒▒ = Medium emotion color (fading)                             │
│  ░░ = Light emotion tint (inner fade)                           │
│      = Clear glass center (content area)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Shape Reference

```
                    TOP (No glow - clear)
           ╭───────────────────────────────╮
           │                               │
     LEFT  │                               │  RIGHT
     GLOW  │                               │  GLOW
           │                               │
    ▓▓▒░   │       CONTENT AREA           │   ░▒▓▓
    ▓▓▓▒░  │                               │  ░▒▓▓▓
    ▓▓▓▓▒░ │                               │ ░▒▓▓▓▓
    ▓▓▓▓▓▒ │         (Clear Glass)        │ ▒▓▓▓▓▓
    ▓▓▓▓▒░ │                               │ ░▒▓▓▓▓
    ▓▓▓▒░  │                               │  ░▒▓▓▓
    ▓▓▒░   │                               │   ░▒▓▓
           │                               │
           │                               │
           ╰───────────────────────────────╯
                   BOTTOM (No glow - clear)

    The glow has an organic, curved/elliptical shape
    that's thickest at the vertical center and
    tapers toward top and bottom edges.
```

### CSS Implementation

```css
/* Base widget styles */
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
  width: 25%; /* 1/4 of widget width */
  height: 70%; /* Doesn't reach top/bottom */
  background: radial-gradient(
    ellipse at left center,
    var(--emotion-color) 0%,
    var(--emotion-color-medium) 30%,
    var(--emotion-color-light) 60%,
    transparent 100%
  );
  border-radius: 0 50% 50% 0; /* Organic curved shape */
  pointer-events: none;
  opacity: 0.7;
  transition: all 0.6s ease;
}

/* Right side organic glow */
.emotion-glow-widget::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 25%; /* 1/4 of widget width */
  height: 70%; /* Doesn't reach top/bottom */
  background: radial-gradient(
    ellipse at right center,
    var(--emotion-color) 0%,
    var(--emotion-color-medium) 30%,
    var(--emotion-color-light) 60%,
    transparent 100%
  );
  border-radius: 50% 0 0 50%; /* Organic curved shape */
  pointer-events: none;
  opacity: 0.7;
  transition: all 0.6s ease;
}

/* Emotion color variables (example: Hopeful - Warm Gold) */
.emotion-hopeful {
  --emotion-color: #D4A87A;
  --emotion-color-medium: rgba(212, 168, 122, 0.5);
  --emotion-color-light: rgba(212, 168, 122, 0.2);
}

/* Animation: Subtle pulse on the glow */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

.emotion-glow-widget::before,
.emotion-glow-widget::after {
  animation: glow-pulse 4s ease-in-out infinite;
}
```

### Alternative CSS (Using Box Shadows)

```css
/* Simpler implementation using inset box-shadows */
.emotion-glow-widget {
  box-shadow:
    /* Left glow */
    inset 80px 0 60px -40px var(--emotion-color-light),
    inset 40px 0 30px -20px var(--emotion-color-medium),
    /* Right glow */
    inset -80px 0 60px -40px var(--emotion-color-light),
    inset -40px 0 30px -20px var(--emotion-color-medium);
}
```

### Emotion Color Glow Values

| Emotion | Color | Glow Effect |
|---------|-------|-------------|
| Confident | #7D9B7B | Soft sage green inner glow |
| Anxious | #9B8B9B | Muted lavender inner glow |
| Frustrated | #C4846C | Warm terracotta inner glow |
| Hopeful | #D4A87A | Warm gold inner glow |
| Tired | #8B8B8B | Soft gray inner glow |
| Uncertain | #8B9BAB | Steel blue inner glow |
| Determined | #8B6B5C | Deep clay inner glow |
| Excited | #C49B6C | Bright amber inner glow |

---

## 3. Complete Mobile Layout with Intended Outcome Widget

### Mobile - Today Page (Complete with All Widgets)

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░ STATUS BAR ░░░░░░░░░░░░░░░░│
├─────────────────────────────────────────┤
│                                         │
│  Good morning, Alex 👋                  │
│  Wednesday, January 31                  │
│                                         │
│  ════════════════════════════════════   │
│  WIDGET 1: MOOD WIDGET (Liquid Glass)   │
│  With LEFT/RIGHT Organic Emotion Glow   │
│  ════════════════════════════════════   │
│  ╭─────────────────────────────────────╮│
│  │                                     ││  ← Top: NO glow
│  │▓▓▓░                           ░▓▓▓ ││
│  │▓▓▓▓▒░                       ░▒▓▓▓▓ ││  ← Organic curved
│  │▓▓▓▓▓▒░                     ░▒▓▓▓▓▓ ││     glow shape
│  │▓▓▓▓▓▓░  How are you feeling? ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓▓░                   ░▓▓▓▓▓▓▓ ││  LEFT     RIGHT
│  │▓▓▓▓▓▓▓▓░       😌        ░▓▓▓▓▓▓▓▓ ││  GLOW     GLOW
│  │▓▓▓▓▓▓▓▓░    Hopeful      ░▓▓▓▓▓▓▓▓ ││  (Gold)   (Gold)
│  │▓▓▓▓▓▓▓░                   ░▓▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓░ ← 😰😤😌😴🤔💪😄 → ░▓▓▓▓▓▓ ││  Horizontal scroll
│  │▓▓▓▓▓▒░      ○ ○ ● ○ ○ ○    ░▒▓▓▓▓▓ ││
│  │▓▓▓▓▒░                       ░▒▓▓▓▓ ││
│  │▓▓▓░                           ░▓▓▓ ││
│  │                                     ││  ← Bottom: NO glow
│  ╰─────────────────────────────────────╯│
│                                         │
│  ════════════════════════════════════   │
│  WIDGET 2: INTENDED OUTCOME             │
│  With LEFT/RIGHT Organic Emotion Glow   │
│  ════════════════════════════════════   │
│  ╭─────────────────────────────────────╮│
│  │                                     ││  ← Top: NO glow
│  │▓▓▓░                           ░▓▓▓ ││
│  │▓▓▓▓▒░ What outcome do you    ░▒▓▓▓▓ ││  ← Organic curved
│  │▓▓▓▓▓▒░ want today?          ░▒▓▓▓▓▓ ││     glow shape
│  │▓▓▓▓▓▓░                       ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓▓░ Who?                ░▓▓▓▓▓▓▓ ││  LEFT     RIGHT
│  │▓▓▓▓▓▓▓▓░┌─────────────────┐░▓▓▓▓▓▓▓▓ ││  GLOW     GLOW
│  │▓▓▓▓▓▓▓▓░│🔍 Select person │░▓▓▓▓▓▓▓▓ ││  (Gold)   (Gold)
│  │▓▓▓▓▓▓▓▓░└─────────────────┘░▓▓▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓▓░                     ░▓▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▓░ Outcome:              ░▓▓▓▓▓▓ ││
│  │▓▓▓▓▓▒░ [Make a    ] [Hard   ]░▒▓▓▓▓▓ ││  Outcome chips
│  │▓▓▓▓▒░  [connection] [talk   ]░▒▓▓▓▓ ││
│  │▓▓▓░    [Influence ] [Feedbk ]  ░▓▓▓ ││
│  │                                     ││
│  │        ┌───────────────────┐        ││  Start button
│  │        │  ▶ Start Coaching │        ││
│  │        └───────────────────┘        ││
│  │                                     ││  ← Bottom: NO glow
│  ╰─────────────────────────────────────╯│
│                                         │
│  ════════════════════════════════════   │
│  WIDGET 3: NEEDS ATTENTION              │
│  ════════════════════════════════════   │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Needs Attention       See all░░ ││  Liquid glass
│  │ ░░                               ░░ ││
│  │ ░░  ╭────╮                       ░░ ││
│  │ ░░  │ 👩 │ Mom        2 weeks    ░░ ││  Person mini-card
│  │ ░░  ╰────╯ ○ Needs attention     ░░ ││
│  │ ░░                               ░░ ││
│  │ ░░  ╭────╮                       ░░ ││
│  │ ░░  │ 👨 │ Jake       10 days    ░░ ││
│  │ ░░  ╰────╯ ○ Stable              ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  ════════════════════════════════════   │
│  WIDGET 4: RECENT SESSIONS              │
│  ════════════════════════════════════   │
│  ╭─────────────────────────────────────╮│
│  │ ░░  Recent Sessions       See all░░ ││  Liquid glass
│  │ ░░                               ░░ ││
│  │ ░░  👤 Sarah - Promotion talk    ░░ ││
│  │ ░░     Yesterday                 ░░ ││
│  │ ░░                               ░░ ││
│  │ ░░  👤 Mom - Birthday planning   ░░ ││
│  │ ░░     3 days ago                ░░ ││
│  ╰─────────────────────────────────────╯│
│                                         │
│                                         │
│                            ╭─────────╮  │
│                            │   🎤    │  │  FAB
│                            ╰─────────╯  │
│                                         │
├─────────────────────────────────────────┤
│  ╭─────────────────────────────────────╮│
│  │ ░░  🏠     👥     📝     👤     ░░ ││  Bottom nav
│  │ ░░ Today  Circle Reflect  Me    ░░ ││  (Liquid glass)
│  │ ░░   ●      ○      ○      ○     ░░ ││
│  ╰─────────────────────────────────────╯│
├─────────────────────────────────────────┤
│         ▬▬▬ HOME INDICATOR ▬▬▬         │
└─────────────────────────────────────────┘
```

### Intended Outcome Widget - Expanded View

When user selects a person, the outcome options adapt to their group:

```
┌─────────────────────────────────────────┐
│  INTENDED OUTCOME WIDGET (Expanded)     │
├─────────────────────────────────────────┤
│  ╭─────────────────────────────────────╮│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░                                ░░ ││
│  │ ░░   What outcome do you want     ░░ ││
│  │ ░░   with Sarah?                  ░░ ││
│  │ ░░                                ░░ ││
│  │ ░░   ╭────╮                       ░░ ││
│  │ ░░   │ 👩 │ Sarah Mitchell        ░░ ││  Selected person
│  │ ░░   ╰────╯ Manager • Work    ✕   ░░ ││  (can change)
│  │ ░░                                ░░ ││
│  │ ░░   ─────────────────────────────░░ ││
│  │ ░░                                ░░ ││
│  │ ░░   Work Outcomes:               ░░ ││  Contextual options
│  │ ░░                                ░░ ││  (based on group)
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │ 💼 Get buy-in/approval    │░░ ││
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │ 🎯 Influence a decision   │░░ ││  ← Selected
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │ 💬 Navigate hard feedback │░░ ││
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │ 🤝 Build an alliance      │░░ ││
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │ 📋 Request resources      │░░ ││
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░                                ░░ ││
│  │ ░░   Or describe your situation: ░░ ││
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │ Type your scenario...     │░░ ││  Free text option
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░                                ░░ ││
│  │ ░░   ┌───────────────────────────┐░░ ││
│  │ ░░   │    ▶ Start Coaching       │░░ ││  CTA button
│  │ ░░   └───────────────────────────┘░░ ││
│  │ ░░                                ░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  ╰─────────────────────────────────────╯│
└─────────────────────────────────────────┘
```

### Outcome Options by Group

| Work | Family | Friends | Acquaintances |
|------|--------|---------|---------------|
| Get buy-in | Strengthen bond | Reconnect | Get to know better |
| Influence decision | Resolve conflict | Support them | Find common ground |
| Navigate feedback | Set boundaries | Plan together | Make impression |
| Build alliance | Express love | Deep conversation | Establish rapport |
| Request resources | Seek understanding | Address tension | Explore potential |
| Negotiate terms | Share news | Celebrate | Evaluate fit |

---

## 4. Web Dashboard with All Widgets

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ╭────────────────────────────────────────────────────────────────────────────────╮│
│  │ ░░ 🌿 Attune              Today    Circle    Reflect    Me          👤 Alex ░░ ││
│  │ ░░                          ●        ○          ○        ○                   ░░ ││
│  ╰────────────────────────────────────────────────────────────────────────────────╯│
│                                                                                    │
│     ┌──────────────────────────────────────────────────────────────────────────┐   │
│     │                                                                          │   │
│     │   Good afternoon, Alex • Wednesday, January 31                           │   │
│     │                                                                          │   │
│     │   ┌───────────────────────────┐  ┌───────────────────────────────────┐   │   │
│     │   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   │▓▓                      ▓▓│  │ ░░                              ░░ │   │   │
│     │   │▓▓  How are you feeling?▓▓│  │ ░░     INTENDED OUTCOME          ░░ │   │   │
│     │   │▓▓                      ▓▓│  │ ░░                              ░░ │   │   │
│     │   │▓▓        😌            ▓▓│  │ ░░  Who? [🔍 Select person... ]  ░░ │   │   │
│     │   │▓▓     Hopeful          ▓▓│  │ ░░                              ░░ │   │   │
│     │   │▓▓                      ▓▓│  │ ░░  Outcome:                     ░░ │   │   │
│     │   │▓▓  😰 😤 😌 😴 🤔 💪 😄▓▓│  │ ░░  [Make a connection]          ░░ │   │   │
│     │   │▓▓                      ▓▓│  │ ░░  [Navigate hard talk]         ░░ │   │   │
│     │   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │ ░░  [Influence decision]         ░░ │   │   │
│     │   │    MOOD WIDGET           │  │ ░░                              ░░ │   │   │
│     │   │    (Emotion inner glow)  │  │ ░░  [▶ Start Coaching]           ░░ │   │   │
│     │   └───────────────────────────┘  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │                                  └───────────────────────────────────┘   │   │
│     │                                                                          │   │
│     │   ┌───────────────────────────────────────────────────────────────────┐  │   │
│     │   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │   │
│     │   │ ░░                                                              ░░ │  │   │
│     │   │ ░░                    RELATIONSHIP MAP                          ░░ │  │   │
│     │   │ ░░                                                              ░░ │  │   │
│     │   │ ░░          ○○○○                           ○○○                  ░░ │  │   │
│     │   │ ░░         ○WORK○                        ○FAMILY○               ░░ │  │   │
│     │   │ ░░          ○○○○                           ○○○                  ░░ │  │   │
│     │   │ ░░             ╲                           ╱                    ░░ │  │   │
│     │   │ ░░              ╲         ╭─────╮        ╱                      ░░ │  │   │
│     │   │ ░░               ╲        │ YOU │       ╱                       ░░ │  │   │
│     │   │ ░░                ────────│     │───────                        ░░ │  │   │
│     │   │ ░░               ╱        ╰─────╯       ╲                       ░░ │  │   │
│     │   │ ░░              ╱                        ╲                      ░░ │  │   │
│     │   │ ░░             ╱                          ╲                     ░░ │  │   │
│     │   │ ░░          ○○○○                           ○○                   ░░ │  │   │
│     │   │ ░░        ○FRIENDS○                    ○ACQUAINT○               ░░ │  │   │
│     │   │ ░░          ○○○○                           ○○                   ░░ │  │   │
│     │   │ ░░                                                              ░░ │  │   │
│     │   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │   │
│     │   └───────────────────────────────────────────────────────────────────┘  │   │
│     │                                                                          │   │
│     │   ┌───────────────────────────┐  ┌───────────────────────────────────┐   │   │
│     │   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   │ ░░ Needs Attention     ░░ │  │ ░░ Recent Sessions             ░░ │   │   │
│     │   │ ░░                     ░░ │  │ ░░                             ░░ │   │   │
│     │   │ ░░ 👩 Mom     2 weeks  ░░ │  │ ░░ 👩 Sarah - Promotion        ░░ │   │   │
│     │   │ ░░ 👨 Jake    10 days  ░░ │  │ ░░    Yesterday                ░░ │   │   │
│     │   │ ░░ 👴 Uncle   1 month  ░░ │  │ ░░ 👩 Mom - Birthday           ░░ │   │   │
│     │   │ ░░                     ░░ │  │ ░░    3 days ago               ░░ │   │   │
│     │   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │   │
│     │   └───────────────────────────┘  └───────────────────────────────────┘   │   │
│     │                                                                          │   │
│     └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ╭────────────────────────────────────────────────────────────────────────────────╮│
│  │ ░░    Privacy Policy    Terms of Service    Contact    © 2026 Attune        ░░ ││
│  ╰────────────────────────────────────────────────────────────────────────────────╯│
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Component Summary

### All Liquid Glass Components

| Component | Glass Level | Special Effect |
|-----------|-------------|----------------|
| Mood Widget | Medium (60%) | **LEFT/RIGHT organic emotion glow** |
| Intended Outcome Widget | Medium (60%) | **LEFT/RIGHT organic emotion glow** |
| Needs Attention Widget | Medium (60%) | Standard glass |
| Recent Sessions Widget | Medium (60%) | Standard glass |
| Relationship Map | Medium (60%) | Standard glass |
| Person Cards | Medium (60%) | Standard glass |
| Header (Web) | Light (40%) | Standard glass |
| Footer (Web) | Light (40%) | Standard glass |
| Bottom Nav (Mobile) | Light (40%) | Standard glass |
| Chat Overlay | Frosted (80%) | Heavy blur |
| Search Bar | Light (40%) | Standard glass |
| FAB Button | Solid gradient | Pulse animation |

### Emotion Glow Details
- **Widgets with glow:** Mood Widget + Intended Outcome Widget
- **Glow position:** LEFT and RIGHT sides only (not top/bottom)
- **Glow shape:** Organic/curved (like soft lens flare)
- **Glow extent:** ~25% (1/4) from edge toward center
- **Glow height:** ~70% of widget height (tapers at top/bottom)

---

## 6. Visual Mockup Requirements

To create high-fidelity visual mockups before development, I recommend using:

### Option A: Figma (Recommended)
- Create components with glass effects using:
  - Background blur (8-16px)
  - Fill with transparency (40-80%)
  - Subtle borders
  - Drop shadows
- Use plugins: "Glass" or "Glassmorphism" for effects

### Option B: Design Tool Prompts
If you'd like, I can provide detailed prompts for AI design tools like:
- Midjourney
- DALL-E
- Figma AI

### Mockups Needed:
1. Mobile - Today page (all widgets)
2. Mobile - Circle page
3. Mobile - Person profile
4. Mobile - Chat overlay
5. Web - Dashboard
6. Theme variations (all 6 themes)
7. Emotion glow states (all 8 emotions)

---

## 7. Final Approval Checklist

### Themes (6 Total)
- [ ] Warm Earth (default)
- [ ] Modern Dark Mode
- [ ] Dark Purple Hues
- [ ] Ocean Depth (#30cfd0 → #330867) **NEW**
- [ ] Serene Nature (image)
- [ ] Calming Video (animated)

### Widgets
- [ ] Mood Widget with inner emotion glow
- [ ] Intended Outcome Widget **NEW**
- [ ] Needs Attention Widget
- [ ] Recent Sessions Widget
- [ ] Relationship Map Widget
- [ ] Person Cards

### Emotion Glow
- [ ] LEFT and RIGHT sides only (not top/bottom)
- [ ] Organic curved shape (not rectangular)
- [ ] Extends 1/4 (25%) from edges toward center
- [ ] Applies to Mood Widget AND Outcome Widget
- [ ] All 8 emotion colors defined with gradient values

### Layouts
- [ ] Mobile Today page with all widgets
- [ ] Web Dashboard with all widgets
- [ ] All widgets use liquid glass

---

*Design Specification Version 3.0*
*Status: READY FOR VISUAL MOCKUPS*
*Next Step: Create high-fidelity mockups in Figma or preferred tool*
