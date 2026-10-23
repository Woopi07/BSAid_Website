import { useEffect, useState } from 'react';
import Dialog from './ui/Dialog.jsx';
import Icon from './ui/Icon.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import { tutorialSteps } from '../data/content.js';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Typewriter text, like a visual novel dialogue box. Clicking the box reveals the full line.
function useTypewriter(text) {
  const [count, setCount] = useState(reducedMotion() ? text.length : 0);

  useEffect(() => {
    if (reducedMotion()) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 2;
      });
    }, 18);
    return () => clearInterval(id);
  }, [text]);

  return [text.slice(0, count), count >= text.length, () => setCount(text.length)];
}

function GuideTab({ onPlay }) {
  const [step, setStep] = useState(0);
  const current = tutorialSteps[step];
  const last = step === tutorialSteps.length - 1;
  const [shown, done, skip] = useTypewriter(current.line);

  const advance = () => {
    if (!done) return skip();
    if (last) return onPlay();
    setStep((s) => s + 1);
  };

  return (
    <div className="relative p-5 sm:p-8">
      <div className="pixel-dots absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        {/* Guide portrait */}
        <div className="flex shrink-0 flex-col items-center">
          <div className="pixel-box px-gold flex h-28 w-28 items-center justify-center bg-gradient-to-b from-gold-300 to-wood-600 sm:h-32 sm:w-32">
            <span className="font-heading text-5xl font-bold text-navy-950">Fd</span>
          </div>
          <span className="mt-4 bg-gold px-3 py-1.5 font-pixel text-[13px] uppercase text-navy-950">Faraday</span>
        </div>

        {/* Dialogue box */}
        <div
          onClick={advance}
          className="pixel-box-flat px-cream relative w-full cursor-pointer bg-navy-950 p-5 text-left"
        >
          <span className="flex items-center gap-2 font-pixel text-[13px] uppercase tracking-wide text-gold sm:text-sm">
            <Icon name={current.icon} className="h-4 w-4" strokeWidth={2.5} />
            <span>{current.title}</span>
          </span>
          <span className="mt-3 block min-h-[6.5rem] text-base leading-relaxed text-cream" aria-hidden="true">
            {shown}
          </span>
          <span className="sr-only">{current.line}</span>
          {done && (
            <span className="absolute bottom-3 right-4 animate-bob" aria-hidden="true">
              <PixelSprite name="arrow" scale={2} className="rotate-90" />
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <div className="flex gap-2" aria-hidden="true">
          {tutorialSteps.map((s, i) => (
            <span key={s.title} className={`h-3 w-3 ${i <= step ? 'bg-gold' : 'bg-navy-600'}`} />
          ))}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="pixel-btn bg-navy-600 text-cream hover:bg-navy-400 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={advance}
            className={`pixel-btn ${last ? 'bg-gold text-navy-950 hover:bg-gold-300' : 'bg-cream text-navy-950 hover:bg-white'}`}
          >
            {last ? 'Start playing' : 'Next'} <PixelSprite name="arrow" scale={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

const VIDEO = {
  webm: '/videos/entry-point-tutorial.webm',
  mp4: '/videos/entry-point-tutorial.mp4',
  poster: '/videos/entry-point-tutorial-poster.jpg',
};

function VideoTab() {
  return (
    <div className="relative p-5 sm:p-6">
      <div className="pixel-box-flat px-cream bg-navy-950">
        <video
          className="block aspect-video w-full bg-navy-950"
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={VIDEO.poster}
          aria-label="Entry Point tutorial video: how to play, step by step"
        >
          <source src={VIDEO.webm} type="video/webm" />
          <source src={VIDEO.mp4} type="video/mp4" />
          Your browser can&rsquo;t play this video. <a href={VIDEO.mp4}>Download the tutorial (MP4)</a>.
        </video>
      </div>
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-navy-100">A 2½-minute walkthrough of Entry Point: case files, mini-games, hints, the calculator, rewards and achievements.</p>
        <a href="/play/" className="pixel-btn shrink-0 bg-gold text-navy-950 hover:bg-gold-300">
          Play online <PixelSprite name="arrow" scale={2} />
        </a>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'video', label: 'Watch video' },
  { id: 'guide', label: 'Step-by-step' },
];

export default function TutorialModal({ onClose, onPlay }) {
  const [tab, setTab] = useState('video');

  return (
    <Dialog labelledBy="tutorial-title" onClose={onClose} className="bg-navy-950/85">
      <div className="pixel-box px-dark w-full max-w-3xl animate-pop bg-navy-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-navy-950 bg-forest-700 px-4 py-3">
          <h2 id="tutorial-title" className="font-pixel text-[13px] uppercase tracking-widest text-cream sm:text-sm">
            Tutorial
          </h2>
          <div role="tablist" aria-label="Tutorial format" className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 font-pixel text-[12px] uppercase ${
                  tab === t.id ? 'bg-cream text-forest-700' : 'text-cream hover:bg-white/15'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 font-pixel text-[13px] uppercase text-cream hover:text-gold"
            aria-label="Close tutorial"
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={3} /> Esc
          </button>
        </div>
        <div role="tabpanel">{tab === 'video' ? <VideoTab /> : <GuideTab onPlay={onPlay} />}</div>
      </div>
    </Dialog>
  );
}
