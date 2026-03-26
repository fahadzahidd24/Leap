# Gamification Frontend Handoff

## Overview

This backend now exposes LEAP gamification APIs under `/api/gamification/*`.

The implementation is LEAP-live and QUEST-ready:
- `LEAP` is fully wired to current backend activity sources.
- `QUEST` is not yet live in this repo, but the backend gamification engine is module-aware so QUEST can plug in later without redesigning the frontend structure.

Primary backend capabilities now available:
- daily and weekly execution scorecards
- ratios and score labels
- daily, weekly, and manager missions
- streak tracking
- badges and tier progression
- recognition feed and recognition wall
- weekly leaderboard
- manager dashboard
- notification feed, preferences, and Expo push token registration
- admin analytics/config/audits/campaigns

All endpoints below require the normal app JWT in:

```http
Authorization: Bearer <token>
```

## Screen Map

### 1. Agent Home Scorecard
Use:
- `GET /api/gamification/me/scorecard`
- `GET /api/gamification/me/missions/daily`
- `GET /api/gamification/me/leaderboard`
- `GET /api/gamification/me/notifications`

Render:
- execution score
- score label
- today activity stats
- progress against goals
- quick access to logging
- streak summary
- weekly trend
- mini leaderboard

### 2. Agent Missions
Use:
- `GET /api/gamification/me/missions/daily`
- `GET /api/gamification/me/missions/weekly`

Render:
- mission title
- progress label like `0/5`
- completion state
- reward points

### 3. Agent Badges / Recognition
Use:
- `GET /api/gamification/me/badges`
- `GET /api/gamification/me/tier`
- `GET /api/gamification/me/recognition-feed`

Render:
- earned badges
- current tier and next tier
- recognition timeline
- recognition wall

### 4. Agent Leaderboard
Use:
- `GET /api/gamification/me/leaderboard`

Query params supported:
- `scopeType=company`
- `scopeType=team`
- `scopeType=role`
- optional `scopeId`

### 5. Notifications / Settings
Use:
- `GET /api/gamification/me/notifications`
- `PUT /api/gamification/me/preferences`
- `POST /api/gamification/me/expo-device`

### 6. Manager Dashboard
Use:
- `GET /api/gamification/manager/dashboard`
- `GET /api/gamification/manager/team-leaderboard`
- `GET /api/gamification/manager/alerts`
- `GET /api/gamification/manager/coaching-prompts`
- `GET /api/gamification/manager/missions`
- `POST /api/gamification/manager/coaching-sessions`

### 7. Admin Gamification Console
Use:
- `GET /api/gamification/admin/config`
- `PUT /api/gamification/admin/config`
- `GET /api/gamification/admin/analytics`
- `GET /api/gamification/admin/audits/:userId`
- `GET /api/gamification/admin/campaigns`
- `POST /api/gamification/admin/campaigns`
- `POST /api/gamification/admin/recompute`

## Agent API Contracts

### GET `/api/gamification/me/scorecard`

Returns both daily and weekly scorecards.

Example shape:

```json
{
  "success": true,
  "scorecard": {
    "daily": {
      "score": 68,
      "label": "On Track",
      "breakdown": {
        "activityScore": 28,
        "salesScore": 20,
        "momentumScore": 10,
        "improvedVsPreviousWeek": true,
        "missionReward": 10
      },
      "ratios": {
        "appointmentRatio": 0.5,
        "appointmentRatioPercent": 50,
        "presentationRatio": 0.6,
        "presentationRatioPercent": 60,
        "salesRatio": 0.33,
        "salesRatioPercent": 33
      },
      "goals": {
        "p_daily": 5,
        "a_daily": 2,
        "pr_daily": 1,
        "s_daily": 1
      },
      "stats": {
        "prospects": 5,
        "appointments": 2,
        "presentations": 1,
        "salesCount": 1,
        "salesAmount": 3000
      },
      "targetStatus": {
        "prospectsMet": true,
        "appointmentsMet": true,
        "presentationsMet": true,
        "salesMet": true
      },
      "trend": []
    },
    "weekly": {
      "score": 82,
      "label": "Strong Momentum",
      "breakdown": {},
      "ratios": {},
      "goals": {},
      "stats": {},
      "targetStatus": {},
      "trend": [
        { "date": "23/03/2026", "score": 70 },
        { "date": "24/03/2026", "score": 72 }
      ]
    },
    "streak": {
      "current": 5,
      "longest": 8,
      "streakAtRisk": false
    }
  }
}
```

