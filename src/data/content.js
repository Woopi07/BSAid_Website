// All copy on the site is sourced from Game-Design-Document.pdf (Version 1, June 4, 2025).

// Replace with the real Play Store / APK link once the build is published.
export const ANDROID_DOWNLOAD_URL = '#download';
export const GDD_URL = '/Game-Design-Document.pdf';

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Story', href: '#story' },
  { label: 'Gameplay', href: '#gameplay' },
  { label: 'Case Files', href: '#case-files' },
  { label: 'Help System', href: '#help' },
  { label: 'Play Online', href: '/play/' },
];

export const genres = ['Visual Novel', 'Edutainment', 'Simulation', 'Puzzle', 'RPG'];

export const designGoals = [
  {
    title: 'Challenges, quests & mini-games',
    body: 'Fundamental accounting topics become engaging challenges, quests, and learning activities instead of dry drills.',
  },
  {
    title: 'Realistic business scenarios',
    body: 'Work through the books of real-world small businesses to sharpen critical thinking and decision-making.',
  },
  {
    title: 'Immediate feedback',
    body: 'Learn from every entry with instant feedback that explains the accounting principle behind the answer.',
  },
  {
    title: 'Progression & rewards',
    body: 'Earn ranks, coins, and points, unlock achievements, and spend rewards on cosmetics for your character and room.',
  },
];

export const locations = [
  {
    name: 'University Campus',
    body: 'The central hub where you navigate areas, meet characters, and progress through the storyline.',
    icon: 'campus',
  },
  {
    name: 'Classrooms',
    body: 'Where accounting lessons, discussions, and topic-based instructional events take place.',
    icon: 'classroom',
  },
  {
    name: 'Library',
    body: 'Review concepts, access supplementary materials, and take on optional learning activities.',
    icon: 'library',
  },
  {
    name: 'Student Areas',
    body: 'Common spaces to chat with NPCs, receive quests, and experience student life beyond academics.',
    icon: 'student',
  },
  {
    name: 'Simulation Areas',
    body: 'Specialized spaces for accounting challenges, exercises, and mini-games.',
    icon: 'simulation',
  },
];

export const characters = [
  {
    id: 'faraday',
    name: 'Faraday',
    role: 'Your childhood friend',
    tagline: 'The quirky natural genius',
    initials: 'Fd',
    theme: 'gold',
    subject: 'Inspired by FAR',
    traits: ['Optimistic', 'Adventurous', 'Born genius', 'Candid'],
    bio: 'A freshman regarded as a born genius despite his quirkiness. Faraday can master new skills in an incredibly short time, yet he never quite understands why others struggle with things he finds easy. His candid "geniusness" has cost him friends, but he will always try his best to help anyone who asks.',
    hook: 'He begged you to join him in the Accountancy Program so he could follow in his sister’s footsteps.',
  },
  {
    id: 'farahnaz',
    name: 'Farahnaz',
    role: 'Faraday’s older sister',
    tagline: 'The strict, top-ranking CPA alumna',
    initials: 'Fz',
    theme: 'navy',
    subject: 'Inspired by AFAR',
    traits: ['Disciplined', 'Hardworking', 'Never cuts corners', 'Reserved'],
    bio: 'A well-respected alumna who ranked first in the most recent CPA Licensure Examination and has letters of recruitment from respected firms. Where Faraday learns in a flash, Farahnaz relentlessly hones her skills through rigorous practice — a difference that has quietly pushed the siblings apart.',
    hook: 'Things take a turn when she finds out her younger brother enrolled in Accountancy.',
  },
];

export const branches = [
  {
    label: 'Branch 1',
    title: 'Scholarship Pressure',
    cast: 'Macy & Baxter',
    body: 'Baxter urges Macy to focus so she can keep her scholarship. Despite her best efforts, Macy fails most of her quizzes and wonders where her old high scores went.',
    themes: ['Gifted Kid Burnout', 'Course Mismatch', 'Mental Health'],
  },
  {
    label: 'Branch 3',
    title: 'After-Hours at the Library',
    cast: 'Philip Defensor, Assistant Librarian',
    body: 'When Faraday rushes off to do a favor, the assistant librarian invites you to a board game — and a conversation that turns surprisingly deep. Bakit may multo?',
    themes: ['Paranormal Activity', 'Lingering Regrets', 'Moving On'],
  },
];

