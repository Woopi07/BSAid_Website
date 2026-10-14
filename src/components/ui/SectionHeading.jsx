export default function SectionHeading({ eyebrow, title, children, align = 'center', dark = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className={`font-heading text-sm font-semibold uppercase tracking-widest ${dark ? 'text-gold' : 'text-gold-700'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${dark ? 'text-white' : ''}`}>{title}</h2>
      {children && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-navy-100' : 'text-slate-600'}`}>{children}</p>
      )}
    </div>
  );
}
