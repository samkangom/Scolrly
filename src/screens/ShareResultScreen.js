import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import { Screen, Txt, Eyebrow } from '../components/common';
import { MOCK_TESTS, STATS } from '../data';
import { Haptic } from '../utils/haptics';

function ShareBtn({ label, emoji, bg, textColor, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => { Haptic.light(); onPress && onPress(); }}
      style={{ flex: 1, alignItems: 'center', paddingVertical: Spacing.md, borderRadius: Radius.md, backgroundColor: bg }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{ color: textColor, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 11, marginTop: 6 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ShareResultScreen({ navigation, route }) {
  const { colors } = useTheme();
  const mock = MOCK_TESTS.find((m) => m.id === route.params?.mockId) || MOCK_TESTS.find((m) => m.completed);
  const s = mock.subjectScores;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg }}>
        <Txt variant="h2">Share your result</Txt>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={{ color: colors.textSecondary, fontSize: 24 }}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        {/* Shareable preview card */}
        <LinearGradient
          colors={['#0D2818', '#0D0D0D']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: Radius.lg, padding: Spacing.xl, borderWidth: 1, borderColor: colors.greenBorder }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#0D0D0D', fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 18 }}>S</Text>
            </View>
            <Text style={{ color: '#1DB954', fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 16, marginLeft: 8 }}>scolrly</Text>
          </View>

          <Text style={{ color: '#9A9A9A', fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 9, letterSpacing: 1.2 }}>MY NEET MOCK RESULT</Text>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 46, letterSpacing: -2, marginTop: Spacing.sm }}>
            {mock.score} <Text style={{ color: '#6B6B6B', fontSize: 22 }}>/ {mock.totalMarks}</Text>
          </Text>
          <Text style={{ color: '#1DB954', fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 18, marginTop: 4 }}>AIR {mock.rank.toLocaleString('en-IN')}</Text>

          <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl }}>
            {[{ n: 'BIO', v: s.biology }, { n: 'PHY', v: s.physics }, { n: 'CHEM', v: s.chemistry }].map((x) => (
              <View key={x.n} style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 18 }}>{x.v}</Text>
                <Text style={{ color: '#6B6B6B', fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 9, letterSpacing: 1, marginTop: 2 }}>{x.n}</Text>
              </View>
            ))}
          </View>

          <Text style={{ color: '#1DB954', fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 11, marginTop: Spacing.xl }}>Studied with Scolrly</Text>
        </LinearGradient>

        {/* Share buttons */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl }}>
          <ShareBtn label="WhatsApp" emoji="💬" bg={colors.green} textColor="#0D0D0D" />
          <ShareBtn label="Instagram" emoji="📸" bg="#E1306C" textColor="#FFFFFF" />
          <ShareBtn label="Copy link" emoji="🔗" bg={colors.bgCard} textColor={colors.textSecondary} />
          <ShareBtn label="Download" emoji="⬇️" bg={colors.bgCard} textColor={colors.textSecondary} />
        </View>
      </ScrollView>
    </Screen>
  );
}
