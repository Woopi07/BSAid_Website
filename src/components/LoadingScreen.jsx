import { useEffect, useState } from 'react';

const FILL_TIME = 3000; // ms for the loading bar to fill once the page has loaded
const LOGO_TIME = 2400; // ms the Entry Point logo stays up before the page appears
const ART = '/images/loading-screen.webp'; // 1920×1080; the bar's white outline is drawn into the art
// Inside of the drawn bar, as a share of the art's size (x 744–1261, y 929–960 px).
const BAR = { left: '38.750%', top: '86.019%', width: '26.927%', height: '2.870%' };

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening sequence: the Entry Point loading art fills its bar, then the Entry Point logo pops up,
// then everything fades into the page. Click, tap or press any key to skip ahead.
export default function LoadingScreen() {
  const [phase, setPhase] = useState('load'); // load | logo
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  // Loading bar
  useEffect(() => {
    const duration = reducedMotion() ? 800 : FILL_TIME;
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    let frame;
    let next;
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      // Hold at 90% until the page (fonts, images) has finished loading.
      const shown = loaded ? pct : Math.min(pct, 90);
      setProgress(shown);
      if (shown < 100) frame = requestAnimationFrame(tick);
      else next = setTimeout(() => setPhase('logo'), 350);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(next);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  // Logo hold, then fade into the page
  useEffect(() => {
    if (phase !== 'logo') return undefined;
    const id = setTimeout(() => setLeaving(true), reducedMotion() ? 1000 : LOGO_TIME);
    return () => clearTimeout(id);
  }, [phase]);

  // Skip: during loading jump to the logo, during the logo go straight to the page.
  const skip = () => (phase === 'load' ? setPhase('logo') : setLeaving(true));

  // Lock page scroll while the splash is up; any key skips ahead.
  useEffect(() => {
    if (gone) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', skip);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', skip);
    };
  });

  if (gone) return null;

  return (
    <div
      role="status"
      aria-label={phase === 'load' ? `Loading Entry Point, ${Math.round(progress)}%` : 'Entry Point'}
      onClick={skip}
      onTransitionEnd={(e) => e.target === e.currentTarget && leaving && setGone(true)}
      className={`fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-navy-950 transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. Loading art with a live bar laid over the one drawn into it */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-[opacity,filter] duration-700 ${
          phase === 'logo' ? 'opacity-60 blur-sm' : 'opacity-100'
        }`}
      >
        <img src={ART} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
        <div className="relative aspect-video w-[max(100vw,177.8vh)] shrink-0 [@media(max-aspect-ratio:6/5)]:w-[128vw]">
          <img
            src={ART}
            alt="Entry Point — Every transaction tells a story. Will you make the right entry?"
            className="block h-full w-full select-none"
            draggable="false"
          />
          <span className={`absolute overflow-hidden rounded-full transition-opacity duration-300 ${phase === 'logo' ? 'opacity-0' : ''}`} style={BAR} aria-hidden="true">
            <span className="block h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" style={{ width: `${progress}%` }} />
          </span>
        </div>
      </div>

      {/* 2. Logo pop-up */}
      {phase === 'logo' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950/55 px-6">
          <div className="splash-rays pointer-events-none absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <img
            src="/images/entry-point-logo.svg"
            alt="Entry Point"
            width="960"
            height="660"
            className="splash-logo relative w-[min(640px,88vw)] select-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
            draggable="false"
          />
          <p className="splash-rise relative mt-6 font-pixel text-[12px] uppercase tracking-[0.3em] text-cream pixel-text-shadow sm:text-[13px]">
            Every transaction tells a story
          </p>
        </div>
      )}
    </div>
  );
}
