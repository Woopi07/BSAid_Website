import Icon from './Icon.jsx';

const variants = {
  primary:
    'bg-gold text-navy-900 shadow-coin hover:bg-gold-300 active:translate-y-0.5 active:shadow-none',
  secondary:
    'bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20',
  outline:
    'bg-white text-navy ring-1 ring-inset ring-navy-200 hover:bg-navy-50',
};

export default function Button({ href, icon, variant = 'primary', className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-heading text-base font-semibold transition ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} className="h-5 w-5" strokeWidth={2} />}
      {children}
    </>
  );

  return href ? (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  ) : (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
