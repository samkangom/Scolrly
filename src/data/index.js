// All Scolrly content lives here as static placeholder data (no backend yet).

export const USER = {
  name: 'Riya Sharma',
  initials: 'RS',
  targetYear: 2026,
  status: 'Class 12',
  coaching: 'Aakash',
  medium: 'English',
  streakDays: 14,
  examDate: '2026-05-04',
};

export const STATS = {
  estimatedScore: 541,
  maxScore: 720,
  estimatedRank: 41240,
  prevRank: 65000,
  rankImprovedIn: '6 weeks',
  daysToExam: 187,
  qualifyingColleges: ['MAMC', 'AFMC', 'GMC Jammu'],
  accuracy: 68,
  questionsAnswered: 2847,
  hoursStudied: 186,
  mocksCompleted: 6,
};

export const SUBJECTS = [
  { id: 'biology', name: 'Biology', colorKey: 'green' },
  { id: 'physics', name: 'Physics', colorKey: 'blue' },
  { id: 'chemistry', name: 'Chemistry', colorKey: 'purple' },
];

// ── Chapters ──────────────────────────────────────────────────────────────
// status: 'fix' | 'revise' | 'strong'
export const CHAPTERS = [
  // Biology
  { id: 'bio-1', subject: 'biology', name: 'Human Physiology', accuracy: 31, pyqCount: 24, status: 'fix', attempted: 47 },
  { id: 'bio-2', subject: 'biology', name: 'Cell Structure & Division', accuracy: 47, pyqCount: 18, status: 'fix', attempted: 38 },
  { id: 'bio-3', subject: 'biology', name: 'Plant Physiology', accuracy: 58, pyqCount: 16, status: 'revise', attempted: 30 },
  { id: 'bio-4', subject: 'biology', name: 'Reproduction', accuracy: 64, pyqCount: 20, status: 'revise', attempted: 42 },
  { id: 'bio-5', subject: 'biology', name: 'Genetics & Evolution', accuracy: 81, pyqCount: 28, status: 'strong', attempted: 52 },
  { id: 'bio-6', subject: 'biology', name: 'Ecology & Environment', accuracy: 85, pyqCount: 22, status: 'strong', attempted: 40 },
  { id: 'bio-7', subject: 'biology', name: 'Biomolecules', accuracy: 76, pyqCount: 14, status: 'strong', attempted: 26 },
  // Physics
  { id: 'phy-1', subject: 'physics', name: 'Thermodynamics', accuracy: 38, pyqCount: 20, status: 'fix', attempted: 35 },
  { id: 'phy-2', subject: 'physics', name: 'Electrostatics', accuracy: 35, pyqCount: 22, status: 'fix', attempted: 38 },
  { id: 'phy-3', subject: 'physics', name: 'Optics', accuracy: 58, pyqCount: 28, status: 'revise', attempted: 44 },
  { id: 'phy-4', subject: 'physics', name: 'Modern Physics', accuracy: 62, pyqCount: 18, status: 'revise', attempted: 32 },
  { id: 'phy-5', subject: 'physics', name: 'Current Electricity', accuracy: 71, pyqCount: 24, status: 'revise', attempted: 40 },
  { id: 'phy-6', subject: 'physics', name: 'Mechanics', accuracy: 72, pyqCount: 30, status: 'strong', attempted: 55 },
  { id: 'phy-7', subject: 'physics', name: 'Magnetism', accuracy: 79, pyqCount: 16, status: 'strong', attempted: 28 },
  // Chemistry
  { id: 'chem-1', subject: 'chemistry', name: 'Chemical Bonding', accuracy: 38, pyqCount: 24, status: 'fix', attempted: 40 },
  { id: 'chem-2', subject: 'chemistry', name: 'Coordination Compounds', accuracy: 45, pyqCount: 16, status: 'fix', attempted: 28 },
  { id: 'chem-3', subject: 'chemistry', name: 'Organic Chemistry', accuracy: 52, pyqCount: 32, status: 'revise', attempted: 48 },
  { id: 'chem-4', subject: 'chemistry', name: 'Thermodynamics (Chem)', accuracy: 61, pyqCount: 18, status: 'revise', attempted: 34 },
  { id: 'chem-5', subject: 'chemistry', name: 'Equilibrium', accuracy: 66, pyqCount: 20, status: 'revise', attempted: 36 },
  { id: 'chem-6', subject: 'chemistry', name: 'Electrochemistry', accuracy: 80, pyqCount: 14, status: 'strong', attempted: 22 },
  { id: 'chem-7', subject: 'chemistry', name: 'Periodic Table', accuracy: 84, pyqCount: 12, status: 'strong', attempted: 20 },
];

