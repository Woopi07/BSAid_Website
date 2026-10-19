import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cases } from '../data/cases.js';
import { load, save } from '../storage.js';
import { claimable, recordRun } from '../data/achievements.js';

export const VIEWS = {
  DASHBOARD: 'DASHBOARD',
  LEVEL_MODAL: 'LEVEL_MODAL',
  DIALOGUE_INTRO: 'DIALOGUE_INTRO',
  QUIZ_WORKSTATION: 'QUIZ_WORKSTATION',
  LEVEL_RESULTS: 'LEVEL_RESULTS',
};

const KEY = 'entry-point:progress';

// Ranking from the Game Design Document: fewer mistakes, higher rank.
export function rankFor(mistakes) {
  if (mistakes === 0) return { rank: 'S', points: 100 };
  if (mistakes <= 2) return { rank: 'A', points: 80 };
  if (mistakes <= 5) return { rank: 'B', points: 60 };
  if (mistakes <= 7) return { rank: 'C', points: 40 };
  return { rank: 'D', points: 20 };
}

const initial = {
  view: VIEWS.DASHBOARD,
  panel: 'cases',
  caseId: null,
  levelId: null,
  lastResult: null,
  progress: {}, // { [caseId]: { opened: true, unlocked: 1, levels: { [levelId]: { mistakes, rank, points } } } }
};

function caseProgress(state, caseId) {
  return state.progress[caseId] ?? { opened: false, unlocked: 1, levels: {} };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PANEL':
      return { ...state, panel: action.panel };
    case 'OPEN_CASE':
      return { ...state, view: VIEWS.LEVEL_MODAL, caseId: action.caseId };
    case 'CLOSE_MODAL':
      return { ...state, view: VIEWS.DASHBOARD };
    case 'START_LEVEL': {
      const cp = caseProgress(state, state.caseId);
      return {
        ...state,
        view: VIEWS.DIALOGUE_INTRO,
        levelId: action.levelId,
        progress: { ...state.progress, [state.caseId]: { ...cp, opened: true } },
      };
    }
    case 'BEGIN_QUIZ':
      return { ...state, view: VIEWS.QUIZ_WORKSTATION };
    case 'REPLAY_INTRO':
      return { ...state, view: VIEWS.DIALOGUE_INTRO };
    case 'COMPLETE_LEVEL': {
      const cp = caseProgress(state, state.caseId);
      const { rank } = rankFor(action.mistakes);
      const accuracy = (action.total - action.mistakes) / action.total;
      const stars = action.mistakes === 0 ? 3 : accuracy >= 0.75 ? 2 : 1;
      const result = { mistakes: action.mistakes, rank, points: action.score, stars, maxCombo: action.maxCombo, total: action.total };
      const previous = cp.levels[state.levelId];
      const best = previous && previous.points >= result.points ? { ...previous, stars: Math.max(previous.stars ?? 1, stars) } : result;
      const unlocked = Math.max(cp.unlocked, Math.min(state.levelId + 1, 4));
      const badges = new Set(state.progress._badges ?? []);
      const earned = [];
      const award = (id, ok) => {
        if (ok && !badges.has(id)) {
          badges.add(id);
          earned.push(id);
        }
      };
      award('first-clear', true);
      award('perfect', action.mistakes === 0);
      award('combo-5', action.maxCombo >= 5);
      award('boss', state.levelId === 4);
      award(`case-${state.caseId}`, Object.keys({ ...cp.levels, [state.levelId]: best }).length === 4);
      const before = new Set(claimable(state.progress).map((r) => r.id));
      const progress = recordRun(
        {
          ...state.progress,
          _badges: [...badges],
          [state.caseId]: { ...cp, opened: true, unlocked, levels: { ...cp.levels, [state.levelId]: best } },
        },
        { caseId: state.caseId, levelId: state.levelId, cleared: true, correct: action.total - action.mistakes, mistakes: action.mistakes, maxCombo: action.maxCombo, score: action.score, hints: action.hints }
      );
      const reached = claimable(progress).filter((r) => !before.has(r.id));
      return {
        ...state,
        view: VIEWS.LEVEL_RESULTS,
        lastResult: { ...result, coins: Math.round(action.score / 10), unlockedNext: unlocked > cp.unlocked, earned, reached, review: action.review },
        progress,
      };
    }
    case 'LEVEL_FAILED':
      return {
        ...state,
        progress: recordRun(state.progress, { caseId: state.caseId, levelId: state.levelId, cleared: false, correct: action.correct, maxCombo: action.maxCombo }),
      };
    case 'CLAIM': {
      const reward = claimable(state.progress).find((r) => r.id === action.id);
      if (!reward) return state;
      const stats = state.progress._stats ?? {};
      return {
        ...state,
        progress: {
          ...state.progress,
          _claimed: [...(state.progress._claimed ?? []), reward.id],
          _bonus: (state.progress._bonus ?? 0) + reward.reward,
          _stats: reward.kind === 'goal' ? { ...stats, goals: (stats.goals ?? 0) + 1 } : stats,
        },
      };
    }
    case 'EXIT_TO_DASHBOARD':
      return { ...state, view: VIEWS.DASHBOARD, levelId: null, panel: 'cases' };
    case 'BACK_TO_LEVELS':
      return { ...state, view: VIEWS.LEVEL_MODAL, levelId: null };
    case 'RESET_PROGRESS':
      return { ...initial };
    default:
      return state;
  }
}

