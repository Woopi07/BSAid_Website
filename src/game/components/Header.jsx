import { useGame } from '../context/GameProvider.jsx';
import AudioControl from './AudioControl.jsx';
import Icon from './Icons.jsx';
import Logo from './Logo.jsx';

const pills = [
  { key: 'finished', label: 'Finished', icon: 'check', dot: 'bg-ep-green text-white', ring: 'bg-white text-ep-ink' },
  { key: 'inProgress', label: 'In Progress', icon: 'target', dot: 'bg-blue-600 text-white', ring: 'bg-white text-ep-ink' },
  { key: 'pending', label: 'Pending', icon: 'hourglass', dot: 'bg-ep-amber text-white', ring: 'bg-white text-ep-ink' },
  { key: 'locked', label: 'Locked', icon: 'lock', dot: 'bg-slate-500 text-white', ring: 'bg-white/25 text-white' },
];

export default function Header() {
  const { counts } = useGame();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 bg-gradient-to-r from-ep-navy to-ep-royal px-3 sm:gap-5 sm:px-5">
      <div className="flex w-14 shrink-0 justify-center sm:w-auto">
        <Logo />
      </div>
      <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2" aria-label="Case status summary">
        {pills.map((p) => (
          <li
            key={p.key}
            className={`flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-3.5 font-rounded text-sm font-extrabold shadow-sm ${p.ring}`}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${p.dot}`}>
              <Icon name={p.icon} className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span>{counts[p.key]}</span>
            <span className="hidden md:inline">{p.label}</span>
            <span className="sr-only md:hidden">{p.label}</span>
          </li>
        ))}
      </ul>
      <AudioControl />
    </header>
  );
}