// ── Questions (real-style NEET PYQs) ──────────────────────────────────────
export const QUESTIONS = [
  {
    id: 'q1', chapter: 'bio-1', subject: 'biology', year: 2023, difficulty: 'Medium',
    text: 'Which enzyme is responsible for the digestion of proteins in the stomach?',
    options: [{ id: 'A', text: 'Trypsin' }, { id: 'B', text: 'Pepsin' }, { id: 'C', text: 'Lipase' }, { id: 'D', text: 'Amylase' }],
    correct: 'B',
    explanation: 'Pepsin is the chief protein-digesting enzyme in the stomach. It is secreted as inactive pepsinogen by chief cells and activated by HCl.',
    pyqFrequency: 'Very High', tags: ['Digestion', 'Enzymes', 'NCERT'],
  },
  {
    id: 'q2', chapter: 'bio-1', subject: 'biology', year: 2022, difficulty: 'Easy',
    text: 'The absorption of digested food primarily occurs in which part of the alimentary canal?',
    options: [{ id: 'A', text: 'Stomach' }, { id: 'B', text: 'Duodenum' }, { id: 'C', text: 'Jejunum and Ileum' }, { id: 'D', text: 'Large Intestine' }],
    correct: 'C',
    explanation: 'The jejunum and ileum are the primary absorption sites due to villi and microvilli that vastly increase surface area.',
    pyqFrequency: 'High', tags: ['Absorption', 'Small Intestine'],
  },
  {
    id: 'q3', chapter: 'chem-1', subject: 'chemistry', year: 2023, difficulty: 'Medium',
    text: 'According to Molecular Orbital Theory, the bond order of the O₂ molecule is:',
    options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: '1.5' }],
    correct: 'B',
    explanation: 'Bond order = (bonding − antibonding electrons)/2 = (10 − 6)/2 = 2. O₂ also has two unpaired electrons, explaining its paramagnetism.',
    pyqFrequency: 'Very High', tags: ['MOT', 'Bond Order'],
  },
  {
    id: 'q4', chapter: 'phy-6', subject: 'physics', year: 2021, difficulty: 'Easy',
    text: 'A body of mass 5 kg is acted upon by two perpendicular forces 8 N and 6 N. The magnitude of the acceleration is:',
    options: [{ id: 'A', text: '2 m/s²' }, { id: 'B', text: '1.4 m/s²' }, { id: 'C', text: '1 m/s²' }, { id: 'D', text: '0.5 m/s²' }],
    correct: 'A',
    explanation: 'Net force = √(8² + 6²) = √100 = 10 N. Acceleration = F/m = 10/5 = 2 m/s².',
    pyqFrequency: 'High', tags: ['Newton', 'Vectors'],
  },
  {
    id: 'q5', chapter: 'bio-5', subject: 'biology', year: 2022, difficulty: 'Easy',
    text: "In Mendel's dihybrid cross, the phenotypic ratio of the F2 generation is:",
    options: [{ id: 'A', text: '3:1' }, { id: 'B', text: '1:2:1' }, { id: 'C', text: '9:3:3:1' }, { id: 'D', text: '1:1:1:1' }],
    correct: 'C',
    explanation: 'Two genes assort independently, giving a 9:3:3:1 phenotypic ratio in the F2 generation.',
    pyqFrequency: 'Very High', tags: ['Genetics', 'Mendel'],
  },
  {
    id: 'q6', chapter: 'phy-2', subject: 'physics', year: 2023, difficulty: 'Medium',
    text: 'The electric field intensity at a point inside a uniformly charged conducting sphere is:',
    options: [{ id: 'A', text: 'Maximum' }, { id: 'B', text: 'Zero' }, { id: 'C', text: 'Same as on the surface' }, { id: 'D', text: 'Minimum but not zero' }],
    correct: 'B',
    explanation: "Inside a conductor the field is zero — a direct consequence of Gauss's law, as no charge is enclosed.",
    pyqFrequency: 'High', tags: ['Gauss', 'Electrostatics'],
  },
  {
    id: 'q7', chapter: 'chem-3', subject: 'chemistry', year: 2021, difficulty: 'Easy',
    text: 'Which of the following is the most stable carbocation?',
    options: [{ id: 'A', text: 'CH₃⁺' }, { id: 'B', text: '(CH₃)₂CH⁺' }, { id: 'C', text: '(CH₃)₃C⁺' }, { id: 'D', text: 'C₂H₅⁺' }],
    correct: 'C',
    explanation: 'Tertiary carbocations are most stable due to hyperconjugation and the +I effect of three methyl groups: 3° > 2° > 1° > CH₃⁺.',
    pyqFrequency: 'High', tags: ['Organic', 'Carbocation'],
  },
  {
    id: 'q8', chapter: 'phy-3', subject: 'physics', year: 2022, difficulty: 'Easy',
    text: 'The focal length of a convex lens is 20 cm. Its power is:',
    options: [{ id: 'A', text: '5 D' }, { id: 'B', text: '+5 D' }, { id: 'C', text: '−5 D' }, { id: 'D', text: '0.05 D' }],
    correct: 'B',
    explanation: 'Power = 1/f (in metres) = 1/0.20 = +5 D. A convex lens always has positive power.',
    pyqFrequency: 'Medium', tags: ['Optics', 'Lens'],
  },
  {
    id: 'q9', chapter: 'bio-2', subject: 'biology', year: 2020, difficulty: 'Easy',
    text: 'Which organelle is known as the "powerhouse of the cell"?',
    options: [{ id: 'A', text: 'Nucleus' }, { id: 'B', text: 'Ribosome' }, { id: 'C', text: 'Mitochondria' }, { id: 'D', text: 'Golgi apparatus' }],
    correct: 'C',
    explanation: 'Mitochondria generate most ATP through oxidative phosphorylation, powering cellular activities.',
    pyqFrequency: 'Medium', tags: ['Cell', 'Organelle'],
  },
  {
    id: 'q10', chapter: 'phy-4', subject: 'physics', year: 2023, difficulty: 'Hard',
    text: 'The work function of a metal is 4 eV. The maximum wavelength of a photon that can cause photoelectric emission is approximately:',
    options: [{ id: 'A', text: '310 nm' }, { id: 'B', text: '400 nm' }, { id: 'C', text: '540 nm' }, { id: 'D', text: '220 nm' }],
    correct: 'A',
    explanation: 'λ = hc/E = (6.63×10⁻³⁴ × 3×10⁸)/(4 × 1.6×10⁻¹⁹) ≈ 310 nm.',
    pyqFrequency: 'High', tags: ['Modern Physics', 'Photoelectric'],
  },
  {
    id: 'q11', chapter: 'bio-5', subject: 'biology', year: 2022, difficulty: 'Medium',
    text: 'Which of the following is a sex-linked recessive disorder?',
    options: [{ id: 'A', text: 'Sickle cell anaemia' }, { id: 'B', text: 'Haemophilia' }, { id: 'C', text: 'Phenylketonuria' }, { id: 'D', text: 'Thalassemia' }],
    correct: 'B',
    explanation: 'Haemophilia is X-linked recessive; affected males typically inherit the allele from carrier mothers.',
    pyqFrequency: 'High', tags: ['Genetics', 'Inheritance'],
  },
  {
    id: 'q12', chapter: 'bio-3', subject: 'biology', year: 2021, difficulty: 'Easy',
    text: 'The C4 pathway of carbon fixation is also known as the:',
    options: [{ id: 'A', text: 'Calvin cycle' }, { id: 'B', text: 'Hatch–Slack pathway' }, { id: 'C', text: 'Krebs cycle' }, { id: 'D', text: 'EMP pathway' }],
    correct: 'B',
    explanation: 'The C4 (Hatch–Slack) pathway produces a 4-carbon compound (oxaloacetate) as its first stable product.',
    pyqFrequency: 'Medium', tags: ['Photosynthesis', 'Plant Physiology'],
  },
  {
    id: 'q13', chapter: 'chem-3', subject: 'chemistry', year: 2023, difficulty: 'Medium',
    text: "Markovnikov's rule is best illustrated by the:",
    options: [{ id: 'A', text: 'Addition of HBr to propene' }, { id: 'B', text: 'Addition of HBr to ethene' }, { id: 'C', text: 'Addition of Br₂ to ethene' }, { id: 'D', text: 'Elimination of HBr from bromoethane' }],
    correct: 'A',
    explanation: 'Markovnikov addition to an unsymmetrical alkene places H on the carbon with more hydrogens, forming the more stable carbocation.',
    pyqFrequency: 'High', tags: ['Organic', 'Addition'],
  },
  {
    id: 'q14', chapter: 'chem-4', subject: 'chemistry', year: 2020, difficulty: 'Easy',
    text: 'For an exothermic reaction, the enthalpy change (ΔH) is:',
    options: [{ id: 'A', text: 'Positive' }, { id: 'B', text: 'Negative' }, { id: 'C', text: 'Zero' }, { id: 'D', text: 'Cannot be determined' }],
    correct: 'B',
    explanation: 'Exothermic reactions release energy, so the products have lower enthalpy than the reactants, making ΔH negative.',
    pyqFrequency: 'Medium', tags: ['Thermodynamics', 'Enthalpy'],
  },
  {
    id: 'q15', chapter: 'bio-6', subject: 'biology', year: 2022, difficulty: 'Medium',
    text: 'The pyramid of energy in an ecosystem is always:',
    options: [{ id: 'A', text: 'Inverted' }, { id: 'B', text: 'Upright' }, { id: 'C', text: 'Spindle-shaped' }, { id: 'D', text: 'Variable' }],
    correct: 'B',
    explanation: 'Energy decreases at every trophic level (second law of thermodynamics), so the pyramid of energy is always upright.',
    pyqFrequency: 'High', tags: ['Ecology', 'Energy Flow'],
  },
  {
    id: 'q16', chapter: 'chem-2', subject: 'chemistry', year: 2023, difficulty: 'Hard',
    text: 'The IUPAC name of [Co(NH₃)₅Cl]Cl₂ is:',
    options: [
      { id: 'A', text: 'Pentaamminechloridocobalt(III) chloride' },
      { id: 'B', text: 'Pentaamminechloridocobalt(II) chloride' },
      { id: 'C', text: 'Chloridopentaamminecobalt(II) chloride' },
      { id: 'D', text: 'Pentachloridoamminecobalt(III) chloride' },
    ],
    correct: 'A',
    explanation: 'Ligands are named alphabetically (ammine before chlorido); cobalt is +3 here, and the counter-ion chloride follows.',
    pyqFrequency: 'Medium', tags: ['Coordination', 'Nomenclature'],
  },
];

