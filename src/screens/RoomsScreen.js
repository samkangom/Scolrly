import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useTheme } from '../theme';
import { Spacing, Radius } from '../theme/tokens';
import {
  Screen, Txt, Eyebrow, Card, GreenCard, SectionHeader, RoomCard, LeaderboardRow, IconBox, EmptyState,
} from '../components/common';
import { STUDY_ROOMS, LEADERBOARD } from '../data';
import { Haptic } from '../utils/haptics';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { useApp } from '../context/AppContext';

export default function RoomsScreen({ navigation }) {
  const { colors } = useTheme();
  const { online } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const { data: roomData, refresh: refreshRooms } =
    useApi('/api/rooms', { rooms: STUDY_ROOMS }, [online]);
  const { data: lbData, refresh: refreshLb } =
    useApi('/api/leaderboard', { leaderboard: LEADERBOARD }, [online]);
  const rooms = roomData.rooms;
  const leaderboard = lbData.leaderboard;
  const live = rooms.filter((r) => r.status === 'live');
  const scheduled = rooms.filter((r) => r.status === 'scheduled');

  const onRefresh = useCallback(() => {
    setRefreshing(true); Haptic.light();
    Promise.all([refreshRooms(), refreshLb()])
      .finally(() => setTimeout(() => setRefreshing(false), 400));
  }, [refreshRooms, refreshLb]);

  const open = (room) => {
    api.post(`/api/rooms/${room.id}/join`); // membership sync, fire-and-forget
    navigation.navigate('ActiveRoom', { roomId: room.id });
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        <Txt variant="h1">Study Rooms</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>Study with others. Stay accountable.</Txt>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.greenGlow, alignSelf: 'flex-start', borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 6, marginTop: Spacing.md }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, marginRight: 8 }} />
          <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 12 }}>284 students online now</Text>
        </View>

        {/* Solo focus */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => { Haptic.light(); open(STUDY_ROOMS[0]); }} style={{ marginTop: Spacing.lg }}>
          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconBox color="green"><Text style={{ fontSize: 20 }}>🎯</Text></IconBox>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Txt variant="h4">Solo deep focus</Txt>
              <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>No distractions · pomodoro timer</Txt>
            </View>
            <Text style={{ color: colors.green, fontFamily: 'Inter_700Bold', fontWeight: '700' }}>Start →</Text>
          </Card>
        </TouchableOpacity>

        {/* Live rooms */}
        <SectionHeader title="Live rooms" style={{ marginTop: Spacing.xl }} />
        {live.length === 0 ? (
          <EmptyState emoji="🌙" title="No live rooms right now" subtitle="Check back soon." />
        ) : (
          <View style={{ gap: Spacing.md }}>
            {live.map((r) => (
              <RoomCard key={r.id} room={r} onJoin={() => open(r)} onPress={() => open(r)} />
            ))}
          </View>
        )}

        {/* Coming up */}
        <SectionHeader title="Coming up" style={{ marginTop: Spacing.xl }} />
        <View style={{ gap: Spacing.md }}>
          {scheduled.map((r) => (
            <RoomCard key={r.id} room={r} onJoin={() => open(r)} onPress={() => open(r)} />
          ))}
        </View>

        {/* Leaderboard */}
        <SectionHeader title="Your cohort — this week" style={{ marginTop: Spacing.xl }} />
        <Card style={{ padding: Spacing.sm }}>
          {leaderboard.map((e) => <LeaderboardRow key={e.rank} entry={e} />)}
        </Card>
      </ScrollView>
    </Screen>
  );
}
