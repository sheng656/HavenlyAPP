import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  type Auth,
} from 'firebase/auth';
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
let auth: Auth | null = null;
let authBootstrapPromise: Promise<void> | null = null;

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

export const getFirebaseAuth = (): Auth | null => {
  if (!isCloudSyncEnabled) return null;
  if (auth) return auth;
  const firebaseApp = ensureApp();
  if (!firebaseApp) return null;
  auth = getAuth(firebaseApp);
  return auth;
};

const bootstrapAnonymousAuth = async (firebaseAuth: Auth): Promise<void> => {
  if (authBootstrapPromise) return authBootstrapPromise;

  authBootstrapPromise = (async () => {
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      if (!firebaseAuth.currentUser) {
        await signInAnonymously(firebaseAuth);
      }
    } catch (error: unknown) {
      console.warn(
        '[Firebase] Anonymous sign-in failed. Ensure Anonymous provider is enabled in Firebase Auth.',
        error
      );
    }
  })();

  await authBootstrapPromise;
};

export const resolveCloudProfileId = async (): Promise<string | null> => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) return null;

  await bootstrapAnonymousAuth(firebaseAuth);
  return firebaseAuth.currentUser?.uid ?? null;
};
