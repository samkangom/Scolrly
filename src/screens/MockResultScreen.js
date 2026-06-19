import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, SectionHeader, Btn, Badge, Divider } from '../components/common';
import { MOCK_TESTS, STATS, MISTAKE_DNA } from '../data';

function MistakeBar({ label, value, total, color, colors }) {
  const pct = (value / total) * 100;
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[Typography.caption, { color: colors.textPrimary, fontWeight: '700' }]}>{value}</Text>
      </View>
      <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
    </View>
  );
}

function SubjectBar({ name, data, color, colors }) {
  const pct = Math.round((data.score / data.total) * 100);
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
        <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{name}</Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>{data.score}/{data.total}</Text>
      </View>
      <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xs }}>
        <Text style={[Typography.small, { color: colors.green }]}>{data.correct} correct</Text>
        <Text style={[Typography.small, { color: colors.orange }]}>{data.wrong} wrong</Text>
        <Text style={[Typography.small, { color: colors.textMuted }]}>{data.unattempted} skipped</Text>
      </View>
    </View>
  );
}

export default function MockResultScreen({ route, navigation }) {
  const { colors } = useTheme();
  const mockId = route.params?.mockId || 1;
  const mock = MOCK_TESTS.find((m) => m.id === mockId) || MOCK_TESTS[0];
  const pct = Math.round((mock.score / mock.total) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }}>
          <Text style={[Typography.body, { color: colors.green }]}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>{mock.name}</Text>

        {/* Score Card */}
        <Card style={{ alignItems: 'center', marginBottom: Spacing.base, paddingVertical: Spacing.xl }}>
          <Text style={[{ fontSize: 48, fontWeight: '800', color: colors.green }]}>{mock.score}</Text>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>out of {mock.total} ({pct}%)</Text>
          <Divider style={{ width: '60%' }} />
          <Text style={[Typography.caption, { color: colors.textMuted }]}>Time: {mock.timeTaken} / {mock.totalTime} min</Text>
        </Card>

        {/* Rank Simulator */}
        <Card style={{ marginBottom: Spacing.base }}>
          <SectionHeader eyebrow="RANK PREDICTOR" title="Estimated AIR" />
          <Text style={[{ fontSize: 40, fontWeight: '800', color: colors.orange, marginBottom: Spacing.sm }]}>#{mock.rank.toLocaleString()}</Text>
          <Badge label={`${mock.percentile}th percentile`} color={colors.green} style={{ marginBottom: Spacing.md }} />
          <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>Qualifying Colleges</Text>
          {STATS.qualifyingColleges.map((c, i) => (
            <Text key={i} style={[Typography.body, { color: colors.textPrimary, marginBottom: 2 }]}>  {c}</Text>
          ))}
        </Card>

        {/* Mistake DNA */}
        <Card style={{ marginBottom: Spacing.base }}>
          <SectionHeader eyebrow="DIAGNOSTICS" title="Mistake DNA" />
          <MistakeBar label="Concept Gaps" value={MISTAKE_DNA.conceptGaps} total={MISTAKE_DNA.total} color={colors.orange} colors={colors} />
          <MistakeBar label="Silly Mistakes" value={MISTAKE_DNA.sillyMistakes} total={MISTAKE_DNA.total} color={colors.yellow} colors={colors} />
          <MistakeBar label="Time Pressure" value={MISTAKE_DNA.timePressure} total={MISTAKE_DNA.total} color={colors.purple} colors={colors} />
          <MistakeBar label="Unattempted" value={MISTAKE_DNA.unattempted} total={MISTAKE_DNA.total} color={colors.textMuted} colors={colors} />
        </Card>

        {/* Subject Breakdown */}
        <Card style={{ marginBottom: Spacing.xl }}>
          <SectionHeader eyebrow="BREAKDOWN" title="Subject-wise" />
          <SubjectBar name="Physics" data={mock.physics} color={colors.purple} colors={colors} />
          <SubjectBar name="Chemistry" data={mock.chemistry} color={colors.blue} colors={colors} />
          <SubjectBar name="Biology" data={mock.biology} color={colors.green} colors={colors} />
        </Card>

        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Btn title="Review Answers" variant="outline" onPress={() => {}} style={{ flex: 1 }} />
          <Btn title="Share" onPress={() => {}} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
