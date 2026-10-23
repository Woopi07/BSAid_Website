import { useEffect, useState } from 'react';

const DURATION = 2600; // ms for the bar to fill once the page has loaded
const SEGMENTS = 20;
const TIPS = [
  'Every debit needs a matching credit.',
  'Assets = Liabilities + Equity.',
  'Read the transaction twice, record it once.',
  'Revenue increases equity — credit it.',
];

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening splash: the BSAid logo pops in while a pixel loading bar fills, then the screen fades away.
// Click, tap or press any key to skip.
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    const duration = reducedMotion() ? 900 : DURATION;
    const start = performance.now();
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    let frame;
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      // Hold at 90% until the page (fonts, images) has finished loading.
      const shown = loaded ? pct : Math.min(pct, 90);
      setProgress(shown);
      if (shown < 100) frame = requestAnimationFrame(tick);
      else setTimeout(() => setLeaving(true), 350);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
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

  return (
    <div
      role="status"
      aria-label={`Loading BSAid, ${Math.round(progress)}%`}
      onClick={() => setLeaving(true)}
      onTransitionEnd={() => leaving && setGone(true)}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-black px-6 transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src="/images/bsaid-logo.png"
        alt="BSAid — Learn. Practice. Succeed."
        width="420"
        height="267"
        className="splash-logo w-[min(420px,80vw)] select-none"
        draggable="false"
      />

      <div className="splash-rise mt-10 w-[min(360px,80vw)]">
        <div className="flex items-center justify-between font-pixel text-[12px] uppercase tracking-widest text-navy-200">
          <span>Loading<span className="animate-blink">…</span></span>
          <span className="tabular-nums text-gold">{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 flex gap-1 border-2 border-navy-700 p-1" aria-hidden="true">
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={`h-3 flex-1 ${i < filled ? (i < SEGMENTS * 0.6 ? 'bg-[#1F8A3B]' : 'bg-gold') : 'bg-navy-900'}`} />
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-navy-200">
          <span className="font-semibold text-gold">Tip:</span> {tip}
        </p>
      </div>
    </div>
  );
}
