import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseDb, isCloudSyncEnabled } from './firebase';

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'havenly_mood_entries',
  CHAT_MESSAGES: 'havenly_chat_messages',
  PETS: 'havenly_pets',
  PLANTS: 'havenly_plants',
  COINS: 'havenly_coins',
  STREAK: 'havenly_streak',
  DEVICE_ID: 'havenly_device_id',
};

interface Streak {
  count: number;
  lastDate: string;
}

interface StorageSnapshot {
  moodEntries: unknown[];
  chatMessages: unknown[];
  pets: unknown[];
  plants: unknown[];
  coins: number;
  streak: Streak;
}

interface CloudSnapshot extends StorageSnapshot {
  updatedAt?: unknown;
}

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getOrCreateDeviceId = (): string => {
  const existing = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (existing) return existing;
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  return id;
};

const getSnapshotFromLocalStorage = (): StorageSnapshot => ({
  moodEntries: readJson(STORAGE_KEYS.MOOD_ENTRIES, []),
  chatMessages: readJson(STORAGE_KEYS.CHAT_MESSAGES, []),
  pets: readJson(STORAGE_KEYS.PETS, []),
  plants: readJson(STORAGE_KEYS.PLANTS, []),
  coins: Number(localStorage.getItem(STORAGE_KEYS.COINS) ?? '0') || 0,
  streak: readJson<Streak>(STORAGE_KEYS.STREAK, { count: 0, lastDate: '' }),
});

const applySnapshotToLocalStorage = (snapshot: StorageSnapshot): void => {
  localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(snapshot.moodEntries));
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(snapshot.chatMessages));
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(snapshot.pets));
  localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(snapshot.plants));
  localStorage.setItem(STORAGE_KEYS.COINS, String(snapshot.coins));
  localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(snapshot.streak));
};

const hasMeaningfulLocalData = (): boolean => {
  const snapshot = getSnapshotFromLocalStorage();
  return (
    snapshot.moodEntries.length > 0 ||
    snapshot.chatMessages.length > 0 ||
    snapshot.pets.length > 0 ||
    snapshot.plants.length > 0 ||
    snapshot.coins > 0 ||
    snapshot.streak.count > 0
  );
};

let syncQueue: Promise<void> = Promise.resolve();

export const queueCloudSyncFromLocal = (): void => {
  if (!isCloudSyncEnabled) return;

  const db = getFirebaseDb();
  if (!db) return;

  const deviceId = getOrCreateDeviceId();
  const snapshot = getSnapshotFromLocalStorage();

  syncQueue = syncQueue
    .then(async () => {
      await setDoc(
        doc(db, 'havenly_profiles', deviceId),
        {
          ...snapshot,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    })
    .catch((error: unknown) => {
      console.warn('[CloudSync] Failed to sync local snapshot to cloud.', error);
    });
};

export const hydrateLocalStorageFromCloud = async (): Promise<boolean> => {
  if (!isCloudSyncEnabled) return false;
  if (hasMeaningfulLocalData()) return false;

  const db = getFirebaseDb();
  if (!db) return false;

  try {
    const deviceId = getOrCreateDeviceId();
    const snapshotDoc = await getDoc(doc(db, 'havenly_profiles', deviceId));
    if (!snapshotDoc.exists()) return false;

    const data = snapshotDoc.data() as CloudSnapshot;
    const snapshot: StorageSnapshot = {
      moodEntries: Array.isArray(data.moodEntries) ? data.moodEntries : [],
      chatMessages: Array.isArray(data.chatMessages) ? data.chatMessages : [],
      pets: Array.isArray(data.pets) ? data.pets : [],
      plants: Array.isArray(data.plants) ? data.plants : [],
      coins: typeof data.coins === 'number' ? data.coins : 0,
      streak:
        data.streak && typeof data.streak.count === 'number'
          ? data.streak
          : { count: 0, lastDate: '' },
    };

    applySnapshotToLocalStorage(snapshot);
    return true;
  } catch (error: unknown) {
    console.warn('[CloudSync] Failed to hydrate local data from cloud.', error);
    return false;
  }
};
