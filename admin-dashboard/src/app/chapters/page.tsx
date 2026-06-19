"use client";

interface Chapter {
  id: number;
  name: string;
  subject: "Physics" | "Chemistry" | "Biology";
  questionCount: number;
  hasConceptCards: boolean;
  completeness: number;
}

const subjectColor = {
  Physics: "accent-blue",
  Chemistry: "accent-purple",
  Biology: "brand",
};

const chapters: Chapter[] = [
  { id: 1, name: "Laws of Motion", subject: "Physics", questionCount: 45, hasConceptCards: true, completeness: 85 },
  { id: 2, name: "Thermodynamics", subject: "Physics", questionCount: 32, hasConceptCards: true, completeness: 70 },
  { id: 3, name: "Ray Optics", subject: "Physics", questionCount: 28, hasConceptCards: true, completeness: 65 },
  { id: 4, name: "Electromagnetic Induction", subject: "Physics", questionCount: 8, hasConceptCards: false, completeness: 25 },
  { id: 5, name: "Dual Nature of Matter", subject: "Physics", questionCount: 15, hasConceptCards: true, completeness: 50 },
  { id: 6, name: "Chemical Bonding", subject: "Chemistry", questionCount: 52, hasConceptCards: true, completeness: 90 },
  { id: 7, name: "Organic Chemistry - Reactions", subject: "Chemistry", questionCount: 38, hasConceptCards: true, completeness: 75 },
  { id: 8, name: "Electrochemistry", subject: "Chemistry", questionCount: 5, hasConceptCards: false, completeness: 15 },
  { id: 9, name: "Polymers", subject: "Chemistry", questionCount: 12, hasConceptCards: true, completeness: 45 },
  { id: 10, name: "Classification of Elements", subject: "Chemistry", questionCount: 22, hasConceptCards: true, completeness: 60 },
  { id: 11, name: "Molecular Basis of Inheritance", subject: "Biology", questionCount: 41, hasConceptCards: true, completeness: 80 },
  { id: 12, name: "Human Physiology", subject: "Biology", questionCount: 55, hasConceptCards: true, completeness: 92 },
  { id: 13, name: "Plant Growth & Development", subject: "Biology", questionCount: 7, hasConceptCards: false, completeness: 20 },
  { id: 14, name: "Animal Kingdom", subject: "Biology", questionCount: 35, hasConceptCards: true, completeness: 72 },
  { id: 15, name: "Cell Biology - Division", subject: "Biology", questionCount: 3, hasConceptCards: false, completeness: 10 },
];

export default function ChaptersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Chapter Health Dashboard</h1>

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
                    <span className={`w-2 h-2 rounded-full bg-${subjectColor[ch.subject]}`} />
                    <span className="text-xs text-text-secondary">{ch.subject}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className={isLow ? "text-danger" : "text-text-secondary"}>
                    {isLow ? "🚩" : "📝"} {ch.questionCount} questions
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {ch.hasConceptCards ? (
                    <span className="text-brand">✓ Cards</span>
                  ) : (
                    <span className="text-danger">✗ No cards</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Completeness</span>
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