Frontend notes:
- this is the main scorecard payload
- `daily.score` is the key number for the home screen
- `weekly.score` is the main leaderboard metric
- `weekly.trend` should render as the momentum line or day chips

### GET `/api/gamification/me/missions/daily`

```json
{
  "success": true,
  "progressPercent": 33,
  "missions": [
    {
      "key": "daily_prospects",
      "type": "daily",
      "title": "Contact 5 prospects",
      "metricKey": "prospects",
      "target": 5,
      "progress": 2,
      "progressLabel": "2/5",
      "completed": false,
      "rewardPoints": 3
    }
  ]
}
```

### GET `/api/gamification/me/missions/weekly`

Same mission object shape as daily missions, but `type` is `weekly`.

### GET `/api/gamification/me/streak`

```json
{
  "success": true,
  "streak": {
    "currentStreak": 5,
    "longestStreak": 8,
    "streakAtRisk": false,
    "lastActiveDate": "25/03/2026"
  }
}
```

### GET `/api/gamification/me/badges`

Returns badge history ordered newest first.

Important fields:
- `badgeKey`
- `badgeTitle`
- `badgeCategory`
- `awardedAt`

### GET `/api/gamification/me/tier`

```json
{
  "success": true,
  "tier": {
    "currentTier": "Builder",
    "nextTier": "Performer",
    "progressPercent": 42,
    "lifetimeScore": 260
  }
}
```

### GET `/api/gamification/me/leaderboard`

Example:

```json
{
  "success": true,
  "leaderboard": {
    "weekKey": "2026-W13",
    "scopeType": "company",
    "scopeId": "orcaops",
    "entries": [
      {
        "userId": "abc123",
        "fullName": "Agent One",
        "email": "agent1@example.com",
        "role": "agent",
        "companyName": "OrcaOps",
        "score": 82,
        "label": "Strong Momentum",
        "salesCount": 2,
        "presentations": 5,
        "rank": 1,
        "previousRank": 3,
        "movement": 2
      }
    ],
    "currentUserRank": {
      "userId": "xyz999",
      "rank": 8
    }
  }
}
```

Frontend notes:
- show top list from `entries`
- always render the current user rank card if `currentUserRank` is present
- `movement > 0` can power rank-up visual treatment

### GET `/api/gamification/me/notifications`

Returns:
- `notifications`
- `preferences`

Notification item fields:
- `type`
- `title`
- `body`
- `status`
- `scheduledFor`
- `sentAt`

### GET `/api/gamification/me/recognition-feed`

Returns:
- `feed`: current user's own recognition history
- `wall`: company-wide recognition wall

## Manager API Contracts

### GET `/api/gamification/manager/dashboard`

Returns:
- `summary`
- `teamScores`
- `lowEngagement`
- `topPerformers`
- `underperformers`
- `coachingPrompts`
- `managerMissions`

Use this as the manager home screen payload.

### GET `/api/gamification/manager/team-leaderboard`

Same leaderboard shape as the agent leaderboard, but scoped to the manager hierarchy.

### GET `/api/gamification/manager/alerts`

Returns low-engagement members only.

### GET `/api/gamification/manager/coaching-prompts`

Returns:
- coaching prompt list
- manager mission list

### GET `/api/gamification/manager/missions`

Returns just manager missions.

### POST `/api/gamification/manager/coaching-sessions`

Request body:

