export const USER = {
  name: 'Arjun Sharma',
  avatar: null,
  class: 'Class 12',
  targetYear: 2026,
  examDate: '2026-05-03',
  streak: 14,
  coaching: 'Allen Kota',
  subscription: 'free',
  joinDate: '2025-01-15',
};

export const STATS = {
  estimatedScore: 542,
  totalMarks: 720,
  percentile: 89.2,
  estimatedRank: 18420,
  qualifyingColleges: [
    'AIIMS Delhi',
    'MAMC Delhi',
    'KGMU Lucknow',
    'BHU Varanasi',
    'JIPMER Puducherry',
  ],
  totalQuestionsAnswered: 2847,
  accuracy: 68.5,
  hoursStudied: 186,
  mocksCompleted: 12,
};

export const DAILY_MISSIONS = [
  {
    id: 1,
    type: 'fix',
    chapter: 'Human Physiology',
    title: 'Fix 8 weak concepts in Digestion & Absorption',
    subject: 'Biology',
    questions: 8,
  },
  {
    id: 2,
    type: 'revise',
    chapter: 'Chemical Bonding',
    title: 'Revise molecular orbital theory — forgetting curve alert',
    subject: 'Chemistry',
    questions: 12,
  },
  {
    id: 3,
    type: 'maintain',
    chapter: 'Laws of Motion',
    title: "Maintain your streak in Newton's Laws",
    subject: 'Physics',
    questions: 6,
  },
];

export const SUBJECTS = [
  { id: 'bio', name: 'Biology', color: '#1DB954', chapters: 38, icon: 'leaf' },
  { id: 'chem', name: 'Chemistry', color: '#60A5FA', chapters: 30, icon: 'flask' },
  { id: 'phy', name: 'Physics', color: '#A855F7', chapters: 29, icon: 'atom' },
];

export const CHAPTERS = [
  { id: 1, name: 'Human Physiology', subject: 'bio', accuracy: 42, status: 'fix', pyqCount: 28, totalQuestions: 45, conceptCards: 6 },
  { id: 2, name: 'Genetics & Evolution', subject: 'bio', accuracy: 55, status: 'revise', pyqCount: 35, totalQuestions: 52, conceptCards: 8 },
  { id: 3, name: 'Cell Biology', subject: 'bio', accuracy: 78, status: 'strong', pyqCount: 22, totalQuestions: 38, conceptCards: 5 },
  { id: 4, name: 'Plant Physiology', subject: 'bio', accuracy: 61, status: 'revise', pyqCount: 18, totalQuestions: 30, conceptCards: 4 },
  { id: 5, name: 'Ecology', subject: 'bio', accuracy: 85, status: 'strong', pyqCount: 15, totalQuestions: 25, conceptCards: 3 },
  { id: 6, name: 'Chemical Bonding', subject: 'chem', accuracy: 38, status: 'fix', pyqCount: 24, totalQuestions: 40, conceptCards: 7 },
  { id: 7, name: 'Organic Chemistry', subject: 'chem', accuracy: 52, status: 'revise', pyqCount: 32, totalQuestions: 48, conceptCards: 9 },
  { id: 8, name: 'Thermodynamics', subject: 'chem', accuracy: 71, status: 'revise', pyqCount: 20, totalQuestions: 35, conceptCards: 5 },
  { id: 9, name: 'Coordination Compounds', subject: 'chem', accuracy: 45, status: 'fix', pyqCount: 16, totalQuestions: 28, conceptCards: 4 },
  { id: 10, name: 'Electrochemistry', subject: 'chem', accuracy: 80, status: 'strong', pyqCount: 14, totalQuestions: 22, conceptCards: 3 },
  { id: 11, name: 'Laws of Motion', subject: 'phy', accuracy: 88, status: 'strong', pyqCount: 26, totalQuestions: 42, conceptCards: 6 },
  { id: 12, name: 'Electrostatics', subject: 'phy', accuracy: 35, status: 'fix', pyqCount: 22, totalQuestions: 38, conceptCards: 5 },
  { id: 13, name: 'Optics', subject: 'phy', accuracy: 62, status: 'revise', pyqCount: 28, totalQuestions: 44, conceptCards: 7 },
  { id: 14, name: 'Modern Physics', subject: 'phy', accuracy: 48, status: 'fix', pyqCount: 20, totalQuestions: 32, conceptCards: 4 },
  { id: 15, name: 'Magnetism', subject: 'phy', accuracy: 73, status: 'revise', pyqCount: 18, totalQuestions: 30, conceptCards: 5 },
];

