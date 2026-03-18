# Implementation Plan: Havenly (Web Version)

This plan adapts the "Havenly MVP Development" roadmap from the README for the current React + Vite Web codebase.

## Current Status
- **Phase 1 (Foundation)**: ✅
  - Project setup (Vite + React + TS)
  - Basic Navigation (BottomNav)
  - Core Screens (Home, Mood, Chat, Garden, Dashboard)
  - Basic Mock Data / Local Storage

## Phase 2: Age-Differentiated Core Entry (UI/UX) ✅
- [x] **Age Switcher**: Global state for `ageGroup` in `App.tsx`.
- [x] **Top Age Switcher Component**: Added to `HomeScreen`.
- [x] **Dynamic Content**:
  - [x] **Mood Grid**: Toddler (Simple/No note), Teen (Expanded/Journal mode).
  - [x] **Chat**: Toddler-specific simple responses.
  - [x] **Dashboard**: Age-specific insights (streak card, 7-day calendar).

## Phase 3: AI Companion & Backend ✅
- [x] **AI Chat Integration**: `src/utils/aiService.ts` calls GitHub Models (`gpt-4o-mini`) via `VITE_GITHUB_TOKEN`; falls back to curated responses.
- [x] **System Prompting**: Age-appropriate system prompts (toddler / kid / teen).
- [x] **Crisis Detection**: Pre-filter via `isCrisisMessage()` before any API call.
- [x] **Home AI Widget**: Quick "岛岛" daily greeting banner on `HomeScreen` with last-mood context.
- [ ] **Firebase Integration**: Replace local storage with Firestore (requires credentials).

## Phase 4: Gamification (Garden) ✅
- [x] **Streak Tracking**: `getStreak()` / `onMoodLogged()` in `storage.ts`.
- [x] **Garden Logic**: Auto-water plants + boost pet happiness on every mood log.
- [x] **Bio-Psycho Encyclopedia**: `SpeciesCard` component — clicking any unlocked species shows biological facts + psychological metaphors.
- [ ] **Island View**: Interactable island background (future visual enhancement).

## Phase 5: Insights ✅
- [x] **Dashboard**: 7-day mood calendar (calendar-day bucketed, today highlighted).
- [x] **Streak Card**: Shown on Dashboard when streak > 0.

## Future / Backlog
- [ ] **Account Linking (Option B)**: Independent child/teen + parent registration linked via invite code / QR (requires Firebase Auth + Firestore).
- [ ] **Parent Dashboard**: Safe aggregated view for linked parent account with crisis notifications.
- [ ] **Freemium Store**: Marketplace for exotic species, special habitats, educational packs.
- [ ] **Island Visualizer**: Transform home background into an interactable "Island" with the garden species visible.
