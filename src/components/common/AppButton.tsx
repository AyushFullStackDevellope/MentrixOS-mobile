import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import type { ViewStyle, TextStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppText from "./AppText";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
}

/**
 * Common Button component with theme-aware styling and variants
 */
export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  containerStyle,
  variant = 'primary',
  disabled = false
}) => {
  const colors = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary || '#6B7280' };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return { color: colors.primary };
      default:
        return { color: '#fff' };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        getVariantStyle(),
        containerStyle,
        style,
        disabled ? styles.btnDisabled : null
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <AppText style={[styles.text, getTextStyle(), textStyle]}>{title}</AppText>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AppButton;