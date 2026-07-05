import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius, Typography } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, IconBox, StepDots,
  OptionSelector, ProgressBar, Badge, SubjectRow, StatPill,
} from '../components/common';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data';
import { Haptic } from '../utils/haptics';

// Logo block reused across onboarding.
function Logo({ size = 80 }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: Radius.xl, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#0D0D0D', fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: size * 0.55 }}>S</Text>
    </View>
  );
}

// ── Screen 1: Welcome ────────────────────────────────────────────────────────
export function OnboardWelcome({ navigation }) {
  const { colors } = useTheme();
  const features = [
    { color: 'green', icon: '🧠', title: 'AI diagnoses your weak spots', desc: 'Brain Scan maps all 97 NEET chapters' },
    { color: 'orange', icon: '🎯', title: 'Daily study mission', desc: 'Tells you exactly what to study today' },
    { color: 'purple', icon: '📈', title: 'Live rank tracker', desc: 'See your AIR after every mock test' },
  ];
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl, paddingBottom: Spacing.xxxl, flexGrow: 1 }}>
        <View style={{ alignItems: 'center', marginTop: Spacing.xxxl }}>
          <Logo />
          <Eyebrow label="WELCOME TO" style={{ marginTop: Spacing.xl }} />
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 40, letterSpacing: -1.5, marginTop: 4 }}>scolrly</Text>
          <Txt variant="body" color={colors.textSecondary} style={{ marginTop: Spacing.sm }}>Study smarter. Rank higher.</Txt>
          <Txt variant="bodySmall" color={colors.textMuted} style={{ marginTop: 2 }}>India's most intelligent NEET prep.</Txt>
        </View>

        <View style={{ marginTop: Spacing.xxxl, gap: Spacing.md }}>
          {features.map((f) => (
            <Card key={f.title} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconBox color={f.color}><Text style={{ fontSize: 20 }}>{f.icon}</Text></IconBox>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Txt variant="h5">{f.title}</Txt>
                <Txt variant="bodySmall" color={colors.textMuted} style={{ marginTop: 2 }}>{f.desc}</Txt>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ marginTop: Spacing.xxxl }}>
          <Btn label="Get started — it's free" onPress={() => navigation.navigate('OnboardProfile')} />
          <TouchableOpacity onPress={() => navigation.navigate('OnboardProfile')} style={{ alignItems: 'center', marginTop: Spacing.lg }}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Already have an account? <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700' }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

// ── Screen 2: Profile ────────────────────────────────────────────────────────
export function OnboardProfile({ navigation }) {
  const { colors } = useTheme();
  const [year, setYear] = useState('2026');
  const [status, setStatus] = useState('Class 12');
  const [coaching, setCoaching] = useState('Aakash');
  const [medium, setMedium] = useState('English');

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 100 }}>
        <StepDots total={5} current={0} style={{ marginBottom: Spacing.xl }} />
        <Eyebrow label="STEP 1 OF 4" />
        <Txt variant="h1" style={{ marginTop: 6 }}>Tell us about you</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 6, marginBottom: Spacing.xl }}>
          We will personalise your entire experience
        </Txt>

        <View style={{ gap: Spacing.lg }}>
          <Card><OptionSelector label="NEET TARGET YEAR" options={['2026', '2027', '2028']} selected={year} onSelect={setYear} /></Card>
          <Card><OptionSelector label="YOUR CURRENT STATUS" options={['Class 11', 'Class 12', 'Dropper']} selected={status} onSelect={setStatus} /></Card>
          <Card><OptionSelector label="COACHING ATTENDANCE" options={['None', 'Allen', 'Aakash', 'PW', 'Other']} selected={coaching} onSelect={setCoaching} /></Card>
          <Card><OptionSelector label="STUDY MEDIUM" options={['English', 'Hindi']} selected={medium} onSelect={setMedium} /></Card>
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.xl, backgroundColor: colors.bg, borderTopWidth: 0.5, borderTopColor: colors.border }}>
        <Btn label="Continue" onPress={() => navigation.navigate('OnboardBrainIntro', { profile: { targetYear: Number(year), status, coaching, medium } })} />
      </View>
    </Screen>
  );
}

// ── Screen 3: Brain Scan intro ───────────────────────────────────────────────
export function OnboardBrainIntro({ navigation, route }) {
  const { colors } = useTheme();
  const profile = route.params?.profile;
  const steps = [
    { n: '1', color: 'green', title: 'Adaptive difficulty', desc: 'Questions adjust in real time' },
    { n: '2', color: 'orange', title: 'Visual Brain Map', desc: 'Radar chart of all 97 chapters' },
    { n: '3', color: 'purple', title: 'Shareable result card', desc: 'Share on WhatsApp for virality' },
  ];
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl, paddingBottom: Spacing.xxxl }}>
        <StepDots total={5} current={1} style={{ marginBottom: Spacing.xl }} />
        <IconBox color="green" size={64}><Text style={{ fontSize: 30 }}>🧠</Text></IconBox>
        <Eyebrow label="STEP 2 OF 4" style={{ marginTop: Spacing.lg }} />
        <Txt variant="h1" style={{ marginTop: 6 }}>Your NEET{'\n'}Brain Scan</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: Spacing.sm }}>
          30 adaptive questions across Physics, Chemistry and Biology. Takes 20 minutes. Our AI maps all 97 chapters.
        </Txt>

        <View style={{ marginTop: Spacing.xl, gap: Spacing.md }}>
          {steps.map((s) => (
            <Card key={s.n} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: s.color === 'green' ? colors.green : s.color === 'orange' ? colors.orange : colors.purple, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#0D0D0D', fontFamily: 'Inter_800ExtraBold', fontWeight: '800' }}>{s.n}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Txt variant="h5">{s.title}</Txt>
                <Txt variant="bodySmall" color={colors.textMuted} style={{ marginTop: 2 }}>{s.desc}</Txt>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ marginTop: Spacing.xxxl, gap: Spacing.md }}>
          <Btn label="Start Brain Scan — 20 min" onPress={() => navigation.navigate('OnboardBrainScan', { profile })} />
          <Btn label="Skip for now" variant="outline" onPress={() => navigation.navigate('OnboardResult', { profile })} />
        </View>
      </ScrollView>
    </Screen>
  );
}

