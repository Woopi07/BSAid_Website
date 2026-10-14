import { useEffect, useMemo, useState } from 'react';

// Character portrait in pixel-art style: a simple vector portrait is rasterized to a tiny 40x40 canvas
// and scaled up with crisp, pixelated edges. Pass `src` to use real character art instead.
const RES = 40;

function portraitSvg({ hair = '#1F1A17', hairStyle = 'long', skin = '#F5D0B5', outfit = '#166534', accent = '#FFFFFF' } = {}) {
  const backHair = {
    long: `<path d="M26 58c0-24 14-38 34-38s34 14 34 38v46H26z" fill="${hair}"/>`,
    bob: `<path d="M28 60c0-24 13-38 32-38s32 14 32 38v16H28z" fill="${hair}"/>`,
    short: '',
  }[hairStyle];
  const fringe =
    hairStyle === 'short'
      ? `<path d="M37 54c0-18 10-28 23-28s23 10 23 28c-6-8-14-12-23-12s-17 4-23 12z" fill="${hair}"/>`
      : `<path d="M36 58c0-20 10-31 24-31s24 11 24 31c-4-10-10-16-18-17-2 6-10 10-20 10-4 0-7 3-10 7z" fill="${hair}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" fill="#FFF4DE"/>
    ${backHair}
    <path d="M18 120c2-20 18-30 42-30s40 10 42 30z" fill="${accent}"/>
    <path d="M34 120V100c0-4 4-8 8-8h36c4 0 8 4 8 8v20z" fill="${outfit}"/>
    <path d="M50 92l10 12 10-12" fill="none" stroke="${accent}" stroke-width="5"/>
    <rect x="53" y="76" width="14" height="16" rx="5" fill="${skin}"/>
    <ellipse cx="60" cy="58" rx="22" ry="25" fill="${skin}"/>
    ${fringe}
    <rect x="47" y="56" width="7" height="9" fill="#2B1B12"/>
    <rect x="66" y="56" width="7" height="9" fill="#2B1B12"/>
    <rect x="48" y="57" width="3" height="3" fill="#fff"/>
    <rect x="67" y="57" width="3" height="3" fill="#fff"/>
    <rect x="40" y="66" width="8" height="4" fill="#F9A8A8"/>
    <rect x="72" y="66" width="8" height="4" fill="#F9A8A8"/>
    <path d="M52 70h16v3h-3v3H55v-3h-3z" fill="#B91C1C"/>
  </svg>`;
}

const cache = new Map();

export default function Avatar({ look, className = 'h-12 w-12', src, alt = '', round = true }) {
  const svgUrl = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(portraitSvg(look))}`, [look]);
  const [pixelUrl, setPixelUrl] = useState(() => cache.get(svgUrl) ?? null);
  const shape = round ? 'rounded-full' : '';

  useEffect(() => {
    if (src || cache.has(svgUrl)) {
      setPixelUrl(cache.get(svgUrl) ?? null);
      return undefined;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = RES;
      canvas.height = RES;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, RES, RES);
      const url = canvas.toDataURL('image/png');
      cache.set(svgUrl, url);
      if (!cancelled) setPixelUrl(url);
    };
    img.src = svgUrl;
    return () => {
      cancelled = true;
    };
  }, [src, svgUrl]);

  return (
    <img
      src={src ?? pixelUrl ?? svgUrl}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      className={`object-cover ${shape} ${className}`}
      style={{ imageRendering: 'pixelated' }}
      draggable="false"
    />
  );
}
