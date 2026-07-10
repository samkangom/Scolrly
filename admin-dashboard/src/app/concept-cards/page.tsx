"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { api, type AdminConceptCard, type AdminChapter } from "@/lib/api";

const PYQ_FREQS = ["Very High", "High", "Medium", "Low"];

const emptyForm = {
  title: "",
  content: "",
  chapter: "",
  ncertRef: "",
  formulae: "",
  pyqFreq: "High",
  status: "Published" as "Published" | "Draft",
};

export default function ConceptCardsPage() {
  const [cards, setCards] = useState<AdminConceptCard[]>([]);
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([
      api.get<{ cards: AdminConceptCard[] }>("admin/concepts"),
      api.get<{ chapters: AdminChapter[] }>("admin/chapters"),
    ])
      .then(([c, ch]) => {
        setCards(c.cards);
        setChapters(ch.chapters);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleStatus = async (card: AdminConceptCard) => {
    const next = card.status === "Published" ? "Draft" : "Published";
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, status: next } : c)));
    try {
      await api.put(`admin/concepts/${card.id}/status`, { status: next });
    } catch (e) {
      setError((e as Error).message);
      load();
    }
  };

  const remove = async (card: AdminConceptCard) => {
    if (!confirm(`Delete "${card.title}"?`)) return;
    try {
      await api.del(`admin/concepts/${card.id}`);
      setNotice(`Deleted "${card.title}"`);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.chapter || !form.content.trim()) {
      setError("Title, chapter, and content are required.");
      return;
    }
    setSaving(true);
    try {
      await api.post("admin/concepts", {
        title: form.title.trim(),
        chapter: form.chapter,
        ncertRef: form.ncertRef.trim(),
        pyqFreq: form.pyqFreq,
        status: form.status,
        content: form.content.split("\n").map((s) => s.trim()).filter(Boolean),
        formulae: form.formulae.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setNotice("Concept card created.");
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

  const selectClass =
    "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Concept Cards</h1>
        <div className="flex items-center gap-3">
          {!loading && !error && (
            <span className="text-xs text-text-secondary">{cards.length} cards</span>
          )}
          <Button onClick={() => { setModalOpen(true); setError(null); }}>Add Card</Button>
        </div>
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

      {loading ? (
        <p className="text-sm text-text-muted">Loading concept cards…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="bg-card rounded-xl border border-border-dark p-5 hover:border-brand/30 transition-colors flex flex-col">
              <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="text-sm font-semibold text-text-primary leading-tight">{card.title}</h3>
                <Badge label={`PYQ: ${card.pyqFreq}`} color={card.pyqFreq === "Very High" || card.pyqFreq === "High" ? "orange" : "blue"} />
              </div>
              <p className="text-xs text-text-secondary mb-1">{card.chapterName} · <span className="capitalize">{card.subject}</span></p>
              <p className="text-xs text-text-muted mb-2">📖 {card.ncertRef || "No NCERT ref"}</p>
              <p className="text-xs text-text-muted mb-4 line-clamp-2 flex-1">{card.content[0]}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(card)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      card.status === "Published" ? "bg-brand" : "bg-border-dark"
                    }`}
                    title="Toggle published / draft"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        card.status === "Published" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-xs ${card.status === "Published" ? "text-brand" : "text-text-muted"}`}>
                    {card.status}
                  </span>
                </div>
                <button onClick={() => remove(card)} className="text-xs text-danger hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Concept Card">
        <form className="space-y-4" onSubmit={save}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="Card title"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Content <span className="text-text-muted">(one bullet per line)</span></label>
            <textarea rows={5} className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder={"First key point\nSecond key point\nThird key point"}
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Chapter</label>
              <select className={`w-full ${selectClass}`} value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })}>
                <option value="">Select chapter…</option>
                {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">NCERT Reference</label>
              <input type="text" className={`w-full ${selectClass}`} placeholder="Biology Ch 16, Page 262"
                value={form.ncertRef} onChange={(e) => setForm({ ...form, ncertRef: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Formulae <span className="text-text-muted">(comma separated)</span></label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="F = ma, E = mc²"
              value={form.formulae} onChange={(e) => setForm({ ...form, formulae: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">PYQ Frequency</label>
              <select className={`w-full ${selectClass}`} value={form.pyqFreq} onChange={(e) => setForm({ ...form, pyqFreq: e.target.value })}>
                {PYQ_FREQS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Status</label>
              <select className={`w-full ${selectClass}`} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Published" | "Draft" })}>
                <option>Published</option><option>Draft</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Card"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
