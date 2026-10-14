import { useEffect, useState } from 'react';
import Dialog from './ui/Dialog.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import { ANDROID_DOWNLOAD_URL } from '../data/content.js';

const COUNTDOWN = 9;

// Browsers don't let a page close its own tab, so QUIT shows an arcade-style "Continue?" screen instead.
export default function QuitScreen({ onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [seconds, setSeconds] = useState(COUNTDOWN);

  useEffect(() => {
    if (!confirmed) return undefined;
    if (seconds <= 0) {
      onClose();
      return undefined;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [confirmed, seconds, onClose]);

  return (
    <Dialog labelledBy="quit-title" onClose={onClose} className="bg-navy-950/90">
      <div className="pixel-box px-dark relative w-full max-w-md animate-pop overflow-hidden bg-navy-900 p-6 text-center sm:p-8">
        {!confirmed ? (
          <>
            <PixelSprite name="heart" scale={5} className="mx-auto" />
            <h2 id="quit-title" className="mt-5 font-pixel text-lg uppercase leading-relaxed text-cream sm:text-xl">
              Quit game?
            </h2>
            <p className="mt-4 text-navy-100">
              Your books aren&rsquo;t balanced yet! Faraday was really hoping you&rsquo;d stick around for Case #01.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-5 sm:flex-row">
              <button type="button" onClick={onClose} className="pixel-btn bg-gold text-navy-950 hover:bg-gold-300">
                Stay &amp; play
              </button>
              <button type="button" onClick={() => setConfirmed(true)} className="pixel-btn bg-crimson-700 text-cream hover:bg-crimson">
                Quit
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-pixel text-[13px] uppercase tracking-widest text-gold">Thanks for visiting</p>
            <h2 id="quit-title" className="mt-4 font-pixel text-2xl uppercase leading-relaxed text-cream">
              Continue?
            </h2>
            <p className="mt-4 font-pixel text-6xl text-ember">
              {seconds}
            </p>
            <p className="mt-5 text-navy-100">See you around campus, future CPA.</p>
            <div className="mt-8 flex flex-col justify-center gap-5 sm:flex-row">
              <button type="button" autoFocus onClick={onClose} className="pixel-btn bg-cream text-navy-950 hover:bg-white">
                Continue
              </button>
              <a href={ANDROID_DOWNLOAD_URL} onClick={onClose} className="pixel-btn bg-gold text-navy-950 hover:bg-gold-300">
                Get the app
              </a>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
