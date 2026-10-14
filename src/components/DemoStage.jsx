import SectionHeading from './ui/SectionHeading.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import JournalDemo from './JournalDemo.jsx';
import { genres } from '../data/content.js';

const controls = [
  ['Select accounts & answers', 'Tap'],
  ['Compute amounts', 'Calculator'],
  ['Classify accounts', 'Drag & drop'],
  ['Read feedback', 'Scroll'],
];

export default function DemoStage() {
  return (
    <section id="play" className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
      <div className="pixel-dots absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        <div>
          <SectionHeading eyebrow="Player 1 ready" title="Make your first entry." align="left" dark>
            This is a playable slice of Case #01: Sari-Sari Store. Pick the debit and credit for each transaction
            &mdash; tap Hint if you&rsquo;re stuck, and learn from the review if you miss.
          </SectionHeading>

          <div className="pixel-box-flat px-navy mt-8 max-w-md bg-navy-950/70 p-5 text-sm">
            <p className="font-pixel text-[10px] uppercase tracking-widest text-gold">Controls</p>
            <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-6 gap-y-3">
            {controls.map(([action, command]) => (
              <div key={action} className="contents">
                <dt className="text-navy-100">{action}</dt>
                <dd className="font-pixel text-[10px] uppercase text-cream">{command}</dd>
              </div>
            ))}
            </dl>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Genres">
            {genres.map((g) => (
              <li key={g} className="bg-crimson-700 px-2.5 py-1.5 font-pixel text-[9px] uppercase text-cream">
                {g}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -left-2 -top-10 hidden animate-bob lg:block" aria-hidden="true">
            <PixelSprite name="cloud" scale={6} />
          </div>
          <JournalDemo />
        </div>
      </div>
    </section>
  );
}
