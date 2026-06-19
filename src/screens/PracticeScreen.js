import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, ProgressBar, Badge, StatusDot } from '../components/common';
import { SUBJECTS } from '../data';
import { useChapters } from '../hooks/useChapters';

const STATUS_COLORS = { fix: '#FF6B35', revise: '#A855F7', strong: '#1DB954' };

export default function PracticeScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeSubject, setActiveSubject] = useState('bio');
  const { chapters } = useChapters(activeSubject);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: Spacing.base, paddingBottom: 0 }}>
        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.base }]}>Practice</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.base }}>
          {SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.85}
              onPress={() => setActiveSubject(s.id)}
              style={{
                paddingHorizontal: Spacing.base,
                paddingVertical: Spacing.sm,
                borderRadius: Radius.pill,
                backgroundColor: activeSubject === s.id ? s.color : colors.card,
                marginRight: Spacing.sm,
                borderWidth: 1,
                borderColor: activeSubject === s.id ? s.color : colors.border,
              }}
            >
              <Text style={[Typography.caption, { color: activeSubject === s.id ? '#FFFFFF' : colors.textSecondary, fontWeight: '700' }]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingTop: 0, paddingBottom: 40 }}>
        {chapters.map((ch) => (
          <TouchableOpacity
            key={ch.id}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ChapterDetail', { chapterId: ch.id })}
          >
            <Card style={{ marginBottom: Spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                <StatusDot color={STATUS_COLORS[ch.status]} style={{ marginRight: Spacing.sm }} />
                <Text style={[Typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>{ch.name}</Text>
                <Text style={[Typography.caption, { color: STATUS_COLORS[ch.status], fontWeight: '700' }]}>{ch.accuracy}%</Text>
              </View>
              <ProgressBar percent={ch.accuracy} style={{ marginBottom: Spacing.sm }} />
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <Badge label={`${ch.pyqCount} PYQs`} color={colors.blue} />
                <Badge label={`${ch.totalQuestions} Qs`} color={colors.textMuted} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
