import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from './tokens';

const THEME_KEY = '@scolrly_theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val !== null) setIsDark(val === 'dark');
    });
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  const colors = {
    ...Colors.brand,
    ...Colors.accent,
    bg: isDark ? Colors.dark.bg : Colors.light.bg,
    card: isDark ? Colors.dark.card : Colors.light.card,
    card2: isDark ? Colors.dark.card2 : Colors.light.card2,
    border: isDark ? Colors.dark.border : Colors.light.border,
    textPrimary: isDark ? Colors.dark.textPrimary : Colors.light.textPrimary,
    textSecondary: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
    textMuted: isDark ? Colors.dark.textMuted : Colors.light.textMuted,
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
