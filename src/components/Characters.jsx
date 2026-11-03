import { useState } from 'react';
import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import Avatar from '../game/components/Avatar.jsx';
import { characters, branches } from '../data/content.js';

// Pixel portraits of the case owners, the same ones they have in the Entry Point game.
function Portrait({ character }) {
  return (
    <div className="relative">
      <span className="pixel-box px-dark block bg-cream">
        <Avatar look={character.avatar} round={false} alt="" className="block h-44 w-44 sm:h-52 sm:w-52" />
      </span>
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-navy-950 px-3 py-2 font-pixel text-[12px] uppercase text-gold">
        {character.topic}
      </span>
    </div>
  );
}

export default function Characters() {
  const [activeId, setActiveId] = useState(characters[0].id);
  const active = characters.find((c) => c.id === activeId);

  return (
    <Section id="story" className="bg-cream">
      <SectionHeading eyebrow="Characters & story" title="Every case has an owner. Every owner has a story.">
        Meet the business owners whose books you&rsquo;ll fix. Each one runs a real kind of Filipino business, faces a
        different accounting mess, and needs your help to set it straight.
      </SectionHeading>

      <div className="mt-14">
        <p className="text-center font-pixel text-[13px] uppercase tracking-widest text-navy">Select character</p>
        <div role="tablist" aria-label="Characters" className="mx-auto mt-5 grid max-w-lg grid-cols-3 gap-4">
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
                className={`pixel-btn px-2 ${selected ? 'bg-forest text-white' : 'bg-white text-navy-900 hover:bg-wood-100'}`}
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
            <p className="font-pixel text-[13px] uppercase tracking-widest text-wood-600">{active.role}</p>
            <h3 className="mt-3 text-4xl font-bold sm:text-5xl">{active.name}</h3>
            <p className="mt-1 text-lg font-medium text-slate-500">{active.tagline}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-navy">
              <span>{active.business}</span>
              <span className="text-forest-700">{active.caseFile}</span>
            </p>
            <p className="mt-5 leading-relaxed text-slate-700">{active.bio}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {active.traits.map((trait) => (
                <li key={trait} className="bg-wood-100 px-2.5 py-1.5 font-pixel text-[12px] uppercase text-wood-800">
                  {trait}
                </li>
              ))}
            </ul>
            <blockquote className="pixel-box-flat px-navy mt-7 bg-navy-950 p-4 text-cream">
              <span className="font-pixel text-[12px] uppercase text-gold">Their story &rsaquo; </span>
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
