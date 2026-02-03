# Attune - Mobile App Strategy

## Overview

This document outlines the mobile app strategy for Attune, covering both Progressive Web App (PWA) enhancements and a future React Native implementation.

---

## Phase 1: PWA Enhancements (Current)

### What's Been Implemented

#### 1. Web App Manifest (`public/manifest.json`)
- App name, description, and branding
- Icon definitions for all sizes (72x72 to 512x512)
- Display mode: standalone (fullscreen app experience)
- Theme and background colors
- App shortcuts for Quick Talk, Circle, and Chat
- Screenshot definitions for app stores

#### 2. Service Worker (`public/sw.js`)
- Static asset caching on install
- Network-first strategy for API calls
- Cache-first strategy for static assets
- Offline fallback page
- Push notification support (ready for future use)
- Background sync capability (ready for future use)

#### 3. Enhanced Index.html
- Full PWA meta tags
- Apple-specific meta tags for iOS
- Apple touch icons and splash screens
- Microsoft tile configuration
- Service worker registration

#### 4. React PWA Hooks (`src/hooks/usePWA.ts`)
- `usePWA()` - Install prompt, online status, update detection
- `useOfflineSync()` - Queue actions for offline sync

#### 5. PWA Components (`src/components/attune/InstallPrompt.tsx`)
- `InstallPrompt` - Prompts users to install the app
- `OfflineIndicator` - Shows online/offline status
- `UpdatePrompt` - Notifies users of app updates

### Assets Needed

Generate the following icons from your logo:

```
public/icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
├── icon-512x512.png
├── shortcut-talk.png (96x96)
├── shortcut-circle.png (96x96)
└── shortcut-chat.png (96x96)

public/splash/
├── apple-splash-2048-2732.png (iPad Pro 12.9")
├── apple-splash-1170-2532.png (iPhone 14)
└── apple-splash-1125-2436.png (iPhone X/XS)

public/
├── og-image.png (1200x630)
└── screenshots/
    ├── home-mobile.png (390x844)
    └── chat-mobile.png (390x844)
```

**Icon Generation Tools:**
- [PWA Asset Generator](https://github.com/nicolo-ribaudo/pwa-asset-generator)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [Maskable.app](https://maskable.app/) for maskable icons

### PWA Integration Steps

1. **Add InstallPrompt to App.tsx:**
```tsx
import { InstallPrompt, OfflineIndicator, UpdatePrompt } from '@/components/attune/InstallPrompt';

function App() {
  return (
    <>
      <OfflineIndicator />
      {/* ... your app routes ... */}
      <InstallPrompt delay={60000} />
      <UpdatePrompt />
    </>
  );
}
```

2. **Test PWA locally:**
```bash
npm run build
npm run preview
```

3. **Lighthouse PWA Audit:**
   - Open Chrome DevTools → Lighthouse
   - Run PWA audit
   - Target score: 90+

### PWA Capabilities

| Feature | Status | Notes |
|---------|--------|-------|
| Installable | ✅ Ready | manifest.json configured |
| Offline Support | ✅ Ready | Service worker with caching |
| Push Notifications | 🔧 Prepared | Infrastructure ready, needs backend |
| Background Sync | 🔧 Prepared | Hooks ready, needs implementation |
| Voice Input | ✅ Works | Web Speech API (existing) |
| Camera Access | ⏳ Future | For profile photos |
| Geolocation | ⏳ Future | For location-based features |

---

## Phase 2: React Native App (Future)

### Recommended Approach: React Native with Expo

**Why React Native?**
- Share business logic with web app
- Native performance and feel
- Access to native APIs (notifications, contacts, etc.)
- Single codebase for iOS and Android

**Why Expo?**
- Faster development with managed workflow
- Easy OTA updates
- Built-in libraries for common features
- EAS Build for app store submissions

### Project Structure

```
attune-mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx      # Home/Mood screen
│   │   ├── circle.tsx     # Circle screen
│   │   ├── chat.tsx       # Chat screen
│   │   └── _layout.tsx    # Tab navigator
│   ├── person/[id].tsx    # Person profile
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx
├── components/
│   ├── ui/                # Shared UI components
│   └── attune/            # Feature components
├── hooks/                 # Custom hooks (can share with web)
├── services/              # API services (can share with web)
├── lib/                   # Utilities
├── constants/             # Theme, colors, config
├── assets/               # Images, fonts
├── app.json              # Expo config
└── package.json
```

### Shared Code Strategy

Create a shared package for logic that works on both web and mobile:

```
packages/
├── shared/
│   ├── services/          # API calls, business logic
│   │   ├── ai.ts
│   │   ├── people.ts
│   │   ├── interactions.ts
│   │   └── reminders.ts
│   ├── hooks/             # Data hooks
│   │   ├── usePeople.ts
│   │   ├── useChat.ts
│   │   └── useCredits.ts
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── web/                   # Current Vite app
└── mobile/                # React Native app
```

### Key Dependencies

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "react-native": "0.73.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    "@tanstack/react-query": "^5.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "expo-speech": "~12.0.0",
    "expo-av": "~14.0.0",
    "expo-notifications": "~0.27.0",
    "expo-contacts": "~13.0.0",
    "expo-haptics": "~13.0.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-gesture-handler": "~2.14.0",
    "nativewind": "^4.0.0"
  }
}
```

### Native Features to Implement

#### 1. Voice Input (Enhanced)
```tsx
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// Native speech recognition with better accuracy
// Expo doesn't have built-in speech-to-text, use:
// - @react-native-voice/voice
// - expo-speech for TTS only
```

#### 2. Push Notifications
```tsx
import * as Notifications from 'expo-notifications';

