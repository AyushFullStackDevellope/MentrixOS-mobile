import React, { forwardRef } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import type { TextInputProps, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { spacing, radius, typography } from "../../theme";

export interface AppInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
}

/**
 * Common Input component with theme-aware styling and consistent layout
 * Supports a right-side icon slot (e.g., password eye toggle).
 */
export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ containerStyle, rightIcon, ...props }, ref) => {
    const colors = useTheme();

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            flexDirection: "row", // Added row to support icon
            alignItems: "center",
          },
          containerStyle,
        ]}
      >
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 54,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: typography.body1?.fontSize || 16,
    height: "100%", // ensure height for input
  },
  rightIconWrapper: {
    marginLeft: spacing.sm,
  },
});

export default AppInput;