import { cases } from '../data/cases.js';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import PanelHeader from './PanelHeader.jsx';
import Storefront from './Storefront.jsx';
import Icon from './Icons.jsx';

export default function DashboardPanel() {
  const { dispatch, progressOf, counts } = useGame();
  const { play } = useAudio();
  const available = cases.filter((c) => !c.locked);
  const next = available.find((c) => progressOf(c).status === 'in-progress') ?? available.find((c) => progressOf(c).status === 'unopened');
  const points = available.reduce(
    (sum, c) => sum + Object.values(progressOf(c).levels).reduce((s, l) => s + l.points, 0),
    0
  );

  const stats = [
    { label: 'Levels cleared', value: available.reduce((s, c) => s + progressOf(c).completed, 0) },
    { label: 'Points earned', value: points },
    { label: 'Cases finished', value: counts.finished },
  ];

  return (
    <div className="no-scrollbar flex h-full flex-col gap-5 overflow-y-auto pb-4">
      <PanelHeader icon="home" title="Welcome back!" subtitle="Your accounting adventure continues here." />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {next && (
          <div className="overflow-hidden rounded-2xl bg-ep-paper shadow-md ring-1 ring-ep-line">
            <Storefront art={next.art} className="aspect-[16/6] w-full" />
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-rounded text-xs font-extrabold uppercase tracking-wider text-ep-green">
                  {progressOf(next).status === 'in-progress' ? 'Continue case' : 'Up next'}
                </p>
                <h2 className="mt-1 font-rounded text-xl font-black text-ep-ink">{next.name}</h2>
                <p className="font-rounded text-sm font-semibold text-slate-500">CASE #{next.id} &middot; {next.category}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  play('pop');
                  dispatch({ type: 'OPEN_CASE', caseId: next.id });
                }}
                className="flex items-center justify-center gap-2 rounded-full bg-ep-green px-6 py-3 font-rounded font-extrabold text-white shadow hover:bg-green-800"
              >
                <Icon name="play" className="h-4 w-4" /> Open case
              </button>
            </div>
          </div>
        )}
        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((s) => (
            <li key={s.label} className="flex items-center justify-between rounded-2xl bg-ep-cream p-5 ring-1 ring-ep-line">
              <span className="font-rounded font-bold text-slate-600">{s.label}</span>
              <span className="font-display text-3xl text-ep-navy">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
