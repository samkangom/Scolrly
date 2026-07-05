import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { Haptic } from '../utils/haptics';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
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

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const PracticeStack = createNativeStackNavigator();
const MockStack = createNativeStackNavigator();
const ProgressStack = createNativeStackNavigator();
const RoomsStack = createNativeStackNavigator();

const stackOpts = { headerShown: false, animation: 'slide_from_right' };

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={stackOpts}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
  );
}
function PracticeStackNav() {
  return (
    <PracticeStack.Navigator screenOptions={stackOpts}>
      <PracticeStack.Screen name="PracticeMain" component={PracticeScreen} />
      <PracticeStack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
      <PracticeStack.Screen name="QuestionSession" component={QuestionSessionScreen} />
      <PracticeStack.Screen name="ConceptLibrary" component={ConceptLibraryScreen} />
    </PracticeStack.Navigator>
  );
}
function MockStackNav() {
  return (
    <MockStack.Navigator screenOptions={stackOpts}>
      <MockStack.Screen name="MockMain" component={MockScreen} />
      <MockStack.Screen name="QuestionSession" component={QuestionSessionScreen} />
      <MockStack.Screen name="MockResult" component={MockResultScreen} />
    </MockStack.Navigator>
  );
}
function ProgressStackNav() {
  return (
    <ProgressStack.Navigator screenOptions={stackOpts}>
      <ProgressStack.Screen name="ProgressMain" component={ProgressScreen} />
      <ProgressStack.Screen name="Profile" component={ProfileScreen} />
    </ProgressStack.Navigator>
  );
}
function RoomsStackNav() {
  return (
    <RoomsStack.Navigator screenOptions={stackOpts}>
      <RoomsStack.Screen name="RoomsMain" component={RoomsScreen} />
      <RoomsStack.Screen name="ActiveRoom" component={ActiveRoomScreen} />
    </RoomsStack.Navigator>
  );
}

const TABS = {
  Home: { icon: '⌂', label: 'Home' },
  Practice: { icon: '📖', label: 'Practice' },
  Mocks: { icon: '📋', label: 'Mocks' },
  Progress: { icon: '📊', label: 'Progress' },
  Rooms: { icon: '👥', label: 'Rooms' },
};

function TabBar({ state, navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.bg,
      borderTopWidth: 0.5,
      borderTopColor: colors.navBorder,
      paddingTop: 8,
      paddingBottom: Math.max(insets.bottom, 8),
    }}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TABS[route.name] || { icon: '•', label: route.name };
        const tint = focused ? colors.green : colors.textMuted;
        const onPress = () => {
          Haptic.light();
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <TouchableOpacity key={route.key} activeOpacity={0.8} onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{meta.icon}</Text>
            <Text style={{ color: tint, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 10, marginTop: 3 }}>{meta.label}</Text>
            <View style={{ width: 4, height: 4, borderRadius: 2, marginTop: 3, backgroundColor: focused ? colors.green : 'transparent' }} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNav} />
      <Tab.Screen name="Practice" component={PracticeStackNav} />
      <Tab.Screen name="Mocks" component={MockStackNav} />
      <Tab.Screen name="Progress" component={ProgressStackNav} />
      <Tab.Screen name="Rooms" component={RoomsStackNav} />
    </Tab.Navigator>
  );
}
