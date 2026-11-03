import { useMemo, useState } from 'react';
import { cases } from '../data/cases.js';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import CaseCard from './CaseCard.jsx';
import PanelHeader from './PanelHeader.jsx';
import Icon from './Icons.jsx';
import { SPECIAL_CASES } from '../data/special.js';

const FILTERS = [
  { id: 'all', label: 'All Cases' },
  { id: 'finished', label: 'Finished' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'unopened', label: 'Unopened' },
];

export default function CaseFilesScreen() {
  const { progressOf, state, dispatch } = useGame();
  const { play } = useAudio();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      const status = progressOf(c).status;
      const matchesFilter =
        filter === 'all' || status === filter || (filter === 'unopened' && status === 'locked');
      const haystack = `${c.name} ${c.category} ${c.shortType} case #${c.id} ${c.owner ?? ''}`.toLowerCase();
      return matchesFilter && (!q || haystack.includes(q));
    });
  }, [filter, query, progressOf]);

  return (
    <div className="flex h-full flex-col gap-5">
      <PanelHeader icon="briefcase" title="Case Files" subtitle="Select a case to start your accounting adventure!" />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="pixel-scroll flex gap-5 overflow-x-auto px-2 py-2" role="group" aria-label="Filter cases">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  play('click');
                  setFilter(f.id);
                }}
                className={`pixel-btn shrink-0 ${active ? 'bg-forest-700 text-cream' : 'bg-white text-navy-900 hover:bg-wood-100'}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <label className="relative mx-1 block lg:w-80">
          <span className="sr-only">Search cases</span>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-900" strokeWidth={2.5} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case, business, or type"
            className="pixel-box-flat w-full rounded-none border-0 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 placeholder:text-slate-500"
          />
        </label>
      </div>

      <div className="pixel-scroll -mx-2 min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-6">
        {visible.length ? (
          <ul className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visible.map((c) => (
              <li key={c.id}>
                <CaseCard item={c} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="pixel-box-flat flex h-48 flex-col items-center justify-center gap-3 bg-white text-center font-pixel text-[13px] uppercase leading-relaxed text-slate-500">
            <Icon name="search" className="h-8 w-8" strokeWidth={2.25} />
            No cases match &ldquo;{query || FILTERS.find((f) => f.id === filter).label}&rdquo;.
          </div>
        )}

        {/* Special cases: detective investigations with Detective Alex Reyes */}
        <section className="mt-12" aria-labelledby="special-title">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="special-title" className="flex items-center gap-2 text-2xl font-bold text-navy-900">
              <Icon name="search" className="h-6 w-6 text-wood-600" strokeWidth={2.5} /> Special Cases
            </h2>
            <p className="font-pixel text-[12px] uppercase text-wood-600">Detective investigations · 3 levels each</p>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-x-7 gap-y-8 lg:grid-cols-2">
            {SPECIAL_CASES.map((sc) => {
              const sp = state.progress._special?.[sc.id];
              const cleared = Object.keys(sp?.levels ?? {}).length;
              return (
                <li key={sc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      play('pop');
                      dispatch({ type: 'OPEN_SPECIAL', id: sc.id });
                    }}
                    className="pixel-box px-dark group relative flex h-full w-full flex-col overflow-hidden bg-navy-950 p-5 text-left transition-transform hover:-translate-y-1"
                  >
                    <span className="sp-confidential absolute -right-2 top-4 border-4 border-rose-500/60 px-2 py-0.5 font-heading text-sm font-extrabold uppercase tracking-widest text-rose-400/80">
                      {sp?.solved ? 'Solved' : 'Confidential'}
                    </span>
                    <span className="font-pixel text-[11px] uppercase tracking-widest text-gold">
                      Special Case {sc.number} {sc.wip && '· WIP'}
                    </span>
                    <span className="mt-2 pr-24 font-heading text-xl font-bold leading-tight text-white sm:text-2xl">{sc.title}</span>
                    <span className="mt-1 text-sm text-navy-200">{sc.company}</span>
                    <span className="mt-3 text-sm text-navy-100">{sc.tagline}</span>
                    <span className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <span className="flex gap-1.5" aria-label={`${cleared} of ${sc.levels.length} levels cleared`}>
                        {sc.levels.map((l) => (
                          <span key={l.id} className={`h-2.5 w-8 ${sp?.levels?.[l.id] ? 'bg-forest' : 'bg-navy-700'}`} />
                        ))}
                      </span>
                      <span className="font-pixel text-[12px] uppercase text-gold group-hover:text-white">
                        {sp?.solved ? 'Review case' : cleared ? 'Continue' : 'Open file'} ›
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
