import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, Avatar, Badge, LiveBadge, StatusDot,
  SectionHeader, LeaderboardRow,
} from '../components/common';
import { STUDY_ROOMS, LEADERBOARD, USER } from '../data';
import { Haptic } from '../utils/haptics';

function useSessionTimer(start = 47 * 60 + 23) {
  const [secs, setSecs] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ActiveRoomScreen({ navigation, route }) {
  const { colors } = useTheme();
  const roomId = route.params?.roomId;
  const room = STUDY_ROOMS.find((r) => r.id === roomId) || STUDY_ROOMS[0];
  const timer = useSessionTimer();

  const members = [
    { initials: USER.initials, color: 'green', name: 'You', chapter: 'Human Physiology', status: 'studying', you: true },
    ...room.members,
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={{ color: colors.green, fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Txt variant="h4" numberOfLines={1}>{room.title}</Txt>
            <LiveBadge style={{ marginTop: 4 }} />
          </View>
          <TouchableOpacity onPress={() => { Haptic.medium(); navigation.goBack(); }}
            style={{ backgroundColor: colors.orangeGlow, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 6, borderWidth: 1, borderColor: colors.orange + '40' }}>
            <Text style={{ color: colors.orange, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 12 }}>Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Session timer */}
        <GreenCard style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Eyebrow label="YOUR SESSION" />
            <Txt variant="h3" style={{ marginTop: 4 }}>Deep Focus</Txt>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 36, letterSpacing: -1 }}>{timer}</Text>
            <Txt variant="caption" color={colors.textMuted}>remaining</Txt>
          </View>
        </GreenCard>

        {/* Members */}
        <SectionHeader title={`Studying now · ${room.totalMembers}`} style={{ marginTop: Spacing.xl }} />
        <Card style={{ padding: Spacing.sm }}>
          {members.map((m, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm }}>
              <Avatar initials={m.you ? 'YOU' : m.initials} color={m.color} size={36} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Txt variant="h5">{m.name}</Txt>
                <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>{m.chapter}</Txt>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <StatusDot status={m.status} />
                <Txt variant="caption" color={m.status === 'break' ? colors.yellow : colors.green} style={{ textTransform: 'capitalize' }}>{m.status}</Txt>
              </View>
            </View>
          ))}
        </Card>

        {/* Cohort leaderboard */}
        <SectionHeader title="Cohort leaderboard" style={{ marginTop: Spacing.xl }} />
        <Card style={{ padding: Spacing.sm }}>
          {LEADERBOARD.map((e) => <LeaderboardRow key={e.rank} entry={e} />)}
        </Card>
      </ScrollView>
    </Screen>
  );
}
