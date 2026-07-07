import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius, Typography } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Avatar, SectionHeader,
  CountdownBox, MissionCard, ScorePill, ProgressBar, IconBox, Skeleton,
} from '../components/common';
import { useApp } from '../context/AppContext';
import { useApi } from '../hooks/useApi';
import { STATS, DAILY_MISSIONS, SUBJECTS, QUESTIONS } from '../data';
import { Haptic } from '../utils/haptics';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile, streak, online } = useApp();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pyqRevealed, setPyqRevealed] = useState(false);
  const { data: missionData, refresh: refreshMissions } =
    useApi('/api/missions', { missions: DAILY_MISSIONS }, [online]);
  const missions = missionData.missions;

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptic.light();
    refreshMissions().finally(() => setTimeout(() => setRefreshing(false), 400));
  }, [refreshMissions]);

  const firstName = profile.name.split(' ')[0];
  const pyq = QUESTIONS[2];
  const subjectAcc = { biology: 68, physics: 54, chemistry: 61 };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl }}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} hitSlop={8}>
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 20, letterSpacing: -0.5 }}>scolrly</Text>
          <Avatar initials={profile.initials} color="green" size={38} />
        </View>

        {/* Greeting */}
        <Eyebrow label={`${greeting()}, ${firstName.toUpperCase()}`} />
        <Txt variant="h1" style={{ marginTop: 6 }}>Ready to{'\n'}study smarter?</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>
          {STATS.daysToExam} days to NEET {profile.targetYear} · 🔥 {streak} day streak
        </Txt>

        {/* Countdown strip */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
          <CountdownBox value={STATS.daysToExam} label="DAYS" />
          <CountdownBox value={STATS.estimatedScore} label="SCORE" />
          <CountdownBox value="41K" label="AIR" />
        </View>

        {/* Today's mission */}
        <SectionHeader title="Today's mission" action="See all" onAction={() => navigation.navigate('Practice')} style={{ marginTop: Spacing.xl }} />
        {loading ? (
          <View style={{ gap: Spacing.sm }}>
            <Skeleton height={64} /><Skeleton height={64} /><Skeleton height={64} />
          </View>
        ) : (
          <View style={{ gap: Spacing.sm }}>
            {missions.map((m) => (
              <MissionCard key={m.title} mission={m}
                onPress={() => navigation.navigate('Practice', { screen: 'ChapterDetail', params: { chapterId: m.chapter } })} />
            ))}
          </View>
        )}

        {/* Score pill */}
        <ScorePill
          score={STATS.estimatedScore} max={STATS.maxScore} rank={STATS.estimatedRank}
          delta={`↑ from ${(STATS.prevRank / 1000).toFixed(0)},000 · ${STATS.rankImprovedIn} ago`}
          style={{ marginTop: Spacing.lg }}
        />

        {/* Subject accuracy */}
        <SectionHeader title="Subject accuracy" style={{ marginTop: Spacing.xl }} />
        <Card style={{ flexDirection: 'row', gap: Spacing.md }}>
          {SUBJECTS.map((s) => {
            const val = subjectAcc[s.id];
            const c = s.colorKey === 'green' ? colors.green : s.colorKey === 'blue' ? colors.blue : colors.purple;
            return (
              <View key={s.id} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: c, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 20 }}>{val}%</Text>
                <ProgressBar value={val} color={c} height={4} style={{ width: '100%', marginVertical: 8 }} />
                <Txt variant="caption" color={colors.textMuted}>{s.name}</Txt>
              </View>
            );
          })}
        </Card>

        {/* Quick access */}
        <SectionHeader title="Quick access" style={{ marginTop: Spacing.xl }} />
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {[
            { icon: '📝', label: 'Full Mock', color: 'orange', go: () => navigation.navigate('Mocks') },
            { icon: '📚', label: 'Practice', color: 'green', go: () => navigation.navigate('Practice') },
            { icon: '👥', label: 'Study Room', color: 'purple', go: () => navigation.navigate('Rooms') },
          ].map((q) => (
            <TouchableOpacity key={q.label} activeOpacity={0.85} onPress={() => { Haptic.light(); q.go(); }} style={{ flex: 1 }}>
              <Card style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
                <IconBox color={q.color}><Text style={{ fontSize: 20 }}>{q.icon}</Text></IconBox>
                <Txt variant="h5" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>{q.label}</Txt>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily PYQ */}
        <SectionHeader title="Daily PYQ" style={{ marginTop: Spacing.xl }} />
        <Card onPress={() => { setPyqRevealed(true); Haptic.light(); }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
            <Eyebrow label="NEET 2023 · CHEMISTRY" />
            <Txt variant="caption" color={colors.textMuted}>PYQ of the day</Txt>
          </View>
          <Txt variant="h5" style={{ lineHeight: 20 }}>{pyq.text}</Txt>
          {pyqRevealed ? (
            <View style={{ marginTop: Spacing.md, backgroundColor: colors.greenGlow, borderRadius: Radius.sm, padding: Spacing.md, borderWidth: 1, borderColor: colors.greenBorder }}>
              <Eyebrow label="ANSWER" />
              <Txt variant="body" color={colors.green} style={{ marginTop: 4 }}>
                {pyq.options.find((o) => o.id === pyq.correct).text} — {pyq.explanation}
              </Txt>
            </View>
          ) : (
            <Txt variant="bodySmall" color={colors.textMuted} style={{ marginTop: Spacing.sm }}>Tap to answer</Txt>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
