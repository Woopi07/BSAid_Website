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
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1" role="group" aria-label="Filter cases">
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
                className={`shrink-0 rounded-full px-5 py-2.5 font-rounded text-[15px] font-extrabold shadow-sm transition ${
                  active ? 'bg-ep-green text-white' : 'bg-white text-ep-ink ring-1 ring-ep-line hover:bg-ep-sand'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full lg:w-80">
          <span className="sr-only">Search cases</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ep-ink" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case, business, or type"
            className="w-full rounded-full border-0 bg-white py-2.5 pl-11 pr-4 font-rounded text-[15px] font-semibold text-ep-ink shadow-sm ring-1 ring-ep-line placeholder:text-slate-500 focus:ring-2 focus:ring-ep-green"
          />
        </label>
      </div>

      <div className="no-scrollbar -mx-2 min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {visible.length ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {visible.map((c) => (
              <li key={c.id}>
                <CaseCard item={c} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ep-line text-center font-rounded font-bold text-slate-500">
            <Icon name="search" className="mb-2 h-8 w-8" />
            No cases match &ldquo;{query || FILTERS.find((f) => f.id === filter).label}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
