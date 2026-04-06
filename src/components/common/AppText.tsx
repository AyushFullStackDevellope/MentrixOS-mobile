import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

type Variant = "h1" | "h3" | "body2";

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
  align?: TextStyle["textAlign"];
};

const variantStyles: Record<Variant, TextStyle> = {
  h1: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
};

export function AppText({
  style,
  children,
  variant,
  color,
  align,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        variant ? variantStyles[variant] : null,
        color ? { color } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    // No hardcoded color here, allow inheritance from parent or style prop
  },
});

export default AppText;
