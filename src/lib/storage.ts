
import { UserData, INITIAL_DATA } from './types';

const STORAGE_KEY = 'ironwill_v1_data';

/**
 * Deep merges stored data with INITIAL_DATA to ensure all arrays and fields are present.
 * Uses explicit checks for array types to prevent corrupted data from crashing the app.
 */
const migrateData = (parsed: any): UserData => {
  if (!parsed || typeof parsed !== 'object') return INITIAL_DATA;
  
  return {
    ...INITIAL_DATA,
    ...parsed,
    urges: Array.isArray(parsed?.urges) ? parsed.urges : [],
    relapses: Array.isArray(parsed?.relapses) ? parsed.relapses : [],
    checkIns: Array.isArray(parsed?.checkIns) ? parsed.checkIns : [],
    notes: Array.isArray(parsed?.notes) ? parsed.notes : [],
    browserHistory: Array.isArray(parsed?.browserHistory) ? parsed.browserHistory : [],
    currentStreak: typeof parsed?.currentStreak === 'number' && !isNaN(parsed.currentStreak) ? parsed.currentStreak : 0,
    bestStreak: typeof parsed?.bestStreak === 'number' && !isNaN(parsed.bestStreak) ? parsed.bestStreak : 0,
    disciplineScore: typeof parsed?.disciplineScore === 'number' && !isNaN(parsed.disciplineScore) ? parsed.disciplineScore : 0,
    streakFreezes: typeof parsed?.streakFreezes === 'number' && !isNaN(parsed.streakFreezes) ? parsed.streakFreezes : 3,
    maxFreezes: typeof parsed?.maxFreezes === 'number' && !isNaN(parsed.maxFreezes) ? parsed.maxFreezes : 3,
    theme: ['light', 'dark', 'purple', 'amoled'].includes(parsed?.theme) ? parsed.theme : 'dark',
    notificationsEnabled: !!parsed?.notificationsEnabled,
    reminderTime: typeof parsed?.reminderTime === 'string' ? parsed.reminderTime : '09:00',
  };
};

export const getStoredData = (): UserData => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored || stored === 'undefined' || stored === 'null') return INITIAL_DATA;
  
  try {
    const parsed = JSON.parse(stored);
    return migrateData(parsed);
  } catch (e) {
    return INITIAL_DATA;
  }
};

export const saveData = (data: UserData) => {
  if (typeof window === 'undefined' || !data) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Fail silently to avoid UI crashes
  }
};

export const clearData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const importData = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (data && typeof data === 'object') {
      saveData(migrateData(data));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
