import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
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
  if (!visible) return null;

  const LoaderContent = (
    <View style={[styles.container, overlay && styles.overlayContainer, containerStyle]}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        {message && (
          <AppText
            variant="body2"
            color={colors.neutral[600]}
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.xxl,
    borderRadius: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: normalize(120),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  message: {
    marginTop: spacing.m,
    fontWeight: '500',
  },
});
