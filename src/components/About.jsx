import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { designGoals, locations } from '../data/content.js';

export default function About() {
  return (
    <Section id="about" className="ledger-lines">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <SectionHeading eyebrow="About the game" title="Accountancy, minus the intimidation." align="left">
          BSAid was born from the experiences of Accountancy students who once stood exactly where today&rsquo;s
          freshmen are. It transforms fundamental accounting topics into engaging challenges, quests, and mini-games
          &mdash; a supplementary learning tool that makes FAR1 accessible, enjoyable, and far less daunting.
        </SectionHeading>

        <ul className="grid gap-8 p-1 sm:grid-cols-2">
          {designGoals.map((goal, i) => (
            <li key={goal.title} className="pixel-box bg-white p-5">
              <span className="inline-block bg-ember px-2 py-1 font-pixel text-[9px] text-navy-950">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold leading-snug">{goal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{goal.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="pixel-box px-dark relative mt-24 overflow-hidden bg-navy text-white">
        <div className="pixel-dots absolute inset-0" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-[1fr_1.6fr]">
          <div className="p-8 sm:p-10">
            <p className="font-pixel text-[10px] uppercase tracking-widest text-gold">The setting</p>
            <h3 className="mt-4 text-3xl font-bold text-cream pixel-text-shadow sm:text-4xl">A campus that feels like yours.</h3>
            <p className="mt-4 leading-relaxed text-navy-100">
              Step into a modern university inspired by{' '}
              <strong className="text-cream">Pamantasan ng Lungsod ng Valenzuela (PLV)</strong>. Explore familiar
              academic spaces where learning is woven into quests, classroom interactions, and simulations &mdash; and
              watch the campus evolve as you grow.
            </p>
          </div>
          <ul className="grid gap-1 bg-navy-950 p-1 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <li key={loc.name} className="bg-navy-800 p-6 transition-colors hover:bg-crimson-700">
                <span className="inline-flex bg-gold p-2 text-navy-950">
                  <Icon name={loc.icon} strokeWidth={2.25} />
                </span>
                <h4 className="mt-4 text-lg font-semibold text-cream">{loc.name}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-100">{loc.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
