import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing } from '../theme';
import { Card, SectionHeader, Btn, Badge, Avatar, Divider } from '../components/common';
import { STUDY_ROOMS, LEADERBOARD } from '../data';

export default function RoomsScreen({ navigation }) {
  const { colors } = useTheme();
  const liveRooms = STUDY_ROOMS.filter((r) => r.status === 'live');
  const upcoming = STUDY_ROOMS.filter((r) => r.status === 'scheduled');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>Study Rooms</Text>

        {/* Live Rooms */}
        <SectionHeader eyebrow="LIVE NOW" title="Active Rooms" />
        {liveRooms.map((room) => (
          <TouchableOpacity key={room.id} activeOpacity={0.85} onPress={() => navigation.navigate('ActiveRoom', { roomId: room.id })}>
            <Card style={{ marginBottom: Spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: Spacing.sm }} />
                  <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{room.name}</Text>
                </View>
                <Badge label="LIVE" color={colors.green} />
              </View>
              <Text style={[Typography.small, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
                {room.chapter} · Hosted by {room.host}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[Typography.caption, { color: colors.textMuted }]}>{room.members}/{room.maxMembers} members</Text>
                <Btn title="Join" onPress={() => navigation.navigate('ActiveRoom', { roomId: room.id })} style={{ paddingVertical: Spacing.xs, paddingHorizontal: Spacing.base }} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Upcoming */}
        <SectionHeader eyebrow="UPCOMING" title="Scheduled Rooms" style={{ marginTop: Spacing.lg }} />
        {upcoming.map((room) => (
          <Card key={room.id} style={{ marginBottom: Spacing.sm }}>
            <Text style={[Typography.bodyBold, { color: colors.textPrimary, marginBottom: Spacing.xs }]}>{room.name}</Text>
            <Text style={[Typography.small, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
              {room.chapter} · Hosted by {room.host}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[Typography.caption, { color: colors.textMuted }]}>Max {room.maxMembers} members</Text>
              <Badge label="Scheduled" color={colors.purple} />
            </View>
          </Card>
        ))}

        {/* Leaderboard */}
        <SectionHeader eyebrow="WEEKLY" title="Leaderboard" style={{ marginTop: Spacing.lg }} />
        <Card>
          {LEADERBOARD.map((entry, i) => (
            <View key={entry.rank}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm }}>
                <Text style={[Typography.bodyBold, { color: entry.rank <= 3 ? colors.yellow : colors.textMuted, width: 30 }]}>#{entry.rank}</Text>
                <Avatar name={entry.name} size={32} style={{ marginRight: Spacing.md }} />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.body, { color: entry.isUser ? colors.green : colors.textPrimary, fontWeight: entry.isUser ? '700' : '400' }]}>{entry.name}{entry.isUser ? ' (You)' : ''}</Text>
                </View>
                <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{entry.score}</Text>
              </View>
              {i < LEADERBOARD.length - 1 && <Divider style={{ marginVertical: 0 }} />}
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
