import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, SectionHeader, ProgressBar, Badge, Eyebrow } from '../components/common';
import { CHAPTERS, CONCEPT_CARDS, QUESTIONS } from '../data';

export default function ChapterDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const chapterId = route.params?.chapterId || 1;
  const chapter = CHAPTERS.find((c) => c.id === chapterId) || CHAPTERS[0];
  const cards = CONCEPT_CARDS.filter((c) => c.chapterId === chapterId);
  const questions = QUESTIONS.filter((q) => q.chapterId === chapterId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        {/* Header */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }}>
          <Text style={[Typography.body, { color: colors.green }]}>{'< Back'}</Text>
        </TouchableOpacity>

        <Card style={{ marginBottom: Spacing.xl }}>
          <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>{chapter.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
            <Text style={[Typography.stat, { color: chapter.accuracy < 55 ? colors.orange : chapter.accuracy < 75 ? colors.purple : colors.green }]}>{chapter.accuracy}%</Text>
            <Text style={[Typography.body, { color: colors.textSecondary, marginLeft: Spacing.sm }]}>accuracy</Text>
          </View>
          <ProgressBar percent={chapter.accuracy} />
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
            <Badge label={`${chapter.pyqCount} PYQs`} color={colors.blue} />
            <Badge label={`${chapter.totalQuestions} Questions`} color={colors.textMuted} />
            <Badge label={`${chapter.conceptCards} Cards`} color={colors.purple} />
          </View>
        </Card>

        {/* Concept Cards */}
        {cards.length > 0 && (
          <>
            <SectionHeader eyebrow="LEARN" title="Concept Cards" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.xl }}>
              {cards.map((card) => (
                <Card key={card.id} style={{ width: 220, marginRight: Spacing.md }}>
                  <Text style={[Typography.bodyBold, { color: colors.textPrimary, marginBottom: Spacing.xs }]}>{card.title}</Text>
                  <Text style={[Typography.small, { color: colors.textSecondary, marginBottom: Spacing.sm }]} numberOfLines={3}>{card.content}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Badge label={card.pyqFrequency} color={colors.green} />
                    {card.bookmarked && <Text style={{ color: colors.yellow }}>&#9733;</Text>}
                  </View>
                </Card>
              ))}
            </ScrollView>
          </>
        )}

        {/* Questions */}
        <SectionHeader eyebrow="PRACTICE" title="Questions" />
        {questions.length === 0 && (
          <Card><Text style={[Typography.body, { color: colors.textMuted }]}>No questions available for this chapter yet.</Text></Card>
        )}
        {questions.map((q, i) => (
          <TouchableOpacity
            key={q.id}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('QuestionSession', { chapterId, questionIndex: i })}
          >
            <Card style={{ marginBottom: Spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                <Badge label={q.difficulty} color={q.difficulty === 'hard' ? colors.orange : q.difficulty === 'medium' ? colors.purple : colors.green} />
                <Text style={[Typography.small, { color: colors.textMuted, marginLeft: Spacing.sm }]}>NEET {q.year}</Text>
              </View>
              <Text style={[Typography.body, { color: colors.textPrimary }]} numberOfLines={2}>{q.text}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
