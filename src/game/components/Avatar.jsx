// Simple illustrated character portrait. Replace with real character art via `src` when available.
export default function Avatar({ look, className = 'h-12 w-12', src, alt = '' }) {
  if (src) return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} />;
  const { hair = '#1F1A17', hairStyle = 'long', skin = '#F5D0B5', outfit = '#166534', accent = '#FFFFFF' } = look ?? {};

  return (
    <svg viewBox="0 0 120 120" className={`rounded-full ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : 'true'}>
      <rect width="120" height="120" fill="#FFF7E6" />
      {/* back hair */}
      {hairStyle === 'long' && <path d="M26 58c0-24 14-38 34-38s34 14 34 38v46H26z" fill={hair} />}
      {hairStyle === 'bob' && <path d="M28 60c0-24 13-38 32-38s32 14 32 38v16H28z" fill={hair} />}
      {/* shoulders + outfit */}
      <path d="M18 120c2-20 18-30 42-30s40 10 42 30z" fill={accent} />
      <path d="M34 120V100c0-4 4-8 8-8h36c4 0 8 4 8 8v20z" fill={outfit} />
      <path d="M50 92l10 12 10-12" fill="none" stroke={accent} strokeWidth="4" />
      <circle cx="44" cy="106" r="2.5" fill="#FCD34D" />
      <circle cx="76" cy="106" r="2.5" fill="#FCD34D" />
      {/* neck + face */}
      <rect x="53" y="76" width="14" height="16" rx="5" fill={skin} />
      <ellipse cx="60" cy="58" rx="22" ry="25" fill={skin} />
      {/* fringe */}
      {hairStyle === 'short' ? (
        <path d="M37 54c0-18 10-28 23-28s23 10 23 28c-6-8-14-12-23-12s-17 4-23 12z" fill={hair} />
      ) : (
        <path d="M36 58c0-20 10-31 24-31s24 11 24 31c-4-10-10-16-18-17-2 6-10 10-20 10-4 0-7 3-10 7z" fill={hair} />
      )}
      {/* face details */}
      <ellipse cx="51" cy="60" rx="3.2" ry="4" fill="#2B1B12" />
      <ellipse cx="69" cy="60" rx="3.2" ry="4" fill="#2B1B12" />
      <circle cx="52" cy="58.5" r="1.1" fill="#fff" />
      <circle cx="70" cy="58.5" r="1.1" fill="#fff" />
      <ellipse cx="45" cy="68" rx="4" ry="2.4" fill="#F9A8A8" opacity="0.6" />
      <ellipse cx="75" cy="68" rx="4" ry="2.4" fill="#F9A8A8" opacity="0.6" />
      <path d="M53 70c4 5 10 5 14 0" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
