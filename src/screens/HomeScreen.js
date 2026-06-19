import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, SectionHeader, ProgressBar, Eyebrow } from '../components/common';
import { USER, STATS, DAILY_MISSIONS, CHAPTERS } from '../data';
import { useCountdown } from '../hooks/useCountdown';

const MISSION_COLORS = { fix: '#FF6B35', revise: '#A855F7', maintain: '#1DB954' };

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const countdown = useCountdown(USER.examDate);
  const weakChapters = [...CHAPTERS].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg }}>
          <View>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>Welcome back</Text>
            <Text style={[Typography.h1, { color: colors.textPrimary }]}>Hello, {USER.name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Settings')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 18, color: colors.textSecondary }}>&#9881;</Text>
          </TouchableOpacity>
        </View>

        {/* Countdown */}
        <Card style={{ marginBottom: Spacing.base, backgroundColor: colors.green + '12', borderColor: colors.greenBorder }}>
          <Eyebrow text="NEET 2026 COUNTDOWN" style={{ marginBottom: Spacing.sm }} />
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[Typography.hero, { color: colors.green }]}>{countdown.days}</Text>
            <Text style={[Typography.body, { color: colors.textSecondary, marginLeft: Spacing.xs }]}>days</Text>
            <Text style={[Typography.h2, { color: colors.green, marginLeft: Spacing.base }]}>{countdown.hours}h {countdown.minutes}m</Text>
          </View>
          <Text style={[Typography.small, { color: colors.textMuted, marginTop: Spacing.xs }]}>
            {USER.streak} day streak
          </Text>
        </Card>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl }}>
          {[
            { label: 'Score', value: STATS.estimatedScore + '/' + STATS.totalMarks },
            { label: 'Rank', value: '#' + STATS.estimatedRank.toLocaleString() },
            { label: 'Accuracy', value: STATS.accuracy + '%' },
          ].map((s) => (
            <Card key={s.label} style={{ flex: 1, alignItems: 'center', padding: Spacing.md }}>
              <Text style={[Typography.small, { color: colors.textMuted, marginBottom: Spacing.xs }]}>{s.label}</Text>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{s.value}</Text>
            </Card>
          ))}
        </View>

        {/* Daily Missions */}
        <SectionHeader eyebrow="TODAY'S MISSION" title="Your Daily Tasks" />
        {DAILY_MISSIONS.map((m) => (
          <TouchableOpacity
            key={m.id}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PracticeTab', { screen: 'Practice' })}
          >
            <Card style={{ marginBottom: Spacing.sm, flexDirection: 'row', overflow: 'hidden' }}>
              <View style={{ width: 4, backgroundColor: MISSION_COLORS[m.type], borderRadius: 2, marginRight: Spacing.md, alignSelf: 'stretch' }} />
              <View style={{ flex: 1 }}>
                <Text style={[Typography.caption, { color: MISSION_COLORS[m.type], marginBottom: 2, textTransform: 'uppercase', fontWeight: '700', fontSize: 10 }]}>{m.type}</Text>
                <Text style={[Typography.bodyBold, { color: colors.textPrimary, marginBottom: 2 }]}>{m.title}</Text>
                <Text style={[Typography.small, { color: colors.textMuted }]}>{m.subject} · {m.questions} questions</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Weakest Chapters */}
        <SectionHeader eyebrow="NEEDS ATTENTION" title="Weakest Chapters" style={{ marginTop: Spacing.lg }} />
        {weakChapters.map((ch) => (
          <Card key={ch.id} style={{ marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>{ch.name}</Text>
              <Text style={[Typography.caption, { color: ch.accuracy < 55 ? colors.orange : colors.purple }]}>{ch.accuracy}%</Text>
            </View>
            <ProgressBar percent={ch.accuracy} />
          </Card>
        ))}

        {/* Quick Access */}
        <SectionHeader eyebrow="QUICK ACCESS" title="Jump In" style={{ marginTop: Spacing.lg }} />
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Rooms', { screen: 'DoubtDrop' })}
            style={{ flex: 1 }}
          >
            <Card style={{ backgroundColor: colors.orange + '14', borderColor: colors.orange + '30', alignItems: 'center', paddingVertical: Spacing.xl }}>
              <Text style={{ fontSize: 28, marginBottom: Spacing.sm }}>&#10067;</Text>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>Doubt Drop</Text>
              <Text style={[Typography.small, { color: colors.textSecondary, marginTop: Spacing.xs }]}>Ask anything</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PracticeTab', { screen: 'ConceptLibrary' })}
            style={{ flex: 1 }}
          >
            <Card style={{ backgroundColor: colors.purple + '14', borderColor: colors.purple + '30', alignItems: 'center', paddingVertical: Spacing.xl }}>
              <Text style={{ fontSize: 28, marginBottom: Spacing.sm }}>&#128218;</Text>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>Concept Library</Text>
              <Text style={[Typography.small, { color: colors.textSecondary, marginTop: Spacing.xs }]}>Browse cards</Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
