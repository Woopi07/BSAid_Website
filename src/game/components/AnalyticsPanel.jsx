import { cases } from '../data/cases.js';
import { useGame } from '../context/GameProvider.jsx';
import PanelHeader from './PanelHeader.jsx';

export default function AnalyticsPanel() {
  const { progressOf } = useGame();

  return (
    <div className="no-scrollbar flex h-full flex-col gap-5 overflow-y-auto pb-4">
      <PanelHeader icon="chart" title="Analytics" subtitle="Track your rank and progress for every case." />
      <div className="overflow-x-auto rounded-2xl bg-ep-paper shadow-md ring-1 ring-ep-line">
        <table className="w-full min-w-[560px] font-rounded text-sm">
          <thead>
            <tr className="bg-ep-sand text-left text-xs font-extrabold uppercase tracking-wide text-slate-600">
              <th className="px-5 py-3">Case</th>
              {[1, 2, 3, 4].map((n) => (
                <th key={n} className="px-3 py-3 text-center">Lv {n}</th>
              ))}
              <th className="px-5 py-3 text-right">Progress</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const p = progressOf(c);
              return (
                <tr key={c.id} className="border-t border-ep-line">
                  <th scope="row" className="px-5 py-3 text-left font-extrabold text-ep-ink">
                    {c.name}
                    <span className="block text-xs font-semibold text-slate-500">CASE #{c.id}</span>
                  </th>
                  {c.levels.map((l) => {
                    const r = p.levels[l.id];
                    return (
                      <td key={l.id} className="px-3 py-3 text-center">
                        {r ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ep-amber font-display text-ep-navy">{r.rank}</span>
                        ) : (
                          <span className="text-slate-400">&mdash;</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3 text-right font-extrabold text-ep-ink">{p.percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="font-rounded text-sm font-semibold text-slate-500">
        Ranks: S = no mistakes (100 pts) &middot; A = 1&ndash;2 (80) &middot; B = 3&ndash;5 (60) &middot; C = 6&ndash;7 (40) &middot; D = 8+ (20)
      </p>
    </div>
  );
}
