import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Btn, Badge,
} from '../components/common';
import { PLANS } from '../data';
import { Haptic } from '../utils/haptics';

function PlanCard({ plan, onSelect }) {
  const { colors } = useTheme();
  const isPro = plan.popular;
  const Wrapper = isPro ? GreenCard : Card;
  return (
    <Wrapper style={{ marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt variant="h4">{plan.name}</Txt>
        {plan.popular ? <Badge label="POPULAR" color="green" /> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: Spacing.sm }}>
        <Text style={{ color: colors.textPrimary, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 30, letterSpacing: -1 }}>{plan.price}</Text>
        {plan.period ? <Txt variant="body" color={colors.textMuted} style={{ marginLeft: 4 }}>{plan.period}</Txt> : null}
      </View>
      {plan.saving ? <Badge label={plan.saving} color="green" style={{ marginTop: Spacing.sm }} /> : null}

      <View style={{ marginTop: Spacing.md, gap: 8 }}>
        {plan.features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: colors.green, marginRight: 8, fontFamily: 'Inter_800ExtraBold', fontWeight: '800' }}>✓</Text>
            <Txt variant="body" color={colors.textSecondary} style={{ flex: 1 }}>{f}</Txt>
          </View>
        ))}
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Btn label={plan.cta} variant={plan.id === 'free' ? 'ghost' : plan.id === 'pro_yearly' ? 'outline' : 'primary'} onPress={onSelect} />
      </View>
    </Wrapper>
  );
}

export default function PaywallScreen({ navigation }) {
  const { colors } = useTheme();
  const [billing, setBilling] = useState('yearly');

  // Show Free + the selected paid tier emphasised; keep all three visible.
  const ordered = billing === 'yearly'
    ? [PLANS[2], PLANS[1], PLANS[0]]
    : [PLANS[1], PLANS[2], PLANS[0]];

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={{ color: colors.textSecondary, fontSize: 24 }}>×</Text>
        </TouchableOpacity>
        <Txt variant="h2">Choose your plan</Txt>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <Txt variant="body" color={colors.green} style={{ textAlign: 'center', marginBottom: Spacing.lg }}>
          7-day free trial on all Pro plans
        </Txt>

        {/* Monthly / Yearly toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.bgCard, borderRadius: Radius.pill, padding: 4, marginBottom: Spacing.xl }}>
          {[{ id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly' }].map((b) => {
            const on = billing === b.id;
            return (
              <TouchableOpacity key={b.id} activeOpacity={0.85} onPress={() => { Haptic.light(); setBilling(b.id); }}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: on ? colors.green : 'transparent' }}>
                <Text style={{ color: on ? '#0D0D0D' : colors.textSecondary, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 14 }}>{b.label}</Text>
                {b.id === 'yearly' ? (
                  <View style={{ marginLeft: 6, backgroundColor: on ? '#0D0D0D' : colors.greenGlow, borderRadius: Radius.pill, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: on ? colors.green : colors.green, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 9 }}>Save 44%</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {ordered.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={() => { Haptic.success(); navigation.goBack(); }} />
        ))}

        <Txt variant="bodySmall" color={colors.textMuted} style={{ textAlign: 'center', marginTop: Spacing.md }}>
          No charge during trial. Cancel anytime.
        </Txt>
        <TouchableOpacity style={{ alignItems: 'center', marginTop: Spacing.sm }}>
          <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>Restore purchase</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
