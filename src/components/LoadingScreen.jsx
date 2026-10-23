import { useEffect, useState } from 'react';
import PixelSprite from './ui/PixelSprite.jsx';

const FILL_TIME = 3600; // ms for the loading bar to fill once the page has loaded
const BALANCED_HOLD = 900; // ms the "Balanced!" stamp shows before the logo
const LOGO_TIME = 2200; // ms the Entry Point logo stays up before the page appears
const SEGMENTS = 20;

// Journal entries that post while the game loads; each appears once the bar passes `at` percent.
const ENTRIES = [
  { at: 14, debit: 'Cash', credit: "Owner's Capital", amount: 50000, memo: 'Owner invests cash' },
  { at: 36, debit: 'Supplies', credit: 'Cash', amount: 3500, memo: 'Bought store supplies' },
  { at: 58, debit: 'Cash', credit: 'Sales Revenue', amount: 1250, memo: 'Cash sale to a customer' },
  { at: 80, debit: 'Utilities Expense', credit: 'Cash', amount: 1800, memo: 'Paid the electric bill' },
];
const TIPS = [
  'Every debit needs a matching credit.',
  'Assets = Liabilities + Equity.',
  'Revenue increases equity, so it is credited.',
  'Expenses have a normal debit balance.',
  'Read the transaction twice, record it once.',
];

