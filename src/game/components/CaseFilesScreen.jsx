import { useMemo, useState } from 'react';
import { cases } from '../data/cases.js';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import CaseCard from './CaseCard.jsx';
import PanelHeader from './PanelHeader.jsx';
import Icon from './Icons.jsx';

const FILTERS = [
  { id: 'all', label: 'All Cases' },
  { id: 'finished', label: 'Finished' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'unopened', label: 'Unopened' },
];

export default function CaseFilesScreen() {
  const { progressOf } = useGame();
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
                className={`pixel-btn shrink-0 ${active ? 'bg-crimson-700 text-cream' : 'bg-white text-navy-900 hover:bg-ember-100'}`}
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
          <div className="pixel-box-flat flex h-48 flex-col items-center justify-center gap-3 bg-white text-center font-pixel text-[10px] uppercase leading-relaxed text-slate-500">
            <Icon name="search" className="h-8 w-8" strokeWidth={2.25} />
            No cases match &ldquo;{query || FILTERS.find((f) => f.id === filter).label}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
