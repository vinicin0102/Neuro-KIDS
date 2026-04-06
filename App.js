import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

import { AppProvider } from './src/context/AppContext';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import RoutineScreen from './src/screens/RoutineScreen';
import CommunicationScreen from './src/screens/CommunicationScreen';
import GamesScreen from './src/screens/GamesScreen';
import AIScreen from './src/screens/AIScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import ParentsScreen from './src/screens/ParentsScreen';
import { Colors } from './src/themes/Colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ emoji, label, focused }) => (
  <View style={[tabStyles.container, focused && tabStyles.focused]}>
    <Text style={[tabStyles.emoji, focused && tabStyles.emojiActive]}>{emoji}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  focused: {},
  emoji: {
    fontSize: 24,
    opacity: 0.5,
  },
  emojiActive: {
    fontSize: 28,
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 85,
          paddingBottom: 16,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          position: 'absolute',
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Início" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Rotina"
        component={RoutineScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗓️" label="Rotina" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Falar"
        component={CommunicationScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Falar" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Jogos"
        component={GamesScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎮" label="Jogos" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Astro"
        component={AIScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" label="Astro" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.background } }}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Parents" component={ParentsScreen} />
          <Stack.Screen name="Rewards" component={RewardsScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </AppProvider>
  );
}
