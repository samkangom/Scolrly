import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, BackButton, Badge, ChapterBadge,
  ProgressBar, SectionHeader, ConceptCard, EmptyState,
} from '../components/common';
import { CHAPTERS, QUESTIONS, CONCEPT_CARDS, SUBJECTS } from '../data';
import { useApp } from '../context/AppContext';

export default function ChapterDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { bookmarks, toggleBookmark } = useApp();
  const chapterId = route.params?.chapterId;
  const chapter = CHAPTERS.find((c) => c.id === chapterId) || CHAPTERS[0];
  const questions = QUESTIONS.filter((q) => q.chapter === chapter.id);
  const concepts = CONCEPT_CARDS.filter((c) => c.chapter === chapter.id);
  const subjName = SUBJECTS.find((s) => s.id === chapter.subject)?.name;

  const startSession = () => navigation.navigate('QuestionSession', { chapterId: chapter.id, mode: 'practice' });

  const diffColor = (d) => (d === 'Easy' ? colors.green : d === 'Medium' ? colors.yellow : colors.orange);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <BackButton onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.lg }} />

        <Eyebrow label={subjName} />
        <Txt variant="h1" style={{ marginTop: 6 }}>{chapter.name}</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <ChapterBadge status={chapter.status} />
          <Txt variant="caption" color={colors.textMuted}>Asked {chapter.pyqCount}× · {chapter.attempted} attempted</Txt>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md }}>
          <ProgressBar value={chapter.accuracy} style={{ flex: 1 }} />
          <Txt variant="h4" color={chapter.accuracy >= 75 ? colors.green : chapter.accuracy >= 55 ? colors.purple : colors.orange}>{chapter.accuracy}%</Txt>
        </View>

        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
          <Btn label="Practice Questions" onPress={startSession} style={{ flex: 1 }} />
          <Btn label="PYQs Only" variant="outline" onPress={startSession} style={{ flex: 1 }} />
        </View>

        <SectionHeader title="Concept cards" style={{ marginTop: Spacing.xl }} />
        {concepts.length === 0 ? (
          <Card><Txt variant="body" color={colors.textMuted}>No concept cards for this chapter yet.</Txt></Card>
        ) : (
          <View style={{ gap: Spacing.sm }}>
            {concepts.map((c) => (
              <ConceptCard key={c.id} card={c} bookmarked={bookmarks.includes(c.id)}
                onBookmark={() => toggleBookmark(c.id)} onPress={() => navigation.navigate('ConceptLibrary')} />
            ))}
          </View>
        )}

        <SectionHeader title="Questions" style={{ marginTop: Spacing.xl }} />
        {questions.length === 0 ? (
          <EmptyState emoji="✨" title="No questions yet"
            subtitle="We're adding questions for this chapter. Check back soon." />
        ) : (
          <View style={{ gap: Spacing.sm }}>
            {questions.map((q, i) => (
              <Card key={q.id} onPress={startSession} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.bgCard2, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
                  <Text style={{ color: colors.textSecondary, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 12 }}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt variant="body" numberOfLines={2}>{q.text}</Txt>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: Spacing.sm }}>
                    <Badge label={`${q.year}`} color="blue" />
                    <Badge label={q.difficulty} color={q.difficulty === 'Easy' ? 'green' : q.difficulty === 'Medium' ? 'yellow' : 'orange'} />
                    <Badge label={`${q.pyqFrequency} PYQ`} color="green" />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
