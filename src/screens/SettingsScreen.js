import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, Avatar, Btn, Divider, Badge } from '../components/common';
import { USER } from '../data';

export default function SettingsScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }}>
          <Text style={[Typography.body, { color: colors.green }]}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>Settings</Text>

        {/* Profile Card */}
        <Card style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl }}>
          <Avatar name={USER.name} size={56} style={{ marginRight: Spacing.base }} />
          <View style={{ flex: 1 }}>
            <Text style={[Typography.h3, { color: colors.textPrimary }]}>{USER.name}</Text>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>{USER.class} · {USER.coaching}</Text>
          </View>
        </Card>

        {/* Settings Items */}
        <Card style={{ marginBottom: Spacing.base }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm }}>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border, true: colors.green }} thumbColor="#FFFFFF" />
          </View>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm }}>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>Exam Date</Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>{USER.examDate}</Text>
          </View>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm }}>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.border, true: colors.green }} thumbColor="#FFFFFF" />
          </View>
        </Card>

        {/* Subscription */}
        <Card style={{ marginBottom: Spacing.base }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>Subscription</Text>
            <Badge label={USER.subscription.toUpperCase()} color={USER.subscription === 'free' ? colors.textMuted : colors.green} />
          </View>
          <Btn title="Upgrade to Pro" onPress={() => navigation.navigate('Paywall')} variant="outline" />
        </Card>

        {/* Logout */}
        <Btn title="Logout" variant="ghost" onPress={() => {}} textStyle={{ color: colors.orange }} style={{ marginTop: Spacing.lg }} />

        <Text style={[Typography.small, { color: colors.textMuted, textAlign: 'center', marginTop: Spacing.xl }]}>Scolrly v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
