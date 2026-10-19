// Case files for the Entry Point web module.
// Every case has its own mini-game. Cases follow the FAR1 sequence (each one harder than the last),
// and each case has four levels that ramp up: harder questions, shorter timers and fewer hearts.
import { genSort, genTAccount, genEntry, genAdjust, genTB, rng, shuffle } from './generators.js';
import { quiz001L1, quiz001L2, quiz001L3, quiz001L4 } from './quiz001.js';

export const TIERS = ['Rookie', 'Rising Star', 'Expert', 'Boss Round'];

function shuffleChoices(q, r) {
  const order = shuffle(r, q.choices.map((_, i) => i));
  return { ...q, choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer) };
}

// A new question order and choice order on every attempt (each attempt gets a new random seed).
function quizRounds(questions, seed) {
  const r = rng(seed);
  return shuffle(r, questions).map((q) => ({ type: 'quiz', ...shuffleChoices(q, r) }));
}

// Builds a case's four levels from per-level settings.
function levels(caseId, settings) {
  return settings.map((s, i) => ({
    id: i + 1,
    tier: i + 1,
    title: TIERS[i],
    hearts: s.hearts,
    time: s.time,
    rounds: s.rounds,
    intro: s.intro,
    summary: s.summary,
    build: (seed) => s.build(seed),
  }));
}

