"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { api, type AdminQuestion, type AdminChapter } from "@/lib/api";

const subjects = ["All", "physics", "chemistry", "biology"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

const emptyForm = {
  text: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
  difficulty: "Medium",
  chapter: "",
  year: new Date().getFullYear(),
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [filterSubject, setFilterSubject] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const chapterName = useMemo(
    () => Object.fromEntries(chapters.map((c) => [c.id, c.name])),
    [chapters],
  );

  const load = () => {
    Promise.all([
      api.get<{ questions: AdminQuestion[] }>("admin/questions"),
      api.get<{ chapters: AdminChapter[] }>("admin/chapters"),
    ])
      .then(([q, c]) => {
        setQuestions(q.questions);
        setChapters(c.chapters);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = questions.filter((q) => {
    if (filterSubject !== "All" && q.subject !== filterSubject) return false;
    if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const diffColor = (d: string) =>
    d === "Easy" ? ("green" as const) : d === "Medium" ? ("yellow" as const) : ("red" as const);

  const remove = async (id: string) => {
    if (!confirm(`Delete question ${id}? This also removes its attempt history.`)) return;
    try {
      await api.del(`admin/questions/${id}`);
      setNotice(`Deleted ${id}`);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || form.options.some((o) => !o.trim()) || !form.chapter) {
      setError("Question text, all four options, and a chapter are required.");
      return;
    }
    setSaving(true);
    try {
      const letters = ["A", "B", "C", "D"];
      await api.post("admin/questions", {
        id: `q${Date.now().toString(36)}`,
        chapter: form.chapter,
        year: form.year,
        difficulty: form.difficulty,
        text: form.text.trim(),
        options: form.options.map((t, i) => ({ id: letters[i], text: t.trim() })),
        correct: letters[form.correct],
        explanation: form.explanation.trim(),
      });
      setNotice("Question added to the bank.");
      setModalOpen(false);
      setForm(emptyForm);
      setError(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "id", label: "ID", render: (row: Record<string, unknown>) => <span className="text-xs text-text-muted">{String(row.id)}</span> },
    { key: "text", label: "Question", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminQuestion; return <span className="text-sm">{r.text.length > 60 ? r.text.slice(0, 60) + "…" : r.text}</span>; } },
    { key: "subject", label: "Subject", render: (row: Record<string, unknown>) => <span className="capitalize">{String(row.subject)}</span> },
    { key: "chapter", label: "Chapter", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminQuestion; return <span className="text-xs text-text-secondary">{chapterName[r.chapter] ?? r.chapter}</span>; } },
    { key: "difficulty", label: "Difficulty", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminQuestion; return <Badge label={r.difficulty} color={diffColor(r.difficulty)} />; } },
    { key: "year", label: "Year" },
    {
      key: "actions",
      label: "Actions",
      render: (row: Record<string, unknown>) => (
        <button
          className="text-xs text-danger hover:underline"
          onClick={() => remove(String(row.id))}
        >
          Delete
        </button>
      ),
    },
  ];

  const selectClass =
    "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Question Bank Manager</h1>
        <Button onClick={() => { setModalOpen(true); setError(null); }}>Add Question</Button>
      </div>

      {error && (
        <div className="bg-card border border-danger/40 rounded-xl p-4 text-sm text-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:underline">dismiss</button>
        </div>
      )}
      {notice && (
        <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 text-sm text-brand flex justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="hover:underline">dismiss</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <select className={selectClass} value={filterSubject} onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }}>
          {subjects.map((s) => <option key={s} value={s}>{s === "All" ? "All Subjects" : s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select className={selectClass} value={filterDifficulty} onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}>
          {difficulties.map((d) => <option key={d} value={d}>{d === "All" ? "All Difficulties" : d}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search questions..."
          className="bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-brand"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading question bank…</p>
      ) : (
        <DataTable columns={columns} data={paginated as unknown as Record<string, unknown>[]} keyField="id" />
      )}

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Showing {paginated.length} of {filtered.length} questions</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg bg-card2 border border-border-dark disabled:opacity-30 hover:bg-card transition-colors">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-lg border transition-colors ${page === i + 1 ? "bg-brand text-black border-brand" : "bg-card2 border-border-dark hover:bg-card"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-lg bg-card2 border border-border-dark disabled:opacity-30 hover:bg-card transition-colors">Next</button>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Question">
        <form className="space-y-4" onSubmit={save}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Question Text</label>
            <textarea
              rows={3}
              className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="Enter the question..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </div>
          {form.options.map((opt, n) => (
            <div key={n} className="flex items-center gap-3">
              <input
                type="radio"
                name="correct"
                className="accent-brand"
                checked={form.correct === n}
                onChange={() => setForm({ ...form, correct: n })}
                title="Mark as correct answer"
              />
              <input
                type="text"
                placeholder={`Option ${"ABCD"[n]}`}
                className="flex-1 bg-card2 border border-border-dark rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                value={opt}
                onChange={(e) => {
                  const options = [...form.options];
                  options[n] = e.target.value;
                  setForm({ ...form, options });
                }}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm text-text-secondary mb-1">Explanation</label>
            <textarea
              rows={2}
              className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="Explain the correct answer..."
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Difficulty</label>
              <select
                className={`w-full ${selectClass}`}
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Chapter</label>
              <select
                className={`w-full ${selectClass}`}
                value={form.chapter}
                onChange={(e) => setForm({ ...form, chapter: e.target.value })}
              >
                <option value="">Select chapter…</option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Year</label>
              <input
                type="number"
                className={`w-full ${selectClass}`}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Question"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
