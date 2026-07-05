import React, { createContext, useContext, useState, useEffect } from 'react';
import { Palette, DarkTheme, LightTheme } from './tokens';
import { Storage, KEYS } from '../utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Storage.get(KEYS.theme).then((val) => {
      if (val === 'light') setIsDark(false);
      else if (val === 'dark') setIsDark(true);
      setReady(true);
    });
  }, []);

  const setTheme = (dark) => {
    setIsDark(dark);
    Storage.set(KEYS.theme, dark ? 'dark' : 'light');
  };

  const toggleTheme = () => setTheme(!isDark);

  const scheme = isDark ? DarkTheme : LightTheme;

  // All brand/accent tokens are theme-independent; surface tokens flip.
  const colors = {
    ...Palette,
    ...scheme,
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, ready, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
