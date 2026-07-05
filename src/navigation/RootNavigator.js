import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import DoubtDropScreen from '../screens/DoubtDropScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ShareResultScreen from '../screens/ShareResultScreen';

const Root = createNativeStackNavigator();

export default function RootNavigator({ onboarded }) {
  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {!onboarded ? (
        <Root.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <Root.Screen name="Main" component={AppNavigator} />
      )}
      {/* Modal screens available over any tab once in the app */}
      <Root.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
        <Root.Screen name="DoubtDrop" component={DoubtDropScreen} />
        <Root.Screen name="Paywall" component={PaywallScreen} />
        <Root.Screen name="ShareResult" component={ShareResultScreen} />
      </Root.Group>
    </Root.Navigator>
  );
}
