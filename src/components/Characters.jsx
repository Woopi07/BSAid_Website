import { useState } from 'react';
import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import { characters, branches } from '../data/content.js';

const themes = {
  gold: {
    portrait: 'from-gold-300 via-wood to-forest',
    accent: 'text-wood-600',
    chip: 'bg-wood-100 text-wood-800',
  },
  navy: {
    portrait: 'from-navy-400 via-navy to-navy-950',
    accent: 'text-navy',
    chip: 'bg-navy-50 text-navy',
  },
};

// Official character art is still in development (GDD v1), so portraits are pixel-framed monograms.
function Portrait({ character }) {
  return (
    <div className="relative">
      <div
        className={`pixel-box px-dark flex h-44 w-44 items-center justify-center bg-gradient-to-b font-heading text-6xl font-bold text-cream sm:h-52 sm:w-52 sm:text-7xl ${themes[character.theme].portrait}`}
        aria-hidden="true"
      >
        <span className="pixel-text-shadow">{character.initials}</span>
      </div>
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-navy-950 px-3 py-2 font-pixel text-[12px] uppercase text-gold">
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
    <Section id="story" className="bg-cream">
      <SectionHeading eyebrow="Characters & story" title="Different people. Different stories.">
        A branching visual novel about learning accountancy and everything else college throws at you &mdash; friendship,
        family expectations, and the quiet weight of burnout. After the first stage, you choose which storyline to follow.
      </SectionHeading>

      <div className="mt-14">
        <p className="text-center font-pixel text-[13px] uppercase tracking-widest text-navy">Select character</p>
        <div role="tablist" aria-label="Characters" className="mx-auto mt-5 flex max-w-sm gap-5">
          {characters.map((c) => {
            const selected = c.id === activeId;
            return (
              <button
                key={c.id}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                onClick={() => setActiveId(c.id)}
                className={`pixel-btn flex-1 ${selected ? 'bg-forest-700 text-cream' : 'bg-white text-navy-900 hover:bg-wood-100'}`}
              >
                {selected && <PixelSprite name="arrow" scale={2} />}
                {c.name}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="pixel-box mt-10 grid items-center gap-12 bg-white p-6 sm:p-10 md:grid-cols-[auto_1fr]"
        >
          <div className="flex justify-center pb-4">
            <div className="animate-bob">
              <Portrait character={active} />
            </div>
          </div>
          <div>
            <p className={`font-pixel text-[13px] uppercase tracking-widest ${t.accent}`}>{active.role}</p>
            <h3 className="mt-3 text-4xl font-bold sm:text-5xl">{active.name}</h3>
            <p className="mt-1 text-lg font-medium text-slate-500">{active.tagline}</p>
            <p className="mt-5 leading-relaxed text-slate-700">{active.bio}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {active.traits.map((trait) => (
                <li key={trait} className={`px-2.5 py-1.5 font-pixel text-[12px] uppercase ${t.chip}`}>
                  {trait}
                </li>
              ))}
            </ul>
            <blockquote className="pixel-box-flat px-navy mt-7 bg-navy-950 p-4 text-cream">
              <span className="font-pixel text-[12px] uppercase text-gold">Story &rsaquo; </span>
              {active.hook}
            </blockquote>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon name="branch" className="h-6 w-6 text-wood-600" strokeWidth={2.25} /> Branching storylines
        </h3>
        <p className="mt-2 max-w-2xl text-slate-600">
          You play a freshman who joined Accountancy because a childhood friend begged you to. Along the way, other
          students&rsquo; stories unfold &mdash; each with its own cast and struggles.
        </p>
        <div className="mt-8 grid gap-10 p-1 md:grid-cols-2">
          {branches.map((b) => (
            <article key={b.title} className="pixel-box bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="bg-navy px-2 py-1.5 font-pixel text-[12px] uppercase text-cream">{b.label}</span>
                <span className="text-xs font-medium text-slate-500">{b.cast}</span>
              </div>
              <h4 className="mt-4 text-2xl font-semibold">{b.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.themes.map((theme) => (
                  <li key={theme} className="bg-wood-100 px-2.5 py-1 text-xs font-semibold text-wood-800">
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
