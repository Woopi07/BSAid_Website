import { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import { certificateBlob, CERT_H, CERT_W, drawCertificate } from '../certificateCanvas.js';
import { DEFAULT_NAME } from '../data/certificates.js';
import Icon from './Icons.jsx';

// The certificate itself: a canvas redrawn whenever the name changes (after fonts load, so text is right).
export function CertificateCanvas({ caseObj, name, date, rating, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    let alive = true;
    const draw = () => alive && ref.current && drawCertificate(ref.current, { caseObj, name, date, rating });
    draw();
    document.fonts?.ready.then(draw);
    return () => {
      alive = false;
    };
  }, [caseObj, name, date, rating]);
  return (
    <canvas
      ref={ref}
      width={CERT_W}
      height={CERT_H}
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label={`Certificate of achievement for ${name || DEFAULT_NAME}, ${caseObj.name}`}
    />
  );
}

// Saves the certificate image: the share sheet on phones (so it can go straight to Photos), a PNG download elsewhere.
async function saveImage(opts) {
  const blob = await certificateBlob(opts);
  const fileName = `BSAid-Certificate-${opts.caseObj.name.replace(/[^a-z0-9]+/gi, '-')}.png`;
  const file = new File([blob], fileName, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'My BSAid certificate' });
      return 'shared';
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled';
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return 'downloaded';
}

// Name field + "Save to gallery". The name is remembered for every certificate.
export function CertificateControls({ caseObj, date, rating }) {
  const { playerName, dispatch } = useGame();
  const { play } = useAudio();
  const [status, setStatus] = useState(null);

  const save = async () => {
    play('pop');
    setStatus('saving');
    const result = await saveImage({ caseObj, name: playerName, date, rating });
    setStatus(result === 'cancelled' ? null : result);
    if (result !== 'cancelled') setTimeout(() => setStatus(null), 3200);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1">
        <span className="font-pixel text-[11px] uppercase tracking-widest text-cream/80">Name on certificate</span>
        <span className="relative mt-1.5 block">
          <Icon name="doc" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-900" strokeWidth={2.25} />
          <input
            type="text"
            value={playerName}
            maxLength={40}
            onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', name: e.target.value })}
            placeholder="Type your name"
            autoComplete="name"
            className="pixel-box-flat w-full rounded-none border-0 bg-cream py-3 pl-10 pr-3 font-semibold text-navy-900 placeholder:font-normal placeholder:text-slate-500"
          />
        </span>
      </label>
      <button type="button" onClick={save} disabled={status === 'saving'} className="pixel-btn shrink-0 bg-gold text-navy-950 hover:bg-gold-300 disabled:opacity-60">
        <Icon name="star" className="h-4 w-4" strokeWidth={2.5} />
        {status === 'saving' ? 'Saving…' : status === 'shared' ? 'Saved!' : status === 'downloaded' ? 'Downloaded!' : 'Save to gallery'}
      </button>
    </div>
  );
}