export const QUESTIONS = [
  { id: 1, chapterId: 1, text: 'Which enzyme is responsible for the digestion of proteins in the stomach?', options: ['Trypsin', 'Pepsin', 'Lipase', 'Amylase'], correct: 1, explanation: 'Pepsin is the chief digestive enzyme in the stomach that breaks down proteins into smaller peptides. It is secreted as pepsinogen by chief cells and activated by HCl.', difficulty: 'medium', year: 2023 },
  { id: 2, chapterId: 1, text: 'The absorption of digested food primarily occurs in which part of the alimentary canal?', options: ['Stomach', 'Duodenum', 'Jejunum and Ileum', 'Large Intestine'], correct: 2, explanation: 'The jejunum and ileum of the small intestine are the primary sites of nutrient absorption due to the presence of villi and microvilli that increase the surface area.', difficulty: 'easy', year: 2022 },
  { id: 3, chapterId: 6, text: 'According to MOT, the bond order of O₂ molecule is:', options: ['1', '2', '3', '1.5'], correct: 1, explanation: 'The bond order of O₂ according to Molecular Orbital Theory is 2. Bond order = (bonding electrons - antibonding electrons) / 2 = (10 - 6) / 2 = 2.', difficulty: 'medium', year: 2023 },
  { id: 4, chapterId: 11, text: 'A body of mass 5 kg is acted upon by two perpendicular forces 8N and 6N. The magnitude of acceleration is:', options: ['2 m/s²', '1.4 m/s²', '1 m/s²', '0.5 m/s²'], correct: 0, explanation: 'Net force = √(8² + 6²) = √(64 + 36) = √100 = 10N. Acceleration = F/m = 10/5 = 2 m/s².', difficulty: 'easy', year: 2021 },
  { id: 5, chapterId: 2, text: "In Mendel's dihybrid cross, the ratio of F2 generation is:", options: ['3:1', '1:2:1', '9:3:3:1', '1:1:1:1'], correct: 2, explanation: 'In a dihybrid cross, the F2 generation shows a phenotypic ratio of 9:3:3:1. This is because two genes assort independently during gamete formation.', difficulty: 'easy', year: 2022 },
  { id: 6, chapterId: 12, text: 'Electric field intensity due to a uniformly charged sphere at a point inside the sphere is:', options: ['Maximum', 'Zero', 'Same as on surface', 'Minimum but not zero'], correct: 1, explanation: "Inside a uniformly charged conducting sphere, the electric field is zero. This is a direct consequence of Gauss's law.", difficulty: 'medium', year: 2023 },
  { id: 7, chapterId: 7, text: 'Which of the following is the most stable carbocation?', options: ['CH₃⁺', '(CH₃)₂CH⁺', '(CH₃)₃C⁺', 'C₂H₅⁺'], correct: 2, explanation: 'Tertiary carbocations are most stable due to hyperconjugation and +I effect of three methyl groups. Stability order: 3° > 2° > 1° > CH₃⁺.', difficulty: 'easy', year: 2021 },
  { id: 8, chapterId: 13, text: 'The focal length of a convex lens is 20 cm. Its power is:', options: ['5 D', '+5 D', '-5 D', '0.05 D'], correct: 1, explanation: 'Power = 1/focal length (in meters) = 1/0.20 = +5 D. Convex lens always has positive power.', difficulty: 'easy', year: 2022 },
  { id: 9, chapterId: 3, text: 'Which organelle is called the "powerhouse of the cell"?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'], correct: 2, explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP through oxidative phosphorylation.', difficulty: 'easy', year: 2020 },
  { id: 10, chapterId: 14, text: 'The work function of a metal is 4 eV. The minimum wavelength of photon required for photoelectric emission is:', options: ['310 nm', '400 nm', '540 nm', '220 nm'], correct: 0, explanation: 'E = hc/λ. λ = hc/E = (6.63×10⁻³⁴ × 3×10⁸) / (4 × 1.6×10⁻¹⁹) = 310 nm approximately.', difficulty: 'hard', year: 2023 },
];

