import { useWindowDimensions } from 'react-native';

export const useDeviceType = () => {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isPhone = width < 768;
  const isSmallPhone = width < 375;
  const isLandscape = width > height;

  return {
    isTablet,
    isPhone,
    isSmallPhone,
    isLandscape,
    width,
    height,
  };
};
