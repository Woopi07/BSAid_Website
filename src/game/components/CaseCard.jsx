import { useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Storefront from './Storefront.jsx';
import StatusBadge from './StatusBadge.jsx';
import Icon from './Icons.jsx';

export default function CaseCard({ item }) {
  const { dispatch, progressOf } = useGame();
  const { play } = useAudio();
  const [shake, setShake] = useState(false);
  const p = progressOf(item);
  const locked = p.status === 'locked';

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
      className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-ep-paper text-left shadow-md ring-1 ring-ep-line transition ${
        locked ? 'cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl'
      } ${shake ? 'animate-shake' : ''}`}
    >
      <div className="relative aspect-[16/7] w-full overflow-hidden">
        {item.image ? (
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <Storefront art={item.art} className={`h-full w-full ${locked ? 'grayscale' : ''}`} />
        )}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/35">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-slate-700">
              <Icon name={item.art ? 'lock' : 'truck'} className="h-6 w-6" />
            </span>
          </div>
        )}
        <StatusBadge status={p.status} className="absolute bottom-3 right-3" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className={`font-rounded text-lg font-extrabold leading-snug ${locked ? 'text-slate-500' : 'text-ep-ink'}`}>
          {item.name}
        </h3>
        <p className="mt-1 font-rounded text-sm font-semibold text-slate-500">
          CASE #{item.id}
          {!locked && <> &middot; {item.category}</>}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4">
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-ep-line" role="progressbar" aria-valuenow={p.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.name} progress`}>
            <span className="block h-full rounded-full bg-ep-green transition-all" style={{ width: `${p.percent}%` }} />
          </span>
          <span className="w-9 text-right font-rounded text-sm font-extrabold text-ep-ink">{p.percent}%</span>
        </div>
      </div>
    </button>
  );
}
