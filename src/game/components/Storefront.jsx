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
        stripes.map((i) => (
          <g key={`s${i}`} fill={colors[i % 2]}>
            <rect x={42 + i * 20} y={y + 22} width="16" height="4" />
            <rect x={46 + i * 20} y={y + 26} width="8" height="4" />
          </g>
        ))}
      <rect x="36" y={y - 4} width="248" height="6" fill="#0A0F2C" opacity="0.5" />
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
    <svg viewBox="0 0 320 180" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
      <defs>
        <radialGradient id={`win${gid}`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={glow} />
          <stop offset="1" stopColor="#92400E" />
        </radialGradient>
      </defs>
      {['#7F1D1D', '#B91C1C', '#E11D48', '#EA580C', '#FB923C', '#FDBA74'].map((c, i) => (
        <rect key={c} y={i * 16} width="320" height="16" fill={c} />
      ))}
      <rect y="96" width="320" height="84" fill="#FDBA74" />
      {/* pixel sun */}
      <rect x="276" y="14" width="28" height="36" fill="#FCD34D" />
      <rect x="270" y="20" width="40" height="24" fill="#FCD34D" />
      {/* pixel clouds */}
      <g fill="#FED7AA">
        <rect x="12" y="20" width="36" height="8" />
        <rect x="20" y="12" width="16" height="8" />
        <rect x="290" y="70" width="28" height="8" />
      </g>

      {/* building */}
      <path d={`M30 52 L160 14 L290 52 Z`} fill={roof} />
      <rect x="40" y="50" width="240" height="130" fill={wall} />
      <rect x="40" y="50" width="240" height="6" fill="#000" opacity="0.15" />

      {/* sign */}
      <rect x="74" y="18" width="172" height="52" fill="#0A0F2C" />
      <rect x="78" y="22" width="164" height="44" fill="#0F1F4D" stroke="#F59E0B" strokeWidth="4" />
      <text
        x="160"
        y={long ? 44 : 47}
        textAnchor="middle"
        fontFamily="'Pixelify Sans', monospace"
        fontWeight="700"
        fontSize={long ? 18 : 24}
        fill="#FDE68A"
      >
        {sign}
      </text>
      <text x="160" y="60" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="5" letterSpacing="1" fill="#FB923C">
        {sub}
      </text>

      <Awning colors={awning} y={72} />

      {/* windows + door */}
      <rect x="56" y="104" width="86" height="58" fill={`url(#win${gid})`} stroke="#0A0F2C" strokeWidth="4" />
      <rect x="178" y="104" width="86" height="58" fill={`url(#win${gid})`} stroke="#0A0F2C" strokeWidth="4" />
      <rect x="146" y="108" width="28" height="72" fill="#3F2A1D" stroke="#0A0F2C" strokeWidth="4" />
      <rect x="150" y="116" width="20" height="10" fill={glow} />
      <text x="160" y="123.5" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="3.5" fill="#7C2D12">
        OPEN
      </text>
      <Shelves kind={kind} />

      {/* lamps + plants */}
      <rect x="40" y="96" width="8" height="8" fill={glow} />
      <rect x="272" y="96" width="8" height="8" fill={glow} />
      <g fill="#15803D">
        <rect x="20" y="164" width="28" height="16" />
        <rect x="26" y="158" width="16" height="6" />
        <rect x="274" y="164" width="28" height="16" />
        <rect x="280" y="158" width="16" height="6" />
      </g>
      <rect y="174" width="320" height="6" fill="#0A0F2C" opacity="0.6" />
    </svg>
  );
}
