import { useEffect, useRef, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import { CAST, peso } from '../../data/special.js';
import Avatar from '../Avatar.jsx';
import Icon from '../Icons.jsx';

// Recorded (altered) vs reconstructed income statement, shown when the adjustments are complete.
export function Statements({ set }) {
  const ni = (t) => t.revenue - t.expenses;
  const rows = [
    [set.revenueTitle, set.before.revenue, set.after.revenue],
    ['Total expenses', set.before.expenses, set.after.expenses],
  ];
  return (
    <div className="mt-4 overflow-x-auto bg-white text-navy-900">
      <table className="w-full min-w-[22rem] text-sm">
        <thead>
          <tr className="bg-navy text-left font-pixel text-[11px] uppercase text-white">
            <th className="px-3 py-2">Income statement</th>
            <th className="px-3 py-2 text-right">As recorded</th>
            <th className="px-3 py-2 text-right">Reconstructed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, a, b]) => (
            <tr key={k} className="border-b border-navy-900/10">
              <td className="px-3 py-2">{k}</td>
              <td className="px-3 py-2 text-right tabular-nums">{peso(a)}</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">{peso(b)}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="px-3 py-2">Net income</td>
            <td className="px-3 py-2 text-right tabular-nums text-rose-700 line-through decoration-2">{peso(ni(set.before))}</td>
            <td className="px-3 py-2 text-right tabular-nums text-forest-700">{peso(ni(set.after))}</td>
          </tr>
        </tbody>
      </table>
      <p className="bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
        Net income was overstated by {peso(ni(set.before) - ni(set.after))}.
      </p>
    </div>
  );
}

function Effect({ fx, statements }) {
  if (fx === 'newspaper' || fx === 'breaking')
    return (
      <div className={`sp-paper mt-4 bg-[#F4F1EA] p-4 text-navy-950 ${fx === 'breaking' ? 'sp-breaking' : ''}`}>
        <p className="border-b-2 border-navy-950 pb-1 text-center font-heading text-xl font-extrabold tracking-wide">THE DAILY LEDGER</p>
        {fx === 'breaking' ? (
          <>
            <p className="sp-flash mt-3 inline-block bg-rose-600 px-2 py-1 font-pixel text-[12px] uppercase text-white">‼️ Breaking news</p>
            <p className="mt-2 font-heading text-2xl font-extrabold leading-tight">Arcadia Corporation under scrutiny</p>
            <p className="mt-1 text-sm">Authorities suspect financial fraud. Investigation ongoing.</p>
          </>
        ) : (
          <div className="mt-3 grid grid-cols-6 gap-0.5" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} className={`aspect-square ${[0, 1, 2, 3, 4, 5, 9, 15, 19, 21].includes(i) ? 'bg-white ring-1 ring-navy-950' : 'bg-navy-950'}`} />
            ))}
          </div>
        )}
      </div>
    );
  if (fx === 'phone')
    return (
      <p className="mt-4 flex items-center gap-3 text-gold">
        <span className="sp-ring inline-flex bg-gold p-3 text-navy-950">
          <Icon name="bell" className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <span className="font-pixel text-[12px] uppercase tracking-widest">Incoming call · Head Chief</span>
      </p>
    );
  if (fx === 'vault-open')
    return (
      <div className="mt-4 flex items-center gap-4">
        <span className="sp-vault-door relative inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-navy-200 bg-navy-600">
          <span className="h-6 w-6 rounded-full border-4 border-gold" />
        </span>
        <span className="font-pixel text-[12px] uppercase tracking-widest text-forest-300">Access granted</span>
      </div>
    );
  if (fx === 'statements' && statements) return <Statements set={statements} />;
  if (fx === 'sending')
    return (
      <div className="mt-4 h-3 overflow-hidden bg-navy-800" role="progressbar" aria-label="Sending files">
        <span className="sp-sending block h-full bg-forest" />
      </div>
    );
  if (fx === 'solved')
    return (
      <div className="mt-4 flex justify-center">
        <span className="sp-stamp border-4 border-forest-300 px-6 py-3 font-heading text-4xl font-extrabold tracking-widest text-forest-300">CASE SOLVED</span>
      </div>
    );
  return null;
}

// Visual-novel style story scene. Lines appear one at a time; Continue advances, Skip jumps to the end.
export default function Story({ lines, setting, label, onDone, doneLabel = 'Continue', statements }) {
  const { play } = useAudio();
  const [shown, setShown] = useState(1);
  const endRef = useRef(null);
  const done = shown >= lines.length;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [shown]);

  const advance = () => {
    if (done) {
      play('pop');
      onDone();
    } else {
      play('page');
      setShown((n) => n + 1);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('button, input, select, [role="dialog"]')) return;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8" onClick={(e) => !e.target.closest('button') && advance()}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-pixel text-[12px] uppercase tracking-widest text-gold">{label}</p>
        {setting && <p className="text-xs italic text-navy-200">Setting: {setting}</p>}
      </div>
      <ol className="flex flex-col gap-4" aria-live="polite">
        {lines.slice(0, shown).map((line, i) => {
          const who = CAST[line.s];
          const blackout = line.fx === 'blackout';
          return (
            <li key={i} className={`flex animate-pop items-start gap-3 ${who ? '' : 'pl-0'}`}>
              {who && (
                <span className="pixel-box-flat px-gold mt-1 shrink-0 bg-cream">
                  <Avatar look={who.look} round={false} className="block h-12 w-12 sm:h-14 sm:w-14" alt="" />
                </span>
              )}
              <div className={`pixel-box-flat flex-1 p-4 sm:p-5 ${blackout ? 'bg-black text-navy-100 [--px:#000]' : line.s === 'N' ? 'px-navy bg-navy-800/90 text-navy-100' : 'px-cream bg-navy-950/95 text-cream'}`}>
                {who && <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">{who.name}</p>}
                <p className={`${who ? 'mt-2' : ''} leading-relaxed ${line.s === 'N' ? 'italic' : ''} ${line.fx === 'solved' ? 'sr-only' : ''}`}>
                  {line.s === '' ? `“${line.t}”` : line.t}
                </p>
                <Effect fx={line.fx} statements={statements} />
              </div>
            </li>
          );
        })}
      </ol>
      <div ref={endRef} className="flex items-center justify-between gap-4 pt-1">
        {!done ? (
          <button
            type="button"
            onClick={() => {
              play('click');
              setShown(lines.length);
            }}
            className="flex items-center gap-2 px-2 py-2 font-pixel text-[12px] uppercase text-navy-200 hover:text-white"
          >
            <Icon name="skip" className="h-4 w-4" strokeWidth={2.5} /> Skip story
          </button>
        ) : (
          <span />
        )}
        <button type="button" onClick={advance} className={`pixel-btn ${done ? 'bg-forest text-white hover:bg-forest-700' : 'bg-white text-navy-950 hover:bg-cream'}`}>
          {done ? doneLabel : 'Continue'} <PixelSprite name="arrow" scale={2} />
        </button>
      </div>
    </div>
  );
}
