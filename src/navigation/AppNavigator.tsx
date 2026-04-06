import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import type { Institute, InstituteRole } from "../types/session";

import InstituteSelectionScreen from "../screens/institute/InstituteSelectionScreen";
import RoleSelectionScreen from "../screens/role/RoleSelectionScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";

// Typed route params for each screen in the app flow
export type AppStackParamList = {
  Institute: undefined;
  Role: { selectedInstitute: Institute };
  Dashboard: { selectedInstitute: Institute; selectedRole: InstituteRole };
};

import { useAuth } from "../hooks/useAuth";

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  const { accessToken, selectedInstitute, selectedRole } = useAuth();
  
  // Decide where to start based on session state
  const initialRouteName = accessToken ? "Dashboard" : "Institute";

  return (
    <Stack.Navigator 
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Institute" component={InstituteSelectionScreen} />
      <Stack.Screen name="Role" component={RoleSelectionScreen} />
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        initialParams={
          accessToken && selectedInstitute && selectedRole 
            ? { selectedInstitute, selectedRole } 
            : undefined
        }
      />
    </Stack.Navigator>
  );
}
