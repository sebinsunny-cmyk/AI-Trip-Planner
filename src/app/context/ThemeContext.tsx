import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { applyTheme, darkTheme, lightTheme } from '../constants/colors';

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tripmind-theme');
      return saved !== 'light';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    applyTheme(isDark ? darkTheme : lightTheme);
    try { localStorage.setItem('tripmind-theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  // Apply correct theme on first mount (in case of SSR hydration or stale tm state)
  useEffect(() => {
    applyTheme(isDark ? darkTheme : lightTheme);
  }, []);

  function toggle() {
    applyTheme(!isDark ? darkTheme : lightTheme);
    setIsDark(d => !d);
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
