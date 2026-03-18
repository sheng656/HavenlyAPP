import type { MoodEntry, ChatMessage, Pet, Plant } from '../types';

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'havenly_mood_entries',
  CHAT_MESSAGES: 'havenly_chat_messages',
  PETS: 'havenly_pets',
  PLANTS: 'havenly_plants',
  COINS: 'havenly_coins',
  STREAK: 'havenly_streak',
};

interface Streak {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

const getTodayDate = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getStreak = (): Streak => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    return raw ? (JSON.parse(raw) as Streak) : { count: 0, lastDate: '' };
  } catch {
    return { count: 0, lastDate: '' };
  }
};

const updateStreak = (): number => {
  const today = getTodayDate();
  const streak = getStreak();
  if (streak.lastDate === today) return streak.count; // already logged today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const newCount = streak.lastDate === yesterdayStr ? streak.count + 1 : 1;
  localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ count: newCount, lastDate: today }));
  return newCount;
};

const applyMoodBonusToGarden = (streakCount: number): void => {
  // Auto-water plants: base 5 points, +2 per consecutive streak day (max 20)
  const waterBonus = Math.min(20, 5 + Math.min(streakCount - 1, 7) * 2);
  const plants = getPlants();
  const updatedPlants = plants.map((pl) => {
    if (!pl.unlocked) return pl;
    const newWater = Math.min(100, pl.waterLevel + waterBonus);
    const newStage = Math.min(4, Math.floor(newWater / 25));
    return { ...pl, waterLevel: newWater, stage: newStage };
  });
  savePlants(updatedPlants);

  // Boost pet happiness by 5 per mood log
  const pets = getPets();
  const updatedPets = pets.map((p) =>
    p.unlocked ? { ...p, happiness: Math.min(100, p.happiness + 5) } : p
  );
  savePets(updatedPets);
};

/** Call this after every successful mood entry save to apply streak and garden bonus. */
export const onMoodLogged = (): void => {
  const newStreak = updateStreak();
  applyMoodBonusToGarden(newStreak);
};

// Mood Entries
export const saveMoodEntry = (entry: MoodEntry): void => {
  const entries = getMoodEntries();
  entries.unshift(entry);
  // Keep last 90 days
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const filtered = entries.filter((e) => e.timestamp > cutoff);
  localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(filtered));
};

export const getMoodEntries = (): MoodEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
    return raw ? (JSON.parse(raw) as MoodEntry[]) : [];
  } catch {
    return [];
  }
};

export const getMoodEntriesLast7Days = (): MoodEntry[] => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return getMoodEntries().filter((e) => e.timestamp > cutoff);
};

export const getMoodEntriesLast30Days = (): MoodEntry[] => {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return getMoodEntries().filter((e) => e.timestamp > cutoff);
};

// Chat Messages
export const saveChatMessage = (msg: ChatMessage): void => {
  const messages = getChatMessages();
  messages.push(msg);
  // Keep last 200 messages
  const trimmed = messages.slice(-200);
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(trimmed));
};

export const getChatMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
};

export const clearChatMessages = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
};

// Coins
export const getCoins = (): number => {
  return parseInt(localStorage.getItem(STORAGE_KEYS.COINS) ?? '0', 10);
};

export const addCoins = (amount: number): void => {
  const current = getCoins();
  localStorage.setItem(STORAGE_KEYS.COINS, String(current + amount));
};

export const spendCoins = (amount: number): boolean => {
  const current = getCoins();
  if (current < amount) return false;
  localStorage.setItem(STORAGE_KEYS.COINS, String(current - amount));
  return true;
};

// Pets
const DEFAULT_PETS: Pet[] = [
  { id: 'penguin', name: '小企鹅', emoji: '🐧', level: 1, happiness: 80, unlocked: true },
  { id: 'cat', name: '小猫咪', emoji: '🐱', level: 1, happiness: 0, unlocked: false },
  { id: 'bunny', name: '小兔子', emoji: '🐰', level: 1, happiness: 0, unlocked: false },
  { id: 'bear', name: '小熊', emoji: '🐻', level: 1, happiness: 0, unlocked: false },
];

export const getPets = (): Pet[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PETS);
    return raw ? (JSON.parse(raw) as Pet[]) : DEFAULT_PETS;
  } catch {
    return DEFAULT_PETS;
  }
};

export const savePets = (pets: Pet[]): void => {
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
};

// Plants
const DEFAULT_PLANTS: Plant[] = [
  { id: 'sunflower', name: '向日葵', emoji: '🌻', stage: 0, waterLevel: 50, unlocked: true },
  { id: 'rose', name: '玫瑰花', emoji: '🌹', stage: 0, waterLevel: 0, unlocked: false },
  { id: 'cactus', name: '仙人掌', emoji: '🌵', stage: 0, waterLevel: 0, unlocked: false },
  { id: 'mushroom', name: '蘑菇', emoji: '🍄', stage: 0, waterLevel: 0, unlocked: false },
];

export const getPlants = (): Plant[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANTS);
    return raw ? (JSON.parse(raw) as Plant[]) : DEFAULT_PLANTS;
  } catch {
    return DEFAULT_PLANTS;
  }
};

export const savePlants = (plants: Plant[]): void => {
  localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
};

// Generate ID
export const generateId = (): string =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);
