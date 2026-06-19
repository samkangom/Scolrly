import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme, Typography, Spacing } from '../theme';
import { Card, SectionHeader, ProgressBar, Badge, Avatar } from '../components/common';
import { STATS, MOCK_TESTS, MISTAKE_DNA, CHAPTERS, SCORE_HISTORY, USER } from '../data';

export default function ProgressScreen({ navigation }) {
  const { colors } = useTheme();
  const weakChapters = [...CHAPTERS].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);
  const maxScore = Math.max(...SCORE_HISTORY.map((s) => s.score));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        {/* Profile Link */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Profile')}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg }}
        >
          <Avatar name={USER.name} size={44} />
          <View style={{ marginLeft: Spacing.md, flex: 1 }}>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>{USER.name}</Text>
            <Text style={[Typography.small, { color: colors.textSecondary }]}>{USER.class} · {USER.coaching}</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 18 }}>&#8250;</Text>
        </TouchableOpacity>

        {/* Estimated Rank */}
        <Card style={{ marginBottom: Spacing.base, alignItems: 'center', paddingVertical: Spacing.xl }}>
          <Text style={[Typography.eyebrow, { color: colors.green, marginBottom: Spacing.sm }]}>ESTIMATED RANK</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[{ fontSize: 44, fontWeight: '800', color: colors.textPrimary }]}>#{STATS.estimatedRank.toLocaleString()}</Text>
            <Text style={{ color: colors.green, fontSize: 20, marginLeft: Spacing.sm }}>&#8593;</Text>
          </View>
          <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: Spacing.xs }]}>{STATS.percentile}th percentile</Text>
        </Card>

        {/* Score Trend Bar Chart */}
        <Card style={{ marginBottom: Spacing.base }}>
          <SectionHeader eyebrow="TREND" title="Score History" />
          {SCORE_HISTORY.map((item) => (
            <View key={item.date} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
              <Text style={[Typography.caption, { color: colors.textSecondary, width: 32 }]}>{item.date}</Text>
              <View style={{ flex: 1, height: 20, backgroundColor: colors.border, borderRadius: 4, marginHorizontal: Spacing.sm, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${(item.score / 720) * 100}%`, backgroundColor: colors.green, borderRadius: 4 }} />
              </View>
              <Text style={[Typography.caption, { color: colors.textPrimary, fontWeight: '700', width: 36, textAlign: 'right' }]}>{item.score}</Text>
            </View>
          ))}
        </Card>

        {/* Top Weak Concepts */}
        <Card style={{ marginBottom: Spacing.base }}>
          <SectionHeader eyebrow="DIAGNOSTICS" title="Top Weak Concepts" />
          {MISTAKE_DNA.topWeakConcepts.map((concept, idx) => (
            <View key={concept} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.orange + '20', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm }}>
                <Text style={[Typography.small, { color: colors.orange, fontWeight: '700' }]}>{idx + 1}</Text>
              </View>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{concept}</Text>
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
