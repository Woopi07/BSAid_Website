// Case #001 · Nayeom's Groceria — hand-written "Record It or Not?" questions, harder at every level.
const RECORD_CHALLENGE = 'Decide whether each business event should be recorded, then apply the rules of debit and credit.';

// Level 1 · Rookie — is it a transaction? which accounts?
export const quiz001L1 = [
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
  ];

// Level 2 · Rising Star — journal entries, posting and balances
export const quiz001L2 = [
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
  {
    event: 'Nayeom took \u20B12,000 from the register for personal use.',
    challenge: 'Choose the correct journal entry.',
    prompt: 'How do we journalize the \u20B12,000 I took from the register for my nephew\u2019s project?',
    choices: ['Nayeom, Drawing 2,000 / Cash 2,000', 'Salaries Expense 2,000 / Cash 2,000', 'Cash 2,000 / Nayeom, Capital 2,000', 'Nayeom, Capital 2,000 / Sales 2,000'],
    answer: 0,
    hint: 'Withdrawals are not expenses of the business.',
    explanation: 'Owner withdrawals go to the Drawing account (debit), and Cash decreases (credit). It is not a business expense.',
  },
  {
    event: 'After posting, the Cash T-account shows debits of \u20B125,000 and credits of \u20B19,500.',
    challenge: 'Compute the account balance.',
    prompt: 'I posted everything to the Cash T-account: debits total \u20B125,000 and credits total \u20B19,500. What is the balance?',
    choices: ['\u20B115,500 debit', '\u20B115,500 credit', '\u20B134,500 debit', '\u20B19,500 credit'],
    answer: 0,
    hint: 'Subtract the smaller side from the larger side; the balance sits on the larger side.',
    explanation: '\u20B125,000 \u2212 \u20B19,500 = \u20B115,500. Debits are larger, so Cash has a \u20B115,500 debit balance.',
    steps: ['Total debits (left side): \u20B125,000.', 'Total credits (right side): \u20B19,500.', 'Balance = \u20B125,000 \u2212 \u20B19,500 = \u20B115,500.', 'Debits are larger, so the balance is a \u20B115,500 DEBIT.'],
  },
];

