// Achievements, daily goals and career ranks. Everything here is derived from the saved progress object:
//   _stats   lifetime counters      _daily   today's counters (reset when the date changes)
//   _claimed reward ids claimed     _bonus   coins earned from claimed rewards
import { cases } from './cases.js';
import { rng, shuffle } from './generators.js';

export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

const dayBefore = (date) => {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
};

export const emptyStats = { plays: 0, clears: 0, correct: 0, perfects: 0, bosses: 0, bestCombo: 0, noHint: 0, gameOvers: 0, goals: 0, streak: 0, bestStreak: 0, lastDay: null };
export const emptyDaily = { date: null, clears: 0, correct: 0, perfects: 0, bestCombo: 0, score: 0, noHint: 0, bosses: 0, cases: [] };

export const statsOf = (progress) => ({ ...emptyStats, ...progress._stats });
export const dailyOf = (progress) => (progress._daily?.date === today() ? { ...emptyDaily, ...progress._daily } : { ...emptyDaily, date: today() });

// Folds one finished run (cleared or game over) into the lifetime and daily counters.
export function recordRun(progress, { caseId, levelId, cleared, correct, mistakes = 0, maxCombo, score = 0, hints = 0 }) {
  const s = statsOf(progress);
  const d = dailyOf(progress);
  const date = d.date;
  const streak = s.lastDay === date ? s.streak : s.lastDay === dayBefore(date) ? s.streak + 1 : 1;
  const won = cleared ? 1 : 0;
  const perfect = cleared && mistakes === 0 ? 1 : 0;
  const boss = cleared && levelId === 4 ? 1 : 0;
  const clean = cleared && hints === 0 ? 1 : 0;
  return {
    ...progress,
    _stats: {
      ...s,
      plays: s.plays + 1,
      clears: s.clears + won,
      correct: s.correct + correct,
      perfects: s.perfects + perfect,
      bosses: s.bosses + boss,
      noHint: s.noHint + clean,
      gameOvers: s.gameOvers + (cleared ? 0 : 1),
      bestCombo: Math.max(s.bestCombo, maxCombo),
      streak,
      bestStreak: Math.max(s.bestStreak, streak),
      lastDay: date,
    },
    _daily: {
      ...d,
      clears: d.clears + won,
      correct: d.correct + correct,
      perfects: d.perfects + perfect,
      bosses: d.bosses + boss,
      noHint: d.noHint + clean,
      score: d.score + (cleared ? score : 0),
      bestCombo: Math.max(d.bestCombo, maxCombo),
      cases: d.cases.includes(caseId) ? d.cases : [...d.cases, caseId],
    },
  };
}

// ---- Career rank (from total stars, max 72 = 6 cases × 4 levels × 3 stars) ----
export const CAREER = [
  { title: 'Accounting Intern', stars: 0 },
  { title: 'Bookkeeper', stars: 6 },
  { title: 'Junior Accountant', stars: 18 },
  { title: 'Senior Accountant', stars: 36 },
  { title: 'Audit Manager', stars: 54 },
  { title: 'Certified Public Accountant', stars: 72 },
];

export function totalStars(progress) {
  return cases.reduce((sum, c) => sum + Object.values(progress[c.id]?.levels ?? {}).reduce((s, l) => s + (l.stars ?? 1), 0), 0);
}

export function careerOf(progress) {
  const stars = totalStars(progress);
  let i = 0;
  while (CAREER[i + 1] && stars >= CAREER[i + 1].stars) i += 1;
  const next = CAREER[i + 1] ?? null;
  const floor = CAREER[i].stars;
  return { ...CAREER[i], level: i + 1, stars, next, percent: next ? Math.round(((stars - floor) / (next.stars - floor)) * 100) : 100 };
}

const casesFinished = (progress) => cases.filter((c) => Object.keys(progress[c.id]?.levels ?? {}).length === c.levels.length).length;

