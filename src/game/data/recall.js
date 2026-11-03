// "Quick Recall" cards: the key rules for each case's topic, taken from the BSAid study notes.
// `note` links to the full note on the website (/#note-<id>).
export const RECALL = {
  '001': {
    title: 'Transaction analysis',
    note: 'transaction-analysis',
    points: [
      'Accountable event → record it in the journal. Non-accountable event → ignore it (or disclose it if a standard requires).',
      'A transaction must be both classified (accounts affected) and measured (monetary value).',
      'Assets = Liabilities + Owner’s Equity — it must always stay balanced.',
      'AID method: Accounts affected · Increase or decrease? · Debit or credit?',
      'Only business transactions are recorded (Business Entity Principle).',
    ],
  },
  '002': {
    title: 'Normal balances',
    note: 'transaction-analysis',
    points: [
      'DEA-LER: Drawing, Expenses, Assets → DEBIT · Liabilities, Equity, Revenue → CREDIT.',
      'An account increases on its normal-balance side and decreases on the opposite side.',
      'Prepaid expenses are assets (debit); unearned revenue is a liability (credit).',
      'Contra accounts carry the opposite normal balance (e.g. Accumulated Depreciation → credit).',
    ],
  },
  '003': {
    title: 'Posting to T-accounts',
    note: 'journalizing-and-posting',
    points: [
      'Debit = Left, Credit = Right (DLRC).',
      'Post each journal amount to the same side of the account in the ledger.',
      'Balance: if total debits are higher → debit balance; if credits are higher → credit balance.',
      'Every entry keeps Total Debits = Total Credits.',
    ],
  },
  '004': {
    title: 'Journal entries',
    note: 'journalizing-and-posting',
    points: [
      'Parts of an entry: Date, Account Title, Debit, Credit, Explanation.',
      'Simple entry → two accounts. Compound entry → three or more accounts.',
      'Procedure (ADIRV): Analyze, Determine accounts, Identify debit/credit, Record, Verify equality.',
      'Compute the amount first (e.g. quantity × rate), then check Debits = Credits.',
    ],
  },
  '005': {
    title: 'Adjusting entries',
    note: 'adjusting-entries',
    points: [
      'Accrual = action first, cash later (Expense ↑ + Payable ↑ or Receivable ↑ + Income ↑).',
      'Deferral = cash first, recognition later. Prepaid: expired = expense. Advance collection: earned = income.',
      'Interest = Principal × Rate × Time (time as a fraction of a year).',
      'Straight-line depreciation = (Cost − Salvage Value) ÷ Useful Life → DR Depreciation Expense / CR Accumulated Depreciation.',
      'Every adjusting entry hits one Income Statement and one Balance Sheet account — never Cash.',
    ],
  },
  '006': {
    title: 'Trial balance',
    note: 'journalizing-and-posting',
    points: [
      'A trial balance lists every account with its debit or credit balance, in numerical order.',
      'Total debits must equal total credits — the missing amount is the difference.',
      'Transposition error → the difference is divisible by 9. Slide → a misplaced decimal point.',
      'Not detected by an equal trial balance: Failure to record, Same entry twice, Wrong amount on both sides, Wrong account.',
    ],
  },
  '007': {
    title: 'The full accounting cycle',
    note: 'adjusting-entries',
    points: [
      'Assets = Liabilities + Owner’s Equity · Net income = Revenue − Expenses (drawing is not an expense).',
      'DEA-LER: Drawing, Expenses, Assets → DEBIT · Liabilities, Equity, Revenue → CREDIT. Contra accounts are opposite.',
      'Cash received before it is earned → Unearned Revenue (a liability).',
      'Accrual = action first, cash later · Deferral = cash first · Depreciation = (Cost − Salvage) ÷ Life.',
      'Trial balance: total debits = total credits. A difference divisible by 9 hints at a transposition.',
      'Closing entries close revenue, expenses and drawing to Capital.',
    ],
  },
};
