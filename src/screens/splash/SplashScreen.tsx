import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

/**
 * Splash Screen — now follows the app's theme (Dark/Light mode)
 */
export default function SplashScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.info} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});