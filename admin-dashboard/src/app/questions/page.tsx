"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";

interface Question {
  id: number;
  question: string;
  subject: string;
  chapter: string;
  difficulty: string;
  year: number;
}

const sampleQuestions: Question[] = [
  { id: 1, question: "Which of the following is not a function of the liver?", subject: "Biology", chapter: "Digestion & Absorption", difficulty: "Easy", year: 2023 },
  { id: 2, question: "The bond order of O2 molecule is:", subject: "Chemistry", chapter: "Chemical Bonding", difficulty: "Medium", year: 2022 },
  { id: 3, question: "A ball is thrown vertically upward with velocity 20 m/s. The maximum height attained is:", subject: "Physics", chapter: "Motion in a Straight Line", difficulty: "Easy", year: 2023 },
  { id: 4, question: "Which enzyme is responsible for unwinding of DNA during replication?", subject: "Biology", chapter: "Molecular Basis of Inheritance", difficulty: "Medium", year: 2021 },
  { id: 5, question: "The IUPAC name of CH3-CO-CH2-CH3 is:", subject: "Chemistry", chapter: "Organic Chemistry", difficulty: "Easy", year: 2022 },
  { id: 6, question: "In which disease does the immune system attack myelin sheath?", subject: "Biology", chapter: "Human Physiology", difficulty: "Hard", year: 2020 },
  { id: 7, question: "The de Broglie wavelength of an electron accelerated through 100V is:", subject: "Physics", chapter: "Dual Nature of Matter", difficulty: "Hard", year: 2023 },
  { id: 8, question: "Which of the following is a biodegradable polymer?", subject: "Chemistry", chapter: "Polymers", difficulty: "Medium", year: 2021 },
  { id: 9, question: "The number of ATP molecules produced in aerobic respiration of one glucose molecule is:", subject: "Biology", chapter: "Respiration in Plants", difficulty: "Medium", year: 2022 },
  { id: 10, question: "A convex lens of focal length 20 cm produces a real image at 60 cm. Object distance is:", subject: "Physics", chapter: "Ray Optics", difficulty: "Easy", year: 2023 },
  { id: 11, question: "Which phylum includes organisms with water vascular system?", subject: "Biology", chapter: "Animal Kingdom", difficulty: "Easy", year: 2020 },
  { id: 12, question: "The hybridization of carbon in diamond is:", subject: "Chemistry", chapter: "Chemical Bonding", difficulty: "Easy", year: 2021 },
];

const subjects = ["All", "Physics", "Chemistry", "Biology"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const years = ["All", "2023", "2022", "2021", "2020"];

export default function QuestionsPage() {
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = sampleQuestions.filter((q) => {
    if (filterSubject !== "All" && q.subject !== filterSubject) return false;
    if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
    if (filterYear !== "All" && q.year !== parseInt(filterYear)) return false;
    if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const diffColor = (d: string) => {
    if (d === "Easy") return "green" as const;
    if (d === "Medium") return "yellow" as const;
    return "red" as const;
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "question", label: "Question", render: (row: Record<string, unknown>) => { const r = row as unknown as Question; return <span className="text-sm">{r.question.length > 60 ? r.question.slice(0, 60) + "..." : r.question}</span>; } },
    { key: "subject", label: "Subject" },
    { key: "chapter", label: "Chapter", render: (row: Record<string, unknown>) => { const r = row as unknown as Question; return <span className="text-xs text-text-secondary">{r.chapter}</span>; } },
    { key: "difficulty", label: "Difficulty", render: (row: Record<string, unknown>) => { const r = row as unknown as Question; return <Badge label={r.difficulty} color={diffColor(r.difficulty)} />; } },
    { key: "year", label: "Year" },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs text-accent-blue hover:underline">Edit</button>
          <button className="text-xs text-danger hover:underline">Delete</button>
        </div>
      ),
    },
  ];

  const selectClass = "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Question Bank Manager</h1>
        <div className="flex gap-3">
          <Button variant="secondary">Bulk CSV Upload</Button>
          <Button onClick={() => setModalOpen(true)}>Add Question</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className={selectClass} value={filterSubject} onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }}>
          {subjects.map((s) => <option key={s} value={s}>{s === "All" ? "All Subjects" : s}</option>)}
        </select>
        <select className={selectClass} value={filterDifficulty} onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}>
          {difficulties.map((d) => <option key={d} value={d}>{d === "All" ? "All Difficulties" : d}</option>)}
        </select>
        <select className={selectClass} value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}>
          {years.map((y) => <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search questions..."
          className="bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-brand"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <DataTable columns={columns} data={paginated as unknown as Record<string, unknown>[]} keyField="id" />

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
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Question Text</label>
            <textarea rows={3} className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand" placeholder="Enter the question..." />
          </div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <input type="radio" name="correct" className="accent-brand" />
              <input type="text" placeholder={`Option ${n}`} className="flex-1 bg-card2 border border-border-dark rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
          ))}
          <div>
            <label className="block text-sm text-text-secondary mb-1">Explanation</label>
            <textarea rows={2} className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand" placeholder="Explain the correct answer..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Difficulty</label>
              <select className={`w-full ${selectClass}`}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Chapter</label>
              <select className={`w-full ${selectClass}`}>
                <option>Chemical Bonding</option><option>Organic Chemistry</option><option>Human Physiology</option><option>Motion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Year</label>
              <input type="number" defaultValue={2024} className={`w-full ${selectClass}`} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Question</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
