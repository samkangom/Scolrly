import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, Avatar, BackButton, SectionHeader, Badge,
  AchievementBadge, CalendarHeatmap,
} from '../components/common';
import { STATS, ACHIEVEMENTS, STUDY_HEATMAP } from '../data';
import { useApp } from '../context/AppContext';

function StatBox({ value, label, color }) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: Spacing.lg }}>
      <Text style={{ color: color || colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 24 }}>{value}</Text>
      <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 4, textAlign: 'center' }}>{label}</Txt>
    </Card>
  );
}

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile, streak } = useApp();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <BackButton onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.lg }} />

        <View style={{ alignItems: 'center' }}>
          <Avatar initials={profile.initials} color="green" size={80} />
          <Txt variant="h1" style={{ marginTop: Spacing.md }}>{profile.name}</Txt>
          <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 2 }}>{profile.status} · NEET {profile.targetYear}</Txt>
          <View style={{ backgroundColor: colors.greenGlow, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 5, marginTop: Spacing.md }}>
            <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>🔥 {streak} day streak</Text>
          </View>
        </View>

        {/* Stats grid 2x2 */}
        <View style={{ gap: Spacing.sm, marginTop: Spacing.xl }}>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <StatBox value={STATS.questionsAnswered.toLocaleString('en-IN')} label="Questions answered" />
            <StatBox value={`${STATS.accuracy}%`} label="Accuracy" color={colors.blue} />
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <StatBox value={STATS.hoursStudied} label="Hours studied" color={colors.purple} />
            <StatBox value={STATS.mocksCompleted} label="Mocks completed" color={colors.orange} />
          </View>
        </View>

        {/* Achievements */}
        <SectionHeader title="Achievements" style={{ marginTop: Spacing.xl }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md, paddingVertical: Spacing.xs }}>
          {ACHIEVEMENTS.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
        </ScrollView>

        {/* Study calendar heatmap */}
        <SectionHeader title="Study calendar" style={{ marginTop: Spacing.xl }} />
        <Card>
          <CalendarHeatmap data={STUDY_HEATMAP} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
