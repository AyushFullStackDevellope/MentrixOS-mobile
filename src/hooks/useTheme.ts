import { useThemeContext } from '../contexts/ThemeContext';
import { lightColors, darkColors } from '../theme/colors';

export type ThemeColors = typeof lightColors & { isDark: boolean; toggleTheme: () => void };

export const useTheme = (): ThemeColors => {
  const { theme, toggleTheme } = useThemeContext();
  const colors = theme === 'dark' ? darkColors : lightColors;
  return { ...colors, isDark: theme === 'dark', toggleTheme };
};

