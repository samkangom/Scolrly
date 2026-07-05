import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Typography, Spacing, Radius } from '../../theme/tokens';
import { Haptic } from '../../utils/haptics';

// Consistent page frame: safe-area + themed background.
export function Screen({ children, style, edges = ['top'] }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: colors.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

// Maps a subject colorKey (or status) to a live theme color.
export function useColorFor() {
  const { colors } = useTheme();
  return (key) => {
    switch (key) {
      case 'green': return colors.green;
      case 'orange': return colors.orange;
      case 'purple': return colors.purple;
      case 'blue': return colors.blue;
      case 'yellow': return colors.yellow;
      case 'biology': return colors.green;
      case 'physics': return colors.blue;
      case 'chemistry': return colors.purple;
      case 'fix': return colors.orange;
      case 'revise': return colors.purple;
      case 'strong': return colors.green;
      default: return key || colors.green;
    }
  };
}

// ── Typography ──────────────────────────────────────────────────────────────
export function Txt({ variant = 'body', color, style, children, numberOfLines, ...rest }) {
  const { colors } = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[Typography[variant] || Typography.body, { color: color || colors.textPrimary }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Eyebrow({ label, color, style }) {
  const { colors } = useTheme();
  return <Text style={[Typography.eyebrow, { color: color || colors.green }, style]}>{label}</Text>;
}

// ── Layout ──────────────────────────────────────────────────────────────────
export function Card({ children, onPress, elevated = true, style }) {
  const { colors } = useTheme();
  const base = [
    {
      backgroundColor: colors.bgCard,
      borderRadius: Radius.md,
      padding: Spacing.lg,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    elevated && {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    style,
  ];
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => { Haptic.light(); onPress(); }} style={base}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={base}>{children}</View>;
}

export function GreenCard({ children, onPress, style }) {
  const { colors } = useTheme();
  const base = [
    {
      backgroundColor: colors.greenGlow,
      borderRadius: Radius.md,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.greenBorder,
    },
    style,
  ];
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => { Haptic.light(); onPress(); }} style={base}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={base}>{children}</View>;
}

export function Divider({ style }) {
  const { colors } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: Spacing.md }, style]} />;
}

export function SectionHeader({ title, action, onAction, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md, marginTop: Spacing.sm }, style]}>
      <Txt variant="h3">{title}</Txt>
      {action ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[Typography.h5, { color: colors.green }]}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── Buttons ─────────────────────────────────────────────────────────────────
