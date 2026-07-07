import React, { useState } from 'react';
import {
  View, ScrollView, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, OptionSelector, SectionHeader, DoubtCard, EmptyState,
} from '../components/common';
import { DOUBT_HISTORY } from '../data';
import { Haptic } from '../utils/haptics';
import { api } from '../api/client';

const SUBJECT_OPTS = ['All', 'Biology', 'Physics', 'Chemistry'];

const FALLBACK_ANSWER = {
  text: "Break the problem into what's asked vs. what's given, identify the governing NCERT principle, then apply the relevant formula step by step. (You're offline — your doubt will be answered in full when you reconnect.)",
  ncertRef: 'NCERT — general reference',
};

export default function DoubtDropScreen({ navigation }) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('All');
  const [state, setState] = useState('idle'); // idle | loading | answered
  const [answer, setAnswer] = useState(null);
  const [history, setHistory] = useState(DOUBT_HISTORY);

  React.useEffect(() => {
    api.get('/api/doubts').then((r) => {
      if (r?.doubts?.length) setHistory(r.doubts);
    });
  }, [state]);

  const submit = async () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    Haptic.light();
    setState('loading');
    const res = await api.post('/api/doubts', { question: text.trim(), subject }, { timeout: 10000 });
    setAnswer(res
      ? { text: res.answer, ncertRef: res.ncertRef }
      : FALLBACK_ANSWER);
    setState('answered');
    Haptic.success();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg }}>
              <Txt variant="h2">Doubt Drop</Txt>
              <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
                <Text style={{ color: colors.textSecondary, fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl }}>
              <Txt variant="body" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
                Ask any NEET doubt — AI answers in 10 seconds
              </Txt>

              <Card>
                <View style={{ backgroundColor: colors.bgCard2, borderRadius: Radius.sm, padding: Spacing.md, minHeight: 96 }}>
                  <TextInput
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={300}
                    placeholder="Type your doubt here..."
                    placeholderTextColor={colors.textMuted}
                    style={{ color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlignVertical: 'top', flex: 1 }}
                  />
                  <Txt variant="caption" color={colors.textMuted} style={{ alignSelf: 'flex-end', marginTop: 4 }}>{text.length}/300</Txt>
                </View>
                <View style={{ marginTop: Spacing.md }}>
                  <OptionSelector options={SUBJECT_OPTS} selected={subject} onSelect={setSubject} />
                </View>
                <View style={{ marginTop: Spacing.md }}>
                  <Btn label="Ask Scolrly" onPress={submit} disabled={!text.trim() || state === 'loading'} />
                </View>
              </Card>

              {state === 'loading' ? (
                <Card style={{ marginTop: Spacing.lg, alignItems: 'center', paddingVertical: Spacing.xxl }}>
                  <Text style={{ fontSize: 40 }}>🧠</Text>
                  <Txt variant="h4" style={{ marginTop: Spacing.md }}>Analysing your doubt...</Txt>
                  <Txt variant="body" color={colors.textMuted} style={{ marginTop: 4 }}>• • •</Txt>
                </Card>
              ) : null}

              {state === 'answered' && answer ? (
                <GreenCard style={{ marginTop: Spacing.lg }}>
                  <Eyebrow label="ANSWER" />
                  <Txt variant="body" color={colors.textPrimary} style={{ marginTop: 6 }}>{answer.text}</Txt>
                  <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13, marginTop: Spacing.md }}>📖 {answer.ncertRef}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md }}>
                    <Txt variant="bodySmall" color={colors.textSecondary}>Was this helpful?</Txt>
                    <TouchableOpacity onPress={Haptic.light}><Text style={{ fontSize: 18 }}>👍</Text></TouchableOpacity>
                    <TouchableOpacity onPress={Haptic.light}><Text style={{ fontSize: 18 }}>👎</Text></TouchableOpacity>
                  </View>
                </GreenCard>
              ) : null}

              {/* History */}
              <SectionHeader title="Previous doubts" style={{ marginTop: Spacing.xl }} />
              {history.length === 0 ? (
                <EmptyState emoji="💭" title="No doubts yet" subtitle="Ask your first question above." />
              ) : (
                <View style={{ gap: Spacing.sm }}>
                  {history.map((d) => <DoubtCard key={d.id} doubt={d} />)}
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}
