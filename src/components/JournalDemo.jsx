import { useState } from 'react';
import Icon from './ui/Icon.jsx';
import Coin from './ui/Coin.jsx';
import { demoAccounts, demoTransactions } from '../data/content.js';

const peso = (n) => `₱${n.toLocaleString('en-PH')}`;

function AccountSelect({ id, label, value, onChange, disabled }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-navy-600">{label}</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-navy-100 bg-white px-3 py-2.5 text-sm text-navy-900 shadow-sm focus:border-gold focus:ring-gold disabled:opacity-70"
      >
        <option value="">Select account</option>
        {demoAccounts.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </label>
  );
}

// A playable miniature of the in-game Accounting Challenge Screen.
export default function JournalDemo() {
  const [index, setIndex] = useState(0);
  const [debit, setDebit] = useState('');
  const [credit, setCredit] = useState('');
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [showHint, setShowHint] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const tx = demoTransactions[index];
  const answered = result !== null;

  const submit = () => {
    const correct = debit === tx.debit && credit === tx.credit;
    setResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setPoints((p) => p + (showHint ? 60 : 100));
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setIndex((i) => (i + 1) % demoTransactions.length);
    setDebit('');
    setCredit('');
    setResult(null);
    setShowHint(false);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-navy-900/10">
      {/* Top bar mirrors the GUI layout: player info, stage indicator, points */}
      <div className="flex items-center justify-between gap-3 bg-navy-900 px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-navy-200">Stage 1 &middot; Sari-Sari Store</p>
          <p className="truncate font-heading text-sm font-semibold">
            Transaction {index + 1} of {demoTransactions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-gold-300">
              {streak}x streak
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold" aria-live="polite">
            <Coin className="h-4 w-4" /> {points}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="rounded-xl bg-gold-50 p-4 ring-1 ring-gold-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Transaction</p>
          <p className="mt-1 font-medium text-navy-900">{tx.text}</p>
          <p className="mt-1 font-heading text-lg font-bold text-navy">{peso(tx.amount)}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AccountSelect id="demo-debit" label="Debit" value={debit} onChange={setDebit} disabled={answered} />
          <AccountSelect id="demo-credit" label="Credit" value={credit} onChange={setCredit} disabled={answered} />
        </div>

        <div aria-live="polite">
          {result === 'correct' && (
            <div className="flex gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
              <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2.5} />
              <p>
                <strong>Correct entry!</strong> {tx.explanation}
              </p>
            </div>
          )}
          {result === 'wrong' && (
            <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-900 ring-1 ring-rose-200">
              <p className="flex items-center gap-2 font-semibold">
                <Icon name="x" className="h-4 w-4 text-rose-600" strokeWidth={2.5} /> Not quite &mdash; here&rsquo;s the review
              </p>
              <dl className="mt-2 grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-xs">
                <dt />
                <dd className="font-semibold text-rose-700">Your answer</dd>
                <dd className="font-semibold text-emerald-700">Correct</dd>
                <dt className="font-semibold">Dr</dt>
                <dd>{debit || '—'}</dd>
                <dd>{tx.debit}</dd>
                <dt className="font-semibold">Cr</dt>
                <dd>{credit || '—'}</dd>
                <dd>{tx.credit}</dd>
              </dl>
              <p className="mt-2">{tx.explanation}</p>
            </div>
          )}
          {!answered && showHint && (
            <p className="flex gap-2 rounded-xl bg-navy-50 p-3 text-sm text-navy-800">
              <Icon name="hint" className="h-5 w-5 shrink-0 text-gold-600" /> {tx.hint}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {answered ? (
            <button
              type="button"
              onClick={next}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 font-heading text-sm font-semibold text-white hover:bg-navy-600"
            >
              Next transaction <Icon name="arrow" className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={submit}
                disabled={!debit || !credit}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-heading text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="check" className="h-4 w-4" strokeWidth={2.5} /> Submit
              </button>
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 font-heading text-sm font-semibold text-navy-900 hover:bg-gold-300 disabled:opacity-60"
              >
                <Icon name="hint" className="h-4 w-4" strokeWidth={2} /> Hint
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
