// Procedural round generators for the case mini-games.
// Every round is built from accounting templates, so amounts and situations change on each attempt
// while the answers stay correct. Higher tiers add trickier accounts, multi-step computations,
// more distractors and fewer clues.

export const peso = (n) => `₱${Math.round(n).toLocaleString('en-PH')}`;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (r, min, max, step = 1) => min + Math.floor(r() * (Math.floor((max - min) / step) + 1)) * step;
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
export function shuffle(r, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const uniq = (arr) => [...new Set(arr)];

// Accounts whose normal balance is DEBIT (assets, expenses, drawing). Everything else is credit-normal.
const DEBIT_NORMAL = new Set(['Cash', 'Accounts Receivable', 'Supplies', 'Equipment', 'Delivery Equipment', 'Delivery Trucks',
  'Prepaid Insurance', 'Prepaid Rent', 'Interest Receivable', 'Rent Expense', 'Salaries Expense', 'Utilities Expense',
  'Fuel Expense', 'Repairs Expense', 'Interest Expense', 'Supplies Expense', 'Insurance Expense', 'Depreciation Expense',
  'Owner\u2019s Drawing', 'Surume, Drawing', 'Sanvitog, Drawing']);
const isDebitNormal = (a) => DEBIT_NORMAL.has(a);
// "Cash increases" / "Accounts Payable decreases", for an account on a given side of the entry.
function effect(account, side) {
  const up = (side === 'debit') === isDebitNormal(account);
  return `${account} ${up ? 'increases' : 'decreases'}`;
}
const plus = (nums) => (nums.length ? nums.map(peso).join(' + ') : '\u20B10');
// "₱1 + ₱2 = ₱3", or just "₱3" when there is only one amount.
const sumLine = (nums, total) => (nums.length > 1 ? `${plus(nums)} = ${peso(total)}` : peso(total));
function entrySteps(dr, cr, amount) {
  return [
    `${effect(dr, 'debit')} \u2192 debit ${dr} ${peso(amount)} (left side).`,
    `${effect(cr, 'credit')} \u2192 credit ${cr} ${peso(amount)} (right side).`,
    `Check: total debits ${peso(amount)} = total credits ${peso(amount)} \u2714`,
  ];
}

// ---------------------------------------------------------------------------------------------
// Case #002 · Debit or Credit Vault — sort accounts by normal balance
// ---------------------------------------------------------------------------------------------
const KIND_WHY = {
  asset: (a) => `${a} is an asset. Assets increase with debits, so its normal balance is DEBIT.`,
  liability: (a) => `${a} is a liability. Liabilities increase with credits, so its normal balance is CREDIT.`,
  equity: (a) => `${a} is owner's equity. Equity increases with credits, so its normal balance is CREDIT.`,
  revenue: (a) => `${a} is revenue. Revenue increases equity, so its normal balance is CREDIT.`,
  expense: (a) => `${a} is an expense. Expenses decrease equity, so its normal balance is DEBIT.`,
  drawing: (a) => `${a} records the owner's withdrawals. It reduces equity, so it carries a DEBIT balance.`,
  contraAsset: (a) => `${a} is a contra-asset: it reduces an asset, so it carries the opposite of an asset's balance — CREDIT.`,
  contraRevenue: (a) => `${a} is a contra-revenue account: it reduces sales, so it carries the opposite of revenue's balance — DEBIT.`,
  contraPurchases: (a) => `${a} reduces Purchases (a debit account), so it carries the opposite balance — CREDIT.`,
  purchases: (a) => `${a} is part of the cost of goods bought — it behaves like an expense, so its normal balance is DEBIT.`,
};
const KIND_LABEL = {
  asset: 'Asset', liability: 'Liability', equity: 'Equity', revenue: 'Revenue', expense: 'Expense',
  drawing: 'Owner’s withdrawals', contraAsset: 'Contra-asset', contraRevenue: 'Contra-revenue',
  contraPurchases: 'Contra-purchases', purchases: 'Cost of purchases',
};
const SIDE_OF = { asset: 'debit', expense: 'debit', drawing: 'debit', contraRevenue: 'debit', purchases: 'debit' };

const SORT_ACCOUNTS = [
  // tier 1
  [1, 'Cash', 'asset'], [1, 'Accounts Receivable', 'asset'], [1, 'Merchandise Inventory', 'asset'], [1, 'Store Equipment', 'asset'],
  [1, 'Accounts Payable', 'liability'], [1, 'Lukas, Capital', 'equity'], [1, 'Sales', 'revenue'], [1, 'Rent Expense', 'expense'],
  [1, 'Utilities Expense', 'expense'], [1, 'Salaries Expense', 'expense'],
  // tier 2
  [2, 'Lukas, Drawing', 'drawing'], [2, 'Notes Payable', 'liability'], [2, 'Unearned Revenue', 'liability'], [2, 'Prepaid Insurance', 'asset'],
  [2, 'Store Supplies', 'asset'], [2, 'Interest Expense', 'expense'], [2, 'Land', 'asset'], [2, 'Loans Payable', 'liability'],
  [2, 'Advertising Expense', 'expense'],
  // tier 3
  [3, 'Accumulated Depreciation', 'contraAsset'], [3, 'Sales Returns and Allowances', 'contraRevenue'], [3, 'Sales Discounts', 'contraRevenue'],
  [3, 'Allowance for Doubtful Accounts', 'contraAsset'], [3, 'Interest Receivable', 'asset'], [3, 'Salaries Payable', 'liability'],
  [3, 'Depreciation Expense', 'expense'], [3, 'Unearned Rent Revenue', 'liability'], [3, 'Prepaid Rent', 'asset'],
  // tier 4
  [4, 'Purchase Returns and Allowances', 'contraPurchases'], [4, 'Purchase Discounts', 'contraPurchases'], [4, 'Freight-In', 'purchases'],
  [4, 'Purchases', 'purchases'], [4, 'Withholding Tax Payable', 'liability'], [4, 'Interest Payable', 'liability'],
  [4, 'Bad Debts Expense', 'expense'], [4, 'Rent Revenue', 'revenue'], [4, 'Notes Receivable', 'asset'],
];

export function genSort(tier, count, seed) {
  const r = rng(seed);
  const hard = shuffle(r, SORT_ACCOUNTS.filter(([t]) => t === tier));
  const easier = shuffle(r, SORT_ACCOUNTS.filter(([t]) => t < tier));
  // Mostly this tier's accounts, topped up with earlier ones as review.
  const chosen = [...hard.slice(0, Math.ceil(count * (tier === 1 ? 1 : 0.65))), ...easier].slice(0, count);
  return shuffle(r, chosen).map(([, account, kind]) => ({
    type: 'sort',
    account,
    kind: KIND_LABEL[kind],
    side: SIDE_OF[kind] ?? 'credit',
    explanation: KIND_WHY[kind](account),
    steps: [
      `Classify it: ${account} is ${/^[AEIOU]/i.test(KIND_LABEL[kind]) ? 'an' : 'a'} ${KIND_LABEL[kind].toLowerCase()} account.`,
      KIND_WHY[kind](account),
      `Normal balance: ${(SIDE_OF[kind] ?? 'credit').toUpperCase()} \u2192 the ${SIDE_OF[kind] === 'debit' ? 'left' : 'right'} vault.`,
    ],
    hint: tier >= 3 ? 'Watch for contra accounts: they carry the OPPOSITE balance of the account they reduce.' : 'Asset, liability, equity, revenue or expense? Assets & expenses are debit; the rest are credit.',
  }));
}

// ---------------------------------------------------------------------------------------------
// Case #003 · T-Account Café — post transactions to the correct side of each T-account
// ---------------------------------------------------------------------------------------------
const CAFE = [
  { id: 'invest', tier: 1, dr: 'Cash', cr: 'Surume, Capital', amt: [20000, 80000, 5000], text: (a) => `Surume invested ${peso(a)} cash in the coffee shop.` },
  { id: 'cashSale', tier: 1, dr: 'Cash', cr: 'Sales', amt: [2000, 9500, 100], text: (a) => `Sold coffee and pastries for ${peso(a)} cash.` },
  { id: 'supplies', tier: 1, dr: 'Supplies', cr: 'Cash', amt: [1500, 6000, 100], text: (a) => `Bought coffee beans and milk for ${peso(a)} cash.` },
  { id: 'rent', tier: 1, dr: 'Rent Expense', cr: 'Cash', amt: [5000, 12000, 500], text: (a) => `Paid this month’s shop rent of ${peso(a)}.` },
  { id: 'salary', tier: 1, dr: 'Salaries Expense', cr: 'Cash', amt: [2000, 6000, 100], text: (a) => `Paid the baristas’ salaries of ${peso(a)}.` },
  { id: 'equipAP', tier: 2, dr: 'Equipment', cr: 'Accounts Payable', amt: [18000, 45000, 500], text: (a) => `Bought an espresso machine for ${peso(a)} on account.` },
  { id: 'payAP', tier: 2, dr: 'Accounts Payable', cr: 'Cash', needs: 'Accounts Payable', amt: [3000, 15000, 500], text: (a) => `Paid ${peso(a)} to a supplier on account.` },
  { id: 'creditSale', tier: 2, dr: 'Accounts Receivable', cr: 'Sales', amt: [4000, 15000, 250], text: (a) => `Catered an office meeting for ${peso(a)}; the client will pay next month.` },
  { id: 'collect', tier: 2, dr: 'Cash', cr: 'Accounts Receivable', needs: 'Accounts Receivable', amt: [1000, 8000, 250], text: (a) => `Collected ${peso(a)} from a customer’s account.` },
  { id: 'draw', tier: 2, dr: 'Surume, Drawing', cr: 'Cash', amt: [1000, 5000, 500], text: (a) => `Surume withdrew ${peso(a)} cash for personal use.` },
  { id: 'prepaid', tier: 3, dr: 'Prepaid Insurance', cr: 'Cash', amt: [6000, 18000, 600], text: (a) => `Paid ${peso(a)} upfront for a 12-month insurance policy.` },
  { id: 'unearned', tier: 3, dr: 'Cash', cr: 'Unearned Revenue', amt: [3000, 12000, 500], text: (a) => `Received ${peso(a)} in advance for a catering event next month.` },
  { id: 'borrow', tier: 3, dr: 'Cash', cr: 'Notes Payable', amt: [20000, 60000, 5000], text: (a) => `Borrowed ${peso(a)} from the bank and signed a note.` },
  { id: 'suppliesAP', tier: 3, dr: 'Supplies', cr: 'Accounts Payable', amt: [1200, 5000, 100], text: (a) => `Bought cups and lids for ${peso(a)} on account.` },
  { id: 'earn', tier: 4, dr: 'Unearned Revenue', cr: 'Sales', needs: 'Unearned Revenue', amt: [1000, 12000, 500], text: (a) => `Served the catering event paid for in advance — ${peso(a)} is now earned.` },
  { id: 'repay', tier: 4, dr: 'Notes Payable', cr: 'Cash', needs: 'Notes Payable', amt: [5000, 20000, 1000], text: (a) => `Paid ${peso(a)} of the bank note’s principal.` },
  { id: 'interest', tier: 4, dr: 'Interest Expense', cr: 'Cash', amt: [300, 1500, 50], text: (a) => `Paid ${peso(a)} interest on the bank loan.` },
  { id: 'utilAP', tier: 4, dr: 'Utilities Expense', cr: 'Accounts Payable', amt: [1500, 4500, 50], text: (a) => `Received the electricity bill of ${peso(a)}, payable next week.` },
];
const CAFE_ACCOUNTS = uniq(CAFE.flatMap((t) => [t.dr, t.cr]));
const NORMAL_DEBIT = new Set(['Cash', 'Supplies', 'Rent Expense', 'Salaries Expense', 'Equipment', 'Accounts Receivable', 'Surume, Drawing',
  'Prepaid Insurance', 'Interest Expense', 'Utilities Expense']);

export function ledgerFrom(rounds) {
  const ledger = {};
  rounds.forEach((rd) => {
    if (rd.type !== 'taccount') return;
    rd.postings.forEach((p) => {
      ledger[p.account] ??= { debit: [], credit: [] };
      ledger[p.account][p.side].push(rd.amount);
    });
  });
  return ledger;
}
const sum = (a) => a.reduce((s, n) => s + n, 0);
export function balanceOf(ledger, account) {
  const l = ledger[account] ?? { debit: [], credit: [] };
  return sum(l.debit) - sum(l.credit); // positive = debit balance
}

export function genTAccount(tier, count, seed) {
  const r = rng(seed);
  const pool = CAFE.filter((t) => t.tier <= tier);
  const rounds = [];
  const bal = {};
  const apply = (acc, side, a) => {
    bal[acc] = (bal[acc] ?? 0) + (side === 'debit' ? a : -a) * (NORMAL_DEBIT.has(acc) ? 1 : -1);
  };
  let guard = 0;
  while (rounds.length < count && guard < 500) {
    guard += 1;
    const t = rounds.length === 0 ? CAFE[0] : pick(r, pool.filter((x) => x.id !== 'invest'));
    // prefer the newest templates at higher tiers
    if (tier > 1 && t.tier < tier && r() < 0.45) continue;
    let a = int(r, ...t.amt);
    if (t.needs) {
      const avail = bal[t.needs] ?? 0;
      if (avail < t.amt[0]) continue;
      a = Math.min(a, Math.floor(avail / 50) * 50);
    }
    if (t.cr === 'Cash' && (bal.Cash ?? 0) - a < 0) continue;
    apply(t.dr, 'debit', a);
    apply(t.cr, 'credit', a);
    const postings = [{ account: t.dr, side: 'debit' }, { account: t.cr, side: 'credit' }];
    const decoys = tier >= 3 ? [pick(r, CAFE_ACCOUNTS.filter((x) => x !== t.dr && x !== t.cr))] : [];
    rounds.push({
      type: 'taccount',
      text: t.text(a),
      amount: a,
      postings,
      cards: shuffle(r, [t.dr, t.cr, ...decoys]),
      explanation: `${t.dr} is debited (left side) and ${t.cr} is credited (right side) for ${peso(a)}. Every debit needs an equal credit.`,
      steps: [...entrySteps(t.dr, t.cr, a), ...(decoys.length ? [`${decoys[0]} is not affected \u2014 leave it empty.`] : [])],
      hint: decoys.length
        ? 'One account card is a decoy — only two accounts are affected. Leave the decoy empty.'
        : 'Which account goes up or down? Debits are always posted on the LEFT, credits on the RIGHT.',
    });
  }
  // Bonus: ending balance of an account built from this run's postings.
  const ledger = ledgerFrom(rounds);
  const target = tier >= 3 ? pick(r, Object.keys(ledger).filter((k) => ledger[k].debit.length + ledger[k].credit.length >= 2)) ?? 'Cash' : 'Cash';
  const l = ledger[target];
  const correct = Math.abs(balanceOf(ledger, target));
  const side = balanceOf(ledger, target) >= 0 ? 'debit' : 'credit';
  const dTot = sum(l.debit);
  const cTot = sum(l.credit);
  const opts = uniq([dTot + cTot, Math.max(dTot, cTot), correct + (l.credit[0] ?? l.debit[0] ?? 1000), correct * 2].filter((n) => n > 0 && n !== correct));
  const nums = shuffle(r, [correct, ...opts.slice(0, 3)]);
  const choices = nums.map((n) => `${peso(n)} ${side}`);
  rounds.push({
    type: 'balance',
    account: target,
    prompt: `Bonus round! Using the ledger you just posted, what is the ending balance of ${target}?`,
    choices,
    answer: nums.indexOf(correct),
    explanation: `${target}: debits ${peso(dTot)} − credits ${peso(cTot)} = ${peso(Math.abs(dTot - cTot))} ${side} balance. Subtract the smaller side from the larger one.`,
    steps: [
      `Add the debit (left) side: ${sumLine(l.debit, dTot)}.`,
      `Add the credit (right) side: ${sumLine(l.credit, cTot)}.`,
      `Subtract the smaller total from the larger: ${peso(Math.max(dTot, cTot))} \u2212 ${peso(Math.min(dTot, cTot))} = ${peso(correct)}.`,
      `The ${side} side is larger, so ${target} has a ${peso(correct)} ${side} balance.`,
    ],
    hint: 'Add each side of the T-account, then subtract the smaller total from the larger one.',
  });
  return rounds;
}

// ---------------------------------------------------------------------------------------------
// Case #004 · Journal Entry Express — pick both accounts and compute the amount
// ---------------------------------------------------------------------------------------------
const SWIFT_ACCOUNTS = ['Cash', 'Accounts Receivable', 'Delivery Equipment', 'Prepaid Insurance', 'Supplies', 'Accounts Payable', 'Notes Payable',
  'Unearned Service Revenue', 'Service Revenue', 'Fuel Expense', 'Salaries Expense', 'Rent Expense', 'Repairs Expense', 'Owner’s Capital',
  'Owner’s Drawing', 'Interest Expense'];

const SWIFT = [
  // tier 1 — amounts given directly
  { tier: 1, dr: 'Cash', cr: 'Service Revenue', make: (r) => { const a = int(r, 800, 4800, 50); return { a, text: `Delivered parcels for a walk-in customer and received ${peso(a)} cash.` }; } },
  { tier: 1, dr: 'Fuel Expense', cr: 'Cash', make: (r) => { const a = int(r, 900, 3500, 50); return { a, text: `Paid ${peso(a)} cash for fuel.` }; } },
  { tier: 1, dr: 'Rent Expense', cr: 'Cash', make: (r) => { const a = int(r, 6000, 15000, 500); return { a, text: `Paid the garage rent of ${peso(a)}.` }; } },
  { tier: 1, dr: 'Cash', cr: 'Owner’s Capital', make: (r) => { const a = int(r, 50000, 200000, 5000); return { a, text: `The owner invested ${peso(a)} cash in SwiftGo.` }; } },
  { tier: 1, dr: 'Accounts Receivable', cr: 'Service Revenue', make: (r) => { const a = int(r, 3000, 12000, 250); return { a, text: `Billed an online shop ${peso(a)} for completed deliveries, due in 15 days.` }; } },
  // tier 2 — one multiplication
  { tier: 2, dr: 'Accounts Receivable', cr: 'Service Revenue', make: (r) => { const n = int(r, 20, 80, 5); const p = int(r, 90, 180, 10); return { a: n * p, text: `Delivered ${n} parcels for a client at ${peso(p)} each. The client will pay next week.`, work: `${n} parcels × ${peso(p)} = ${peso(n * p)}` }; } },
  { tier: 2, dr: 'Fuel Expense', cr: 'Cash', make: (r) => { const n = int(r, 20, 60, 5); const p = int(r, 62, 78, 1); return { a: n * p, text: `Bought ${n} liters of fuel at ${peso(p)} per liter, paid in cash.`, work: `${n} L × ${peso(p)} = ${peso(n * p)}` }; } },
  { tier: 2, dr: 'Salaries Expense', cr: 'Cash', make: (r) => { const n = int(r, 3, 9); const p = int(r, 550, 900, 25); return { a: n * p, text: `Paid ${n} riders a daily wage of ${peso(p)} each.`, work: `${n} riders × ${peso(p)} = ${peso(n * p)}` }; } },
  { tier: 2, dr: 'Supplies', cr: 'Accounts Payable', make: (r) => { const n = int(r, 12, 48, 6); const p = int(r, 35, 95, 5); return { a: n * p, text: `Bought ${n} rolls of packing tape at ${peso(p)} each on account.`, work: `${n} rolls × ${peso(p)} = ${peso(n * p)}` }; } },
  { tier: 2, dr: 'Cash', cr: 'Accounts Receivable', make: (r) => { const a = int(r, 2000, 9000, 250); return { a, text: `Collected ${peso(a)} from a client’s account.` }; } },
  // tier 3 — multi-step
  { tier: 3, dr: 'Cash', cr: 'Service Revenue', make: (r) => { const n = int(r, 40, 120, 10); const p = int(r, 100, 200, 10); const d = pick(r, [5, 10, 20]); const g = n * p; return { a: g * (1 - d / 100), text: `Delivered ${n} parcels at ${peso(p)} each and gave a ${d}% volume discount. The client paid in cash.`, work: `${n} × ${peso(p)} = ${peso(g)}; less ${d}% (${peso(g * d / 100)}) = ${peso(g * (1 - d / 100))}` }; } },
  { tier: 3, dr: 'Cash', cr: 'Unearned Service Revenue', make: (r) => { const m = int(r, 4000, 12000, 500); const k = int(r, 2, 6); return { a: m * k, text: `A corporate client paid ${peso(m)} per month, ${k} months in advance, for future deliveries.`, work: `${peso(m)} × ${k} months = ${peso(m * k)}` }; } },
  { tier: 3, dr: 'Prepaid Insurance', cr: 'Cash', make: (r) => { const m = int(r, 1200, 3500, 100); return { a: m * 12, text: `Paid a 1-year insurance policy at ${peso(m)} per month, all upfront.`, work: `${peso(m)} × 12 months = ${peso(m * 12)}` }; } },
  { tier: 3, dr: 'Fuel Expense', cr: 'Cash', make: (r) => { const n = int(r, 25, 60, 5); const p = int(r, 64, 79, 1); const t = int(r, 120, 480, 20); return { a: n * p + t, text: `Paid cash for ${n} liters of fuel at ${peso(p)} per liter plus ${peso(t)} in tolls. Record all of it as Fuel Expense.`, work: `${n} × ${peso(p)} = ${peso(n * p)}; + ${peso(t)} tolls = ${peso(n * p + t)}` }; } },
  { tier: 3, dr: 'Accounts Payable', cr: 'Cash', make: (r) => { const c = int(r, 60000, 120000, 5000); const f = pick(r, [20, 25, 40, 50]); return { a: c * f / 100, text: `SwiftGo owes ${peso(c)} for a motorcycle bought on account. It paid ${f}% of the balance today.`, work: `${peso(c)} × ${f}% = ${peso(c * f / 100)}` }; } },
  // tier 4 — interest, partial earnings, combined costs
  { tier: 4, dr: 'Interest Expense', cr: 'Cash', make: (r) => { const P = int(r, 48000, 192000, 12000); const rate = pick(r, [6, 8, 9, 12]); const m = pick(r, [3, 4, 6]); const a = P * rate / 100 * m / 12; return { a, text: `Paid interest on a ${peso(P)} bank note at ${rate}% per year for ${m} months.`, work: `${peso(P)} × ${rate}% × ${m}/12 = ${peso(a)}` }; } },
  { tier: 4, dr: 'Unearned Service Revenue', cr: 'Service Revenue', make: (r) => { const k = pick(r, [4, 5, 6]); const m = int(r, 3000, 9000, 500); const j = int(r, 1, k - 1); return { a: m * j, text: `SwiftGo had received ${peso(m * k)} in advance for ${k} months of deliveries. ${j} month${j > 1 ? 's’' : '’s'} worth has now been delivered.`, work: `${peso(m * k)} ÷ ${k} = ${peso(m)} per month; × ${j} = ${peso(m * j)}` }; } },
  { tier: 4, dr: 'Cash', cr: 'Accounts Receivable', make: (r) => { const B = int(r, 20000, 60000, 2000); const f = pick(r, [25, 40, 60, 75]); return { a: B * f / 100, text: `A client paid ${f}% of its ${peso(B)} balance.`, work: `${peso(B)} × ${f}% = ${peso(B * f / 100)}` }; } },
  { tier: 4, dr: 'Repairs Expense', cr: 'Accounts Payable', make: (r) => { const h = int(r, 2, 8); const p = int(r, 350, 650, 50); const q = int(r, 800, 3500, 100); return { a: h * p + q, text: `A mechanic billed ${h} hours of labor at ${peso(p)}/hour plus ${peso(q)} in parts, payable next month.`, work: `${h} × ${peso(p)} = ${peso(h * p)}; + ${peso(q)} parts = ${peso(h * p + q)}` }; } },
  { tier: 4, dr: 'Owner’s Drawing', cr: 'Cash', make: (r) => { const a = int(r, 3000, 15000, 500); return { a, text: `The owner took ${peso(a)} from the business account to pay a personal credit card bill.` }; } },
];

export function genEntry(tier, count, seed) {
  const r = rng(seed);
  const own = shuffle(r, SWIFT.filter((t) => t.tier === tier));
  const older = shuffle(r, SWIFT.filter((t) => t.tier < tier));
  const chosen = [...own, ...older].slice(0, count);
  const chipCount = [0, 6, 8, 10, 12][tier];
  return shuffle(r, chosen).map((t) => {
    const { a, text, work } = t.make(r);
    const chips = shuffle(r, uniq([t.dr, t.cr, ...shuffle(r, SWIFT_ACCOUNTS)]).slice(0, chipCount));
    return {
      type: 'entry',
      text,
      debit: t.dr,
      credit: t.cr,
      amount: Math.round(a),
      work,
      chips,
      explanation: `Debit ${t.dr} and credit ${t.cr} for ${peso(a)}.`,
      steps: [work ? `Compute the amount: ${work}.` : `Amount (given in the ticket): ${peso(a)}.`, ...entrySteps(t.dr, t.cr, Math.round(a))],
      hint: work ? 'Work out the amount first (use the number pad), then ask which account goes up and which goes down.' : 'Which account increases? Which decreases? Assets & expenses go up with a debit.',
    };
  });
}

// ---------------------------------------------------------------------------------------------
// Case #005 · Adjustment Detective — classify the adjustment, then pick the right adjusting entry
// ---------------------------------------------------------------------------------------------
export const ADJ_TYPES = ['Accrued Expense', 'Accrued Revenue', 'Prepaid Expense', 'Unearned Revenue', 'Depreciation'];
const MONTHS = [['Jul 1', 6], ['Aug 1', 5], ['Sep 1', 4], ['Oct 1', 3], ['Nov 1', 2], ['Apr 1', 9]];

const ADJ = [
  // tier 1 — amounts given or one subtraction
  { tier: 1, kind: 'Prepaid Expense', dr: 'Supplies Expense', cr: 'Supplies', make: (r) => { const b = int(r, 4000, 9000, 100); const c = int(r, 600, 2400, 100); return { a: b - c, wrong: b, text: `The Supplies account shows ${peso(b)}. A month-end count finds ${peso(c)} of supplies left.`, work: `${peso(b)} − ${peso(c)} left = ${peso(b - c)} used` }; } },
  { tier: 1, kind: 'Accrued Expense', dr: 'Salaries Expense', cr: 'Salaries Payable', make: (r) => { const a = int(r, 3000, 12000, 250); return { a, wrong: a * 2, text: `Riders earned ${peso(a)} in salaries this period that will only be paid next month.` }; } },
  { tier: 1, kind: 'Accrued Revenue', dr: 'Accounts Receivable', cr: 'Service Revenue', make: (r) => { const a = int(r, 4000, 15000, 250); return { a, wrong: a * 2, text: `Lakwatsa completed ${peso(a)} of deliveries that have not been billed yet.` }; } },
  { tier: 1, kind: 'Unearned Revenue', dr: 'Unearned Service Revenue', cr: 'Service Revenue', make: (r) => { const a = int(r, 2000, 10000, 250); const t = a + int(r, 2000, 8000, 250); return { a, wrong: t, text: `Of the ${peso(t)} collected in advance, ${peso(a)} has now been earned.` }; } },
  // tier 2 — months elapsed
  { tier: 2, kind: 'Prepaid Expense', dr: 'Insurance Expense', cr: 'Prepaid Insurance', make: (r) => { const m1 = int(r, 1500, 3000, 100); const [d, m] = pick(r, MONTHS); return { a: m1 * m, wrong: m1 * (12 - m), text: `On ${d}, Lakwatsa paid ${peso(m1 * 12)} for a 12-month insurance policy. Adjust on Dec 31.`, work: `${peso(m1 * 12)} ÷ 12 = ${peso(m1)}/month × ${m} months used = ${peso(m1 * m)}` }; } },
  { tier: 2, kind: 'Unearned Revenue', dr: 'Unearned Service Revenue', cr: 'Service Revenue', make: (r) => { const k = 12; const per = int(r, 1000, 4000, 250); const [d, m] = pick(r, MONTHS); return { a: per * m, wrong: per * (k - m), text: `On ${d}, a client paid ${peso(per * k)} for 12 months of deliveries. Adjust on Dec 31.`, work: `${peso(per * k)} ÷ 12 = ${peso(per)}/month × ${m} months earned = ${peso(per * m)}` }; } },
  { tier: 2, kind: 'Depreciation', dr: 'Depreciation Expense', cr: 'Accumulated Depreciation', make: (r) => { const y = int(r, 24000, 96000, 1200); return { a: y / 12, wrong: y, text: `Annual depreciation on the delivery vans is ${peso(y)}. Record depreciation for one month.`, work: `${peso(y)} ÷ 12 = ${peso(y / 12)}` }; } },
  { tier: 2, kind: 'Prepaid Expense', dr: 'Rent Expense', cr: 'Prepaid Rent', make: (r) => { const per = int(r, 5000, 12000, 500); const k = pick(r, [3, 4, 6]); const used = int(r, 1, k - 1); return { a: per * used, wrong: per * k, text: `Lakwatsa paid ${peso(per * k)} for ${k} months of warehouse rent in advance. ${used} month${used > 1 ? 's have' : ' has'} passed.`, work: `${peso(per * k)} ÷ ${k} = ${peso(per)}/month × ${used} = ${peso(per * used)}` }; } },
  // tier 3 — straight-line, payroll days, interest receivable
  { tier: 3, kind: 'Depreciation', dr: 'Depreciation Expense', cr: 'Accumulated Depreciation', make: (r) => { const L = pick(r, [4, 5, 8]); const yearly = int(r, 18000, 60000, 600); const S = int(r, 20000, 80000, 5000); const C = yearly * L + S; const [d, m] = pick(r, MONTHS); const a = yearly * m / 12; return { a, wrong: C / L * m / 12, text: `A delivery van costing ${peso(C)} with a ${peso(S)} salvage value and a ${L}-year life was bought on ${d}. Record straight-line depreciation on Dec 31.`, work: `(${peso(C)} − ${peso(S)}) ÷ ${L} = ${peso(yearly)}/year × ${m}/12 = ${peso(a)}` }; } },
  { tier: 3, kind: 'Accrued Expense', dr: 'Salaries Expense', cr: 'Salaries Payable', make: (r) => { const day = int(r, 1200, 3000, 100); const d = int(r, 2, 4); const w = day * 5; return { a: day * d, wrong: w, text: `The weekly payroll of ${peso(w)} (5-day week) is paid every Friday. The year ends on a weekday with ${d} days worked but unpaid.`, work: `${peso(w)} ÷ 5 = ${peso(day)}/day × ${d} days = ${peso(day * d)}` }; } },
  { tier: 3, kind: 'Accrued Revenue', dr: 'Interest Receivable', cr: 'Interest Revenue', make: (r) => { const P = int(r, 36000, 144000, 12000); const rate = pick(r, [6, 9, 12]); const [d, m] = pick(r, MONTHS); const a = P * rate / 100 * m / 12; return { a, wrong: P * rate / 100, text: `Lakwatsa holds a ${peso(P)}, ${rate}% note receivable dated ${d}. No interest has been collected. Adjust on Dec 31.`, work: `${peso(P)} × ${rate}% × ${m}/12 = ${peso(a)}` }; } },
  // tier 4 — combined information
  { tier: 4, kind: 'Prepaid Expense', dr: 'Supplies Expense', cr: 'Supplies', make: (r) => { const b = int(r, 2000, 6000, 100); const p = int(r, 3000, 9000, 100); const c = int(r, 800, 2500, 100); return { a: b + p - c, wrong: p - c, text: `Supplies: ${peso(b)} at the start of the month, ${peso(p)} bought during the month, and ${peso(c)} counted at month-end.`, work: `${peso(b)} + ${peso(p)} − ${peso(c)} = ${peso(b + p - c)} used` }; } },
  { tier: 4, kind: 'Accrued Expense', dr: 'Interest Expense', cr: 'Interest Payable', make: (r) => { const P = int(r, 60000, 240000, 12000); const rate = pick(r, [8, 10, 12]); const [d, m] = pick(r, MONTHS); const a = P * rate / 100 * m / 12; return { a, wrong: P * rate / 100, text: `On ${d}, Lakwatsa signed a ${peso(P)}, ${rate}% bank note. Interest is due at maturity. Adjust on Dec 31.`, work: `${peso(P)} × ${rate}% × ${m}/12 = ${peso(a)}` }; } },
  { tier: 4, kind: 'Unearned Revenue', dr: 'Unearned Service Revenue', cr: 'Service Revenue', make: (r) => { const per = int(r, 1500, 5000, 250); const k = pick(r, [6, 8, 10]); const [d, m] = pick(r, MONTHS.filter(([, mm]) => mm < k)); return { a: per * m, wrong: per * (k - m), text: `On ${d}, a client prepaid ${peso(per * k)} for ${k} months of deliveries. Adjust on Dec 31.`, work: `${peso(per * k)} ÷ ${k} = ${peso(per)}/month × ${m} months earned = ${peso(per * m)}` }; } },
];

const ADJ_WHY = {
  'Accrued Expense': 'the expense was incurred this period but not yet paid, so record it and the amount owed.',
  'Accrued Revenue': 'the revenue was earned this period but not yet collected or billed, so record it and the amount receivable.',
  'Prepaid Expense': 'cash was paid earlier; move the part used up this period from the asset to an expense.',
  'Unearned Revenue': 'cash was received earlier; move the part earned this period from the liability to revenue.',
  Depreciation: 'spread the cost of the equipment over its useful life; record this period\u2019s share.',
};

const entryText = (dr, cr, a) => `Dr ${dr} ${peso(a)}  /  Cr ${cr} ${peso(a)}`;

export function genAdjust(tier, count, seed) {
  const r = rng(seed);
  const own = shuffle(r, ADJ.filter((t) => t.tier === tier));
  const older = shuffle(r, ADJ.filter((t) => t.tier < tier));
  const chosen = [...own, ...older].slice(0, count);
  return shuffle(r, chosen).map((t) => {
    const { a, wrong, text, work } = t.make(r);
    const amt = Math.round(a);
    const correct = entryText(t.dr, t.cr, amt);
    const decoys = uniq([
      entryText(t.cr, t.dr, amt), // reversed
      entryText(t.dr, t.cr, Math.round(wrong)), // wrong amount
      tier >= 2 ? entryText(t.dr, 'Cash', amt) : entryText(t.cr, t.dr, Math.round(wrong)),
    ]).filter((e) => e !== correct);
    const choices = shuffle(r, [correct, ...decoys.slice(0, 3)]);
    return {
      type: 'adjust',
      text,
      kind: t.kind,
      choices,
      answer: choices.indexOf(correct),
      entry: { dr: t.dr, cr: t.cr, amount: amt },
      work,
      explanation: `This is ${/^[AEIOU]/.test(t.kind) ? 'an' : 'a'} ${t.kind.toLowerCase()} adjustment: debit ${t.dr} and credit ${t.cr} for ${peso(amt)}.`,
      steps: [
        `Identify it: ${t.kind} \u2014 ${ADJ_WHY[t.kind]}`,
        work ? `Compute the amount: ${work}.` : `Amount for this period: ${peso(amt)}.`,
        ...entrySteps(t.dr, t.cr, amt).slice(0, 2),
      ],
      hint: 'First ask: did cash already change hands (deferral) or not yet (accrual)? Then find the portion that belongs to this period.',
    };
  });
}

// ---------------------------------------------------------------------------------------------
// Case #006 · Balance the Books — trial balance puzzles
// ---------------------------------------------------------------------------------------------
const TB_DEBIT = ['Cash', 'Accounts Receivable', 'Supplies', 'Prepaid Insurance', 'Delivery Trucks', 'Rent Expense', 'Salaries Expense', 'Fuel Expense', 'Sanvitog, Drawing', 'Utilities Expense'];
const TB_CREDIT = ['Accounts Payable', 'Notes Payable', 'Unearned Service Revenue', 'Service Revenue', 'Salaries Payable'];

function buildTB(r, nDebit, nCredit, step, contra) {
  const debits = shuffle(r, TB_DEBIT).slice(0, nDebit).map((name) => ({ name, side: 'debit', amount: int(r, 2, 60, 1) * step }));
  const credits = shuffle(r, TB_CREDIT).slice(0, nCredit).map((name) => ({ name, side: 'credit', amount: int(r, 2, 40, 1) * step }));
  if (contra) credits.push({ name: 'Accumulated Depreciation', side: 'credit', amount: int(r, 2, 20, 1) * step });
  if (contra && !debits.some((d) => d.name === 'Delivery Trucks')) debits.push({ name: 'Delivery Trucks', side: 'debit', amount: int(r, 60, 120, 1) * step });
  const dT = sum(debits.map((d) => d.amount));
  let cT = sum(credits.map((c) => c.amount));
  if (dT - cT < 10 * step) debits[0].amount += cT - dT + int(r, 20, 60, 1) * step; // keep Capital positive
  const capital = sum(debits.map((d) => d.amount)) - cT;
  credits.push({ name: 'Sanvitog, Capital', side: 'credit', amount: capital });
  cT += capital;
  return { rows: shuffle(r, [...debits, ...credits]), total: cT };
}

export function genTB(tier, count, seed) {
  const r = rng(seed);
  const rounds = [];
  for (let i = 0; i < count; i += 1) {
    const step = tier <= 2 ? 500 : 50;
    const [nd, nc] = [[3, 1], [5, 2], [6, 3], [7, 3]][tier - 1];
    const { rows, total } = buildTB(r, nd, nc, step, tier >= 3);
    if (tier === 4 && i % 2 === 1) {
      // Spot the misplaced account: one balance sits in the wrong column.
      let idx;
      let guard = 0;
      do {
        idx = Math.floor(r() * rows.length);
        guard += 1;
      } while ((rows[idx].name.includes('Capital') || rows.filter((x) => x.amount === rows[idx].amount).length > 1) && guard < 50);
      const wrongRows = rows.map((row, j) => (j === idx ? { ...row, shown: row.side === 'debit' ? 'credit' : 'debit' } : { ...row, shown: row.side }));
      const dShown = sum(wrongRows.filter((x) => x.shown === 'debit').map((x) => x.amount));
      const cShown = sum(wrongRows.filter((x) => x.shown === 'credit').map((x) => x.amount));
      const diff = Math.abs(dShown - cShown);
      rounds.push({
        type: 'tbspot',
        rows: wrongRows,
        totals: { debit: dShown, credit: cShown },
        answer: idx,
        explanation: `The columns differ by ${peso(diff)}. Half of that, ${peso(diff / 2)}, is the balance of ${rows[idx].name}, which belongs in the ${rows[idx].side.toUpperCase()} column (its normal balance).`,
        steps: [
          `Debit column total = ${peso(dShown)}; credit column total = ${peso(cShown)}.`,
          `Difference: ${peso(Math.max(dShown, cShown))} \u2212 ${peso(Math.min(dShown, cShown))} = ${peso(diff)}.`,
          `An account in the wrong column throws the totals off by twice its balance: ${peso(diff)} \u00F7 2 = ${peso(diff / 2)}.`,
          `${rows[idx].name} has a ${peso(diff / 2)} balance and is a ${rows[idx].side}-balance account \u2192 move it to the ${rows[idx].side.toUpperCase()} column.`,
          `Corrected totals: ${peso(dShown + (rows[idx].side === 'debit' ? diff / 2 : -diff / 2))} = ${peso(cShown + (rows[idx].side === 'credit' ? diff / 2 : -diff / 2))} \u2714`,
        ],
        hint: 'When one account is in the wrong column, the difference between the totals is exactly TWICE its balance.',
      });
      continue;
    }
    const hideIdx = Math.floor(r() * rows.length);
    const hidden = rows[hideIdx];
    const sameSide = sum(rows.filter((x, j) => x.side === hidden.side && j !== hideIdx).map((x) => x.amount));
    rounds.push({
      type: 'tbmissing',
      rows: rows.map((row) => ({ ...row, shown: row.side })),
      hide: hideIdx,
      total,
      showTotal: tier <= 2,
      answer: hidden.amount,
      explanation: `Total ${hidden.side === 'debit' ? 'credits' : 'debits'} = ${peso(total)}. Other ${hidden.side}s add up to ${peso(sameSide)}. ${peso(total)} − ${peso(sameSide)} = ${peso(hidden.amount)} for ${hidden.name}.`,
      steps: (() => {
        const other = hidden.side === 'debit' ? 'credit' : 'debit';
        const full = rows.filter((x) => x.side === other).map((x) => x.amount);
        const known = rows.filter((x, j) => x.side === hidden.side && j !== hideIdx).map((x) => x.amount);
        return [
          `Add the complete ${other} column: ${sumLine(full, total)}.`,
          `Debits must equal credits, so the ${hidden.side} column must also total ${peso(total)}.`,
          `Add the known ${hidden.side}s: ${sumLine(known, sameSide)}.`,
          `Missing ${hidden.name} = ${peso(total)} \u2212 ${peso(sameSide)} = ${peso(hidden.amount)}.`,
        ];
      })(),
      hint: 'In a trial balance, total debits always equal total credits. Find the total of the complete column first.',
    });
  }
  return rounds;
}