const peso = (n) => `₱${n.toLocaleString('en-PH')}`;
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening sequence in the site's pixel-arcade style: a General Journal window posts entries as the
// game loads, the totals balance, then the Entry Point logo pops up and the page appears.
// Click, tap or press any key to skip ahead.
export default function LoadingScreen() {
  const [phase, setPhase] = useState('load'); // load | balanced | logo
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  // Loading bar
  useEffect(() => {
    const duration = reducedMotion() ? 900 : FILL_TIME;
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      // Hold at 90% until the page (fonts, images) has finished loading.
      const shown = loaded ? pct : Math.min(pct, 90);
      setProgress((p) => Math.max(p, shown));
      if (shown < 100) frame = requestAnimationFrame(tick);
      else setPhase((p) => (p === 'load' ? 'balanced' : p));
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  // Rotate Faraday's tips
  useEffect(() => {
    if (phase !== 'load') return undefined;
    const id = setInterval(() => setTip((t) => (t + 1) % TIPS.length), 2200);
    return () => clearInterval(id);
  }, [phase]);

  // Balanced stamp -> logo -> page
  useEffect(() => {
    if (phase === 'balanced') {
      const id = setTimeout(() => setPhase('logo'), BALANCED_HOLD);
      return () => clearTimeout(id);
    }
    if (phase === 'logo') {
      const id = setTimeout(() => setLeaving(true), reducedMotion() ? 1000 : LOGO_TIME);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [phase]);

  // Skip: while loading jump to the logo, during the logo go straight to the page.
  const skip = () => {
    if (phase === 'logo') setLeaving(true);
    else {
      setProgress(100);
      setPhase('logo');
    }
  };

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

  const posted = ENTRIES.filter((e) => progress >= e.at);
  const total = posted.reduce((s, e) => s + e.amount, 0);
  const filled = Math.round((progress / 100) * SEGMENTS);
  const balanced = phase !== 'load';

  return (
    <div
      role="status"
      aria-label={phase === 'logo' ? 'Entry Point' : `Loading Entry Point, ${Math.round(progress)}%`}
      onClick={skip}
      onTransitionEnd={(e) => e.target === e.currentTarget && leaving && setGone(true)}
      className={`scanlines fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-navy-950 px-4 transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Arcade backdrop, matching the title screen */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[42%] h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wood/25 blur-3xl" />
        <div className="absolute left-1/2 top-[42%] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="pixel-dots absolute inset-0" />
        <div className="absolute inset-x-[-50%] bottom-0 h-[30%] overflow-hidden">
          <div className="grid-floor h-[200%] w-full animate-grid" />
        </div>
        <div className="absolute left-[5%] top-[12%] animate-drift">
          <PixelSprite name="cloud" scale={6} className="h-auto w-24 sm:w-36" />
        </div>
        <div className="absolute right-[4%] top-[20%] animate-drift [animation-delay:-3s]">
          <PixelSprite name="cloud" scale={5} className="h-auto w-20 -scale-x-100 sm:w-28" />
        </div>
        <div className="absolute bottom-[14%] left-[7%] hidden animate-bob lg:block">
          <PixelSprite name="calculator" scale={6} className="rotate-[8deg]" />
        </div>
        <div className="absolute bottom-[18%] right-[8%] hidden animate-twinkle lg:block">
          <PixelSprite name="star" scale={5} />
        </div>
      </div>

      {/* Loading: the General Journal */}
      <div className={`relative flex w-full max-w-lg flex-col items-center transition-opacity duration-300 ${phase === 'logo' ? 'opacity-0' : ''}`}>
        <p className="font-pixel text-[11px] uppercase tracking-[0.35em] text-wood-200 sm:text-[12px]">BSAid presents</p>

        <div className="pixel-box px-dark relative mt-5 w-full bg-cream text-navy-900">
          <div className="flex items-center justify-between border-b-4 border-navy-950 bg-forest px-4 py-2.5 font-pixel text-[12px] uppercase tracking-widest text-cream">
            <span className="flex items-center gap-2">
              <PixelSprite name="calculator" scale={2} /> General Journal
            </span>
            <span className={balanced ? 'text-gold' : 'animate-blink'}>{balanced ? 'Posted' : 'Posting'}</span>
          </div>

          <div className="ledger-lines relative px-3 py-3 sm:px-4">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 border-b-2 border-navy-900/20 pb-1.5 font-pixel text-[10px] uppercase tracking-wider text-wood-600 sm:gap-x-5 sm:text-[11px]">
              <span>Account</span>
              <span className="w-[4.6rem] text-right sm:w-20">Debit</span>
              <span className="w-[4.6rem] text-right sm:w-20">Credit</span>
            </div>
            <ol className="min-h-[13.5rem] sm:min-h-[14.5rem]">
              {posted.map((e) => (
                <li key={e.memo} className="animate-rise border-b border-dashed border-navy-900/15 py-1.5 text-[13px] sm:text-sm">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 sm:gap-x-5">
                    <span className="truncate font-semibold">{e.debit}</span>
                    <span className="w-[4.6rem] text-right tabular-nums sm:w-20">{peso(e.amount)}</span>
                    <span className="w-[4.6rem] sm:w-20" />
                  </div>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 sm:gap-x-5">
                    <span className="truncate pl-5">{e.credit}</span>
                    <span className="w-[4.6rem] sm:w-20" />
                    <span className="w-[4.6rem] text-right tabular-nums sm:w-20">{peso(e.amount)}</span>
                  </div>
                  <p className="pl-5 text-[11px] italic text-slate-500">({e.memo})</p>
                </li>
              ))}
            </ol>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 border-t-4 border-double border-navy-900 pt-1.5 font-pixel text-[12px] uppercase sm:gap-x-5">
              <span>Total</span>
              <span className="w-[4.6rem] text-right tabular-nums sm:w-20">{peso(total)}</span>
              <span className="w-[4.6rem] text-right tabular-nums sm:w-20">{peso(total)}</span>
            </div>

            {balanced && (
              <span className="loading-stamp pixel-box-flat px-gold absolute left-[18%] top-1/2 bg-gold px-3 py-2 font-pixel text-base uppercase tracking-widest text-navy-950 sm:left-[24%] sm:text-lg">
                Balanced!
              </span>
            )}
          </div>
        </div>

        {/* Bar with a coin hopping along its edge */}
        <div className="relative mt-8 w-full">
          <span className="absolute -top-7" style={{ left: `calc(${progress}% - 12px)` }} aria-hidden="true">
            <PixelSprite name="coin" scale={2} className="animate-bob [animation-duration:0.6s]" />
          </span>
          <div className="pixel-box-flat px-cream flex gap-1 bg-navy-950 p-1.5" aria-hidden="true">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span key={i} className={`h-4 flex-1 ${i < filled ? (i < SEGMENTS * 0.75 ? 'bg-forest-500' : 'bg-gold') : 'bg-navy-800'}`} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between font-pixel text-[11px] uppercase tracking-widest">
            <span className="text-navy-200">{balanced ? 'Debits = Credits' : 'Loading case files…'}</span>
            <span className="tabular-nums text-gold">{Math.round(progress)}%</span>
          </div>
        </div>

        <p className="mt-6 min-h-[2.5rem] text-center text-sm text-cream">
          <span className="font-pixel text-[11px] uppercase tracking-widest text-gold">Faraday&rsquo;s tip · </span>
          <span key={tip} className="animate-fade">{TIPS[tip]}</span>
        </p>
      </div>

      {/* Logo pop-up */}
      {phase === 'logo' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <div className="splash-rays pointer-events-none absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <img
            src="/images/entry-point-logo.png"
            alt="Entry Point"
            width="336"
            height="231"
            className="crisp splash-logo relative w-[min(672px,88vw)] select-none"
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
