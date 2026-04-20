
export type UrgeIntensity = 'Low' | 'Medium' | 'High';
export type AppTheme = 'light' | 'dark' | 'purple' | 'amoled';

export interface UrgeLog {
  id: string;
  timestamp: number;
  intensity: UrgeIntensity;
}

export interface RelapseLog {
  id: string;
  timestamp: number;
  reason: string;
  timeOfDay: string;
}

export interface CheckInLog {
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface DayNote {
  date: string;
  content: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserData {
  bestStreak: number;
  currentStreak: number;
  lastRelapseTimestamp: number | null;
  urges: UrgeLog[];
  relapses: RelapseLog[];
  checkIns: CheckInLog[];
  notes: DayNote[];
  disciplineScore: number;
  focusMode: boolean;
  theme: AppTheme;
  notificationsEnabled: boolean;
  reminderTime: string; // HH:mm format
  lastNotificationDate: string | null;
}

export const INITIAL_DATA: UserData = {
  bestStreak: 0,
  currentStreak: 0,
  lastRelapseTimestamp: null,
  urges: [],
  relapses: [],
  checkIns: [],
  notes: [],
  disciplineScore: 0,
  focusMode: false,
  theme: 'light',
  notificationsEnabled: false,
  reminderTime: '09:00',
  lastNotificationDate: null,
};
