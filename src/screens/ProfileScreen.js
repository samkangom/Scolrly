import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing } from '../theme';
import { Card, Avatar, SectionHeader, Badge } from '../components/common';
import { USER, STATS } from '../data';

export default function ProfileScreen() {
  const { colors } = useTheme();

  const stats = [
    { label: 'Questions', value: STATS.totalQuestionsAnswered.toLocaleString() },
    { label: 'Accuracy', value: STATS.accuracy + '%' },
    { label: 'Hours', value: STATS.hoursStudied.toString() },
    { label: 'Mocks', value: STATS.mocksCompleted.toString() },
  ];

  const achievements = [
    { label: 'First Mock', icon: '🎯' },
    { label: '7-Day Streak', icon: '🔥' },
    { label: '1000 Qs', icon: '💪' },
    { label: 'Biology Master', icon: '🧬' },
    { label: 'Speed Demon', icon: '⚡' },
    { label: 'Night Owl', icon: '🦉' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>Profile</Text>

        {/* Avatar + Name */}
        <View style={{ alignItems: 'center', marginBottom: Spacing.xl }}>
          <Avatar name={USER.name} size={80} style={{ marginBottom: Spacing.md }} />
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>{USER.name}</Text>
          <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>{USER.class} · {USER.coaching}</Text>
          <Badge label={`${USER.streak} day streak`} color={colors.green} />
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl }}>
          {stats.map((s) => (
            <Card key={s.label} style={{ width: '48%', alignItems: 'center', paddingVertical: Spacing.lg }}>
              <Text style={[Typography.stat, { color: colors.textPrimary }]}>{s.value}</Text>
              <Text style={[Typography.small, { color: colors.textMuted, marginTop: Spacing.xs }]}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Achievements */}
        <SectionHeader eyebrow="ACHIEVEMENTS" title="Badges Earned" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl }}>
          {achievements.map((a) => (
            <Card key={a.label} style={{ width: '30%', alignItems: 'center', paddingVertical: Spacing.base }}>
              <Text style={{ fontSize: 28, marginBottom: Spacing.xs }}>{a.icon}</Text>
              <Text style={[Typography.small, { color: colors.textSecondary, textAlign: 'center' }]}>{a.label}</Text>
            </Card>
          ))}
        </View>

        {/* Calendar placeholder */}
        <SectionHeader eyebrow="ACTIVITY" title="Study Calendar" />
        <Card style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, width: 280 }}>
            {Array.from({ length: 84 }, (_, i) => {
              const intensity = Math.random();
              const bg = intensity > 0.7 ? colors.green : intensity > 0.4 ? colors.green + '60' : intensity > 0.15 ? colors.green + '25' : colors.border;
              return <View key={i} style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: bg }} />;
            })}
          </View>
          <Text style={[Typography.small, { color: colors.textMuted, marginTop: Spacing.md }]}>Last 12 weeks</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
