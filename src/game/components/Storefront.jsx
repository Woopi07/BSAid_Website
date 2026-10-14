import { useId } from 'react';

// Illustrated storefront thumbnail drawn in SVG. Swap in real artwork by passing `image` on the case.
function Awning({ colors, y, scallop = true }) {
  const stripes = Array.from({ length: 12 }, (_, i) => i);
  return (
    <g>
      {stripes.map((i) => (
        <rect key={i} x={40 + i * 20} y={y} width="20" height="22" fill={colors[i % 2]} />
      ))}
      {scallop &&
        stripes.map((i) => <circle key={`s${i}`} cx={50 + i * 20} cy={y + 22} r="10" fill={colors[i % 2]} />)}
      <rect x="36" y={y - 4} width="248" height="6" rx="3" fill="#1F2937" opacity="0.35" />
    </g>
  );
}

function Shelves({ kind }) {
  if (kind === 'jewelry') {
    return (
      <g>
        <rect x="70" y="128" width="60" height="30" rx="3" fill="#1F2937" opacity="0.5" />
        {[84, 100, 116].map((x) => (
          <path key={x} d={`M${x} 140 l4 -6 4 6 -4 6z`} fill="#FDE68A" />
        ))}
        <rect x="190" y="128" width="60" height="30" rx="3" fill="#1F2937" opacity="0.5" />
        {[204, 220, 236].map((x) => (
          <circle key={x} cx={x} cy="142" r="4" fill="none" stroke="#FDE68A" strokeWidth="2" />
        ))}
      </g>
    );
  }
  if (kind === 'coffee') {
    return (
      <g>
        {[80, 100, 120, 200, 220, 240].map((x) => (
          <g key={x}>
            <rect x={x - 6} y="134" width="12" height="12" rx="2" fill="#FEF3C7" />
            <path d={`M${x + 6} 137 h3 a3 3 0 0 1 0 6 h-3`} fill="none" stroke="#FEF3C7" strokeWidth="2" />
          </g>
        ))}
      </g>
    );
  }
  if (kind === 'delivery') {
    return (
      <g>
        <rect x="68" y="130" width="22" height="18" fill="#D97706" />
        <rect x="92" y="136" width="18" height="12" fill="#B45309" />
        <rect x="196" y="126" width="56" height="22" rx="4" fill="#F8FAFC" />
        <path d="M206 140h20v-8h8l6 6v2" fill="none" stroke="#EA580C" strokeWidth="2.5" />
      </g>
    );
  }
  if (kind === 'bureau') {
    return <path d="M150 128h20v30h-20zM160 120v-6" stroke="#D1D5DB" strokeWidth="2" fill="none" />;
  }
  // grocery: produce crates
  const fruit = ['#DC2626', '#F59E0B', '#16A34A', '#EA580C'];
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={60 + i * 18} y="146" width="16" height="12" fill="#92400E" />
          {[0, 1, 2].map((j) => (
            <circle key={j} cx={64 + i * 18 + j * 4} cy="145" r="3" fill={fruit[(i + j) % 4]} />
          ))}
        </g>
      ))}
      {[0, 1, 2].map((r) => (
        <rect key={r} x="196" y={122 + r * 12} width="60" height="3" fill="#78350F" />
      ))}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}${c}`} x={200 + c * 11} y={114 + r * 12} width="7" height="8" fill={fruit[(r + c) % 4]} opacity="0.85" />
        ))
      )}
    </g>
  );
}

export default function Storefront({ art, className = '' }) {
  const gid = useId().replace(/:/g, '');
  if (!art) {
    return (
      <svg viewBox="0 0 320 180" className={className} aria-hidden="true">
        <rect width="320" height="180" fill="#8A8A8A" />
      </svg>
    );
  }
  const { sign, sub, wall, roof, awning, glow, kind } = art;
  const long = sign.length > 10;

  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id={`win${gid}`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={glow} />
          <stop offset="1" stopColor="#92400E" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#sky${gid})`} />
      <circle cx="270" cy="40" r="60" fill="#FDE68A" opacity="0.35" />

      {/* building */}
      <path d={`M30 52 L160 14 L290 52 Z`} fill={roof} />
      <rect x="40" y="50" width="240" height="130" fill={wall} />
      <rect x="40" y="50" width="240" height="6" fill="#000" opacity="0.15" />

      {/* sign */}
      <rect x="78" y="22" width="164" height="44" rx="6" fill="#1F2937" stroke="#D97706" strokeWidth="3" />
      <text
        x="160"
        y={long ? 44 : 47}
        textAnchor="middle"
        fontFamily="'Lilita One', Nunito, sans-serif"
        fontSize={long ? 17 : 22}
        fill="#FDE68A"
      >
        {sign}
      </text>
      <text x="160" y="59" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="7" letterSpacing="2" fill="#FCD34D">
        {sub}
      </text>

      <Awning colors={awning} y={72} />

      {/* windows + door */}
      <rect x="56" y="104" width="86" height="58" rx="3" fill={`url(#win${gid})`} stroke="#1F2937" strokeWidth="3" />
      <rect x="178" y="104" width="86" height="58" rx="3" fill={`url(#win${gid})`} stroke="#1F2937" strokeWidth="3" />
      <rect x="146" y="108" width="28" height="72" rx="2" fill="#3F2A1D" stroke="#1F2937" strokeWidth="3" />
      <rect x="150" y="116" width="20" height="10" rx="1" fill={glow} opacity="0.8" />
      <text x="160" y="124" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="6" fill="#7C2D12">
        OPEN
      </text>
      <Shelves kind={kind} />

      {/* lamps + plants */}
      <circle cx="44" cy="100" r="5" fill={glow} />
      <circle cx="276" cy="100" r="5" fill={glow} />
      <ellipse cx="34" cy="172" rx="16" ry="10" fill="#15803D" />
      <ellipse cx="288" cy="172" rx="16" ry="10" fill="#15803D" />
      <rect y="174" width="320" height="6" fill="#000" opacity="0.2" />
    </svg>
  );
}
