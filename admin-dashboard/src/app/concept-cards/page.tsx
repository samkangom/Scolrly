"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";

interface ConceptCard {
  id: number;
  title: string;
  chapter: string;
  ncertRef: string;
  pyqFrequency: number;
  status: "Published" | "Draft";
}

const sampleCards: ConceptCard[] = [
  { id: 1, title: "Krebs Cycle - Complete Overview", chapter: "Respiration in Plants", ncertRef: "Ch. 14, pg 234", pyqFrequency: 12, status: "Published" },
  { id: 2, title: "SN1 vs SN2 Reactions", chapter: "Organic Chemistry", ncertRef: "Ch. 10, pg 312", pyqFrequency: 18, status: "Published" },
  { id: 3, title: "Newton's Laws Applications", chapter: "Laws of Motion", ncertRef: "Ch. 5, pg 96", pyqFrequency: 15, status: "Published" },
  { id: 4, title: "DNA Replication Fork", chapter: "Molecular Basis of Inheritance", ncertRef: "Ch. 6, pg 104", pyqFrequency: 9, status: "Draft" },
  { id: 5, title: "Electromagnetic Induction", chapter: "EMI", ncertRef: "Ch. 6, pg 208", pyqFrequency: 14, status: "Published" },
  { id: 6, title: "Periodic Table Trends", chapter: "Classification of Elements", ncertRef: "Ch. 3, pg 76", pyqFrequency: 11, status: "Published" },
  { id: 7, title: "Human Heart - Structure & Function", chapter: "Body Fluids & Circulation", ncertRef: "Ch. 18, pg 284", pyqFrequency: 8, status: "Draft" },
  { id: 8, title: "Thermodynamics First Law", chapter: "Thermodynamics", ncertRef: "Ch. 6, pg 160", pyqFrequency: 16, status: "Published" },
  { id: 9, title: "Plant Growth Hormones", chapter: "Plant Growth & Development", ncertRef: "Ch. 15, pg 248", pyqFrequency: 7, status: "Draft" },
];

export default function ConceptCardsPage() {
  const [cards, setCards] = useState(sampleCards);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleStatus = (id: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "Published" ? "Draft" : "Published" } : c
      )
    );
  };

  const selectClass = "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Concept Cards</h1>
        <Button onClick={() => setModalOpen(true)}>Add Card</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-card rounded-xl border border-border-dark p-5 hover:border-brand/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary leading-tight">{card.title}</h3>
              <Badge label={`PYQ: ${card.pyqFrequency}`} color={card.pyqFrequency > 10 ? "orange" : "blue"} />
            </div>
            <p className="text-xs text-text-secondary mb-1">{card.chapter}</p>
            <p className="text-xs text-text-muted mb-4">NCERT: {card.ncertRef}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleStatus(card.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  card.status === "Published" ? "bg-brand" : "bg-border-dark"
                }`}
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
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Concept Card">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="Card title" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Content</label>
            <textarea rows={5} className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand" placeholder="Rich content goes here..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Chapter</label>
              <select className={`w-full ${selectClass}`}>
                <option>Respiration in Plants</option><option>Organic Chemistry</option><option>Laws of Motion</option><option>Thermodynamics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">NCERT Reference</label>
              <input type="text" className={`w-full ${selectClass}`} placeholder="Ch. X, pg Y" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Formulae</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="Key formulae (comma separated)" />
          </div>
          <div className="bg-card2 border-2 border-dashed border-border-dark rounded-lg p-6 text-center">
            <p className="text-sm text-text-muted">Drag & drop image or click to upload</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary">Status:</label>
            <select className={selectClass}>
              <option>Published</option><option>Draft</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Card</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
