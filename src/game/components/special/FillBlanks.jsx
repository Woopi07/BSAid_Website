import { useMemo, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import Icon from '../Icons.jsx';

// Special Case 4 · Level 1: drag (or tap) the right accounting term from the word bank into the answer box.
export default function FillBlanks({ game, onDone }) {
  const { play } = useAudio();
  const qs = game.questions;
  const terms = useMemo(() => [...qs.map((q) => q.answer)].sort(() => Math.random() - 0.5), [qs]);
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState(null);
  const [used, setUsed] = useState([]);
  const [msg, setMsg] = useState(null);
  const [misses, setMisses] = useState(0); // wrong tries on the current question
  const [log, setLog] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [over, setOver] = useState(false);
  const q = qs[idx];
  const solved = msg?.ok;

  const submit = () => {
    if (!placed || solved) return;
    setAttempts((a) => a + 1);
    if (placed === q.answer) {
      play('chime');
      setMsg({ ok: true, text: game.right });
      setUsed((u) => [...u, placed]);
      setLog((l) => [...l, { q: q.q, yours: placed, answer: q.answer, explain: q.explain, correct: misses === 0 }]);
    } else {
      play('warning');
      setMisses((m) => m + 1);
      setMsg({ ok: false, text: game.wrong });
    }
  };

  const next = () => {
    play('page');
    if (idx === qs.length - 1) {
      setOver(true);
      onDone({ total: qs.length, correct: log.filter((l) => l.correct).length, attempts, review: log });
      return;
    }
    setIdx((i) => i + 1);
    setPlaced(null);
    setMsg(null);
    setMisses(0);
  };

  if (over) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-pixel text-[12px] uppercase tracking-widest text-gold">The refresher book · Question {idx + 1} of {qs.length}</p>
        <span className="flex gap-1" aria-hidden="true">
          {qs.map((_, i) => (
            <span key={i} className={`h-2.5 w-5 ${i < idx || (i === idx && solved) ? 'bg-forest' : i === idx ? 'bg-gold' : 'bg-navy-600'}`} />
          ))}
        </span>
      </div>

      {/* Open book */}
      <div className="pixel-box px-dark grid bg-[#FBF7EE] md:grid-cols-2">
        <div className="border-b-4 border-navy-950/10 p-5 sm:p-7 md:border-b-0 md:border-r-4">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-wood-600">Question {idx + 1}</p>
          <p className="mt-3 text-lg leading-relaxed text-navy-900">{q.q}</p>
        </div>
        <div className="flex flex-col gap-4 p-5 sm:p-7">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-wood-600">Answer box</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (solved) return;
              const t = e.dataTransfer.getData('text/plain');
              if (t) {
                play('click');
                setPlaced(t);
                setMsg(null);
              }
            }}
            className={`flex min-h-[64px] items-center justify-center border-4 border-dashed p-3 text-center font-heading text-2xl font-bold ${
              solved ? 'border-forest bg-forest-50 text-forest-700' : msg ? 'border-rose-400 bg-rose-50 text-rose-700' : placed ? 'border-navy bg-white text-navy' : 'border-navy-200 bg-white/60 text-navy-200'
            }`}
            aria-live="polite"
          >
            {placed ?? 'Drag a term here'}
          </div>
          {msg && (
            <p className={`flex items-start gap-2 text-sm font-semibold ${msg.ok ? 'text-forest-700' : 'text-rose-700'}`}>
              {msg.ok ? '✅' : '❌'} {msg.text}
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-3">
            {solved ? (
              <button type="button" onClick={next} className="pixel-btn bg-forest text-white hover:bg-forest-700">
                {idx === qs.length - 1 ? 'Finish' : 'Next Question'} <PixelSprite name="arrow" scale={2} />
              </button>
            ) : (
              <>
                <button type="button" onClick={submit} disabled={!placed} className="pixel-btn bg-forest text-white hover:bg-forest-700 disabled:opacity-40">
                  Submit Answer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    setPlaced(null);
                    setMsg(null);
                  }}
                  disabled={!placed}
                  className="pixel-btn bg-white text-navy-950 hover:bg-cream disabled:opacity-40"
                >
                  <Icon name="refresh" className="h-4 w-4" strokeWidth={2.5} /> Clear Answer
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Word bank */}
      <section aria-label="Choices">
        <p className="font-pixel text-[12px] uppercase tracking-widest text-navy-100">Choices · drag or tap a term</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {terms.map((t) => {
            const gone = used.includes(t);
            return (
              <li key={t}>
                <button
                  type="button"
                  draggable={!gone && !solved}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', t)}
                  onClick={() => {
                    if (gone || solved) return;
                    play('click');
                    setPlaced(t);
                    setMsg(null);
                  }}
                  disabled={gone}
                  className={`pixel-btn cursor-grab px-4 py-2.5 text-[13px] normal-case active:cursor-grabbing ${
                    gone ? 'bg-navy-800 text-navy-400 line-through' : placed === t ? 'bg-gold text-navy-950' : 'bg-white text-navy-950 hover:bg-cream'
                  }`}
                >
                  {t}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
