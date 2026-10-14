import { useGame } from '../context/GameProvider.jsx';
import AudioControl from './AudioControl.jsx';
import Icon from './Icons.jsx';
import Logo from './Logo.jsx';

const pills = [
  { key: 'finished', label: 'Finished', icon: 'check', chip: 'bg-emerald-500 text-navy-950' },
  { key: 'inProgress', label: 'In Progress', icon: 'target', chip: 'bg-navy-400 text-cream' },
  { key: 'pending', label: 'Pending', icon: 'hourglass', chip: 'bg-gold text-navy-950' },
  { key: 'locked', label: 'Locked', icon: 'lock', chip: 'bg-navy-600 text-navy-200' },
];

export default function Header() {
  const { counts } = useGame();

  return (
    <header className="relative flex h-16 shrink-0 items-center gap-3 border-b-4 border-navy-950 bg-navy-900 px-3 sm:gap-6 sm:px-5">
      <Logo className="shrink-0" />
      <ul className="pixel-scroll flex min-w-0 flex-1 items-center gap-4 overflow-x-auto px-1 py-2" aria-label="Case status summary">
        {pills.map((p) => (
          <li key={p.key} className="pixel-box-flat px-dark flex shrink-0 items-center gap-2 bg-navy-950 py-1 pl-1 pr-3">
            <span className={`flex h-6 w-6 items-center justify-center ${p.chip}`}>
              <Icon name={p.icon} className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-pixel text-[11px] text-cream">{counts[p.key]}</span>
            <span className="hidden font-pixel text-[9px] uppercase text-navy-200 md:inline">{p.label}</span>
            <span className="sr-only md:hidden">{p.label}</span>
          </li>
        ))}
      </ul>
      <AudioControl />
    </header>
  );
}
