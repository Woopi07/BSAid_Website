import { useMemo } from 'react';
import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { cases } from '../data/cases.js';
import { caseReport } from '../data/certificates.js';
import { BADGES, useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Scene from './Scene.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';
import { CertificateCanvas, CertificateControls } from './Certificate.jsx';

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 7) * 0.18,
  color: ['#EDA90D', '#2E8B4A', '#F7EEDF', '#4A6FA8', '#F7C95A'][i % 5],
  size: 6 + (i % 3) * 3,
}));

function Panel({ title, icon, tone = 'bg-white', children }) {
  return (
    <section className={`pixel-box flex flex-col p-4 sm:p-5 ${tone}`}>
      <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900 sm:text-xl">
        {icon}
        {title}
      </h3>
      <div className="mt-3 flex-1">{children}</div>
    </section>
  );
}

// Shown when every level of a case is cleared (and later from the certificate gallery):
// the owner thanks the player, the certificate (with an editable name) can be saved, and a report sums up the case.
export default function CaseClosed() {
  const { state, progressOf, playerName, certificates, dispatch } = useGame();
  const { play } = useAudio();
  const caseObj = cases.find((c) => c.id === state.caseId);
  const p = progressOf(caseObj);
  const report = useMemo(() => caseReport(caseObj, p.levels), [caseObj, p.levels]);
  const date = certificates[caseObj.id]?.date ?? new Date().toISOString();
  const badge = BADGES[`case-${caseObj.id}`];
  const fresh = state.certFrom !== 'gallery';

  const back = () => {
    play('click');
    dispatch({ type: 'CLOSE_CERTIFICATE' });
  };

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b-4 border-navy-950 bg-navy-900 px-3 sm:px-5">
        <button type="button" onClick={back} className="pixel-btn h-9 shrink-0 gap-1 bg-cream px-2.5 text-navy-950 hover:bg-white sm:px-3" aria-label="Back">
          <Icon name="chevronLeft" className="h-5 w-5" strokeWidth={3} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <span className="shrink-0 bg-forest px-2 py-1.5 font-pixel text-[12px] text-cream">CASE #{caseObj.id}</span>
        <h1 className="truncate text-xl font-bold text-cream pixel-text-shadow sm:text-2xl">Case closed</h1>
      </header>

      <Scene sprites={false}>
        {fresh && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="cert-confetti absolute top-0"
                style={{ left: `${c.left}%`, width: c.size, height: c.size * 1.6, background: c.color, animationDelay: `${c.delay}s` }}
              />
            ))}
          </div>
        )}

        <main className="pixel-scroll flex min-h-0 flex-1 justify-center overflow-y-auto p-4 sm:p-6">
          <div className="my-2 grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            {/* Certificate + name + owner */}
            <div className="flex flex-col gap-8">
              <div className="relative animate-pop">
                <div className="pixel-box-flat px-gold bg-[#F3E7CF] shadow-[8px_10px_0_rgba(0,0,0,0.35)]">
                  <CertificateCanvas caseObj={caseObj} name={playerName} date={date} rating={report.rating} />
                </div>
                <div className="cert-ribbon absolute -bottom-6 left-1/2 w-[min(78%,420px)] -translate-x-1/2">
                  <div className="relative bg-forest px-6 py-2.5 text-center shadow-[0_5px_0_#0D3B22]">
                    <span className="absolute -left-4 top-2 -z-10 h-full w-8 bg-forest-700 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,35%_50%)]" />
                    <span className="absolute -right-4 top-2 -z-10 h-full w-8 bg-forest-700 [clip-path:polygon(0_0,100%_0,65%_50%,100%_100%,0_100%)]" />
                    <span className="font-heading text-2xl font-extrabold uppercase tracking-wide text-gold-100 pixel-text-shadow sm:text-3xl">Case closed!</span>
                  </div>
                </div>
              </div>

              <div className="pixel-box px-dark mt-4 bg-navy-900 p-4 sm:p-5">
                <CertificateControls caseObj={caseObj} date={date} rating={report.rating} />
                <p className="mt-3 text-xs text-navy-200">
                  Type your name, then save the certificate to your gallery. It stays in your Achievements tab too.
                </p>
              </div>

              <div className="flex items-end gap-4">
                <span className="pixel-box-flat px-gold shrink-0 animate-bob bg-cream">
                  <Avatar look={caseObj.avatar} round={false} className="block h-20 w-20 sm:h-24 sm:w-24" />
                </span>
                <div className="pixel-box-flat px-cream relative flex-1 bg-navy-950 p-4">
                  <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">{caseObj.owner}</p>
                  <p className="mt-1 text-cream">
                    You did an amazing job! Thanks to your help, the records of {caseObj.name} are complete and ready for
                    the next accounting period.
                  </p>
                </div>
              </div>
            </div>

            {/* Report */}
            <div className="grid content-start gap-6 sm:grid-cols-2">
              <Panel title="Mastered topics" tone="bg-forest-50" icon={<Icon name="check" className="h-5 w-5 text-forest-700" strokeWidth={3} />}>
                {report.mastered.length ? (
                  <ul className="flex flex-col gap-2">
                    {report.mastered.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm font-semibold text-forest-900">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest-500 text-cream">
                          <Icon name="check" className="h-3 w-3" strokeWidth={4} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">Earn 3 stars on a level to master its topic.</p>
                )}
              </Panel>

              <Panel title="Topics to review" icon={<Icon name="bulb" className="h-5 w-5 text-gold-600" strokeWidth={2.5} />}>
                {report.review.length ? (
                  <ul className="flex flex-col gap-2">
                    {report.review.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm font-semibold text-navy-900">
                        <Icon name="book" className="mt-0.5 h-4 w-4 shrink-0 text-wood-600" strokeWidth={2.5} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-semibold text-forest-700">Nothing to review — every level is a perfect 3 stars!</p>
                )}
                {report.review.length > 0 && <p className="mt-3 text-xs text-slate-500">Replay those levels for 3 stars to master them.</p>}
              </Panel>

              <Panel title="Badge earned" icon={<PixelSprite name="star" scale={2} />}>
                <div className="flex items-center gap-3">
                  <span className="pixel-box-flat px-gold flex h-16 w-16 shrink-0 items-center justify-center bg-gold-50">
                    <PixelSprite name={badge?.sprite ?? 'star'} scale={4} />
                  </span>
                  <span>
                    <span className="block font-heading text-xl font-extrabold leading-tight text-gold-700">{badge?.name ?? 'Case Master'}</span>
                    <span className="block text-xs text-slate-600">{badge?.desc}</span>
                  </span>
                </div>
              </Panel>

              <Panel title="Case completion" icon={<Icon name="trophy" className="h-5 w-5 text-navy-900" strokeWidth={2.5} />}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex gap-1.5" aria-label={`${report.stars} of ${report.max} stars`}>
                    {[1, 2, 3].map((n) => (
                      <PixelSprite key={n} name="star" scale={3} className={n <= report.rating ? 'animate-twinkle' : 'opacity-25 grayscale'} />
                    ))}
                  </span>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest-500 font-heading text-base font-extrabold text-cream shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]">
                    {p.percent}%
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  All {caseObj.levels.length} levels cleared · {report.stars} / {report.max} stars
                </p>
              </Panel>

              <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row">
                <button type="button" onClick={back} className="pixel-btn flex-1 bg-cream text-navy-950 hover:bg-white">
                  {fresh ? 'Case files' : 'Back to gallery'}
                </button>
                {fresh && (
                  <button
                    type="button"
                    onClick={() => {
                      play('click');
                      dispatch({ type: 'CLOSE_CERTIFICATE' });
                      dispatch({ type: 'SET_PANEL', panel: 'achievements' });
                    }}
                    className="pixel-btn flex-1 bg-gold text-navy-950 hover:bg-gold-300"
                  >
                    My certificates <PixelSprite name="arrow" scale={2} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </Scene>
    </div>
  );
}
