import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { BADGES, useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import { achievements, careerOf, CAREER, dailyGoals, statsOf } from '../data/achievements.js';
import PanelHeader from './PanelHeader.jsx';
import Icon from './Icons.jsx';
import { CertificateCanvas } from './Certificate.jsx';
import { cases } from '../data/cases.js';
import { caseReport } from '../data/certificates.js';

const MEDAL = ['bg-[#C2763A]', 'bg-slate-300', 'bg-gold'];

function Bar({ value, target, tone = 'bg-emerald-500', track = 'bg-navy-100' }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <span className={`block h-3 w-full ${track}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={target}>
      <span className={`block h-full ${tone}`} style={{ width: `${pct}%` }} />
    </span>
  );
}

function ClaimButton({ id, reward }) {
  const { dispatch } = useGame();
  const { play } = useAudio();
  return (
    <button
      type="button"
      onClick={() => {
        play('unlock');
        dispatch({ type: 'CLAIM', id });
      }}
      className="pixel-btn h-9 shrink-0 gap-1.5 bg-gold px-3 text-navy-950 hover:bg-gold-300"
    >
      Claim <PixelSprite name="coin" scale={2} /> {reward}
    </button>
  );
}

export function DailyGoals({ compact = false }) {
  const { state } = useGame();
  const goals = dailyGoals(state.progress);
  const stats = statsOf(state.progress);
  return (
    <section className="pixel-box flex flex-col bg-white p-5 sm:p-6" aria-labelledby="goals-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="goals-title" className="text-2xl font-bold">Today&rsquo;s goals</h2>
        <p className="font-pixel text-[12px] uppercase text-wood-600">Resets at midnight</p>
      </div>
      <ul className="mt-5 flex flex-col gap-4">
        {goals.map((g) => (
          <li key={g.id} className={`pixel-box-flat flex items-center gap-3 p-3 sm:gap-4 ${g.claimed ? 'px-navy bg-slate-50' : g.done ? 'px-gold bg-gold-50' : 'px-navy bg-white'}`}>
            <span className={`hidden h-9 w-9 shrink-0 items-center justify-center sm:flex ${g.done ? 'bg-emerald-500 text-navy-950' : 'bg-navy-100 text-navy-900'}`}>
              <Icon name={g.done ? 'check' : 'target'} className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block font-semibold ${g.claimed ? 'text-slate-400 line-through' : 'text-navy-900'}`}>{g.label}</span>
              <span className="mt-2 flex items-center gap-3">
                <Bar value={g.value} target={g.target} />
                <span className="shrink-0 text-right font-pixel text-[11px] text-navy-900">
                  {g.value.toLocaleString()}/{g.target.toLocaleString()}
                </span>
              </span>
            </span>
            {g.claimed ? (
              <span className="shrink-0 font-pixel text-[11px] uppercase text-emerald-700">Claimed</span>
            ) : g.done ? (
              <ClaimButton id={g.id} reward={g.reward} />
            ) : (
              <span className="flex shrink-0 items-center gap-1 font-pixel text-[12px] text-slate-500">
                <PixelSprite name="coin" scale={2} className="opacity-60" /> {g.reward}
              </span>
            )}
          </li>
        ))}
      </ul>
      {!compact && (
        <p className="mt-5 flex items-center gap-2 text-sm text-slate-600">
          <PixelSprite name="bolt" scale={2} /> Play streak: <b className="text-navy-900">{stats.streak} day{stats.streak === 1 ? '' : 's'}</b> · best {stats.bestStreak}
        </p>
      )}
    </section>
  );
}