```json
{
  "agentUserId": "agentMongoId",
  "date": "25/03/2026",
  "notes": "Reviewed ratios and set follow-up actions.",
  "focusAreas": ["ratio_review", "presentations"],
  "outcomes": ["follow_up", "coaching_completed"]
}
```

## Admin API Contracts

### GET `/api/gamification/admin/config`

Returns current backend gamification config for LEAP.

### PUT `/api/gamification/admin/config`

Use for adjusting:
- score weights
- reminder schedule
- mission limits
- leaderboard settings
- tier thresholds

### GET `/api/gamification/admin/analytics`

Returns:
- users tracked
- average weekly score
- streak distribution
- badge unlock totals
- mission completion rate
- notification stats
- active campaigns
- coaching session totals

### GET `/api/gamification/admin/audits/:userId`

Returns audit rows for recomputes and badge awards.

### Campaign APIs

List:
- `GET /api/gamification/admin/campaigns`

Create:
- `POST /api/gamification/admin/campaigns`

Request body:

```json
{
  "name": "March Momentum Sprint",
  "description": "Boost activity and follow-up execution.",
  "startDate": "01/03/2026",
  "endDate": "31/03/2026",
  "config": {
    "bonusBadge": "momentum_week"
  },
  "active": true
}
```

### POST `/api/gamification/admin/recompute`

Use this after config changes or bulk data corrections.

## Expo Notifications Flow

Frontend should use `expo-notifications` to obtain the Expo push token, then register it with the backend.

### 1. Get Expo push token on device

Frontend app should use `expo-notifications` to:
- request notification permissions
- obtain the Expo push token
- persist local permission state

### 2. Register token with backend

Call:

`POST /api/gamification/me/expo-device`

Body:

```json
{
  "deviceId": "stable-device-id",
  "platform": "ios",
  "appVersion": "1.0.0",
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

### 3. Update preferences

Call:

`PUT /api/gamification/me/preferences`

Body example:

```json
{
  "pushEnabled": true,
  "morningReminder": true,
  "middayReminder": true,
  "achievementAlerts": true,
  "streakProtection": true,
  "weeklySummary": true,
  "leaderboardMovement": true,
  "maxPerDay": 3
}
```

## Loading / Empty / Error States

### Scorecard
- Loading: skeleton for score ring, goals, and streak
- Empty: if score is `0`, show encouragement copy such as `Start with your first prospect today`
- Error: retry CTA plus fallback text

### Missions
- Loading: mission card placeholders
- Empty: if mission list is empty, show `Set your targets to generate missions`

### Leaderboard
- Empty: if `entries` is empty, show `No ranked activity yet this week`
- Still show the current user rank if provided

### Recognition
- Empty: `No recognitions yet. Keep logging activity to unlock badges.`

### Manager dashboard
- Empty team: `No team members found in your hierarchy yet`

## LEAP-Live vs QUEST-Ready

### Live now
- LEAP scorecards
- LEAP missions
- LEAP leaderboard
- LEAP streaks
- LEAP badges and tiers
- LEAP recognition
- LEAP manager dashboard
- LEAP notification APIs

### Reserved for later QUEST integration
- recruitment-specific score formula
- recruitment missions
- recruitment leaderboard logic
- recruitment badge rules

Frontend recommendation:
- keep the screen structure reusable
- avoid hard-coding LEAP metric labels deep in shared components
- treat the current backend as `module = LEAP` even though the API path does not yet require a module param

## Suggested Frontend Build Order

1. Agent scorecard and daily missions
2. Expo notification permission + token registration
3. Leaderboard
4. Badges, tiers, and recognition
5. Manager dashboard
6. Admin gamification screens

## Notes For The Frontend Agent

- The backend already recomputes gamification state after PAS writes, entries updates, and app-open writes.
- The frontend should not try to calculate score formulas locally.
- Use backend ratios, score labels, mission progress, and rank movement directly.
- If the app performs quick logging, refresh `me/scorecard` and `me/missions/daily` after a successful PAS write.