const GameCtx = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial, (base) => ({ ...base, progress: load(KEY, {}) }));

  useEffect(() => save(KEY, state.progress), [state.progress]);

  const value = useMemo(() => {
    const progressOf = (c) => {
      const cp = caseProgress(state, c.id);
      const completed = Object.keys(cp.levels).length;
      let status = 'unopened';
      if (c.locked) status = 'locked';
      else if (completed === c.levels.length) status = 'finished';
      else if (cp.opened) status = 'in-progress';
      return { ...cp, completed, percent: Math.round((completed / c.levels.length) * 100), status };
    };

    const counts = cases.reduce(
      (acc, c) => {
        const { status } = progressOf(c);
        if (status === 'finished') acc.finished += 1;
        else if (status === 'in-progress') acc.inProgress += 1;
        else if (status === 'unopened') acc.pending += 1;
        else acc.locked += 1;
        return acc;
      },
      { finished: 0, inProgress: 0, pending: 0, locked: 0 }
    );

    const coins = cases.reduce(
      (sum, c) => sum + Object.values(caseProgress(state, c.id).levels).reduce((s2, l) => s2 + Math.round((l.points ?? 0) / 10), 0),
      0
    );
    const total = coins + (state.progress._bonus ?? 0);
    const rewards = claimable(state.progress);
    const badges = state.progress._badges ?? [];
    const activeCase = cases.find((c) => c.id === state.caseId) ?? null;
    const activeLevel = activeCase?.levels.find((l) => l.id === state.levelId) ?? null;

    return { state, dispatch, progressOf, counts, coins: total, rewards, badges, activeCase, activeLevel };
  }, [state]);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export const useGame = () => useContext(GameCtx);

export const BADGES = {
  'first-clear': { name: 'First Entry', desc: 'Clear your first level', sprite: 'coin' },
  perfect: { name: 'Flawless', desc: 'Clear a level with no mistakes', sprite: 'star' },
  'combo-5': { name: 'On Fire', desc: 'Reach a 5-answer combo', sprite: 'bolt' },
  boss: { name: 'Boss Slayer', desc: 'Clear a Boss Round', sprite: 'heart' },
  'case-001': { name: 'Groceria Pro', desc: "Clear all of Nayeom's levels", sprite: 'coin' },
  'case-002': { name: 'Vault Keeper', desc: "Clear all of Lukas's levels", sprite: 'star' },
  'case-003': { name: 'Ledger Barista', desc: "Clear all of Surume's levels", sprite: 'heart' },
  'case-004': { name: 'Express Courier', desc: 'Clear all of SwiftGo’s levels', sprite: 'bolt' },
  'case-005': { name: 'Master Detective', desc: 'Clear all of Lakwatsa’s levels', sprite: 'calculator' },
  'case-006': { name: 'Book Balancer', desc: 'Clear all of Sanvitog’s levels', sprite: 'star' },
};