export const cases = [
  {
    id: '001',
    name: "Nayeom's Groceria",
    shortType: 'Sari-Sari Store',
    category: 'Retail Industry',
    owner: 'Nayeom',
    difficulty: 1,
    game: {
      name: 'Record It or Not?',
      sprite: 'coin',
      tagline: 'Spot the real transactions and make the right call before time runs out.',
      rules: ['Read the business event and choose the best answer.', 'Correct answers in a row build your COMBO multiplier.', 'Wrong answers cost a heart — and show you the full solution.'],
    },
    description:
      "Welcome to Nayeom's Groceria! As the store gets busier, Nayeom's records are a mess. Some events were never recorded, others were classified incorrectly. Help her sort it out.",
    avatar: { hair: '#1F1A17', hairStyle: 'long', skin: '#F5D0B5', outfit: '#166534', accent: '#FFFFFF' },
    art: { sign: "NAYEOM'S", sub: 'GROCERIA', wall: '#9A3412', roof: '#7C2D12', awning: ['#166534', '#F8FAFC'], glow: '#FCD34D', kind: 'grocery' },
    levels: levels('001', [
      {
        hearts: 3, time: 35, rounds: 8, summary: 'Decide which events are transactions and which accounts they affect.',
        intro: [
          "Welcome back! This week has been really busy at Nayeom's Groceria — purchases, sales, deliveries, and a few surprises.",
          "Here's the tricky part: not everything that happens in the store is an accounting transaction.",
          'As my accounting assistant, help me decide what to record and how it affects our accounts.',
        ],
        build: (seed) => quizRounds(quiz001L1, seed),
      },
      {
        hearts: 3, time: 30, rounds: 6, summary: 'Write journal entries, post them, and compute balances.',
        intro: ['Great sorting! Now we write proper journal entries and post them to the ledger.', 'The timer is a little shorter this time. Ready?'],
        build: (seed) => quizRounds(quiz001L2, seed),
      },
      {
        hearts: 2, time: 30, rounds: 6, summary: 'Split payments, advances, prepayments and the accounting equation.',
        intro: ['Expert level! These are the tricky ones: split payments, money received in advance, and personal spending.', 'You only have 2 hearts now. Think before you tap!'],
        build: (seed) => quizRounds(quiz001L3, seed),
      },
      {
        hearts: 2, time: 25, rounds: 6, summary: 'Boss round: accounting equation, error analysis and capital.',
        intro: ['Boss round! I need you to check my whole month — equity, errors, net income and capital.', 'Two hearts, 25 seconds each. Let’s do this, partner!'],
        build: (seed) => quizRounds(quiz001L4, seed),
      },
    ]),
  },
  {
    id: '002',
    name: 'Alahas ni Lukas',
    shortType: 'Jewelry Store',
    category: 'Retail Store',
    owner: 'Lukas',
    difficulty: 2,
    game: {
      name: 'Debit or Credit Vault',
      sprite: 'star',
      tagline: 'Accounts fly in fast — drop each one into its DEBIT or CREDIT vault.',
      rules: ['Each card is an account. Send it to the vault of its NORMAL balance.', 'Tap a vault or use the ← / → arrow keys. Be quick!', 'Watch out for contra accounts in higher levels.'],
    },
    description:
      "Lukas's fine jewelry shop is growing, but his new staff keep putting accounts on the wrong side. Sort every account into its proper vault before the timer runs out.",
    avatar: { hair: '#3F2A1D', hairStyle: 'short', skin: '#E8B996', outfit: '#7F1D1D', accent: '#FCD34D' },
    art: { sign: 'Alahas ni Lukas', sub: 'FINE JEWELRY', wall: '#5B3A29', roof: '#3B2416', awning: ['#6B21A8', '#4C1D95'], glow: '#FDE68A', kind: 'jewelry' },
    levels: levels('002', [
      {
        hearts: 3, time: 10, rounds: 8, summary: 'Basic assets, liabilities, equity, revenue and expenses.',
        intro: ['Magandang araw! I keep my accounts in two vaults: DEBIT and CREDIT.', 'Every account has a normal balance. Send each one to the right vault — fast!', 'Assets and expenses go to DEBIT. Liabilities, equity and revenue go to CREDIT.'],
        build: (seed) => genSort(1, 8, seed),
      },
      {
        hearts: 3, time: 8, rounds: 10, summary: 'Drawing, prepaid and unearned accounts join the mix.',
        intro: ['Level 2: new accounts like Drawing, Prepaid Insurance and Unearned Revenue — and only 8 seconds each.'],
        build: (seed) => genSort(2, 10, seed),
      },
      {
        hearts: 2, time: 7, rounds: 10, summary: 'Contra accounts: they carry the opposite balance.',
        intro: ['Expert vault! Contra accounts are sneaky — they carry the OPPOSITE balance of the account they reduce.', '2 hearts, 7 seconds. Stay sharp!'],
        build: (seed) => genSort(3, 10, seed),
      },
      {
        hearts: 2, time: 6, rounds: 12, summary: 'Boss: purchases accounts, payables and receivables at speed.',
        intro: ['Boss vault! Purchases, freight, discounts, taxes payable — 12 cards, 6 seconds each.'],
        build: (seed) => genSort(4, 12, seed),
      },
    ]),
  },
  {
    id: '003',
    name: "Surume's Coffee Shop",
    shortType: 'Coffee Shop',
    category: 'Food & Beverage',
    owner: 'Surume',
    difficulty: 3,
    game: {
      name: 'T-Account Café',
      sprite: 'heart',
      tagline: 'Post every order to the right side of each T-account and keep the ledger balanced.',
      rules: ['Tap DR (left) or CR (right) on each affected T-account, then Post.', 'Your ledger fills up as you go — it helps in the bonus round.', 'Higher levels add a decoy account. Leave it empty!'],
    },
    description:
      "Surume's café is the favorite study spot near campus, but the ledger is a disaster. Post each transaction to its T-accounts, then prove the balances add up.",
    avatar: { hair: '#6B3F1D', hairStyle: 'bob', skin: '#F2C9A8', outfit: '#78350F', accent: '#FDE68A' },
    art: { sign: "Surume's", sub: 'Coffee Shop', wall: '#6B4226', roof: '#422716', awning: ['#166534', '#FEF3C7'], glow: '#FCD34D', kind: 'coffee' },
    levels: levels('003', [
      {
        hearts: 3, time: 30, rounds: 6, summary: 'Cash transactions and an ending-balance bonus.',
        intro: ["Hi! Welcome to Surume's Coffee Shop. Grab a seat — the cold brew is on the house.", 'My T-accounts are empty. Post each transaction: debits on the LEFT, credits on the RIGHT.', "At the end there's a bonus round about the balance you built!"],
        build: (seed) => genTAccount(1, 5, seed),
      },
      {
        hearts: 3, time: 25, rounds: 7, summary: 'Credit sales, payables and collections.',
        intro: ['Level 2: now customers pay later and I buy on account. Watch Accounts Receivable and Payable!'],
        build: (seed) => genTAccount(2, 6, seed),
      },
      {
        hearts: 2, time: 25, rounds: 8, summary: 'Prepayments, advances, loans — plus a decoy account.',
        intro: ['Expert shift! A decoy T-account will show up — only two accounts are really affected.', 'The bonus round may ask about any account, not just Cash.'],
        build: (seed) => genTAccount(3, 7, seed),
      },
      {
        hearts: 2, time: 20, rounds: 9, summary: 'Boss: earned advances, loan repayments, interest and bills.',
        intro: ['Boss shift! Eight transactions, decoys, 20 seconds each, and a final balance check.'],
        build: (seed) => genTAccount(4, 8, seed),
      },
    ]),
  },
  {
    id: '004',
    name: 'SwiftGo Delivery Services',
    shortType: 'Delivery Service',
    category: 'Delivery and Logistic Services',
    owner: 'Dispatch Manager',
    difficulty: 4,
    game: {
      name: 'Journal Entry Express',
      sprite: 'bolt',
      tagline: 'Build each journal entry: pick the accounts, compute the amount, deliver before the clock runs out.',
      rules: ['Tap the DEBIT slot, then an account. Do the same for CREDIT.', 'Compute the amount with the number pad.', 'Speed bonus for fast deliveries — accuracy first!'],
    },
    description:
      'SwiftGo delivers parcels across the city. Every delivery, fuel stop and payroll run needs a correct journal entry — often with a quick computation first.',
    avatar: { hair: '#111827', hairStyle: 'short', skin: '#D9A47F', outfit: '#C2410C', accent: '#FFFFFF' },
    art: { sign: 'SWIFTGO', sub: 'DELIVERY SERVICES', wall: '#374151', roof: '#1F2937', awning: ['#EA580C', '#F8FAFC'], glow: '#FDBA74', kind: 'delivery' },
    levels: levels('004', [
      {
        hearts: 3, time: 50, rounds: 5, summary: 'Two-account entries with the amounts given.',
        intro: ['SwiftGo dispatch here! The paperwork is piling up faster than the parcels.', 'Build each journal entry: one debit account, one credit account, and the amount.', 'Deliver them accurately and quickly for bonus points!'],
        build: (seed) => genEntry(1, 5, seed),
      },
      {
        hearts: 3, time: 45, rounds: 6, summary: 'Compute the amount first (parcels × rate, liters × price).',
        intro: ['Level 2: you have to compute the amounts now — parcels times rates, liters times price.'],
        build: (seed) => genEntry(2, 6, seed),
      },
      {
        hearts: 2, time: 45, rounds: 6, summary: 'Discounts, advance payments and multi-step amounts.',
        intro: ['Expert route! Discounts, advance payments, and amounts with two steps. More decoy accounts too.'],
        build: (seed) => genEntry(3, 6, seed),
      },
      {
        hearts: 2, time: 40, rounds: 7, summary: 'Boss: interest, partial earnings and combined costs.',
        intro: ['Boss route! Interest for part of a year, revenue earned from advances, and combined repair bills.'],
        build: (seed) => genEntry(4, 7, seed),
      },
    ]),
  },
  {
    id: '005',
    name: 'Lakwatsa Deliver Services',
    shortType: 'Delivery Service',
    category: 'Adjusting Entries',
    owner: 'Lakwatsa',
    difficulty: 5,
    game: {
      name: 'Adjustment Detective',
      sprite: 'calculator',
      tagline: 'Crack each year-end clue: name the adjustment, then pick the correct adjusting entry.',
      rules: ['Step 1: classify the adjustment (accrual, deferral or depreciation).', 'Step 2: choose the adjusting entry with the right amount.', 'Both steps must be correct to solve the case.'],
    },
    description:
      'Year-end at Lakwatsa: the books ignore expired insurance, unpaid salaries and worn-out vans. Investigate each clue and write the adjusting entries.',
    avatar: { hair: '#2E1F14', hairStyle: 'short', skin: '#EBC09C', outfit: '#1E3A8A', accent: '#FCD34D' },
    art: { sign: 'LAKWATSA', sub: 'CASE BUREAU', wall: '#4B5563', roof: '#374151', awning: ['#1E3A8A', '#F8FAFC'], glow: '#FDE68A', kind: 'bureau' },
    levels: levels('005', [
      {
        hearts: 3, time: 50, rounds: 4, summary: 'Supplies used, unpaid salaries, unbilled and earned revenue.',
        intro: ["Lakwatsa here. It's year-end, and my books have gaps everywhere.", 'For each clue, name the type of adjustment first — then pick the correct adjusting entry.', "Cash already moved? That's a deferral. Not yet? An accrual."],
        build: (seed) => genAdjust(1, 4, seed),
      },
      {
        hearts: 3, time: 45, rounds: 5, summary: 'Months elapsed: insurance, rent, advances and depreciation.',
        intro: ['Level 2: count the months! Insurance, rent and advance payments that cover part of the year.'],
        build: (seed) => genAdjust(2, 5, seed),
      },
      {
        hearts: 2, time: 50, rounds: 6, summary: 'Straight-line depreciation, payroll days and accrued interest.',
        intro: ['Expert file: straight-line depreciation with salvage values, partial payroll weeks and interest on notes.'],
        build: (seed) => genAdjust(3, 6, seed),
      },
      {
        hearts: 2, time: 45, rounds: 6, summary: 'Boss: combined supplies, interest payable and mixed clues.',
        intro: ['Boss case! Every type of adjustment, harder numbers, two hearts. Show me what you’ve got, detective.'],
        build: (seed) => genAdjust(4, 6, seed),
      },
    ]),
  },
  {
    id: '006',
    name: 'Sanvitog Delivery',
    shortType: 'Delivery Service',
    category: 'Trial Balance & Worksheet',
    owner: 'Sanvitog',
    difficulty: 6,
    game: {
      name: 'Balance the Books',
      sprite: 'star',
      tagline: 'Fix broken trial balances: find missing amounts and misplaced accounts.',
      rules: ['Total debits must equal total credits.', 'Type the missing balance with the number pad.', 'Boss level: find the account sitting in the wrong column.'],
    },
    description:
      "Sanvitog's trial balances never balance. Find the missing amounts and the misplaced accounts so the books can finally close.",
    avatar: { hair: '#4A2E1A', hairStyle: 'long', skin: '#E0B08C', outfit: '#0F766E', accent: '#FFFFFF' },
    art: { sign: 'SANVITOG', sub: 'DELIVERY', wall: '#334155', roof: '#1E293B', awning: ['#0F766E', '#F8FAFC'], glow: '#FDBA74', kind: 'delivery' },
    levels: levels('006', [
      {
        hearts: 3, time: 60, rounds: 4, summary: 'Short trial balances with the total shown.',
        intro: ["I'm Sanvitog. Every month my trial balance has a hole in it.", 'Remember: total debits always equal total credits. Use that to find the missing amount.'],
        build: (seed) => genTB(1, 4, seed),
      },
      {
        hearts: 3, time: 60, rounds: 5, summary: 'Longer trial balances with the total still shown.',
        intro: ['Level 2: more accounts per trial balance. Add carefully!'],
        build: (seed) => genTB(2, 5, seed),
      },
      {
        hearts: 2, time: 55, rounds: 5, summary: 'No totals given; contra accounts and drawing included.',
        intro: ['Expert level: no totals given, and contra accounts like Accumulated Depreciation join in.'],
        build: (seed) => genTB(3, 5, seed),
      },
      {
        hearts: 2, time: 50, rounds: 6, summary: 'Boss: missing amounts plus misplaced accounts.',
        intro: ['Boss level! Some trial balances have an account in the WRONG column. Find it.'],
        build: (seed) => genTB(4, 6, seed),
      },
    ]),
  },
];
