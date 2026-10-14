import PixelSprite from './ui/PixelSprite.jsx';

export default function DownloadCTA() {
  return (
    <section id="download" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="pixel-box px-dark relative overflow-hidden bg-gradient-to-b from-ember to-crimson px-6 py-14 text-center sm:px-12">
          <div className="pixel-dots absolute inset-0" aria-hidden="true" />
          <div className="absolute -left-4 top-6 hidden animate-drift sm:block" aria-hidden="true">
            <PixelSprite name="cloud" scale={7} />
          </div>
          <div className="absolute -right-4 bottom-6 hidden animate-drift [animation-delay:-3s] sm:block" aria-hidden="true">
            <PixelSprite name="cloud" scale={6} className="-scale-x-100" />
          </div>
          <div className="relative">
            <p className="font-pixel text-[13px] uppercase tracking-widest text-cream">
              <span className="animate-blink">Insert coin</span> &middot; Press start
            </p>
            <h2 className="mt-5 text-4xl font-bold text-cream pixel-text-shadow sm:text-5xl">Your first case file is waiting.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cream/90">
              BSAid is built for Android so you can study anywhere &mdash; between classes, on the commute, or the night
              before a quiz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
