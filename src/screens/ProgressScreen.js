import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing } from '../theme';
import { Card, SectionHeader, ProgressBar, Badge } from '../components/common';
import { STATS, MOCK_TESTS, MISTAKE_DNA, CHAPTERS } from '../data';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const weakChapters = [...CHAPTERS].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>Progress</Text>

        {/* Estimated Rank */}
        <Card style={{ marginBottom: Spacing.base, alignItems: 'center', paddingVertical: Spacing.xl }}>
          <Text style={[Typography.eyebrow, { color: colors.green, marginBottom: Spacing.sm }]}>ESTIMATED RANK</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[{ fontSize: 44, fontWeight: '800', color: colors.textPrimary }]}>#{STATS.estimatedRank.toLocaleString()}</Text>
            <Text style={{ color: colors.green, fontSize: 20, marginLeft: Spacing.sm }}>&#8593;</Text>
          </View>
          <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: Spacing.xs }]}>{STATS.percentile}th percentile</Text>
        </Card>

        {/* Score Trend */}
        <Card style={{ marginBottom: Spacing.base }}>
          <SectionHeader eyebrow="TREND" title="Recent Mock Scores" />
          {MOCK_TESTS.map((m) => (
            <View key={m.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>{m.name}</Text>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{m.score}/{m.total}</Text>
            </View>
          ))}
        </Card>

        {/* Mistake DNA */}
        <Card style={{ marginBottom: Spacing.base }}>
          <SectionHeader eyebrow="DIAGNOSTICS" title="Mistake DNA" />
          {[
            { label: 'Concept Gaps', value: MISTAKE_DNA.conceptGaps, color: colors.orange },
            { label: 'Silly Mistakes', value: MISTAKE_DNA.sillyMistakes, color: colors.yellow },
            { label: 'Time Pressure', value: MISTAKE_DNA.timePressure, color: colors.purple },
            { label: 'Unattempted', value: MISTAKE_DNA.unattempted, color: colors.textMuted },
          ].map((item) => (
            <View key={item.label} style={{ marginBottom: Spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>{item.label}</Text>
                <Text style={[Typography.caption, { color: colors.textPrimary, fontWeight: '700' }]}>{item.value}</Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${(item.value / MISTAKE_DNA.total) * 100}%`, backgroundColor: item.color, borderRadius: 3 }} />
              </View>
            </View>
          ))}
        </Card>

        {/* Weakest Chapters */}
        <SectionHeader eyebrow="NEEDS ATTENTION" title="Weakest Chapters" />
        {weakChapters.map((ch) => (
          <Card key={ch.id} style={{ marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>{ch.name}</Text>
              <Text style={[Typography.caption, { color: ch.accuracy < 55 ? colors.orange : colors.purple, fontWeight: '700' }]}>{ch.accuracy}%</Text>
            </View>
            <ProgressBar percent={ch.accuracy} />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
