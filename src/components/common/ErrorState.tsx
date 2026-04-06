import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
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
  return (
    <View style={[styles.container, containerStyle]}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <View style={styles.defaultIcon}>
          <AppText variant="h1" color={colors.error}>!</AppText>
        </View>
      )}
      
      <AppText variant="h3" color={colors.neutral[800]} style={styles.title} align="center">
        {title}
      </AppText>
      
      <AppText variant="body2" color={colors.neutral[600]} style={styles.message} align="center">
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
    backgroundColor: colors.white,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  defaultIcon: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: colors.error + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.s,
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
