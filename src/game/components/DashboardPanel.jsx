import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { cases } from '../data/cases.js';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import PanelHeader from './PanelHeader.jsx';
import Storefront from './Storefront.jsx';

export default function DashboardPanel() {
  const { dispatch, progressOf, counts } = useGame();
  const { play } = useAudio();
  const available = cases.filter((c) => !c.locked);
  const next =
    available.find((c) => progressOf(c).status === 'in-progress') ?? available.find((c) => progressOf(c).status === 'unopened');
  const points = available.reduce(
    (sum, c) => sum + Object.values(progressOf(c).levels).reduce((s, l) => s + l.points, 0),
    0
  );

  const stats = [
    { label: 'Levels cleared', value: available.reduce((s, c) => s + progressOf(c).completed, 0), sprite: 'star' },
    { label: 'Points earned', value: points, sprite: 'coin' },
    { label: 'Cases finished', value: counts.finished, sprite: 'heart' },
  ];

  return (
    <div className="pixel-scroll flex h-full flex-col gap-8 overflow-y-auto p-1 pb-6">
      <PanelHeader icon="home" title="Welcome back!" subtitle="Your accounting adventure continues here." />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {next && (
          <div className="pixel-box bg-white">
            <div className="border-b-4 border-navy-900">
              <Storefront art={next.art} className="block aspect-[16/6] w-full" />
            </div>
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-pixel text-[9px] uppercase text-ember-600">
                  {progressOf(next).status === 'in-progress' ? 'Continue case' : 'Up next'}
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight">{next.name}</h2>
                <p className="text-sm text-slate-600">
                  CASE #{next.id} &middot; {next.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  play('pop');
                  dispatch({ type: 'OPEN_CASE', caseId: next.id });
                }}
                className="pixel-btn shrink-0 bg-gold text-navy-950 hover:bg-gold-300"
              >
                Open case <PixelSprite name="arrow" scale={2} />
              </button>
            </div>
          </div>
        )}
        <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((s) => (
            <li key={s.label} className="pixel-box px-dark flex items-center justify-between gap-3 bg-navy-900 p-5">
              <span className="flex items-center gap-3">
                <PixelSprite name={s.sprite} scale={3} />
                <span className="font-pixel text-[9px] uppercase leading-relaxed text-navy-100">{s.label}</span>
              </span>
              <span className="font-pixel text-xl text-gold">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
