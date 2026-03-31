# QUEST App Implementation Handoff

## Goal

Use this document to reproduce the current LEAP app behavior and UI in the QUEST app.

This is not a greenfield product brief. It is a parity handoff.

The QUEST implementation should mirror the current LEAP app as it exists now, including:
- navigation structure
- gamification screens and data flows
- manager tools
- admin tools
- chat/inbox behavior
- notification behavior
- badge/tier visuals
- recent UI polish and typography adjustments

Do not redesign the experience unless a platform constraint requires it. The current LEAP app is the reference.

## Current Product Rules

- Keep the main `Home` screen largely as-is.
- The gamification dashboard is a separate screen, not the home screen itself.
- `Home` should include a button that opens the gamification dashboard.
- The sidebar/drawer should also include gamification destinations directly.
- Gamification visuals must use the existing badge and tier artwork.
- Empty states must never render as blank spaces.
- Role-based navigation matters:
  - `agent`
  - `manager`
  - `admin`

## Navigation Parity

Use the current LEAP navigation as the source of truth.

### Agent navigation

Drawer destinations:
- `Home`
- `Inbox`
- `Dashboard`
- `Missions`
- `Leaderboard`
- `Recognition`
- `Profile`

Key stack destinations:
- `Chat`
- `Masterclass`
- `VideoPlayer`
- `Daily Activity`
- `Activity Reports`
- `Effectiveness Report`
- `Annual Progress`
- `Daily Schedule`

### Manager navigation

Drawer destinations:
- `Dashboard`
- `My Agents`
- `Live Locations`
- `Profile`

### Admin navigation

Drawer destinations:
- `Admin Console`
- `Profile`

## Shared Design Direction

### Theme and color usage

QUEST should reuse the same visual language:
- deep LEAP blue as the main background
- white cards with rounded corners
- muted secondary text
- gold/orange accent for milestones and badges
- green for success/completed states
- subtle light-blue surfaces for badge and mission cards

Use the current theme extensions from `src/constants/theme.js` as the visual reference:
- `surface`
- `accent`
- `accentLight`
- `success`
- `warning`
- `danger`
- `info`
- `border`
- `textPrimary`
- `textMuted`
- `textOnPrimary`

### Drawer styling

The drawer is not plain. It uses:
- blue gradient background
- branded logo card
- profile summary card
- custom icons per route
- highlighted active item state

### Card styling

Across gamification screens:
- use white cards
- rounded corners
- short subtitles
- modest padding
- clean spacing between sections
- small visual badges/images inside cards where relevant

## Data Layer to Mirror

QUEST should preserve the same frontend data structure and backend integration patterns.

### Redux/domain areas in LEAP

The current LEAP app maintains gamification state for:
- `scorecard`
- `dailyMissions`
- `weeklyMissions`
- `leaderboard`
- `badges`
- `tier`
- `recognition`
- `notifications`
- `preferences`
- manager dashboard data
- manager leaderboard
- manager alerts
- manager coaching prompts
- manager missions
- admin config
- admin analytics
- admin campaigns
- admin audit rows
- Expo device registration state

### Gamification API surface currently used

Agent:
- `GET /api/gamification/me/scorecard`
- `GET /api/gamification/me/missions/daily`
- `GET /api/gamification/me/missions/weekly`
- `GET /api/gamification/me/leaderboard`
- `GET /api/gamification/me/badges`
- `GET /api/gamification/me/tier`
- `GET /api/gamification/me/recognition-feed`
- `GET /api/gamification/me/notifications`
- `PUT /api/gamification/me/preferences`
- `POST /api/gamification/me/expo-device`

Manager:
- `GET /api/gamification/manager/dashboard`
- `GET /api/gamification/manager/team-leaderboard`
- `GET /api/gamification/manager/alerts`
- `GET /api/gamification/manager/coaching-prompts`
- `GET /api/gamification/manager/missions`
- `POST /api/gamification/manager/coaching-sessions`

Admin:
- `GET /api/gamification/admin/config`
- `PUT /api/gamification/admin/config`
- `GET /api/gamification/admin/analytics`
- `GET /api/gamification/admin/audits/:userId`
- `GET /api/gamification/admin/campaigns`
- `POST /api/gamification/admin/campaigns`
- `POST /api/gamification/admin/recompute`

### Session/reset behavior

On logout or `401` session expiry, QUEST should clear:
- entries
- chat
- gamification state

## Assets and Visual Mapping

QUEST must reuse the same badge/tier naming convention and mapping logic currently implemented in LEAP.

### Tier thresholds

Use:
- Rookie
- Builder
- Performer
- Achiever
- Elite
- Legend

Image names match keys:
- `rookie.png`
- `builder.png`
- `performer.png`
- `achiever.png`
- `elite.png`
- `legend.png`

### Badge keys

Use the current keys and descriptions:
- `execution_started`
- `showed_up`
- `funnel_builder`
- `momentum_week`
- `consistency_wins`
- `first_close`
- `closer`
- `strong_finisher`
- `target_crusher`
- `sales_momentum`
- `rising_performer`
- `quality_builder`
- `execution_machine`
- `role_model_signal`

