# HavenlyAPP

HavenlyAPP is a web app built for teen emotional support. Its core features are mood tracking, AI companionship, garden growth, and trend insights.

Project goals:
- Provide a low-friction, sustainable daily mood check-in flow
- Increase long-term engagement through lightweight interactions like chat and a garden system
- Offer supportive conversations within safe boundaries, without providing medical diagnosis

## Current Implementation

### 1. Pages and Main Flow

Five main pages are implemented and switched through the bottom navigation:
- Home: entry point, age switching, language switching, quick action cards
- Mood: emotion selection, optional notes/journal, persistent storage
- Chat: conversation with an AI companion with history context support
- Garden: pet and plant progression, unlocking, feeding, and watering
- Insights: 7-day calendar view, mood distribution, recent records, summary insights

### 2. Age Segmentation

Three age modes are supported:
- toddler
- kid
- teen

Differentiated behavior is implemented for each mode:
- Mood page content and guidance copy are age-aware
- Chat system prompts are age-aware
- Insights page explanations are age-aware

### 3. Language Support (Auto-Detected from Browser)

Supported languages:
- English
- Chinese

Language strategy:
- The app prefers the browser language on startup
- Chinese and English can both be detected
- English is used by default when detection fails
- The home page provides manual language switching (EN / Chinese)

### 4. Mood Tracking

Implemented:
- 10 mood tags with emoji, intensity, and bilingual labels
- Record structure includes mood, text, timestamp, and intensity
- Longer journal input is supported in teen mode
- Coins are awarded after saving, and streak logic is triggered

### 5. AI Chat

Call strategy:
- Uses the online model when a GitHub Models token is configured
- Falls back to a local response when no token is available

Safety strategy:
- Pre-checks for self-harm and crisis keywords
- Returns safe guidance copy after a match, in both Chinese and English
- System prompts explicitly prohibit medical diagnosis and dangerous content

### 6. Garden Progression

Implemented:
- Two asset types: pets and plants
- A coin-based economy for earning and spending
- Unlocking by spending coins
- Feeding and watering actions with state updates
- Streaks automatically boost the garden
- Species cards with biology facts and psychological takeaways in both languages

### 7. Data Insights

Implemented:
- Time range filters: last 7 days / last 30 days / all time
- Calendar-style 7-day display
- Mood distribution statistics
- Positive mood ratio and average intensity
- Recent record list

## Data and Sync

### Local Storage

LocalStorage is used by default for persistence:
- mood entries
- chat messages
- pets
- plants
- coins
- streak

### Optional Cloud Sync (Firebase)

Optional cloud sync is integrated and enabled through environment variables:
- Anonymous authentication to obtain a user uid
- Firestore collection: havenly_profiles
- Local writes are queued and pushed to the cloud
- Empty local data can be restored from the cloud

See FIREBASE_SETUP.md for detailed setup.

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Firebase (optional)

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Start the dev server

```bash
npm run dev
```

### 3) Build the project

```bash
npm run build
```

### 4) Preview the build locally

```bash
npm run preview
```

### 5) Run lint checks

```bash
npm run lint
```

## Environment Variables

### AI Chat (Optional)

- VITE_GITHUB_TOKEN
- VITE_GITHUB_MODEL (optional, default: gpt-4o-mini)
- VITE_GITHUB_MODELS_ENDPOINT (optional)

If no token is configured, the app automatically falls back to a local safe response.

### Firebase Cloud Sync (Optional)

- VITE_ENABLE_FIREBASE_SYNC=true
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Cloud sync only takes effect when VITE_ENABLE_FIREBASE_SYNC=true and the Firebase configuration is complete.

## Core Structure

- src/App.tsx: app state, route dispatch, browser language detection
- src/screens: page layer (Home / Mood / Chat / Garden / Insights)
- src/components: reusable components (bottom navigation, age switcher, language switcher, species card)
- src/utils/moodData.ts: mood data, crisis keywords, AI fallback copy
- src/utils/aiService.ts: online model calls and local fallback strategy
- src/utils/storage.ts: local data read/write, check-in, and reward logic
- src/utils/cloudSync.ts: snapshot sync between local storage and Firebase
- src/utils/firebase.ts: Firebase initialization and anonymous sign-in
- src/utils/speciesData.ts: species encyclopedia in Chinese and English
- src/types/index.ts: global type definitions

## Known Limits

- This is currently a single web client app with no separate backend service
- No full account system is implemented yet; cloud sync is currently based on anonymous auth
- The AI chat feature is positioned as supportive companionship and does not replace professional mental health services

## Next Steps

See plan.md for the overall roadmap.