export function Btn({ label, onPress, variant = 'primary', style, disabled }) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  let bg = 'transparent';
  let textColor = colors.green;
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (isPrimary) { bg = colors.green; textColor = '#0D0D0D'; }
  else if (isOutline) { borderColor = colors.green; borderWidth = 1.5; textColor = colors.green; }
  else if (isGhost) { textColor = colors.textMuted; }
  else if (isDanger) { bg = colors.orangeGlow; textColor = colors.orange; borderColor = colors.orange + '40'; borderWidth = 1; }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={() => { if (!disabled) { Haptic.light(); onPress && onPress(); } }}
      style={[
        {
          paddingVertical: 13,
          paddingHorizontal: Spacing.xl,
          borderRadius: Radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderColor,
          borderWidth,
        },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 15 }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Form / Input ─────────────────────────────────────────────────────────────
export function SearchInput({ value, onChangeText, placeholder, onClear, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard,
      borderRadius: Radius.md, borderWidth: 0.5, borderColor: colors.border,
      paddingHorizontal: Spacing.md, height: 44,
    }, style]}>
      <Text style={{ fontSize: 16, marginRight: Spacing.sm, color: colors.textMuted }}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[Typography.body, { flex: 1, color: colors.textPrimary, paddingVertical: 0 }]}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <Text style={{ color: colors.textMuted, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function OptionSelector({ options, selected, onSelect, label, multi = false }) {
  const { colors } = useTheme();
  const isSelected = (opt) => (multi ? selected?.includes(opt) : selected === opt);
  return (
    <View>
      {label ? <Eyebrow label={label} style={{ marginBottom: Spacing.sm }} /> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {options.map((opt) => {
          const on = isSelected(opt);
          return (
            <TouchableOpacity
              key={opt}
              activeOpacity={0.8}
              onPress={() => { Haptic.light(); onSelect(opt); }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: Spacing.lg,
                borderRadius: Radius.pill,
                backgroundColor: on ? colors.green : colors.bgCard2,
                borderWidth: on ? 0 : 0.5,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: on ? '#0D0D0D' : colors.textSecondary, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function ToggleSwitch({ value, onToggle, label }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md }}>
      {label ? <Txt variant="h5" color={colors.textPrimary}>{label}</Txt> : <View />}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { Haptic.light(); onToggle(!value); }}
        style={{
          width: 48, height: 28, borderRadius: 14, padding: 3,
          backgroundColor: value ? colors.green : colors.bgCard2,
          justifyContent: 'center',
        }}
      >
        <View style={{
          width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF',
          alignSelf: value ? 'flex-end' : 'flex-start',
        }} />
      </TouchableOpacity>
    </View>
  );
}

// ── Data display ─────────────────────────────────────────────────────────────
export function ProgressBar({ value = 0, color, height = 5, style }) {
  const { colors } = useTheme();
  let barColor = color;
  if (!barColor) {
    if (value >= 75) barColor = colors.green;
    else if (value >= 55) barColor = colors.purple;
    else barColor = colors.orange;
  }
  return (
    <View style={[{ height, backgroundColor: colors.bgCard2, borderRadius: height, overflow: 'hidden' }, style]}>
      <View style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: barColor, borderRadius: height }} />
    </View>
  );
}

export function Avatar({ initials, color, size = 40, style }) {
  const { colors } = useTheme();
  const c = useColorFor()(color || 'green');
  return (
    <View style={[{
      width: size, height: size, borderRadius: size / 2, backgroundColor: c,
      alignItems: 'center', justifyContent: 'center',
    }, style]}>
      <Text style={{ color: '#0D0D0D', fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: size * 0.38 }}>
        {initials}
      </Text>
    </View>
  );
}

export function Badge({ label, color, style }) {
  const { colors } = useTheme();
  const c = useColorFor()(color || 'green');
  return (
    <View style={[{
      backgroundColor: c + '20', paddingHorizontal: Spacing.sm, paddingVertical: 3,
      borderRadius: Radius.pill, alignSelf: 'flex-start',
    }, style]}>
      <Text style={[Typography.label, { color: c }]}>{label}</Text>
    </View>
  );
}

export function LiveBadge({ style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.greenGlow, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.pill, alignSelf: 'flex-start' }, style]}>
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green, marginRight: 5 }} />
      <Text style={[Typography.label, { color: colors.green }]}>LIVE</Text>
    </View>
  );
}

const STATUS_META = {
  fix: { label: 'Fix', key: 'orange' },
  revise: { label: 'Revise', key: 'purple' },
  strong: { label: 'Strong', key: 'green' },
  studying: { label: 'Studying', key: 'green' },
  break: { label: 'Break', key: 'yellow' },
};

export function StatusDot({ status, size = 8, style }) {
  const c = useColorFor()(STATUS_META[status]?.key || status);
  return <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: c }, style]} />;
}

export function ChapterBadge({ status, style }) {
  const meta = STATUS_META[status] || STATUS_META.strong;
  return <Badge label={meta.label} color={meta.key} style={style} />;
}

export function IconBox({ color = 'green', size = 44, children, style }) {
  const { colors } = useTheme();
  const c = useColorFor()(color);
  return (
    <View style={[{
      width: size, height: size, borderRadius: Radius.md, backgroundColor: c + '20',
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c + '30',
    }, style]}>
      {children}
    </View>
  );
}

// ── Navigation ───────────────────────────────────────────────────────────────
export function StepDots({ total = 5, current = 0, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: Spacing.sm }, style]}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          height: 5, borderRadius: 3, flex: 1,
          backgroundColor: i === current ? colors.green : colors.border,
        }} />
      ))}
    </View>
  );
}

export function BackButton({ onPress, label = 'Back', style }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={8} style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }, style]}>
      <Text style={[Typography.h5, { color: colors.green }]}>← {label}</Text>
    </TouchableOpacity>
  );
}

// ── Compound components ──────────────────────────────────────────────────────
export function ScorePill({ score, max, rank, delta, style }) {
  const { colors } = useTheme();
  return (
    <GreenCard style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, style]}>
      <View>
        <Eyebrow label="EST. NEET SCORE" style={{ marginBottom: 4 }} />
        <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 34, letterSpacing: -1 }}>{score}</Text>
        <Txt variant="caption" color={colors.textMuted}>/ {max}</Txt>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Txt variant="h3">AIR {rank?.toLocaleString('en-IN')}</Txt>
        {delta ? <Txt variant="caption" color={colors.green} style={{ marginTop: 4 }}>{delta}</Txt> : null}
      </View>
    </GreenCard>
  );
}

