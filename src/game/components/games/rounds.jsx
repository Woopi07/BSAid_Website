// The playable round types for each case's mini-game, plus the solution card each one shows on a wrong answer.
// Every round gets { round, rounds, index, done, reveal, onSubmit } and calls onSubmit({ correct, yours }).
import { useEffect, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import Avatar from '../Avatar.jsx';
import { ADJ_TYPES, ledgerFrom, peso } from '../../data/generators.js';
import { Card, JournalEntry, NumPad, SubmitButton, TAccount, numKey } from './parts.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Receives the in-game calculator's "Use answer" value.
function useCalcAnswer(done, set) {
  useEffect(() => {
    if (done) return undefined;
    const onUse = (e) => set(String(e.detail));
    window.addEventListener('calc:use', onUse);
    return () => window.removeEventListener('calc:use', onUse);
  }, [done, set]);
}

function useKeys(handler, deps) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ---------- Multiple choice (Case #001 and the T-Account bonus round) ----------
function Choices({ round, done, reveal, onSubmit }) {
  const [sel, setSel] = useState(null);
  const submit = () => sel !== null && onSubmit({ correct: sel === round.answer, yours: round.choices[sel] });
  useKeys((e) => {
    if (done || e.target.closest?.('input, [role="menu"]')) return;
    const i = LETTERS.indexOf(e.key.toUpperCase());
    if (i >= 0 && i < round.choices.length) setSel(i);
    else if (e.key === 'Enter' && !e.target.closest?.('button') && sel !== null) submit();
  }, [done, sel, round]);

  return (
    <>
      <div role="radiogroup" className="flex flex-col gap-4 p-1">
        {round.choices.map((c, i) => {
          const isSel = sel === i;
          let box = 'px-navy bg-white hover:bg-gold-50';
          let chip = 'bg-navy text-cream';
          if (reveal && i === round.answer) [box, chip] = ['bg-emerald-50 [--px:#059669]', 'bg-emerald-500 text-navy-950'];
          else if (done && isSel) [box, chip] = [i === round.answer ? 'bg-emerald-50 [--px:#059669]' : 'bg-rose-50 [--px:#E11D48]', i === round.answer ? 'bg-emerald-500 text-navy-950' : 'bg-rose-500 text-white'];
          else if (done) box = 'px-navy bg-white opacity-50';
          else if (isSel) [box, chip] = ['px-gold bg-gold-50', 'bg-gold text-navy-950'];
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={isSel}
              disabled={done}
              onClick={() => setSel(i)}
              className={`pixel-box-flat flex items-center gap-4 px-4 py-3 text-left transition-colors ${box}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center font-pixel text-[13px] ${chip}`}>{LETTERS[i]}</span>
              <span className="text-[15px] font-medium text-navy-900 sm:text-base">{c}</span>
            </button>
          );
        })}
      </div>
      {!done && (
        <div className="mt-6 flex justify-end">
          <SubmitButton onClick={submit} disabled={sel === null} />
        </div>
      )}
    </>
  );
}

function QuizRound(props) {
  const { round } = props;
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 p-1 md:grid-cols-2">
        <Card label="Business event" tone="ember">{round.event}</Card>
        <Card label="Challenge">{round.challenge}</Card>
      </div>
      <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
        <p className="flex items-center gap-3">
          <span className="pixel-box-flat px-gold">
            <Avatar look={props.caseInfo.avatar} round={false} className="block h-10 w-10" />
          </span>
          <span className="font-pixel text-[13px] uppercase text-navy">{props.caseInfo.owner}</span>
        </p>
        <p className="mt-4 text-base leading-relaxed text-navy-900 sm:text-[17px]">{round.prompt}</p>
        <div className="mt-6">
          <Choices {...props} />
        </div>
      </section>
    </div>
  );
}

