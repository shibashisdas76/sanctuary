export type NavTab = 'sanctuary' | 'journal' | 'library' | 'insights' | 'settings';

export type MoodType = 'Calm' | 'Energized' | 'Foggy' | 'Heavy' | 'Overwhelmed' | 'Peaceful' | 'Anxious';

export interface MoodLog {
  id: string;
  mood: MoodType;
  emoji: string;
  intensity: number; // 1-10
  timestamp: string; // ISO string
  note?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  stressTag: 'Low Stress' | 'Moderate' | 'Rested' | 'High Stress' | 'Balanced';
  timestamp: string; // e.g. "Today, 2:30 PM" or ISO string
  formattedDate: string;
}

export interface ExerciseLog {
  id: string;
  type: 'Box Breathing' | '5-4-3-2-1 Grounding' | '5-min Breathe' | 'Lo-fi Session' | 'Digital De-stress';
  durationSeconds: number;
  completedAt: string;
}

export interface GratitudeNote {
  id: string;
  text: string;
  color: string;
  timestamp: string;
}

export interface CachedAsset {
  url: string;
  blobUrl?: string;
  mimeType: string;
  sizeBytes: number;
  cachedAt: number;
  lastAccessed: number;
  hitCount: number;
}

export type NetworkSpeed = 'fast4g' | 'slow3g' | 'offline';

export interface SQFliteQueryLog {
  id: string;
  sql: string;
  params?: any[];
  executionTimeMs: number;
  timestamp: string;
  type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'TRANSACTION';
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  mentalEnergy: number; // 0 - 100
  mentalEnergyStatus: string;
}
