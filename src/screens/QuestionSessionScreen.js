import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, Btn, Badge } from '../components/common';
import { QUESTIONS } from '../data';

export default function QuestionSessionScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { chapterId, questionIndex = 0 } = route.params || {};
  const chapterQuestions = QUESTIONS.filter((q) => q.chapterId === chapterId);
  const [currentIdx, setCurrentIdx] = useState(questionIndex);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const question = chapterQuestions[currentIdx];
  if (!question) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[Typography.body, { color: colors.textMuted }]}>No questions available.</Text>
        <Btn title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.base }} />
      </SafeAreaView>
    );
  }

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < chapterQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      navigation.goBack();
    }
  };

  const getOptionStyle = (idx) => {
    if (!answered) return { borderColor: colors.border, backgroundColor: colors.card };
    if (idx === question.correct) return { borderColor: colors.green, backgroundColor: colors.green + '18' };
    if (idx === selected && idx !== question.correct) return { borderColor: colors.orange, backgroundColor: colors.orange + '18' };
    return { borderColor: colors.border, backgroundColor: colors.card };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }}>
          <Text style={[Typography.body, { color: colors.green }]}>{'< Back'}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg }}>
          <Badge label={question.difficulty} color={question.difficulty === 'hard' ? colors.orange : colors.purple} />
          <Text style={[Typography.caption, { color: colors.textMuted }]}>
            {currentIdx + 1} / {chapterQuestions.length}
          </Text>
        </View>

        <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: Spacing.xl }]}>{question.text}</Text>

        {question.options.map((opt, idx) => (
          <TouchableOpacity key={idx} activeOpacity={0.85} onPress={() => handleSelect(idx)}>
            <View
              style={[
                {
                  padding: Spacing.base,
                  borderRadius: Radius.md,
                  borderWidth: 1.5,
                  marginBottom: Spacing.sm,
                },
                getOptionStyle(idx),
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
                  <Text style={[Typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>{String.fromCharCode(65 + idx)}</Text>
                </View>
                <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>{opt}</Text>
                {answered && idx === question.correct && <Text style={{ color: colors.green, fontSize: 18 }}>&#10003;</Text>}
                {answered && idx === selected && idx !== question.correct && <Text style={{ color: colors.orange, fontSize: 18 }}>&#10007;</Text>}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {answered && (
          <Card style={{ marginTop: Spacing.lg, backgroundColor: colors.green + '10', borderColor: colors.greenBorder }}>
            <Text style={[Typography.bodyBold, { color: colors.green, marginBottom: Spacing.sm }]}>Explanation</Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>{question.explanation}</Text>
          </Card>
        )}
      </ScrollView>

      {answered && (
        <View style={{ padding: Spacing.base, backgroundColor: colors.bg }}>
          <Btn title={currentIdx < chapterQuestions.length - 1 ? 'Next Question' : 'Finish'} onPress={handleNext} />
        </View>
      )}
    </SafeAreaView>
  );
}
