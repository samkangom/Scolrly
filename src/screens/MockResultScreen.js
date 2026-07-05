import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, BackButton, SectionHeader, SubjectRow,
} from '../components/common';
import { MOCK_TESTS, MISTAKE_DNA, STATS } from '../data';

function MistakeRow({ label, value, total, color }) {
  const { colors } = useTheme();
  const pct = Math.round((value / total) * 100);
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 8 }} />
          <Txt variant="h5">{label}</Txt>
        </View>
        <Txt variant="h5" color={colors.textSecondary}>{value}</Txt>
      </View>
      <View style={{ height: 5, backgroundColor: colors.bgCard2, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 5 }} />
      </View>
    </View>
  );
}

export default function MockResultScreen({ navigation, route }) {
  const { colors } = useTheme();
  const mockId = route.params?.mockId;
  const mock = MOCK_TESTS.find((m) => m.id === mockId) || MOCK_TESTS.find((m) => m.completed);
  const pct = ((mock.score / mock.totalMarks) * 100).toFixed(1);
  const s = mock.subjectScores;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <BackButton onPress={() => navigation.goBack()} label="Results" style={{ marginBottom: Spacing.lg }} />
        <Txt variant="h1">{mock.title} Results</Txt>

        {/* Score hero */}
        <GreenCard style={{ marginTop: Spacing.lg, alignItems: 'center' }}>
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 44, letterSpacing: -2 }}>
            {mock.score} <Text style={{ color: colors.textMuted, fontSize: 22 }}>/ {mock.totalMarks}</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.sm }}>
            <Txt variant="h4" color={colors.textSecondary}>{pct}%</Txt>
            <Txt variant="h4" color={colors.textSecondary}>{mock.timeTaken}</Txt>
          </View>
        </GreenCard>

        {/* Rank */}
        <Card style={{ marginTop: Spacing.lg }}>
          <Eyebrow label="ALL-INDIA RANK" />
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 34, letterSpacing: -1, marginTop: 4 }}>{mock.rank.toLocaleString('en-IN')}</Text>
          <Txt variant="caption" color={colors.green} style={{ marginTop: 2 }}>↑ from 65,000</Txt>
          <Txt variant="bodySmall" color={colors.textSecondary} style={{ marginTop: Spacing.sm }}>
            Qualifying: {STATS.qualifyingColleges.join(' · ')}
          </Txt>
        </Card>

        {/* Subject breakdown */}
        <SectionHeader title="Subject breakdown" style={{ marginTop: Spacing.xl }} />
        <Card>
          <SubjectRow name="Biology" value={s.biology} max={360} color="biology" />
          <SubjectRow name="Physics" value={s.physics} max={180} color="physics" />
          <SubjectRow name="Chemistry" value={s.chemistry} max={180} color="chemistry" style={{ marginBottom: 0 }} />
        </Card>

        {/* Mistake DNA */}
        <SectionHeader title="Mistake DNA" style={{ marginTop: Spacing.xl }} />
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md }}>
            <Txt variant="h5" color={colors.textMuted}>Across {MISTAKE_DNA.total} mistakes</Txt>
            <Txt variant="h5" color={colors.green}>{mock.title}</Txt>
          </View>
          <MistakeRow label="Concept gaps" value={MISTAKE_DNA.conceptGaps} total={MISTAKE_DNA.total} color={colors.orange} />
          <MistakeRow label="Silly mistakes" value={MISTAKE_DNA.sillyMistakes} total={MISTAKE_DNA.total} color={colors.purple} />
          <MistakeRow label="Time pressure" value={MISTAKE_DNA.timePressure} total={MISTAKE_DNA.total} color={colors.blue} />
          <MistakeRow label="Unattempted" value={MISTAKE_DNA.unattempted} total={MISTAKE_DNA.total} color={colors.textMuted} />
        </Card>

        <View style={{ marginTop: Spacing.xl, gap: Spacing.md }}>
          <Btn label="Review all answers" onPress={() => navigation.navigate('QuestionSession', { chapterId: null, mode: 'review' })} />
          <Btn label="Share result card" variant="outline" onPress={() => navigation.navigate('ShareResult', { mockId: mock.id })} />
        </View>
      </ScrollView>
    </Screen>
  );
}
