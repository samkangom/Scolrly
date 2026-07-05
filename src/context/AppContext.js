import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Storage, KEYS } from '../utils/storage';
import { USER } from '../data';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState(USER);
  const [streak, setStreak] = useState(USER.streakDays);
  const [answered, setAnswered] = useState([]);
  const [bookmarks, setBookmarks] = useState(['c2', 'c3']);

  useEffect(() => {
    (async () => {
      const [ob, prof, strk, ans, bm] = await Promise.all([
        Storage.get(KEYS.onboarded),
        Storage.getJSON(KEYS.profile, null),
        Storage.get(KEYS.streak),
        Storage.getJSON(KEYS.answeredQuestions, null),
        Storage.getJSON(KEYS.bookmarkedCards, null),
      ]);
      if (ob === 'true') setOnboarded(true);
      if (prof) setProfile({ ...USER, ...prof });
      if (strk != null) setStreak(Number(strk));
      if (ans) setAnswered(ans);
      if (bm) setBookmarks(bm);
      setReady(true);
    })();
  }, []);

  const completeOnboarding = useCallback(async (data) => {
    if (data) {
      const merged = { ...USER, ...data };
      setProfile(merged);
      await Storage.setJSON(KEYS.profile, merged);
    }
    setOnboarded(true);
    await Storage.set(KEYS.onboarded, 'true');
  }, []);

  const resetOnboarding = useCallback(async () => {
    setOnboarded(false);
    await Storage.remove(KEYS.onboarded);
  }, []);

  const markAnswered = useCallback((id) => {
    setAnswered((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      Storage.setJSON(KEYS.answeredQuestions, next);
      Storage.set(KEYS.lastStudyDate, new Date().toISOString());
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      Storage.setJSON(KEYS.bookmarkedCards, next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ ready, onboarded, profile, streak, answered, bookmarks, completeOnboarding, resetOnboarding, markAnswered, toggleBookmark }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
