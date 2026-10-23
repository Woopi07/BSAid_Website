// BSAid study notes, converted from the PDF case notes into Markdown (one file per note in this folder).
// To add a note: drop its .md file here and add an entry below. Each body is loaded only when opened.
export const notes = [
  {
    id: 'fundamentals-of-accounting',
    part: 'Part 1 · Basic Accounting Concepts',
    title: 'Fundamentals of Accounting',
    summary: 'What accounting is, who uses it, the accounting equation, and the five elements of financial statements.',
    topics: ['Accounting equation', 'Assets & liabilities', 'Income & expense', "Owner's equity"],
    icon: 'book',
    load: () => import('./fundamentals-of-accounting.md?raw'),
  },
  {
    id: 'transaction-analysis',
    part: 'Part 1 · Case Notes',
    title: 'Transaction Analysis',
    summary: 'Spot accountable events, classify and measure them, and apply normal balances before you record.',
    topics: ['Accountable events', 'AID method', 'Normal balances', 'RAID-NBS'],
    icon: 'analyze',
    load: () => import('./transaction-analysis.md?raw'),
  },
  {
    id: 'journalizing-and-posting',
    part: 'Case Notes',
    title: 'Journalizing and Posting',
    summary: 'Record entries in the journal, post them to the ledger, and check your work with a trial balance.',
    topics: ['Journal entries', 'Ledgers', 'Posting', 'Trial balance'],
    icon: 'journal',
    load: () => import('./journalizing-and-posting.md?raw'),
  },
  {
    id: 'adjusting-entries',
    part: 'Part 2 · Case Notes',
    title: 'Adjusting Entries',
    summary: 'Accruals, deferrals and depreciation — with worked examples, a master table and a one-page cheat sheet.',
    topics: ['Accruals', 'Deferrals', 'Depreciation', 'Cheat sheet'],
    icon: 'worksheet',
    load: () => import('./adjusting-entries.md?raw'),
  },
];
