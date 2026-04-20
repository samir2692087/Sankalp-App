
import { UserData, INITIAL_DATA } from './types';

const STORAGE_KEY = 'ironwill_v1_data';

export const getStoredData = (): UserData => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    const parsed = JSON.parse(stored);
    // Merge with INITIAL_DATA to ensure all fields exist even if the backup is old
    return { ...INITIAL_DATA, ...parsed };
  } catch (e) {
    return INITIAL_DATA;
  }
};

export const saveData = (data: UserData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const importData = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    // Basic validation
    if (typeof data.currentStreak === 'number' && Array.isArray(data.urges)) {
      saveData({ ...INITIAL_DATA, ...data });
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
