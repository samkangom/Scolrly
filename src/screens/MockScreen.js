import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, Badge, MockCard, SectionHeader,
} from '../components/common';
import { MOCK_TESTS, SUBJECT_MOCKS, STATS } from '../data';

export default function MockScreen({ navigation }) {
  const { colors } = useTheme();
  const pending = MOCK_TESTS.filter((m) => !m.completed);
  const completed = MOCK_TESTS.filter((m) => m.completed);
  const best = completed[0];

  const subjColor = (s) => (s === 'biology' ? colors.green : s === 'physics' ? colors.blue : colors.purple);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <Txt variant="h1">Mock Tests</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 4, marginBottom: Spacing.lg }}>
          Full NEET simulation · 180Q · 200 min
        </Txt>

        {/* Best performance */}
        <GreenCard style={{ marginBottom: Spacing.xl }}>
          <Eyebrow label="BEST MOCK PERFORMANCE" />
          <View style={{ flexDirection: 'row', marginTop: Spacing.md }}>
            <BestStat value={best.score} label="LATEST SCORE" />
            <BestStat value={`${(best.rank / 1000).toFixed(0)}K`} label="EST. AIR" />
            <BestStat value={completed.length} label="MOCKS TAKEN" />
          </View>
          <Txt variant="bodySmall" color={colors.green} style={{ marginTop: Spacing.md }}>
            Qualifying: {STATS.qualifyingColleges.join(' · ')}
          </Txt>
        </GreenCard>

        <SectionHeader title="Ready to take" />
        {pending.map((m) => (
          <MockCard key={m.id} mock={m} style={{ marginBottom: Spacing.sm }}
            onStart={() => navigation.navigate('QuestionSession', { chapterId: null, mode: 'mock' })} />
        ))}

        <SectionHeader title="Completed mocks" style={{ marginTop: Spacing.xl }} />
        <View style={{ gap: Spacing.sm }}>
          {completed.map((m) => (
            <MockCard key={m.id} mock={m}
              onPress={() => navigation.navigate('MockResult', { mockId: m.id })} />
          ))}
        </View>

        <SectionHeader title="Subject mocks" style={{ marginTop: Spacing.xl }} />
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {SUBJECT_MOCKS.map((sm) => (
            <TouchableOpacity key={sm.id} activeOpacity={0.85} style={{ flex: 1 }}
              onPress={() => navigation.navigate('QuestionSession', { chapterId: null, mode: 'mock' })}>
              <View style={{ backgroundColor: subjColor(sm.subject) + '20', borderWidth: 1, borderColor: subjColor(sm.subject) + '30', borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' }}>
                <Txt variant="h5" color={subjColor(sm.subject)}>{sm.title}</Txt>
                <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 4, textAlign: 'center' }}>{sm.questions}Q · {sm.duration}m</Txt>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function BestStat({ value, label }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 24, letterSpacing: -0.5 }}>{value}</Text>
      <Eyebrow label={label} style={{ marginTop: 2 }} />
    </View>
  );
}