export const MOCK_TESTS = [
  { id: 1, name: 'Full Mock #12', date: '2025-06-15', score: 542, total: 720, rank: 1847, percentile: 89.2, timeTaken: 178, totalTime: 200, physics: { score: 148, total: 180, correct: 37, wrong: 5, unattempted: 3 }, chemistry: { score: 156, total: 180, correct: 39, wrong: 3, unattempted: 3 }, biology: { score: 238, total: 360, correct: 62, wrong: 12, unattempted: 16 } },
  { id: 2, name: 'Full Mock #11', date: '2025-06-08', score: 518, total: 720, rank: 2340, percentile: 86.5, timeTaken: 185, totalTime: 200, physics: { score: 132, total: 180, correct: 34, wrong: 8, unattempted: 3 }, chemistry: { score: 148, total: 180, correct: 38, wrong: 6, unattempted: 1 }, biology: { score: 238, total: 360, correct: 60, wrong: 10, unattempted: 20 } },
  { id: 3, name: 'Full Mock #10', date: '2025-06-01', score: 496, total: 720, rank: 3120, percentile: 83.8, timeTaken: 190, totalTime: 200, physics: { score: 128, total: 180, correct: 33, wrong: 9, unattempted: 3 }, chemistry: { score: 140, total: 180, correct: 36, wrong: 8, unattempted: 1 }, biology: { score: 228, total: 360, correct: 58, wrong: 14, unattempted: 18 } },
];

export const MISTAKE_DNA = {
  conceptGaps: 34,
  sillyMistakes: 18,
  timePressure: 12,
  unattempted: 22,
  total: 86,
  topWeakConcepts: [
    'Molecular Orbital Theory',
    'Digestive Enzymes',
    "Coulomb's Law Applications",
    'Krebs Cycle Steps',
    "Lens Maker's Equation",
  ],
};

export const STUDY_ROOMS = [
  { id: 1, name: 'Bio Warriors', host: 'Priya M.', members: 24, maxMembers: 30, status: 'live', chapter: 'Genetics', timeRemaining: 47 * 60, startedAt: '2025-06-18T14:00:00Z' },
  { id: 2, name: 'Physics Grind', host: 'Rahul K.', members: 18, maxMembers: 25, status: 'live', chapter: 'Electrostatics', timeRemaining: 23 * 60, startedAt: '2025-06-18T15:00:00Z' },
  { id: 3, name: 'Organic Chemistry Club', host: 'Sneha R.', members: 0, maxMembers: 20, status: 'scheduled', chapter: 'Organic Chemistry', scheduledFor: '2025-06-19T10:00:00Z' },
  { id: 4, name: 'NEET Toppers Only', host: 'Vikram S.', members: 0, maxMembers: 15, status: 'scheduled', chapter: 'Full Syllabus', scheduledFor: '2025-06-19T16:00:00Z' },
];

