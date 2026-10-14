import Button from './ui/Button.jsx';
import JournalDemo from './JournalDemo.jsx';
import { ANDROID_DOWNLOAD_URL, genres } from '../data/content.js';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Decorative ledger grid + glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-navy-400/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300 ring-1 ring-inset ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> For first-year BSA students
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Every transaction tells a story.{' '}
            <span className="text-gold">Will you make the right entry?</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
            Master Financial Accounting and Reporting 1 (FAR1) through an interactive visual novel &mdash; journalize,
            post, and balance your way through college life, one case file at a time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={ANDROID_DOWNLOAD_URL} icon="android" className="text-lg">
              Download for Android
            </Button>
            <Button href="#gameplay" variant="secondary">
              See how it plays
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Genres">
            {genres.map((g) => (
              <li key={g} className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-navy-100 ring-1 ring-inset ring-white/10">
                {g}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center lg:items-end">
          <JournalDemo />
          <p className="mt-4 text-center text-sm text-navy-200 lg:text-right">
            Try it &mdash; a playable taste of Case #01.
          </p>
        </div>
      </div>
    </section>
  );
}
