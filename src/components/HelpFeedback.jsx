import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { helpFeatures } from '../data/content.js';

export default function HelpFeedback() {
  return (
    <Section id="help" className="scanlines relative overflow-hidden bg-navy-950">
      <div className="pixel-dots absolute inset-0" aria-hidden="true" />
      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Help & feedback" title="Mistakes are part of the lesson." align="left" dark>
            When you get an entry wrong, BSAid shows your answer next to the correct solution &mdash; along with an
            explanation of the accounting principle involved. No guessing, no dead ends.
          </SectionHeading>

          {/* Mock of the in-game feedback panel */}
          <div className="pixel-box px-dark mt-10 max-w-md bg-cream p-5">
            <p className="font-pixel text-[9px] uppercase tracking-wide text-navy">Feedback</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="pixel-box-flat bg-rose-50 p-3 [--px:#E11D48]">
                <p className="font-pixel text-[8px] uppercase text-rose-700">Your answer</p>
                <p className="mt-2 text-rose-900">Dr Sales</p>
                <p className="pl-3 text-rose-900">Cr Cash</p>
              </div>
              <div className="pixel-box-flat bg-emerald-50 p-3 [--px:#059669]">
                <p className="font-pixel text-[8px] uppercase text-emerald-700">Correct</p>
                <p className="mt-2 text-emerald-900">Dr Cash</p>
                <p className="pl-3 text-emerald-900">Cr Sales</p>
              </div>
            </div>
            <p className="mt-5 flex gap-2 bg-gold-100 p-3 text-sm text-navy-900">
              <Icon name="hint" className="h-5 w-5 shrink-0 text-gold-700" strokeWidth={2.25} />
              Revenue has a normal credit balance. Cash coming in is an increase in assets, so it&rsquo;s debited.
            </p>
          </div>
        </div>

        <ul className="grid gap-8 p-1 sm:grid-cols-2">
          {helpFeatures.map((f, i) => (
            <li
              key={f.title}
              className={`pixel-box-flat px-navy bg-navy-900 p-6 ${i === helpFeatures.length - 1 ? 'sm:col-span-2' : ''}`}
            >
              <span className="inline-flex bg-gold p-2.5 text-navy-950">
                <Icon name={f.icon} strokeWidth={2.25} />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-cream">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-100">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
