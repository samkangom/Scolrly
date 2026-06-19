import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Modal } from 'react-native';
import { useTheme, Typography, Spacing, Radius } from '../theme';
import { Card, SectionHeader, Badge, Btn, Divider } from '../components/common';
import { CONCEPT_CARDS, CHAPTERS, SUBJECTS } from '../data';

export default function ConceptLibraryScreen({ navigation }) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => {
    const map = {};
    CONCEPT_CARDS.forEach((c) => { map[c.id] = c.bookmarked; });
    return map;
  });

  const filtered = CONCEPT_CARDS.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeSubject) {
      const ch = CHAPTERS.find((ch) => ch.id === c.chapterId);
      if (ch && ch.subject !== activeSubject) return false;
    }
    return true;
  });

  const grouped = {};
  filtered.forEach((c) => {
    const ch = CHAPTERS.find((ch) => ch.id === c.chapterId);
    const name = ch ? ch.name : 'Other';
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(c);
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }}>
          <Text style={[Typography.body, { color: colors.green }]}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={[Typography.h1, { color: colors.textPrimary, marginBottom: Spacing.base }]}>Concept Library</Text>

        {/* Search */}
        <View style={{ backgroundColor: colors.card, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, marginBottom: Spacing.md }}>
          <TextInput
            placeholder="Search concepts..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[Typography.body, { color: colors.textPrimary, paddingVertical: Spacing.md }]}
          />
        </View>

        {/* Subject Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setActiveSubject(null)} style={{ paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: !activeSubject ? colors.green : colors.card, marginRight: Spacing.sm, borderWidth: 1, borderColor: !activeSubject ? colors.green : colors.border }}>
            <Text style={[Typography.caption, { color: !activeSubject ? '#FFFFFF' : colors.textSecondary, fontWeight: '700' }]}>All</Text>
          </TouchableOpacity>
          {SUBJECTS.map((s) => (
            <TouchableOpacity key={s.id} activeOpacity={0.85} onPress={() => setActiveSubject(s.id)} style={{ paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: activeSubject === s.id ? s.color : colors.card, marginRight: Spacing.sm, borderWidth: 1, borderColor: activeSubject === s.id ? s.color : colors.border }}>
              <Text style={[Typography.caption, { color: activeSubject === s.id ? '#FFFFFF' : colors.textSecondary, fontWeight: '700' }]}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cards grouped by chapter */}
        {Object.entries(grouped).map(([chapter, cards]) => (
          <View key={chapter} style={{ marginBottom: Spacing.lg }}>
            <Text style={[Typography.bodyBold, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>{chapter}</Text>
            {cards.map((card) => (
              <TouchableOpacity key={card.id} activeOpacity={0.85} onPress={() => setSelectedCard(card)}>
                <Card style={{ marginBottom: Spacing.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[Typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>{card.title}</Text>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => setBookmarks((b) => ({ ...b, [card.id]: !b[card.id] }))}>
                      <Text style={{ fontSize: 18, color: bookmarks[card.id] ? colors.yellow : colors.textMuted }}>{bookmarks[card.id] ? '★' : '☆'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[Typography.small, { color: colors.textSecondary, marginTop: Spacing.xs }]} numberOfLines={2}>{card.content}</Text>
                  <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
                    <Badge label={card.pyqFrequency} color={colors.green} />
                    <Badge label={card.ncertRef} color={colors.blue} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {filtered.length === 0 && (
          <Card><Text style={[Typography.body, { color: colors.textMuted, textAlign: 'center' }]}>No concepts found.</Text></Card>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedCard} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg, padding: Spacing.xl, maxHeight: '80%' }}>
            {selectedCard && (
              <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
                  <Text style={[Typography.h2, { color: colors.textPrimary, flex: 1 }]}>{selectedCard.title}</Text>
                  <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedCard(null)}>
                    <Text style={{ fontSize: 24, color: colors.textMuted }}>&#10005;</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.lg }]}>{selectedCard.content}</Text>
                {selectedCard.formulae.length > 0 && (
                  <>
                    <Text style={[Typography.bodyBold, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>Key Formulae</Text>
                    {selectedCard.formulae.map((f, i) => (
                      <Card key={i} style={{ marginBottom: Spacing.sm, backgroundColor: colors.card2 }}>
                        <Text style={[Typography.body, { color: colors.green, fontFamily: 'monospace' }]}>{f}</Text>
                      </Card>
                    ))}
                  </>
                )}
                <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md, flexWrap: 'wrap' }}>
                  <Badge label={selectedCard.ncertRef} color={colors.blue} />
                  <Badge label={`PYQ: ${selectedCard.pyqFrequency}`} color={colors.green} />
                </View>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setBookmarks((b) => ({ ...b, [selectedCard.id]: !b[selectedCard.id] }))} style={{ marginTop: Spacing.lg }}>
                  <Btn title={bookmarks[selectedCard.id] ? 'Remove Bookmark' : 'Bookmark'} variant={bookmarks[selectedCard.id] ? 'outline' : undefined} onPress={() => setBookmarks((b) => ({ ...b, [selectedCard.id]: !b[selectedCard.id] }))} />
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
