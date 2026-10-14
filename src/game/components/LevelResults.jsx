import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Scene from './Scene.jsx';
import Avatar from './Avatar.jsx';

const MESSAGES = {
  S: 'Flawless! Every entry was spot on.',
  A: 'Excellent work — just a slip or two.',
  B: 'Good job! Review the explanations to level up.',
  C: 'You got through it! Practice makes perfect.',
  D: "Don't worry — every accountant starts somewhere. Try again!",
};
const STARS = { S: 3, A: 3, B: 2, C: 1, D: 1 };

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
      <Scene>
        <main className="pixel-scroll flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="pixel-box px-dark my-4 w-full max-w-lg animate-pop bg-navy-900 text-center">
            <div className="border-b-4 border-navy-950 bg-crimson-700 px-4 py-3">
              <p className="font-pixel text-[10px] uppercase tracking-widest text-cream sm:text-xs">Stage clear!</p>
            </div>
            <div className="relative p-6 sm:p-8">
              <div className="pixel-dots absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <h2 className="text-3xl font-bold text-cream pixel-text-shadow">{activeLevel.title}</h2>

                <div className="mt-6 flex justify-center gap-3" aria-label={`${STARS[result.rank]} of 3 stars`}>
                  {[0, 1, 2].map((i) => (
                    <PixelSprite key={i} name="star" scale={5} className={i < STARS[result.rank] ? 'animate-twinkle' : 'opacity-25 grayscale'} />
                  ))}
                </div>

                <p className="mt-6 font-pixel text-[9px] uppercase tracking-widest text-ember-200">Rank</p>
                <p className="pixel-title mt-2 font-heading text-8xl font-bold leading-none" data-text={result.rank}>
                  {result.rank}
                </p>
                <p className="mt-6 text-navy-100">{MESSAGES[result.rank]}</p>

                <dl className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ['Correct', `${total - result.mistakes}/${total}`],
                    ['Mistakes', result.mistakes],
                    ['Points', `+${result.points}`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-navy-950 p-3">
                      <dt className="font-pixel text-[8px] uppercase text-navy-200">{k}</dt>
                      <dd className="mt-2 font-pixel text-sm text-gold">{v}</dd>
                    </div>
                  ))}
                </dl>

                {result.unlockedNext && next && (
                  <div className="pixel-box-flat mt-7 flex items-center gap-3 bg-emerald-50 p-4 text-left [--px:#059669]">
                    <PixelSprite name="coin" scale={3} className="shrink-0 animate-bob" />
                    <p className="text-navy-900">
                      <span className="block font-pixel text-[9px] uppercase text-emerald-700">Unlocked!</span>
                      <span className="mt-1 block font-heading text-xl font-semibold">
                        Level {next.id}: {next.title}
                      </span>
                    </p>
                  </div>
                )}

                <div className="pixel-box-flat px-cream mt-7 flex items-center gap-3 bg-navy-950 p-3 text-left">
                  <span className="pixel-box-flat px-gold shrink-0">
                    <Avatar look={activeCase.avatar} round={false} className="block h-10 w-10" />
                  </span>
                  <p className="text-sm text-cream">
                    &ldquo;Thank you! The books for {activeCase.name} are looking so much better already.&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-5 sm:flex-row">
                  <button type="button" onClick={go({ type: 'BACK_TO_LEVELS' })} className="pixel-btn flex-1 bg-cream text-navy-950 hover:bg-white">
                    Level select
                  </button>
                  {next && next.questions.length > 0 ? (
                    <button type="button" onClick={go({ type: 'START_LEVEL', levelId: next.id })} className="pixel-btn flex-1 bg-gold text-navy-950 hover:bg-gold-300">
                      Next level <PixelSprite name="arrow" scale={2} />
                    </button>
                  ) : (
                    <button type="button" onClick={go({ type: 'EXIT_TO_DASHBOARD' })} className="pixel-btn flex-1 bg-gold text-navy-950 hover:bg-gold-300">
                      Case files
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </Scene>
    </div>
  );
}
