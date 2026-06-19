import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing } from '../theme';
import { Card, SectionHeader, Btn, Avatar, Badge, Divider } from '../components/common';
import { STUDY_ROOMS, LEADERBOARD } from '../data';

export default function ActiveRoomScreen({ route, navigation }) {
  const { colors } = useTheme();
  const roomId = route.params?.roomId || 1;
  const room = STUDY_ROOMS.find((r) => r.id === roomId) || STUDY_ROOMS[0];

  const [timeLeft, setTimeLeft] = useState(room.timeRemaining || 2820);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const members = LEADERBOARD.slice(0, room.members > 5 ? 5 : room.members || 3).map((l) => ({
    ...l,
    chapter: room.chapter,
    status: Math.random() > 0.3 ? 'active' : 'idle',
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base }}>
        <View style={{ flex: 1 }}>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>{room.name}</Text>
          <Text style={[Typography.small, { color: colors.textMuted }]}>{room.members} members</Text>
        </View>
        <Btn title="Leave" variant="outline" onPress={() => navigation.goBack()} style={{ paddingVertical: Spacing.xs, paddingHorizontal: Spacing.base, borderColor: colors.orange }} textStyle={{ color: colors.orange }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingTop: 0, paddingBottom: 40 }}>
        {/* Timer */}
        <Card style={{ alignItems: 'center', marginBottom: Spacing.xl, paddingVertical: Spacing.xl }}>
          <Text style={[Typography.eyebrow, { color: colors.green, marginBottom: Spacing.sm }]}>TIME REMAINING</Text>
          <Text style={[{ fontSize: 52, fontWeight: '800', color: colors.textPrimary, fontVariant: ['tabular-nums'] }]}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </Text>
          <Text style={[Typography.caption, { color: colors.textMuted, marginTop: Spacing.xs }]}>{room.chapter}</Text>
        </Card>

        {/* Members */}
        <SectionHeader eyebrow="MEMBERS" title="Study Group" />
        <Card style={{ marginBottom: Spacing.xl }}>
          {members.map((m, i) => (
            <View key={m.rank}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm }}>
                <Avatar name={m.name} size={36} style={{ marginRight: Spacing.md }} />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{m.name}</Text>
                  <Text style={[Typography.small, { color: colors.textMuted }]}>{m.chapter}</Text>
                </View>
                <Badge label={m.status === 'active' ? 'Active' : 'Idle'} color={m.status === 'active' ? colors.green : colors.textMuted} />
              </View>
              {i < members.length - 1 && <Divider style={{ marginVertical: 0 }} />}
            </View>
          ))}
        </Card>

        {/* Leaderboard */}
        <SectionHeader eyebrow="ROOM" title="Leaderboard" />
        <Card>
          {members.map((m, i) => (
            <View key={m.rank} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm }}>
              <Text style={[Typography.bodyBold, { color: i < 3 ? colors.yellow : colors.textMuted, width: 30 }]}>#{i + 1}</Text>
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>{m.name}</Text>
              <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{m.score}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