Image names match keys, for example:
- `execution_started.png`
- `role_model_signal.png`

### Helper behavior to mirror

QUEST should include equivalent helper logic for:
- `getTierMeta`
- `getBadgeMeta`
- `getBadgesByKeys`
- `getLeaderboardBadgeMeta`
- `getMissionBadgeMeta`

This ensures badge visuals stay consistent across dashboard, missions, leaderboard, recognition, and profile.

## Screen-by-Screen Requirements

### 1. Home

Keep the original home experience.

Do:
- keep existing home layout intact
- add a button that opens the standalone gamification dashboard
- keep drawer access to gamification destinations

Do not:
- turn the home page itself into the gamification dashboard

### 2. Inbox

The inbox feature is enabled and should be present in QUEST.

Requirements:
- `Inbox` must be reachable from navigation
- tapping a chat thread should open `Chat`
- if no chats exist, show a proper empty state instead of a blank list

Empty state copy should be centralized/reusable, not hardcoded ad hoc in multiple places.

### 3. Chat

Chat must be navigable from:
- Inbox thread list
- manager-side `My Agents` page via chat bubble action

### 4. Effectiveness Report

QUEST should include the restored Improvement Plan functionality currently present in LEAP.

Requirements:
- fetch improvement plans from backend
- display plans in an expandable/accordion-like list
- allow adding a new plan through a modal
- allow deleting a plan via long press

Fields:
- title
- subtitle
- description

### 5. Gamification Dashboard

This is the dedicated agent gamification overview screen.

Render:
- execution score
- score label
- daily stats against goals
- streak summary
- weekly trend chips
- ratio row
- quick actions
- badges in play rail
- today’s missions preview
- mini leaderboard
- recent notifications

Important current behavior:
- quick action cards include `Log Activity`, `Missions`, `Leaderboard`, `Recognition`
- badge images are used inside rails and list rows
- mission preview rows include badge art
- leaderboard preview rows include badge art

### 6. Dashboard ratio row

QUEST should preserve the current dashboard ratio row behavior:
- `PR` = prospecting ratio
- `A` = appointment ratio
- `P` = presentation ratio
- `S` = sales ratio

Important detail:
- prospecting ratio is computed client-side from `prospects / p_daily`
- the backend currently provides appointment/presentation/sales percentage values

### 7. Missions

Render both:
- `Daily Missions`
- `Weekly Missions`

Each section should include:
- progress subtitle like `100% complete`
- badge showcase strip at the top
- mission cards with badge image
- mission title
- progress label
- mission type
- completed/reward pill
- helper description
- progress bar

### 8. Leaderboard

Render:
- competitive badge strip at top
- `Your Position` card
- weekly rankings list

Current order matters:
- `Your Position` appears above `Weekly Rankings`

Each leaderboard row should show:
- badge or rank marker
- full name
- score label
- points
- sales count
- movement

Movement behavior:
- frontend simply displays backend `movement`
- backend has already been updated separately to keep weekly movement visible across the week

### 9. Recognition

Render:
- tier progress card
- badges grid
- recognition timeline
- recognition wall

Tier progress card must show:
- current tier image
- next tier image
- lifetime score
- progress bar
- progress text with one decimal place, for example `18.3%`

Badges grid must show:
- badge image
- badge title
- badge description
- category + award date meta line

Current formatting details to preserve:
- badge description line spacing is tighter than before
- category label is sentence case, for example `Sales achievement`
- meta line spacing is tighter

### 10. Profile

Profile must include:
- user avatar/profile picture flow
- account info
- logout/delete account flows
- notification preferences
- tier/momentum card

Current important behavior:
- on every profile visit, refresh:
  - tier
  - badges
  - notifications/preferences

This is specifically required because current badge state should refresh whenever the user visits Profile.

### 11. My Agents

Manager view should show an actual agent list again.

Requirements:
- do not replace this screen with manager dashboard content
- keep reporting/coaching-related functionality if present
- replace the old `Coach` button with a chat bubble icon
- chat bubble must open `Chat` with that agent

### 12. Manager Dashboard

Separate from `My Agents`.

Render:
- manager summary metrics
- team leaderboard
- alerts
- coaching prompts
- manager missions
- quick links to `My Agents` and `Live Locations`

### 13. Live Locations

Manager-side live location map must be restored in QUEST too.

Requirements:
- show map
- subscribe to live updates
- list latest agent location updates
- include a back button
- show human-readable addresses, not raw latitude/longitude

Address formatting should be based on reverse geocoding and cached where possible.

### 14. Admin Console

QUEST should mirror the current admin gamification tools:
- analytics snapshot
- config editor
- campaign list
- create campaign flow
- audit lookup by user

## Notification Behavior

### Expo/local notification setup

QUEST should reproduce the current notification behavior in LEAP:
- foreground notifications are allowed to show alerts
- Expo device registration happens after login when possible
- app-open motivational local notifications are shown

