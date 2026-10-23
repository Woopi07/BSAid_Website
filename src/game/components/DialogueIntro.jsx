import { useEffect, useRef, useState } from 'react';
import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Scene from './Scene.jsx';
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
      <Scene>
        <main className="pixel-scroll flex min-h-0 flex-1 flex-col overflow-y-auto" onClick={(e) => !e.target.closest('button') && advance()}>
          <div className="mx-auto grid w-full max-w-4xl flex-1 items-start gap-8 px-4 py-8 sm:py-12 md:grid-cols-[220px_1fr] md:gap-12">
            <div className="flex flex-col items-center md:sticky md:top-0">
              <p className="mb-4 font-pixel text-[12px] uppercase tracking-widest text-wood-200">Case #{activeCase.id}</p>
              <div className="animate-bob">
                <div className="pixel-box px-gold bg-gradient-to-b from-gold-300 to-wood-600 p-2">
                  <Avatar look={activeCase.avatar} round={false} className="block h-36 w-36 sm:h-48 sm:w-48" alt={activeCase.owner} />
                </div>
              </div>
              <span className="mt-6 bg-gold px-3 py-2 font-pixel text-[13px] uppercase text-navy-950">{activeCase.owner}</span>
            </div>

            <ol className="flex flex-col gap-6" aria-live="polite">
              {lines.slice(0, shown).map((line, i) => (
                <li key={i} className="pixel-box-flat px-cream relative animate-pop bg-navy-950/95 p-5 sm:p-6">
                  <p className="font-pixel text-[12px] uppercase tracking-widest text-gold">{activeCase.owner}</p>
                  <p className="mt-3 text-base leading-relaxed text-cream sm:text-[17px]">{line}</p>
                  {i === shown - 1 && !done && (
                    <span className="absolute bottom-3 right-4 animate-bob" aria-hidden="true">
                      <PixelSprite name="arrow" scale={2} className="rotate-90" />
                    </span>
                  )}
                </li>
              ))}
              <li ref={endRef} className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    dispatch({ type: 'BEGIN_QUIZ' });
                  }}
                  className="flex items-center gap-2 px-2 py-2 font-pixel text-[12px] uppercase text-navy-200 hover:text-cream"
                >
                  <Icon name="skip" className="h-4 w-4" strokeWidth={2.5} /> Skip intro
                </button>
                <button
                  type="button"
                  onClick={advance}
                  className={`pixel-btn ${done ? 'bg-gold text-navy-950 hover:bg-gold-300' : 'bg-cream text-navy-950 hover:bg-white'}`}
                >
                  {done ? 'Start level' : 'Next'} <PixelSprite name="arrow" scale={2} />
                </button>
              </li>
            </ol>
          </div>
          <p className="pb-4 text-center font-pixel text-[11px] uppercase tracking-widest text-navy-200/80">
            <span className="animate-blink text-gold">&#9654;</span> Click or press space &middot; {Math.min(shown, lines.length)}/{lines.length}
          </p>
        </main>
      </Scene>
    </div>
  );
}
