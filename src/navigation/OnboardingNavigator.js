import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  OnboardWelcome,
  OnboardProfile,
  OnboardBrainIntro,
  OnboardBrainScan,
  OnboardResult,
} from '../screens/OnboardingScreens';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OnboardWelcome" component={OnboardWelcome} />
      <Stack.Screen name="OnboardProfile" component={OnboardProfile} />
      <Stack.Screen name="OnboardBrainIntro" component={OnboardBrainIntro} />
      <Stack.Screen name="OnboardBrainScan" component={OnboardBrainScan} />
      <Stack.Screen name="OnboardResult" component={OnboardResult} />
    </Stack.Navigator>
  );
}
