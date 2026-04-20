
import { UserData, INITIAL_DATA } from './types';

const STORAGE_KEY = 'ironwill_v1_data';

export const getStoredData = (): UserData => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    return JSON.parse(stored);
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
