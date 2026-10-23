import { useEffect, useRef, useState } from 'react';

const FILL_TIME = 3400; // ms for the loading bar to fill once the page has loaded
const AUTO_START = 5000; // ms after loading before the page opens on its own if nobody taps

// Faint accounting doodles scattered over the background (in place of the reference's grass and leaves).
const DOODLES = {
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 8.5h3.2a2 2 0 0 1 0 4H9.5V8.5zm0 4v3.5M8 10.5h7M8 12.3h7" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-forest-900/40" />
    </>
  ),
  peso: <path d="M7 20V4h5.5a4.5 4.5 0 0 1 0 9H7m-2.5-5.5h15m-15 3h15" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
  ledger: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M8 9h8M8 12.5h8M8 16h5" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-forest-900/40" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8 6h8v3H8zM8 12h2m2 0h2m2 0h0M8 15.5h2m2 0h2m2 0h0M8 19h2m2 0h2" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-forest-900/40" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />,
};
// [doodle, left %, top %, size px, rotation, parallax depth, drift delay]
const SCATTER = [
  ['coin', 8, 9, 42, -12, 1.4, 0], ['ledger', 78, 7, 46, 10, 0.8, -2], ['peso', 46, 17, 30, 8, 0.5, -4],
  ['check', 16, 30, 34, -8, 1, -1], ['calculator', 86, 34, 40, 14, 1.3, -3], ['plus', 62, 27, 26, 0, 0.6, -5],
  ['ledger', 5, 55, 44, -6, 1.2, -2.5], ['coin', 90, 60, 36, 18, 0.9, -1.5], ['peso', 28, 72, 34, -14, 1.5, -3.5],
  ['check', 70, 76, 38, 6, 1.1, -0.5], ['plus', 12, 84, 28, 0, 0.7, -4.5], ['calculator', 52, 86, 34, -10, 0.6, -2],
  ['coin', 40, 50, 24, 0, 0.4, -6], ['plus', 84, 88, 22, 0, 1.4, -1],
];
const LEAF_BITS = [
  [22, 14, -30, 0], [70, 18, 40, -3], [36, 40, 20, -1.5], [80, 48, -50, -4], [18, 66, 60, -2.5], [60, 64, -20, -5], [44, 92, 30, -0.8],
];

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening loading screen: the Entry Point logo with a "Loading…" tag over a soft green field of accounting
// doodles, and a glossy gold progress bar. Move the pointer (or tilt the phone) for parallax, tap the logo to
// make it bounce and pop coins, then tap to start once loading is done.
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [boing, setBoing] = useState(0);
  const [bursts, setBursts] = useState([]);
  const root = useRef(null);

  // Loading bar
  useEffect(() => {
    const duration = reducedMotion() ? 800 : FILL_TIME;
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      // Hold at 90% until the page (fonts, images) has finished loading.
      const shown = loaded ? pct : Math.min(pct, 90);
      setProgress(shown);
      if (shown < 100) frame = requestAnimationFrame(tick);
      else setReady(true);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  // Open the page on its own a few seconds after loading, in case nobody taps.
  useEffect(() => {
    if (!ready) return undefined;
    const id = setTimeout(() => setLeaving(true), reducedMotion() ? 1200 : AUTO_START);
    return () => clearTimeout(id);
  }, [ready]);

  // Parallax: pointer position (or device tilt) nudges the doodles.
  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return undefined;
    const set = (x, y) => {
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    };
    const onMove = (e) => set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    const onTilt = (e) => e.gamma != null && set(Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, (e.beta - 40) / 30)));
    window.addEventListener('pointermove', onMove);
    window.addEventListener('deviceorientation', onTilt);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
    };
  }, []);

  // Any key: start (once ready) or skip ahead.
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

  // Let the title screen start its logo animation once the splash is out of the way.
  useEffect(() => {
    if (!gone) return;
    window.__splashDone = true;
    window.dispatchEvent(new Event('splash:done'));
  }, [gone]);

  if (gone) return null;

  // Tapping the logo: bounce + a burst of coins.
  const poke = (e) => {
    e.stopPropagation();
    setBoing((n) => n + 1);
    const id = Date.now();
    const coins = Array.from({ length: 7 }, (_, i) => {
      const angle = (-150 + i * 20 + Math.random() * 10) * (Math.PI / 180);
      const dist = 110 + Math.random() * 70;
      return { key: `${id}-${i}`, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, r: Math.random() * 360 };
    });
    setBursts((b) => [...b, ...coins]);
    setTimeout(() => setBursts((b) => b.filter((c) => !c.key.startsWith(`${id}-`))), 900);
  };

  return (
    <div
      ref={root}
      role="status"
      aria-label={ready ? 'Entry Point is ready. Tap to start.' : `Loading Entry Point, ${Math.round(progress)}%`}
      onClick={() => ready && setLeaving(true)}
      onTransitionEnd={(e) => e.target === e.currentTarget && leaving && setGone(true)}
      className={`loading-field fixed inset-0 z-[100] overflow-hidden transition-opacity duration-500 ${ready ? 'cursor-pointer' : ''} ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Doodles and leaf bits, drifting and shifting with the pointer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SCATTER.map(([kind, x, y, size, rot, depth, delay], i) => (
          <span
            key={i}
            className="loading-parallax absolute"
            style={{ left: `${x}%`, top: `${y}%`, '--depth': depth }}
          >
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              className="loading-doodle text-forest-900/30"
              fill="currentColor"
              style={{ '--rot': `${rot}deg`, animationDelay: `${delay}s` }}
            >
              {DOODLES[kind]}
            </svg>
          </span>
        ))}
        {LEAF_BITS.map(([x, y, rot, delay], i) => (
          <span key={`l${i}`} className="loading-parallax absolute" style={{ left: `${x}%`, top: `${y}%`, '--depth': 2 }}>
            <svg viewBox="0 0 24 14" width="34" height="20" className="loading-leaf text-forest-300/55" style={{ '--rot': `${rot}deg`, animationDelay: `${delay}s` }}>
              <path d="M1 7C6 0 18 0 23 7 18 14 6 14 1 7Z" fill="currentColor" />
              <path d="M3 7h18" stroke="#1B5E35" strokeOpacity="0.35" strokeWidth="1.2" />
            </svg>
          </span>
        ))}
      </div>

      {/* Logo + tag */}
      <div className="absolute inset-x-0 top-[44%] flex -translate-y-1/2 flex-col items-center px-6">
        <button
          type="button"
          onClick={poke}
          className="loading-logo-wrap relative w-[min(560px,86vw)] cursor-pointer select-none outline-none"
          aria-label="Entry Point logo — tap me!"
        >
          <img
            key={boing}
            src="/images/entry-point-logo.svg"
            alt=""
            width="960"
            height="660"
            draggable="false"
            className={`block w-full drop-shadow-[0_14px_0_rgba(13,59,34,0.35)] ${boing ? 'loading-boing' : 'loading-logo-in'}`}
          />
          {bursts.map((c) => (
            <span
              key={c.key}
              className="loading-coin absolute left-1/2 top-1/2"
              style={{ '--x': `${c.x}px`, '--y': `${c.y}px`, '--r': `${c.r}deg` }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="30" height="30">
                <circle cx="12" cy="12" r="10.5" fill="#C98A08" />
                <circle cx="12" cy="11" r="9" fill="#F7C95A" />
                <path d="M9.6 7.5h3a2 2 0 0 1 0 4h-3V7.5zm0 4V15M8.4 9.3h6.6M8.4 11h6.6" fill="none" stroke="#9C6A06" strokeWidth="1.5" />
              </svg>
            </span>
          ))}
        </button>

        <div className="loading-tag relative -mt-2 sm:-mt-4">
          <span className="block bg-navy-950 px-1 pb-1.5 pt-1" style={{ clipPath: 'polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)' }}>
            <span
              className="block bg-cream px-10 py-2 font-pixel text-base uppercase tracking-[0.2em] text-navy-900 sm:px-14 sm:text-xl"
              style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)' }}
            >
              {ready ? (
                <span className="loading-pulse">Tap to start</span>
              ) : (
                <span>
                  Loading<span className="loading-dots" />
                </span>
              )}
            </span>
          </span>
        </div>
        <p className="mt-5 text-sm font-semibold text-forest-100/80">{ready ? 'Ready when you are!' : 'Psst… tap the logo'}</p>
      </div>

      {/* Glossy progress bar */}
      <div className="absolute inset-x-0 bottom-[6%] flex flex-col items-center px-5">
        <div className="relative h-11 w-full max-w-3xl rounded-full bg-cream p-1.5 shadow-[0_6px_0_#0D3B22,inset_0_-4px_0_#D9C9A9] sm:h-14 sm:p-2" aria-hidden="true">
          <div className="relative h-full overflow-hidden rounded-full bg-[#9FB3AA] shadow-[inset_0_4px_0_rgba(0,0,0,0.12)]">
            <div className="loading-liquid relative h-full rounded-full" style={{ width: `${Math.max(progress, 4)}%` }}>
              <span className="loading-edge absolute -right-1 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <p className="mt-3 font-pixel text-[12px] uppercase tracking-widest text-cream/85">
          {ready ? 'Debits = credits · all set' : `${Math.round(progress)}%`}
        </p>
      </div>

      {!ready && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLeaving(true);
          }}
          className="absolute right-4 top-4 font-pixel text-[12px] uppercase tracking-widest text-cream/70 hover:text-cream"
        >
          Skip ›
        </button>
      )}
    </div>
  );
}
