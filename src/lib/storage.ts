
import { UserData, INITIAL_DATA } from './types';

const STORAGE_KEY = 'ironwill_v1_data';

/**
 * Deep merges stored data with INITIAL_DATA to ensure all arrays and fields are present.
 */
const migrateData = (parsed: any): UserData => {
  return {
    ...INITIAL_DATA,
    ...parsed,
    urges: Array.isArray(parsed?.urges) ? parsed.urges : INITIAL_DATA.urges,
    relapses: Array.isArray(parsed?.relapses) ? parsed.relapses : INITIAL_DATA.relapses,
    checkIns: Array.isArray(parsed?.checkIns) ? parsed.checkIns : INITIAL_DATA.checkIns,
    notes: Array.isArray(parsed?.notes) ? parsed.notes : INITIAL_DATA.notes,
    browserHistory: Array.isArray(parsed?.browserHistory) ? parsed.browserHistory : INITIAL_DATA.browserHistory,
  };
};

export const getStoredData = (): UserData => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    const parsed = JSON.parse(stored);
    return migrateData(parsed);
  } catch (e) {
    console.warn("Corrupted storage detected, resetting to defaults.");
    return INITIAL_DATA;
  }
};

export const saveData = (data: UserData) => {
  if (typeof window === 'undefined' || !data) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const importData = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (data && (typeof data.currentStreak === 'number' || Array.isArray(data.urges))) {
      saveData(migrateData(data));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
