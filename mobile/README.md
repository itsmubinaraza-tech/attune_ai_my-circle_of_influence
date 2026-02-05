# Attune Mobile App

React Native mobile app for Attune - Your Personal AI Relationship Coach.

## Tech Stack

- **Framework:** React Native with Expo SDK 50
- **Routing:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State:** TanStack React Query
- **Backend:** Supabase
- **Animations:** React Native Reanimated

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Add your Supabase credentials to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Scan the QR code with Expo Go (Android) or Camera (iOS)

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── _layout.tsx    # Tab navigator config
│   │   ├── index.tsx      # Home (Today) screen
│   │   ├── circle.tsx     # Circle screen
│   │   ├── chat.tsx       # Chat screen
│   │   └── profile.tsx    # Profile/Settings screen
│   ├── _layout.tsx        # Root layout
│   └── person/[id].tsx    # Person detail modal
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utilities (Supabase client)
├── assets/                # Images and fonts
├── app.json              # Expo configuration
├── tailwind.config.js    # NativeWind/Tailwind config
└── package.json
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version

## Features

### Implemented
- [x] Tab navigation (Home, Circle, Chat, Profile)
- [x] Home screen with mood/outcome selection
- [x] Circle screen with search and filters
- [x] Chat interface with message bubbles
- [x] Profile/Settings screen
- [x] Haptic feedback
- [x] Animated transitions

### Coming Soon
- [ ] Supabase authentication
- [ ] Real AI chat integration
- [ ] Contact import (native)
- [ ] Push notifications
- [ ] Biometric authentication
- [ ] Voice input

## Building for Production

### EAS Build (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure your project:
   ```bash
   eas build:configure
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios
   ```

4. Build for Android:
   ```bash
   eas build --platform android
   ```

### Local Build

For iOS (requires macOS with Xcode):
```bash
npx expo run:ios
```

For Android:
```bash
npx expo run:android
```

## App Store Submission

See `docs/MOBILE_APP_STRATEGY.md` in the parent directory for detailed app store submission guidelines.

## Shared Code

This mobile app can share code with the web app:
- Services (API calls)
- Hooks (data fetching)
- Types (TypeScript definitions)

Import shared code using the `@shared/*` path alias:
```typescript
import { peopleService } from '@shared/services/people';
```
