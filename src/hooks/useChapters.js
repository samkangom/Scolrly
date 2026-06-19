import { useMemo } from 'react';
import { CHAPTERS } from '../data';

export function useChapters(subjectId) {
  return useMemo(() => {
    const filtered = subjectId ? CHAPTERS.filter((c) => c.subject === subjectId) : CHAPTERS;
    const sorted = [...filtered].sort((a, b) => a.accuracy - b.accuracy);
    const total = filtered.length;
    const avgAccuracy = total > 0 ? Math.round(filtered.reduce((s, c) => s + c.accuracy, 0) / total) : 0;
    const fixCount = filtered.filter((c) => c.status === 'fix').length;
    const strongCount = filtered.filter((c) => c.status === 'strong').length;
    return { chapters: sorted, total, avgAccuracy, fixCount, strongCount };
  }, [subjectId]);
}