// ---- Daily goals: three picked from the pool per day, the same for the whole day ----
const GOAL_POOL = [
  { id: 'clear2', label: 'Clear 2 levels', target: 2, reward: 40, get: (d) => d.clears },
  { id: 'clear4', label: 'Clear 4 levels', target: 4, reward: 90, get: (d) => d.clears },
  { id: 'correct15', label: 'Answer 15 rounds correctly', target: 15, reward: 50, get: (d) => d.correct },
  { id: 'correct30', label: 'Answer 30 rounds correctly', target: 30, reward: 100, get: (d) => d.correct },
  { id: 'combo4', label: 'Hit a 4-answer combo', target: 4, reward: 50, get: (d) => d.bestCombo },
  { id: 'combo6', label: 'Hit a 6-answer combo', target: 6, reward: 80, get: (d) => d.bestCombo },
  { id: 'perfect1', label: 'Clear a level with no mistakes', target: 1, reward: 80, get: (d) => d.perfects },
  { id: 'score2k', label: 'Score 2,000 points', target: 2000, reward: 60, get: (d) => d.score },
  { id: 'cases2', label: 'Play 2 different cases', target: 2, reward: 50, get: (d) => d.cases.length },
  { id: 'nohint1', label: 'Clear a level without hints', target: 1, reward: 50, get: (d) => d.noHint },
  { id: 'boss1', label: 'Clear a Boss Round', target: 1, reward: 100, get: (d) => d.bosses },
];

export function dailyGoals(progress) {
  const d = dailyOf(progress);
  const seed = Number(d.date.replaceAll('-', ''));
  const claimed = progress._claimed ?? [];
  return shuffle(rng(seed), GOAL_POOL)
    .slice(0, 3)
    .map((g) => {
      const id = `daily:${d.date}:${g.id}`;
      const value = Math.min(g.get(d), g.target);
      return { id, label: g.label, target: g.target, reward: g.reward, value, done: value >= g.target, claimed: claimed.includes(id) };
    });
}

// ---- Achievements: each has bronze / silver / gold tiers with growing rewards ----
export const TIER_NAMES = ['Bronze', 'Silver', 'Gold'];
const TIER_REWARDS = [50, 150, 400];

const ACHIEVEMENTS = [
  { id: 'clears', name: 'Bookkeeper', desc: 'Clear levels', tiers: [5, 15, 40], sprite: 'coin', get: (s) => s.clears },
  { id: 'correct', name: 'Sharp Eye', desc: 'Answer rounds correctly', tiers: [50, 200, 600], sprite: 'star', get: (s) => s.correct },
  { id: 'perfects', name: 'Perfectionist', desc: 'Clear levels with no mistakes', tiers: [1, 5, 15], sprite: 'star', get: (s) => s.perfects },
  { id: 'combo', name: 'Combo Master', desc: 'Reach a long answer combo', tiers: [5, 8, 12], sprite: 'bolt', get: (s) => s.bestCombo },
  { id: 'bosses', name: 'Boss Hunter', desc: 'Clear Boss Rounds', tiers: [1, 3, 6], sprite: 'heart', get: (s) => s.bosses },
  { id: 'cases', name: 'Case Closer', desc: 'Finish every level of a case', tiers: [1, 3, 6], sprite: 'calculator', get: (s, p) => casesFinished(p) },
  { id: 'stars', name: 'Star Collector', desc: 'Collect stars', tiers: [12, 36, 72], sprite: 'star', get: (s, p) => totalStars(p) },
  { id: 'nohint', name: 'Self-Reliant', desc: 'Clear levels without hints', tiers: [3, 10, 25], sprite: 'bolt', get: (s) => s.noHint },
  { id: 'goals', name: 'Goal Getter', desc: 'Claim daily goals', tiers: [3, 15, 45], sprite: 'coin', get: (s) => s.goals },
  { id: 'streak', name: 'Daily Grinder', desc: 'Play days in a row', tiers: [2, 5, 10], sprite: 'heart', get: (s) => s.bestStreak },
];

export function achievements(progress) {
  const s = statsOf(progress);
  const claimed = progress._claimed ?? [];
  return ACHIEVEMENTS.map((a) => {
    const value = a.get(s, progress);
    const tiers = a.tiers.map((target, i) => {
      const id = `ach:${a.id}:${i}`;
      return { id, target, reward: TIER_REWARDS[i], name: TIER_NAMES[i], done: value >= target, claimed: claimed.includes(id) };
    });
    const reached = tiers.filter((t) => t.done).length;
    const goal = tiers.find((t) => !t.done) ?? tiers[tiers.length - 1];
    return { id: a.id, name: a.name, desc: a.desc, sprite: a.sprite, value, tiers, reached, goal };
  });
}

// Every reward that is reached but not yet claimed.
export function claimable(progress) {
  const out = dailyGoals(progress).filter((g) => g.done && !g.claimed).map((g) => ({ id: g.id, reward: g.reward, label: g.label, kind: 'goal' }));
  achievements(progress).forEach((a) =>
    a.tiers.filter((t) => t.done && !t.claimed).forEach((t) => out.push({ id: t.id, reward: t.reward, label: `${a.name} · ${t.name}`, kind: 'achievement' }))
  );
  return out;
}
