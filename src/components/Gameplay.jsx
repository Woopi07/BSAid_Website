import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import Coin from './ui/Coin.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import { coreMechanics, ranks, multipliers } from '../data/content.js';

export default function Gameplay() {
  return (
    <Section id="gameplay" className="ledger-lines">
      <SectionHeading eyebrow="Gameplay features" title="The full accounting cycle, played.">
        Every level follows the real FAR1 workflow. Start each one with refresher index cards, then put the concepts to
        work at your Accounting Workstation.
      </SectionHeading>

      <ol className="mt-16 grid gap-10 p-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {coreMechanics.map((m, i) => (
          <li key={m.title} className="pixel-box relative bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex bg-navy p-2.5 text-cream">
                <Icon name={m.icon} strokeWidth={2.25} />
              </span>
              <span className="font-pixel text-xl text-wood-200">{m.step}</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold leading-snug">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.body}</p>
            {i < coreMechanics.length - 1 && (
              <span className="absolute -right-6 top-1/2 z-10 hidden -translate-y-1/2 lg:block" aria-hidden="true">
                <PixelSprite name="arrow" scale={3} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-16 grid gap-10 p-1 lg:grid-cols-[1.4fr_1fr]">
        <div className="pixel-box bg-white p-6 sm:p-8">
          <h3 className="flex items-center gap-3 text-2xl font-semibold">
            <Coin className="h-7 w-7" /> Earn ranks, coins &amp; cosmetics
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Finish a level and get ranked on your accuracy. Points can be spent on cosmetics for your character and
            room &mdash; some only unlock in later stages.
          </p>
          <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
            {ranks.map((r) => (
              <div
                key={r.rank}
                className={`flex flex-col items-center p-2 text-center sm:p-3 ${r.rank === 'S' ? 'bg-gold' : 'bg-navy-950'}`}
              >
                <p className={`font-pixel text-2xl sm:text-2xl ${r.rank === 'S' ? 'text-navy-950' : 'text-cream'}`}>{r.rank}</p>
                <p className={`mt-2 text-[10px] leading-tight sm:text-xs ${r.rank === 'S' ? 'text-navy-900' : 'text-navy-200'}`}>
                  {r.mistakes}
                </p>
                <p className={`mt-2 font-pixel text-[11px] sm:text-[13px] ${r.rank === 'S' ? 'text-navy-950' : 'text-gold'}`}>
                  {r.points} pts
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pixel-box px-dark bg-navy p-6 text-white sm:p-8">
          <h3 className="text-2xl font-semibold text-cream">Stage multipliers</h3>
          <p className="mt-2 text-sm text-navy-100">Difficulty climbs with every stage &mdash; and so do your rewards.</p>
          <ul className="mt-6 space-y-4">
            {multipliers.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                <span className="w-14 font-pixel text-[12px] uppercase text-navy-100">Stg {i + 1}</span>
                <span className="flex flex-1 gap-1" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, n) => (
                    <span key={n} className={`h-3 flex-1 ${n < (i + 1) * 2 ? 'bg-gold' : 'bg-navy-950'}`} />
                  ))}
                </span>
                <span className="w-12 text-right font-pixel text-[13px] text-gold">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
