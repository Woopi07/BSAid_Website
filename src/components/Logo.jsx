import PixelSprite from './ui/PixelSprite.jsx';

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <PixelSprite name="coin" scale={3} />
      {/* Same blue "BS" / green "Aid" split as the BSAid logo on the title screen */}
      <span className="font-heading text-2xl font-bold tracking-tight pixel-text-shadow">
        <span className="text-[#7C9CD6]">BS</span>
        <span className="text-[#45B35A]">Aid</span>
      </span>
    </span>
  );
}
