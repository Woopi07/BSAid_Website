import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { designGoals, locations } from '../data/content.js';

export default function About() {
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="About the game" title="Accountancy, minus the intimidation." align="left">
            BSAid was born from the experiences of Accountancy students who once stood exactly where today&rsquo;s
            freshmen are. It transforms fundamental accounting topics into engaging challenges, quests, and mini-games
            &mdash; a supplementary learning tool that makes FAR1 accessible, enjoyable, and far less daunting.
          </SectionHeading>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {designGoals.map((goal, i) => (
            <li key={goal.title} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/5">
              <span className="font-heading text-sm font-bold text-gold-600">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{goal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{goal.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 overflow-hidden rounded-3xl bg-navy text-white">
        <div className="grid lg:grid-cols-[1fr_1.6fr]">
          <div className="relative p-8 sm:p-10">
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-gold">The setting</p>
            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">A campus that feels like yours.</h3>
            <p className="mt-4 leading-relaxed text-navy-100">
              Step into a modern university inspired by <strong className="text-white">Pamantasan ng Lungsod ng Valenzuela (PLV)</strong>.
              Explore familiar academic spaces where learning is woven naturally into quests, classroom interactions,
              and simulations &mdash; and watch the campus evolve as you grow.
            </p>
          </div>
          <ul className="grid gap-px bg-navy-800 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <li key={loc.name} className="bg-navy p-6 transition hover:bg-navy-600">
                <span className="inline-flex rounded-xl bg-white/10 p-2.5 text-gold">
                  <Icon name={loc.icon} />
                </span>
                <h4 className="mt-4 font-semibold text-white">{loc.name}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-100">{loc.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
