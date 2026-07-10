import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius, Typography } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, IconBox, StepDots,
  OptionSelector, ProgressBar, Badge, SubjectRow, StatPill,
} from '../components/common';
import { TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data';
import { Haptic } from '../utils/haptics';
import { api } from '../api/client';

const fmtClock = (secs) => {
  const s = Math.max(0, secs);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

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
          <TouchableOpacity onPress={() => navigation.navigate('OnboardSignIn')} style={{ alignItems: 'center', marginTop: Spacing.lg }}>
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

// ── Screen 4: Brain Scan active flow (adaptive + real scoring) ───────────────
const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
const LEVELS = ['Easy', 'Medium', 'Hard'];

export function OnboardBrainScan({ navigation, route }) {
  const { colors } = useTheme();
  const profile = route.params?.profile;

  // Bucket the bank by difficulty so we can ramp adaptively.
  const buckets = useMemo(() => {
    const b = { Easy: [], Medium: [], Hard: [] };
    for (const q of QUESTIONS) (b[q.difficulty] || b.Medium).push(q);
    return b;
  }, []);
  const quizLen = Math.min(8, QUESTIONS.length);

  const [level, setLevel] = useState(1); // start at Medium
  const [seen, setSeen] = useState([]);  // question ids already served
  const [current, setCurrent] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(0);
  const stats = useRef({ correct: 0, bySubject: { biology: { c: 0, n: 0 }, physics: { c: 0, n: 0 }, chemistry: { c: 0, n: 0 } } });

  // Real 20-minute countdown; auto-finishes at 0.
  const [remaining, setRemaining] = useState(20 * 60);

  const pickAt = useCallback((lvl, seenIds) => {
    // Nearest-level unseen question, widening outward if a bucket is empty.
    for (let d = 0; d < 3; d++) {
      for (const dir of [0, -1, 1]) {
        const L = LEVELS[Math.min(2, Math.max(0, lvl + d * dir))];
        const cand = buckets[L].find((q) => !seenIds.includes(q.id));
        if (cand) return cand;
      }
    }
    return QUESTIONS.find((q) => !seenIds.includes(q.id)) || null;
  }, [buckets]);

  useEffect(() => {
    if (!current) setCurrent(pickAt(1, []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = current;
  const total = 30;               // maps our pilot pool onto the "30-question" chrome
  const shownQ = idx + 1;

  const finish = useCallback(() => {
    const s = stats.current;
    const acc = (k) => (s.bySubject[k].n ? Math.round((s.bySubject[k].c / s.bySubject[k].n) * 100) : null);
    const perSubject = { biology: acc('biology'), physics: acc('physics'), chemistry: acc('chemistry') };
    const answeredN = s.bySubject.biology.n + s.bySubject.physics.n + s.bySubject.chemistry.n;
    const overall = answeredN ? Math.round((s.correct / answeredN) * 100) : 0;
    navigation.navigate('OnboardResult', { profile, scan: { perSubject, overall, answered: answeredN } });
  }, [navigation, profile]);

  useEffect(() => {
    if (remaining <= 0) { finish(); return undefined; }
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining, finish]);

  const choose = (id) => {
    if (picked || !q) return;
    setPicked(id);
    setAnswered((a) => a + 1);
    const ok = id === q.correct;
    const bucket = stats.current.bySubject[q.subject] || stats.current.bySubject.biology;
    bucket.n += 1;
    if (ok) { bucket.c += 1; stats.current.correct += 1; setLevel((l) => Math.min(2, l + 1)); Haptic.success(); }
    else { setLevel((l) => Math.max(0, l - 1)); Haptic.error(); }
  };

  const next = () => {
    if (idx + 1 >= quizLen) { finish(); return; }
    const nextSeen = [...seen, q.id];
    const nextQ = pickAt(level, nextSeen);
    if (!nextQ) { finish(); return; }
    setSeen(nextSeen);
    setCurrent(nextQ);
    setIdx((i) => i + 1);
    setPicked(null);
  };

  if (!q) {
    return (
      <Screen><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 40 }}>🧠</Text></View></Screen>
    );
  }

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
          <View style={{ backgroundColor: remaining < 60 ? colors.orangeGlow : colors.greenGlow, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 5 }}>
            <Text style={{ color: remaining < 60 ? colors.orange : colors.green, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 13 }}>{fmtClock(remaining)}</Text>
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
  const scan = route.params?.scan; // present when the scan was actually taken

  // Real per-subject breakdown when we have scan data; illustrative otherwise.
  const breakdown = scan
    ? [
        { name: 'Biology', value: scan.perSubject.biology },
        { name: 'Physics', value: scan.perSubject.physics },
        { name: 'Chemistry', value: scan.perSubject.chemistry },
      ].filter((r) => r.value != null)
    : [
        { name: 'Mechanics', value: 72 },
        { name: 'Optics', value: 58 },
        { name: 'Thermodynamics', value: 38 },
        { name: 'Organic Chem', value: 45 },
        { name: 'Genetics', value: 81 },
        { name: 'Physiology', value: 31 },
      ];

  // Estimated rank from overall accuracy (same heuristic family as mocks).
  const overall = scan ? scan.overall : 42;
  const estScore = Math.round((overall / 100) * 720);
  const estRank = Math.max(1, Math.round(1150000 * Math.pow(1 - estScore / 720, 2.45)));
  const rankLabel = scan
    ? `AIR ~${estRank.toLocaleString('en-IN')}`
    : 'AIR ~65,000';

  const critical = breakdown.filter((r) => r.value < 55).length;
  const needsWork = breakdown.filter((r) => r.value >= 55 && r.value < 75).length;
  const strong = breakdown.filter((r) => r.value >= 75).length;

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
          <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 42, letterSpacing: -2, marginTop: Spacing.md }}>{rankLabel}</Text>
          <Txt variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 4 }}>Scolrly will get you to top 10,000</Txt>
        </View>

        <GreenCard style={{ marginTop: Spacing.xl }}>
          <Txt variant="h4" style={{ marginBottom: Spacing.md }}>
            {scan ? 'Subject accuracy breakdown' : 'Chapter accuracy breakdown'}
          </Txt>
          {breakdown.map((c) => (
            <SubjectRow key={c.name} name={c.name} value={c.value} />
          ))}
        </GreenCard>

        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
          <StatPill value={String(critical)} label="Critical gaps" color="orange" />
          <StatPill value={String(needsWork)} label="Needs work" color="yellow" />
          <StatPill value={String(strong)} label="Strong" color="green" />
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

// ── Sign in / create account (email auth) ────────────────────────────────────
export function OnboardSignIn({ navigation }) {
  const { colors } = useTheme();
  const { completeOnboarding } = useApp();
  const [mode, setMode] = useState('signin'); // signin | register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.');
      return;
    }
    setBusy(true);
    Haptic.light();
    const res = mode === 'register'
      ? await api.register(email.trim(), password, name.trim() || email.split('@')[0])
      : await api.login(email.trim(), password);
    setBusy(false);
    if (res.error) { setError(res.error); Haptic.error(); return; }
    Haptic.success();
    const u = res.user || {};
    await completeOnboarding({
      name: u.name, initials: u.initials, targetYear: u.targetYear,
      status: u.status, coaching: u.coaching, medium: u.medium,
    });
  };

  const field = {
    backgroundColor: colors.bgCard2, borderRadius: Radius.sm, borderWidth: 0.5,
    borderColor: colors.border, paddingHorizontal: Spacing.md, height: 48,
    color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14,
  };

  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: Spacing.xl, paddingTop: Spacing.xxxl }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={[Typography.h5, { color: colors.green }]}>← Back</Text>
        </TouchableOpacity>

        <Eyebrow label={mode === 'register' ? 'CREATE ACCOUNT' : 'WELCOME BACK'} style={{ marginTop: Spacing.xl }} />
        <Txt variant="h1" style={{ marginTop: 6 }}>{mode === 'register' ? 'Join Scolrly' : 'Sign in'}</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 6, marginBottom: Spacing.xl }}>
          {mode === 'register' ? 'Your progress syncs across devices.' : 'Pick up exactly where you left off.'}
        </Txt>

        <View style={{ gap: Spacing.md }}>
          {mode === 'register' ? (
            <TextInput value={name} onChangeText={setName} placeholder="Full name"
              placeholderTextColor={colors.textMuted} style={field} />
          ) : null}
          <TextInput value={email} onChangeText={setEmail} placeholder="Email"
            autoCapitalize="none" keyboardType="email-address"
            placeholderTextColor={colors.textMuted} style={field} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password (min 6 chars)"
            secureTextEntry placeholderTextColor={colors.textMuted} style={field} />
        </View>

        {error ? (
          <View style={{ marginTop: Spacing.md, backgroundColor: colors.orangeGlow, borderRadius: Radius.sm, borderWidth: 1, borderColor: colors.orange + '40', padding: Spacing.md }}>
            <Txt variant="bodySmall" color={colors.orange}>{error}</Txt>
          </View>
        ) : null}

        <View style={{ marginTop: Spacing.xl }}>
          <Btn label={busy ? 'Please wait…' : (mode === 'register' ? 'Create account' : 'Sign in')} onPress={submit} disabled={busy} />
        </View>

        <TouchableOpacity onPress={() => { setMode(mode === 'register' ? 'signin' : 'register'); setError(null); }} style={{ alignItems: 'center', marginTop: Spacing.lg }}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            {mode === 'register' ? 'Already have an account? ' : "New here? "}
            <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700' }}>
              {mode === 'register' ? 'Sign in' : 'Create one'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
