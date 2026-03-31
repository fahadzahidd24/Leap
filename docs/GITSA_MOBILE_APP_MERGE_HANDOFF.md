# GITSA Mobile App Merge Handoff

## Purpose
Use this document in the mobile app repo to merge the existing LEAP app and QUEST app into one app called `GITSA`.

This app should:
- use one shared login flow
- let users enter through one GITSA shell
- show both `LEAP` and `QUEST` as module cards after login
- unlock only the modules included in the company subscription
- keep locked modules visible but inaccessible
- preserve each app's existing logic, branding, navigation, and screens inside its own module area

This app is **not** the place for subscription purchase or billing management.

## Important Product Rule
The mobile app is only for normal usage after the company is already subscribed.

In the app:
- users can log in
- users can access the modules included in their company plan
- users can see locked modules if not included in plan

In the app they cannot:
- purchase a plan
- start checkout
- upgrade subscription
- cancel subscription
- manage Stripe billing

All pricing, checkout, upgrade, cancel, and billing management stays on the web/reporting portal side.

## Main UX Flow

### 1. Login
There should be one login screen for GITSA.

After login:
- store auth token
- store user profile
- store company subscription entitlements
- route user to the GITSA module picker home

### 2. GITSA Home
After login, show two module cards:
- `LEAP`
- `QUEST`

Rules:
- always show both cards
- if module is included in `enabledModules`, card is active
- if module is not included, card is greyed out and shows a lock icon
- tapping locked module shows message:
  - `This module is not included in your current plan.`

Do not hide unavailable modules.

### 3. Module Navigation
When a module is unlocked:
- tapping `LEAP` enters the LEAP app flow
- tapping `QUEST` enters the QUEST app flow

Each module should preserve its own:
- logo
- color scheme
- internal navigation
- feature logic
- screen structure

Do not merge LEAP and QUEST business logic together. Only merge entry, auth, and entitlement-aware access.

## Backend Contract To Use

### `POST /api/login`
Login returns the data needed to power the module picker.

Expected response shape:
```json
{
  "success": true,
  "user": {
    "token": "jwt_token",
    "_id": "user_id",
    "fullName": "Alice Agent",
    "email": "alice@company.com",
    "role": "agent",
    "companyName": "OrcaOps",
    "company": {
      "_id": "company_id",
      "name": "OrcaOps"
    },
    "subscriptionStatus": "active",
    "enabledModules": ["LEAP", "QUEST"],
    "seatLimit": 5,
    "trialSeatLimit": 5,
    "purchasedSeatLimit": 50,
    "seatCount": 4,
    "isCompanyAdmin": false
  }
}
```

Use these fields:
- `token`
- `company`
- `subscriptionStatus`
- `enabledModules`
- `seatLimit`
- `seatCount`
- `isCompanyAdmin`

### `GET /api/profile`
Use this on app bootstrap / relaunch to refresh current entitlements and user profile.

## Module Access Rules

### LEAP
If `enabledModules` includes `LEAP`:
- allow user to open LEAP module
- allow LEAP module screens and API usage

If not:
- keep LEAP card visible
- show locked visual state
- block navigation into LEAP

### QUEST
If `enabledModules` includes `QUEST`:
- allow user to open QUEST module
- allow QUEST module screens and API usage

If not:
- keep QUEST card visible
- show locked visual state
- block navigation into QUEST

## API Namespace Rules

### LEAP backend routes
LEAP continues using the existing `/api/*` endpoints.

Examples:
- `/api/entries`
- `/api/pas`
- `/api/gamification/me/scorecard`

### QUEST backend routes
QUEST is mounted under `/api/quest/*`.

Examples:
- `/api/quest/entries`
- `/api/quest/pas`
- `/api/quest/gamification/me/scorecard`

The app should choose the correct API namespace based on the module the user is currently inside.

## Recommended App Structure

### Shared layer
Keep these shared across GITSA:
- auth
- token storage
- user session
- profile refresh
- module entitlement state
- root navigation shell
- common network layer

### Module layer
Keep these isolated per module:
- `modules/leap/...`
- `modules/quest/...`

Suggested structure:
- shared login screen
- shared home/module picker screen
- `LEAP` navigation container
- `QUEST` navigation container

## Screens To Build

### 1. GITSA Login Screen
What it does:
- email/password login
- handle auth errors
- save token and user payload
- navigate to GITSA home

### 2. GITSA Home / Module Picker
What it shows:
- welcome header
- company name
- current user name and role
- two cards:
  - LEAP
  - QUEST
- active subscription status if desired

Optional helper text:
- `Your access is controlled by your company subscription.`

### 3. Locked Module Message
When user taps locked module, show:
- tooltip
- toast
- modal
- inline helper

Recommended copy:
- `This module is not included in your current plan. Please contact your company admin.`

### 4. Optional Account/Profile Screen
May show:
- name
- company
- role
- enabled modules
- subscription status

But do not place billing controls here.

## Role Behavior In App
Even if an admin logs into the app:
- they can use the app as a normal user
- they should not be able to purchase, upgrade, cancel, or manage Stripe in the app

If you want to acknowledge their admin status in UI, only show informational text such as:
- `Billing changes must be managed on the web portal.`

## Subscription Status Handling

### `trialing`
Allow access to the entitled modules.

Show optional badge:
- `Trial`

### `active`
Allow access normally.

### `past_due`
Backend rules decide whether access remains allowed temporarily.
Frontend should:
- rely on `enabledModules`
- not invent independent access logic

### `canceled` or `inactive`
If backend returns no enabled modules:
- both cards remain visible
- both are locked

## State To Store In App
Persist at minimum:
- `token`
- `user`
- `company`
- `enabledModules`
- `subscriptionStatus`
- current selected module

Do not hardcode module access.
Always derive it from backend response.

## Suggested Navigation Rules

### On app launch
1. if no token:
   - show login
2. if token exists:
   - call `/api/profile`
   - refresh entitlements
   - show GITSA home

### On tapping LEAP
1. check `enabledModules`
2. if `LEAP` exists:
   - enter LEAP navigation stack
3. else:
   - show locked message

### On tapping QUEST
1. check `enabledModules`
2. if `QUEST` exists:
   - enter QUEST navigation stack
3. else:
   - show locked message

## Frontend Guard Rules
Recommended app-level guards:
- `requiresAuth`
- `requiresModule('LEAP')`
- `requiresModule('QUEST')`

These should be used before entering each module shell.

## What The Mobile Agent Should Not Do
- do not build pricing pages in the app
- do not build Stripe checkout in the app
- do not build billing settings for subscription changes in the app
- do not merge LEAP and QUEST internal business rules together
- do not hide locked modules completely

## What The Mobile Agent Should Do
- create one GITSA shell around both existing apps
- keep LEAP and QUEST module code isolated
- add entitlement-aware module cards
- route users into the proper module namespace
- preserve all existing feature behavior inside each module

## Recommended Acceptance Criteria
- user logs in once through GITSA
- user sees both LEAP and QUEST cards
- Core LEAP company:
  - LEAP unlocked
  - QUEST locked
- Core QUEST company:
  - QUEST unlocked
  - LEAP locked
- Grow company:
  - both unlocked
- locked module cannot be entered
- no subscription purchase or billing actions exist in app
- existing LEAP and QUEST screen logic continues working inside their own module flows

## Backend Docs To Also Provide To The Mobile Agent
- `docs/GITSA_BILLING_AND_MODULE_HANDOFF.md`
- `docs/GITSA_REPORTING_PORTAL_PRICING_HANDOFF.md`

This mobile merge doc is the app-specific instruction set.
