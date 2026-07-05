import { useMemo } from 'react';
import { CHAPTERS } from '../data';

// Returns chapters for a subject, AI-sorted (weakest first) with status counts.
export function useChapters(subjectId) {
  return useMemo(() => {
    const filtered = subjectId ? CHAPTERS.filter((c) => c.subject === subjectId) : CHAPTERS;
    const sorted = [...filtered].sort((a, b) => a.accuracy - b.accuracy);
    const fixCount = filtered.filter((c) => c.status === 'fix').length;
    const reviseCount = filtered.filter((c) => c.status === 'revise').length;
    const strongCount = filtered.filter((c) => c.status === 'strong').length;
    const total = filtered.length;
    const avgAccuracy = total ? Math.round(filtered.reduce((s, c) => s + c.accuracy, 0) / total) : 0;
    return { chapters: sorted, total, avgAccuracy, fixCount, reviseCount, strongCount };
  }, [subjectId]);
}
