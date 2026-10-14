import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cases } from '../data/cases.js';
import { load, save } from '../storage.js';

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
      const result = { mistakes: action.mistakes, ...rankFor(action.mistakes) };
      const previous = cp.levels[state.levelId];
      const best = previous && previous.points >= result.points ? previous : result;
      const unlocked = Math.max(cp.unlocked, Math.min(state.levelId + 1, 4));
      return {
        ...state,
        view: VIEWS.LEVEL_RESULTS,
        lastResult: { ...result, unlockedNext: unlocked > cp.unlocked },
        progress: {
          ...state.progress,
          [state.caseId]: { ...cp, opened: true, unlocked, levels: { ...cp.levels, [state.levelId]: best } },
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

    const activeCase = cases.find((c) => c.id === state.caseId) ?? null;
    const activeLevel = activeCase?.levels.find((l) => l.id === state.levelId) ?? null;

    return { state, dispatch, progressOf, counts, activeCase, activeLevel };
  }, [state]);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export const useGame = () => useContext(GameCtx);
