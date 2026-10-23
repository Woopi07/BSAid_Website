import { useEffect, useState } from 'react';

const LOGO_TIME = 1900; // ms the BSAid logo is shown before the Entry Point loading art
const FILL_TIME = 2600; // ms for the loading bar to fill once the page has loaded
const ART = '/images/loading-screen.webp'; // 898×503; the bar's white outline is drawn into the art
// Inside of the drawn bar, as a share of the art's size (x 349–590, y 435–449 px).
const BAR = { left: '38.864%', top: '86.481%', width: '26.837%', height: '2.783%' };

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Opening splash: the BSAid logo pops in on black, then the Entry Point loading screen fills its bar
// and fades into the page. Click, tap or press any key to skip.
export default function LoadingScreen() {
  const [phase, setPhase] = useState('logo'); // logo | load
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const quick = reducedMotion();
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    let frame;
    let done;
    const fill = (start) => (now) => {
      const pct = Math.min(100, ((now - start) / (quick ? 700 : FILL_TIME)) * 100);
      // Hold at 90% until the page (fonts, images) has finished loading.
      const shown = loaded ? pct : Math.min(pct, 90);
      setProgress(shown);
      if (shown < 100) frame = requestAnimationFrame(fill(start));
      else done = setTimeout(() => setLeaving(true), 400);
    };
    const toLoad = setTimeout(() => {
      setPhase('load');
      frame = requestAnimationFrame((now) => fill(now)(now));
    }, quick ? 600 : LOGO_TIME);
    return () => {
      clearTimeout(toLoad);
      clearTimeout(done);
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

  return (
    <div
      role="status"
      aria-label={phase === 'logo' ? 'Loading BSAid' : `Loading Entry Point, ${Math.round(progress)}%`}
      onClick={() => setLeaving(true)}
      onTransitionEnd={(e) => e.target === e.currentTarget && leaving && setGone(true)}
      className={`fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-black transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. BSAid logo */}
      <div className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-500 ${phase === 'logo' ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="/images/bsaid-logo.png"
          alt="BSAid — Learn. Practice. Succeed."
          width="420"
          height="267"
          className="splash-logo w-[min(420px,80vw)] select-none"
          draggable="false"
        />
      </div>

      {/* 2. Entry Point loading art (loaded in the background during the logo) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${phase === 'load' ? 'opacity-100' : 'opacity-0'}`}>
        <img src={ART} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
        <div className="relative aspect-[898/503] w-[max(100vw,178.6vh)] shrink-0 [@media(max-aspect-ratio:6/5)]:w-[127vw]">
          <img
            src={ART}
            alt="Entry Point — Every transaction tells a story. Will you make the right entry?"
            className="block h-full w-full select-none"
            draggable="false"
          />
          <span className="absolute overflow-hidden rounded-full" style={BAR} aria-hidden="true">
            <span className="block h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" style={{ width: `${progress}%` }} />
          </span>
        </div>
      </div>
    </div>
  );
}
