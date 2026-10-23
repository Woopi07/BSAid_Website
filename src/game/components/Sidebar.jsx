import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Icon from './Icons.jsx';

const items = [
  { panel: 'dashboard', label: 'Dashboard', icon: 'home' },
  { panel: 'cases', label: 'Case Files', icon: 'briefcase' },
  { panel: 'achievements', label: 'Achievements', icon: 'trophy' },
  { panel: 'analytics', label: 'Analytics', icon: 'chart' },
  { panel: 'settings', label: 'Settings', icon: 'gear' },
];

export default function Sidebar() {
  const { state, dispatch, rewards } = useGame();
  const { play } = useAudio();

  return (
    <nav aria-label="Primary" className="pixel-dots flex w-16 shrink-0 flex-col items-center gap-5 border-r-4 border-navy-950 bg-navy-900 py-6 sm:w-20">
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
            className={`pixel-btn relative h-11 w-11 p-0 sm:h-12 sm:w-12 ${
              active ? 'bg-gold text-navy-950' : 'bg-navy-800 text-navy-200 hover:bg-navy-600 hover:text-cream'
            }`}
          >
            <Icon name={item.icon} className="h-6 w-6" strokeWidth={2.25} />
            <span className="sr-only">{item.label}</span>
            {item.panel === 'achievements' && rewards.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-forest-700 px-1 font-pixel text-[11px] text-cream">
                {rewards.length}
                <span className="sr-only"> rewards to claim</span>
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
