import { cases } from '../data/cases.js';
import { useGame } from '../context/GameProvider.jsx';
import PanelHeader from './PanelHeader.jsx';

const SEGMENTS = 8;

export default function AnalyticsPanel() {
  const { progressOf } = useGame();

  return (
    <div className="pixel-scroll flex h-full flex-col gap-8 overflow-y-auto p-1 pb-6">
      <PanelHeader icon="chart" title="Analytics" subtitle="Track your rank and progress for every case." />
      <div className="pixel-box overflow-x-auto bg-white">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="bg-navy-900 text-left font-pixel text-[12px] uppercase text-cream">
              <th className="px-5 py-4">Case</th>
              {[1, 2, 3, 4].map((n) => (
                <th key={n} className="px-3 py-4 text-center">
                  Lv{n}
                </th>
              ))}
              <th className="px-5 py-4 text-right">Progress</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const p = progressOf(c);
              const filled = Math.round((p.percent / 100) * SEGMENTS);
              return (
                <tr key={c.id} className="border-t-4 border-cream">
                  <th scope="row" className="px-5 py-3 text-left">
                    <span className="block font-heading text-lg font-semibold text-navy-900">{c.name}</span>
                    <span className="block font-pixel text-[11px] text-slate-500">CASE #{c.id}</span>
                  </th>
                  {c.levels.map((l) => {
                    const r = p.levels[l.id];
                    return (
                      <td key={l.id} className="px-3 py-3 text-center">
                        {r ? (
                          <span className={`inline-flex h-9 w-9 items-center justify-center font-pixel text-sm ${r.rank === 'S' ? 'bg-gold text-navy-950' : 'bg-navy-950 text-cream'}`}>
                            {r.rank}
                          </span>
                        ) : (
                          <span className="font-pixel text-[13px] text-slate-300">--</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3">
                    <span className="flex items-center justify-end gap-2">
                      <span className="flex gap-0.5" aria-hidden="true">
                        {Array.from({ length: SEGMENTS }, (_, i) => (
                          <span key={i} className={`h-3 w-2.5 ${i < filled ? 'bg-emerald-500' : 'bg-wood-100'}`} />
                        ))}
                      </span>
                      <span className="w-10 text-right font-pixel text-[12px] text-navy-900">{p.percent}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[
          ['S', '0 mistakes', 100],
          ['A', '1–2', 80],
          ['B', '3–5', 60],
          ['C', '6–7', 40],
          ['D', '8+', 20],
        ].map(([rank, m, pts]) => (
          <div key={rank} className={`flex flex-col items-center p-2 text-center sm:p-3 ${rank === 'S' ? 'bg-gold' : 'bg-navy-950'}`}>
            <span className={`font-pixel text-xl ${rank === 'S' ? 'text-navy-950' : 'text-cream'}`}>{rank}</span>
            <span className={`mt-2 text-[10px] sm:text-xs ${rank === 'S' ? 'text-navy-900' : 'text-navy-200'}`}>{m}</span>
            <span className={`mt-1 font-pixel text-[11px] ${rank === 'S' ? 'text-navy-950' : 'text-gold'}`}>{pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
