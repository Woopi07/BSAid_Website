import { useMemo, useState } from 'react';
import { useAudio } from '../../context/AudioProvider.jsx';
import Icon from '../Icons.jsx';

const cellsOf = (w) => [...w.answer].map((ch, k) => ({ x: w.dir === 'across' ? w.x + k : w.x, y: w.dir === 'across' ? w.y : w.y + k, ch }));

// Special Case 6 · Level 1: a 5-word accounting crossword on the newspaper's front page.
export default function Crossword({ game, onDone }) {
  const { play } = useAudio();
  const { words, cols, rows } = game;
  const [sel, setSel] = useState(0);
  const [input, setInput] = useState('');
  const [solved, setSolved] = useState({}); // n -> true
  const [misses, setMisses] = useState({}); // n -> wrong tries
  const [hints, setHints] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [msg, setMsg] = useState(null);
  const [anim, setAnim] = useState(null);
  const word = words[sel];

  // grid: which cells exist, their numbers, and which letters are filled
  const grid = useMemo(() => {
    const g = {};
    words.forEach((w) =>
      cellsOf(w).forEach((c, k) => {
        const key = `${c.x},${c.y}`;
        g[key] = g[key] ?? { ...c, words: [] };
        g[key].words.push(w.n);
        if (k === 0) g[key].num = w.n;
      })
    );
    return g;
  }, [words]);
  const filled = useMemo(() => {
    const f = {};
    words.filter((w) => solved[w.n]).forEach((w) => cellsOf(w).forEach((c) => (f[`${c.x},${c.y}`] = c.ch)));
    return f;
  }, [words, solved]);
  const active = new Set(cellsOf(word).map((c) => `${c.x},${c.y}`));

  const pick = (i) => {
    play('click');
    setSel(i);
    setInput('');
    setMsg(null);
  };

  const submit = (e) => {
    e?.preventDefault();
    if (solved[word.n] || !input.trim()) return;
    setAttempts((a) => a + 1);
    if (input.replace(/\s+/g, '').toUpperCase() === word.answer) {
      play('chime');
      const now = { ...solved, [word.n]: true };
      setSolved(now);
      setAnim(word.n);
      setMsg({ ok: true, text: game.right });
      setInput('');
      if (Object.keys(now).length === words.length) {
        setTimeout(() => {
          const review = words.map((w) => ({ q: w.clue, yours: w.answer, answer: w.answer, explain: w.explain, correct: !misses[w.n] }));
          const score = review.filter((r) => r.correct).length;
          onDone({ total: words.length, correct: score, score, attempts: attempts + 1, review });
        }, 1100);
      } else {
        const nextIdx = words.findIndex((w, i) => i > sel && !now[w.n]);
        setTimeout(() => setSel(nextIdx >= 0 ? nextIdx : words.findIndex((w) => !now[w.n])), 700);
      }
    } else {
      play('warning');
      setMisses((m) => ({ ...m, [word.n]: (m[word.n] ?? 0) + 1 }));
      setMsg({ ok: false, text: game.wrong });
    }
  };

  const across = words.map((w, i) => ({ ...w, i })).filter((w) => w.dir === 'across');
  const down = words.map((w, i) => ({ ...w, i })).filter((w) => w.dir === 'down');

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[auto_1fr]">
      {/* Newspaper grid */}
      <div className="pixel-box px-dark self-start bg-[#F4F1EA] p-4">
        <p className="border-b-2 border-navy-950 pb-1 text-center font-heading text-lg font-extrabold tracking-wide text-navy-950">THE DAILY LEDGER · Crossword</p>
        <div className="mx-auto mt-4 grid w-fit gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }, (_, i) => {
            const x = i % cols;
            const y = Math.floor(i / cols);
            const c = grid[`${x},${y}`];
            if (!c) return <span key={i} className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />;
            const letter = filled[`${x},${y}`];
            const k = cellsOf(word).findIndex((cc) => cc.x === x && cc.y === y);
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(words.findIndex((w) => w.n === (c.words.includes(word.n) && c.words.length > 1 ? c.words.find((n) => n !== word.n) : c.words[0])))}
                className={`relative flex h-10 w-10 items-center justify-center border-2 border-navy-950 font-heading text-xl font-bold sm:h-12 sm:w-12 ${
                  active.has(`${x},${y}`) ? 'bg-gold-100' : 'bg-white'
                } ${letter ? 'text-forest-700' : 'text-navy-900'}`}
                aria-label={`Cell for ${c.words.map((n) => `${n}`).join(' and ')}${letter ? `, ${letter}` : ''}`}
              >
                {c.num && <span className="absolute left-0.5 top-0 text-[10px] font-bold text-navy-600">{c.num}</span>}
                <span className={letter && anim && words.find((w) => w.n === anim) && cellsOf(words.find((w) => w.n === anim)).some((cc) => cc.x === x && cc.y === y) ? 'sp-letter' : ''} style={{ animationDelay: `${Math.max(0, k) * 0.08}s` }}>
                  {letter ?? ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clue + answer */}
      <div className="flex flex-col gap-5">
        <form onSubmit={submit} className="pixel-box px-dark bg-white p-5">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-wood-600">
            {word.n} {word.dir} · {word.answer.length} letters {solved[word.n] && '· solved'}
          </p>
          <p className="mt-2 text-lg font-semibold text-navy-900">{word.clue}</p>
          <label className="mt-4 block">
            <span className="sr-only">Your answer</span>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value.toUpperCase().slice(0, word.answer.length));
                setMsg(null);
              }}
              disabled={!!solved[word.n]}
              placeholder={hints[word.n] ? `${word.answer[0]}${'_'.repeat(word.answer.length - 1)}` : 'Type the term'}
              className="pixel-box-flat w-full rounded-none border-0 bg-cream px-3 py-3 font-heading text-xl font-bold uppercase tracking-[0.3em] text-navy-900 placeholder:tracking-[0.3em] placeholder:text-slate-400"
              autoComplete="off"
              aria-label={`Answer for ${word.n} ${word.dir}`}
            />
          </label>
          {msg && <p className={`mt-3 text-sm font-semibold ${msg.ok ? 'text-forest-700' : 'text-rose-700'}`}>{msg.ok ? '✅' : '❌'} {msg.text}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" disabled={!input.trim() || !!solved[word.n]} className="pixel-btn bg-forest text-white hover:bg-forest-700 disabled:opacity-40">
              Submit Answer
            </button>
            <button type="button" onClick={() => setInput('')} disabled={!input || !!solved[word.n]} className="pixel-btn bg-white text-navy-950 hover:bg-cream disabled:opacity-40">
              <Icon name="refresh" className="h-4 w-4" strokeWidth={2.5} /> Clear Answer
            </button>
            <button
              type="button"
              onClick={() => {
                play('click');
                setHints((h) => ({ ...h, [word.n]: true }));
              }}
              disabled={!!hints[word.n] || !!solved[word.n]}
              className="pixel-btn bg-gold text-navy-950 hover:bg-gold-300 disabled:opacity-40"
            >
              <Icon name="bulb" className="h-4 w-4" strokeWidth={2.5} /> Hint
            </button>
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-2">
          {[['Across', across], ['Down', down]].map(([title, list]) => (
            <section key={title} className="pixel-box px-dark bg-white p-4">
              <h3 className="font-pixel text-[12px] uppercase tracking-widest text-navy">{title}</h3>
              <ol className="mt-2 flex flex-col gap-1">
                {list.map((w) => (
                  <li key={w.n}>
                    <button
                      type="button"
                      onClick={() => pick(w.i)}
                      className={`w-full px-2 py-1.5 text-left text-sm ${w.i === sel ? 'bg-navy text-white' : 'text-navy-900 hover:bg-cream'} ${solved[w.n] ? 'line-through opacity-70' : ''}`}
                    >
                      <b>{w.n}.</b> {w.clue}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <p className="text-sm text-navy-100">
          {Object.keys(solved).length} / {words.length} words · {attempts} attempt{attempts === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}
