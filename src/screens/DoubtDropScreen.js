import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, Btn, SectionHeader } from '../components/common';

const AI_RESPONSES = [
  'Great question! The key difference lies in the mechanism of action. Pepsin works in acidic pH (1.5-2.5) while trypsin works in alkaline pH (7.5-8.5). This is because the active site of each enzyme is optimized for its respective environment.',
  'Let me break this down step by step. According to Molecular Orbital Theory, when two atomic orbitals combine, they form two molecular orbitals - one bonding (lower energy) and one antibonding (higher energy). The bond order determines stability.',
  'This is a commonly tested concept in NEET! Remember the key formula: F = kq1q2/r2. The force is inversely proportional to the square of the distance. When distance doubles, force becomes 1/4th.',
];

export default function DoubtDropScreen({ navigation }) {
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setHistory((prev) => [
        { id: Date.now(), question, answer: AI_RESPONSES[prev.length % AI_RESPONSES.length] },
        ...prev,
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: Spacing.base, paddingBottom: 0 }}>
        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.base }]}>Doubt Drop</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingTop: 0, paddingBottom: 40, flexGrow: 1 }}>
        {loading && (
          <Card style={{ marginBottom: Spacing.base, alignItems: 'center', paddingVertical: Spacing.xl }}>
            <ActivityIndicator color={colors.green} size="large" />
            <Text style={[Typography.caption, { color: colors.textMuted, marginTop: Spacing.sm }]}>AI is thinking...</Text>
          </Card>
        )}

        {history.length === 0 && !loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xxl * 2 }}>
            <Text style={[{ fontSize: 48, marginBottom: Spacing.base }]}>&#129300;</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' }]}>Drop your doubt</Text>
            <Text style={[Typography.body, { color: colors.textMuted, textAlign: 'center' }]}>Ask any NEET-related question and get an instant AI-powered explanation.</Text>
          </View>
        )}

        {history.map((item) => (
          <View key={item.id} style={{ marginBottom: Spacing.lg }}>
            <Card style={{ backgroundColor: colors.green + '12', borderColor: colors.greenBorder, marginBottom: Spacing.sm }}>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{item.question}</Text>
            </Card>
            <Card>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>{item.answer}</Text>
            </Card>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={{ padding: Spacing.base, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <TextInput
            placeholder="Type your doubt..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            style={[Typography.body, { flex: 1, backgroundColor: colors.card, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border }]}
            multiline
          />
          <Btn title="Send" onPress={handleSubmit} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-end' }} />
        </View>
      </View>
    </SafeAreaView>
  );
}
