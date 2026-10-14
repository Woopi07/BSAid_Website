import { useState } from 'react';
import Dialog from '../../components/ui/Dialog.jsx';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';

const LEVEL_ICONS = ['search', 'book', 'refresh', 'doc'];

function LevelTile({ level, state, result, onSelect }) {
  const [shake, setShake] = useState(false);
  const locked = state === 'locked';
  const soon = state === 'soon';

  const styles = {
    active: 'bg-amber-50 ring-2 ring-ep-amber hover:bg-amber-100',
    done: 'bg-green-50 ring-2 ring-ep-green/60 hover:bg-green-100',
    soon: 'bg-ep-paper ring-1 ring-ep-line',
    locked: 'bg-slate-100 ring-1 ring-slate-200 cursor-not-allowed',
  }[state];

  return (
    <button
      type="button"
      aria-disabled={locked || soon}
      onClick={() => (onSelect(level, state) ? null : setShake(true))}
      onAnimationEnd={() => setShake(false)}
      className={`relative flex items-center gap-4 rounded-2xl p-4 text-left transition ${styles} ${shake ? 'animate-shake' : ''}`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
          locked ? 'bg-slate-200 text-slate-400' : state === 'done' ? 'bg-ep-green text-white' : 'bg-ep-amber text-ep-navy'
        }`}
      >
        <Icon name={locked ? 'lock' : state === 'done' ? 'check' : LEVEL_ICONS[level.id - 1]} className="h-7 w-7" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-rounded text-xs font-extrabold uppercase tracking-wider ${locked ? 'text-slate-400' : 'text-ep-green'}`}>
          Level {level.id}
        </span>
        <span className={`block font-rounded text-lg font-black leading-snug ${locked ? 'text-slate-400' : 'text-ep-ink'}`}>
          {level.title}
        </span>
        <span className="mt-0.5 block font-rounded text-xs font-bold text-slate-500">
          {locked && `Clear Level ${level.id - 1} to unlock`}
          {soon && 'Coming in the next update'}
          {state === 'active' && `${level.questions.length} questions`}
          {state === 'done' && `Best rank ${result.rank} · ${result.points} pts · Play again`}
        </span>
      </span>
      {state === 'active' && <Icon name="play" className="h-5 w-5 shrink-0 text-ep-green" />}
    </button>
  );
}

export default function LevelModal() {
  const { activeCase, progressOf, dispatch } = useGame();
  const { play } = useAudio();
  if (!activeCase) return null;
  const p = progressOf(activeCase);
  const close = () => {
    play('click');
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const stateOf = (level) => {
    if (level.id > p.unlocked) return 'locked';
    if (p.levels[level.id]) return level.questions.length ? 'done' : 'soon';
    return level.questions.length ? 'active' : 'soon';
  };

  const select = (level, state) => {
    if (state === 'locked' || state === 'soon') {
      play('locked');
      return false;
    }
    play('pop');
    dispatch({ type: 'START_LEVEL', levelId: level.id });
    return true;
  };

  return (
    <Dialog labelledBy="level-modal-title" onClose={close} className="animate-fade bg-ep-deep/60 backdrop-blur-sm">
      <div className="flex max-h-full w-full max-w-2xl animate-rise flex-col overflow-hidden rounded-3xl bg-ep-cream shadow-2xl">
        <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-ep-navy to-ep-royal p-5 sm:p-6">
          <div>
            <h2 id="level-modal-title" className="font-rounded text-2xl font-black text-white">Select A Level</h2>
            <p className="mt-1 font-rounded text-sm font-semibold text-blue-100">Choose a level to begin your case adventure.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200"
            aria-label="Close level select"
          >
            <Icon name="close" className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="no-scrollbar overflow-y-auto p-5 sm:p-6">
          <div className="flex items-center gap-4 rounded-2xl bg-amber-50/70 p-4 ring-1 ring-ep-line">
            <Avatar look={activeCase.avatar} className="h-14 w-14 shrink-0 ring-2 ring-white" alt={activeCase.owner} />
            <div className="min-w-0 flex-1">
              <p className="font-rounded text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Case #{activeCase.id} &middot; {activeCase.shortType}
              </p>
              <p className="font-rounded text-lg font-black text-ep-ink">{activeCase.name}</p>
              <p className="font-rounded text-sm font-semibold text-slate-500">
                Owner: {activeCase.owner} &middot; {activeCase.category}
              </p>
            </div>
            <span className="hidden gap-0.5 text-ep-amber sm:flex" aria-label={`Difficulty ${activeCase.difficulty} of 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Icon key={n} name="star" className="h-4 w-4" filled={n <= activeCase.difficulty} strokeWidth={1.8} />
              ))}
            </span>
          </div>
          <p className="mt-4 font-rounded text-[15px] leading-relaxed text-slate-700">{activeCase.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {activeCase.levels.map((level) => (
              <LevelTile key={level.id} level={level} state={stateOf(level)} result={p.levels[level.id]} onSelect={select} />
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
