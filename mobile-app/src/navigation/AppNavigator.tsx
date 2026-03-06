import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
import { TradingScreen } from '../screens/TradingScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { AgentDetailScreen } from '../screens/AgentDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// Types
export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  MainApp: undefined;
  AgentDetail: { agentId: string };
};

export type TabParamList = {
  Dashboard: undefined;
  Portfolio: undefined;
  Trading: undefined;
  Explore: undefined;
  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Portfolio':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Trading':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Explore':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066ff',
        tabBarInactiveTintColor: '#71717a',
        tabBarStyle: {
          backgroundColor: '#0b0c0f',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        headerStyle: {
          backgroundColor: '#040405',
          borderBottomColor: 'rgba(255,255,255,0.06)',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{ title: 'Portfolio' }}
      />
      <Tab.Screen 
        name="Trading" 
        component={TradingScreen}
        options={{ title: 'Trading' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explore' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#040405',
        },
        headerTintColor: '#ffffff',
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: '#040405',
        },
      }}
    >
      <RootStack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="Auth" 
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="MainApp" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="AgentDetail" 
        component={AgentDetailScreen}
        options={{ 
          title: 'Agent Details',
          presentation: 'modal',
        }}
      />
    </RootStack.Navigator>
  );
}