// ── Mock tests (6 completed + 1 pending) ──────────────────────────────────
export const MOCK_TESTS = [
  { id: 'm7', type: 'full', title: 'Full Mock #7', duration: 200, totalMarks: 720, questions: 180, completed: false, score: null, rank: null, date: null, subjectScores: null },
  { id: 'm6', type: 'full', title: 'Full Mock #6', duration: 200, totalMarks: 720, questions: 180, completed: true, score: 541, rank: 41240, date: '2026-06-28', accuracy: 75, timeTaken: '2hr 48min', subjectScores: { biology: 238, physics: 148, chemistry: 155 } },
  { id: 'm5', type: 'full', title: 'Full Mock #5', duration: 200, totalMarks: 720, questions: 180, completed: true, score: 518, rank: 48200, date: '2026-06-14', accuracy: 71, timeTaken: '2hr 52min', subjectScores: { biology: 230, physics: 140, chemistry: 148 } },
  { id: 'm4', type: 'full', title: 'Full Mock #4', duration: 200, totalMarks: 720, questions: 180, completed: true, score: 496, rank: 55800, date: '2026-05-31', accuracy: 68, timeTaken: '2hr 55min', subjectScores: { biology: 224, physics: 132, chemistry: 140 } },
  { id: 'm3', type: 'full', title: 'Full Mock #3', duration: 200, totalMarks: 720, questions: 180, completed: true, score: 478, rank: 61400, date: '2026-05-17', accuracy: 66, timeTaken: '2hr 58min', subjectScores: { biology: 218, physics: 126, chemistry: 134 } },
  { id: 'm2', type: 'full', title: 'Full Mock #2', duration: 200, totalMarks: 720, questions: 180, completed: true, score: 455, rank: 68900, date: '2026-05-03', accuracy: 63, timeTaken: '3hr 02min', subjectScores: { biology: 210, physics: 120, chemistry: 125 } },
  { id: 'm1', type: 'full', title: 'Full Mock #1', duration: 200, totalMarks: 720, questions: 180, completed: true, score: 432, rank: 76000, date: '2026-04-19', accuracy: 60, timeTaken: '3hr 05min', subjectScores: { biology: 202, physics: 112, chemistry: 118 } },
];

