import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  ProfileSetupScreen,
  BrainScanIntroScreen,
  BrainScanResultScreen,
} from '../screens/OnboardingScreens';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="BrainScanIntro" component={BrainScanIntroScreen} />
      <Stack.Screen name="BrainScanResult" component={BrainScanResultScreen} />
    </Stack.Navigator>
  );
}
