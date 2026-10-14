import { useState } from 'react';
import Icon from './ui/Icon.jsx';
import Coin from './ui/Coin.jsx';
import { demoAccounts, demoTransactions } from '../data/content.js';

const CARET =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4' shape-rendering='crispEdges'%3E%3Cpath d='M0 0h6v1H5v1H4v1H2V2H1V1H0z' fill='%230F1F4D'/%3E%3C/svg%3E\")";

const peso = (n) => `₱${n.toLocaleString('en-PH')}`;

function AccountSelect({ id, label, value, onChange, disabled }) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-pixel text-[10px] uppercase tracking-wide text-navy">{label}</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="pixel-box-flat mt-2 w-full appearance-none rounded-none border-0 bg-white bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat px-3 py-2.5 pr-8 text-sm text-navy-900 disabled:opacity-70"
        style={{ backgroundImage: CARET }}
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
    <div className="pixel-box px-dark w-full max-w-md bg-cream">
      {/* Top bar mirrors the GUI layout: player info, stage indicator, points */}
      <div className="flex items-center justify-between gap-3 border-b-4 border-navy-950 bg-navy-900 px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="font-pixel text-[8px] uppercase tracking-widest text-ember-300">Stage 1 &middot; Sari-Sari Store</p>
          <p className="mt-1.5 truncate text-sm font-semibold">
            Transaction {index + 1} of {demoTransactions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="bg-crimson-700 px-2 py-1 font-pixel text-[8px] uppercase text-cream">
              {streak}x streak
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-navy-950 px-2.5 py-1.5 font-pixel text-[10px]" aria-live="polite">
            <Coin className="h-4 w-4" /> {points}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="pixel-box-flat px-ember bg-ember-100 p-4">
          <p className="font-pixel text-[9px] uppercase tracking-wide text-ember-800">Transaction</p>
          <p className="mt-1 font-medium text-navy-900">{tx.text}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-navy">{peso(tx.amount)}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AccountSelect id="demo-debit" label="Debit" value={debit} onChange={setDebit} disabled={answered} />
          <AccountSelect id="demo-credit" label="Credit" value={credit} onChange={setCredit} disabled={answered} />
        </div>

        <div aria-live="polite">
          {result === 'correct' && (
            <div className="pixel-box-flat flex gap-3 bg-emerald-50 p-3 text-sm text-emerald-900 [--px:#059669]">
              <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2.5} />
              <p>
                <strong>Correct entry!</strong> {tx.explanation}
              </p>
            </div>
          )}
          {result === 'wrong' && (
            <div className="pixel-box-flat bg-rose-50 p-3 text-sm text-rose-900 [--px:#E11D48]">
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
            <p className="pixel-box-flat px-gold flex gap-2 bg-gold-50 p-3 text-sm text-navy-800">
              <Icon name="hint" className="h-5 w-5 shrink-0 text-gold-600" /> {tx.hint}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-1">
          {answered ? (
            <button
              type="button"
              onClick={next}
              className="pixel-btn flex-1 bg-navy text-cream hover:bg-navy-600"
            >
              Next transaction <Icon name="arrow" className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={submit}
                disabled={!debit || !credit}
                className="pixel-btn flex-1 bg-emerald-500 text-navy-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="check" className="h-4 w-4" strokeWidth={2.5} /> Submit
              </button>
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="pixel-btn bg-gold text-navy-950 hover:bg-gold-300 disabled:opacity-60"
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
