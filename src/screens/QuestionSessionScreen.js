import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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

const fmt = (secs) => {
  const s = Math.max(0, Math.round(secs));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};
// Mirrors the server's AIR heuristic so results show a rank even offline.
const estimateRank = (score) => {
  const s = Math.max(0, Math.min(720, score));
  return Math.max(1, Math.round(1150000 * Math.pow(1 - s / 720, 2.45)));
};
const subjectLabel = (s) => (s === 'biology' ? 'Biology' : s === 'physics' ? 'Physics' : 'Chemistry');

export default function QuestionSessionScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { markAnswered } = useApp();
  const chapterId = route.params?.chapterId;
  const mode = route.params?.mode || 'practice';
  const mockId = route.params?.mockId || 'm7';
  const isMock = mode === 'mock';
  const chapter = CHAPTERS.find((c) => c.id === chapterId);

  // ── Question pool ──────────────────────────────────────────────────────────
  // Practice: chapter questions first, padded. Mock: fetched live paper (falls
  // back to the bundled bank when the server is unreachable).
  const bundledPool = useMemo(() => {
    const own = QUESTIONS.filter((q) => q.chapter === chapterId);
    const rest = QUESTIONS.filter((q) => q.chapter !== chapterId);
    return (own.length ? [...own, ...rest] : QUESTIONS).slice(0, 8);
  }, [chapterId]);

  const [pool, setPool] = useState(isMock ? null : bundledPool);
  const [durationSecs, setDurationSecs] = useState(null);
  const [totalMarks, setTotalMarks] = useState(720);

  useEffect(() => {
    if (!isMock) return;
    let alive = true;
    api.get(`/api/mocks/${mockId}/paper`).then((r) => {
      if (!alive) return;
      if (r?.questions?.length) {
        setPool(r.questions);
        setDurationSecs(r.mock.duration * 60);
        setTotalMarks(r.mock.totalMarks);
      } else {
        setPool(QUESTIONS); // offline fallback: whole bundled bank
        setDurationSecs(QUESTIONS.length * 60);
        setTotalMarks(QUESTIONS.length * 4);
      }
    });
    return () => { alive = false; };
  }, [isMock, mockId]);

  // ── Session state ──────────────────────────────────────────────────────────
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);          // practice: current reveal
  const [answers, setAnswers] = useState({});          // mock: qid -> letter
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);          // practice completion stats
  const shownAt = useRef(Date.now());
  const startedAt = useRef(Date.now());

  const total = pool ? pool.length : 0;
  const q = pool ? pool[idx] : null;

  // ── Timer: mock counts down (auto-submit at 0), practice counts up ─────────
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (done || !pool) return undefined;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [done, pool]);

  const remaining = durationSecs != null ? durationSecs - elapsed : null;

  const submitMock = useCallback((finalAnswers) => {
    // NEET marking: +4 correct, −1 wrong, 0 unattempted. Scale the short pilot
    // paper onto the mock's mark basis so results sit alongside seeded history.
    let correct = 0, wrong = 0;
    const bySubjRaw = { biology: 0, physics: 0, chemistry: 0 };
    for (const item of pool) {
      const a = finalAnswers[item.id];
      if (a == null) continue;
      if (a === item.correct) { correct += 1; bySubjRaw[item.subject] += 4; }
      else { wrong += 1; bySubjRaw[item.subject] -= 1; }
    }
    const attempted = correct + wrong;
    const rawMax = total * 4;
    const scaled = (v) => Math.max(0, Math.round((v / (rawMax || 1)) * totalMarks));
    const raw = correct * 4 - wrong;
    const score = scaled(raw);
    const subjectScores = {
      biology: scaled(bySubjRaw.biology),
      physics: scaled(bySubjRaw.physics),
      chemistry: scaled(bySubjRaw.chemistry),
    };
    const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
    const timeTaken = fmt(elapsed);
    const unattempted = total - attempted;
    api.post(`/api/mocks/${mockId}/submit`, { score, accuracy, timeTaken, subjectScores });
    return {
      mockId, score, totalMarks, accuracy, timeTaken, subjectScores,
      correct, wrong, attempted, unattempted, total, rank: estimateRank(score),
    };
  }, [pool, total, totalMarks, elapsed, mockId]);

  // Auto-submit a mock when the clock runs out.
  useEffect(() => {
    if (isMock && remaining != null && remaining <= 0 && !done) {
      Haptic.heavy();
      const res = submitMock(answers);
      navigation.replace('MockResult', { mockId, result: res });
    }
  }, [isMock, remaining, done, answers, submitMock, navigation, mockId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const choosePractice = (id) => {
    if (picked) return;
    setPicked(id);
    const ok = id === q.correct;
    if (ok) { setCorrectCount((c) => c + 1); Haptic.success(); } else Haptic.error();
    markAnswered(q.id, id, Date.now() - shownAt.current);
  };

  const chooseMock = (id) => {
    Haptic.light();
    setAnswers((a) => ({ ...a, [q.id]: id }));
  };

  const nextPractice = () => {
    if (idx + 1 >= total) {
      setResult({ accuracy: Math.round((correctCount / total) * 100), time: fmt(elapsed) });
      setDone(true); Haptic.medium();
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    shownAt.current = Date.now();
  };

  const finishMock = () => {
    const res = submitMock(answers);
    Haptic.medium();
    navigation.replace('MockResult', { mockId, result: res });
  };

  const optionStyle = (id) => {
    if (isMock) {
      const chosen = answers[q.id] === id;
      return chosen
        ? { bg: colors.greenGlow, border: colors.greenBorder, circle: colors.green, letter: '#0D0D0D', text: colors.green }
        : { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textSecondary };
    }
    if (!picked) return { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textSecondary };
    if (id === q.correct) return { bg: colors.greenGlow, border: colors.greenBorder, circle: colors.green, letter: '#0D0D0D', text: colors.green };
    if (id === picked) return { bg: colors.orangeGlow, border: colors.orange + '40', circle: colors.orange, letter: '#0D0D0D', text: colors.orange };
    return { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textMuted };
  };

  // ── Loading (mock paper) ────────────────────────────────────────────────────
  if (!pool) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40 }}>📝</Text>
          <Txt variant="h4" style={{ marginTop: Spacing.md }}>Loading your paper…</Txt>
        </View>
      </Screen>
    );
  }

  // ── Practice completion ─────────────────────────────────────────────────────
  if (done && result) {
    return (
      <Screen>
        <View style={{ flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <Txt variant="h1" style={{ marginTop: Spacing.md }}>Session complete!</Txt>
          <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>You answered {total} questions</Txt>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl, alignSelf: 'stretch' }}>
            <ResultStat value={`${result.accuracy}%`} label="CORRECT" color={colors.green} />
            <ResultStat value={result.time} label="TIME" color={colors.blue} />
            <ResultStat value={`${correctCount}/${total}`} label="SCORE" color={colors.textPrimary} />
          </View>
          <View style={{ marginTop: Spacing.xxxl, alignSelf: 'stretch' }}>
            <Btn label="Back to chapter" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </Screen>
    );
  }

  const pct = Math.round(((idx + (isMock ? (answers[q.id] ? 1 : 0) : (picked ? 1 : 0))) / total) * 100);
  const answeredCount = Object.keys(answers).length;
  const timerLow = isMock && remaining != null && remaining < 60;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>← Exit</Text>
          </TouchableOpacity>
          <Txt variant="h5" color={colors.textSecondary}>Q {idx + 1} of {total}</Txt>
          <View style={{ backgroundColor: timerLow ? colors.orangeGlow : colors.greenGlow, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 5 }}>
            <Text style={{ color: timerLow ? colors.orange : colors.green, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 13 }}>
              {isMock ? fmt(remaining) : fmt(elapsed)}
            </Text>
          </View>
        </View>

        <ProgressBar value={pct} color={colors.green} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: Spacing.lg }}>
          <Txt variant="caption" color={colors.textMuted}>
            {isMock ? `${answeredCount} answered` : (chapter?.name || 'Practice session')}
          </Txt>
          <Txt variant="caption" color={colors.green}>{pct}% complete</Txt>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, marginBottom: Spacing.md }}>
          <Badge label={subjectLabel(q.subject)} color={q.subject} />
          <Badge label={`NEET ${q.year}`} color="blue" />
          {isMock ? <Badge label="+4 / −1" color="orange" /> : null}
        </View>

        <Txt variant="h3" style={{ lineHeight: 27, marginBottom: Spacing.xl }}>{q.text}</Txt>

        <View style={{ gap: Spacing.sm }}>
          {q.options.map((opt) => {
            const s = optionStyle(opt.id);
            return (
              <TouchableOpacity key={opt.id} activeOpacity={0.85} onPress={() => (isMock ? chooseMock(opt.id) : choosePractice(opt.id))}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: s.bg, borderWidth: 1, borderColor: s.border, borderRadius: Radius.md, padding: Spacing.md }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: s.circle, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
                  <Text style={{ color: s.letter, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 13 }}>{opt.id}</Text>
                </View>
                <Txt variant="body" color={s.text} style={{ flex: 1 }}>{opt.text}</Txt>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Practice: reveal explanation after answering */}
        {!isMock && picked ? (
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

        {/* Navigation controls */}
        {isMock ? (
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
            {idx > 0 ? <Btn label="← Prev" variant="outline" onPress={() => setIdx((i) => i - 1)} style={{ flex: 1 }} /> : null}
            {idx + 1 < total
              ? <Btn label="Next →" onPress={() => setIdx((i) => i + 1)} style={{ flex: 1 }} />
              : <Btn label="Submit test" onPress={finishMock} style={{ flex: 1 }} />}
          </View>
        ) : (
          picked ? <Btn label={idx + 1 >= total ? 'Finish session →' : 'Next question →'} onPress={nextPractice} style={{ marginTop: Spacing.lg }} /> : null
        )}

        {isMock && idx + 1 < total ? (
          <TouchableOpacity onPress={finishMock} style={{ alignItems: 'center', marginTop: Spacing.md }}>
            <Text style={{ color: colors.textMuted, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>Submit early ({answeredCount}/{total} answered)</Text>
          </TouchableOpacity>
        ) : null}
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
