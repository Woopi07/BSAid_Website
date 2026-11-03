import { useEffect, useRef, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import Dialog from '../../../components/ui/Dialog.jsx';
import { useGame } from '../../context/GameProvider.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import { CAST, SPECIAL_CASES } from '../../data/special.js';
import Scene from '../Scene.jsx';
import Avatar from '../Avatar.jsx';
import Icon from '../Icons.jsx';
import SettingsModal from '../SettingsModal.jsx';
import Story from './Story.jsx';
import FillBlanks from './FillBlanks.jsx';
import Crossword from './Crossword.jsx';
import Vault from './Vault.jsx';
import Restore from './Restore.jsx';

const GAMES = { blanks: FillBlanks, crossword: Crossword, vault: Vault, adjust: Restore };
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

function Briefing({ level, onClose, inline = false, onStart }) {
  const b = level.briefing;
  const body = (
    <div className="flex flex-col gap-4 text-navy-900">
      <div>
        <p className="font-pixel text-[11px] uppercase tracking-widest text-forest-700">Challenge</p>
        <p className="mt-1 font-semibold">{b.challenge}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-pixel text-[11px] uppercase tracking-widest text-forest-700">Objectives</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {b.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-pixel text-[11px] uppercase tracking-widest text-forest-700">Instructions</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
            {b.instructions.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ol>
        </div>
      </div>
      {b.hint && (
        <p className="flex gap-2 bg-gold-50 p-3 text-sm">
          <Icon name="bulb" className="h-5 w-5 shrink-0 text-wood-600" strokeWidth={2.5} /> <span><b>Hint:</b> {b.hint}</span>
        </p>
      )}
    </div>
  );
  if (inline)
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="pixel-box px-dark animate-pop bg-white">
          <div className="border-b-4 border-navy-950 bg-navy px-5 py-3">
            <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Problem briefing</p>
            <h2 className="text-2xl font-bold text-white">{level.title}</h2>
          </div>
          <div className="p-5 sm:p-6">
            {body}
            <button type="button" autoFocus onClick={onStart} className="pixel-btn mt-6 w-full bg-forest text-white hover:bg-forest-700">
              Start Investigation <PixelSprite name="arrow" scale={2} />
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <Dialog labelledBy="brief-title" onClose={onClose} className="bg-navy-950/80">
      <div className="pixel-box px-dark w-full max-w-2xl animate-pop bg-white">
        <div className="flex items-center justify-between border-b-4 border-navy-950 bg-navy px-5 py-3">
          <h2 id="brief-title" className="font-pixel text-[13px] uppercase tracking-widest text-white">Instructions & objectives</h2>
          <button type="button" onClick={onClose} className="text-white hover:text-gold" aria-label="Close instructions">
            <Icon name="close" className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
        <div className="max-h-[70dvh] overflow-y-auto p-5">{body}</div>
      </div>
    </Dialog>
  );
}

function Results({ level, stats, onRetry, onContinue, onMenu, last }) {
  const [review, setReview] = useState(false);
  const rec = level.results.recommend?.(stats);
  const metric = level.results.metric;
  const rows = [
    metric === 'time' && ['Answer Accuracy', `${stats.correct}/${stats.total}`],
    metric === 'score' && ['Crossword Accuracy', `${stats.correct}/${stats.total}`],
    metric === 'attempts' && ['Correct Answers', `${stats.correct}/${stats.total}`],
    metric === 'digits' && ['Correct Answers', `${stats.correct}/${stats.total}`],
    metric === 'digits' && ['Vault Code Accuracy', `${stats.digits}/5 digits`],
    metric === 'accuracy' && ['Correct Adjusting Entries', `${stats.correct}/${stats.total}`],
    metric === 'accuracy' && ['Overall Accuracy', `${Math.round((stats.correct / stats.total) * 100)}%`],
    ['Attempts', stats.attempts],
    ['Completion Time', fmtTime(stats.time)],
  ].filter(Boolean);
  const who = rec && CAST[rec.by];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <div className="pixel-box px-dark animate-pop bg-navy-900 text-center">
        <div className="border-b-4 border-navy-950 bg-forest px-4 py-3">
          <p className="font-pixel text-[13px] uppercase tracking-widest text-white">{level.title} · complete</p>
        </div>
        <div className="p-6">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Performance summary</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {rows.map(([k, v]) => (
              <div key={k} className="bg-navy-950 p-3">
                <dt className="font-pixel text-[10px] uppercase text-navy-200">{k}</dt>
                <dd className="mt-2 font-pixel text-base text-gold">{v}</dd>
              </div>
            ))}
          </dl>
          {rec && (
            <div className="pixel-box-flat px-cream mt-6 flex items-center gap-3 bg-navy-950 p-3 text-left">
              {who && (
                <span className="pixel-box-flat px-gold shrink-0 bg-cream">
                  <Avatar look={who.look} round={false} className="block h-10 w-10" alt="" />
                </span>
              )}
              <p className="text-sm text-cream">
                <span className="block font-pixel text-[10px] uppercase tracking-widest text-gold">Recommendation{who ? ` · ${who.short}` : ''}</span>
                {rec.text}
              </p>
            </div>
          )}
          {level.results.takeaways && (
            <div className="mt-6 text-left">
              <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Key takeaways · By completing this activity, you learned to:</p>
              <ul className="mt-2 space-y-1 text-sm text-navy-100">
                {level.results.takeaways.map((t) => (
                  <li key={t} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-forest-300" strokeWidth={3} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setReview((v) => !v)} aria-expanded={review} className="pixel-btn bg-white text-navy-950 hover:bg-cream">
              <Icon name="book" className="h-4 w-4 text-wood-600" strokeWidth={2.5} /> Review Answers
            </button>
            <button type="button" onClick={onRetry} className="pixel-btn bg-navy-600 text-cream hover:bg-navy-400">
              <Icon name="refresh" className="h-4 w-4" strokeWidth={2.5} /> Retry Puzzle
            </button>
            <button type="button" autoFocus onClick={onContinue} className="pixel-btn bg-forest text-white hover:bg-forest-700">
              {last ? 'Finish the case' : 'Continue Investigation'} <PixelSprite name="arrow" scale={2} />
            </button>
            <button type="button" onClick={onMenu} className="pixel-btn bg-white text-navy-950 hover:bg-cream">
              <Icon name="home" className="h-4 w-4" strokeWidth={2.5} /> Return to Main Menu
            </button>
          </div>
        </div>
      </div>

      {review && (
        <section className="pixel-box px-dark bg-white p-5" aria-label="Answer review">
          <h3 className="text-2xl font-bold">Answer review</h3>
          <ol className="mt-4 flex flex-col gap-4">
            {stats.review.map((r, i) => (
              <li key={i} className={`pixel-box-flat bg-white p-4 ${r.correct ? '[--px:#2E9E44]' : '[--px:#F5A623]'}`}>
                <p className="text-sm font-semibold text-navy-900">
                  <span className="font-pixel text-[11px] uppercase text-slate-500">{r.topic ? `${r.topic} · ` : ''}Question {i + 1} · </span>
                  {r.q}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-pixel text-[11px] uppercase text-slate-500">Your answer: </span>
                  <span className={r.correct ? 'text-forest-700' : 'text-wood-600'}>{r.yours}</span>
                  {!r.correct && <span className="text-slate-500"> (after a retry)</span>}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-pixel text-[11px] uppercase text-slate-500">Correct answer: </span>
                  <b className="text-navy-900">{r.answer}</b>
                </p>
                {r.steps && (
                  <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-sm text-slate-700">
                    {r.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                )}
                {r.principle && <p className="mt-2 text-sm text-slate-700"><b>Accounting principle applied:</b> {r.principle}</p>}
                {r.explain && <p className="mt-2 text-sm text-slate-700"><b>Explanation:</b> {r.explain}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

function Hub({ sc, progress, onStart }) {
  const sp = progress._special?.[sc.id] ?? { unlocked: 1, levels: {} };
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div className="pixel-box px-dark animate-pop overflow-hidden bg-navy-900">
        <div className="sp-dossier relative p-6 sm:p-8">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">
            Special Case {sc.number} {sc.wip && '· Work in progress'}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{sc.title}</h1>
          <p className="mt-2 max-w-2xl text-navy-100">{sc.tagline}</p>
          <span className="sp-confidential absolute right-4 top-4 hidden border-4 border-rose-500/70 px-3 py-1 font-heading text-lg font-extrabold uppercase tracking-widest text-rose-400/80 sm:block">Confidential</span>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-6">
          {[
            ['Business background', sc.background],
            ['Detective profile', sc.detective],
            ['Business problem', sc.problem],
          ].map(([t, body]) => (
            <section key={t} className="pixel-box px-dark bg-white p-5">
              <h2 className="font-pixel text-[12px] uppercase tracking-widest text-navy">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
            </section>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <section className="pixel-box px-dark bg-white p-5">
            <h2 className="font-pixel text-[12px] uppercase tracking-widest text-navy">Investigation · 3 levels</h2>
            <ol className="mt-3 flex flex-col gap-3">
              {sc.levels.map((l) => {
                const r = sp.levels[l.id];
                const locked = l.id > sp.unlocked;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => onStart(l.id)}
                      className={`pixel-box-flat flex w-full items-center gap-3 p-3 text-left ${locked ? 'px-navy cursor-not-allowed bg-slate-100 opacity-70' : 'px-gold bg-gold-50 hover:bg-gold-100'}`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center font-pixel text-sm ${r ? 'bg-forest text-white' : locked ? 'bg-slate-300 text-slate-500' : 'bg-navy text-white'}`}>
                        {r ? <Icon name="check" className="h-5 w-5" strokeWidth={3} /> : locked ? <Icon name="lock" className="h-4 w-4" strokeWidth={2.5} /> : l.id}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading font-bold text-navy-900">Level {l.id}: {l.title}</span>
                        <span className="block text-xs text-slate-500">{r ? `Best: ${r.correct}/${r.total} · ${r.attempts} attempts · ${fmtTime(r.time)}` : locked ? 'Finish the previous level first' : 'Ready to investigate'}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <button type="button" onClick={() => onStart(Math.min(sp.unlocked, sc.levels.length))} className="pixel-btn mt-4 w-full bg-forest text-white hover:bg-forest-700">
              {sp.solved ? 'Replay Case' : Object.keys(sp.levels).length ? 'Continue Case' : 'Start Case'} <PixelSprite name="arrow" scale={2} />
            </button>
          </section>
          <section className="pixel-box px-dark bg-white p-5">
            <h2 className="font-pixel text-[12px] uppercase tracking-widest text-navy">Learning objectives</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {sc.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <h2 className="mt-4 font-pixel text-[12px] uppercase tracking-widest text-navy">Topics covered</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {sc.topics.map((t) => (
                <li key={t} className="bg-wood-100 px-2 py-1 text-xs font-semibold text-wood-800">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// A special case: dossier hub, then each level's Story → Briefing → Gameplay → Results → Ending.
export default function SpecialCase() {
  const { state, dispatch } = useGame();
  const { play } = useAudio();
  const sc = SPECIAL_CASES.find((c) => c.id === state.specialId);
  const [levelId, setLevelId] = useState(null);
  const [phase, setPhase] = useState('hub'); // hub | story | briefing | play | results | end
  const [stats, setStats] = useState(null);
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [settings, setSettings] = useState(false);
  const clock = useRef({ start: 0, pausedAt: 0, pausedFor: 0 });
  const mainRef = useRef(null);
  const level = sc.levels.find((l) => l.id === levelId);
  const Game = level && GAMES[level.game.type];

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [phase, levelId]);

  const startLevel = (id) => {
    play('pop');
    setLevelId(id);
    setStats(null);
    setPhase('story');
  };
  const beginPlay = () => {
    play('pop');
    clock.current = { start: Date.now(), pausedAt: 0, pausedFor: 0 };
    setRun((n) => n + 1);
    setPhase('play');
  };
  const togglePause = () => {
    play('click');
    if (paused) clock.current.pausedFor += Date.now() - clock.current.pausedAt;
    else clock.current.pausedAt = Date.now();
    setPaused((p) => !p);
  };
  const finish = (s) => {
    const time = (Date.now() - clock.current.start - clock.current.pausedFor) / 1000;
    const full = { ...s, time };
    setStats(full);
    dispatch({ type: 'COMPLETE_SPECIAL', id: sc.id, level: level.id, last: sc.levels.length, stats: { correct: full.correct, total: full.total, attempts: full.attempts, time } });
    play('unlock');
    setPhase('results');
  };
  const exit = (panel) => {
    play('click');
    dispatch({ type: 'EXIT_SPECIAL', panel });
  };
  const storyLines = level ? [...(level.id === 1 ? sc.prologue : []), ...level.story] : [];

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b-4 border-navy-950 bg-navy-900 px-3 sm:px-5">
        <button
          type="button"
          onClick={() => (phase === 'hub' ? exit() : (play('click'), setPhase('hub'), setPaused(false)))}
          className="pixel-btn h-9 shrink-0 gap-1 bg-cream px-2.5 text-navy-950 hover:bg-white sm:px-3"
          aria-label={phase === 'hub' ? 'Exit case' : 'Back to case file'}
        >
          <Icon name="chevronLeft" className="h-5 w-5" strokeWidth={3} />
          <span className="hidden sm:inline">{phase === 'hub' ? 'Exit Case' : 'Case file'}</span>
        </button>
        <span className="shrink-0 bg-rose-700 px-2 py-1.5 font-pixel text-[12px] text-white">SPECIAL #{sc.number}</span>
        <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-cream sm:text-xl">{level ? `Level ${level.id}: ${level.title}` : sc.company}</h1>
        {phase === 'play' && (
          <>
            <button type="button" onClick={() => (play('click'), setShowBrief(true))} className="pixel-btn h-9 shrink-0 gap-1.5 bg-navy-600 px-2.5 text-cream hover:bg-navy-400" aria-label="View instructions">
              <Icon name="book" className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden md:inline">Instructions</span>
            </button>
            <button type="button" onClick={togglePause} className="pixel-btn h-9 shrink-0 gap-1.5 bg-navy-600 px-2.5 text-cream hover:bg-navy-400" aria-label="Pause">
              <Icon name="pause" className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden md:inline">Pause</span>
            </button>
          </>
        )}
        <button type="button" onClick={() => (play('click'), setSettings(true))} className="pixel-btn h-9 shrink-0 gap-1.5 bg-navy-600 px-2.5 text-cream hover:bg-navy-400" aria-label="Settings">
          <Icon name="gear" className="h-4 w-4" strokeWidth={2.25} />
          <span className="hidden md:inline">Settings</span>
        </button>
      </header>
      {settings && <SettingsModal onClose={() => setSettings(false)} />}
      {showBrief && level && <Briefing level={level} onClose={() => setShowBrief(false)} />}

      <Scene sprites={false}>
        <main ref={mainRef} className="pixel-scroll relative min-h-0 flex-1 overflow-y-auto">
          {phase === 'hub' && <Hub sc={sc} progress={state.progress} onStart={startLevel} />}
          {phase === 'story' && <Story key={`s${levelId}`} lines={storyLines} setting={level.setting} label={`Phase 1 · Story · Level ${level.id}`} onDone={() => setPhase('briefing')} doneLabel="Start Case" />}
          {phase === 'briefing' && <Briefing level={level} inline onStart={beginPlay} />}
          {phase === 'play' && Game && (
            <div className={paused ? 'pointer-events-none blur-sm' : ''} aria-hidden={paused}>
              <Game key={run} game={level.game} onDone={finish} />
            </div>
          )}
          {phase === 'results' && stats && (
            <Results
              level={level}
              stats={stats}
              last={level.id === sc.levels.length}
              onRetry={beginPlay}
              onContinue={() => setPhase('end')}
              onMenu={() => exit('dashboard')}
            />
          )}
          {phase === 'end' && (
            <Story
              key={`e${levelId}`}
              lines={level.end}
              setting={level.setting}
              label={`Phase 4 · Ending · Level ${level.id}`}
              statements={level.game.set}
              doneLabel={level.id === sc.levels.length ? 'Close the case' : `Next: Level ${level.id + 1}`}
              onDone={() => (level.id === sc.levels.length ? (setPhase('hub'), setLevelId(null)) : startLevel(level.id + 1))}
            />
          )}
          {paused && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-navy-950/60 p-4">
              <div className="pixel-box px-dark w-full max-w-xs animate-pop bg-white p-6 text-center">
                <p className="font-pixel text-[13px] uppercase tracking-widest text-navy">Paused</p>
                <p className="mt-2 text-sm text-slate-600">The timer is stopped.</p>
                <button type="button" autoFocus onClick={togglePause} className="pixel-btn mt-5 w-full bg-forest text-white hover:bg-forest-700">
                  <Icon name="play" className="h-4 w-4" /> Resume
                </button>
                <button type="button" onClick={() => exit()} className="pixel-btn mt-3 w-full bg-white text-navy-950 hover:bg-cream">
                  Exit Case
                </button>
              </div>
            </div>
          )}
        </main>
      </Scene>
    </div>
  );
}
