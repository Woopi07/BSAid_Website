import { useState } from 'react';
import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { caseFiles } from '../data/content.js';

function Difficulty({ level }) {
  return (
    <span className="flex gap-1" aria-label={`Difficulty ${level} of 4`}>
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className={`h-1.5 w-4 rounded-full ${n <= level ? 'bg-gold' : 'bg-navy-100'}`} />
      ))}
    </span>
  );
}

export default function CaseFiles() {
  const [activeId, setActiveId] = useState(caseFiles[0].id);
  const active = caseFiles.find((c) => c.id === activeId);

  return (
    <Section id="case-files" className="bg-white">
      <SectionHeading eyebrow="Case files" title="Open a case. Balance the books.">
        Four progressive businesses, each covering a core FAR1 topic. Every case is available right away, but tackling
        them in order is recommended &mdash; levels inside each case unlock as you clear the one before.
      </SectionHeading>

      <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {caseFiles.map((c) => {
          const selected = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActiveId(c.id)}
                aria-pressed={selected}
                aria-controls="case-detail"
                className={`group relative flex h-full w-full flex-col rounded-2xl p-5 pt-7 text-left transition ${
                  selected
                    ? 'bg-navy text-white shadow-xl ring-2 ring-gold'
                    : 'bg-paper text-navy-900 ring-1 ring-navy-900/10 hover:-translate-y-1 hover:shadow-card'
                }`}
              >
                {/* Folder tab */}
                <span
                  className={`absolute -top-3 left-5 rounded-t-lg px-3 pb-1 pt-1.5 font-heading text-xs font-bold tracking-wide ${
                    selected ? 'bg-gold text-navy-900' : 'bg-navy-100 text-navy'
                  }`}
                >
                  CASE #{c.id}
                </span>
                <span className={`inline-flex w-fit rounded-xl p-2.5 ${selected ? 'bg-white/10 text-gold' : 'bg-white text-navy'}`}>
                  <Icon name={c.icon} />
                </span>
                <span className={`mt-4 font-heading text-lg font-semibold ${selected ? 'text-white' : 'text-navy-900'}`}>
                  {c.name}
                </span>
                <span className={`mt-1 text-sm ${selected ? 'text-navy-100' : 'text-slate-600'}`}>{c.topic}</span>
                <span className="mt-auto pt-4">
                  <Difficulty level={c.difficulty} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        id="case-detail"
        aria-live="polite"
        className="mt-8 grid gap-6 rounded-3xl bg-paper p-6 ring-1 ring-navy-900/5 sm:p-8 lg:grid-cols-[1.5fr_1fr]"
      >
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-gold-700">
            Case #{active.id} &middot; {active.topic}
          </p>
          <h3 className="mt-2 text-2xl font-bold">{active.name}</h3>
          <ol className="mt-5 space-y-3">
            {active.levels.map((lvl, i) => (
              <li key={lvl} className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-navy-900/5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy font-heading text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="self-center text-sm text-slate-700">{lvl}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="flex flex-col rounded-2xl bg-gradient-to-br from-gold-50 to-white p-6 ring-1 ring-gold-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-700">Special case</p>
          <h4 className="mt-2 text-xl font-bold">{active.special.name}</h4>
          <ul className="mt-4 space-y-3">
            {active.special.levels.map((lvl, i) => (
              <li key={lvl} className="flex gap-3 text-sm text-slate-700">
                <Icon name={i === 0 ? 'journal' : 'lock'} className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                {lvl}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-6 text-xs text-slate-500">
            Each level is scored on how many questions you answer correctly.
          </p>
        </aside>
      </div>
    </Section>
  );
}
