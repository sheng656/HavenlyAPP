## Plan: 小岛 · Havenly MVP Development

An Expo (React Native & TypeScript) application backed by Firebase. Core features include a highly visual, age-differentiated emotion tracker, a gamified ecosystem (plants/animals), and a safe, boundary-driven AI chat using GitHub Models for the LLM. 

**Steps**

**Phase 1: Foundation & Navigation**
1. Initialize Expo project with TypeScript template.
2. Set up Firebase project, configure Auth and Firestore.
3. Build **Bottom Navigation** containing 4 core tabs: `今天 (Today)`, `心情 (Mood History)`, `聊天 (Chat)`, `数据 (Insights)`.

**Phase 2: Age-Differentiated Core Entry (UI/UX)**
4. Implement the **Top Age Switcher**: Toggle between `小宝贝`, `小朋友`, and `少年` modes. **Dynamically adjust tone and vocabulary** across the app.
5. Build the **Expanded Mood Grid**: Richer set of emotion options, conditionally rendering by age.
6. Build **Teen Mode Entry**: Text-based diary input switching from the basic mood grid.
7. Implement custom UI theme: rounded corners, soft pastels (light blues, cream/yellow backgrounds).

**Phase 3: Evolving Virtual Pet & Safe AI Companion ("岛岛")**
8. Create the **AI Chat Widget** on the Home tab allowing direct, quick interaction.
9. Integrate **GitHub Models API** via Firebase Cloud Functions for security.
10. Implement **System Prompt Boundaries** ensuring AI acts as a listener/companion.
11. Implement **Crisis Detection Middleware**: Pre-filter self-harm/crisis keywords.

**Phase 4: Insights & Account Linking**
12. Build `InsightsDashboard` view for the "数据" tab, displaying aggregated mood charts and trends for the youth.
13. Implement **Account Linking (Option B)**: Independent registration for child/teen and parent, linked via a generated Invite Code or QR code.
14. Develop a safe view for the linked Parent account to review aggregated mood insights and receive crisis notifications.

**Phase 5: Gamification & Commercialization (Havenly Ecosystem)**
15. **Ecosystem Foundation**: Transform the visual background into an interactable "Island".
16. **Psychological Achievements**: Link mood logging streaks and AI interactions to ecosystem growth (e.g., 3 days of logging hatches a seed).
17. **Bio-Psycho Encyclopedia**: When unlocking/interacting with flora/fauna, display a card combining biological facts with psychological metaphors (e.g., "Bamboo bends but doesn't break").
18. **Freemium & Paid Store**: Implement a marketplace/subscription model where basic flora/fauna and the core companion are free, while exotic species, special habitats (e.g., Starry Ocean, Coral Reef), or advanced educational packs are paid.

**Relevant files**
- `app/(tabs)/_layout.tsx` — Bottom tab navigation.
- `components/EmotionTracker/MoodGrid.tsx` — Expanded emotion selector.
- `components/Ecosystem/IslandView.tsx` — The interactable island and ecosystem renderer.
- `components/Ecosystem/SpeciesCard.tsx` — The educational UI for biological/psychological facts.
- `functions/src/aiCompanion.ts` — Secure backend logic for AI and Crisis Detection.

**Decisions**
- **Framework:** Expo (React Native + TypeScript)
- **Backend/DB:** Firebase (Auth, Firestore, Cloud Functions).
- **AI Service:** GitHub Models API via Firebase Cloud Functions.
- **Account Linking:** Option B - Independent registration + matching code to respect teen autonomy.
- **Commercialization:** "Havenly Ecosystem" - Free basic emotional support, paid premium flora/fauna with educational value (Biology + Psychology).

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Firebase Setup (Havenly)

For the web app cloud-sync configuration, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