export const SUBJECT_MOCKS = [
  { id: 'sm-bio', title: 'Biology', subject: 'biology', questions: 90, duration: 100 },
  { id: 'sm-phy', title: 'Physics', subject: 'physics', questions: 45, duration: 60 },
  { id: 'sm-chem', title: 'Chemistry', subject: 'chemistry', questions: 45, duration: 60 },
];

export const MISTAKE_DNA = {
  conceptGaps: 34,
  sillyMistakes: 18,
  timePressure: 12,
  unattempted: 22,
  total: 86,
};

// ── Study rooms ───────────────────────────────────────────────────────────
export const STUDY_ROOMS = [
  {
    id: 'r1', title: 'Bio Warriors — Genetics Grind', subject: 'biology', host: 'Priya M.',
    duration: 45, status: 'live', scheduledAt: null, totalMembers: 24,
    members: [
      { initials: 'PM', color: 'green', name: 'Priya M.', status: 'studying', chapter: 'Genetics' },
      { initials: 'AK', color: 'blue', name: 'Aditya K.', status: 'studying', chapter: 'Evolution' },
      { initials: 'SR', color: 'purple', name: 'Sneha R.', status: 'break', chapter: 'Genetics' },
    ],
  },
  {
    id: 'r2', title: 'Physics Power Hour', subject: 'physics', host: 'Rahul K.',
    duration: 60, status: 'live', scheduledAt: null, totalMembers: 12,
    members: [
      { initials: 'RK', color: 'blue', name: 'Rahul K.', status: 'studying', chapter: 'Electrostatics' },
      { initials: 'MG', color: 'green', name: 'Meera G.', status: 'studying', chapter: 'Optics' },
      { initials: 'TN', color: 'orange', name: 'Tarun N.', status: 'studying', chapter: 'Modern Physics' },
    ],
  },
  {
    id: 'r3', title: 'Organic Chem Club', subject: 'chemistry', host: 'Sneha R.',
    duration: 45, status: 'scheduled', scheduledAt: '8:00 PM', totalMembers: 8,
    members: [
      { initials: 'SR', color: 'purple', name: 'Sneha R.', status: 'studying', chapter: 'Organic' },
    ],
  },
];