function BalanceRound(props) {
  const { round, rounds, index } = props;
  const ledger = ledgerFrom(rounds.slice(0, index));
  const l = ledger[round.account] ?? { debit: [], credit: [] };
  return (
    <div className="flex flex-col gap-5">
      <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
        <p className="flex items-center gap-2 font-pixel text-[13px] uppercase text-ember-600">
          <PixelSprite name="star" scale={2} /> Bonus round
        </p>
        <p className="mt-3 text-base leading-relaxed text-navy-900 sm:text-[17px]">{round.prompt}</p>
        <div className="mx-auto mt-5 max-w-sm">
          <TAccount name={round.account} debits={l.debit} credits={l.credit} tone="gold" />
        </div>
        <div className="mt-6">
          <Choices {...props} />
        </div>
      </section>
    </div>
  );
}

// ---------- Case #002 · Debit or Credit Vault ----------
function SortRound({ round, done, reveal, onSubmit }) {
  const [pickSide, setPick] = useState(null);
  const choose = (side) => {
    if (done) return;
    setPick(side);
    onSubmit({ correct: side === round.side, yours: side.toUpperCase() });
  };
  useKeys((e) => {
    if (e.key === 'ArrowLeft') choose('debit');
    if (e.key === 'ArrowRight') choose('credit');
  }, [done, round]);

  const vault = (side) => {
    const isRight = side === round.side;
    let tone = side === 'debit' ? 'bg-navy text-cream hover:bg-navy-600' : 'bg-crimson-700 text-cream hover:bg-crimson';
    if (done && isRight && (reveal || pickSide === side)) tone = 'bg-emerald-500 text-navy-950';
    else if (done && pickSide === side) tone = 'bg-rose-500 text-white';
    else if (done) tone += ' opacity-40';
    return (
      <button type="button" disabled={done} onClick={() => choose(side)} className={`pixel-btn flex h-40 flex-1 flex-col gap-3 text-lg sm:h-48 sm:text-xl ${tone}`}>
        <PixelSprite name="coin" scale={4} />
        {side === 'debit' ? '← Debit' : 'Credit →'}
        <span className="text-xs font-semibold normal-case tracking-normal opacity-80">{side === 'debit' ? 'left side' : 'right side'}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div key={round.account} className="pixel-box px-gold w-full max-w-md animate-pop bg-gradient-to-b from-gold-50 to-white p-6 text-center">
        <p className="font-pixel text-[12px] uppercase tracking-widest text-gold-700">Account card</p>
        <p className="mt-3 font-heading text-3xl font-bold text-navy-900 sm:text-4xl">{round.account}</p>
        <p className={`mt-3 font-pixel text-[12px] uppercase text-slate-500 ${done ? '' : 'invisible'}`}>{round.kind}</p>
      </div>
      <div className="flex w-full max-w-2xl gap-6 p-1">
        {vault('debit')}
        {vault('credit')}
      </div>
      <p className="hidden font-pixel text-[11px] uppercase tracking-widest text-navy-200 sm:block">Keyboard: ← debit · credit →</p>
    </div>
  );
}

// ---------- Case #003 · T-Account Café ----------
function TAccountRound({ round, rounds, index, done, reveal, onSubmit }) {
  const [posts, setPosts] = useState({});
  const ledger = ledgerFrom(rounds.slice(0, index));
  const expected = Object.fromEntries(round.postings.map((p) => [p.account, p.side]));
  const toggle = (acc, side) => !done && setPosts((p) => ({ ...p, [acc]: p[acc] === side ? null : side }));
  const submit = () => {
    const correct = round.cards.every((acc) => (posts[acc] ?? null) === (expected[acc] ?? null));
    const yours = round.cards.filter((a) => posts[a]).map((a) => `${posts[a] === 'debit' ? 'Dr' : 'Cr'} ${a}`).join(' / ') || 'Nothing posted';
    onSubmit({ correct, yours });
  };
  const ready = Object.values(posts).filter(Boolean).length >= 2;

  return (
    <div className="flex flex-col gap-5">
      <Card label="Order ticket" tone="ember">
        <span className="block text-base font-semibold">{round.text}</span>
        <span className="mt-2 inline-block bg-navy-950 px-3 py-1.5 font-pixel text-[13px] text-gold">Amount: {peso(round.amount)}</span>
      </Card>

      <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
        <p className="font-pixel text-[12px] uppercase text-navy">Post it — tap DR or CR on each affected account</p>
        <div className={`mt-4 grid gap-5 p-1 ${round.cards.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {round.cards.map((acc) => {
            const mine = posts[acc] ?? null;
            const want = expected[acc] ?? null;
            const ok = mine === want;
            return (
              <div key={acc} className={`pixel-box-flat bg-white ${done ? (ok ? '[--px:#059669]' : '[--px:#E11D48]') : 'px-navy'}`}>
                <p className="border-b-4 border-navy-900 px-2 py-2 text-center font-heading text-lg font-bold text-navy-900">{acc}</p>
                <div className="grid grid-cols-2">
                  {['debit', 'credit'].map((side) => {
                    const on = mine === side;
                    const show = on || (reveal && want === side);
                    const good = done && want === side;
                    return (
                      <button
                        key={side}
                        type="button"
                        disabled={done}
                        onClick={() => toggle(acc, side)}
                        aria-pressed={on}
                        className={`flex h-20 flex-col items-center justify-center gap-1 ${side === 'debit' ? 'border-r-4 border-navy-900' : ''} ${
                          good ? 'bg-emerald-50' : on && done ? 'bg-rose-50' : on ? 'bg-gold-50' : 'hover:bg-ember-100'
                        }`}
                      >
                        <span className="font-pixel text-[11px] uppercase text-slate-500">{side === 'debit' ? 'DR' : 'CR'}</span>
                        {show && <span className={`font-semibold tabular-nums ${good ? 'text-emerald-700' : 'text-navy-900'}`}>{peso(round.amount)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!done && (
          <div className="mt-6 flex justify-end">
            <SubmitButton onClick={submit} disabled={!ready}>Post entry</SubmitButton>
          </div>
        )}
      </section>

      {Object.keys(ledger).length > 0 && (
        <details className="pixel-box-flat px-navy bg-navy-900 p-4 text-cream" open>
          <summary className="cursor-pointer font-pixel text-[12px] uppercase text-gold">Your ledger so far</summary>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(ledger).map(([name, l]) => (
              <TAccount key={name} name={name} debits={l.debit} credits={l.credit} compact />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// ---------- Case #004 · Journal Entry Express ----------
function EntryRound({ round, done, reveal, onSubmit }) {
  const [slots, setSlots] = useState({ debit: null, credit: null });
  const [active, setActive] = useState('debit');
  const [amount, setAmount] = useState('');
  useCalcAnswer(done, setAmount);
  const pickChip = (acc) => {
    if (done) return;
    setSlots((s) => ({ ...s, [active]: acc }));
    if (active === 'debit') setActive('credit');
  };
  const submit = () => {
    const amt = Number(amount);
    onSubmit({
      correct: slots.debit === round.debit && slots.credit === round.credit && amt === round.amount,
      yours: `Dr ${slots.debit} / Cr ${slots.credit} — ${peso(amt)}`,
    });
  };
  const ready = slots.debit && slots.credit && Number(amount) > 0;
  useKeys((e) => {
    if (done) return;
    if (numKey(e, amount, setAmount)) e.preventDefault();
    else if (e.key === 'Enter' && ready && !e.target.closest?.('button')) submit();
  }, [done, amount, ready, slots]);

  const slot = (side) => {
    const value = slots[side];
    const want = side === 'debit' ? round.debit : round.credit;
    const tone = done ? (value === want ? 'bg-emerald-50 [--px:#059669]' : 'bg-rose-50 [--px:#E11D48]') : active === side ? 'px-gold bg-gold-50' : 'px-navy bg-white';
    return (
      <button type="button" disabled={done} onClick={() => setActive(side)} className={`pixel-box-flat flex min-h-[4.5rem] flex-col justify-center px-4 py-3 text-left ${tone}`}>
        <span className="font-pixel text-[11px] uppercase text-slate-500">{side === 'debit' ? 'Debit (left)' : 'Credit (right)'}</span>
        <span className={`mt-1 font-heading text-lg font-bold ${value ? 'text-navy-900' : 'text-slate-400'}`}>{value ?? 'Tap to choose…'}</span>
        {done && reveal && value !== want && <span className="text-sm font-semibold text-emerald-700">→ {want}</span>}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <Card label="Delivery ticket" tone="ember">
        <span className="block text-base font-semibold">{round.text}</span>
      </Card>
      <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 p-1 sm:grid-cols-2">
              {slot('debit')}
              {slot('credit')}
            </div>
            <div>
              <p className="font-pixel text-[12px] uppercase text-navy">Accounts</p>
              <div className="mt-3 flex flex-wrap gap-3 p-1">
                {round.chips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    disabled={done}
                    onClick={() => pickChip(c)}
                    className={`pixel-box-flat px-navy px-3 py-2 text-sm font-semibold ${Object.values(slots).includes(c) ? 'bg-navy text-cream' : 'bg-white text-navy-900 hover:bg-ember-100'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="font-pixel text-[12px] uppercase text-navy">Amount</p>
            <div className={`pixel-box-flat mt-3 px-4 py-3 text-right font-heading text-3xl font-bold tabular-nums ${done ? (Number(amount) === round.amount ? 'bg-emerald-50 [--px:#059669]' : 'bg-rose-50 [--px:#E11D48]') : 'px-navy bg-white'}`}>
              {amount ? peso(Number(amount)) : '₱0'}
            </div>
            {done && reveal && Number(amount) !== round.amount && <p className="mt-2 text-right text-sm font-semibold text-emerald-700">→ {peso(round.amount)}</p>}
            <div className="mt-4">
              <NumPad value={amount} onChange={setAmount} disabled={done} />
            </div>
          </div>
        </div>
        {!done && (
          <div className="mt-6 flex justify-end">
            <SubmitButton onClick={submit} disabled={!ready}>Deliver entry</SubmitButton>
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Case #005 · Adjustment Detective ----------
function AdjustRound({ round, done, reveal, onSubmit }) {
  const [kind, setKind] = useState(null);
  const [sel, setSel] = useState(null);
  const submit = () => onSubmit({ correct: kind === round.kind && sel === round.answer, yours: `${kind}; ${round.choices[sel]}` });

  return (
    <div className="flex flex-col gap-5">
      <Card label="Year-end clue" tone="ember">
        <span className="block text-base font-semibold">{round.text}</span>
      </Card>
      <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
        <p className="font-pixel text-[12px] uppercase text-navy">Step 1 · What kind of adjustment is it?</p>
        <div className="mt-3 flex flex-wrap gap-3 p-1">
          {ADJ_TYPES.map((t) => {
            let tone = kind === t ? 'bg-navy text-cream' : 'bg-white text-navy-900 hover:bg-ember-100';
            if (done && t === round.kind && (reveal || kind === t)) tone = 'bg-emerald-500 text-navy-950';
            else if (done && kind === t) tone = 'bg-rose-500 text-white';
            return (
              <button key={t} type="button" disabled={done} onClick={() => setKind(t)} className={`pixel-box-flat px-navy px-3 py-2 text-sm font-semibold ${tone}`}>
                {t}
              </button>
            );
          })}
        </div>

        <p className={`mt-6 font-pixel text-[12px] uppercase ${kind ? 'text-navy' : 'text-slate-400'}`}>Step 2 · Choose the adjusting entry</p>
        <div className={`mt-3 flex flex-col gap-3 p-1 ${kind ? '' : 'pointer-events-none opacity-40'}`}>
          {round.choices.map((c, i) => {
            let box = sel === i ? 'px-gold bg-gold-50' : 'px-navy bg-white hover:bg-gold-50';
            if (done && i === round.answer && (reveal || sel === i)) box = 'bg-emerald-50 [--px:#059669]';
            else if (done && sel === i) box = 'bg-rose-50 [--px:#E11D48]';
            else if (done) box = 'px-navy bg-white opacity-50';
            return (
              <button key={c} type="button" disabled={done} onClick={() => setSel(i)} className={`pixel-box-flat px-4 py-3 text-left text-sm font-semibold tabular-nums text-navy-900 sm:text-base ${box}`}>
                {c}
              </button>
            );
          })}
        </div>
        {!done && (
          <div className="mt-6 flex justify-end">
            <SubmitButton onClick={submit} disabled={!kind || sel === null}>Solve case</SubmitButton>
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Case #006 · Balance the Books ----------
function TBTable({ rows, render, totals, footer }) {
  return (
    <table className="w-full text-sm sm:text-base">
      <thead>
        <tr className="bg-navy-900 font-pixel text-[11px] uppercase text-cream">
          <th className="px-3 py-2 text-left">Account</th>
          <th className="px-3 py-2 text-right">Debit</th>
          <th className="px-3 py-2 text-right">Credit</th>
        </tr>
      </thead>
      <tbody>{rows.map(render)}</tbody>
      {totals && (
        <tfoot>
          <tr className="border-t-4 border-navy-900 font-bold tabular-nums">
            <td className="px-3 py-2">Total</td>
            <td className="px-3 py-2 text-right">{totals.debit}</td>
            <td className="px-3 py-2 text-right">{totals.credit}</td>
          </tr>
          {footer}
        </tfoot>
      )}
    </table>
  );
}

function TBMissingRound({ round, done, reveal, onSubmit }) {
  const [val, setVal] = useState('');
  useCalcAnswer(done, setVal);
  const submit = () => onSubmit({ correct: Number(val) === round.answer, yours: peso(Number(val)) });
  useKeys((e) => {
    if (done) return;
    if (numKey(e, val, setVal)) e.preventDefault();
    else if (e.key === 'Enter' && Number(val) > 0 && !e.target.closest?.('button')) submit();
  }, [done, val]);
  const totalText = round.showTotal ? peso(round.total) : '?';

  return (
    <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
      <p className="font-pixel text-[12px] uppercase text-navy">Sanvitog Delivery · Trial balance — find the missing amount</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="pixel-box-flat px-navy overflow-x-auto bg-white">
          <TBTable
            rows={round.rows}
            totals={{ debit: totalText, credit: totalText }}
            render={(row, i) => {
              const hidden = i === round.hide;
              const cell = hidden ? (
                <span className={`inline-block min-w-[6rem] px-2 py-0.5 font-bold ${done ? (Number(val) === round.answer ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800') : 'bg-gold-100 text-navy-900'}`}>
                  {val ? peso(Number(val)) : '???'}
                  {done && reveal && Number(val) !== round.answer && <span className="block text-emerald-700">{peso(round.answer)}</span>}
                </span>
              ) : (
                peso(row.amount)
              );
              return (
                <tr key={row.name} className={`border-t-2 border-cream tabular-nums ${hidden ? 'bg-gold-50' : ''}`}>
                  <td className="px-3 py-1.5">{row.name}</td>
                  <td className="px-3 py-1.5 text-right">{row.shown === 'debit' ? cell : ''}</td>
                  <td className="px-3 py-1.5 text-right">{row.shown === 'credit' ? cell : ''}</td>
                </tr>
              );
            }}
          />
        </div>
        <div>
          <NumPad value={val} onChange={setVal} disabled={done} />
          {!done && (
            <div className="mt-5 flex justify-end">
              <SubmitButton onClick={submit} disabled={!(Number(val) > 0)}>Balance it</SubmitButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TBSpotRound({ round, done, reveal, onSubmit }) {
  const [sel, setSel] = useState(null);
  const submit = () => onSubmit({ correct: sel === round.answer, yours: round.rows[sel].name });
  return (
    <section className="pixel-box px-dark bg-cream p-4 sm:p-6">
      <p className="font-pixel text-[12px] uppercase text-crimson-700">This trial balance doesn’t balance! Tap the account in the wrong column.</p>
      <div className="pixel-box-flat px-navy mt-4 overflow-x-auto bg-white">
        <TBTable
          rows={round.rows}
          totals={{ debit: peso(round.totals.debit), credit: peso(round.totals.credit) }}
          footer={
            <tr>
              <td colSpan={3} className="px-3 pb-2 text-right font-pixel text-[11px] uppercase text-crimson-700">
                Difference: {peso(Math.abs(round.totals.debit - round.totals.credit))}
              </td>
            </tr>
          }
          render={(row, i) => {
            let tone = sel === i ? 'bg-gold-100' : 'hover:bg-ember-100';
            if (done && i === round.answer && (reveal || sel === i)) tone = 'bg-emerald-100';
            else if (done && sel === i) tone = 'bg-rose-100';
            return (
              <tr key={row.name} onClick={() => !done && setSel(i)} className={`cursor-pointer border-t-2 border-cream tabular-nums ${tone}`}>
                <td className="px-3 py-1.5">
                  <button type="button" disabled={done} className="text-left" aria-pressed={sel === i}>{row.name}</button>
                </td>
                <td className="px-3 py-1.5 text-right">{row.shown === 'debit' ? peso(row.amount) : ''}</td>
                <td className="px-3 py-1.5 text-right">{row.shown === 'credit' ? peso(row.amount) : ''}</td>
              </tr>
            );
          }}
        />
      </div>
      {!done && (
        <div className="mt-5 flex justify-end">
          <SubmitButton onClick={submit} disabled={sel === null}>That one!</SubmitButton>
        </div>
      )}
    </section>
  );
}

// ---------- Solution cards (shown only when the answer is wrong) ----------
function QuizSolution({ round }) {
  return <p className="font-semibold text-emerald-800">{round.choices[round.answer]}</p>;
}
function SortSolution({ round }) {
  return (
    <p className="font-semibold text-emerald-800">
      {round.account} → <span className="font-pixel text-[13px]">{round.side.toUpperCase()}</span> ({round.kind})
    </p>
  );
}
function TAccountSolution({ round }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {round.postings.map((p) => (
        <TAccount key={p.account} name={p.account} tone="green" debits={p.side === 'debit' ? [round.amount] : []} credits={p.side === 'credit' ? [round.amount] : []} highlight={p.side} compact />
      ))}
    </div>
  );
}
function EntrySolution({ round }) {
  return (
    <div>
      <JournalEntry dr={round.debit} cr={round.credit} amount={round.amount} />
      {round.work && <p className="mt-2 text-sm text-navy-900"><span className="font-pixel text-[11px] uppercase text-slate-500">Working: </span>{round.work}</p>}
    </div>
  );
}
function AdjustSolution({ round }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-emerald-800">Type: {round.kind}</p>
      <JournalEntry dr={round.entry.dr} cr={round.entry.cr} amount={round.entry.amount} />
      {round.work && <p className="mt-2 text-sm text-navy-900"><span className="font-pixel text-[11px] uppercase text-slate-500">Working: </span>{round.work}</p>}
    </div>
  );
}
function TBMissingSolution({ round }) {
  const row = round.rows[round.hide];
  return <p className="font-semibold text-emerald-800">{row.name} ({row.side}) = {peso(round.answer)}</p>;
}
function TBSpotSolution({ round }) {
  const row = round.rows[round.answer];
  return <p className="font-semibold text-emerald-800">{row.name} ({peso(row.amount)}) belongs in the {row.side.toUpperCase()} column.</p>;
}

export const ROUNDS = {
  quiz: { Round: QuizRound, Solution: QuizSolution },
  balance: { Round: BalanceRound, Solution: QuizSolution, extraTime: 15 },
  sort: { Round: SortRound, Solution: SortSolution },
  taccount: { Round: TAccountRound, Solution: TAccountSolution },
  entry: { Round: EntryRound, Solution: EntrySolution },
  adjust: { Round: AdjustRound, Solution: AdjustSolution },
  tbmissing: { Round: TBMissingRound, Solution: TBMissingSolution },
  tbspot: { Round: TBSpotRound, Solution: TBSpotSolution },
};

