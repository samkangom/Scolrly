import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, SectionHeader, SubjectRow, Avatar,
} from '../components/common';
import { STATS, MISTAKE_DNA, SCORE_TREND, WEAKEST_CHAPTERS, SUBJECTS } from '../data';
import { useApp } from '../context/AppContext';
import { Haptic } from '../utils/haptics';

function ScoreTrendChart() {
  const { colors } = useTheme();
  const max = Math.max(...SCORE_TREND.map((d) => d.score));
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140 }}>
        {SCORE_TREND.map((d, i) => {
          const isLast = i === SCORE_TREND.length - 1;
          const h = (d.score / max) * 110;
          return (
            <View key={d.label} style={{ flex: 1, alignItems: 'center' }}>
              <Txt variant="caption" color={isLast ? colors.green : colors.textMuted} style={{ marginBottom: 4 }}>{d.score}</Txt>
              <View style={{ width: 22, height: h, borderRadius: 6, backgroundColor: isLast ? colors.green : colors.bgCard2 }} />
              <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 6 }}>{d.label}</Txt>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

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

export default function ProgressScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const subjectAcc = { biology: 68, physics: 54, chemistry: 61 };

  const onRefresh = useCallback(() => {
    setRefreshing(true); Haptic.light();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Txt variant="h1">My Progress</Txt>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar initials={profile.initials} color="green" size={38} />
          </TouchableOpacity>
        </View>

        {/* Rank hero */}
        <GreenCard style={{ marginTop: Spacing.lg }}>
          <Eyebrow label="ALL-INDIA RANK" />
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 38, letterSpacing: -1.5, marginTop: 4 }}>
            {STATS.estimatedRank.toLocaleString('en-IN')}
          </Text>
          <Txt variant="bodySmall" color={colors.green} style={{ marginTop: 4 }}>
            {STATS.qualifyingColleges.join(' · ')}
          </Txt>
          <Txt variant="caption" color={colors.textSecondary} style={{ marginTop: Spacing.sm }}>
            ↑ Improved {(STATS.prevRank - STATS.estimatedRank).toLocaleString('en-IN')} places in {STATS.rankImprovedIn}
          </Txt>
        </GreenCard>

        {/* Score trend */}
        <SectionHeader title="Score trend" style={{ marginTop: Spacing.xl }} />
        <ScoreTrendChart />

        {/* Mistake DNA */}
        <SectionHeader title="Mistake DNA" style={{ marginTop: Spacing.xl }} />
        <Card>
          <MistakeRow label="Concept gaps" value={MISTAKE_DNA.conceptGaps} total={MISTAKE_DNA.total} color={colors.orange} />
          <MistakeRow label="Silly mistakes" value={MISTAKE_DNA.sillyMistakes} total={MISTAKE_DNA.total} color={colors.purple} />
          <MistakeRow label="Time pressure" value={MISTAKE_DNA.timePressure} total={MISTAKE_DNA.total} color={colors.blue} />
          <MistakeRow label="Unattempted" value={MISTAKE_DNA.unattempted} total={MISTAKE_DNA.total} color={colors.textMuted} />
        </Card>

        {/* Subject accuracy */}
        <SectionHeader title="Subject accuracy" style={{ marginTop: Spacing.xl }} />
        <Card>
          {SUBJECTS.map((s, i) => (
            <SubjectRow key={s.id} name={s.name} value={subjectAcc[s.id]} color={s.id}
              style={i === SUBJECTS.length - 1 ? { marginBottom: 0 } : undefined} />
          ))}
        </Card>

        {/* Weakest chapters */}
        <SectionHeader title="Weakest chapters" style={{ marginTop: Spacing.xl }} />
        <View style={{ gap: Spacing.sm }}>
          {WEAKEST_CHAPTERS.map((ch) => (
            <TouchableOpacity key={ch.id} activeOpacity={0.85}
              onPress={() => navigation.getParent()?.navigate('Practice', { screen: 'ChapterDetail', params: { chapterId: ch.id } })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.orangeGlow, borderWidth: 1, borderColor: colors.orange + '30', borderRadius: Radius.md, padding: Spacing.md }}>
                <View>
                  <Txt variant="h5">{ch.name}</Txt>
                  <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 2, textTransform: 'capitalize' }}>{ch.subject}</Txt>
                </View>
                <Txt variant="h3" color={colors.orange}>{ch.accuracy}%</Txt>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