export const LEADERBOARD = [
  { rank: 1, initials: 'PM', color: 'green', name: 'Priya Menon', hoursThisWeek: 42, score: 648, isYou: false },
  { rank: 2, initials: 'RK', color: 'blue', name: 'Rahul Kumar', hoursThisWeek: 38, score: 612, isYou: false },
  { rank: 3, initials: 'SR', color: 'purple', name: 'Sneha Reddy', hoursThisWeek: 35, score: 598, isYou: false },
  { rank: 4, initials: 'RS', color: 'green', name: 'Riya Sharma (You)', hoursThisWeek: 28, score: 541, isYou: true },
  { rank: 5, initials: 'VS', color: 'orange', name: 'Vikram Singh', hoursThisWeek: 24, score: 528, isYou: false },
];

// ── Concept cards ─────────────────────────────────────────────────────────
export const CONCEPT_CARDS = [
  {
    id: 'c1', chapter: 'bio-1', title: 'Digestive Enzymes Overview', pyqFreq: 'Very High',
    tags: ['Digestion', 'Enzymes'],
    content: [
      'Salivary amylase begins starch digestion in the mouth.',
      'Pepsin (activated from pepsinogen by HCl) digests proteins in the stomach.',
      'Trypsin, chymotrypsin and lipase act in the small intestine.',
    ],
    formulae: ['Rate = k[S] / (Km + [S])'],
    ncertRef: 'Biology Ch 16, Page 262',
  },
  {
    id: 'c2', chapter: 'chem-1', title: 'Molecular Orbital Theory', pyqFreq: 'Very High',
    tags: ['MOT', 'Bonding'],
    content: [
      'Molecular orbitals form by Linear Combination of Atomic Orbitals (LCAO).',
      'Electrons fill MOs following aufbau, Hund and Pauli rules.',
      'Bond order predicts stability and magnetic behaviour.',
    ],
    formulae: ['Bond Order = (Nb − Na) / 2'],
    ncertRef: 'Chemistry Ch 4, Page 120',
  },
  {
    id: 'c3', chapter: 'phy-6', title: "Newton's Laws of Motion", pyqFreq: 'Very High',
    tags: ['Mechanics', 'Force'],
    content: [
      'First law: a body stays at rest or in uniform motion unless acted on by a net force.',
      'Second law: F = ma, the rate of change of momentum.',
      'Third law: every action has an equal and opposite reaction.',
    ],
    formulae: ['F = ma', 'F₁₂ = −F₂₁'],
    ncertRef: 'Physics Ch 5, Page 95',
  },
  {
    id: 'c4', chapter: 'phy-2', title: "Coulomb's Law & Electric Field", pyqFreq: 'Very High',
    tags: ['Electrostatics', 'Field'],
    content: [
      'The force between two point charges is proportional to their product.',
      'It is inversely proportional to the square of the distance between them.',
      'Electric field is force per unit positive test charge.',
    ],
    formulae: ['F = kq₁q₂ / r²', 'E = kq / r²'],
    ncertRef: 'Physics Ch 1, Page 10',
  },
  {
    id: 'c5', chapter: 'bio-5', title: 'Mendelian Genetics', pyqFreq: 'Very High',
    tags: ['Genetics', 'Inheritance'],
    content: [
      'Law of Dominance: one allele masks the effect of the other.',
      'Law of Segregation: alleles separate during gamete formation.',
      'Law of Independent Assortment: genes for different traits assort independently.',
    ],
    formulae: [],
    ncertRef: 'Biology Ch 5, Page 75',
  },
  {
    id: 'c6', chapter: 'phy-4', title: 'Photoelectric Effect & Dual Nature', pyqFreq: 'High',
    tags: ['Modern Physics', 'Quantum'],
    content: [
      'Light behaves as photons of energy E = hν.',
      'Electron kinetic energy depends on frequency, not intensity.',
      'Matter also shows wave nature via the de Broglie relation.',
    ],
    formulae: ['KEmax = hν − φ', 'λ = h / mv'],
    ncertRef: 'Physics Ch 11, Page 386',
  },
  {
    id: 'c7', chapter: 'chem-3', title: 'Organic Reaction Mechanisms', pyqFreq: 'High',
    tags: ['Organic', 'Mechanism'],
    content: [
      'SN1 and SN2 govern nucleophilic substitution.',
      'E1 and E2 govern elimination reactions.',
      'Electrophilic addition applies to alkenes and alkynes.',
    ],
    formulae: ['Rate(SN2) = k[substrate][Nu]'],
    ncertRef: 'Chemistry Ch 12, Page 340',
  },
  {
    id: 'c8', chapter: 'bio-3', title: 'Photosynthesis Pathways', pyqFreq: 'High',
    tags: ['Plant Physiology', 'C3/C4'],
    content: [
      'C3 plants fix carbon directly via the Calvin cycle.',
      'C4 (Hatch–Slack) plants first make a 4-carbon compound.',
      'CAM plants fix CO₂ at night to conserve water.',
    ],
    formulae: [],
    ncertRef: 'Biology Ch 13, Page 210',
  },
];

