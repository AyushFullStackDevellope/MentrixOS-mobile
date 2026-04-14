import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';


function App(): React.JSX.Element {
  return (
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;
