import PixelSprite from './ui/PixelSprite.jsx';

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <PixelSprite name="coin" scale={3} />
      <span className="font-heading text-2xl font-bold tracking-tight">
        BSA<span className="text-gold">id</span>
      </span>
    </span>
  );
}
