import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing } from '../theme';
import { Card, Btn, SectionHeader, Badge } from '../components/common';
import { MOCK_TESTS } from '../data';

export default function MockScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>Mock Tests</Text>

        {/* Start CTA */}
        <Card style={{ marginBottom: Spacing.xl, backgroundColor: colors.green + '12', borderColor: colors.greenBorder, alignItems: 'center', paddingVertical: Spacing.xl }}>
          <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: Spacing.xs }]}>Ready for a Full Mock?</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.lg, textAlign: 'center' }]}>
            200 questions, 200 minutes{'\n'}Physics + Chemistry + Biology
          </Text>
          <Btn title="Start Mock Test" onPress={() => {}} style={{ paddingHorizontal: Spacing.xxl }} />
        </Card>

        {/* Past Results */}
        <SectionHeader eyebrow="PAST RESULTS" title="Your Mock History" />
        {MOCK_TESTS.map((mock) => (
          <TouchableOpacity
            key={mock.id}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MockResult', { mockId: mock.id })}
          >
            <Card style={{ marginBottom: Spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{mock.name}</Text>
                <Text style={[Typography.small, { color: colors.textMuted }]}>{mock.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[Typography.h2, { color: colors.textPrimary }]}>
                  {mock.score}<Text style={[Typography.caption, { color: colors.textMuted }]}>/{mock.total}</Text>
                </Text>
                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                  <Badge label={`Rank #${mock.rank}`} color={colors.blue} />
                  <Badge label={`${mock.percentile}%ile`} color={colors.green} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
