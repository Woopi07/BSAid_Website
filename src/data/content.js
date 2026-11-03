// Copy for the BSAid landing page.

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Story', href: '#story' },
  { label: 'Gameplay', href: '#gameplay' },
  { label: 'Notes', href: '#notes' },
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

// The business owners players help in the first case files (avatars match their in-game portraits).
export const characters = [
  {
    id: 'nayeom',
    name: 'Nayeom',
    role: "Owner, Nayeom's Groceria",
    tagline: 'The hardworking sari-sari store owner',
    business: 'Sari-Sari Store · Retail',
    caseFile: 'Case #001 · Record It or Not?',
    topic: 'Transaction Analysis',
    avatar: { hair: '#1F1A17', hairStyle: 'long', skin: '#F5D0B5', outfit: '#166534', accent: '#FFFFFF' },
    traits: ['Hardworking', 'Warm', 'Hands-on', 'Always busy'],
    bio: "Nayeom runs Nayeom's Groceria, the neighborhood sari-sari store, and handles almost everything herself — purchases, sales, deliveries and the regulars who drop by for a chat. As the store gets busier, her records fall behind: some events were never recorded, others were classified incorrectly, and she can't always tell what even counts as a transaction.",
    hook: 'She hires you as her accounting assistant to decide what to record — and how each event affects her accounts.',
  },
  {
    id: 'lukas',
    name: 'Lukas',
    role: 'Owner, Alahas ni Lukas',
    tagline: 'The meticulous jeweler',
    business: 'Jewelry Store · Retail',
    caseFile: 'Case #002 · Debit or Credit Vault',
    topic: 'Normal Balances',
    avatar: { hair: '#3F2A1D', hairStyle: 'short', skin: '#E8B996', outfit: '#7F1D1D', accent: '#FCD34D' },
    traits: ['Meticulous', 'Proud craftsman', 'Particular', 'Growing business'],
    bio: 'Lukas built Alahas ni Lukas piece by piece, and he treats his books the same way he treats fine jewelry — every account belongs in its proper place. Business is growing, but his new staff keep putting accounts on the wrong side, and the mix-ups are starting to cost him.',
    hook: 'He keeps his accounts in two vaults, DEBIT and CREDIT, and needs you to sort every one into the right vault.',
  },
  {
    id: 'surume',
    name: 'Surume',
    role: "Owner, Surume's Coffee Shop",
    tagline: 'The café owner every student knows',
    business: 'Coffee Shop · Food & Beverage',
    caseFile: 'Case #003 · T-Account Café',
    topic: 'Posting to T-Accounts',
    avatar: { hair: '#6B3F1D', hairStyle: 'bob', skin: '#F2C9A8', outfit: '#78350F', accent: '#FDE68A' },
    traits: ['Friendly', 'Generous', 'Laid-back', 'Student favorite'],
    bio: "Surume's Coffee Shop is the favorite study spot near campus — and Surume is the kind of owner who slips you a free cold brew during exam week. Behind the counter, though, the ledger is a disaster: transactions pile up unposted and nobody is sure the balances add up.",
    hook: 'She asks you to post every transaction to its T-accounts and prove the balances are right.',
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
    body: 'Read each business event and decide whether it is recorded, which accounts it affects, and which are debited or credited.',
    icon: 'analyze',
  },
  {
    step: '02',
    title: 'Journalize & Post',
    body: 'Record complete journal entries, then post them to the ledger and T-accounts to get each balance.',
    icon: 'journal',
  },
  {
    step: '03',
    title: 'Adjusting Entries',
    body: 'Update the accounts at period end for accruals, deferrals and depreciation.',
    icon: 'review',
  },
  {
    step: '04',
    title: 'Worksheets',
    body: 'Build the unadjusted and adjusted trial balances and complete the worksheet.',
    icon: 'worksheet',
  },
  {
    step: '05',
    title: 'Closing Entries',
    body: 'Close revenue, expense and drawing accounts to capital so the books are ready for the next period.',
    icon: 'check',
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
