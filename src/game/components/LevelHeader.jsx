import { useEffect, useRef, useState } from 'react';
import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import AudioControl from './AudioControl.jsx';
import Icon from './Icons.jsx';

export default function LevelHeader({ onRestart }) {
  const { activeLevel, dispatch } = useGame();
  const { play } = useAudio();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !menuRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const act = (fn) => () => {
    play('click');
    setOpen(false);
    fn();
  };

  const items = [
    { label: 'Replay story intro', icon: 'book', run: () => dispatch({ type: 'REPLAY_INTRO' }) },
    onRestart && { label: 'Restart level', icon: 'refresh', run: onRestart },
    { label: 'Level select', icon: 'briefcase', run: () => dispatch({ type: 'BACK_TO_LEVELS' }) },
    { label: 'Exit to case files', icon: 'exit', run: () => dispatch({ type: 'EXIT_TO_DASHBOARD' }) },
  ].filter(Boolean);

  return (
    <header className="relative z-20 grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b-4 border-navy-950 bg-navy-900 px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 bg-crimson-700 px-2 py-1.5 font-pixel text-[12px] text-cream">LV {activeLevel.id}</span>
        <h1 className="truncate text-xl font-bold text-cream pixel-text-shadow sm:text-2xl">{activeLevel.title}</h1>
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => {
            play('click');
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Level menu"
          className="pixel-btn h-9 w-9 bg-navy-600 p-0 text-cream hover:bg-navy-400"
        >
          <Icon name="menu" className="h-5 w-5" strokeWidth={2.5} />
        </button>
        {open && (
          <div className="absolute left-1/2 top-14 w-64 -translate-x-1/2">
            <ul role="menu" className="pixel-box px-dark animate-pop bg-navy-900 py-2">
              {items.map((item) => (
                <li key={item.label} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={act(item.run)}
                    className="group flex w-full items-center gap-3 px-4 py-3 text-left font-pixel text-[12px] uppercase text-navy-100 hover:bg-crimson-700 hover:text-cream focus-visible:bg-crimson-700"
                  >
                    <PixelSprite name="arrow" scale={2} className="invisible group-hover:visible group-focus-visible:visible" />
                    <Icon name={item.icon} className="h-4 w-4 text-gold" strokeWidth={2.5} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 sm:gap-4">
        <AudioControl />
        <button
          type="button"
          onClick={act(() => dispatch({ type: 'EXIT_TO_DASHBOARD' }))}
          className="pixel-btn h-9 w-9 shrink-0 bg-cream p-0 text-navy-950 hover:bg-white"
          aria-label="Exit level"
        >
          <Icon name="close" className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>
    </header>
  );
}