// ── Plans ─────────────────────────────────────────────────────────────────
export const PLANS = [
  {
    id: 'free', name: 'Free', price: '₹0', period: '', popular: false, cta: 'Continue free',
    features: ['5 questions per day', 'Basic progress tracking', '1 mock test / month', 'Community study rooms'],
  },
  {
    id: 'pro_monthly', name: 'Pro Monthly', price: '₹299', period: '/month', popular: true, cta: 'Start 7-day free trial',
    features: [
      'Unlimited practice questions', 'AI-powered weak-spot diagnostics', 'Full Mistake DNA analysis',
      'Unlimited mock tests', 'All concept cards unlocked', 'Priority doubt resolution',
      'Create your own study rooms', 'AIR rank predictor',
    ],
  },
  {
    id: 'pro_yearly', name: 'Pro Yearly', price: '₹1,999', period: '/year', popular: false, cta: 'Best value',
    saving: 'Save ₹1,589 vs monthly',
    features: [
      'Everything in Pro Monthly', 'Personalised study plan', 'Weekly AI coaching report',
      'Forgetting-curve revision alerts', 'Early access to new features', 'Offline mode',
      'Shareable Brain Map cards', 'Exam-day strategy planner', 'Detailed answer reviews', 'No ads, ever',
    ],
  },
];