// Level 3 · Expert — split payments, advances, prepayments and the accounting equation
export const quiz001L3 = [
  {
    event: 'A customer bought ₱3,000 of groceries: ₱1,000 paid now, the rest next week.',
    challenge: 'Analyze a transaction with two kinds of payment.',
    prompt: 'Aling Rosa bought ₱3,000 of groceries. She paid ₱1,000 cash and will pay the rest next week. What is affected?',
    choices: [
      'Debit Cash ₱1,000 and Accounts Receivable ₱2,000; credit Sales ₱3,000',
      'Debit Cash ₱3,000; credit Sales ₱3,000',
      'Debit Accounts Receivable ₱3,000; credit Sales ₱3,000',
      'Debit Cash ₱1,000; credit Sales ₱1,000',
    ],
    answer: 0,
    hint: 'The full ₱3,000 sale happened today — only part of the money came in.',
    explanation: 'The whole ₱3,000 is earned now, so Sales is credited ₱3,000. ₱1,000 came in as Cash and ₱2,000 is still owed (Accounts Receivable). Total debits ₱3,000 = total credits ₱3,000.',
    steps: ['Sales earned today = ₱3,000 (the full sale) \u2192 credit Sales ₱3,000.', 'Cash received now = ₱1,000 \u2192 debit Cash ₱1,000.', 'Still owed = ₱3,000 \u2212 ₱1,000 = ₱2,000 \u2192 debit Accounts Receivable ₱2,000.', 'Check: debits ₱1,000 + ₱2,000 = ₱3,000 = credits ₱3,000 \u2714'],
  },
  {
    event: "Nayeom paid her family's home electricity bill of ₱2,500 using store cash.",
    challenge: 'Separate business and personal transactions.',
    prompt: 'I used ₱2,500 of store cash to pay our electricity bill at home. How should the store record it?',
    choices: ['Debit Nayeom, Drawing; credit Cash', 'Debit Utilities Expense; credit Cash', "Don't record it — it's a personal bill", 'Debit Nayeom, Drawing; credit Utilities Expense'],
    answer: 0,
    hint: 'The bill is personal, but the cash that left belonged to the business.',
    explanation: 'Business cash went out for a personal expense, so it is a withdrawal: debit Drawing and credit Cash. It is not a store utilities expense.',
  },
  {
    event: 'A customer paid ₱5,000 today for rice to be delivered next month.',
    challenge: 'Decide if the revenue is earned yet.',
    prompt: 'Mang Jun paid ₱5,000 today for rice we will deliver next month. How do we record it?',
    choices: ['Debit Cash; credit Unearned Revenue', 'Debit Cash; credit Sales', 'Debit Accounts Receivable; credit Sales', "Don't record it until the rice is delivered"],
    answer: 0,
    hint: 'Cash came in, but have we delivered anything yet?',
    explanation: 'Cash increased, but the rice has not been delivered, so nothing is earned yet. We owe the customer the goods: Unearned Revenue (a liability) is credited.',
  },
  {
    event: 'Nayeom bought a ₱15,000 chest freezer on account.',
    challenge: 'Apply the accounting equation.',
    prompt: 'After buying the ₱15,000 freezer on account, what happens to Assets = Liabilities + Equity?',
    choices: ['Assets +₱15,000; Liabilities +₱15,000', 'Assets +₱15,000; Equity +₱15,000', 'No change in total assets', 'Liabilities +₱15,000; Equity −₱15,000'],
    answer: 0,
    hint: 'What did the store gain, and what does it now owe?',
    explanation: 'Equipment (an asset) goes up ₱15,000 and Accounts Payable (a liability) goes up ₱15,000. Both sides of the equation increase equally.',
    steps: ['Equipment (asset) +₱15,000.', 'Accounts Payable (liability) +₱15,000 \u2014 nothing was paid yet.', 'Equity is unchanged.', 'Check: Assets +₱15,000 = Liabilities +₱15,000 + Equity ₱0 \u2714'],
  },
  {
    event: 'Nayeom paid ₱6,000 for 3 months of store insurance in advance.',
    challenge: 'Record a payment made in advance.',
    prompt: 'I paid ₱6,000 today for the next 3 months of store insurance. Which entry is right?',
    choices: ['Debit Prepaid Insurance; credit Cash', 'Debit Insurance Expense; credit Cash', 'Debit Cash; credit Prepaid Insurance', "Don't record it until the months pass"],
    answer: 0,
    hint: 'The coverage has not been used yet — it is something the store owns.',
    explanation: 'Insurance paid in advance is an asset until it is used up: debit Prepaid Insurance, credit Cash. It becomes an expense month by month.',
  },
  {
    event: 'A supplier delivered ₱4,000 of goods on account; Nayeom returned ₱500 of damaged items.',
    challenge: 'Compute the amount owed.',
    prompt: 'We received ₱4,000 of goods on account, then sent back ₱500 of damaged items. How much do we still owe?',
    choices: ['₱3,500', '₱4,000', '₱4,500', '₱500'],
    answer: 0,
    hint: 'A return reduces what you owe the supplier.',
    explanation: '₱4,000 owed − ₱500 returned = ₱3,500 still payable. Accounts Payable is debited ₱500 when the goods go back.',
    steps: ['Owed for the delivery: ₱4,000.', 'Returned damaged goods: \u2212₱500.', 'Still payable = ₱4,000 \u2212 ₱500 = ₱3,500.'],
  },
];

