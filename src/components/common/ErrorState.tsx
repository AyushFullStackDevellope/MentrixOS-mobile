import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { palette } from '../../theme/colors';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { spacing } from '../../theme/spacing';
import { normalize, verticalScale } from '../../utils/responsive';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  icon,
  containerStyle,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }, containerStyle]}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <View style={[styles.defaultIcon, { backgroundColor: theme.error + '10' }]}>
          <AppText variant="h1" color={theme.error}>!</AppText>
        </View>
      )}
      
      <AppText variant="h3" color={theme.textPrimary} style={styles.title} align="center">
        {title}
      </AppText>
      
      <AppText variant="body2" color={theme.textSecondary} style={styles.message} align="center">
        {message}
      </AppText>
      
      {onRetry && (
        <AppButton
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          containerStyle={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  defaultIcon: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  message: {
    marginBottom: spacing.xxxl,
    maxWidth: '80%',
    lineHeight: normalize(20),
  },
  button: {
    minWidth: normalize(150),
  },
});
