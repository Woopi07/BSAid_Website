import PixelSprite from '../../components/ui/PixelSprite.jsx';

// Arcade backdrop shared by the in-level screens: warm glow, dot grid, neon floor grid and floating sprites.
export default function Scene({ children, sprites = true }) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-navy-950">
      {/* Scanlines live on the backdrop only, so text panels stay crisp. */}
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[30%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wood/25 blur-3xl" />
        <div className="absolute left-1/2 top-[30%] h-[36vmin] w-[36vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="pixel-dots absolute inset-0" />
        <div className="absolute inset-x-[-50%] bottom-0 h-[30%] overflow-hidden opacity-70">
          <div className="grid-floor h-[200%] w-full animate-grid" />
        </div>
        {sprites && (
          <>
            <div className="absolute left-[3%] top-[10%] hidden animate-drift lg:block">
              <PixelSprite name="cloud" scale={6} />
            </div>
            <div className="absolute right-[3%] top-[18%] hidden animate-drift [animation-delay:-3s] lg:block">
              <PixelSprite name="cloud" scale={5} className="-scale-x-100" />
            </div>
            <div className="absolute bottom-[12%] left-[5%] hidden animate-bob xl:block">
              <PixelSprite name="coin" scale={5} />
            </div>
            <div className="absolute bottom-[16%] right-[6%] hidden animate-twinkle xl:block">
              <PixelSprite name="star" scale={4} />
            </div>
          </>
        )}
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
