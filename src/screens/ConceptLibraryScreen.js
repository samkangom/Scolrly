import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { Spacing } from '../theme/tokens';
import {
  Screen, Txt, BackButton, SearchInput, SubjectTabs, ConceptCard, EmptyState,
} from '../components/common';
import { CONCEPT_CARDS, CHAPTERS, SUBJECTS } from '../data';
import { useApp } from '../context/AppContext';

const ALL = [{ id: 'all', name: 'All' }, ...SUBJECTS];

// Map each concept card to its subject via its chapter.
const cardSubject = (card) => CHAPTERS.find((c) => c.id === card.chapter)?.subject;

export default function ConceptLibraryScreen({ navigation }) {
  const { colors } = useTheme();
  const { bookmarks, toggleBookmark } = useApp();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return CONCEPT_CARDS.filter((c) => {
      const bySubject = subject === 'all' || cardSubject(c) === subject;
      const q = query.trim().toLowerCase();
      const byQuery = !q || c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
      return bySubject && byQuery;
    });
  }, [query, subject]);

  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <BackButton onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.md }} />
        <Txt variant="h1">Concept Library</Txt>
        <Txt variant="body" color={colors.textSecondary} style={{ marginTop: 4, marginBottom: Spacing.lg }}>
          All NEET concepts in one place
        </Txt>

        <SearchInput value={query} onChangeText={setQuery} onClear={() => setQuery('')} placeholder="Search chapters..." style={{ marginBottom: Spacing.lg }} />

        <SubjectTabs subjects={ALL} active={subject} onChange={setSubject} style={{ paddingBottom: Spacing.lg }} />

        {filtered.length === 0 ? (
          <EmptyState emoji="🔍" title="No concepts found" subtitle={`Nothing matches “${query}”. Try another search.`} />
        ) : (
          <View style={{ gap: Spacing.sm }}>
            {filtered.map((c) => (
              <ConceptCard
                key={c.id}
                card={c}
                expanded={expanded === c.id}
                bookmarked={bookmarks.includes(c.id)}
                onBookmark={() => toggleBookmark(c.id)}
                onPress={() => setExpanded(expanded === c.id ? null : c.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
