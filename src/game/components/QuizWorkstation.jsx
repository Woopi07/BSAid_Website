import { useEffect, useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function ContextCard({ icon, label, tone, children }) {
  const tones = {
    green: 'bg-ep-cream ring-ep-line text-ep-green',
    amber: 'bg-orange-50 ring-ep-amber text-orange-600',
    success: 'bg-green-50 ring-ep-green text-ep-green',
    danger: 'bg-red-50 ring-red-300 text-red-600',
  };
  return (
    <div className={`rounded-2xl p-4 shadow-sm ring-2 transition-colors sm:p-5 ${tones[tone]}`}>
      <p className="flex items-center gap-1.5 font-rounded text-xs font-black uppercase tracking-wider">
        <Icon name={icon} className="h-4 w-4" strokeWidth={2.5} /> {label}
      </p>
      <div className="mt-2 font-rounded text-[15px] font-bold leading-relaxed text-ep-ink">{children}</div>
    </div>
  );
}

function Quiz({ onRestart }) {
  const { activeCase, activeLevel, dispatch } = useGame();
  const { play } = useAudio();
  const questions = activeLevel.questions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(() => ({ selected: null, result: null, hint: false })));
  const [shake, setShake] = useState(false);

  const q = questions[index];
  const a = answers[index];
  const answered = a.result !== null;
  const last = index === questions.length - 1;
  const mistakes = answers.filter((x) => x.result === 'wrong').length;

  const update = (patch) => setAnswers((all) => all.map((x, i) => (i === index ? { ...x, ...patch } : x)));

  const choose = (i) => {
    if (answered) return;
    play('click');
    update({ selected: i });
  };

  const submit = () => {
    if (answered) {
      if (last) {
        play('unlock');
        dispatch({ type: 'COMPLETE_LEVEL', mistakes });
      } else {
        play('page');
        setIndex(index + 1);
      }
      return;
    }
    if (a.selected === null) {
      play('locked');
      setShake(true);
      return;
    }
    const correct = a.selected === q.answer;
    play(correct ? 'chime' : 'warning');
    update({ result: correct ? 'correct' : 'wrong' });
  };

  // Keyboard: A–D or 1–4 picks a choice, Enter submits.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, [role="menu"]') || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toUpperCase();
      const letter = LETTERS.indexOf(key);
      const digit = Number(e.key) - 1;
      const pick = letter >= 0 ? letter : digit >= 0 && digit < 9 ? digit : -1;
      if (pick >= 0 && pick < q.choices.length) {
        e.preventDefault();
        choose(pick);
      } else if (e.key === 'Enter' && !e.target.closest?.('button')) {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  let insight;
  if (a.result === 'correct') {
    insight = (
      <ContextCard icon="check" label="Correct!" tone="success">
        {q.explanation}
      </ContextCard>
    );
  } else if (a.result === 'wrong') {
    insight = (
      <ContextCard icon="close" label="Not quite" tone="danger">
        <span className="block">
          Correct answer: <strong>{LETTERS[q.answer]}. {q.choices[q.answer]}</strong>
        </span>
        <span className="mt-1 block font-semibold">{q.explanation}</span>
      </ContextCard>
    );
  } else {
    insight = (
      <ContextCard icon="bulb" label={a.hint ? 'Hint' : 'Insight'} tone="amber">
        {a.hint ? q.hint : `Answer the question to reveal ${activeCase.owner}'s explanation here.`}
      </ContextCard>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <LevelHeader onRestart={onRestart} />
      <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-5 sm:gap-5 sm:px-5 sm:py-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-ep-cream p-4 shadow-sm ring-2 ring-ep-line sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-rounded text-lg font-black text-ep-ink">{activeLevel.title}</h2>
              <p className="font-rounded text-sm font-semibold text-slate-500">{activeLevel.summary}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden gap-1 md:flex" aria-hidden="true">
                {answers.map((x, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${
                      x.result === 'correct' ? 'bg-ep-green' : x.result === 'wrong' ? 'bg-red-500' : i === index ? 'bg-ep-amber' : 'bg-ep-line'
                    }`}
                  />
                ))}
              </div>
              <span className="rounded-full bg-amber-200/70 px-4 py-1.5 font-rounded text-sm font-black text-amber-900">
                Question {index + 1} of {questions.length}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ContextCard icon="doc" label="Business event" tone="green">
              {q.event}
            </ContextCard>
            <ContextCard icon="doc" label="Accounting challenge" tone="green">
              {q.challenge}
            </ContextCard>
            <div aria-live="polite">{insight}</div>
          </div>

          <section className="rounded-2xl bg-white p-4 shadow-lg ring-2 ring-ep-line sm:p-6" aria-labelledby="question-text">
            <p className="flex items-center gap-2 font-rounded font-black text-ep-green">
              <Avatar look={activeCase.avatar} className="h-9 w-9" />
              {activeCase.owner}
            </p>
            <p id="question-text" className="mt-3 font-rounded text-base font-semibold leading-relaxed text-ep-ink sm:text-[17px]">
              {q.prompt}
            </p>

            <div role="radiogroup" aria-labelledby="question-text" className={`mt-5 flex flex-col gap-3 ${shake ? 'animate-shake' : ''}`} onAnimationEnd={() => setShake(false)}>
              {q.choices.map((choice, i) => {
                const isSelected = a.selected === i;
                const isAnswer = i === q.answer;
                let style = 'ring-ep-line hover:ring-ep-amber hover:bg-amber-50/50';
                if (answered && isAnswer) style = 'bg-green-50 ring-ep-green';
                else if (answered && isSelected) style = 'bg-red-50 ring-red-400';
                else if (answered) style = 'ring-ep-line opacity-60';
                else if (isSelected) style = 'bg-amber-50 ring-ep-amber';
                return (
                  <button
                    key={choice}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={answered}
                    onClick={() => choose(i)}
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left ring-2 transition sm:px-5 ${style}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-rounded text-sm font-black ${
                        answered && isAnswer
                          ? 'bg-ep-green text-white'
                          : answered && isSelected
                            ? 'bg-red-500 text-white'
                            : isSelected
                              ? 'bg-ep-amber text-white'
                              : 'bg-amber-100 text-ep-ink'
                      }`}
                    >
                      {answered && isAnswer ? <Icon name="check" className="h-4 w-4" strokeWidth={3} /> : answered && isSelected ? <Icon name="close" className="h-4 w-4" strokeWidth={3} /> : LETTERS[i]}
                    </span>
                    <span className="font-rounded text-[15px] font-bold text-ep-ink sm:text-base">{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Pinned to the bottom of the scroll area on phones so Submit is always reachable. */}
            <div className="sticky bottom-0 -mx-4 -mb-4 mt-6 flex items-center justify-between gap-3 rounded-b-2xl border-t border-ep-line bg-white/95 px-4 py-3 backdrop-blur sm:static sm:m-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    update({ hint: true });
                  }}
                  disabled={answered || a.hint}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ep-ink ring-2 ring-ep-line transition hover:bg-amber-50 hover:ring-ep-amber disabled:opacity-40"
                  aria-label="Show hint"
                  title="Hint"
                >
                  <Icon name="bulb" className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    update({ selected: null });
                  }}
                  disabled={answered || a.selected === null}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ep-ink ring-2 ring-ep-line transition hover:bg-amber-50 hover:ring-ep-amber disabled:opacity-40"
                  aria-label="Reset answer"
                  title="Reset"
                >
                  <Icon name="refresh" className="h-6 w-6" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    play('page');
                    setIndex(index - 1);
                  }}
                  disabled={index === 0}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ep-ink ring-2 ring-ep-line hover:bg-ep-sand disabled:opacity-30"
                  aria-label="Previous question"
                >
                  <Icon name="chevronLeft" className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    play('page');
                    setIndex(index + 1);
                  }}
                  disabled={last || !answered}
                  className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white text-ep-ink ring-2 ring-ep-line hover:bg-ep-sand disabled:opacity-30 sm:flex"
                  aria-label="Next question"
                >
                  <Icon name="chevronRight" className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={submit}
                  className="flex h-12 items-center gap-2 rounded-full bg-ep-green px-6 font-rounded text-lg font-black text-white shadow-lg transition hover:bg-green-800 sm:px-8"
                >
                  {answered ? (last ? 'Finish' : 'Next') : 'Submit'}
                  <Icon name="play" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
          <p className="hidden text-center font-rounded text-xs font-bold text-blue-200/70 sm:block">
            Keyboard: press A&ndash;{LETTERS[q.choices.length - 1]} to choose &middot; Enter to submit
          </p>
        </div>
      </main>
    </div>
  );
}

export default function QuizWorkstation() {
  const [run, setRun] = useState(0);
  return <Quiz key={run} onRestart={() => setRun((n) => n + 1)} />;
}
