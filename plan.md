# Implementation Plan: Havenly (Web Version)

This plan adapts the "Havenly MVP Development" roadmap from the README for the current React + Vite Web codebase.

## Current Status
- **Phase 1 (Foundation)**: ✅
  - Project setup (Vite + React + TS)
  - Basic Navigation (BottomNav)
  - Core Screens (Home, Mood, Chat, Garden, Dashboard)
  - Basic Mock Data / Local Storage

## Phase 2: Age-Differentiated Core Entry (UI/UX)
- [x] **Age Switcher**: Global state for `ageGroup` in `App.tsx`.
- [x] **Top Age Switcher Component**: Added to `HomeScreen`.
- [x] **Dynamic Content**:
  - [x] **Mood Grid**: Toddler (Simple/No note), Teen (Expanded/Journal mode).
  - [x] **Chat**: Toddler-specific simple responses.
  - [ ] **Dashboard**: Age-specific insights (Todo).

## Phase 3: AI Companion & Backend
- [ ] **AI Chat Integration**: Connect `AIChatScreen` to GitHub Models (via Azure/OpenAI SDK or proxy).
- [ ] **System Prompting**: Implement age-appropriate system prompts.
- [ ] **Firebase Integration**: Replace local storage with Firestore (if requested/provided credentials).

## Phase 4: Gamification (Garden)
- [ ] **Garden Logic**: Implement plant growth mechanics based on mood logging.
- [ ] **Visuals**: Enhance `GardenScreen`.

## Phase 5: Insights
- [ ] **Dashboard**: Implement charts for mood history.

---

## Next Immediate Task: Age Switcher
1.  Define `AgeGroup` type.
2.  Create `AgeContext` or lift state to `App.tsx`.
3.  Implement `AgeSwitcher` component.
4.  Update `HomeScreen` to include the switcher.
