import Icon from './Icon.jsx';

const variants = {
  primary: 'bg-gold text-navy-950 hover:bg-gold-300',
  secondary: 'bg-navy text-cream hover:bg-navy-600',
  ember: 'bg-ember text-navy-950 hover:bg-ember-300',
  light: 'bg-cream text-navy-950 hover:bg-white',
};

export default function Button({ href, icon, variant = 'primary', className = '', children, ...props }) {
  const classes = `pixel-btn ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} className="h-5 w-5" strokeWidth={2.25} />}
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
