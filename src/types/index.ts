export type MoodId =
  | 'happy'
  | 'excited'
  | 'calm'
  | 'loved'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'scared'
  | 'tired'
  | 'confused';

export interface Mood {
  id: MoodId;
  emoji: string;
  label: string;
  labelEn: string;
  color: string;
  intensity: number; // 1-5
}

export interface MoodEntry {
  id: string;
  moodId: MoodId;
  note: string;
  timestamp: number;
  intensity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface Pet {
  id: string;
  name: string;
  emoji: string;
  level: number;
  happiness: number; // 0-100
  unlocked: boolean;
}

export interface Plant {
  id: string;
  name: string;
  emoji: string;
  stage: number; // 0-4 (seed -> sprout -> plant -> flower -> bloom)
  waterLevel: number; // 0-100
  unlocked: boolean;
}

export type Screen = 'home' | 'mood' | 'chat' | 'garden' | 'dashboard';

export type AgeGroup = 'toddler' | 'kid' | 'teen';
