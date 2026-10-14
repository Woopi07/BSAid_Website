import { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';

export default function DialogueIntro() {
  const { activeCase, activeLevel, dispatch } = useGame();
  const { play } = useAudio();
  const lines = activeLevel.intro;
  const [shown, setShown] = useState(1);
  const endRef = useRef(null);
  const done = shown >= lines.length;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [shown]);

  const advance = () => {
    if (done) {
      play('pop');
      dispatch({ type: 'BEGIN_QUIZ' });
    } else {
      play('page');
      setShown((n) => n + 1);
    }
  };

  // Space / Enter / → advance the dialogue, like a visual novel.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('button, input, [role="menu"]')) return;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="flex h-full flex-col">
      <LevelHeader />
      <main className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto" onClick={(e) => !e.target.closest('button') && advance()}>
        <div className="mx-auto grid w-full max-w-4xl flex-1 items-start gap-6 px-4 py-8 sm:py-12 md:grid-cols-[220px_1fr] md:gap-10">
          <div className="flex flex-col items-center md:sticky md:top-0">
            <div className="animate-float rounded-full bg-white p-1.5 shadow-2xl">
              <Avatar look={activeCase.avatar} className="h-36 w-36 sm:h-52 sm:w-52" alt={activeCase.owner} />
            </div>
            <span className="mt-3 rounded-full bg-ep-green px-4 py-1 font-rounded text-sm font-black uppercase tracking-wider text-white">
              {activeCase.owner}
            </span>
          </div>

          <ol className="flex flex-col gap-4" aria-live="polite">
            {lines.slice(0, shown).map((line, i) => (
              <li key={i} className="animate-rise rounded-2xl bg-ep-cream p-5 shadow-lg ring-1 ring-ep-line sm:p-6">
                <p className="font-rounded text-xs font-black uppercase tracking-widest text-ep-green">{activeCase.owner}</p>
                <p className="mt-2 font-rounded text-base font-semibold leading-relaxed text-ep-ink sm:text-[17px]">{line}</p>
              </li>
            ))}
            <li ref={endRef} className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  play('click');
                  dispatch({ type: 'BEGIN_QUIZ' });
                }}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 font-rounded text-sm font-bold text-blue-100 hover:bg-white/10"
              >
                <Icon name="skip" className="h-4 w-4" /> Skip intro
              </button>
              <button
                type="button"
                onClick={advance}
                className={`flex items-center gap-2 rounded-full px-6 py-3 font-rounded font-black shadow-lg transition ${
                  done ? 'bg-ep-green text-white hover:bg-green-800' : 'bg-ep-cream text-ep-ink hover:bg-white'
                }`}
              >
                {done ? 'Start Level' : 'Next'}
                <Icon name={done ? 'play' : 'chevronRight'} className="h-4 w-4" strokeWidth={3} />
              </button>
            </li>
          </ol>
        </div>
        <p className="pb-4 text-center font-rounded text-xs font-bold text-blue-200/70">
          Click anywhere or press Space to continue &middot; {Math.min(shown, lines.length)}/{lines.length}
        </p>
      </main>
    </div>
  );
}
