// Runs any case's mini-game: hearts, timer, combo multiplier, hints, scoring, and the
// feedback panel that shows the full solution whenever an answer is wrong.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { useGame } from '../../context/GameProvider.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import LevelHeader from '../LevelHeader.jsx';
import Scene from '../Scene.jsx';
import Icon from '../Icons.jsx';
import { ROUNDS } from './rounds.jsx';

const MAX_MULT_STEPS = 4; // combo multiplier caps at x2.0

function points({ timeLeft, limit, combo, hint }) {
  const speed = Math.round(50 * Math.max(0, timeLeft) / limit);
  const mult = 1 + 0.25 * Math.min(combo - 1, MAX_MULT_STEPS);
  return Math.round((100 + speed) * mult * (hint ? 0.5 : 1));
}

function Hearts({ lives, max }) {
  return (
    <span className="flex items-center gap-1" aria-label={`${lives} of ${max} hearts left`}>
      {Array.from({ length: max }, (_, i) => (
        <PixelSprite key={i} name="heart" scale={3} className={i < lives ? '' : 'opacity-25 grayscale'} />
      ))}
    </span>
  );
}

function Hud({ lives, maxLives, score, combo, index, total, log, timeLeft, limit, pop }) {
  const pct = Math.max(0, timeLeft / limit);
  const segs = 20;
  const lit = Math.ceil(pct * segs);
  const danger = pct < 0.3;
  return (
    <div className="pixel-box px-dark bg-navy-900 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Hearts lives={lives} max={maxLives} />
        <div className="flex items-center gap-3">
          {combo >= 2 && (
            <span className="animate-pop bg-crimson-700 px-2.5 py-1.5 font-pixel text-[12px] uppercase text-cream" key={combo}>
              Combo ×{(1 + 0.25 * Math.min(combo - 1, MAX_MULT_STEPS)).toFixed(2).replace(/0$/, '')}
            </span>
          )}
          <span className="relative flex items-center gap-1.5 bg-navy-950 px-3 py-1.5 font-pixel text-[13px] text-gold" aria-live="polite">
            <PixelSprite name="coin" scale={1} className="h-4 w-4" /> {score.toLocaleString()}
            {pop && (
              <span key={pop.id} className="absolute -top-6 right-0 animate-floatup font-pixel text-[13px] text-emerald-400">+{pop.value}</span>
            )}
          </span>
          <span className="bg-crimson-700 px-2.5 py-1.5 font-pixel text-[12px] uppercase text-cream">
            {index + 1}/{total}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Icon name="hourglass" className={`h-4 w-4 shrink-0 ${danger ? 'text-rose-400' : 'text-gold'}`} strokeWidth={2.5} />
        <span className="flex flex-1 gap-0.5" role="timer" aria-label={`${Math.ceil(timeLeft)} seconds left`}>
          {Array.from({ length: segs }, (_, i) => (
            <span key={i} className={`h-2.5 flex-1 ${i < lit ? (danger ? 'bg-rose-500' : 'bg-gold') : 'bg-navy-950'}`} />
          ))}
        </span>
        <span className={`w-8 text-right font-pixel text-[12px] tabular-nums ${danger ? 'text-rose-300' : 'text-navy-100'}`}>{Math.ceil(Math.max(0, timeLeft))}</span>
      </div>
      <div className="mt-2 hidden gap-1 sm:flex" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 ${log[i] ? (log[i].correct ? 'bg-emerald-500' : 'bg-rose-500') : i === index ? 'bg-gold' : 'bg-navy-600'}`} />
        ))}
      </div>
    </div>
  );
}

function ReadyCard({ game, level, total, onStart }) {
  return (
    <div className="pixel-box px-dark mx-auto w-full max-w-xl animate-pop bg-navy-900">
      <div className="border-b-4 border-navy-950 bg-crimson-700 px-5 py-3">
        <p className="font-pixel text-[13px] uppercase tracking-widest text-cream">How to play</p>
      </div>
      <div className="p-6">
        <p className="flex items-center gap-3">
          <PixelSprite name={game.sprite} scale={4} />
          <span className="text-3xl font-bold text-cream">{game.name}</span>
        </p>
        <p className="mt-3 text-navy-100">{game.tagline}</p>
        <ul className="mt-5 space-y-3">
          {game.rules.map((r) => (
            <li key={r} className="flex gap-3 text-cream">
              <PixelSprite name="arrow" scale={2} className="mt-1 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ['Hearts', level.hearts],
            ['Seconds', level.time],
            ['Rounds', total],
          ].map(([k, v]) => (
            <div key={k} className="bg-navy-950 p-3">
              <dt className="font-pixel text-[11px] uppercase text-navy-200">{k}</dt>
              <dd className="mt-1 font-pixel text-lg text-gold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-navy-200">Hints cost half the round&rsquo;s points. A wrong answer or running out of time costs a heart.</p>
        <button type="button" autoFocus onClick={onStart} className="pixel-btn mt-6 w-full bg-gold py-4 text-base text-navy-950 hover:bg-gold-300">
          Start <PixelSprite name="arrow" scale={2} />
        </button>
      </div>
    </div>
  );
}

function Feedback({ entry, round, last, outOfLives, onNext, Solution }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);
  if (entry.correct) {
    return (
      <div ref={ref} className="pixel-box-flat flex animate-pop flex-col gap-4 bg-emerald-50 p-5 [--px:#059669] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-pixel text-base uppercase text-emerald-700">
            Correct! +{entry.points}
            {entry.combo >= 2 && <span className="ml-2 text-crimson-700">{entry.combo} in a row!</span>}
          </p>
          <p className="mt-1 text-sm text-navy-900">{round.explanation}</p>
        </div>
        <button type="button" autoFocus onClick={onNext} className="pixel-btn shrink-0 bg-emerald-500 text-navy-950 hover:bg-emerald-400">
          {last ? 'Finish' : 'Next'} <PixelSprite name="arrow" scale={2} />
        </button>
      </div>
    );
  }
  return (
    <div ref={ref} className="pixel-box-flat animate-pop bg-rose-50 p-5 [--px:#E11D48]">
      <p className="flex items-center gap-2 font-pixel text-base uppercase text-rose-700">
        <PixelSprite name="heart" scale={2} className="grayscale" />
        {entry.timeout ? 'Time’s up! Here’s the solution' : 'Not quite — here’s the solution'}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="bg-white p-4">
          <p className="font-pixel text-[11px] uppercase text-rose-700">Your answer</p>
          <p className="mt-2 font-semibold text-rose-900">{entry.yours}</p>
        </div>
        <div className="bg-white p-4">
          <p className="font-pixel text-[11px] uppercase text-emerald-700">Solution</p>
          <div className="mt-2">
            <Solution round={round} />
          </div>
        </div>
      </div>
      <p className="mt-4 flex gap-2 bg-gold-100 p-3 text-sm text-navy-900">
        <Icon name="bulb" className="h-5 w-5 shrink-0 text-gold-700" strokeWidth={2.25} />
        {round.explanation}
      </p>
      <div className="mt-4 flex justify-end">
        <button type="button" autoFocus onClick={onNext} className={`pixel-btn ${outOfLives ? 'bg-crimson-700 text-cream' : 'bg-cream text-navy-950 hover:bg-white'}`}>
          {outOfLives ? 'Continue' : last ? 'Finish' : 'Next'} <PixelSprite name="arrow" scale={2} />
        </button>
      </div>
    </div>
  );
}

function GameOver({ onRetry, onLevels, reached, total }) {
  return (
    <div className="pixel-box px-dark mx-auto w-full max-w-md animate-pop bg-navy-900 text-center">
      <div className="border-b-4 border-navy-950 bg-crimson-700 px-4 py-3">
        <p className="font-pixel text-[13px] uppercase tracking-widest text-cream">Out of hearts</p>
      </div>
      <div className="p-6 sm:p-8">
        <p className="pixel-title font-heading text-6xl font-bold" data-text="Game Over">Game Over</p>
        <p className="mt-6 text-navy-100">
          You reached round {reached} of {total}. Every solution you saw is practice for the next run!
        </p>
        <div className="mt-8 flex flex-col gap-5 sm:flex-row">
          <button type="button" autoFocus onClick={onRetry} className="pixel-btn flex-1 bg-gold text-navy-950 hover:bg-gold-300">
            Try again
          </button>
          <button type="button" onClick={onLevels} className="pixel-btn flex-1 bg-cream text-navy-950 hover:bg-white">
            Level select
          </button>
        </div>
      </div>
    </div>
  );
}

function Game({ onRestart }) {
  const { activeCase, activeLevel, dispatch } = useGame();
  const { play } = useAudio();
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const rounds = useMemo(() => activeLevel.build(seed), [activeLevel, seed]);
  const maxLives = activeLevel.hearts;

  const [phase, setPhase] = useState('ready'); // ready | countdown | play | feedback | over
  const [count, setCount] = useState(3);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [log, setLog] = useState([]);
  const [hint, setHint] = useState(false);
  const [pop, setPop] = useState(null);
  const [shake, setShake] = useState(false);

  const round = rounds[index];
  const kind = ROUNDS[round.type];
  const limit = activeLevel.time + (kind.extraTime ?? 0);
  const [timeLeft, setTimeLeft] = useState(limit);
  const last = index === rounds.length - 1;

  // 3-2-1 countdown
  useEffect(() => {
    if (phase !== 'countdown') return undefined;
    if (count === 0) {
      play('pop');
      const id = setTimeout(() => setPhase('play'), 450);
      return () => clearTimeout(id);
    }
    play('click');
    const id = setTimeout(() => setCount((c) => c - 1), 650);
    return () => clearTimeout(id);
  }, [phase, count, play]);

  const submit = useCallback(
    ({ correct, yours, timeout = false }) => {
      if (phase !== 'play') return;
      const nextCombo = correct ? combo + 1 : 0;
      const pts = correct ? points({ timeLeft, limit, combo: nextCombo, hint }) : 0;
      play(correct ? 'chime' : 'warning');
      setCombo(nextCombo);
      setMaxCombo((m) => Math.max(m, nextCombo));
      if (correct) {
        setScore((s) => s + pts);
        setPop({ id: Date.now(), value: pts });
      } else {
        setLives((l) => l - 1);
        setShake(true);
      }
      setLog((l) => [...l, { index, correct, yours, timeout, points: pts, combo: nextCombo, round }]);
      setPhase('feedback');
    },
    [phase, combo, timeLeft, limit, hint, play, index, round]
  );

  // round timer
  useEffect(() => {
    if (phase !== 'play') return undefined;
    const started = Date.now();
    const base = timeLeft;
    const id = setInterval(() => {
      const t = base - (Date.now() - started) / 1000;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(id);
        submit({ correct: false, yours: 'No answer — time ran out', timeout: true });
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  const next = () => {
    play('page');
    if (lives <= 0) {
      setPhase('over');
      return;
    }
    if (last) {
      const mistakes = log.filter((l) => !l.correct).length;
      dispatch({
        type: 'COMPLETE_LEVEL',
        mistakes,
        score,
        maxCombo,
        total: rounds.length,
        review: log.filter((l) => !l.correct).map(({ round: rd, yours }) => ({ round: rd, yours })),
      });
      return;
    }
    setIndex((i) => i + 1);
    setTimeLeft(activeLevel.time + (ROUNDS[rounds[index + 1].type].extraTime ?? 0));
    setHint(false);
    setPhase('play');
  };

  // Enter = next while the feedback panel is open
  useEffect(() => {
    if (phase !== 'feedback') return undefined;
    const onKey = (e) => {
      if (e.key === 'Enter' && !e.target.closest?.('button')) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const { Round, Solution } = kind;
  const entry = log[log.length - 1];

  return (
    <div className="flex h-full flex-col">
      <LevelHeader onRestart={onRestart} />
      <Scene sprites={phase !== 'play' && phase !== 'feedback'}>
        <main className="pixel-scroll min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
            {phase === 'ready' && (
              <ReadyCard
                game={activeCase.game}
                level={activeLevel}
                total={rounds.length}
                onStart={() => {
                  setCount(3);
                  setPhase('countdown');
                }}
              />
            )}

            {phase === 'countdown' && (
              <div className="flex min-h-[50vh] items-center justify-center" aria-live="assertive">
                <p key={count} className="pixel-title animate-pop font-heading text-[9rem] font-bold leading-none" data-text={count || 'GO!'}>
                  {count || 'GO!'}
                </p>
              </div>
            )}

            {phase === 'over' && (
              <GameOver reached={index + 1} total={rounds.length} onRetry={onRestart} onLevels={() => dispatch({ type: 'BACK_TO_LEVELS' })} />
            )}

            {(phase === 'play' || phase === 'feedback') && (
              <>
                <Hud lives={lives} maxLives={maxLives} score={score} combo={combo} index={index} total={rounds.length} log={log} timeLeft={timeLeft} limit={limit} pop={pop} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-pixel text-[12px] uppercase tracking-widest text-ember-200">
                    {activeCase.game.name} · Level {activeLevel.id} · {activeLevel.title}
                  </p>
                  {phase === 'play' && round.hint && (
                    <button
                      type="button"
                      onClick={() => {
                        play('click');
                        setHint(true);
                      }}
                      disabled={hint}
                      className="pixel-btn bg-gold px-3 py-2 text-[12px] text-navy-950 hover:bg-gold-300 disabled:opacity-60"
                    >
                      <Icon name="bulb" className="h-4 w-4" strokeWidth={2.5} /> {hint ? 'Hint used' : 'Hint (−50% pts)'}
                    </button>
                  )}
                </div>
                {hint && phase === 'play' && (
                  <p className="pixel-box-flat px-gold flex animate-pop gap-2 bg-gold-50 p-3 text-sm text-navy-900">
                    <Icon name="bulb" className="h-5 w-5 shrink-0 text-gold-700" strokeWidth={2.25} />
                    {round.hint}
                  </p>
                )}
                <div className={shake ? 'animate-shake' : ''} onAnimationEnd={() => setShake(false)}>
                  <Round
                    key={index}
                    round={round}
                    rounds={rounds}
                    index={index}
                    caseInfo={activeCase}
                    done={phase === 'feedback'}
                    reveal={phase === 'feedback' && !entry?.correct}
                    onSubmit={submit}
                  />
                </div>
                {phase === 'feedback' && entry && (
                  <Feedback entry={entry} round={round} last={last} outOfLives={lives <= 0} onNext={next} Solution={Solution} />
                )}
              </>
            )}
          </div>
        </main>
      </Scene>
    </div>
  );
}

export default function GameScreen() {
  const [run, setRun] = useState(0);
  return <Game key={run} onRestart={() => setRun((n) => n + 1)} />;
}
