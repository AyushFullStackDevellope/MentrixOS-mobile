import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Standard design screen size (usually based on iPhone 13/14 or similar)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

export const horizontalScale = (size: number) => {
  return size * widthScale;
};

export const verticalScale = (size: number) => {
  return size * heightScale;
};

export const moderateScale = (size: number, factor = 0.5) => {
  return size + (horizontalScale(size) - size) * factor;
};

export const normalize = (size: number) => {
  const newSize = size * widthScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH > 768;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