export function CareerCard() {
  const { state } = useGame();
  const career = careerOf(state.progress);
  return (
    <section className="pixel-box px-dark relative overflow-hidden bg-navy-900 p-5 text-cream sm:p-6" aria-labelledby="career-title">
      <div className="pixel-dots absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <p className="font-pixel text-[12px] uppercase tracking-widest text-wood-200">Career rank · {career.level}/{CAREER.length}</p>
        <h2 id="career-title" className="mt-2 text-3xl font-bold leading-tight pixel-text-shadow">{career.title}</h2>
        <div className="mt-5 flex items-center gap-3">
          <PixelSprite name="star" scale={3} />
          <Bar value={career.percent} target={100} tone="bg-gold" track="bg-navy-950" />
          <span className="shrink-0 font-pixel text-[12px] text-gold">{career.stars} ★</span>
        </div>
        <p className="mt-3 text-sm text-navy-100">
          {career.next
            ? `${career.next.stars - career.stars} more star${career.next.stars - career.stars === 1 ? '' : 's'} to become ${career.next.title}.`
            : 'Top of the ladder — every star collected!'}
        </p>
        <ol className="mt-5 flex gap-1.5" aria-label="Career ladder">
          {CAREER.map((r, i) => (
            <li key={r.title} title={`${r.title} · ${r.stars} stars`} className={`h-2.5 flex-1 ${i < career.level ? 'bg-gold' : 'bg-navy-600'}`} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// Every certificate the player has earned (one per finished case), ready to reopen, rename and save.
function CertificateGallery() {
  const { state, certificates, playerName, dispatch } = useGame();
  const { play } = useAudio();
  const earned = cases.filter((c) => certificates[c.id]).length;
  return (
    <section className="pixel-box bg-white p-5 sm:p-6" aria-labelledby="certs-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="certs-title" className="text-2xl font-bold">Certificates</h2>
        <p className="font-pixel text-[12px] uppercase text-wood-600">
          {earned} / {cases.length} earned
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-600">Clear all four levels of a case to earn its certificate. Open one to change the name or save it to your gallery.</p>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cases.map((c) => {
          const cert = certificates[c.id];
          return (
            <li key={c.id}>
              {cert ? (
                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    dispatch({ type: 'OPEN_CERTIFICATE', caseId: c.id, from: 'gallery' });
                  }}
                  className="pixel-box-flat px-gold group block w-full bg-gold-50 p-2 text-left transition-transform hover:-translate-y-1"
                >
                  <CertificateCanvas caseObj={c} name={playerName} date={cert.date} rating={caseReport(c, state.progress[c.id]?.levels).rating} />
                  <span className="mt-2 flex items-center justify-between gap-2 px-1 pb-1">
                    <span className="truncate font-heading font-bold text-navy-900">{c.name}</span>
                    <span className="shrink-0 font-pixel text-[11px] uppercase text-forest-700 group-hover:text-navy-900">View & save</span>
                  </span>
                </button>
              ) : (
                <div className="pixel-box-flat px-navy flex aspect-[1500/1180] flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center">
                  <Icon name="lock" className="h-7 w-7 text-slate-400" strokeWidth={2.25} />
                  <span className="font-heading font-bold text-slate-500">{c.name}</span>
                  <span className="text-xs text-slate-400">Clear all 4 levels to earn</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function AchievementsPanel() {
  const { state, badges, rewards } = useGame();
  const list = achievements(state.progress);
  const tiersDone = list.reduce((s, a) => s + a.reached, 0);

  return (
    <div className="pixel-scroll flex h-full flex-col gap-8 overflow-y-auto p-1 pb-6">
      <PanelHeader icon="trophy" title="Achievements" subtitle="Daily goals, certificates, milestones and your career rank." />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <CareerCard />
        <DailyGoals />
      </div>

      <CertificateGallery />

      <section className="pixel-box bg-white p-5 sm:p-6" aria-labelledby="ach-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="ach-title" className="text-2xl font-bold">Milestones</h2>
          <p className="font-pixel text-[12px] uppercase text-wood-600">
            {tiersDone} / {list.length * 3} medals{rewards.length > 0 && ` · ${rewards.length} to claim`}
          </p>
        </div>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => {
            const ready = a.tiers.find((t) => t.done && !t.claimed);
            const maxed = a.reached === a.tiers.length;
            return (
              <li key={a.id} className={`pixel-box-flat flex flex-col gap-3 p-4 ${ready ? 'px-gold bg-gold-50' : 'px-navy bg-white'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center ${a.reached ? 'bg-navy-900' : 'bg-slate-200'}`}>
                    <PixelSprite name={a.sprite} scale={3} className={a.reached ? '' : 'opacity-40 grayscale'} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-lg font-bold leading-tight text-navy-900">{a.name}</span>
                    <span className="block text-sm text-slate-600">
                      {a.desc} · {maxed ? 'all tiers done' : `${a.goal.name}: ${a.goal.target}`}
                    </span>
                  </span>
                  <span className="flex shrink-0 gap-1" aria-label={`${a.reached} of 3 medals`}>
                    {a.tiers.map((t, i) => (
                      <span key={t.id} title={`${t.name} · ${t.target}`} className={`h-4 w-4 ${t.done ? MEDAL[i] : 'bg-slate-200'}`} />
                    ))}
                  </span>
                </div>
                <span className="flex items-center gap-3">
                  <Bar value={Math.min(a.value, a.goal.target)} target={a.goal.target} tone={maxed ? 'bg-gold' : 'bg-emerald-500'} />
                  <span className="w-16 shrink-0 text-right font-pixel text-[11px] text-navy-900">
                    {Math.min(a.value, a.goal.target)}/{a.goal.target}
                  </span>
                </span>
                {ready && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-pixel text-[11px] uppercase text-wood-600">{ready.name} reached!</span>
                    <ClaimButton id={ready.id} reward={ready.reward} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pixel-box bg-white p-5 sm:p-6" aria-labelledby="badges-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="badges-title" className="text-2xl font-bold">Badges</h2>
          <p className="font-pixel text-[12px] uppercase text-wood-600">
            {badges.length} / {Object.keys(BADGES).length} collected
          </p>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(BADGES).map(([id, b]) => {
            const have = badges.includes(id);
            return (
              <li key={id} className={`pixel-box-flat flex flex-col items-center gap-2 p-3 text-center ${have ? 'px-gold bg-gold-50' : 'px-navy bg-slate-100'}`}>
                <PixelSprite name={b.sprite} scale={3} className={have ? '' : 'opacity-30 grayscale'} />
                <span className={`font-heading text-sm font-bold ${have ? 'text-navy-900' : 'text-slate-400'}`}>{b.name}</span>
                <span className="text-xs text-slate-500">{b.desc}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
