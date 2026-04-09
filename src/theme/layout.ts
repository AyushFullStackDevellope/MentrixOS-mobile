import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Common layout constants for responsiveness.
 */
export const layout = {
  window: {
    width,
    height: Dimensions.get('window').height,
  },
  isSmallDevice: width < 375,
  isTablet: width >= 768,
  
  // Maximum width for content containers on large screens (iPad, etc.)
  // This prevents the UI from stretching too wide in landscape mode.
  maxContentWidth: 720,
  
  // Adaptive container helper styles
  adaptiveContainer: {
    width: '100%' as any,
    maxWidth: 720,
    alignSelf: 'center' as const,
  }
};
