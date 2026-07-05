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

const SUBJECT_OPTS = ['All', 'Biology', 'Physics', 'Chemistry'];

export default function DoubtDropScreen({ navigation }) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('All');
  const [state, setState] = useState('idle'); // idle | loading | answered
  const [answer, setAnswer] = useState(null);

  const submit = () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    Haptic.light();
    setState('loading');
    setTimeout(() => {
      setAnswer({
        text: "Great question! Based on NCERT, here's the key idea: break the problem into what's asked vs. what's given, identify the governing principle, then apply the relevant formula step by step. This doubt maps to a high-frequency PYQ concept — expect a variant in your next mock.",
        ncertRef: 'NCERT reference · Ch 4',
      });
      setState('answered');
      Haptic.success();
    }, 1600);
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
              {DOUBT_HISTORY.length === 0 ? (
                <EmptyState emoji="💭" title="No doubts yet" subtitle="Ask your first question above." />
              ) : (
                <View style={{ gap: Spacing.sm }}>
                  {DOUBT_HISTORY.map((d) => <DoubtCard key={d.id} doubt={d} />)}
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}
