# Firebase Configuration Guide (Havenly Web)

This guide shows the exact setup required for Havenly's optional cloud sync.

## 1. Create Firebase Project

1. Open Firebase Console: https://console.firebase.google.com/
2. Click "Add project".
3. Project name suggestion: `havenly-app`.
4. Disable Google Analytics for MVP (optional), finish project creation.

## 2. Register Web App

1. In Project Overview, click "</>" to add a web app.
2. App nickname: `havenly-web`.
3. Do not enable Firebase Hosting now.
4. Copy the generated config values (apiKey, authDomain, projectId, etc.).

## 3. Enable Authentication (Anonymous)

1. Go to Authentication > Sign-in method.
2. Enable `Anonymous` provider.
3. Save.

Why: Havenly currently uses anonymous sign-in for profile-bound sync without forcing account UI yet.

## 4. Create Firestore Database

1. Go to Firestore Database > Create database.
2. Start in production mode.
3. Choose a region close to your users.
4. Create.

## 5. Add Environment Variables

Copy `.env.example` to `.env.local` and fill:

```bash
VITE_ENABLE_FIREBASE_SYNC=true
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Optional GitHub Models config:

```bash
VITE_GITHUB_TOKEN=...
VITE_GITHUB_MODELS_ENDPOINT=https://models.github.ai/inference/chat/completions
VITE_GITHUB_MODEL=gpt-4o-mini
```

## 6. Firestore Data Model (Current)

Collection: `havenly_profiles`

Document ID:
- Preferred: `uid_<firebaseAuthUid>`
- Fallback: `device_<generatedDeviceId>`

Document shape:

```json
{
  "profileId": "uid_xxx",
  "moodEntries": [],
  "chatMessages": [],
  "pets": [],
  "plants": [],
  "coins": 0,
  "streak": { "count": 0, "lastDate": "" },
  "updatedAt": "serverTimestamp"
}
```

## 7. Firestore Security Rules (MVP)

Use these starter rules:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /havenly_profiles/{profileId} {
      allow read, write: if request.auth != null
        && profileId == ('uid_' + request.auth.uid);
    }
  }
}
```

Important:
- This intentionally blocks `device_` docs from authenticated reads/writes.
- Once anonymous auth is enabled, new users should sync to `uid_` docs.
- If you need temporary migration from `device_` docs, do it with Admin SDK or one-time script.

## 8. Verify End-to-End

1. Run app: `npm run dev`.
2. Ensure browser console has no Firebase config errors.
3. Log a mood, send chat, unlock or water in garden.
4. Open Firestore, confirm doc appears in `havenly_profiles`.
5. Clear localStorage and refresh. If cloud doc exists, hydration should restore local data.

## 9. Common Issues

1. `Anonymous sign-in failed`
- Check Authentication provider is enabled.
- Check `VITE_*` values are correct.

2. `Missing or insufficient permissions`
- Firestore rules do not allow current profile path.
- Confirm document ID prefix is `uid_` and rules match.

3. Sync not running
- Check `VITE_ENABLE_FIREBASE_SYNC=true`.
- Restart dev server after editing env files.

## 10. Next Step Recommendation

After this setup works, implement explicit account flows:
- Convert anonymous account to permanent account (email/social)
- Parent-child linking by invite code/QR
- Parent dashboard with aggregated-only privacy model