export const LEADERBOARD = [
  { rank: 1, name: 'Priya Menon', score: 648, avatar: null, streak: 45 },
  { rank: 2, name: 'Rahul Kumar', score: 612, avatar: null, streak: 32 },
  { rank: 3, name: 'Sneha Reddy', score: 598, avatar: null, streak: 28 },
  { rank: 4, name: 'Arjun Sharma', score: 542, avatar: null, streak: 14, isUser: true },
  { rank: 5, name: 'Vikram Singh', score: 528, avatar: null, streak: 21 },
  { rank: 6, name: 'Ananya Patel', score: 510, avatar: null, streak: 18 },
  { rank: 7, name: 'Karthik Nair', score: 498, avatar: null, streak: 12 },
  { rank: 8, name: 'Divya Gupta', score: 485, avatar: null, streak: 9 },
];

export const CONCEPT_CARDS = [
  { id: 1, chapterId: 1, title: 'Digestive Enzymes Overview', content: 'The human digestive system uses various enzymes at different stages. Salivary amylase breaks down starch in the mouth, pepsin digests proteins in the stomach, trypsin and chymotrypsin work in the small intestine, and lipase breaks down fats.', formulae: ['Rate = k[S]/(Km + [S])'], ncertRef: 'Ch 16, Page 262', pyqFrequency: 'Very High', bookmarked: false },
  { id: 2, chapterId: 1, title: 'Absorption in Small Intestine', content: 'Nutrients are absorbed through villi and microvilli in the small intestine. The large surface area created by these structures enables efficient absorption of amino acids, monosaccharides, fatty acids, vitamins, and minerals.', formulae: [], ncertRef: 'Ch 16, Page 268', pyqFrequency: 'High', bookmarked: true },
  { id: 3, chapterId: 6, title: 'Molecular Orbital Theory', content: 'MOT describes bonding using molecular orbitals formed by Linear Combination of Atomic Orbitals (LCAO). Electrons fill molecular orbitals following the aufbau principle, Hund\'s rule, and Pauli exclusion principle.', formulae: ['Bond Order = (Nb - Na)/2'], ncertRef: 'Ch 4, Page 120', pyqFrequency: 'Very High', bookmarked: false },
  { id: 4, chapterId: 11, title: "Newton's Laws of Motion", content: 'Three fundamental laws governing motion: 1st law (inertia), 2nd law (F=ma), 3rd law (action-reaction). These form the basis of classical mechanics and are essential for solving NEET physics problems.', formulae: ['F = ma', 'F₁₂ = -F₂₁'], ncertRef: 'Ch 5, Page 95', pyqFrequency: 'Very High', bookmarked: true },
  { id: 5, chapterId: 3, title: 'Cell Organelles', content: 'Eukaryotic cells contain membrane-bound organelles including nucleus, mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and chloroplasts (in plants). Each organelle has specific functions essential for cell survival.', formulae: [], ncertRef: 'Ch 8, Page 131', pyqFrequency: 'High', bookmarked: false },
  { id: 6, chapterId: 12, title: "Coulomb's Law & Electric Field", content: 'The electrostatic force between two point charges is directly proportional to the product of charges and inversely proportional to the square of distance between them.', formulae: ['F = kq₁q₂/r²', 'E = kq/r²'], ncertRef: 'Ch 1, Page 10', pyqFrequency: 'Very High', bookmarked: false },
];

export const PLANS = [
  { id: 'free', name: 'Free', price: 0, period: null, features: ['5 questions/day', 'Basic progress tracking', '1 mock test/month', 'Community rooms'], limitations: ['No AI diagnostics', 'No Mistake DNA', 'Limited concept cards'] },
  { id: 'pro_monthly', name: 'Pro Monthly', price: 499, period: 'month', popular: true, features: ['Unlimited questions', 'AI-powered diagnostics', 'Full Mistake DNA analysis', 'Unlimited mock tests', 'All concept cards', 'Priority doubt resolution', 'Study rooms creation', 'Rank predictor'] },
  { id: 'pro_yearly', name: 'Pro Yearly', price: 3999, period: 'year', savings: '33%', features: ['Everything in Pro Monthly', 'Personalized study plan', 'Weekly AI coaching report', 'Early access to new features', 'Offline mode'] },
];
