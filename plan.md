# HavenlyAPP Roadmap

## 1. Product Goals

Build an emotional support product for teenagers and close the loop of “track - companion - feedback - grow”:
- Low friction: users can complete a mood check-in within 10 seconds
- Supportive companionship: users can talk to an AI assistant at any time
- Sustainable: increase repeat usage through a garden progression system
- Insightful: users can see emotional trends and receive gentle feedback

## 2. Product Principles

- Safety first, especially for minors
- Age-appropriate: different tone and interaction density for different age groups
- Companion-oriented: encourage expression, do not provide medical diagnosis
- Privacy-first: minimize collection and keep data boundaries clear
- Progressive iteration: stabilize the core loop first, then expand the ecosystem

## 3. Current Baseline (Already in Place)

- Core pages and flow: Home / Mood / Chat / Garden / Insights
- Age segmentation: toddler / kid / teen
- Bilingual support: English + Chinese, browser auto-detection, English by default on detection failure
- Dual-path AI: online model + local fallback
- Crisis keyword detection and safe responses
- Complete local storage loop
- Basic optional Firebase cloud sync

## 4. Milestone Roadmap

## Phase A: Stability and Engineering Quality (Short Term)

Goal: move existing features from “usable” to “stable and maintainable.”

Main work:
- Standardize how copy resources are organized to reduce hardcoding risk
- Improve error handling for AI request failures, cloud sync failures, and data parsing failures
- Clean up and narrow state-management boundaries to reduce coupling between pages
- Add key logs and debug markers

Acceptance criteria:
- No blocking errors in the main flow
- Clear fallback feedback for all key failure scenarios
- Documentation matches actual code behavior

## Phase B: AI Safety and Conversation Experience (Short to Mid Term)

Goal: improve response quality and stability within safety boundaries.

Main work:
- Iterate on crisis keyword lists and detection rules
- Continuously tune age-based prompts
- Optimize conversation context strategy, including length and memory window
- Establish a review process for offline fallback copy

Acceptance criteria:
- Crisis scenarios are predictable and verifiable
- Multi-turn conversation coherence improves
- Experience remains acceptable when no token is configured

## Phase C: Account and Cloud Sync Improvements (Mid Term)

Goal: support a consistent multi-device experience and account expansion.

Main work:
- Evolve from anonymous auth to an upgradable account system
- Design and implement data conflict handling strategies (local-first / timestamp-first)
- Refine Firestore security rules and migration plans
- Add sync-state visibility, such as the last sync time

Acceptance criteria:
- Data stays consistent across devices for the same account
- Sync failures are recoverable and do not lose critical data
- Security rules pass a least-privilege review

## Phase D: Family Collaboration Capabilities (Mid to Long Term)

Goal: provide a parent collaboration view while protecting minor privacy.

Main work:
- Design invitation-based pairing (invite code / QR code)
- Show parents only aggregates and trends, not raw sensitive content
- Risk alert strategies for unusual behavior, configurable and optionally silent

Acceptance criteria:
- The pairing flow is clear and revocable
- Permission boundaries are explainable and testable
- Risk notifications work without spamming

## Phase E: Content and Growth (Mid to Long Term)

Goal: improve daily active use and retention, and build a long-term companionship mindset.

Main work:
- Expand garden gameplay with tasks, chapters, and streak goals
- Expand species encyclopedia content with scientific facts and psychological metaphors
- Balance the reward system, including coin output, consumption, and unlock pacing
- Reserve space for event-based operations such as seasonal themes and limited-time content

Acceptance criteria:
- Check-in streaks and return visits increase
- Gameplay pacing does not overly disturb the core mood-tracking flow

## Phase F: Release and Operations (Ongoing)

Goal: establish a sustainable release and regression-verification process.

Main work:
- Automate tests for core paths: tracking, chat, sync, and garden
- Improve performance and accessibility
- Pre-release checklist for environment variables, rules, and rollback plans
- Baseline monitoring and alerting

Acceptance criteria:
- Release iterations are controllable and major regressions are detected early
- Production issues are locatable, traceable, and rollback-ready

## 5. Risks and Mitigations

Main risks:
- Uncontrolled AI responses
- Compliance and safety risks in a minor-oriented context
- Multi-device sync consistency risks
- Rising complexity as features expand

Mitigation strategies:
- Layered safety controls: keywords, system prompts, and fallback copy
- Minimize permissions and show data in tiers
- Define sync conflict strategies clearly and verify them with staged rollout
- Keep an engineering debt cleanup window in each phase

## 6. Execution Model

Recommended two-week iteration cycle:
- Week 1: requirement breakdown + development + self-testing
- Week 2: integration + regression checks + documentation updates + release

Each iteration should output:
- Demo-ready features
- Change documentation
- Updated risk list
- Next-phase task breakdown
