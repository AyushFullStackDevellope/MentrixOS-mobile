import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { palette } from '../../theme/colors';
import { AppText } from './AppText';
import { spacing } from '../../theme/spacing';
import { normalize } from '../../utils/responsive';

interface AppLoaderProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean;
  containerStyle?: ViewStyle;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  visible = true,
  message,
  overlay = false,
  containerStyle,
}) => {
  const theme = useTheme();
  if (!visible) return null;

  const LoaderContent = (
    <View style={[styles.container, overlay && styles.overlayContainer, containerStyle]}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={theme.primary} />
        {message && (
          <AppText
            variant="body2"
            color={theme.textSecondary}
            style={styles.message}
            align="center"
          >
            {message}
          </AppText>
        )}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {LoaderContent}
      </Modal>
    );
  }

  return LoaderContent;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: palette.overlay,
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: palette.white,
    padding: spacing.xxl,
    borderRadius: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: normalize(120),
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  message: {
    marginTop: spacing.md,
    fontWeight: '500',
  },
});
