import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PaywallScreen from '../screens/PaywallScreen';
import PracticeScreen from '../screens/PracticeScreen';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';
import QuestionSessionScreen from '../screens/QuestionSessionScreen';
import ConceptLibraryScreen from '../screens/ConceptLibraryScreen';
import MockScreen from '../screens/MockScreen';
import MockResultScreen from '../screens/MockResultScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoomsScreen from '../screens/RoomsScreen';
import ActiveRoomScreen from '../screens/ActiveRoomScreen';
import DoubtDropScreen from '../screens/DoubtDropScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const PracticeStack = createNativeStackNavigator();
const MockStack = createNativeStackNavigator();
const ProgressStack = createNativeStackNavigator();
const RoomsStack = createNativeStackNavigator();

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
      <HomeStack.Screen name="Paywall" component={PaywallScreen} />
    </HomeStack.Navigator>
  );
}

function PracticeStackNav() {
  return (
    <PracticeStack.Navigator screenOptions={{ headerShown: false }}>
      <PracticeStack.Screen name="Practice" component={PracticeScreen} />
      <PracticeStack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
      <PracticeStack.Screen name="QuestionSession" component={QuestionSessionScreen} />
      <PracticeStack.Screen name="ConceptLibrary" component={ConceptLibraryScreen} />
    </PracticeStack.Navigator>
  );
}

function MockStackNav() {
  return (
    <MockStack.Navigator screenOptions={{ headerShown: false }}>
      <MockStack.Screen name="MockMain" component={MockScreen} />
      <MockStack.Screen name="MockResult" component={MockResultScreen} />
    </MockStack.Navigator>
  );
}

function ProgressStackNav() {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="ProgressMain" component={ProgressScreen} />
      <ProgressStack.Screen name="Profile" component={ProfileScreen} />
    </ProgressStack.Navigator>
  );
}

function RoomsStackNav() {
  return (
    <RoomsStack.Navigator screenOptions={{ headerShown: false }}>
      <RoomsStack.Screen name="RoomsMain" component={RoomsScreen} />
      <RoomsStack.Screen name="ActiveRoom" component={ActiveRoomScreen} />
      <RoomsStack.Screen name="DoubtDrop" component={DoubtDropScreen} />
    </RoomsStack.Navigator>
  );
}

const TAB_ICONS = {
  Home: { active: '●', inactive: '○', label: 'Home' },
  PracticeTab: { active: '▶', inactive: '▷', label: 'Practice' },
  Mocks: { active: '◆', inactive: '◇', label: 'Mocks' },
  Progress: { active: '▲', inactive: '△', label: 'Progress' },
  Rooms: { active: '■', inactive: '□', label: 'Rooms' },
};

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabel: TAB_ICONS[route.name]?.label || route.name,
        tabBarIcon: ({ focused, color, size }) => {
          const icon = TAB_ICONS[route.name];
          const { Text: RNText } = require('react-native');
          return (
            <RNText style={{ color, fontSize: 16 }}>
              {focused ? icon?.active : icon?.inactive}
            </RNText>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNav} />
      <Tab.Screen name="PracticeTab" component={PracticeStackNav} options={{ tabBarLabel: 'Practice' }} />
      <Tab.Screen name="Mocks" component={MockStackNav} />
      <Tab.Screen name="Progress" component={ProgressStackNav} />
      <Tab.Screen name="Rooms" component={RoomsStackNav} />
    </Tab.Navigator>
  );
}