export function CountdownBox({ value, label, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{
      flex: 1, backgroundColor: colors.bgCard, borderRadius: Radius.md, borderWidth: 0.5,
      borderColor: colors.border, alignItems: 'center', paddingVertical: Spacing.md,
    }, style]}>
      <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 24, letterSpacing: -0.5 }}>{value}</Text>
      <Eyebrow label={label} style={{ marginTop: 2 }} />
    </View>
  );
}

export function MissionCard({ mission, onPress, style }) {
  const { colors } = useTheme();
  const c = useColorFor()(mission.color);
  return (
    <Card onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', padding: Spacing.md }, style]}>
      <StatusDot status={mission.color === 'orange' ? 'fix' : mission.color === 'purple' ? 'revise' : 'strong'} size={10} style={{ marginRight: Spacing.md }} />
      <View style={{ flex: 1 }}>
        <Txt variant="h4">{mission.title}</Txt>
        <Txt variant="bodySmall" color={colors.textMuted} style={{ marginTop: 2 }}>{mission.subtitle}</Txt>
      </View>
      <Text style={{ color: colors.green, fontSize: 20, marginLeft: Spacing.sm }}>›</Text>
    </Card>
  );
}

export function ChapterRow({ chapter, index, onPress, style }) {
  const { colors } = useTheme();
  return (
    <Card onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', padding: Spacing.md }, style]}>
      {index != null ? (
        <Text style={{ color: colors.green, fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 18, width: 26 }}>{index}</Text>
      ) : null}
      <View style={{ flex: 1, marginRight: Spacing.sm }}>
        <Txt variant="h5">{chapter.name}</Txt>
        <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 3, marginBottom: 6 }}>
          Asked {chapter.pyqCount}× · {chapter.accuracy}% accuracy
        </Txt>
        <ProgressBar value={chapter.accuracy} height={4} />
      </View>
      <ChapterBadge status={chapter.status} />
    </Card>
  );
}

export function RoomCard({ room, onJoin, onPress, style }) {
  const { colors } = useTheme();
  const subjColor = useColorFor()(room.subject);
  const featured = room.totalMembers > 20;
  const isLive = room.status === 'live';
  return (
    <Pressable onPress={onPress} style={[{
      backgroundColor: featured ? colors.greenGlow : colors.bgCard,
      borderRadius: Radius.md, padding: Spacing.lg, borderWidth: featured ? 1 : 0.5,
      borderColor: featured ? colors.greenBorder : colors.border,
    }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
        <Badge label={SUBJECT_LABEL(room.subject)} color={room.subject} />
        {isLive ? <LiveBadge /> : <Badge label={`STARTS ${room.scheduledAt}`} color="orange" />}
      </View>
      <Txt variant="h4">{room.title}</Txt>
      <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 3 }}>Hosted by {room.host} · {room.duration} min session</Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, marginBottom: Spacing.md }}>
        <View style={{ flexDirection: 'row' }}>
          {room.members.slice(0, 3).map((m, i) => (
            <Avatar key={i} initials={m.initials} color={m.color} size={26} style={{ marginLeft: i === 0 ? 0 : -8, borderWidth: 2, borderColor: featured ? colors.bg : colors.bgCard }} />
          ))}
        </View>
        <Txt variant="caption" color={colors.green} style={{ marginLeft: Spacing.sm }}>+{room.totalMembers - room.members.length} studying</Txt>
      </View>
      {isLive
        ? <Btn label="Join room" onPress={onJoin} />
        : <Btn label="Remind me" variant="outline" onPress={onJoin} />}
    </Pressable>
  );
}

export function LeaderboardRow({ entry, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{
      flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
      borderRadius: Radius.sm,
      backgroundColor: entry.isYou ? colors.purpleGlow : 'transparent',
    }, style]}>
      <Text style={{ width: 24, color: entry.isYou ? colors.purple : colors.textMuted, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 14 }}>{entry.rank}</Text>
      <Avatar initials={entry.initials} color={entry.color} size={32} style={{ marginRight: Spacing.md }} />
      <View style={{ flex: 1 }}>
        <Txt variant="h5">{entry.name}</Txt>
        <Txt variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>{entry.hoursThisWeek} hrs this week</Txt>
      </View>
      <Txt variant="h4" color={colors.green}>{entry.score}</Txt>
    </View>
  );
}

