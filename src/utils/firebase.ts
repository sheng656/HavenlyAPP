import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined)?.trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined)?.trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined)?.trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined)?.trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string | undefined)?.trim(),
};

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredConfig.every(Boolean);
export const isCloudSyncEnabled =
  (import.meta.env.VITE_ENABLE_FIREBASE_SYNC as string | undefined) === 'true' &&
  isFirebaseConfigured;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

const ensureApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured) return null;
  if (app) return app;
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
};

export const getFirebaseDb = (): Firestore | null => {
  if (!isCloudSyncEnabled) return null;
  if (db) return db;
  const firebaseApp = ensureApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
};
