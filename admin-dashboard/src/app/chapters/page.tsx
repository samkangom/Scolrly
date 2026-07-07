"use client";

import { useEffect, useState } from "react";
import { api, type AdminChapter } from "@/lib/api";

const subjectDot: Record<string, string> = {
  physics: "bg-accent-blue",
  chemistry: "bg-accent-purple",
  biology: "bg-brand",
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ chapters: AdminChapter[] }>("admin/chapters")
      .then((r) => setChapters(r.chapters))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const lowCount = chapters.filter((c) => c.questionCount < 10).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Chapter Health Dashboard</h1>
        {!loading && !error && (
          <span className="text-xs text-text-secondary">
            {chapters.length} chapters · <span className="text-danger">{lowCount} need questions</span>
          </span>
        )}
      </div>

      {error && (
        <div className="bg-card border border-danger/40 rounded-xl p-4 text-sm text-danger">{error}</div>
      )}
      {loading && <p className="text-sm text-text-muted">Loading chapter coverage…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((ch) => {
          const isLow = ch.questionCount < 10;
          return (
            <div
              key={ch.id}
              className={`bg-card rounded-xl p-5 border transition-colors hover:border-brand/30 ${
                isLow ? "border-danger" : "border-border-dark"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{ch.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${subjectDot[ch.subject] ?? "bg-brand"}`} />
                    <span className="text-xs text-text-secondary capitalize">{ch.subject}</span>
                    <span className="text-xs text-text-muted">· {ch.pyqCount} PYQs asked</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 text-xs">
                <span className={isLow ? "text-danger" : "text-text-secondary"}>
                  {isLow ? "🚩" : "📝"} {ch.questionCount} questions
                </span>
                {ch.hasConceptCards ? (
                  <span className="text-brand">✓ {ch.conceptCards} card{ch.conceptCards === 1 ? "" : "s"}</span>
                ) : (
                  <span className="text-danger">✗ No cards</span>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Coverage vs pilot target</span>
                  <span className="text-text-secondary">{ch.completeness}%</span>
                </div>
                <div className="h-2 bg-card2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ch.completeness >= 70 ? "bg-brand" : ch.completeness >= 40 ? "bg-accent-yellow" : "bg-danger"
                    }`}
                    style={{ width: `${ch.completeness}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