// ── Daily missions (always 3) ─────────────────────────────────────────────
export const DAILY_MISSIONS = [
  { type: 'fix', title: 'Fix: Human Physiology', subtitle: '10 questions · Critical gap · 47% accuracy', color: 'orange', chapter: 'bio-1' },
  { type: 'revise', title: 'Revise: Chemical Bonding', subtitle: '8 questions · Forgetting-curve alert · MOT', color: 'purple', chapter: 'chem-1' },
  { type: 'maintain', title: 'Maintain: Genetics & Evolution', subtitle: '6 questions · Keep your streak · 81% strong', color: 'green', chapter: 'bio-5' },
];

// ── Doubt history ─────────────────────────────────────────────────────────
export const DOUBT_HISTORY = [
  {
    id: 'd1', question: 'Why is the bond order of O₂ equal to 2 but it is still paramagnetic?', subject: 'chemistry',
    answer: 'O₂ has a bond order of 2 from (Nb − Na)/2 = (10 − 6)/2. It is paramagnetic because two electrons occupy the degenerate π* antibonding orbitals singly, following Hund\'s rule — giving unpaired spins.',
    ncertRef: 'Chemistry Ch 4, Page 122', date: '2 days ago',
  },
  {
    id: 'd2', question: 'What is the difference between the jejunum and the ileum in absorption?', subject: 'biology',
    answer: 'Both absorb nutrients, but the jejunum handles most carbohydrate and protein absorption with taller villi, while the ileum specialises in absorbing vitamin B12 and bile salts.',
    ncertRef: 'Biology Ch 16, Page 268', date: '5 days ago',
  },
  {
    id: 'd3', question: 'How do I quickly find the equivalent resistance of a Wheatstone bridge?', subject: 'physics',
    answer: 'If the bridge is balanced (P/Q = R/S), no current flows through the galvanometer, so it can be removed. Then simplify the two series arms in parallel.',
    ncertRef: 'Physics Ch 3, Page 116', date: '1 week ago',
  },
];

// ── Achievements ──────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'a1', emoji: '🔥', title: 'Streak 14', earned: true, description: '14-day study streak' },
  { id: 'a2', emoji: '📝', title: '5 Mocks', earned: true, description: 'Completed 5 full mocks' },
  { id: 'a3', emoji: '⚡', title: 'Speed Solver', earned: true, description: 'Solved 50 questions in a day' },
  { id: 'a4', emoji: '🎯', title: 'Sharpshooter', earned: false, description: 'Hit 90% accuracy in a session' },
  { id: 'a5', emoji: '🏆', title: 'Top 10K', earned: false, description: 'Reach AIR under 10,000' },
  { id: 'a6', emoji: '🌙', title: 'Night Owl', earned: false, description: 'Study after midnight 5 times' },
];

// ── Score trend (per completed mock, oldest → newest) ─────────────────────
export const SCORE_TREND = [
  { label: 'M1', score: 432 },
  { label: 'M2', score: 455 },
  { label: 'M3', score: 478 },
  { label: 'M4', score: 496 },
  { label: 'M5', score: 518 },
  { label: 'M6', score: 541 },
];

// Weakest chapters (derived helper for Progress screen).
export const WEAKEST_CHAPTERS = [...CHAPTERS]
  .sort((a, b) => a.accuracy - b.accuracy)
  .slice(0, 4);

// 12 weeks of study heat-map data (0 = future, 1 = studied, 2 = missed, 3 = today).
export const STUDY_HEATMAP = (() => {
  const weeks = 12;
  const grid = [];
  let counter = 0;
  for (let w = 0; w < weeks; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const isTodayCell = w === weeks - 1 && d === 3;
      const isFuture = w === weeks - 1 && d > 3;
      let val;
      if (isTodayCell) val = 3;
      else if (isFuture) val = 0;
      else val = counter % 9 === 0 ? 2 : 1; // occasional miss
      counter++;
      row.push(val);
    }
    grid.push(row);
  }
  return grid;
})();
