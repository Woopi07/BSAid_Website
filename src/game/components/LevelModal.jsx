import { useState } from 'react';
import Dialog from '../../components/ui/Dialog.jsx';
import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';

const LEVEL_ICONS = ['search', 'book', 'refresh', 'doc'];

function LevelTile({ level, state, result, onSelect }) {
  const [shake, setShake] = useState(false);
  const locked = state === 'locked';
  const soon = state === 'soon';

  const box = {
    active: 'px-gold bg-gold-50 hover:-translate-y-1',
    done: 'bg-emerald-50 [--px:#059669] hover:-translate-y-1',
    soon: 'px-navy bg-white',
    locked: 'px-navy bg-slate-100 cursor-not-allowed',
  }[state];
  const badge = {
    active: 'bg-gold text-navy-950',
    done: 'bg-emerald-500 text-navy-950',
    soon: 'bg-navy text-cream',
    locked: 'bg-slate-300 text-slate-500',
  }[state];

  return (
    <button
      type="button"
      aria-disabled={locked || soon}
      onClick={() => (onSelect(level, state) ? null : setShake(true))}
      onAnimationEnd={() => setShake(false)}
      className={`pixel-box-flat relative flex items-center gap-4 p-4 text-left transition-transform ${box} ${shake ? 'animate-shake' : ''}`}
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center ${badge}`}>
        <Icon name={locked ? 'lock' : state === 'done' ? 'check' : LEVEL_ICONS[level.id - 1]} className="h-7 w-7" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-pixel text-[12px] uppercase ${locked ? 'text-slate-400' : 'text-ember-600'}`}>Level {level.id}</span>
        <span className={`mt-1 block font-heading text-xl font-semibold leading-tight ${locked ? 'text-slate-400' : 'text-navy-900'}`}>
          {level.title}
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          {locked && `Clear Level ${level.id - 1} to unlock`}
          {soon && 'Coming in the next update'}
          {state === 'active' && `${level.questions.length} questions`}
          {state === 'done' && `Best rank ${result.rank} · ${result.points} pts · Play again`}
        </span>
      </span>
      {state === 'active' && <PixelSprite name="arrow" scale={3} className="shrink-0 animate-nudge" />}
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
    <Dialog labelledBy="level-modal-title" onClose={close} className="animate-fade bg-navy-950/85">
      <div className="pixel-box px-dark flex max-h-full w-full max-w-2xl animate-pop flex-col bg-navy-900">
        <div className="flex items-start justify-between gap-4 border-b-4 border-navy-950 bg-crimson-700 px-5 py-4">
          <div>
            <h2 id="level-modal-title" className="font-pixel text-base uppercase leading-relaxed text-cream sm:text-lg">
              Select a level
            </h2>
            <p className="mt-1 text-sm text-ember-100">Choose a level to begin your case adventure.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="pixel-btn h-9 w-9 shrink-0 bg-cream p-0 text-crimson-700 hover:bg-white"
            aria-label="Close level select"
          >
            <Icon name="close" className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        <div className="pixel-scroll relative overflow-y-auto p-5 sm:p-6">
          <div className="pixel-dots absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <div className="pixel-box-flat px-cream flex items-center gap-4 bg-navy-950 p-4">
              <span className="pixel-box-flat px-gold shrink-0">
                <Avatar look={activeCase.avatar} className="block h-14 w-14" round={false} alt={activeCase.owner} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-pixel text-[11px] uppercase leading-relaxed text-gold">
                  Case #{activeCase.id} &middot; {activeCase.shortType}
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold leading-tight text-cream">{activeCase.name}</p>
                <p className="text-sm text-navy-200">
                  Owner: {activeCase.owner} &middot; {activeCase.category}
                </p>
              </div>
              <span className="hidden gap-1 sm:flex" aria-label={`Difficulty ${activeCase.difficulty} of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <PixelSprite key={n} name="star" scale={2} className={n <= activeCase.difficulty ? '' : 'opacity-25 grayscale'} />
                ))}
              </span>
            </div>
            <p className="mt-5 leading-relaxed text-navy-100">{activeCase.description}</p>

            <div className="mt-6 grid gap-6 p-1 sm:grid-cols-2 sm:gap-5">
              {activeCase.levels.map((level) => (
                <LevelTile key={level.id} level={level} state={stateOf(level)} result={p.levels[level.id]} onSelect={select} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
