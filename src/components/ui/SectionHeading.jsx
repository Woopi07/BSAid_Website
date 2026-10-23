import PixelSprite from './PixelSprite.jsx';

export default function SectionHeading({ eyebrow, title, children, align = 'center', dark = false }) {
  const center = align === 'center';
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-2 font-pixel text-[13px] uppercase tracking-widest sm:text-sm ${
            dark ? 'text-gold' : 'text-wood-600'
          }`}
        >
          <PixelSprite name="star" scale={2} />
          {eyebrow}
          <PixelSprite name="star" scale={2} />
        </p>
      )}
      <h2 className={`mt-4 text-4xl font-bold leading-tight sm:text-5xl ${dark ? 'text-cream pixel-text-shadow' : ''}`}>
        {title}
      </h2>
      {children && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-navy-100' : 'text-slate-600'}`}>{children}</p>
      )}
    </div>
  );
}
