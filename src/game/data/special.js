// Special Cases: story-driven detective investigations with Detective Alex Reyes.
// Story, briefings, feedback and recommendations follow the Game Design Document (Special Case 4 and 6, WIP).
// Each case has three levels; every level runs Story → Briefing → Gameplay → Results → Ending.
//
// Speakers: N = narration, A = Detective Alex Reyes, C = Cleo Rillanes, H = Head Chief, '' = unnamed voice.
// Line effects (fx): 'blackout', 'newspaper', 'breaking', 'phone', 'vault-open', 'statements', 'sending', 'solved'.

export const CAST = {
  A: { name: 'Detective Alex Reyes', short: 'Alex', look: { hair: '#1F1A17', hairStyle: 'short', skin: '#E8B996', outfit: '#5B4630', accent: '#F5F7FA' } },
  C: { name: 'Cleo Rillanes', short: 'Cleo', look: { hair: '#5B3A29', hairStyle: 'bob', skin: '#F2C9A8', outfit: '#0F2D63', accent: '#F5F7FA' } },
  H: { name: 'Head Chief', short: 'Head Chief', look: { hair: '#9CA3AF', hairStyle: 'short', skin: '#D9A47F', outfit: '#14532A', accent: '#FFC107' } },
};

const peso = (n) => `₱${n.toLocaleString('en-PH')}`;

// Adjusting-entry evidence sets for "Between Words and Letters". Statements are rebuilt from these.
function adjustmentSet({ revenueTitle, revenue, expenses, items, accounts }) {
  const after = items.reduce(
    (t, it) => {
      if (it.credit === revenueTitle) t.revenue += it.amount;
      if (/Expense$/.test(it.debit)) t.expenses += it.amount;
      return t;
    },
    { revenue, expenses }
  );
  return { revenueTitle, before: { revenue, expenses }, after, items, accounts };
}

