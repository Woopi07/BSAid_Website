import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { BADGES, useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Scene from './Scene.jsx';
import Avatar from './Avatar.jsx';
import { ROUNDS } from './games/rounds.jsx';
import { Steps } from './games/parts.jsx';

const MESSAGES = {
  S: 'Flawless! Every entry was spot on.',
  A: 'Excellent work — just a slip or two.',
  B: 'Good job! Review the solutions below to level up.',
  C: 'You made it through! Practice makes perfect.',
  D: "Every accountant starts somewhere — check the solutions and try again!",
};

function roundLabel(round) {
  return round.prompt ?? round.text ?? (round.account ? `Account: ${round.account}` : 'Trial balance');
}

export default function LevelResults() {
  const { state, activeCase, activeLevel, dispatch } = useGame();
  const { play } = useAudio();
  const result = state.lastResult;
  const next = activeCase.levels.find((l) => l.id === activeLevel.id + 1);
  const review = result.review ?? [];

  const go = (action) => () => {
    play('pop');
    dispatch(action);
  };

  return (
    <div className="flex h-full flex-col">
      <LevelHeader />
      <Scene>
        <main className="pixel-scroll flex min-h-0 flex-1 justify-center overflow-y-auto p-4">
          <div className="my-4 flex w-full max-w-2xl flex-col gap-8">
            <div className="pixel-box px-dark animate-pop bg-navy-900 text-center">
              <div className="border-b-4 border-navy-950 bg-crimson-700 px-4 py-3">
                <p className="font-pixel text-[13px] uppercase tracking-widest text-cream sm:text-sm">Stage clear!</p>
              </div>
              <div className="relative p-6 sm:p-8">
                <div className="pixel-dots absolute inset-0" aria-hidden="true" />
                <div className="relative">
                  <p className="font-pixel text-[12px] uppercase tracking-widest text-ember-200">
                    {activeCase.game.name} · Level {activeLevel.id}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-cream pixel-text-shadow">{activeLevel.title}</h2>

                  <div className="mt-6 flex justify-center gap-3" aria-label={`${result.stars} of 3 stars`}>
                    {[1, 2, 3].map((n) => (
                      <PixelSprite key={n} name="star" scale={6} className={n <= result.stars ? 'animate-twinkle' : 'opacity-25 grayscale'} />
                    ))}
                  </div>

                  <p className="mt-5 font-pixel text-[12px] uppercase tracking-widest text-ember-200">Rank</p>
                  <p className="pixel-title mt-2 font-heading text-8xl font-bold leading-none" data-text={result.rank}>
                    {result.rank}
                  </p>
                  <p className="mt-6 text-navy-100">{MESSAGES[result.rank]}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ['Correct', `${result.total - result.mistakes}/${result.total}`],
                      ['Score', result.points.toLocaleString()],
                      ['Best combo', `×${result.maxCombo}`],
                      ['Coins', `+${result.coins}`],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-navy-950 p-3">
                        <dt className="font-pixel text-[11px] uppercase text-navy-200">{k}</dt>
                        <dd className="mt-2 font-pixel text-base text-gold">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {result.earned?.length > 0 && (
                    <div className="mt-7">
                      <p className="font-pixel text-[12px] uppercase tracking-widest text-gold">New badge{result.earned.length > 1 ? 's' : ''}!</p>
                      <ul className="mt-3 flex flex-wrap justify-center gap-3">
                        {result.earned.map((id) => (
                          <li key={id} className="pixel-box-flat px-gold flex animate-pop items-center gap-2 bg-gold-50 px-3 py-2 text-left">
                            <PixelSprite name={BADGES[id]?.sprite ?? 'star'} scale={2} />
                            <span>
                              <span className="block font-heading text-sm font-bold text-navy-900">{BADGES[id]?.name ?? id}</span>
                              <span className="block text-xs text-slate-600">{BADGES[id]?.desc}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.unlockedNext && next && (
                    <div className="pixel-box-flat mt-7 flex items-center gap-3 bg-emerald-50 p-4 text-left [--px:#059669]">
                      <PixelSprite name="coin" scale={3} className="shrink-0 animate-bob" />
                      <p className="text-navy-900">
                        <span className="block font-pixel text-[12px] uppercase text-emerald-700">Unlocked — harder level!</span>
                        <span className="mt-1 block font-heading text-xl font-semibold">
                          Level {next.id}: {next.title}
                        </span>
                        <span className="block text-sm text-slate-600">
                          {next.hearts} hearts · {next.time}s per round · {next.summary}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="pixel-box-flat px-cream mt-7 flex items-center gap-3 bg-navy-950 p-3 text-left">
                    <span className="pixel-box-flat px-gold shrink-0">
                      <Avatar look={activeCase.avatar} round={false} className="block h-10 w-10" />
                    </span>
                    <p className="text-sm text-cream">&ldquo;Thank you! The books for {activeCase.name} are looking so much better already.&rdquo;</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-5 sm:flex-row">
                    <button type="button" onClick={go({ type: 'BACK_TO_LEVELS' })} className="pixel-btn flex-1 bg-cream text-navy-950 hover:bg-white">
                      Level select
                    </button>
                    <button type="button" onClick={go({ type: 'START_LEVEL', levelId: activeLevel.id })} className="pixel-btn flex-1 bg-navy-600 text-cream hover:bg-navy-400">
                      Replay
                    </button>
                    {next ? (
                      <button type="button" autoFocus onClick={go({ type: 'START_LEVEL', levelId: next.id })} className="pixel-btn flex-1 bg-gold text-navy-950 hover:bg-gold-300">
                        Next level <PixelSprite name="arrow" scale={2} />
                      </button>
                    ) : (
                      <button type="button" autoFocus onClick={go({ type: 'EXIT_TO_DASHBOARD' })} className="pixel-btn flex-1 bg-gold text-navy-950 hover:bg-gold-300">
                        Next case
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {review.length > 0 && (
              <section className="pixel-box px-dark bg-cream p-5 sm:p-6" aria-labelledby="review-title">
                <h3 id="review-title" className="text-2xl font-bold">Review your mistakes</h3>
                <p className="mt-1 text-sm text-slate-600">Here&rsquo;s the solution for every round you missed.</p>
                <ol className="mt-5 flex flex-col gap-5">
                  {review.map(({ round, yours }, i) => {
                    const { Solution } = ROUNDS[round.type];
                    return (
                      <li key={i} className="pixel-box-flat px-navy bg-white p-4">
                        <p className="font-semibold text-navy-900">{roundLabel(round)}</p>
                        <p className="mt-2 text-sm text-rose-700">
                          <span className="font-pixel text-[11px] uppercase">Your answer: </span>
                          {yours}
                        </p>
                        <div className="mt-3 bg-emerald-50 p-3">
                          <p className="mb-2 font-pixel text-[11px] uppercase text-emerald-700">Solution</p>
                          <Solution round={round} />
                          <Steps steps={round.steps} />
                        </div>
                        <p className="mt-3 text-sm text-slate-700">{round.explanation}</p>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}
          </div>
        </main>
      </Scene>
    </div>
  );
}