// Register for push notifications
const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    // Send token to backend
  }
};
```

#### 3. Contacts Import (Native)
```tsx
import * as Contacts from 'expo-contacts';

const importContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === 'granted') {
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.FirstName,
        Contacts.Fields.LastName,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails,
        Contacts.Fields.Company,
        Contacts.Fields.JobTitle,
      ],
    });
    return data;
  }
};
```

#### 4. Haptic Feedback
```tsx
import * as Haptics from 'expo-haptics';

// Light feedback on button press
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Success feedback
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

#### 5. Biometric Authentication
```tsx
import * as LocalAuthentication from 'expo-local-authentication';

const authenticate = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Attune',
      fallbackLabel: 'Use passcode',
    });
    return result.success;
  }
  return false;
};
```

### UI Component Mapping

| Web (shadcn/ui) | React Native |
|-----------------|--------------|
| Button | Pressable + styled |
| Card | View + shadow |
| Dialog | Modal |
| Input | TextInput |
| Toast | react-native-toast-message |
| Motion (Framer) | Reanimated |
| Icons (Lucide) | lucide-react-native |

### Navigation Structure

```tsx
// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Users, MessageCircle, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#8B5CF6',
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Circle',
          tabBarIcon: ({ color }) => <Users color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Talk',
          tabBarIcon: ({ color }) => <MessageCircle color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Styling with NativeWind

NativeWind brings Tailwind CSS to React Native:

```tsx
// tailwind.config.js (for NativeWind)
module.exports = {
  content: ['./app/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#D946EF',
        background: '#0f0a1a',
      },
    },
  },
};

// Usage in components
<View className="flex-1 bg-background p-4">
  <Text className="text-white text-xl font-bold">Hello</Text>
</View>
```

---

## Phase 3: App Store Deployment

### iOS App Store

1. **Apple Developer Account** ($99/year)
2. **App Store Connect** setup
3. **EAS Build** for iOS:
   ```bash
   eas build --platform ios
   eas submit --platform ios
   ```

**Required Assets:**
- App icon (1024x1024)
- Screenshots (6.5", 5.5", iPad)
- App description, keywords
- Privacy policy URL
- Support URL

### Google Play Store

1. **Google Play Developer Account** ($25 one-time)
2. **Play Console** setup
3. **EAS Build** for Android:
   ```bash
   eas build --platform android
   eas submit --platform android
   ```

**Required Assets:**
- Feature graphic (1024x500)
- App icon (512x512)
- Screenshots (phone, tablet)
- Short/long description
- Privacy policy URL

### App Store Optimization (ASO)

**Keywords to target:**
- Relationship coach
- Communication skills
- Emotional intelligence
- AI coaching
- Personal development
- Networking app
- Social skills

**App Store Description Template:**
```
Attune - Your Personal AI Relationship Coach

Build stronger connections with the people who matter most. Attune provides specific, actionable guidance on:

✓ What to say in difficult conversations
✓ How to say it (tone, body language, timing)
✓ What responses to expect
✓ Expert perspectives from 10 thought leaders

Features:
• Quick Talk - Voice-first coaching in seconds
• Circle - Organize and track your relationships
• Smart Insights - AI-powered relationship analysis
• Reminders - Never forget to reach out

Whether you're navigating workplace dynamics, strengthening family bonds, or deepening friendships, Attune helps you communicate with confidence.

Start free. Upgrade for unlimited coaching.
```

---

## Development Timeline

### Phase 1: PWA (Current - Week 1-2)
- [x] Manifest and service worker
- [x] PWA meta tags
- [x] Install prompt component
- [x] Offline indicator
- [ ] Generate icon assets
- [ ] Lighthouse audit and optimization
- [ ] Test on various devices

### Phase 2: React Native Setup (Week 3-4)
- [ ] Initialize Expo project
- [ ] Set up shared package structure
- [ ] Configure NativeWind
- [ ] Implement navigation
- [ ] Port core components

### Phase 3: Native Features (Week 5-8)
- [ ] Native contacts import
- [ ] Push notifications
- [ ] Voice input enhancement
- [ ] Biometric auth
- [ ] Haptic feedback
- [ ] Deep linking

### Phase 4: App Store Launch (Week 9-12)
- [ ] App store assets
- [ ] Beta testing (TestFlight, Play Console)
- [ ] App store submissions
- [ ] Marketing launch

---

## Cost Considerations

| Item | Cost |
|------|------|
| Apple Developer | $99/year |
| Google Play Developer | $25 one-time |
| Expo EAS | $0 (free tier) to $99/month |
| Push Notifications (OneSignal) | Free tier available |
| **Total (Year 1)** | ~$125-225 |

---

## Metrics to Track

### PWA Metrics
- Install rate (beforeinstallprompt → installed)
- Offline usage
- Return visits from home screen
- Time in app (standalone vs browser)

### App Store Metrics
- Downloads
- Retention (D1, D7, D30)
- Crash-free rate
- Store rating
- Keyword rankings

---

*Last Updated: February 2, 2026*
