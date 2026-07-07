import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../theme';
import { Spacing } from '../theme/tokens';
import { Text, TouchableOpacity } from 'react-native';
import { Radius } from '../theme/tokens';
import {
  Screen, Txt, SectionHeader, SubjectTabs, ChapterRow, StatPill, Skeleton, EmptyState, IconBox, Card,
} from '../components/common';
import { useChapters } from '../hooks/useChapters';
import { useApi } from '../hooks/useApi';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data';
import { Haptic } from '../utils/haptics';

export default function PracticeScreen({ navigation }) {
  const { colors } = useTheme();
  const { online } = useApp();
  const [subject, setSubject] = useState('biology');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const local = useChapters(subject);
  const { data: serverData, refresh } =
    useApi(`/api/chapters?subject=${subject}`, null, [online]);

  // Server chapters blend the student's own attempts into accuracy; prefer
  // them when available, fall back to the bundled baseline offline.
  const chapters = serverData?.chapters
    ? [...serverData.chapters].sort((a, b) => a.accuracy - b.accuracy)
    : local.chapters;
  const fixCount = chapters.filter((c) => c.status === 'fix').length;
  const reviseCount = chapters.filter((c) => c.status === 'revise').length;
  const strongCount = chapters.filter((c) => c.status === 'strong').length;

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [subject]);

  const onRefresh = useCallback(() => {
    setRefreshing(true); Haptic.light();
    refresh().finally(() => setTimeout(() => setRefreshing(false), 400));
  }, [refresh]);

  const subjName = SUBJECTS.find((s) => s.id === subject)?.name;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        <Txt variant="h1">Practice</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 4, marginBottom: Spacing.lg }}>
          AI-sorted by priority · most important first
        </Txt>

        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('DoubtDrop')} style={{ marginBottom: Spacing.lg }}>
          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconBox color="orange"><Text style={{ fontSize: 18 }}>💬</Text></IconBox>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Txt variant="h5">Doubt Drop</Txt>
              <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>Ask any NEET doubt — AI answers in 10s</Txt>
            </View>
            <Text style={{ color: colors.green, fontSize: 18 }}>›</Text>
          </Card>
        </TouchableOpacity>

        <SubjectTabs subjects={SUBJECTS} active={subject} onChange={setSubject} style={{ paddingBottom: Spacing.lg }} />

        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg }}>
          <StatPill value={fixCount} label="Fix" color="orange" />
          <StatPill value={reviseCount} label="Revise" color="purple" />
          <StatPill value={strongCount} label="Strong" color="green" />
        </View>

        <SectionHeader title={`${subjName} chapters`} action="Concept Library" onAction={() => navigation.navigate('ConceptLibrary')} />

        {loading ? (
          <View style={{ gap: Spacing.sm }}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={92} />)}
          </View>
        ) : chapters.length === 0 ? (
          <EmptyState emoji="📚" title="No chapters yet" subtitle="Chapters for this subject will appear here." />
        ) : (
          <View style={{ gap: Spacing.sm }}>
            {chapters.map((ch, i) => (
              <ChapterRow key={ch.id} chapter={ch} index={i + 1}
                onPress={() => navigation.navigate('ChapterDetail', { chapterId: ch.id })} />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
