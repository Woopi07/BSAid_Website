import { useEffect, useState } from 'react';
import PixelSprite from './ui/PixelSprite.jsx';

const FILL_TIME = 3200; // ms for the loading bar to fill once the page has loaded
const SEGMENTS = 16;
const TIPS = [
  'Every debit needs a matching credit.',
  'Assets = Liabilities + Equity.',
  'Read the transaction twice, record it once.',
  'Revenue increases equity, so it is credited.',
  'Expenses have a normal debit balance.',
];

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening splash in the site's pixel-arcade style: the BSAid logotype pops in over the arcade backdrop
// while a segmented loading bar fills, then the screen fades into the page. Click, tap or any key skips it.
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    const duration = reducedMotion() ? 900 : FILL_TIME;
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    let frame;
    let done;
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      // Hold at 90% until the page (fonts, images) has finished loading.
      const shown = loaded ? pct : Math.min(pct, 90);
      setProgress(shown);
      if (shown < 100) frame = requestAnimationFrame(tick);
      else done = setTimeout(() => setLeaving(true), 450);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  // Lock page scroll while the splash is up; skip on any key.
  useEffect(() => {
    if (gone) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = () => setLeaving(true);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [gone]);

  if (gone) return null;
  const filled = Math.round((progress / 100) * SEGMENTS);
  const ready = progress >= 100;

  return (
    <div
      role="status"
      aria-label={`Loading BSAid, ${Math.round(progress)}%`}
      onClick={() => setLeaving(true)}
      onTransitionEnd={(e) => e.target === e.currentTarget && leaving && setGone(true)}
      className={`scanlines fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-navy-950 px-4 text-center transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Arcade backdrop, matching the title screen */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[40%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wood/30 blur-3xl" />
        <div className="absolute left-1/2 top-[40%] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
        <div className="pixel-dots absolute inset-0" />
        <div className="absolute inset-x-[-50%] bottom-0 h-[34%] overflow-hidden">
          <div className="grid-floor h-[200%] w-full animate-grid" />
        </div>
        <div className="absolute left-[6%] top-[14%] animate-drift">
          <PixelSprite name="cloud" scale={6} className="h-auto w-24 sm:w-36" />
        </div>
        <div className="absolute right-[5%] top-[22%] animate-drift [animation-delay:-3s]">
          <PixelSprite name="cloud" scale={5} className="h-auto w-20 -scale-x-100 sm:w-28" />
        </div>
        <div className="absolute bottom-[16%] left-[9%] hidden animate-bob sm:block">
          <PixelSprite name="calculator" scale={6} className="rotate-[8deg]" />
        </div>
        <div className="absolute bottom-[20%] right-[10%] hidden animate-twinkle sm:block">
          <PixelSprite name="star" scale={5} />
        </div>
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center">
        <p
          className="splash-logo pixel-title font-heading text-[clamp(4.5rem,20vw,8.5rem)] font-bold leading-none tracking-tight"
          data-text="BSAid"
          role="img"
          aria-label="BSAid"
        >
          BSAid
        </p>
        <p className="splash-rise mt-6 font-pixel text-[12px] uppercase tracking-[0.3em] text-cream pixel-text-shadow sm:text-[13px]">
          Learn · Practice · Succeed
        </p>

        {/* Loading bar */}
        <div className="splash-rise pixel-box px-dark mt-10 w-full max-w-sm bg-navy-900 p-4">
          <div className="flex items-center justify-between font-pixel text-[12px] uppercase tracking-widest">
            <span className="flex items-center gap-2 text-cream">
              <PixelSprite name="coin" scale={2} className={ready ? '' : 'animate-bob'} />
              {ready ? (
                'Ready!'
              ) : (
                <span>
                  Loading<span className="animate-blink">…</span>
                </span>
              )}
            </span>
            <span className="tabular-nums text-gold">{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 flex gap-1 bg-navy-950 p-1.5" aria-hidden="true">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span key={i} className={`h-4 flex-1 ${i < filled ? (i < SEGMENTS * 0.75 ? 'bg-forest-500' : 'bg-gold') : 'bg-navy-800'}`} />
            ))}
          </div>
        </div>

        <div className="splash-rise pixel-box-flat px-cream mt-7 w-full max-w-sm bg-navy-950/90 px-4 py-3 text-left">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Faraday&rsquo;s tip</p>
          <p className="mt-1 text-sm leading-relaxed text-cream">{tip}</p>
        </div>

        <p className="mt-6 font-pixel text-[11px] uppercase tracking-widest text-navy-200">
          <span className="animate-blink">Tap or press any key</span> to skip
        </p>
      </div>
    </div>
  );
}
