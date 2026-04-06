import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import LoginScreen from "../screens/login/LoginScreen";
import AppNavigator from "./AppNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  // Navigation: Login flow requires preContextToken/accessToken to reach selection/dashboard
  const { isLoading, accessToken, preContextToken } = useAuth();

  if (isLoading) {
    return null;
  }

  // If no tokens, show Login. 
  // If we have either token, show the App flow (which contains selection and dashboard).
  const isAuthenticated = !!(accessToken || preContextToken);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="App" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
}