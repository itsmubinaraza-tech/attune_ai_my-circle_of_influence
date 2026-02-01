# Attune - My Circle of Influence

An emotional intelligence app that helps you connect with intention and strengthen your relationships.

## Features

- **Mood Tracking**: Check in with your current emotional state with auto-cycling mood selector
- **Person Search**: Find and select people from your circle of influence with keyboard navigation
- **Outcome Selection**: Choose your desired outcome for each interaction
- **Relationship Map**: Interactive visual representation of your connections with group filtering
- **Needs Attention**: Track relationships that need nurturing with call/message integration
- **Smart Messaging**: AI-generated personalized reconnection messages
- **Theme Support**: Multiple beautiful themes including dark purple, ocean depth, and more

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with glassmorphism design
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/attune-my-circle.git

# Navigate to the project directory
cd attune-my-circle

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/
│   ├── attune/          # Main app components
│   │   ├── MoodSelector.tsx
│   │   ├── PersonSearch.tsx
│   │   ├── OutcomeSelector.tsx
│   │   └── ThemeSelector.tsx
│   └── ui/              # Reusable UI components (shadcn/ui)
├── pages/
│   └── Index.tsx        # Main page
├── lib/                 # Utility functions
└── hooks/               # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License

## Author

Attune AI Team
