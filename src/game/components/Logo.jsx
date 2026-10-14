import PixelSprite from '../../components/ui/PixelSprite.jsx';

// "ENTRY POINT" logotype in the same 3D pixel style as the BSAid title on the landing page.
export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="img" aria-label="Entry Point">
      <PixelSprite name="coin" scale={3} className="hidden sm:block" />
      <span className="flex flex-col leading-[0.9]" aria-hidden="true">
        <span className="font-pixel text-[9px] tracking-widest text-ember-200">ENTRY</span>
        <span
          className="pixel-title mt-0.5 font-heading text-[22px] font-bold tracking-tight [text-shadow:-2px_0_0_#7f1d1d,2px_0_0_#7f1d1d,0_-2px_0_#7f1d1d,0_2px_0_#7f1d1d,2px_4px_0_#ea580c,4px_4px_0_#7f1d1d]"
          data-text="POINT"
        >
          POINT
        </span>
      </span>
    </span>
  );
}
