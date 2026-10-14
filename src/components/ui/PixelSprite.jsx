// Tiny pixel-art sprites drawn from character maps. Each character maps to a palette color; '.' is transparent.
const palette = {
  k: '#7F1D1D', // dark outline
  n: '#0A0F2C', // night outline
  y: '#F59E0B', // gold
  Y: '#FCD34D', // light gold
  o: '#EA580C', // deep ember
  O: '#FB923C', // ember
  p: '#FED7AA', // peach highlight
  w: '#FFF4DE', // cream
  b: '#1E3A8A', // navy
  B: '#4B6BC4', // light navy
  g: '#94A3B8', // slate
  r: '#E11D48', // crimson
  G: '#10B981', // green
};

const sprites = {
  coin: [
    '....kkkk....',
    '..kkyyyykk..',
    '.kyyYYYYyyk.',
    '.kyYYwwYYyk.',
    'kyYYwYYYYyok',
    'kyYwYYYYYyok',
    'kyYwYYYYYyok',
    'kyYYYYYYYyok',
    '.kyYYYYYYok.',
    '.kyyYYYyyok.',
    '..kkooookk..',
    '....kkkk....',
  ],
  star: [
    '.....k.....',
    '....kYk....',
    '....kYk....',
    '...kYYYk...',
    'kkkkYwYYkkk',
    'kYYYwYYYYyk',
    '.kYYYYYYyk.',
    '..kYYYYyk..',
    '..kYYkYyk..',
    '.kYyk.kyyk.',
    '.kkk...kkk.',
  ],
  cloud: [
    '......kkkk.......',
    '....kkppppkk.kk..',
    '...kppOOOOpkkppk.',
    '..kpOOOOOOOOpOOOk',
    '.kpOOOOOOOOOOOOOk',
    'kpOOOOOOOOOOOOOok',
    'kOOOOOOOOOOOOOook',
    '.kooOOOOOOooooook',
    '..kkkkkkkkkkkkkk.',
  ],
  bolt: [
    '......kkkkk',
    '.....kYYYk.',
    '....kYYYk..',
    '...kYwYk...',
    '..kYwYYkkkk',
    '.kYYYYYYYk.',
    'kkkkkYYYk..',
    '....kYYk...',
    '...kYYk....',
    '..kYyk.....',
    '.kyk.......',
    '.kk........',
  ],
  cursor: [
    'n.......',
    'nn......',
    'nwn.....',
    'nwwn....',
    'nwwwn...',
    'nwwwwn..',
    'nwwwwwn.',
    'nwwwwwwn',
    'nwwnnnnn',
    'nwn.....',
    'nn......',
  ],
  calculator: [
    '.nnnnnnnnnn.',
    'nbbbbbbbbbbn',
    'nbGGGGGGGGbn',
    'nbGGGGGwGGbn',
    'nbbbbbbbbbbn',
    'nbwwbwwbOObn',
    'nbbbbbbbbbbn',
    'nbwwbwwbOObn',
    'nbbbbbbbbbbn',
    'nbwwbwwbYYbn',
    'nbbbbbbbbbbn',
    '.nnnnnnnnnn.',
  ],
  arrow: [
    'n....',
    'nn...',
    'nYn..',
    'nYYn.',
    'nYYYn',
    'nYYn.',
    'nYn..',
    'nn...',
    'n....',
  ],
  heart: [
    '.kk...kk.',
    'kOOk.kOOk',
    'kOwOkOOOk',
    'kOOOOOOok',
    '.kOOOOok.',
    '..kOOok..',
    '...kok...',
    '....k....',
  ],
};

export default function PixelSprite({ name, scale = 4, className = '', title }) {
  const rows = sprites[name];
  const width = Math.max(...rows.map((r) => r.length));
  const rects = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== '.' && palette[ch]) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={palette[ch]} />);
      }
    });
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${rows.length}`}
      width={width * scale}
      height={rows.length * scale}
      className={`crisp ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      {rects}
    </svg>
  );
}
