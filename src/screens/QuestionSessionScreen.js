import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, Badge, ProgressBar,
} from '../components/common';
import { CHAPTERS, QUESTIONS } from '../data';
import { useApp } from '../context/AppContext';
import { Haptic } from '../utils/haptics';
import { api } from '../api/client';

export default function QuestionSessionScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { markAnswered } = useApp();
  const chapterId = route.params?.chapterId;
  const mode = route.params?.mode || 'practice';
  const chapter = CHAPTERS.find((c) => c.id === chapterId);

  // Build a session pool: chapter questions padded with others to feel substantial.
  const pool = useMemo(() => {
    const own = QUESTIONS.filter((q) => q.chapter === chapterId);
    const rest = QUESTIONS.filter((q) => q.chapter !== chapterId);
    return (own.length ? [...own, ...rest] : QUESTIONS).slice(0, 8);
  }, [chapterId]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const shownAt = React.useRef(Date.now());

  const q = pool[idx];
  const total = pool.length;
  const pct = Math.round(((idx + (picked ? 1 : 0)) / total) * 100);

  const choose = (id) => {
    if (picked) return;
    setPicked(id);
    const ok = id === q.correct;
    if (ok) { setCorrectCount((c) => c + 1); Haptic.success(); } else Haptic.error();
    markAnswered(q.id, id, Date.now() - shownAt.current);
  };

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true); Haptic.medium();
      // Mock sessions post a scaled score so results feed the Progress trend.
      if (mode === 'mock') {
        const finalCorrect = correctCount;
        api.post('/api/mocks/m7/submit', {
          score: Math.round((finalCorrect / total) * 720),
          accuracy: Math.round((finalCorrect / total) * 100),
        });
      }
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    shownAt.current = Date.now();
  };

  const optionStyle = (id) => {
    if (!picked) return { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textSecondary };
    if (id === q.correct) return { bg: colors.greenGlow, border: colors.greenBorder, circle: colors.green, letter: '#0D0D0D', text: colors.green };
    if (id === picked) return { bg: colors.orangeGlow, border: colors.orange + '40', circle: colors.orange, letter: '#0D0D0D', text: colors.orange };
    return { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textMuted };
  };

  if (done) {
    const accuracy = Math.round((correctCount / total) * 100);
    return (
      <Screen>
        <View style={{ flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <Txt variant="h1" style={{ marginTop: Spacing.md }}>Session complete!</Txt>
          <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>You answered {total} questions</Txt>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl, alignSelf: 'stretch' }}>
            <ResultStat value={`${accuracy}%`} label="CORRECT" color={colors.green} />
            <ResultStat value="6:20" label="TIME" color={colors.blue} />
            <ResultStat value="0" label="SKIPPED" color={colors.textMuted} />
          </View>
          <View style={{ marginTop: Spacing.xxxl, alignSelf: 'stretch' }}>
            <Btn label="Back to chapter" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>← Exit</Text>
          </TouchableOpacity>
          <Txt variant="h5" color={colors.textSecondary}>Q {idx + 1} of {total}</Txt>
          <View style={{ backgroundColor: colors.greenGlow, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 5 }}>
            <Text style={{ color: colors.green, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 13 }}>14:07</Text>
          </View>
        </View>

        <ProgressBar value={pct} color={colors.green} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: Spacing.lg }}>
          <Txt variant="caption" color={colors.textMuted}>{chapter?.name || 'Practice session'}</Txt>
          <Txt variant="caption" color={colors.green}>{pct}% complete</Txt>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, marginBottom: Spacing.md }}>
          <Badge label={q.subject === 'biology' ? 'Biology' : q.subject === 'physics' ? 'Physics' : 'Chemistry'} color={q.subject} />
          <Badge label={`NEET ${q.year}`} color="blue" />
        </View>

        <Txt variant="h3" style={{ lineHeight: 27, marginBottom: Spacing.xl }}>{q.text}</Txt>

        <View style={{ gap: Spacing.sm }}>
          {q.options.map((opt) => {
            const s = optionStyle(opt.id);
            return (
              <TouchableOpacity key={opt.id} activeOpacity={0.85} onPress={() => choose(opt.id)}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: s.bg, borderWidth: 1, borderColor: s.border, borderRadius: Radius.md, padding: Spacing.md }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: s.circle, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
                  <Text style={{ color: s.letter, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 13 }}>{opt.id}</Text>
                </View>
                <Txt variant="body" color={s.text} style={{ flex: 1 }}>{opt.text}</Txt>
              </TouchableOpacity>
            );
          })}
        </View>

        {picked ? (
          <GreenCard style={{ marginTop: Spacing.lg, backgroundColor: picked === q.correct ? colors.greenGlow : colors.bgCard, borderColor: picked === q.correct ? colors.greenBorder : colors.border }}>
            <Eyebrow label={picked === q.correct ? '✅ CORRECT!' : '❌ INCORRECT'} color={picked === q.correct ? colors.green : colors.orange} />
            <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>{q.explanation}</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.md }}>
              {q.tags.map((t) => (
                <View key={t} style={{ backgroundColor: colors.bgCard2, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.xs }}>
                  <Txt variant="caption" color={colors.textMuted}>{t}</Txt>
                </View>
              ))}
            </View>
          </GreenCard>
        ) : null}

        {picked ? <Btn label={idx + 1 >= total ? 'Finish session →' : 'Next question →'} onPress={next} style={{ marginTop: Spacing.lg }} /> : null}
      </ScrollView>
    </Screen>
  );
}

function ResultStat({ value, label, color }) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ color, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 22 }}>{value}</Text>
      <Eyebrow label={label} style={{ marginTop: 4 }} />
    </Card>
  );
}
