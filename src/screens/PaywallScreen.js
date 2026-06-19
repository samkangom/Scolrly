import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, Btn, Badge, Divider } from '../components/common';
import { PLANS } from '../data';

export default function PaywallScreen({ navigation }) {
  const { colors } = useTheme();
  const [yearly, setYearly] = useState(false);

  const visiblePlans = yearly
    ? PLANS.filter((p) => p.id !== 'pro_monthly')
    : PLANS.filter((p) => p.id !== 'pro_yearly');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 120 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }}>
          <Text style={[Typography.body, { color: colors.green }]}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.xs }]}>Upgrade to Pro</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.xl }]}>Unlock AI-powered diagnostics and unlimited practice.</Text>

        {/* Toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.card, borderRadius: Radius.pill, padding: 4, marginBottom: Spacing.xl, borderWidth: 1, borderColor: colors.border }}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setYearly(false)} style={{ flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: !yearly ? colors.green : 'transparent', alignItems: 'center' }}>
            <Text style={[Typography.caption, { color: !yearly ? '#FFFFFF' : colors.textSecondary, fontWeight: '700' }]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setYearly(true)} style={{ flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: yearly ? colors.green : 'transparent', alignItems: 'center' }}>
            <Text style={[Typography.caption, { color: yearly ? '#FFFFFF' : colors.textSecondary, fontWeight: '700' }]}>Yearly (Save 33%)</Text>
          </TouchableOpacity>
        </View>

        {/* Plan Cards */}
        {visiblePlans.map((plan) => (
          <Card key={plan.id} style={{ marginBottom: Spacing.base, borderColor: plan.popular ? colors.green : colors.border, borderWidth: plan.popular ? 2 : 1 }}>
            {plan.popular && <Badge label="POPULAR" color={colors.green} style={{ marginBottom: Spacing.sm }} />}
            <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: Spacing.xs }]}>{plan.name}</Text>
            {plan.price > 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.md }}>
                <Text style={[{ fontSize: 32, fontWeight: '800', color: colors.green }]}>&#8377;{plan.price}</Text>
                {plan.period && <Text style={[Typography.body, { color: colors.textMuted, marginLeft: Spacing.xs }]}>/{plan.period}</Text>}
              </View>
            ) : (
              <Text style={[Typography.h2, { color: colors.textMuted, marginBottom: Spacing.md }]}>Free</Text>
            )}
            {plan.features.map((f, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Text style={{ color: colors.green, marginRight: Spacing.sm, fontSize: 14 }}>&#10003;</Text>
                <Text style={[Typography.body, { color: colors.textSecondary }]}>{f}</Text>
              </View>
            ))}
            {plan.limitations && plan.limitations.map((l, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Text style={{ color: colors.textMuted, marginRight: Spacing.sm, fontSize: 14 }}>&#10007;</Text>
                <Text style={[Typography.body, { color: colors.textMuted }]}>{l}</Text>
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, padding: Spacing.base }}>
        <Btn title="Start 7-day free trial" onPress={() => {}} />
        <Text style={[Typography.small, { color: colors.textMuted, textAlign: 'center', marginTop: Spacing.sm }]}>Cancel anytime. No questions asked.</Text>
      </View>
    </SafeAreaView>
  );
}
