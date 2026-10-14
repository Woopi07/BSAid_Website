import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import Coin from './ui/Coin.jsx';
import { coreMechanics, ranks, multipliers } from '../data/content.js';

export default function Gameplay() {
  return (
    <Section id="gameplay">
      <SectionHeading eyebrow="Gameplay features" title="The full accounting cycle, played.">
        Every level follows the real FAR1 workflow. Start each one with refresher index cards, then put the concepts to
        work at your Accounting Workstation.
      </SectionHeading>

      <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {coreMechanics.map((m, i) => (
          <li key={m.title} className="relative rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/5">
            <div className="flex items-center justify-between">
              <span className="inline-flex rounded-xl bg-navy p-2.5 text-white">
                <Icon name={m.icon} />
              </span>
              <span className="font-heading text-3xl font-bold text-navy-100">{m.step}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.body}</p>
            {i < coreMechanics.length - 1 && (
              <Icon
                name="arrow"
                className="absolute -right-4 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-gold p-1 text-navy-900 lg:block"
                strokeWidth={2.5}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/5 sm:p-8">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Coin className="h-6 w-6" /> Earn ranks, coins &amp; cosmetics
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Finish a level and get ranked on your accuracy. Points can be spent on cosmetics for your character and
            room &mdash; some only unlock in later stages.
          </p>
          <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
            {ranks.map((r) => (
              <div key={r.rank} className="rounded-xl bg-paper p-2 text-center ring-1 ring-navy-900/5 sm:p-3">
                <p className={`font-heading text-2xl font-extrabold sm:text-3xl ${r.rank === 'S' ? 'text-gold-600' : 'text-navy'}`}>
                  {r.rank}
                </p>
                <p className="mt-1 text-[11px] leading-tight text-slate-500 sm:text-xs">{r.mistakes}</p>
                <p className="mt-2 text-xs font-semibold text-navy-900 sm:text-sm">{r.points} pts</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-navy p-6 text-white sm:p-8">
          <h3 className="text-xl font-semibold text-white">Stage multipliers</h3>
          <p className="mt-2 text-sm text-navy-100">Difficulty climbs with every stage &mdash; and so do your rewards.</p>
          <ul className="mt-6 space-y-3">
            {multipliers.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                <span className="w-16 text-sm text-navy-100">Stage {i + 1}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gold" style={{ width: `${(i + 1) * 25}%` }} />
                </span>
                <span className="w-10 text-right font-heading font-semibold text-gold">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
