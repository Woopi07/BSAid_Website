import { useState } from 'react';
import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import { caseFiles } from '../data/content.js';

function Difficulty({ level, selected }) {
  return (
    <span className="flex gap-1" aria-label={`Difficulty ${level} of 4`}>
      {[1, 2, 3, 4].map((n) => (
        <PixelSprite
          key={n}
          name="star"
          scale={2}
          className={n <= level ? '' : selected ? 'opacity-25' : 'opacity-20 grayscale'}
        />
      ))}
    </span>
  );
}

export default function CaseFiles() {
  const [activeId, setActiveId] = useState(caseFiles[0].id);
  const active = caseFiles.find((c) => c.id === activeId);

  return (
    <Section id="case-files" className="bg-cream">
      <SectionHeading eyebrow="Stage select" title="Open a case. Balance the books.">
        Four progressive businesses, each covering a core FAR1 topic. Every case is available right away, but tackling
        them in order is recommended &mdash; levels inside each case unlock as you clear the one before.
      </SectionHeading>

      <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 p-1 lg:grid-cols-4">
        {caseFiles.map((c) => {
          const selected = c.id === activeId;
          return (
            <li key={c.id} className="pt-3">
              <button
                type="button"
                onClick={() => setActiveId(c.id)}
                aria-pressed={selected}
                aria-controls="case-detail"
                className={`pixel-box relative flex h-full w-full flex-col p-4 pt-7 text-left transition-transform sm:p-5 sm:pt-8 ${
                  selected ? 'px-dark -translate-y-1 bg-navy text-cream' : 'bg-white text-navy-900 hover:-translate-y-1'
                }`}
              >
                <span
                  className={`absolute -top-4 left-3 px-2.5 py-2 font-pixel text-[12px] ${
                    selected ? 'bg-gold text-navy-950' : 'bg-navy-950 text-cream'
                  }`}
                >
                  CASE #{c.id}
                </span>
                <span className={`inline-flex w-fit p-2.5 ${selected ? 'bg-crimson-700 text-cream' : 'bg-ember-100 text-ember-800'}`}>
                  <Icon name={c.icon} strokeWidth={2.25} />
                </span>
                <span className={`mt-4 font-heading text-xl font-semibold leading-tight sm:text-2xl ${selected ? 'text-cream' : 'text-navy-900'}`}>
                  {c.name}
                </span>
                <span className={`mt-1 text-sm ${selected ? 'text-navy-100' : 'text-slate-600'}`}>{c.topic}</span>
                <span className="mt-auto pt-4">
                  <Difficulty level={c.difficulty} selected={selected} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        id="case-detail"
        aria-live="polite"
        className="pixel-box mt-12 grid gap-8 bg-white p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr]"
      >
        <div>
          <p className="font-pixel text-[13px] uppercase leading-relaxed tracking-widest text-ember-600">
            Case #{active.id} &middot; {active.topic}
          </p>
          <h3 className="mt-3 text-3xl font-bold">{active.name}</h3>
          <ol className="mt-6 space-y-4">
            {active.levels.map((lvl, i) => (
              <li key={lvl} className="pixel-box-flat flex gap-4 bg-paper p-4">
                <span className="flex h-9 w-12 shrink-0 items-center justify-center bg-navy font-pixel text-[12px] text-cream">
                  LV{i + 1}
                </span>
                <span className="self-center text-sm text-slate-700">{lvl}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="pixel-box-flat px-ember flex flex-col bg-gradient-to-b from-ember-100 to-cream p-6">
          <p className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-widest text-ember-800">
            <PixelSprite name="bolt" scale={2} /> Special case
          </p>
          <h4 className="mt-3 text-2xl font-bold">{active.special.name}</h4>
          <ul className="mt-4 space-y-3">
            {active.special.levels.map((lvl, i) => (
              <li key={lvl} className="flex gap-3 text-sm text-slate-700">
                <Icon name={i === 0 ? 'journal' : 'lock'} className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" strokeWidth={2.25} />
                {lvl}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-6 text-xs text-slate-500">Each level is scored on how many questions you answer correctly.</p>
        </aside>
      </div>
    </Section>
  );
}
