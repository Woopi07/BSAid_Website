import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { helpFeatures } from '../data/content.js';

export default function HelpFeedback() {
  return (
    <Section id="help" className="bg-navy-900">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Help & feedback system" title="Mistakes are part of the lesson." align="left" dark>
            When you get an entry wrong, BSAid shows your answer next to the correct solution &mdash; along with an
            explanation of the accounting principle involved. No guessing, no dead ends.
          </SectionHeading>

          {/* Mock of the in-game feedback panel */}
          <div className="mt-8 max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">Feedback</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-rose-50 p-3 ring-1 ring-rose-200">
                <p className="text-xs font-semibold text-rose-700">Your answer</p>
                <p className="mt-1 text-rose-900">Dr Sales</p>
                <p className="text-rose-900">&nbsp;&nbsp;Cr Cash</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-200">
                <p className="text-xs font-semibold text-emerald-700">Correct solution</p>
                <p className="mt-1 text-emerald-900">Dr Cash</p>
                <p className="text-emerald-900">&nbsp;&nbsp;Cr Sales</p>
              </div>
            </div>
            <p className="mt-3 flex gap-2 rounded-lg bg-navy-50 p-3 text-sm text-navy-800">
              <Icon name="hint" className="h-5 w-5 shrink-0 text-gold-600" />
              Revenue has a normal credit balance. Cash coming in is an increase in assets, so it&rsquo;s debited.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {helpFeatures.map((f, i) => (
            <li
              key={f.title}
              className={`rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 ${
                i === helpFeatures.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="inline-flex rounded-xl bg-gold p-2.5 text-navy-900">
                <Icon name={f.icon} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-100">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
