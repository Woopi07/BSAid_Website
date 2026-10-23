import { useEffect, useState } from 'react';

const FILL_TIME = 3600; // ms for the loading bar to fill once the page has loaded
const LOGO_TIME = 2400; // ms the Entry Point logo stays up before the page appears
const ART = '/images/loading-screen.webp'; // 1920×1080; the bar's outline is drawn into the art
// Overlay positions below are given on a 480×270 grid (a quarter of the art's size).
const ART_W = 480;
const ART_H = 270;

// Position in the art's own pixels -> CSS percentages, so overlays stay locked to the picture at any size.
const at = (x, y, w, h) => ({
  left: `${(x / ART_W) * 100}%`,
  top: `${(y / ART_H) * 100}%`,
  width: `${(w / ART_W) * 100}%`,
  ...(h !== undefined && { height: `${(h / ART_H) * 100}%` }),
});
const BAR = { left: '38.750%', top: '86.019%', width: '26.927%', height: '2.870%' }; // inside of the drawn bar
const SPARKLES = [
  { x: 353, y: 117, size: 11, delay: '0s' },
  { x: 351, y: 154, size: 9, delay: '-0.6s' },
  { x: 231, y: 116, size: 7, delay: '-1.1s' },
  { x: 359, y: 158, size: 5, delay: '-0.3s' },
];
// Dust drifting through the sunbeam from the window: [x, y, delay, duration]
const MOTES = [
  [14, 60, 0, 7], [26, 34, -2, 9], [38, 80, -4, 8], [20, 100, -1, 10], [44, 52, -6, 7.5],
  [8, 120, -3, 9.5], [32, 128, -5, 8.5], [50, 96, -7, 9], [18, 150, -2.5, 10.5], [40, 160, -8, 8],
];

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening sequence: the animated Entry Point loading art (Faraday blinks, sunlight and dust drift, a glare
// slides over the card, sparkles twinkle) fills its bar, then the Entry Point logo pops up and the page
// appears. Click, tap or press any key to skip ahead.
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

  // Let the title screen start its logo animation once the splash is out of the way.
  useEffect(() => {
    if (!gone) return;
    window.__splashDone = true;
    window.dispatchEvent(new Event('splash:done'));
  }, [gone]);

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
      {/* 1. Animated loading art */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-[opacity,filter] duration-700 ${
          phase === 'logo' ? 'opacity-60 blur-sm' : 'opacity-100'
        }`}
      >
        <img src={ART} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl" />
        <div className="relative aspect-video w-[max(100vw,177.8vh)] shrink-0 overflow-hidden [@media(max-aspect-ratio:6/5)]:w-[128vw]">
          <img
            src={ART}
            alt="Entry Point — Every transaction tells a story. Will you make the right entry?"
            className="block h-full w-full select-none"
            draggable="false"
          />

          <div aria-hidden="true">
            {/* Sunbeam from the window, with dust drifting through it */}
            <span className="loading-beam absolute inset-y-0 left-0 w-[62%]" />
            {MOTES.map(([x, y, delay, dur], i) => (
              <span
                key={i}
                className="loading-mote absolute aspect-square rounded-full bg-gold-100 blur-[0.5px]"
                style={{ ...at(x, y, i % 3 === 0 ? 2 : 1), animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
              />
            ))}

            {/* Faraday blinks */}
            <img src="/images/loading-blink.png" alt="" className="loading-blink absolute inset-0 h-full w-full" />

            {/* Glare sliding over the glass card */}
            <span className="absolute overflow-hidden rounded-[6%/14%]" style={at(56, 63, 374, 146)}>
              <span className="loading-glare absolute -top-1/4 flex h-[150%] w-[12%] gap-[18%]">
                <span className="w-2/3 bg-white/30" />
                <span className="w-1/6 bg-white/25" />
              </span>
            </span>

            {/* Calculator screen flicker */}
            <span className="loading-lcd absolute rotate-[-11deg] bg-[#C9E4B4]" style={at(199, 130, 23, 10)} />

            {/* Twinkling sparkles around the logo */}
            {SPARKLES.map((s) => (
              <span
                key={`${s.x}-${s.y}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={at(s.x, s.y, s.size)}
              >
                <svg viewBox="-10 -10 20 20" className="loading-sparkle block h-auto w-full" style={{ animationDelay: s.delay }}>
                  <path d="M0,-10 Q1.6,-1.6 10,0 Q1.6,1.6 0,10 Q-1.6,1.6 -10,0 Q-1.6,-1.6 0,-10 Z" fill="#FFF6D6" />
                </svg>
              </span>
            ))}
          </div>

          {/* Live bar laid over the one drawn into the art */}
          <span
            className={`absolute overflow-hidden rounded-full transition-opacity duration-300 ${phase === 'logo' ? 'opacity-0' : ''}`}
            style={BAR}
            aria-hidden="true"
          >
            <span className="block h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.75)]" style={{ width: `${progress}%` }} />
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
          <p className="splash-rise relative mt-6 font-pixel text-[13px] uppercase tracking-[0.35em] text-cream pixel-text-shadow sm:text-sm">
            <span className="animate-blink">Press start</span>
          </p>
        </div>
      )}
    </div>
  );
}
