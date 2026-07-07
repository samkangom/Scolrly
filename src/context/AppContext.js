import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Storage, KEYS } from '../utils/storage';
import { USER } from '../data';
import { api } from '../api/client';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState(USER);
  const [streak, setStreak] = useState(USER.streakDays);
  const [answered, setAnswered] = useState([]);
  const [bookmarks, setBookmarks] = useState(['c2', 'c3']);
  const [online, setOnline] = useState(false);

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
      const mergedProfile = prof ? { ...USER, ...prof } : USER;
      if (prof) setProfile(mergedProfile);
      if (strk != null) setStreak(Number(strk));
      if (ans) setAnswered(ans);
      if (bm) setBookmarks(bm);
      setReady(true);

      // Establish a device-bound server session in the background.
      // The app is fully functional offline; server sync is best-effort.
      const serverUser = await api.connect(mergedProfile);
      if (serverUser) {
        setOnline(true);
        if (serverUser.streakDays > 0) {
          setStreak(serverUser.streakDays);
          Storage.set(KEYS.streak, String(serverUser.streakDays));
        }
      }
    })();
  }, []);

  const completeOnboarding = useCallback(async (data) => {
    let merged = profile;
    if (data) {
      merged = { ...USER, ...data };
      setProfile(merged);
      await Storage.setJSON(KEYS.profile, merged);
    }
    setOnboarded(true);
    await Storage.set(KEYS.onboarded, 'true');
    api.connect(merged).then((u) => u && setOnline(true)); // sync profile upstream
  }, [profile]);

  const resetOnboarding = useCallback(async () => {
    setOnboarded(false);
    await Storage.remove(KEYS.onboarded);
  }, []);

  const markAnswered = useCallback((id, picked, timeMs) => {
    setAnswered((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      Storage.setJSON(KEYS.answeredQuestions, next);
      Storage.set(KEYS.lastStudyDate, new Date().toISOString());
      return next;
    });
    // Best-effort sync; server also maintains the authoritative streak.
    if (picked) {
      api.post('/api/attempts', { questionId: id, picked, timeMs }).then((r) => {
        if (r?.streakDays) {
          setStreak(r.streakDays);
          Storage.set(KEYS.streak, String(r.streakDays));
        }
      });
    }
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      Storage.setJSON(KEYS.bookmarkedCards, next);
      return next;
    });
    api.post(`/api/concepts/${id}/bookmark`); // fire-and-forget sync
  }, []);

  return (
    <AppContext.Provider
      value={{ ready, onboarded, online, profile, streak, answered, bookmarks, completeOnboarding, resetOnboarding, markAnswered, toggleBookmark }}
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
