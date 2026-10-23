import { useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Storefront from './Storefront.jsx';
import PixelSprite from '../../components/ui/PixelSprite.jsx';
import StatusBadge from './StatusBadge.jsx';
import Icon from './Icons.jsx';

const SEGMENTS = 10;

export default function CaseCard({ item }) {
  const { dispatch, progressOf } = useGame();
  const { play } = useAudio();
  const [shake, setShake] = useState(false);
  const p = progressOf(item);
  const locked = p.status === 'locked';
  const filled = Math.round((p.percent / 100) * SEGMENTS);

  const open = () => {
    if (locked) {
      play('locked');
      setShake(true);
      return;
    }
    play('pop');
    dispatch({ type: 'OPEN_CASE', caseId: item.id });
  };

  return (
    <button
      type="button"
      onClick={open}
      onAnimationEnd={() => setShake(false)}
      aria-disabled={locked}
      className={`pixel-box relative flex h-full w-full flex-col bg-white text-left transition-transform ${
        locked ? 'cursor-not-allowed bg-slate-100' : 'hover:-translate-y-1'
      } ${shake ? 'animate-shake' : ''}`}
    >
      <span
        className={`absolute -top-4 left-3 z-10 px-2.5 py-2 font-pixel text-[12px] ${
          locked ? 'bg-navy-600 text-navy-200' : 'bg-navy-950 text-cream'
        }`}
      >
        CASE #{item.id}
      </span>
      <div className="relative aspect-[16/7] w-full overflow-hidden border-b-4 border-navy-900">
        {item.image ? (
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <Storefront art={item.art} className={`h-full w-full ${locked ? 'grayscale' : ''}`} />
        )}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-950/40">
            <span className="pixel-box-flat px-dark flex h-12 w-12 items-center justify-center bg-cream text-navy-900">
              <Icon name={item.art ? 'lock' : 'truck'} className="h-6 w-6" strokeWidth={2.25} />
            </span>
          </div>
        )}
        <StatusBadge status={p.status} className="absolute bottom-3 right-3" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className={`text-2xl font-semibold leading-tight ${locked ? 'text-slate-500' : 'text-navy-900'}`}>{item.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{item.category}</p>
        {item.game && (
          <p className="mt-3 flex items-center gap-2 self-start bg-navy-950 px-2.5 py-1.5 font-pixel text-[11px] uppercase text-gold">
            <PixelSprite name={item.game.sprite} scale={1} className="h-4 w-4" /> {item.game.name}
          </p>
        )}
        <span className="mt-2 flex gap-0.5" aria-label={`Difficulty ${item.difficulty} of 6`}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <PixelSprite key={n} name="star" scale={1} className={`h-3.5 w-3.5 ${n <= item.difficulty ? '' : 'opacity-25 grayscale'}`} />
          ))}
        </span>
        <div className="mt-auto flex items-center gap-3 pt-4">
          <span
            className="flex flex-1 gap-1"
            role="progressbar"
            aria-valuenow={p.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${item.name} progress`}
          >
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span key={i} className={`h-3 flex-1 ${i < filled ? 'bg-emerald-500' : locked ? 'bg-slate-300' : 'bg-wood-100'}`} />
            ))}
          </span>
          <span className="w-12 text-right font-pixel text-[13px] text-navy-900">{p.percent}%</span>
        </div>
      </div>
    </button>
  );
}