// ── Screen 4: Brain Scan active flow ─────────────────────────────────────────
export function OnboardBrainScan({ navigation, route }) {
  const { colors } = useTheme();
  const profile = route.params?.profile;
  const quiz = useMemo(() => QUESTIONS.slice(0, 6), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(0);

  const q = quiz[idx];
  const total = 30;
  const shownQ = idx + 1;

  const choose = (id) => {
    if (picked) return;
    setPicked(id);
    setAnswered((a) => a + 1);
    if (id === q.correct) Haptic.success(); else Haptic.error();
  };

  const next = () => {
    if (idx + 1 >= quiz.length) {
      navigation.navigate('OnboardResult', { profile });
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const optionStyle = (id) => {
    if (!picked) return { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textSecondary };
    if (id === q.correct) return { bg: colors.greenGlow, border: colors.greenBorder, circle: colors.green, letter: '#0D0D0D', text: colors.green };
    if (id === picked) return { bg: colors.orangeGlow, border: colors.orange + '40', circle: colors.orange, letter: '#0D0D0D', text: colors.orange };
    return { bg: colors.bgCard, border: colors.border, circle: colors.bgCard2, letter: colors.textMuted, text: colors.textMuted };
  };

  return (
    <Screen>
      <View style={{ flex: 1, padding: Spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
          <Txt variant="bodySmall" color={colors.textMuted}>Brain Scan · Q {shownQ} of {total}</Txt>
          <View style={{ backgroundColor: colors.greenGlow, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 5 }}>
            <Text style={{ color: colors.green, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 13 }}>8:32</Text>
          </View>
        </View>

        <ProgressBar value={(shownQ / total) * 100} color={colors.green} style={{ marginBottom: Spacing.lg }} />

        <Badge label={`${q.subject === 'biology' ? 'Biology' : q.subject === 'physics' ? 'Physics' : 'Chemistry'} — ${q.tags[0]}`} color={q.subject} style={{ marginBottom: Spacing.lg }} />

        <Txt variant="h3" style={{ marginBottom: Spacing.xl, lineHeight: 26 }}>{q.text}</Txt>

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
          <GreenCard style={{ marginTop: Spacing.lg }}>
            <Eyebrow label="EXPLANATION" />
            <Txt variant="body" color={colors.green} style={{ marginTop: 6 }}>{q.explanation}</Txt>
          </GreenCard>
        ) : null}

        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md }}>
          <CounterPill value={answered} label="Answered" color={colors.green} />
          <CounterPill value={0} label="Skipped" color={colors.textMuted} />
          <CounterPill value={total - shownQ} label="Remaining" color={colors.blue} />
        </View>

        {picked ? <Btn label="Next question →" onPress={next} /> : null}
      </View>
    </Screen>
  );
}

function CounterPill({ value, label, color }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCard, borderRadius: Radius.sm, paddingVertical: Spacing.sm, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border }}>
      <Text style={{ color, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 14 }}>{value}</Text>
      <Txt variant="caption" color={colors.textMuted}>{label}</Txt>
    </View>
  );
}

// ── Screen 5: Result / Brain Map ─────────────────────────────────────────────
export function OnboardResult({ navigation, route }) {
  const { colors } = useTheme();
  const { completeOnboarding } = useApp();
  const profile = route.params?.profile;

  const breakdown = [
    { name: 'Mechanics', value: 72 },
    { name: 'Optics', value: 58 },
    { name: 'Thermodynamics', value: 38 },
    { name: 'Organic Chem', value: 45 },
    { name: 'Genetics', value: 81 },
    { name: 'Physiology', value: 31 },
  ];

  const finish = async () => {
    Haptic.success();
    await completeOnboarding(profile);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl, paddingBottom: Spacing.xxxl }}>
        <View style={{ alignItems: 'center', marginTop: Spacing.lg }}>
          <Eyebrow label="BRAIN SCAN COMPLETE" />
          <Txt variant="h2" style={{ marginTop: 6 }}>Your Brain Map</Txt>
          <Txt variant="bodySmall" color={colors.textMuted} style={{ marginTop: 4 }}>Estimated rank based on today</Txt>
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 42, letterSpacing: -2, marginTop: Spacing.md }}>AIR ~65,000</Text>
          <Txt variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 4 }}>Scolrly will get you to top 10,000</Txt>
        </View>

        <GreenCard style={{ marginTop: Spacing.xl }}>
          <Txt variant="h4" style={{ marginBottom: Spacing.md }}>Chapter accuracy breakdown</Txt>
          {breakdown.map((c) => (
            <SubjectRow key={c.name} name={c.name} value={c.value} />
          ))}
        </GreenCard>

        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
          <StatPill value="3" label="Critical gaps" color="orange" />
          <StatPill value="2" label="Needs work" color="yellow" />
          <StatPill value="2" label="Strong" color="green" />
        </View>

        <View style={{ marginTop: Spacing.xxxl, gap: Spacing.md }}>
          <Btn label="Start my study plan →" onPress={finish} />
          <TouchableOpacity onPress={() => navigation.navigate('ShareResult')} style={{ alignItems: 'center' }}>
            <Text style={[Typography.h5, { color: colors.green }]}>Share my Brain Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
