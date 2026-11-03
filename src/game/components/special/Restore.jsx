import { useEffect, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import { peso } from '../../data/special.js';
import Calculator from '../games/Calculator.jsx';
import Icon from '../Icons.jsx';

const PARTS = { debit: 'debit account', credit: 'credit account', amount: 'amount' };

// Between Words and Letters: read each evidence file and prepare its adjusting entry to restore the records.
export default function Restore({ game, onDone }) {
  const { play } = useAudio();
  const { items, accounts } = game.set;
  const [active, setActive] = useState(0);
  const [form, setForm] = useState({ debit: '', credit: '', amount: '' });
  const [done, setDone] = useState({}); // index -> true
  const [misses, setMisses] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [msg, setMsg] = useState(null);
  const [calc, setCalc] = useState(false);
  const it = items[active];
  const restored = Math.round((Object.keys(done).length / items.length) * 100);

  // The calculator's "Use answer" fills the amount.
  useEffect(() => {
    const onUse = (e) => !done[active] && setForm((f) => ({ ...f, amount: String(e.detail) }));
    window.addEventListener('calc:use', onUse);
    return () => window.removeEventListener('calc:use', onUse);
  }, [active, done]);

  const choose = (i) => {
    play('click');
    setActive(i);
    setForm({ debit: '', credit: '', amount: '' });
    setMsg(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (done[active]) return;
    setAttempts((a) => a + 1);
    const wrong = Object.keys(PARTS).filter((k) => (k === 'amount' ? Number(form.amount) !== it.amount : form[k] !== it[k]));
    if (!wrong.length) {
      play('chime');
      const now = { ...done, [active]: true };
      setDone(now);
      setMsg({ ok: true, text: game.right });
      if (Object.keys(now).length === items.length) {
        setTimeout(() => {
          const review = items.map((x, i) => ({
            q: `${x.doc}: ${x.text}`,
            yours: `Dr ${x.debit} / Cr ${x.credit} ${peso(x.amount)}`,
            answer: `Dr ${x.debit} / Cr ${x.credit} ${peso(x.amount)}`,
            explain: x.why,
            correct: !misses[i],
          }));
          onDone({ total: items.length, correct: review.filter((r) => r.correct).length, attempts: attempts + 1, review });
        }, 900);
      }
    } else {
      play('warning');
      setMisses((m) => ({ ...m, [active]: (m[active] ?? 0) + 1 }));
      setMsg({ ok: false, text: wrong.length === 1 ? `${game.wrong} Check the ${PARTS[wrong[0]]}.` : game.wrong });
    }
  };

  const nextOpen = items.findIndex((_, i) => !done[i] && i !== active);

  return (
    <div className={`mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 ${calc ? 'pb-[480px] sm:pb-6' : ''}`}>
      <div className="pixel-box px-dark bg-navy-900 p-4">
        <div className="flex items-center justify-between gap-3 font-pixel text-[12px] uppercase tracking-widest">
          <span className="text-gold">Accounting records restored</span>
          <span className="text-white">Records Restored: {restored}% Complete</span>
        </div>
        <div className="mt-3 h-4 bg-navy-950 p-0.5" role="progressbar" aria-valuenow={restored} aria-valuemin={0} aria-valuemax={100}>
          <span className="block h-full bg-forest transition-[width] duration-500" style={{ width: `${restored}%` }} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Evidence files */}
        <ol className="flex flex-col gap-2" aria-label="Supporting documents">
          {items.map((x, i) => (
            <li key={x.doc}>
              <button
                type="button"
                onClick={() => choose(i)}
                className={`pixel-box-flat flex w-full items-center gap-3 p-3 text-left ${i === active ? 'px-gold bg-gold-50' : 'px-navy bg-white hover:bg-cream'}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center ${done[i] ? 'bg-forest text-white' : 'bg-navy text-white'}`}>
                  {done[i] ? <Icon name="check" className="h-4 w-4" strokeWidth={3.5} /> : <Icon name="doc" className="h-4 w-4" strokeWidth={2.5} />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-navy-900">{x.doc}</span>
                  <span className="block text-xs text-slate-500">{done[i] ? 'Restored' : 'Needs adjustment'}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* Document + entry */}
        <form onSubmit={submit} className="pixel-box px-dark bg-white p-5 sm:p-6">
          <div className="pixel-box-flat px-wood bg-[#FFFBF0] p-4">
            <p className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-widest text-wood-600">
              <Icon name="doc" className="h-4 w-4" strokeWidth={2.5} /> Evidence · {it.doc}
            </p>
            <p className="mt-2 text-navy-900">{it.text}</p>
          </div>

          <p className="mt-5 font-pixel text-[11px] uppercase tracking-widest text-navy">Adjusting journal entry · December 31</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_160px]">
            {['debit', 'credit'].map((side) => (
              <label key={side} className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-slate-500">{side === 'debit' ? 'Debit (Dr)' : 'Credit (Cr)'}</span>
                <select
                  value={done[active] ? it[side] : form[side]}
                  disabled={!!done[active]}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, [side]: e.target.value }));
                    setMsg(null);
                  }}
                  className="pixel-box-flat w-full rounded-none border-0 bg-cream px-3 py-2.5 text-sm font-semibold text-navy-900"
                >
                  <option value="">Choose account…</option>
                  {accounts.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase text-slate-500">Amount (₱)</span>
              <input
                inputMode="numeric"
                value={done[active] ? String(it.amount) : form.amount}
                disabled={!!done[active]}
                onChange={(e) => {
                  setForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9]/g, '') }));
                  setMsg(null);
                }}
                placeholder="0"
                className="pixel-box-flat w-full rounded-none border-0 bg-cream px-3 py-2.5 text-right font-heading text-lg font-bold tabular-nums text-navy-900"
              />
            </label>
          </div>

          {msg && <p className={`mt-4 text-sm font-semibold ${msg.ok ? 'text-forest-700' : 'text-rose-700'}`}>{msg.ok ? '✅' : '❌'} {msg.text}</p>}
          {done[active] && <p className="mt-2 text-sm text-slate-600">{it.why}</p>}

          <div className="mt-5 flex flex-wrap gap-3">
            {done[active] ? (
              nextOpen >= 0 && (
                <button type="button" onClick={() => choose(nextOpen)} className="pixel-btn bg-forest text-white hover:bg-forest-700">
                  Next document <PixelSprite name="arrow" scale={2} />
                </button>
              )
            ) : (
              <>
                <button type="submit" disabled={!form.debit || !form.credit || !form.amount} className="pixel-btn bg-forest text-white hover:bg-forest-700 disabled:opacity-40">
                  Submit Answer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ debit: '', credit: '', amount: '' });
                    setMsg(null);
                  }}
                  className="pixel-btn bg-white text-navy-950 hover:bg-cream"
                >
                  <Icon name="refresh" className="h-4 w-4" strokeWidth={2.5} /> Clear Answer
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                play('click');
                setCalc((v) => !v);
              }}
              aria-pressed={calc}
              className={`pixel-btn ${calc ? 'bg-navy-400 text-cream' : 'bg-white text-navy-950 hover:bg-cream'}`}
            >
              <PixelSprite name="calculator" scale={1} className="h-4 w-4" /> Calculator
            </button>
          </div>
        </form>
      </div>
      {calc && <Calculator onClose={() => setCalc(false)} canUse={!done[active]} />}
    </div>
  );
}