export const coreMechanics = [
  {
    step: '01',
    title: 'Analyze Transactions',
    body: 'Read each business event and decide which accounts are debited and which are credited.',
    icon: 'analyze',
  },
  {
    step: '02',
    title: 'Journalize',
    body: 'Record complete journal entries with the right accounts and amounts using the in-game calculator.',
    icon: 'journal',
  },
  {
    step: '03',
    title: 'Post to T-Accounts',
    body: 'Carry each entry to its T-account and keep the accounting equation in balance.',
    icon: 'taccount',
  },
  {
    step: '04',
    title: 'Trial Balances & Worksheets',
    body: 'Build unadjusted and adjusted trial balances, then complete the worksheet to close the books.',
    icon: 'worksheet',
  },
];

export const caseFiles = [
  {
    id: '01',
    name: 'Sari-Sari Store',
    topic: 'Debit-Credit & Journalizing',
    difficulty: 1,
    icon: 'store',
    levels: [
      'Multiple choice theory on financial transactions, debits & credits, and journalizing',
      'Identify the normal balance of line items — debit or credit',
      'Analyze transactions to find which accounts are debited or credited',
      'Create the journal entry for each given transaction',
    ],
    special: {
      name: 'Journal Jamboree',
      levels: ['Journalizing questions — medium difficulty', 'Journalizing questions — hard difficulty'],
    },
  },
  {
    id: '02',
    name: 'Coffee Shop',
    topic: 'Posting & Unadjusted Trial Balance',
    difficulty: 2,
    icon: 'coffee',
    levels: [
      'Multiple choice theory on posting and trial balances',
      'Post journal entries to T-accounts',
      'Solve problems using the accounting equation',
      'Prepare an unadjusted trial balance from T-accounts',
    ],
    special: {
      name: 'Balancing the Books',
      levels: [
        'Short comprehensive problem → unadjusted trial balance',
        'Long comprehensive problem → unadjusted trial balance',
      ],
    },
  },
  {
    id: '03',
    name: 'Jewelry Store',
    topic: 'Adjusting Entries',
    difficulty: 3,
    icon: 'gem',
    levels: [
      'Multiple choice theory on adjusting entries',
      'Analyze accrual transactions — adjust or leave be',
      'Analyze deferral transactions — adjust or leave be',
      'Adjust accounts on a given trial balance',
    ],
    special: {
      name: 'Apparent Adjustments',
      levels: [
        'Short comprehensive problems on required adjustments',
        'More comprehensive problems on required adjustments',
      ],
    },
  },
  {
    id: '04',
    name: 'Supermarket',
    topic: 'Adjusted Trial Balance & Worksheet',
    difficulty: 4,
    icon: 'cart',
    levels: [
      'Multiple choice theory on adjusted trial balances and worksheets',
      'Reflect adjustments onto the unadjusted trial balance',
      'Build a worksheet from adjusted trial balances to close the books',
    ],
    special: {
      name: 'Worksheet Worries',
      levels: [
        'Short comprehensive problems → adjusted trial balance & worksheet',
        'Long comprehensive problems → adjusted trial balance & worksheet',
      ],
    },
  },
];

export const ranks = [
  { rank: 'S', mistakes: '0 mistakes', points: 100 },
  { rank: 'A', mistakes: '1–2 mistakes', points: 80 },
  { rank: 'B', mistakes: '3–5 mistakes', points: 60 },
  { rank: 'C', mistakes: '5–7 mistakes', points: 40 },
  { rank: 'D', mistakes: '7+ mistakes', points: 20 },
];

export const multipliers = ['x1.0', 'x1.5', 'x2.0', 'x2.5'];

export const helpFeatures = [
  { title: 'Tutorial Mode', body: 'Guided walkthroughs that teach each mechanic before you play it.', icon: 'tutorial' },
  { title: 'Hints & Guidance', body: 'Stuck on an entry? Tap the light bulb for a nudge in the right direction.', icon: 'hint' },
  { title: 'Error Explanations', body: 'Wrong answers come with a clear explanation of the accounting principle involved.', icon: 'error' },
  { title: 'Correct Solution Review', body: 'See your answer side-by-side with the correct solution to learn from every mistake.', icon: 'review' },
  { title: 'Accounting Tips', body: 'Bite-sized tips and refresher index cards open every level.', icon: 'tips' },
];

