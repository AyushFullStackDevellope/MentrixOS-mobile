import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (t: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const systemTheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [themeMode, setThemeMode] = useState<ThemeType>('system');

  const theme = themeMode === 'system' ? systemTheme : themeMode;

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const current = prev === 'system' ? systemTheme : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
