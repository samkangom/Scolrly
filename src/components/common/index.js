import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Typography, Spacing, Radius } from '../../theme/tokens';

export function Btn({ title, onPress, variant, style, textStyle, disabled }) {
  const { colors } = useTheme();
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.xl,
          borderRadius: Radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
        },
        !isOutline && !isGhost && { backgroundColor: colors.green },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.green },
        isGhost && { backgroundColor: 'transparent' },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[
          Typography.bodyBold,
          {
            color: isOutline || isGhost ? colors.green : '#FFFFFF',
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Card({ children, style }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: Radius.md,
          padding: Spacing.base,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Badge({ label, color, style }) {
  const { colors } = useTheme();
  const badgeColor = color || colors.green;
  return (
    <View
      style={[
        {
          backgroundColor: badgeColor + '14',
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
          borderRadius: Radius.pill,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={[Typography.small, { color: badgeColor, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ percent, color, style }) {
  const { colors } = useTheme();
  let barColor = color;
  if (!barColor) {
    if (percent >= 75) barColor = colors.green;
    else if (percent >= 55) barColor = colors.purple;
    else barColor = colors.orange;
  }
  return (
    <View
      style={[
        {
          height: 4,
          backgroundColor: colors.border,
          borderRadius: 2,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, percent))}%`,
          backgroundColor: barColor,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

export function Avatar({ name, size = 40, style }) {
  const { colors } = useTheme();
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.green,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: size * 0.4 }}>{initials}</Text>
    </View>
  );
}

export function SectionHeader({ eyebrow, title, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ marginBottom: Spacing.md }, style]}>
      {eyebrow && (
        <Text style={[Typography.eyebrow, { color: colors.green, marginBottom: Spacing.xs }]}>
          {eyebrow}
        </Text>
      )}
      <Text style={[Typography.h2, { color: colors.textPrimary }]}>{title}</Text>
    </View>
  );
}

export function Eyebrow({ text, style }) {
  const { colors } = useTheme();
  return (
    <Text style={[Typography.eyebrow, { color: colors.green }, style]}>{text}</Text>
  );
}

export function StatusDot({ color, style }) {
  return (
    <View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export function Divider({ style }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginVertical: Spacing.md,
        },
        style,
      ]}
    />
  );
}
