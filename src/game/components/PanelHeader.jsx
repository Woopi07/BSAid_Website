import PixelSprite from '../../components/ui/PixelSprite.jsx';
import Icon from './Icons.jsx';

export default function PanelHeader({ icon, title, subtitle }) {
  return (
    <div className="pixel-box relative flex shrink-0 items-center gap-4 overflow-hidden bg-white p-4 sm:p-5">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-gold text-navy-950 shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2),inset_4px_4px_0_rgba(255,255,255,0.4)]">
        <Icon name={icon} className="h-7 w-7" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <h1 className="text-3xl font-bold leading-none text-navy-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 font-pixel text-[9px] uppercase leading-relaxed tracking-wide text-ember-600 sm:text-[10px]">{subtitle}</p>
      </div>
      <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 opacity-90 md:block" aria-hidden="true">
        <PixelSprite name="cloud" scale={5} />
      </div>
    </div>
  );
}
