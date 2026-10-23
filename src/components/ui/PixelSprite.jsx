// Tiny pixel-art sprites drawn from character maps. Each character maps to a palette color; '.' is transparent.
const palette = {
  k: '#0E2244', // navy outline
  n: '#0A1630', // night outline
  y: '#EDA90D', // gold
  Y: '#F7C95A', // light gold
  d: '#C98A08', // deep gold
  O: '#2E8B4A', // forest green
  o: '#1B5E35', // dark forest green
  c: '#F7EEDF', // paper cream
  s: '#D9C9A9', // cream shade
  w: '#FFFDF6', // white
  b: '#163A72', // navy
  B: '#4A6FA8', // light navy
  g: '#94A3B8', // slate
  G: '#7FB98E', // light green
};

const sprites = {
  coin: [
    '....kkkk....',
    '..kkyyyykk..',
    '.kyyYYYYyyk.',
    '.kyYYwwYYyk.',
    'kyYYwYYYYydk',
    'kyYwYYYYYydk',
    'kyYwYYYYYydk',
    'kyYYYYYYYydk',
    '.kyYYYYYYdk.',
    '.kyyYYYyydk.',
    '..kkddddkk..',
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
    '....kkwwwwkk.kk..',
    '...kwwccccwkkwwk.',
    '..kwccccccccwccck',
    '.kwccccccccccccck',
    'kwcccccccccccccsk',
    'kcccccccccccccssk',
    '.kssccccccssssssk',
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
