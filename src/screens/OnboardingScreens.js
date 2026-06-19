import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Btn, Card } from '../components/common';

export function WelcomeScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
      <Text style={[{ fontSize: 64, marginBottom: Spacing.xl }]}>&#127891;</Text>
      <Text style={[Typography.hero, { color: colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm }]}>Scolrly</Text>
      <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxl }]}>
        Your AI-powered NEET prep companion. Smarter practice, better results.
      </Text>
      <Btn title="Get Started" onPress={() => navigation.navigate('ProfileSetup')} style={{ width: '100%' }} />
    </SafeAreaView>
  );
}

export function ProfileSetupScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');
  const [year, setYear] = useState('');

  const inputStyle = [Typography.body, { backgroundColor: colors.card, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: Spacing.base }];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: Spacing.xl }}>
      <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.xs }]}>About You</Text>
      <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.xxl }]}>Let us personalize your experience.</Text>

      <Text style={[Typography.caption, { color: colors.textMuted, marginBottom: Spacing.xs }]}>Full Name</Text>
      <TextInput placeholder="Arjun Sharma" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} style={inputStyle} />

      <Text style={[Typography.caption, { color: colors.textMuted, marginBottom: Spacing.xs }]}>Class</Text>
      <TextInput placeholder="Class 12" placeholderTextColor={colors.textMuted} value={cls} onChangeText={setCls} style={inputStyle} />

      <Text style={[Typography.caption, { color: colors.textMuted, marginBottom: Spacing.xs }]}>Target Year</Text>
      <TextInput placeholder="2026" placeholderTextColor={colors.textMuted} value={year} onChangeText={setYear} style={inputStyle} keyboardType="number-pad" />

      <View style={{ flex: 1 }} />
      <Btn title="Continue" onPress={() => navigation.navigate('BrainScanIntro')} />
    </SafeAreaView>
  );
}

export function BrainScanIntroScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
      <Text style={[{ fontSize: 64, marginBottom: Spacing.xl }]}>&#129504;</Text>
      <Text style={[Typography.h1, { color: colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md }]}>Brain Scan</Text>
      <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl }]}>
        We'll run a quick adaptive test to understand your strengths and weaknesses. This helps us create a personalized study plan just for you.
      </Text>
      <Card style={{ width: '100%', marginBottom: Spacing.xl }}>
        <View style={{ flexDirection: 'row', marginBottom: Spacing.sm }}>
          <Text style={[Typography.bodyBold, { color: colors.green, marginRight: Spacing.sm }]}>&#10003;</Text>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>20 questions across all subjects</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: Spacing.sm }}>
          <Text style={[Typography.bodyBold, { color: colors.green, marginRight: Spacing.sm }]}>&#10003;</Text>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>Adapts difficulty based on answers</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Typography.bodyBold, { color: colors.green, marginRight: Spacing.sm }]}>&#10003;</Text>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>Takes about 15 minutes</Text>
        </View>
      </Card>
      <Btn title="Start Brain Scan" onPress={() => navigation.navigate('BrainScanResult')} style={{ width: '100%' }} />
    </SafeAreaView>
  );
}

export function BrainScanResultScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
      <Text style={[{ fontSize: 64, marginBottom: Spacing.xl }]}>&#127942;</Text>
      <Text style={[Typography.h1, { color: colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm }]}>Scan Complete!</Text>
      <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxl }]}>
        We've mapped your knowledge across all NEET subjects.
      </Text>

      <Card style={{ width: '100%', alignItems: 'center', marginBottom: Spacing.xl, paddingVertical: Spacing.xl }}>
        <Text style={[Typography.eyebrow, { color: colors.green, marginBottom: Spacing.sm }]}>YOUR ESTIMATED SCORE</Text>
        <Text style={[{ fontSize: 52, fontWeight: '800', color: colors.green }]}>542</Text>
        <Text style={[Typography.body, { color: colors.textSecondary }]}>out of 720</Text>
      </Card>

      <Btn title="Enter App" onPress={() => {}} style={{ width: '100%' }} />
    </SafeAreaView>
  );
}
