import AsyncStorage from '@react-native-async-storage/async-storage';

// All persisted keys live here so callers never type raw strings.
export const KEYS = {
  onboarded: '@scolrly/onboarded',
  theme: '@scolrly/theme',
  profile: '@scolrly/profile',
  streak: '@scolrly/streak',
  lastStudyDate: '@scolrly/lastStudyDate',
  answeredQuestions: '@scolrly/answeredQuestions',
  bookmarkedCards: '@scolrly/bookmarkedCards',
};

export const Storage = {
  async get(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // best-effort persistence; ignore write failures
    }
  },
  async getJSON(key, fallback = null) {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  async setJSON(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
