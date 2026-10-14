import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';

const MESSAGES = {
  S: 'Flawless! Every entry was spot on.',
  A: 'Excellent work — just a slip or two.',
  B: 'Good job! Review the explanations to level up.',
  C: 'You got through it! Practice makes perfect.',
  D: "Don't worry — every accountant starts somewhere. Try again!",
};

export default function LevelResults() {
  const { state, activeCase, activeLevel, dispatch } = useGame();
  const { play } = useAudio();
  const result = state.lastResult;
  const next = activeCase.levels.find((l) => l.id === activeLevel.id + 1);
  const total = activeLevel.questions.length;

  const go = (action) => () => {
    play('pop');
    dispatch(action);
  };

  return (
    <div className="flex h-full flex-col">
      <LevelHeader />
      <main className="no-scrollbar flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
        <div className="w-full max-w-lg animate-rise rounded-3xl bg-ep-cream p-6 text-center shadow-2xl ring-1 ring-ep-line sm:p-8">
          <p className="font-rounded text-xs font-black uppercase tracking-widest text-ep-green">Level {activeLevel.id} complete</p>
          <h2 className="mt-1 font-rounded text-2xl font-black text-ep-ink">{activeLevel.title}</h2>

          <div className="relative mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-ep-amber shadow-[0_6px_0_#B45309]">
            <span className="font-display text-7xl text-white" style={{ textShadow: '0 3px 0 #92400E' }}>
              {result.rank}
            </span>
            <span className="absolute -right-2 -top-1 text-ep-amber">
              <Icon name="star" filled className="h-8 w-8 animate-float" />
            </span>
          </div>
          <p className="mt-5 font-rounded font-bold text-slate-600">{MESSAGES[result.rank]}</p>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              ['Correct', `${total - result.mistakes}/${total}`],
              ['Mistakes', result.mistakes],
              ['Points', `+${result.points}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white p-3 ring-1 ring-ep-line">
                <dt className="font-rounded text-xs font-extrabold uppercase text-slate-500">{k}</dt>
                <dd className="mt-1 font-display text-2xl text-ep-navy">{v}</dd>
              </div>
            ))}
          </dl>

          {result.unlockedNext && next && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-left ring-2 ring-ep-green/50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ep-green text-white">
                <Icon name="lock" className="h-5 w-5" />
              </span>
              <p className="font-rounded font-bold text-ep-ink">
                <span className="block text-xs font-black uppercase tracking-wider text-ep-green">Unlocked!</span>
                Level {next.id}: {next.title}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/70 p-3 text-left ring-1 ring-ep-line">
            <Avatar look={activeCase.avatar} className="h-10 w-10 shrink-0" />
            <p className="font-rounded text-sm font-semibold text-ep-ink">
              &ldquo;Thank you! The books for {activeCase.name} are looking so much better already.&rdquo;
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={go({ type: 'BACK_TO_LEVELS' })} className="flex-1 rounded-full bg-white px-5 py-3 font-rounded font-black text-ep-ink ring-2 ring-ep-line hover:bg-ep-sand">
              Level select
            </button>
            {next && next.questions.length > 0 ? (
              <button type="button" onClick={go({ type: 'START_LEVEL', levelId: next.id })} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ep-green px-5 py-3 font-rounded font-black text-white shadow-lg hover:bg-green-800">
                Next level <Icon name="play" className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={go({ type: 'EXIT_TO_DASHBOARD' })} className="flex-1 rounded-full bg-ep-green px-5 py-3 font-rounded font-black text-white shadow-lg hover:bg-green-800">
                Back to case files
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