### Device registration behavior

QUEST should follow the current resilient device registration logic:
- request notification permission
- generate/store a stable local device id
- fetch Expo push token
- register the token with backend
- support fallback token fetch behavior if EAS project id is not embedded

### App-open motivational notifications

Current LEAP behavior:
- when user logs in or opens the app while already logged in, show a local motivational notification
- also show again when app returns from background to foreground
- use a short cooldown to avoid duplicate bursts

Notification content should be randomized and derived from:
- scorecard
- daily missions
- leaderboard rank
- streak
- tier progress
- sales momentum

The message generator should produce different motivational messages rather than one fixed string.

### Backend-driven notification note

QUEST should support real push notifications if backend sends actual Expo pushes to the registered token.

If QUEST later needs guaranteed in-app popup behavior for backend-created notifications even while open, add:
- socket or polling for notification feed changes
- local notification trigger for unseen incoming items

## Agent Location Tracking

QUEST should preserve the current agent-side tracking behavior:
- only for agent role
- request foreground location permission
- watch position continuously
- send updates to backend
- emit socket event for manager live tracking
- clean up watcher on unmount/logout

## Authentication and Roles

QUEST should allow:
- `agent`
- `manager`
- `admin`

Current sign-in behavior in LEAP already permits admin access and QUEST should do the same.

## UI Polish Details That Must Be Preserved

These are not optional. They represent recent polish changes and should be reproduced.

### Typography and wrapping

Dashboard and missions:
- badge card labels were reduced in size to avoid awkward multi-line splits
- mission titles were reduced slightly
- mission subtitles were reduced slightly
- status/reward pill text was reduced slightly
- spacing beside pills/icons was tightened

Recognition:
- badge description line spacing is tighter
- badge meta text is slightly smaller
- badge category is sentence case

Tier progress:
- visible percent text is formatted with `toFixed(1)` style output

Leaderboard:
- `Your Position` card appears above weekly rankings

### Wording/casing

Use sentence case for category/meta labels such as:
- `Sales achievement`
- `Growth performance`
- not raw underscore keys

### Empty states

Do not leave blank content areas.

Use clear empty states for:
- inbox/chat list
- missions
- leaderboard
- recognition
- notifications
- tier data absence

## Current File-Level Reference Map

These LEAP files represent the current behavior QUEST should replicate:

Core:
- `App.jsx`
- `src/navigation/AppStack.js`
- `src/api/gamification.js`
- `src/redux/features/gamificationSlice.js`
- `src/redux/store.js`
- `src/api/axios.js`

Gamification:
- `src/screens/GamificationDashboard.jsx`
- `src/screens/GamificationMissions.jsx`
- `src/screens/GamificationLeaderboard.jsx`
- `src/screens/GamificationRecognition.jsx`
- `src/screens/AdminGamification.jsx`
- `src/screens/ManagerDashboard.jsx`
- `src/screens/ManagerLiveMap.jsx`
- `src/components/GamificationCard.jsx`
- `src/components/GamificationEmptyState.jsx`
- `src/constants/gamificationVisuals.js`
- `src/utils/registerGamificationDevice.js`
- `src/utils/gamificationNotifications.js`

Other restored/updated screens:
- `src/screens/home.jsx`
- `src/screens/Profile.jsx`
- `src/screens/Inbox.jsx`
- `src/screens/Chat.jsx`
- `src/screens/My Agents.jsx`
- `src/screens/Effectiveness Report.jsx`
- `src/screens/Daily Activity.jsx`
- `src/screens/signin.jsx`

## QUEST Acceptance Checklist

QUEST implementation should be considered complete only when all of the following are true:

- role-based navigation matches LEAP
- home remains separate from the gamification dashboard
- inbox works and shows an empty state when no chats exist
- chat can be opened from inbox and manager agent list
- improvement plan is restored in effectiveness report
- agent dashboard renders score, streaks, ratios, missions, badges, leaderboard preview, notifications
- missions screen renders daily and weekly mission cards with badge visuals
- leaderboard screen renders `Your Position` above rankings
- recognition screen renders tiers, badges, timeline, wall, and uses current typography polish
- profile refreshes tier, badges, and notifications on visit
- manager dashboard is separate from `My Agents`
- live locations show a map plus human-readable addresses
- admin console mirrors current LEAP admin features
- badge/tier art is wired using the same keys and asset names
- app-open motivational local notifications are implemented
- Expo push token registration is implemented robustly
- agent location tracking is restored
- sentence case labels and current wrapping/font-size polish are preserved

## Final Instruction for QUEST

Treat the current LEAP app as the exact functional and visual baseline.

Build QUEST to match the current LEAP implementation closely, including:
- feature scope
- hierarchy
- ordering
- copy intent
- badge placement
- notification behavior
- refreshed profile badge behavior
- smaller typography and spacing fixes introduced during polish

If there is any uncertainty, prefer parity with LEAP over inventing a new UX.