export function MockCard({ mock, onPress, onStart, style }) {
  const { colors } = useTheme();
  const done = mock.completed;
  return (
    <Card style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
        <Txt variant="h4">{mock.title}</Txt>
        {done ? <Badge label="DONE" color="green" /> : <Badge label="START" color="orange" />}
      </View>
      <Txt variant="caption" color={colors.textMuted}>
        {mock.questions} questions · {mock.duration} min · {mock.totalMarks} marks
      </Txt>
      {done ? (
        <>
          <View style={{ flexDirection: 'row', marginTop: Spacing.md, marginBottom: Spacing.md }}>
            <MiniStat label="SCORE" value={`${mock.score}`} />
            <MiniStat label="AIR" value={`${(mock.rank / 1000).toFixed(0)}K`} />
            <MiniStat label="ACCURACY" value={`${mock.accuracy}%`} />
          </View>
          <Btn label="View result" variant="outline" onPress={onPress} />
        </>
      ) : (
        <View style={{ marginTop: Spacing.md }}>
          <Btn label="Begin mock test" onPress={onStart} />
        </View>
      )}
    </Card>
  );
}

function MiniStat({ label, value }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.green, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 18 }}>{value}</Text>
      <Eyebrow label={label} style={{ marginTop: 2 }} />
    </View>
  );
}

export function ConceptCard({ card, expanded, onPress, bookmarked, onBookmark, style }) {
  const { colors } = useTheme();
  const points = expanded ? card.content : card.content.slice(0, 3);
  return (
    <Card onPress={onPress} style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: Spacing.sm }}>
          <Txt variant="h4">{card.title}</Txt>
          <Badge label={`${card.pyqFreq} PYQ`} color="green" style={{ marginTop: 6 }} />
        </View>
        <TouchableOpacity onPress={onBookmark} hitSlop={8}>
          <Text style={{ fontSize: 18, color: bookmarked ? colors.green : colors.textMuted }}>{bookmarked ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: Spacing.md, gap: 6 }}>
        {points.map((p, i) => (
          <View key={i} style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.green, marginRight: 8 }}>•</Text>
            <Txt variant="body" color={colors.textSecondary} style={{ flex: 1 }}>{p}</Txt>
          </View>
        ))}
      </View>
      {expanded && card.formulae?.length ? (
        <View style={{ marginTop: Spacing.md, backgroundColor: colors.bgCard2, borderRadius: Radius.sm, padding: Spacing.md }}>
          {card.formulae.map((f, i) => (
            <Text key={i} style={[Typography.h5, { color: colors.blue }]}>{f}</Text>
          ))}
        </View>
      ) : null}
      <Divider style={{ marginVertical: Spacing.md }} />
      <Txt variant="caption" color={colors.textMuted}>📖 {card.ncertRef}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.sm }}>
        {card.tags.map((t) => (
          <View key={t} style={{ backgroundColor: colors.bgCard2, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.xs }}>
            <Txt variant="caption" color={colors.textSecondary}>{t}</Txt>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function DoubtCard({ doubt, style }) {
  const { colors } = useTheme();
  return (
    <Card style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
        <Badge label={SUBJECT_LABEL(doubt.subject)} color={doubt.subject} />
        <Txt variant="caption" color={colors.textMuted}>{doubt.date}</Txt>
      </View>
      <Txt variant="h5" numberOfLines={2}>{doubt.question}</Txt>
      <Txt variant="body" color={colors.textSecondary} numberOfLines={2} style={{ marginTop: 6 }}>{doubt.answer}</Txt>
      <Text style={[Typography.h5, { color: colors.green, marginTop: Spacing.sm }]}>See full answer →</Text>
    </Card>
  );
}

export function AchievementBadge({ achievement, style }) {
  const { colors } = useTheme();
  const earned = achievement.earned;
  return (
    <View style={[{ alignItems: 'center', width: 88 }, style]}>
      <View style={{
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: earned ? colors.greenGlow : colors.bgCard2,
        borderWidth: 1, borderColor: earned ? colors.greenBorder : colors.border,
        alignItems: 'center', justifyContent: 'center',
        opacity: earned ? 1 : 0.5,
      }}>
        <Text style={{ fontSize: 26 }}>{earned ? achievement.emoji : '🔒'}</Text>
      </View>
      <Txt variant="caption" color={earned ? colors.textSecondary : colors.textMuted} style={{ marginTop: 6, textAlign: 'center' }}>
        {achievement.title}
      </Txt>
    </View>
  );
}

export function CalendarHeatmap({ data, style }) {
  const { colors } = useTheme();
  const cellColor = (v) => {
    switch (v) {
      case 1: return colors.greenGlow;
      case 2: return colors.orangeGlow;
      case 3: return colors.green;
      default: return colors.bgCard2;
    }
  };
  return (
    <View style={style}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {data.map((week, wi) => (
          <View key={wi} style={{ gap: 4 }}>
            {week.map((cell, di) => (
              <View key={di} style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: cellColor(cell) }} />
            ))}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md }}>
        <LegendDot color={colors.greenGlow} label="Studied" />
        <LegendDot color={colors.orangeGlow} label="Missed" />
        <LegendDot color={colors.green} label="Today" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color, marginRight: 6 }} />
      <Txt variant="caption" color={colors.textMuted}>{label}</Txt>
    </View>
  );
}

