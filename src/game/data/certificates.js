// Certificates of achievement: earned by clearing all four levels of a case.
// Each level maps to the skill it practises, for the "Mastered topics" / "Topics to review" lists.
export const SKILLS = {
  '001': ['Identifying transactions', 'Journalizing and posting', 'Advances and prepayments', 'Accounting equation and errors'],
  '002': ['Basic account types', 'Drawing, prepaid and unearned accounts', 'Contra accounts', 'Payables and receivables'],
  '003': ['Cash transactions', 'Credit sales and collections', 'Prepayments and loans', 'Interest and earned advances'],
  '004': ['Two-account entries', 'Computing entry amounts', 'Discounts and advance payments', 'Interest and combined costs'],
  '005': ['Accrued expenses and revenue', 'Expired prepayments', 'Depreciation and accrued interest', 'Mixed adjustments'],
  '006': ['Short trial balances', 'Longer trial balances', 'Contra and drawing accounts', 'Missing and misplaced amounts'],
};

export const DEFAULT_NAME = 'Accounting Explorer';

// What the player mastered (3-star levels) and should review (fewer stars), plus the star tally.
export function caseReport(caseObj, levels = {}) {
  const skills = SKILLS[caseObj.id] ?? caseObj.levels.map((l) => l.title);
  const mastered = [];
  const review = [];
  let stars = 0;
  caseObj.levels.forEach((l, i) => {
    const r = levels[l.id];
    const s = r?.stars ?? 0;
    stars += s;
    (s >= 3 ? mastered : review).push(skills[i]);
  });
  const max = caseObj.levels.length * 3;
  return { mastered, review, stars, max, rating: Math.max(1, Math.round((stars / max) * 3)) };
}

export const certificateId = (caseId, date) => `EP-${caseId}-${date.slice(0, 10).replaceAll('-', '')}`;
