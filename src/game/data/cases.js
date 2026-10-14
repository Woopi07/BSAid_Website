// Case files for the Entry Point web module.
// Each case has 4 sequential levels; a level with no `questions` shows as "coming soon" once unlocked.

export const LEVEL_TITLES = ['Transaction Analysis', 'Journalizing and Posting', 'Adjusting Entries', 'Worksheet'];

const level = (index, extra = {}) => ({
  id: index + 1,
  title: LEVEL_TITLES[index],
  intro: [],
  questions: [],
  ...extra,
});

const RECORD_CHALLENGE = 'Decide whether each business event should be recorded, then apply the rules of debit and credit.';

export const cases = [
  {
    id: '001',
    name: "Nayeom's Groceria",
    shortType: 'Sari-Sari Store',
    category: 'Retail Industry',
    owner: 'Nayeom',
    difficulty: 3,
    tags: ['Full case', 'Easy to medium', 'Full accounting cycle'],
    description:
      "Welcome to Nayeom's Groceria! As the store becomes busier every day, Nayeom has started having difficulty keeping the accounting records organized. Some business activities have not been recorded, while others have been classified incorrectly.",
    avatar: { hair: '#1F1A17', hairStyle: 'long', skin: '#F5D0B5', outfit: '#166534', accent: '#FFFFFF' },
    art: { sign: "NAYEOM'S", sub: 'GROCERIA', wall: '#9A3412', roof: '#7C2D12', awning: ['#166534', '#F8FAFC'], glow: '#FCD34D', kind: 'grocery' },
    levels: [
      level(0, {
        summary: 'Decide which business events are transactions, then apply the rules of debit and credit.',
        intro: [
          "Welcome back! This week has been really busy at Nayeom's Groceria. We had purchases, customer sales, deliveries, and even a few unexpected events.",
          "But here's the tricky part — not everything that happens in the store is considered an accounting transaction.",
          'As my accounting assistant, I need your help deciding which business events should be recorded and how they affect our accounts.',
        ],
        questions: [
          {
            event: 'Nayeom hired a new cashier last week to help manage the store.',
            challenge: RECORD_CHALLENGE,
            prompt:
              "Before we start recording today's transactions, I remembered something from last week. We hired a new cashier to help manage the store. I was about to write it down in the accounting records, but I'm not sure if that's necessary yet. Can you decide what we should do?",
            choices: ['Record it in the accounting records', "Don't record it yet"],
            answer: 1,
            hint: 'Ask yourself: did any asset, liability, or equity change the moment the cashier was hired?',
            explanation:
              "Hiring someone doesn't change our assets, liabilities, or equity yet — no money or goods changed hands. We'll record salaries once the cashier has worked and earned them.",
          },
          {
            event: 'Nayeom bought canned goods worth ₱8,000 from a supplier and paid in cash.',
            challenge: 'Identify how this purchase affects the accounts.',
            prompt:
              "A supplier dropped off a fresh batch of canned goods for us to sell, and I paid ₱8,000 in cash right away. How should this go into our records?",
            choices: [
              'Debit Merchandise Inventory, Credit Cash',
              'Debit Cash, Credit Merchandise Inventory',
              'Debit Merchandise Inventory, Credit Sales',
              "Don't record it — it's just restocking",
            ],
            answer: 0,
            hint: 'Goods for resale came in, and money went out. Assets increase with a debit and decrease with a credit.',
            explanation:
              'Our stock of goods for resale went up, so Merchandise Inventory is debited. We paid in cash, so Cash — another asset — goes down with a credit.',
          },
          {
            event: 'A customer bought groceries worth ₱1,250 and paid in cash.',
            challenge: 'Apply the rules of debit and credit to a sale.',
            prompt: 'Our regular customer, Aling Rosa, just bought ₱1,250 worth of groceries and paid in cash. Which entry is right?',
            choices: ['Debit Sales, Credit Cash', 'Debit Cash, Credit Sales', 'Debit Cash, Credit Accounts Receivable'],
            answer: 1,
            hint: 'Cash came in. What kind of account is Sales, and what is its normal balance?',
            explanation:
              'Cash increased, so we debit Cash. Sales is revenue, which increases equity — revenue has a normal credit balance, so we credit Sales.',
          },
          {
            event: 'A new supplier emailed Nayeom a price list for rice and cooking oil.',
            challenge: RECORD_CHALLENGE,
            prompt:
              "A new supplier sent me their price list for rice and cooking oil. Their prices look cheaper! Should I record this now so we don't forget?",
            choices: ['Record it as a purchase', 'Record it as accounts payable', "Don't record it"],
            answer: 2,
            hint: 'Did we actually buy anything or promise to pay for anything yet?',
            explanation:
              "A price list is just information. Nothing was bought, sold, or owed, so it isn't a transaction. We only record it once we actually place and receive an order.",
          },
          {
            event: 'Nayeom bought a new chest freezer for ₱15,000 on account.',
            challenge: 'Identify the accounts affected by a purchase on credit.',
            prompt:
              "Our old freezer finally gave up, so I bought a new chest freezer for ₱15,000. The appliance store said I can pay them next month. How do we record this?",
            choices: [
              'Debit Equipment, Credit Accounts Payable',
              'Debit Equipment, Credit Cash',
              'Debit Accounts Payable, Credit Equipment',
              'Debit Freezer Expense, Credit Accounts Payable',
            ],
            answer: 0,
            hint: "“Pay next month” means no cash left yet — but now we owe someone. The freezer will be used for years.",
            explanation:
              "The freezer is an asset we'll use for years, so we debit Equipment. Since we'll pay later, we now owe the store — Accounts Payable, a liability, increases with a credit.",
          },
          {
            event: 'Nayeom took ₱2,000 from the cash register for personal use.',
            challenge: "Record the owner's withdrawal.",
            prompt:
              "I need to pay for my nephew's school project, so I took ₱2,000 from the store's cash register. Is that something we record?",
            choices: [
              'Debit Salaries Expense, Credit Cash',
              "Debit Nayeom, Drawing, Credit Cash",
              "Don't record it — it's the owner's money",
              "Debit Cash, Credit Nayeom, Capital",
            ],
            answer: 1,
            hint: "Business and personal money are kept separate. Withdrawals reduce the owner's equity.",
            explanation:
              "Taking business cash for personal use is a withdrawal. It reduces owner's equity, so we debit Nayeom, Drawing, and credit Cash because cash left the business.",
          },
          {
            event: 'Nayeom paid the monthly electricity bill of ₱1,800 in cash.',
            challenge: 'Apply the rules of debit and credit to an expense.',
            prompt: 'The electricity bill came in at ₱1,800 and I paid it in cash this morning. How should we record it?',
            choices: ['Debit Utilities Expense, Credit Cash', 'Debit Cash, Credit Utilities Expense', 'Debit Utilities Expense, Credit Accounts Payable'],
            answer: 0,
            hint: 'Expenses have a normal debit balance. Was the bill paid already or not?',
            explanation:
              'Electricity is a cost of running the store, so Utilities Expense increases with a debit. We already paid, so Cash decreases with a credit.',
          },
          {
            event: 'A customer promised to buy 10 sacks of rice from the store next month.',
            challenge: RECORD_CHALLENGE,
            prompt:
              "Mang Jun said he'll buy 10 sacks of rice from us next month for his carinderia. That's a big sale! Should we record it now?",
            choices: ['Record it as a sale now', 'Record it as accounts receivable', "Don't record it yet"],
            answer: 2,
            hint: 'Has anything actually been delivered or paid for yet?',
            explanation:
              "A promise isn't a transaction yet. No goods were delivered and no payment was received, so nothing changed in our accounts. We'll record the sale when it actually happens.",
          },
        ],
      }),
      level(1, {
        summary: 'Write journal entries and post them to T-accounts.',
        intro: [
          'Great job sorting out which events count! Now we need to write them down properly in the journal.',
          'Every entry needs at least one debit and one credit, and the totals must be equal.',
          'After journalizing, we post each amount to its T-account. Ready?',
        ],
        questions: [
          {
            event: 'A customer bought groceries worth ₱1,250 and paid in cash.',
            challenge: 'Choose the correct journal entry.',
            prompt: "Let's journalize Aling Rosa's ₱1,250 cash purchase. Which entry should go in the journal?",
            choices: ['Cash 1,250 / Sales 1,250', 'Sales 1,250 / Cash 1,250', 'Cash 1,250 / Accounts Receivable 1,250'],
            answer: 0,
            hint: 'In a journal entry, the debit line comes first and the credit line is indented below it.',
            explanation: 'The debit (Cash) is written first, then the credit (Sales) is indented below it. Both are ₱1,250, so the entry balances.',
          },
          {
            event: 'The ₱1,250 debit to Cash is being posted to the ledger.',
            challenge: 'Post the amount to the correct side of the T-account.',
            prompt: "Now let's post that ₱1,250 debit to Cash. Which side of the Cash T-account does it go on?",
            choices: ['Left side (debit)', 'Right side (credit)'],
            answer: 0,
            hint: 'Debit always means left.',
            explanation: 'Debits are always posted to the left side of a T-account, and credits to the right. Cash increases on the left.',
          },
          {
            event: 'Nayeom bought a chest freezer for ₱15,000 on account.',
            challenge: 'Choose the correct journal entry.',
            prompt: 'Which journal entry records the ₱15,000 freezer we bought on account?',
            choices: ['Equipment 15,000 / Cash 15,000', 'Equipment 15,000 / Accounts Payable 15,000', 'Accounts Payable 15,000 / Equipment 15,000'],
            answer: 1,
            hint: 'We have not paid yet.',
            explanation: 'Equipment is debited for the asset received, and Accounts Payable is credited because we owe the appliance store.',
          },
          {
            event: 'Nayeom paid ₱5,000 of the amount owed for the freezer.',
            challenge: 'Choose the correct journal entry.',
            prompt: 'I paid the appliance store ₱5,000 today as a partial payment. How do we journalize it?',
            choices: ['Accounts Payable 5,000 / Cash 5,000', 'Equipment 5,000 / Cash 5,000', 'Cash 5,000 / Accounts Payable 5,000'],
            answer: 0,
            hint: 'Paying a debt reduces what we owe. Liabilities decrease with a debit.',
            explanation: 'Paying part of the debt reduces Accounts Payable (debit) and reduces Cash (credit). Equipment stays the same — we already recorded it.',
          },
        ],
      }),
      level(2),
      level(3),
    ],
  },
  {
    id: '002',
    name: 'Alahas ni Lukas',
    shortType: 'Jewelry Store',
    category: 'Retail Store',
    owner: 'Lukas',
    difficulty: 3,
    tags: ['Full case', 'Medium', 'Full accounting cycle'],
    description:
      'Lukas runs a fine jewelry shop known for its gold necklaces and custom rings. Many customers buy on credit, and Lukas needs help keeping receivables and expenses straight.',
    avatar: { hair: '#3F2A1D', hairStyle: 'short', skin: '#E8B996', outfit: '#7F1D1D', accent: '#FCD34D' },
    art: { sign: 'Alahas ni Lukas', sub: 'FINE JEWELRY', wall: '#5B3A29', roof: '#3B2416', awning: ['#6B21A8', '#4C1D95'], glow: '#FDE68A', kind: 'jewelry' },
    levels: [
      level(0, {
        summary: 'Analyze credit sales, publicity, and store expenses.',
        intro: [
          "Magandang araw! Welcome to Alahas ni Lukas. Business has been sparkling lately — but my records? Not so much.",
          'Some of my customers pay later, and I keep mixing up what counts as a sale and what does not.',
          "Let's go through this week's events together.",
        ],
        questions: [
          {
            event: 'Lukas sold a gold necklace for ₱12,000; the customer will pay in 30 days.',
            challenge: 'Apply the rules of debit and credit to a credit sale.',
            prompt: 'A customer bought a ₱12,000 gold necklace and promised to pay in 30 days. How do we record this sale?',
            choices: ['Debit Cash, Credit Sales', 'Debit Accounts Receivable, Credit Sales', "Don't record until they pay"],
            answer: 1,
            hint: 'The necklace was already delivered. What does the customer now owe us?',
            explanation: 'The sale happened when the necklace was delivered. We earned revenue (credit Sales) and gained the right to collect later (debit Accounts Receivable).',
          },
          {
            event: 'A local newspaper featured Alahas ni Lukas in an article for free.',
            challenge: RECORD_CHALLENGE,
            prompt: 'A newspaper wrote a lovely article about my shop — for free! Surely that adds value. Should we record it?',
            choices: ['Record it as advertising expense', 'Record it as revenue', "Don't record it"],
            answer: 2,
            hint: 'Was there any exchange of money, goods, or services?',
            explanation: "Free publicity is great for business, but no money or resources changed hands, so there's nothing to record.",
          },
          {
            event: 'Lukas paid the monthly shop rent of ₱10,000 in cash.',
            challenge: 'Apply the rules of debit and credit to an expense.',
            prompt: 'I paid this month’s rent of ₱10,000 in cash. What is the correct entry?',
            choices: ['Debit Rent Expense, Credit Cash', 'Debit Cash, Credit Rent Expense', 'Debit Prepaid Rent, Credit Rent Expense'],
            answer: 0,
            hint: "This month's rent is used up this month.",
            explanation: 'Rent for the current month is an expense (debit Rent Expense). Cash went down, so we credit Cash.',
          },
        ],
      }),
      level(1),
      level(2),
      level(3),
    ],
  },
  {
    id: '003',
    name: "Surume's Coffee Shop",
    shortType: 'Coffee Shop',
    category: 'Food & Beverage',
    owner: 'Surume',
    difficulty: 3,
    tags: ['Full case', 'Medium', 'Full accounting cycle'],
    description:
      "Surume's cozy coffee shop is the favorite study spot near campus. Between buying beans, adding capital, and keeping customers happy, the books need a careful hand.",
    avatar: { hair: '#6B3F1D', hairStyle: 'bob', skin: '#F2C9A8', outfit: '#78350F', accent: '#FDE68A' },
    art: { sign: "Surume's", sub: 'Coffee Shop', wall: '#6B4226', roof: '#422716', awning: ['#166534', '#FEF3C7'], glow: '#FCD34D', kind: 'coffee' },
    levels: [
      level(0, {
        summary: 'Analyze supply purchases, owner investments, and customer feedback.',
        intro: [
          "Hi there! Welcome to Surume's Coffee Shop. Grab a seat — the cold brew is on the house.",
          "I'm great at making coffee, but bookkeeping makes my head spin.",
          "Help me figure out which of this week's events belong in the books?",
        ],
        questions: [
          {
            event: 'Surume bought coffee beans and milk worth ₱4,500 in cash.',
            challenge: 'Identify the accounts affected.',
            prompt: 'I restocked coffee beans and milk for ₱4,500 cash. We use these to make drinks. How do we record it?',
            choices: ['Debit Supplies, Credit Cash', 'Debit Cash, Credit Supplies', 'Debit Supplies, Credit Accounts Payable'],
            answer: 0,
            hint: 'Paid in cash, and the beans are on hand to be used later.',
            explanation: 'The beans and milk are supplies on hand — an asset — so we debit Supplies. Cash was paid, so we credit Cash.',
          },
          {
            event: 'Surume invested an additional ₱50,000 of personal cash into the business.',
            challenge: "Record the owner's investment.",
            prompt: "I put in ₱50,000 of my own savings so we can buy a second espresso machine. How is that recorded?",
            choices: ['Debit Cash, Credit Surume, Capital', 'Debit Cash, Credit Sales', 'Debit Surume, Capital, Credit Cash'],
            answer: 0,
            hint: "Cash came in, and the owner's stake in the business grew.",
            explanation: "The business received cash (debit Cash), and Surume's ownership increased (credit Surume, Capital). It's not revenue because nothing was sold.",
          },
          {
            event: 'A customer posted a 5-star online review of the coffee shop.',
            challenge: RECORD_CHALLENGE,
            prompt: 'Someone left us a 5-star review online! Should this go into the records?',
            choices: ['Record it as revenue', "Don't record it", 'Record it as goodwill'],
            answer: 1,
            hint: 'Did any money, goods, or services change hands?',
            explanation: 'A review is wonderful, but it has no measurable financial effect, so it is not recorded as a transaction.',
          },
        ],
      }),
      level(1),
      level(2),
      level(3),
    ],
  },
  {
    id: '004',
    name: 'SwiftGo Delivery Services',
    shortType: 'Delivery Service',
    category: 'Delivery and Logistic Services',
    owner: 'Dispatch Manager',
    difficulty: 4,
    tags: ['Full case', 'Medium to hard', 'Service business'],
    description:
      'SwiftGo delivers parcels across the city. As a service business, it earns revenue from deliveries — some paid right away, some billed to corporate clients.',
    avatar: { hair: '#111827', hairStyle: 'short', skin: '#D9A47F', outfit: '#C2410C', accent: '#FFFFFF' },
    art: { sign: 'SWIFTGO', sub: 'DELIVERY SERVICES', wall: '#374151', roof: '#1F2937', awning: ['#EA580C', '#F8FAFC'], glow: '#FDBA74', kind: 'delivery' },
    levels: [
      level(0, {
        summary: 'Analyze billed services, collections, and loans.',
        intro: [
          "SwiftGo dispatch here! We've delivered hundreds of parcels this week — and the paperwork is piling up.",
          'Some clients pay on the spot, others we bill. Plus, we just took out a loan for a new van.',
          "Let's make sure every transaction lands in the right account.",
        ],
        questions: [
          {
            event: 'SwiftGo completed deliveries for a client and billed ₱8,000, collectible next week.',
            challenge: 'Record revenue earned on account.',
            prompt: 'We finished ₱8,000 worth of deliveries for an online shop. They’ll pay next week. What’s the entry?',
            choices: ['Debit Accounts Receivable, Credit Service Revenue', 'Debit Cash, Credit Service Revenue', "Don't record until collected"],
            answer: 0,
            hint: 'The service is done, so the revenue is earned — even if cash comes later.',
            explanation: 'Revenue is recorded when earned. We credit Service Revenue and debit Accounts Receivable for the amount the client owes.',
          },
          {
            event: 'SwiftGo collected the ₱8,000 from the client.',
            challenge: 'Record a collection of receivables.',
            prompt: 'The online shop paid the ₱8,000 they owed us. How do we record the collection?',
            choices: ['Debit Cash, Credit Service Revenue', 'Debit Cash, Credit Accounts Receivable', 'Debit Accounts Receivable, Credit Cash'],
            answer: 1,
            hint: 'The revenue was already recorded last week.',
            explanation: 'We already recorded the revenue. Now Cash increases (debit) and Accounts Receivable decreases (credit). Recording revenue again would double count it.',
          },
          {
            event: 'SwiftGo borrowed ₱100,000 from a bank to buy a delivery van.',
            challenge: 'Record a loan.',
            prompt: 'The bank approved our ₱100,000 loan, and the money is in our account. Is this revenue?',
            choices: ['Debit Cash, Credit Service Revenue', 'Debit Cash, Credit Loans Payable', 'Debit Delivery Van, Credit Cash'],
            answer: 1,
            hint: 'Borrowed money has to be paid back.',
            explanation: "A loan isn't revenue — we have to repay it. Cash increases (debit) and Loans Payable, a liability, increases (credit).",
          },
        ],
      }),
      level(1),
      level(2),
      level(3),
    ],
  },
  {
    id: '005',
    name: 'Lakwatsa Deliver Services',
    shortType: 'Delivery Service',
    category: 'Coming soon',
    locked: true,
    art: { sign: 'CENTRAL', sub: 'INVESTIGATION BUREAU', wall: '#4B5563', roof: '#374151', awning: ['#6B7280', '#9CA3AF'], glow: '#D1D5DB', kind: 'bureau' },
    levels: [level(0), level(1), level(2), level(3)],
  },
  {
    id: '006',
    name: 'Sanvitog Delivery',
    shortType: 'Delivery Service',
    category: 'Coming soon',
    locked: true,
    art: null,
    levels: [level(0), level(1), level(2), level(3)],
  },
];