// Transactions for the interactive journal-entry demo in the hero.
export const demoAccounts = [
  'Cash',
  'Supplies',
  'Equipment',
  'Accounts Payable',
  'Owner’s Capital',
  'Sales',
  'Utilities Expense',
];

export const demoTransactions = [
  {
    text: 'The owner invests cash into the sari-sari store.',
    amount: 50000,
    debit: 'Cash',
    credit: 'Owner’s Capital',
    hint: 'Think about which accounts increase. An owner’s investment raises both assets and equity.',
    explanation: 'Cash (an asset) increases, so it is debited. Owner’s Capital (equity) increases, so it is credited.',
  },
  {
    text: 'Customer purchase — cash sale of goods.',
    amount: 5600,
    debit: 'Cash',
    credit: 'Sales',
    hint: 'Money comes in, and the store earns revenue.',
    explanation: 'Cash increases (debit). Sales is revenue, which increases equity and has a normal credit balance.',
  },
  {
    text: 'Paid the monthly electricity bill in cash.',
    amount: 900,
    debit: 'Utilities Expense',
    credit: 'Cash',
    hint: 'Expenses have a normal debit balance. What happens to Cash when you pay?',
    explanation: 'Utilities Expense increases (debit). Cash decreases, and assets decrease with a credit.',
  },
  {
    text: 'Bought a new chest freezer on account.',
    amount: 18000,
    debit: 'Equipment',
    credit: 'Accounts Payable',
    hint: '“On account” means you haven’t paid yet — you owe someone.',
    explanation: 'Equipment (an asset) increases with a debit. Accounts Payable (a liability) increases with a credit.',
  },
  {
    text: 'Purchased store supplies for cash.',
    amount: 1200,
    debit: 'Supplies',
    credit: 'Cash',
    hint: 'One asset goes up while another goes down.',
    explanation: 'Supplies increase (debit) while Cash decreases (credit). Total assets stay the same.',
  },
];

// Visual-novel style tutorial shown from the title screen's TUTORIAL option.
export const tutorialSteps = [
  {
    title: 'Welcome to BSAid!',
    line: 'Hey, it’s me, Faraday! You actually joined Accountancy with me — thank you! Let me show you how Entry Point works. It’s easier than it looks, promise.',
    icon: 'book',
  },
  {
    title: 'Pick a case file',
    line: 'Every business is a case file, and each one has its own mini-game — sorting, T-accounts, journal entries, adjustments and trial balances. All six cases are open from the start!',
    icon: 'store',
  },
  {
    title: 'Climb four levels',
    line: 'Each case has four levels: Rookie, Rising Star, Expert and the Boss Round. Every level is harder — fewer hearts, less time and tougher questions.',
    icon: 'branch',
  },
  {
    title: 'Hearts, timer & combos',
    line: 'Answer before the timer runs out. A wrong answer costs a heart, and losing all of them means Game Over. Chain correct answers for a combo that multiplies your points!',
    icon: 'analyze',
  },
  {
    title: 'Hints & calculator',
    line: 'Stuck? Tap HINT — it halves that round’s points. Need to compute? Open the CALCULATOR, then press “Use answer” to drop the result straight into your entry.',
    icon: 'hint',
  },
  {
    title: 'Learn from mistakes',
    line: 'Got one wrong? You’ll see your answer next to the correct solution, with every computation step. After a Game Over, a retake shuffles in new questions.',
    icon: 'review',
  },
  {
    title: 'Stars, ranks & coins',
    line: 'Fewer mistakes means more stars and a higher rank — zero mistakes is an S rank! Your score turns into coins, and clearing a level unlocks the next, harder one.',
    icon: 'gem',
  },
  {
    title: 'Achievements & daily goals',
    line: 'Open the trophy tab for three new daily goals every day, plus bronze, silver and gold milestones. Claim them for bonus coins and climb from Intern all the way to CPA!',
    icon: 'tips',
  },
];