export const SPECIAL_CASES = [
  {
    id: 'sc4',
    number: 4,
    title: 'Holding the Arsonist Accountant Accountable',
    wip: true,
    company: 'Parasol Corporation',
    tagline: 'A threatening letter. A missing paper trail. Someone in the accounting team is planning arson.',
    background:
      "Parasol Corporation is one of the country's largest manufacturing companies. For years, the company has maintained an excellent reputation with investors and government agencies. One day, an unsealed envelope is discovered by an internal auditor sitting on top of the petty cash drawer with no labels indicating its content, its sender, nor its recipient. Opening the envelope, the auditor discovered a threatening letter stating that someone in the accounting team will commit arson a few weeks from now on the company building.",
    detective:
      'Detective Alex Reyes is a close friend to the CEO of Parasol Corporation. Though young and unknown in the world of criminal investigation, his sharp intuition and serious work habit allows him to recognize the least amount of help as well as the least amount of people that he would have to involve in the investigation, which revolves around Cleo Rillanes, his senior in the field, and you, an accountant from a different company who have all the skills needed to discover the appropriate clues to track down the culprit.',
    problem:
      'Initial investigations reveal that important accounting records have been tampered with. To uncover the fraud, Detective Alex recruited your help to reconstruct the missing records by applying accounting principles correctly, while Alex and Cleo work on interpreting the procured clues to track down the culprit.',
    objectives: [
      'Understand accounting terminology',
      'Analyze accounting records',
      'Prepare adjusting journal entries',
      'Recognize how inaccurate records affect financial statements',
      'Apply accounting concepts in solving business fraud',
    ],
    topics: ['Accounting Concepts', 'Accounting Cycle', 'Adjusting Entries', 'Accrual Accounting', 'Trial Balance', 'Financial Statements'],
    prologue: [
      { s: '', t: 'Hey, is it really alright to drag a civilian along in this mess?', fx: 'blackout' },
      { s: '', t: 'Well, they’re the only hope we have in obtaining evidence for this case. We’ll just have to make them sign an NDA if they want to cooperate.', fx: 'blackout' },
      { s: '', t: '...And if they don’t?', fx: 'blackout' },
      { s: '', t: 'Well……', fx: 'blackout' },
    ],
    levels: [
      {
        id: 1,
        title: 'Fill in the Blanks',
        setting: 'An empty room with a large table in the middle',
        story: [
          { s: 'N', t: 'After signing the contract, you were taken to the detective’s hideout that now currently stands as their base of operations.' },
          { s: 'C', t: 'Well then, while our dear Detective fetches all the files that are still salvageable, I suppose it’ll be optimal if we spend this time refreshing your knowledge. Answer the questions in this book and I’ll see if you get them right.' },
        ],
        briefing: {
          challenge: 'Solve the Questions from the Book Perfectly',
          objectives: ['Identify basic accounting concepts and terminology.', 'Recall important accounting vocabulary.', 'Complete every question to unlock the next clue.'],
          instructions: ['Read each Question carefully.', 'Drag the correct accounting term into the answer box.', 'Answer the questions perfectly to get to the next level.'],
        },
        game: {
          type: 'blanks',
          right: 'You got it right! Onto the next one.',
          wrong: 'The Answer Key seems to disagree with your answer. Try again.',
          questions: [
            { q: 'A small locked drawer filled with legal tender handled by a custodian is used for the company’s minor expenses. The money inside is called what?', answer: 'Petty Cash', explain: 'Petty Cash is a small amount of physical discretionary funds in the form of cash used for small or unexpected expenditures.' },
            { q: 'The seller sends this document to the buyer, listing the goods sold, their quantities and prices, and the total amount due.', answer: 'Invoice', explain: 'An invoice is the seller’s bill to the buyer. It is the source document for recording a sale on account (and a purchase on account for the buyer).' },
            { q: 'Before any payment leaves the company, a written authorization is prepared, supported by documents, and approved. These forms are called what?', answer: 'Vouchers', explain: 'Vouchers authorize disbursements. Each voucher is supported by documents such as invoices and receipts, which helps prevent unauthorized payments.' },
            { q: 'Transactions are first recorded here in chronological order — it is also called the Book of Original Entry.', answer: 'Journal', explain: 'The journal is the chronological record of transactions. Entries are recorded here first, then posted to the ledger.' },
            { q: 'This is the record of every employee’s earnings, deductions and net pay for a pay period.', answer: 'Payroll', explain: 'The payroll lists employees’ gross pay, deductions and net pay. It supports the entries for salaries expense and salaries payable.' },
            { q: 'The cost of the employees’ services used during the period, recognized even if not yet paid.', answer: 'Salary Expense', explain: 'Salary Expense is recognized when the employees’ services are used (incurred), under the accrual basis — not when cash is paid.' },
            { q: 'Salaries already earned by employees but not yet paid at the end of the period are reported as what liability?', answer: 'Salary Payable', explain: 'Salary Payable is the liability for salaries earned but unpaid. It is recorded through an accrued expense adjusting entry.' },
            { q: 'A slip found in the petty cash drawer saying an employee borrowed ₱500 and promises to pay it back. This informal acknowledgment of debt is called what?', answer: 'IOU', explain: 'An IOU (“I owe you”) is an informal written acknowledgment of a debt. IOUs in petty cash are not cash — they are receivables from employees.' },
          ],
        },
        results: {
          metric: 'time',
          takeaways: ['Recognize common accounting terminology.', 'Strengthen accounting vocabulary.', 'Connect accounting concepts with real-world investigation scenarios.'],
          recommend: ({ time }) => ({
            by: 'C',
            text:
              time < 180
                ? 'Excellent work, Accountant! You’re more equipped than I thought.'
                : time <= 600
                  ? 'Good investigation. Review a few accounting terms before proceeding.'
                  : 'You might need to review some more concepts to be well equipped for what’s next.',
          }),
        },
        end: [
          { s: 'N', t: 'Alex finally arrived holding several files and binders.' },
          { s: 'A', t: 'I managed to get all the affected files. A lot of them really are missing or tampered.' },
          { s: 'A', t: 'There’s also this small vault I found in the…' },
          { s: 'A', t: '…What are you guys doing?' },
          { s: 'C', t: 'Doing a little refresher. It’s best for us to be more equipped with handling and tracking all of them.' },
          { s: 'A', t: 'All right! Should we get started now?' },
        ],
      },
      {
        id: 2,
        title: 'Crack the Vault',
        setting: 'An empty room with a large table in the middle. There’s a vault in the middle now',
        story: [
          { s: 'C', t: 'So… your instincts are telling you that there’s a clue in the vault.' },
          { s: 'A', t: 'Basically, yeah. I’m not sure of the code yet, however.' },
          { s: 'C', t: 'Well, I suppose we should take care of the files first then.' },
          { s: 'C', t: '…' },
          { s: 'A', t: 'What is it?' },
          { s: 'C', t: 'There’s some sort of weird marks on some of these pages.' },
          { s: 'A', t: 'Maybe it’s a clue to the vault?' },
          { s: 'C', t: 'With how your investigations go, we might as well try.' },
        ],
        briefing: {
          challenge: 'Solve the accounting questions to obtain the correct security code and unlock the vault. Each answer reveals one digit of the vault’s passcode.',
          objectives: ['Apply basic accounting to solve problems.', 'Analyze accounting transactions accurately.', 'Demonstrate understanding of the lesson through computation and decision-making.'],
          instructions: ['Read each accounting question carefully.', 'Solve the problem and select the correct answer.', 'Every answer reveals one digit of the vault code — a wrong answer reveals a wrong digit.', 'Complete all questions correctly to unlock the vault.'],
          hint: 'Accuracy is more important than speed. Double-check your computations before submitting.',
        },
        game: {
          type: 'vault',
          mode: 'set', // answer all five, then try the code; a wrong answer shows a random digit
          code: '41255',
          right: 'The Vault Opened! Time to see what’s inside.',
          wrong: 'Some of these might be incorrect. Might as well try again.',
          questions: [
            {
              topic: 'Journal entries',
              q: 'Parasol bought raw materials worth ₱40,000 on account. Which entry records the purchase?',
              choices: ['Dr Raw Materials ₱40,000 / Cr Accounts Payable ₱40,000', 'Dr Accounts Payable ₱40,000 / Cr Raw Materials ₱40,000', 'Dr Raw Materials ₱40,000 / Cr Cash ₱40,000', 'Dr Purchases Expense ₱40,000 / Cr Accounts Receivable ₱40,000'],
              answer: 0,
              steps: ['The materials received are an asset → debit Raw Materials.', '“On account” means it is not paid yet → credit Accounts Payable.'],
              principle: 'Double-entry: every transaction has an equal debit and credit.',
            },
            {
              topic: 'Adjusting entries',
              q: 'At December 31, factory workers had earned ₱15,000 of wages that will be paid on January 5. What is the adjusting entry?',
              choices: ['Dr Salaries Payable / Cr Salaries Expense ₱15,000', 'Dr Salaries Expense / Cr Salaries Payable ₱15,000', 'Dr Salaries Expense / Cr Cash ₱15,000', 'No entry until January 5'],
              answer: 1,
              steps: ['The wages were incurred in December → Salaries Expense increases (debit).', 'They are still unpaid → Salaries Payable increases (credit).'],
              principle: 'Accrued expense: Expense ↑ and Liability ↑.',
            },
            {
              topic: 'Accrual basis',
              q: 'Under the accrual basis of accounting, revenue is recognized when it is…',
              choices: ['received in cash', 'billed to the customer', 'earned, regardless of when cash is received', 'deposited in the bank'],
              answer: 2,
              steps: ['The accrual basis records revenue in the period it is earned.', 'Cash may come before, during or after that period.'],
              principle: 'Revenue recognition under the accrual basis.',
            },
            {
              topic: 'Reversing entries',
              q: 'Which adjusting entries are normally reversed at the start of the next period?',
              choices: ['Depreciation', 'Accrued expenses and accrued revenues', 'Prepaid expenses recorded under the asset method', 'Closing entries'],
              answer: 1,
              steps: ['Reversing entries undo accruals so the later cash payment or collection can be recorded normally.', 'Depreciation and asset-method prepaids are not reversed.'],
              principle: 'Reversing entries are optional and apply to accruals.',
            },
            {
              topic: 'Prepaid expenses',
              q: 'On September 1, Parasol paid ₱120,000 for 12 months of fire insurance (debited to Prepaid Insurance). How much insurance expense is recognized on December 31?',
              choices: ['₱10,000', '₱30,000', '₱40,000', '₱120,000'],
              answer: 2,
              steps: ['Monthly cost = ₱120,000 ÷ 12 = ₱10,000.', 'September 1 to December 31 = 4 months.', 'Expired portion = ₱10,000 × 4 = ₱40,000.'],
              principle: 'Prepaid expense: expired = expense, unexpired = asset.',
            },
          ],
        },
        results: {
          metric: 'attempts',
          recommend: ({ attempts }) => ({
            by: 'A',
            text: attempts <= 2 ? 'That went smoother than expected! Great Job!' : attempts <= 5 ? 'We did it! Now time to see what’s inside.' : 'Alright. We’ll have to skim through what’s inside.',
          }),
        },
        end: [
          { s: 'N', t: 'After the vault has been opened…', fx: 'vault-open' },
          { s: 'A', t: 'These are…?' },
          { s: 'C', t: 'Accounting records. The series number matches the missing ones on the files.' },
          { s: 'A', t: 'Well then! That definitely means these files had the secret right?' },
          { s: 'C', t: '…' },
          { s: 'A', t: 'What now…' },
          { s: 'C', t: 'Something’s still missing.' },
          { s: 'C', t: 'The Journal Vouchers detailing the Adjustments are missing its values.' },
          { s: 'A', t: 'It’s even redacted in the Worksheets too…' },
          { s: 'C', t: 'We’ll have to compute the adjustments ourselves. We just have to investigate the connected files for clues on what to adjust.' },
          { s: 'A', t: 'Then I’ll go back to the company building to find them.' },
        ],
      },
      {
        id: 3,
        title: 'Between Words and Letters',
        setting: 'An empty room with a large table in the middle. There’s a vault in the middle and the files are arranged around the table',
        story: [
          { s: 'N', t: 'An hour later after Detective Alex went outside.' },
          { s: 'A', t: 'I found all of the attachments! They were tucked behind the shelves that had the files.' },
          { s: 'C', t: 'Good Work. Well then, time to get to the bottom of this.' },
        ],
        briefing: {
          challenge: 'Analyze the available accounting records and prepare the correct adjusting journal entries to restore the company’s books. Only after correcting the records can Detective Alex investigate the company’s financial statements and collect the final clue.',
          objectives: ['Analyze accounting information regarding adjustments.', 'Identify accounts requiring adjustment.', 'Prepare accurate adjusting journal entries.', 'Apply the accrual basis of accounting to ensure reliable financial reporting.'],
          instructions: ['Review the supporting documents and transaction details provided.', 'Identify the necessary adjusting entries.', 'Record the correct accounts and corresponding debit and credit amounts.', 'Submit all entries to reconstruct the company’s accounting records.'],
          hint: 'Consider common year-end adjustments such as accrued revenues, accrued expenses, prepaid expenses, unearned revenues, and depreciation.',
        },
        game: {
          type: 'adjust',
          by: 'C',
          right: 'Alright. That looks right to me.',
          wrong: '…We might have to redo this one.',
          set: adjustmentSet({
            revenueTitle: 'Sales Revenue',
            revenue: 3200000,
            expenses: 2450000,
            accounts: ['Cash', 'Accounts Receivable', 'Factory Supplies', 'Prepaid Insurance', 'Machinery', 'Accumulated Depreciation', 'Salaries Payable', 'Interest Payable', 'Unearned Revenue', 'Sales Revenue', 'Supplies Expense', 'Salaries Expense', 'Insurance Expense', 'Depreciation Expense'],
            items: [
              { doc: 'Inventory count sheet', text: 'Factory supplies on hand at December 31: ₱23,000. The Factory Supplies account shows ₱85,000.', debit: 'Supplies Expense', credit: 'Factory Supplies', amount: 62000, why: 'Supplies used = ₱85,000 − ₱23,000 = ₱62,000. Used supplies become an expense; the asset decreases.' },
              { doc: 'Payroll register', text: 'Factory wages earned December 27–31, to be paid on January 5: ₱48,000.', debit: 'Salaries Expense', credit: 'Salaries Payable', amount: 48000, why: 'Accrued expense: the wages were incurred in December but are unpaid → Expense ↑, Liability ↑.' },
              { doc: 'Fire insurance policy', text: '₱120,000 paid on July 1 for one year of fire insurance, debited to Prepaid Insurance.', debit: 'Insurance Expense', credit: 'Prepaid Insurance', amount: 60000, why: '₱120,000 ÷ 12 = ₱10,000 a month × 6 months (July–December) = ₱60,000 expired.' },
              { doc: 'Asset register', text: 'Machinery cost ₱900,000, useful life 10 years, no salvage value. No depreciation recorded this year.', debit: 'Depreciation Expense', credit: 'Accumulated Depreciation', amount: 90000, why: 'Straight-line: (₱900,000 − ₱0) ÷ 10 years = ₱90,000 per year.' },
              { doc: 'Customer contract', text: '₱150,000 collected in advance on October 1 for 6 months of deliveries, credited to Unearned Revenue.', debit: 'Unearned Revenue', credit: 'Sales Revenue', amount: 75000, why: '₱150,000 ÷ 6 = ₱25,000 a month × 3 months (October–December) = ₱75,000 earned.' },
              { doc: 'Delivery receipts', text: 'Goods worth ₱35,000 were delivered to a customer on December 30 but not yet billed.', debit: 'Accounts Receivable', credit: 'Sales Revenue', amount: 35000, why: 'Accrued revenue: earned in December, not yet billed → Receivable ↑, Revenue ↑.' },
            ],
          }),
        },
        results: { metric: 'accuracy' },
        end: [
          { s: 'N', t: 'After completing the adjusting entries, the three of them finally have one last Voucher to adjust.' },
          { s: 'N', t: 'After all adjusting journal entries have been correctly prepared, the system generates the completed financial statements.', fx: 'statements' },
          { s: 'N', t: 'The reconstructed statements reveal that several revenues and expenses had been deliberately omitted, resulting in an overstated net income and misleading financial position.', fx: 'statements' },
          { s: 'N', t: 'Detective Alex reviews the completed reports.' },
          { s: 'A', t: 'The missing adjustments changed everything. The altered records concealed the company’s true financial condition. Now we have the evidence needed to expose the fraud.' },
          { s: 'N', t: 'Detective Alex gathers the corrected records and submits the complete investigation report to Headquarters.' },
          { s: 'N', t: 'Sending files to Headquarters...', fx: 'sending' },
          { s: 'N', t: 'A few moments later...' },
          { s: 'H', t: 'Excellent work, Detective. Your careful analysis uncovered the financial manipulation and completed the investigation. Thanks to your accounting expertise, the truth has finally been revealed.' },
          { s: 'N', t: 'CASE SOLVED', fx: 'solved' },
        ],
      },
    ],
  },
  {
    id: 'sc6',
    number: 6,
    title: 'The Arcadia Files',
    wip: true,
    company: 'Arcadia Corporation',
    tagline: 'Reports that won’t reconcile. Documents that were altered. Someone deliberately erased the paper trail.',
    background:
      "Arcadia Corporation is one of the country's largest manufacturing companies. For years, the company has maintained an excellent reputation with investors and government agencies. However, during a routine financial audit, investigators discovered inconsistencies within the company's accounting records. Several reports failed to reconcile, while multiple financial documents appeared to have been altered. Authorities suspect that someone inside the company has been manipulating accounting records to conceal financial irregularities.",
    detective:
      "Detective Alex Reyes is one of the Financial Crimes Division's most experienced investigators. Known for solving white-collar crimes through careful analysis rather than force, Detective Alex has been assigned to uncover the truth behind Arcadia Corporation. But this time the evidence doesn't add up. Someone deliberately erased the paper trail.",
    problem:
      'Initial investigations reveal that important accounting records have been tampered with. To uncover the fraud, Detective Alex must reconstruct the missing records by applying accounting principles correctly. Every puzzle solved uncovers another clue. Every accounting mistake corrected brings Detective Alex one step closer to identifying the culprit.',
    objectives: [
      'Understand accounting terminology',
      'Analyze accounting records',
      'Prepare adjusting journal entries',
      'Recognize how inaccurate records affect financial statements',
      'Apply accounting concepts in solving business fraud',
    ],
    topics: ['Accounting Concepts', 'Accounting Cycle', 'Adjusting Entries', 'Accrual Accounting', 'Trial Balance', 'Financial Statements'],
    prologue: [],
    levels: [
      {
        id: 1,
        title: 'Crossword Craze',
        setting: 'The Central Investigation Bureau — Detective Alex’s desk',
        story: [
          { s: 'N', t: 'It was another quiet afternoon at the Central Investigation Bureau. After closing his previous case, Detective finally had a moment to relax.' },
          { s: 'A', t: 'Alas! A coffee break after back-to-back cases.' },
          { s: 'N', t: 'With a warm cup of coffee in one hand and a newspaper in the other, he sat at his desk and began solving the crossword puzzle on the front page.', fx: 'newspaper' },
        ],
        briefing: {
          challenge: 'To unlock the first clue, complete the Accounting Crossword Puzzle by answering the accounting-related terms correctly. Every correct answer reveals part of the investigation.',
          objectives: ['Identify basic accounting concepts and terminology.', 'Recall important accounting vocabulary.', 'Complete the crossword puzzle to unlock the next clue.'],
          instructions: ['Read each crossword clue carefully.', 'Type the correct accounting term.', 'Every correct answer fills the crossword grid.', 'Complete all entries to unlock the hidden clue.'],
          hint: 'Review the clue carefully before answering. Correct spelling matters.',
        },
        game: {
          type: 'crossword',
          right: 'Correct! Great job! The answer has been added to the crossword.',
          wrong: 'Incorrect. That’s not quite right. Review the clue and try again.',
          cols: 6,
          rows: 8,
          words: [
            { n: 1, dir: 'across', x: 0, y: 0, answer: 'ASSETS', clue: 'Economic resources owned by a business.', explain: 'Assets are resources owned or controlled by a business that are expected to provide future economic benefits.' },
            { n: 2, dir: 'down', x: 3, y: 0, answer: 'EQUITY', clue: 'What is left to the owners after all liabilities are settled.', explain: 'Equity (owner’s equity or capital) is the residual interest in the assets after deducting liabilities: Assets − Liabilities.' },
            { n: 3, dir: 'down', x: 1, y: 2, answer: 'LEDGER', clue: 'The book of final entry, where each account’s balance is computed.', explain: 'The ledger groups the journal’s entries by account so each account’s balance can be computed.' },
            { n: 4, dir: 'across', x: 0, y: 3, answer: 'DEBIT', clue: 'The left side of an account.', explain: 'A debit is an entry on the left side of an account. Assets, expenses and drawing increase with debits.' },
            { n: 5, dir: 'across', x: 0, y: 7, answer: 'CREDIT', clue: 'The right side of an account.', explain: 'A credit is an entry on the right side of an account. Liabilities, equity and revenue increase with credits.' },
          ],
        },
        results: {
          metric: 'score',
          takeaways: ['Recognize common accounting terminology.', 'Strengthen accounting vocabulary.', 'Connect accounting concepts with real-world investigation scenarios.'],
          recommend: ({ score }) => ({
            by: 'N',
            text:
              score >= 4
                ? 'Excellent work, Detective! Your accounting knowledge helped uncover the first lead.'
                : score === 3
                  ? 'Good investigation. Review a few accounting terms before proceeding.'
                  : 'Consider reviewing the accounting concepts and retrying the crossword to improve your understanding.',
          }),
        },
        end: [
          { s: 'N', t: 'He flipped the newspaper over, expecting to read the day’s headlines.', fx: 'newspaper' },
          { s: 'N', t: '‼️ BREAKING NEWS — Arcadia Corporation under scrutiny. Authorities suspect financial fraud. Investigation ongoing.', fx: 'breaking' },
          { s: 'N', t: '📞 Riiiing... Riiiing...', fx: 'phone' },
          { s: 'A', t: 'This is Alex speaking.' },
          { s: 'H', t: 'You have a new assignment. You’re the one assigned to Arcadia Corporation. The files are on your computer.' },
          { s: 'N', t: 'After carefully examining the documents, Detective Alex noticed a peculiar discrepancy.' },
          { s: 'N', t: 'Transactions had been altered.' },
          { s: 'N', t: 'Hidden beneath the falsified records was a warehouse address.' },
        ],
      },
      {
        id: 2,
        title: 'Crack the Vault',
        setting: 'An abandoned warehouse on the outskirts of the city',
        story: [
          { s: 'N', t: 'Following the address, Detective Alex drove toward the outskirts of the city.' },
          { s: 'N', t: 'The road became narrower with every kilometer. Tall trees are everywhere. At the end of the road stood an old warehouse that had long been forgotten.' },
          { s: 'N', t: 'The rusty gate was slightly open.' },
          { s: 'A', t: 'If someone wanted to hide evidence, this would be the perfect place.' },
          { s: 'N', t: 'At the far end of the warehouse, hidden behind stacked crates, Detective Alex discovered a massive steel vault.' },
        ],
        briefing: {
          challenge: 'Solve the accounting questions to obtain the correct security code and unlock the vault. Each correct answer reveals one digit of the vault’s passcode.',
          objectives: ['Apply basic accounting to solve problems.', 'Analyze accounting transactions accurately.', 'Demonstrate understanding of the lesson through computation and decision-making.', 'Unlock the vault by obtaining the correct passcode.'],
          instructions: ['Read each accounting question carefully.', 'Solve the problem and select the correct answer.', 'Every correct answer reveals one digit of the vault code.', 'Complete all questions correctly to unlock the vault.'],
          hint: 'Accuracy is more important than speed. Double-check your computations before submitting.',
        },
        game: {
          type: 'vault',
          mode: 'each', // retry each question until it is right; every correct answer reveals a digit
          code: '83516',
          right: 'Correct! One digit of the vault code has been revealed.',
          wrong: 'Incorrect. Review the transaction carefully and try again.',
          questions: [
            {
              topic: 'Journal entries',
              q: 'The owner invested ₱500,000 cash in the business. Which entry records the investment?',
              choices: ['Dr Capital / Cr Cash ₱500,000', 'Dr Cash / Cr Capital ₱500,000', 'Dr Cash / Cr Service Revenue ₱500,000', 'Dr Cash / Cr Notes Payable ₱500,000'],
              answer: 1,
              steps: ['Cash (an asset) increases → debit Cash.', 'The owner’s investment increases equity → credit Capital.'],
              principle: 'Owner investments increase equity; they are not revenue.',
            },
            {
              topic: 'Adjusting entries',
              q: 'Equipment costing ₱600,000 has a 5-year useful life and no salvage value. What is the annual straight-line depreciation?',
              choices: ['₱100,000', '₱120,000', '₱150,000', '₱600,000'],
              answer: 1,
              steps: ['Depreciable cost = ₱600,000 − ₱0 = ₱600,000.', 'Annual depreciation = ₱600,000 ÷ 5 years = ₱120,000.'],
              principle: 'Straight-line depreciation = (Cost − Salvage Value) ÷ Useful Life.',
            },
            {
              topic: 'Accrual basis',
              q: 'Arcadia completed ₱25,000 of services on December 30 but will bill the client in January. What is the December 31 entry?',
              choices: ['No entry until it is billed', 'Dr Cash / Cr Service Revenue ₱25,000', 'Dr Accounts Receivable / Cr Service Revenue ₱25,000', 'Dr Service Revenue / Cr Accounts Receivable ₱25,000'],
              answer: 2,
              steps: ['The revenue is earned in December → Service Revenue increases (credit).', 'Cash has not been received → Accounts Receivable increases (debit).'],
              principle: 'Accrued revenue: Asset ↑ and Revenue ↑ when earned.',
            },
            {
              topic: 'Reversing entries',
              q: 'On December 31, Arcadia accrued ₱15,000 of salaries. What reversing entry may be made on January 1?',
              choices: ['Dr Salaries Payable / Cr Salaries Expense ₱15,000', 'Dr Salaries Expense / Cr Salaries Payable ₱15,000', 'Dr Salaries Payable / Cr Cash ₱15,000', 'Reversing entries are not allowed for accruals'],
              answer: 0,
              steps: ['A reversing entry is the exact opposite of the adjusting entry (Dr Salaries Expense / Cr Salaries Payable).', 'So debit Salaries Payable and credit Salaries Expense on January 1.'],
              principle: 'Reversing entries undo accrual adjustments at the start of the new period.',
            },
            {
              topic: 'Unearned revenue',
              q: 'On October 1, Arcadia received ₱90,000 for 6 months of services, credited to Unearned Revenue. How much is earned by December 31?',
              choices: ['₱15,000', '₱30,000', '₱45,000', '₱90,000'],
              answer: 2,
              steps: ['Monthly revenue = ₱90,000 ÷ 6 = ₱15,000.', 'October 1 to December 31 = 3 months.', 'Earned = ₱15,000 × 3 = ₱45,000.'],
              principle: 'Advance collection: earned = income, unearned = liability.',
            },
          ],
        },
        results: { metric: 'digits' },
        end: [
          { s: 'N', t: 'BEEP...' },
          { s: 'N', t: 'ACCESS GRANTED', fx: 'vault-open' },
          { s: 'N', t: 'The heavy steel vault slowly unlocks. With a loud metallic creak, the massive door swings open.', fx: 'vault-open' },
          { s: 'N', t: 'Inside were dozens of confidential accounting records.' },
        ],
      },
      {
        id: 3,
        title: 'Between Words and Letters',
        setting: 'Inside the vault room',
        story: [
          { s: 'N', t: 'Detective Alex checks the vault and inside were several sealed books and folders labeled: General Journal, General Ledger, Subsidiary Ledger, Bank Statements, Receipts, Employee Payroll, Confidential Files.' },
          { s: 'N', t: 'But what caught Detective Alex’s attention is the financial statements are missing.' },
        ],
        briefing: {
          challenge: 'Analyze the available accounting records and prepare the correct adjusting journal entries to restore the company’s books. Only after correcting the records can Detective Alex determine the company’s true financial position and complete the investigation.',
          objectives: ['Analyze incomplete accounting information.', 'Identify accounts requiring adjustment.', 'Prepare accurate adjusting journal entries.', 'Apply the accrual basis of accounting to ensure reliable financial reporting.'],
          instructions: ['Review the supporting documents and transaction details provided.', 'Identify the necessary adjusting entries.', 'Record the correct accounts and corresponding debit and credit amounts.', 'Submit all entries to reconstruct the company’s accounting records.'],
          hint: 'Consider common year-end adjustments such as accrued revenues, accrued expenses, prepaid expenses, unearned revenues, and depreciation.',
        },
        game: {
          type: 'adjust',
          by: 'N',
          right: 'Correct! The adjusting entry has been recorded successfully, bringing the company’s records closer to completion.',
          wrong: 'Incorrect. Review the transaction details and determine which accounts require adjustment before trying again.',
          set: adjustmentSet({
            revenueTitle: 'Service Revenue',
            revenue: 1850000,
            expenses: 1240000,
            accounts: ['Cash', 'Accounts Receivable', 'Supplies', 'Prepaid Rent', 'Delivery Van', 'Accumulated Depreciation', 'Utilities Payable', 'Salaries Payable', 'Unearned Revenue', 'Service Revenue', 'Utilities Expense', 'Rent Expense', 'Depreciation Expense', 'Supplies Expense', 'Salaries Expense'],
            items: [
              { doc: 'Electric bill', text: 'The December electric bill of ₱18,000 arrived on January 8. Nothing was recorded in December.', debit: 'Utilities Expense', credit: 'Utilities Payable', amount: 18000, why: 'Accrued expense: the electricity was used in December but is unpaid → Expense ↑, Liability ↑.' },
              { doc: 'Service report', text: 'Consulting services worth ₱40,000 were completed on December 28. The client will be billed on January 3.', debit: 'Accounts Receivable', credit: 'Service Revenue', amount: 40000, why: 'Accrued revenue: earned in December even though it is billed later → Receivable ↑, Revenue ↑.' },
              { doc: 'Lease agreement', text: '₱240,000 was paid on November 1 for 12 months of warehouse rent, debited to Prepaid Rent.', debit: 'Rent Expense', credit: 'Prepaid Rent', amount: 40000, why: '₱240,000 ÷ 12 = ₱20,000 a month × 2 months (November–December) = ₱40,000 expired.' },
              { doc: 'Client contract', text: '₱90,000 was received on October 1 for 6 months of services, credited to Unearned Revenue.', debit: 'Unearned Revenue', credit: 'Service Revenue', amount: 45000, why: '₱90,000 ÷ 6 = ₱15,000 a month × 3 months (October–December) = ₱45,000 earned.' },
              { doc: 'Asset register', text: 'Delivery van cost ₱1,000,000, salvage value ₱100,000, useful life 5 years. No depreciation recorded this year.', debit: 'Depreciation Expense', credit: 'Accumulated Depreciation', amount: 180000, why: 'Straight-line: (₱1,000,000 − ₱100,000) ÷ 5 years = ₱180,000 per year.' },
              { doc: 'Supplies count', text: 'The Supplies account shows ₱30,000. The year-end count found ₱8,500 on hand.', debit: 'Supplies Expense', credit: 'Supplies', amount: 21500, why: 'Supplies used = ₱30,000 − ₱8,500 = ₱21,500 → Expense ↑, Asset ↓.' },
            ],
          }),
        },
        results: { metric: 'accuracy' },
        end: [
          { s: 'N', t: 'After all adjusting journal entries have been correctly prepared, the system generates the completed financial statements.', fx: 'statements' },
          { s: 'N', t: 'The reconstructed statements reveal that several revenues and expenses had been deliberately omitted, resulting in an overstated net income and misleading financial position.', fx: 'statements' },
          { s: 'N', t: 'Detective Alex reviews the completed reports.' },
          { s: 'A', t: 'The missing adjustments changed everything. The altered records concealed the company’s true financial condition. Now we have the evidence needed to expose the fraud.' },
          { s: 'N', t: 'Detective Alex gathers the corrected records and submits the complete investigation report to Headquarters.' },
          { s: 'N', t: 'Sending files to Headquarters...', fx: 'sending' },
          { s: 'N', t: 'A few moments later...' },
          { s: 'H', t: 'Excellent work, Detective. Your careful analysis uncovered the financial manipulation and completed the investigation. Thanks to your accounting expertise, the truth has finally been revealed.' },
          { s: 'N', t: 'CASE SOLVED', fx: 'solved' },
        ],
      },
    ],
  },
];

export { peso };