// Level 4 · Boss Round — equation, error analysis and capital
export const quiz001L4 = [
  {
    event: "The store's total assets are ₱120,000 and total liabilities are ₱45,000.",
    challenge: 'Solve the accounting equation.',
    prompt: 'Our assets total ₱120,000 and we owe ₱45,000. What is my equity in the store?',
    choices: ['₱75,000', '₱165,000', '₱45,000', '₱120,000'],
    answer: 0,
    hint: 'Equity = Assets − Liabilities.',
    explanation: 'Assets = Liabilities + Equity, so Equity = ₱120,000 − ₱45,000 = ₱75,000.',
    steps: ['Start with Assets = Liabilities + Equity.', 'Rearrange: Equity = Assets \u2212 Liabilities.', 'Equity = ₱120,000 \u2212 ₱45,000 = ₱75,000.'],
  },
  {
    event: 'Nayeom is checking which transaction leaves total assets unchanged.',
    challenge: 'Find the transaction that only swaps one asset for another.',
    prompt: 'Which of these does NOT change our total assets?',
    choices: ["Collecting ₱2,000 from a customer's account", 'Paying ₱2,000 to a supplier', 'Investing ₱2,000 more cash', 'Selling goods for ₱2,000 cash'],
    answer: 0,
    hint: 'Look for one asset going up while another goes down by the same amount.',
    explanation: 'Collecting a receivable increases Cash and decreases Accounts Receivable by the same ₱2,000 — total assets stay the same.',
  },
  {
    event: 'A ₱1,800 utilities payment was recorded as: Debit Cash, Credit Utilities Expense.',
    challenge: 'Measure the effect of a reversed entry.',
    prompt: 'Oops — the ₱1,800 utilities payment was recorded backwards. How far off is our Cash balance?',
    choices: ['Overstated by ₱3,600', 'Overstated by ₱1,800', 'Understated by ₱3,600', 'No effect on Cash'],
    answer: 0,
    hint: 'Cash should have gone DOWN ₱1,800, but it went UP ₱1,800 instead.',
    explanation: 'Cash should have been credited (−₱1,800) but was debited (+₱1,800). The gap is ₱3,600, so Cash is overstated by ₱3,600.',
    steps: ['Correct entry: Cash \u2212₱1,800.', 'Recorded entry: Cash +₱1,800.', 'Difference = ₱1,800 \u2212 (\u2212₱1,800) = ₱3,600.', 'Cash shows ₱3,600 more than it should \u2192 overstated by ₱3,600.'],
  },
  {
    event: 'Nayeom is reviewing normal balances before preparing the trial balance.',
    challenge: 'Identify a normal credit balance.',
    prompt: 'Which of these accounts normally has a CREDIT balance?',
    choices: ['Unearned Revenue', 'Prepaid Rent', 'Nayeom, Drawing', 'Rent Expense'],
    answer: 0,
    hint: 'Liabilities, equity and revenue carry credit balances.',
    explanation: 'Unearned Revenue is a liability (goods or services still owed), so its normal balance is credit. The others are debit accounts.',
  },
  {
    event: 'This month: revenue ₱48,000, expenses ₱31,500, owner withdrawals ₱5,000.',
    challenge: 'Compute net income.',
    prompt: 'We earned ₱48,000, spent ₱31,500 on expenses, and I withdrew ₱5,000. What is our net income?',
    choices: ['₱16,500', '₱11,500', '₱79,500', '₱21,500'],
    answer: 0,
    hint: 'Withdrawals are not expenses — leave them out of net income.',
    explanation: 'Net income = Revenue − Expenses = ₱48,000 − ₱31,500 = ₱16,500. Withdrawals reduce capital, not net income.',
    steps: ['Net income = Revenue \u2212 Expenses.', '= ₱48,000 \u2212 ₱31,500 = ₱16,500.', 'Withdrawals (₱5,000) are left out \u2014 they reduce capital, not net income.'],
  },
  {
    event: 'Beginning capital ₱60,000, new investment ₱10,000, net income ₱16,500, withdrawals ₱5,000.',
    challenge: "Compute the ending owner's capital.",
    prompt: 'Last one, partner! Using everything above, what is my ending capital?',
    choices: ['₱81,500', '₱86,500', '₱71,500', '₱76,500'],
    answer: 0,
    hint: 'Beginning + investments + net income − withdrawals.',
    explanation: '₱60,000 + ₱10,000 + ₱16,500 − ₱5,000 = ₱81,500.',
    steps: ['Beginning capital: ₱60,000.', '+ Additional investment: ₱10,000 \u2192 ₱70,000.', '+ Net income: ₱16,500 \u2192 ₱86,500.', '\u2212 Withdrawals: ₱5,000 \u2192 ending capital ₱81,500.'],
  },
];
