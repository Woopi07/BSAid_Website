import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Icon from './Icons.jsx';

const items = [
  { panel: 'dashboard', label: 'Dashboard', icon: 'home' },
  { panel: 'cases', label: 'Case Files', icon: 'briefcase' },
  { panel: 'analytics', label: 'Analytics', icon: 'chart' },
  { panel: 'settings', label: 'Settings', icon: 'gear' },
];

export default function Sidebar() {
  const { state, dispatch } = useGame();
  const { play } = useAudio();

  return (
    <nav aria-label="Primary" className="flex w-16 shrink-0 flex-col items-center gap-3 bg-ep-navy py-5 sm:w-20">
      {items.map((item) => {
        const active = state.panel === item.panel;
        return (
          <button
            key={item.panel}
            type="button"
            onClick={() => {
              play('click');
              dispatch({ type: 'SET_PANEL', panel: item.panel });
            }}
            aria-current={active ? 'page' : undefined}
            title={item.label}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition sm:h-14 sm:w-14 ${
              active ? 'bg-ep-amber text-ep-navy shadow-lg shadow-black/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon name={item.icon} className="h-6 w-6" />
            <span className="sr-only">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
