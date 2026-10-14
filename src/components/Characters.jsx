import { useState } from 'react';
import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { characters, branches } from '../data/content.js';

const themes = {
  gold: {
    portrait: 'from-gold-300 to-gold-600',
    chip: 'bg-gold-50 text-gold-700 ring-gold-100',
    accent: 'text-gold-700',
  },
  navy: {
    portrait: 'from-navy-400 to-navy-900',
    chip: 'bg-navy-50 text-navy-600 ring-navy-100',
    accent: 'text-navy',
  },
};

// Official character art is still in development (GDD v1), so portraits are stylized monograms.
function Portrait({ character }) {
  return (
    <div
      className={`relative flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br font-heading text-5xl font-bold text-white sm:h-48 sm:w-48 sm:text-6xl ${themes[character.theme].portrait}`}
      aria-hidden="true"
    >
      <span className="drop-shadow">{character.initials}</span>
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-900 shadow-card">
        {character.subject}
      </span>
    </div>
  );
}

export default function Characters() {
  const [activeId, setActiveId] = useState(characters[0].id);
  const active = characters.find((c) => c.id === activeId);
  const t = themes[active.theme];

  return (
    <Section id="story" className="bg-white">
      <SectionHeading eyebrow="Characters & story" title="Different people. Different stories.">
        A branching visual novel about learning accountancy and everything else college throws at you &mdash; friendship,
        family expectations, and the quiet weight of burnout. After the first stage, you choose which storyline to follow.
      </SectionHeading>

      <div className="mt-14">
        <div role="tablist" aria-label="Characters" className="mx-auto flex max-w-md gap-2 rounded-2xl bg-paper p-1.5 ring-1 ring-navy-900/5">
          {characters.map((c) => (
            <button
              key={c.id}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={c.id === activeId}
              aria-controls={`panel-${c.id}`}
              onClick={() => setActiveId(c.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-semibold transition ${
                c.id === activeId ? 'bg-white text-navy-900 shadow-card' : 'text-slate-500 hover:text-navy'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="ledger-lines mt-8 grid items-center gap-10 rounded-3xl bg-paper p-6 ring-1 ring-navy-900/5 sm:p-10 md:grid-cols-[auto_1fr]"
        >
          <div className="flex justify-center">
            <div className="animate-bob">
              <Portrait character={active} />
            </div>
          </div>
          <div>
            <p className={`font-heading text-sm font-semibold uppercase tracking-widest ${t.accent}`}>{active.role}</p>
            <h3 className="mt-2 text-3xl font-bold sm:text-4xl">{active.name}</h3>
            <p className="mt-1 text-lg font-medium text-slate-500">{active.tagline}</p>
            <p className="mt-5 leading-relaxed text-slate-700">{active.bio}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {active.traits.map((trait) => (
                <li key={trait} className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${t.chip}`}>
                  {trait}
                </li>
              ))}
            </ul>
            <blockquote className="mt-6 border-l-4 border-gold pl-4 italic text-navy-800">{active.hook}</blockquote>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Icon name="branch" className="h-5 w-5 text-gold-600" /> Branching storylines
        </h3>
        <p className="mt-2 max-w-2xl text-slate-600">
          You play a freshman who joined Accountancy because a childhood friend begged you to. Along the way, other
          students&rsquo; stories unfold &mdash; each with its own cast and struggles.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {branches.map((b) => (
            <article key={b.title} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy">{b.label}</span>
                <span className="text-xs font-medium text-slate-500">{b.cast}</span>
              </div>
              <h4 className="mt-4 text-lg font-semibold">{b.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.themes.map((theme) => (
                  <li key={theme} className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-medium text-gold-700">
                    {theme}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