// ── Extra helpers used across screens ────────────────────────────────────────
export function SubjectTabs({ subjects, active, onChange, style }) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[{ gap: Spacing.sm }, style]}>
      {subjects.map((s) => {
        const on = active === s.id;
        return (
          <TouchableOpacity
            key={s.id}
            activeOpacity={0.8}
            onPress={() => { Haptic.light(); onChange(s.id); }}
            style={{
              paddingVertical: 8, paddingHorizontal: Spacing.lg, borderRadius: Radius.pill,
              backgroundColor: on ? colors.green : colors.bgCard,
              borderWidth: on ? 0 : 0.5, borderColor: colors.border,
            }}
          >
            <Text style={{ color: on ? '#0D0D0D' : colors.textSecondary, fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 13 }}>{s.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export function SubjectRow({ name, value, max, color, style }) {
  const { colors } = useTheme();
  const c = useColorFor()(color);
  const pct = max ? Math.round((value / max) * 100) : value;
  return (
    <View style={[{ marginBottom: Spacing.md }, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Txt variant="h5">{name}</Txt>
        <Txt variant="h5" color={c}>{max ? `${value}/${max}` : `${value}%`}</Txt>
      </View>
      <ProgressBar value={pct} color={c} />
    </View>
  );
}

export function StatPill({ value, label, color, style }) {
  const { colors } = useTheme();
  const c = useColorFor()(color);
  return (
    <View style={[{ flex: 1, backgroundColor: c + '20', borderRadius: Radius.md, borderWidth: 1, borderColor: c + '30', padding: Spacing.md, alignItems: 'center' }, style]}>
      <Text style={{ color: c, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 18 }}>{value}</Text>
      <Txt variant="caption" color={colors.textSecondary} style={{ marginTop: 2, textAlign: 'center' }}>{label}</Txt>
    </View>
  );
}

export function Skeleton({ height = 80, style }) {
  const { colors } = useTheme();
  const [opacity] = React.useState(new (require('react-native').Animated.Value)(1));
  React.useEffect(() => {
    const { Animated } = require('react-native');
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const { Animated } = require('react-native');
  return <Animated.View style={[{ height, backgroundColor: colors.bgCard2, borderRadius: Radius.md, opacity }, style]} />;
}

export function EmptyState({ emoji = '📭', title, subtitle, action, onAction, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ alignItems: 'center', paddingVertical: Spacing.xxxl }, style]}>
      <Text style={{ fontSize: 44, marginBottom: Spacing.md }}>{emoji}</Text>
      <Txt variant="h3" style={{ textAlign: 'center' }}>{title}</Txt>
      {subtitle ? <Txt variant="body" color={colors.textMuted} style={{ textAlign: 'center', marginTop: 6 }}>{subtitle}</Txt> : null}
      {action ? <View style={{ marginTop: Spacing.lg }}><Btn label={action} onPress={onAction} /></View> : null}
    </View>
  );
}

// Utility used by cards.
export function SUBJECT_LABEL(id) {
  if (id === 'biology') return 'BIOLOGY';
  if (id === 'physics') return 'PHYSICS';
  if (id === 'chemistry') return 'CHEMISTRY';
  return (id || '').toUpperCase();
}
