import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

import { AppNavigator } from './src/navigation/AppNavigator';
import { WalletProvider } from './src/components/WalletProvider';
import { NotificationProvider } from './src/components/NotificationProvider';
import { ThemeProvider } from './src/components/ThemeProvider';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NotificationProvider>
            <WalletProvider>
              <NavigationContainer>
                <AppNavigator />
                <StatusBar style="light" backgroundColor="#040405" />
              </NavigationContainer>
            </WalletProvider>
          </NotificationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});