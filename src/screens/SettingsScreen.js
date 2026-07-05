import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Avatar, Badge, BackButton, Btn, Divider, ToggleSwitch,
} from '../components/common';
import { useApp } from '../context/AppContext';

function Section({ label, children }) {
  return (
    <View style={{ marginTop: Spacing.xl }}>
      <Eyebrow label={label} style={{ marginBottom: Spacing.sm }} />
      <Card>{children}</Card>
    </View>
  );
}

function Row({ label, value, right, onPress, last }) {
  const { colors } = useTheme();
  return (
    <>
      <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.7}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md }}>
        <Txt variant="h5">{label}</Txt>
        {right || (value ? <Txt variant="body" color={colors.textSecondary}>{value}</Txt> : null)}
      </TouchableOpacity>
      {!last ? <Divider style={{ marginVertical: 0 }} /> : null}
    </>
  );
}

export default function SettingsScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { profile, resetOnboarding } = useApp();
  const [reminders, setReminders] = useState(true);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <BackButton onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }} />
        <Txt variant="h2">Settings</Txt>

        {/* Profile */}
        <GreenCard style={{ marginTop: Spacing.lg, flexDirection: 'row', alignItems: 'center' }}>
          <Avatar initials={profile.initials} color="green" size={52} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Txt variant="h4">{profile.name}</Txt>
            <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>{profile.status} · NEET {profile.targetYear}</Txt>
            <Badge label={profile.coaching?.toUpperCase() || 'SELF STUDY'} color="green" style={{ marginTop: 6 }} />
          </View>
          <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>Edit</Text>
        </GreenCard>

        <Section label="PREFERENCES">
          <ToggleSwitch label="Dark mode" value={isDark} onToggle={toggleTheme} />
          <Divider style={{ marginVertical: 0 }} />
          <ToggleSwitch label="Daily reminders" value={reminders} onToggle={setReminders} />
          <Divider style={{ marginVertical: 0 }} />
          <Row label={`Medium: ${profile.medium}`} right={<Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>Change</Text>} last />
        </Section>

        <Section label="EXAM">
          <Row label="Target year" value={`NEET ${profile.targetYear}`} />
          <Row label="Coaching" value={profile.coaching} last />
        </Section>

        <Section label="SUBSCRIPTION">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: Spacing.md }}>
            <Txt variant="h5">Current plan</Txt>
            <Badge label="FREE" color="yellow" />
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Paywall')}>
            <View style={{ backgroundColor: colors.greenGlow, borderWidth: 1, borderColor: colors.greenBorder, borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Txt variant="h5" color={colors.green}>Upgrade to Pro — ₹299/month</Txt>
              <Text style={{ color: colors.green, fontSize: 18 }}>›</Text>
            </View>
          </TouchableOpacity>
        </Section>

        <Section label="ABOUT">
          <Row label="App version" value="1.0.0" />
          <Row label="Privacy Policy" right={<Text style={{ color: colors.textMuted }}>›</Text>} />
          <Row label="Terms of Service" right={<Text style={{ color: colors.textMuted }}>›</Text>} last />
        </Section>

        <TouchableOpacity onPress={resetOnboarding} activeOpacity={0.7} style={{ alignSelf: 'center', paddingVertical: 13, marginTop: Spacing.xl }}>
          <Text style={{ color: colors.orange, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 15 }}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
