import { useEffect, useState } from 'react';
import PixelSprite from '../../components/ui/PixelSprite.jsx';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import LevelHeader from './LevelHeader.jsx';
import Scene from './Scene.jsx';
import Avatar from './Avatar.jsx';
import Icon from './Icons.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function ContextCard({ icon, label, tone, children }) {
  const tones = {
    event: { box: 'px-ember bg-ember-100', label: 'text-ember-800' },
    challenge: { box: 'px-navy bg-cream', label: 'text-navy' },
    insight: { box: 'px-gold bg-gold-50', label: 'text-gold-700' },
    success: { box: 'bg-emerald-50 [--px:#059669]', label: 'text-emerald-700' },
    danger: { box: 'bg-rose-50 [--px:#E11D48]', label: 'text-rose-700' },
  }[tone];
  return (
    <div className={`pixel-box-flat h-full p-4 sm:p-5 ${tones.box}`}>
      <p className={`flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wide ${tones.label}`}>
        <Icon name={icon} className="h-4 w-4" strokeWidth={2.5} /> {label}
      </p>
      <div className="mt-3 text-[15px] leading-relaxed text-navy-900">{children}</div>
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
  const score = answers.filter((x) => x.result === 'correct').length * 100;

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
      const letter = LETTERS.indexOf(e.key.toUpperCase());
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
        <span className="block font-semibold">
          Correct answer: {LETTERS[q.answer]}. {q.choices[q.answer]}
        </span>
        <span className="mt-1 block">{q.explanation}</span>
      </ContextCard>
    );
  } else {
    insight = (
      <ContextCard icon="bulb" label={a.hint ? 'Hint' : 'Insight'} tone="insight">
        {a.hint ? q.hint : `Answer the question to reveal ${activeCase.owner}'s explanation here.`}
      </ContextCard>
    );
  }

  const iconBtn = 'pixel-btn h-11 w-11 p-0 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex h-full flex-col">
      <LevelHeader onRestart={onRestart} />
      <Scene sprites={false}>
        <main className="pixel-scroll min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
            {/* HUD */}
            <div className="pixel-box px-dark flex flex-col gap-3 bg-navy-900 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-pixel text-[11px] uppercase tracking-widest text-ember-300">
                  Stage {activeLevel.id} &middot; {activeCase.name}
                </p>
                <p className="mt-2 text-sm text-navy-100">{activeLevel.summary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden gap-1 md:flex" aria-hidden="true">
                  {answers.map((x, i) => (
                    <span
                      key={i}
                      className={`h-3 w-3 ${
                        x.result === 'correct'
                          ? 'bg-emerald-500'
                          : x.result === 'wrong'
                            ? 'bg-rose-500'
                            : i === index
                              ? 'bg-gold'
                              : 'bg-navy-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="flex items-center gap-1.5 bg-navy-950 px-2.5 py-2 font-pixel text-[12px] text-cream">
                  <PixelSprite name="coin" scale={1} className="h-4 w-4" /> {score}
                </span>
                <span className="bg-crimson-700 px-2.5 py-2 font-pixel text-[12px] uppercase text-cream">
                  Q {index + 1}/{questions.length}
                </span>
              </div>
            </div>

            <div className="grid gap-6 p-1 md:grid-cols-3 md:gap-5">
              <ContextCard icon="doc" label="Business event" tone="event">
                {q.event}
              </ContextCard>
              <ContextCard icon="doc" label="Challenge" tone="challenge">
                {q.challenge}
              </ContextCard>
              <div aria-live="polite">{insight}</div>
            </div>

            <section className="pixel-box px-dark bg-cream p-4 sm:p-6" aria-labelledby="question-text">
              <p className="flex items-center gap-3">
                <span className="pixel-box-flat px-gold">
                  <Avatar look={activeCase.avatar} round={false} className="block h-10 w-10" />
                </span>
                <span className="font-pixel text-[13px] uppercase text-navy">{activeCase.owner}</span>
              </p>
              <p id="question-text" className="mt-4 text-base leading-relaxed text-navy-900 sm:text-[17px]">
                {q.prompt}
              </p>

              <div
                role="radiogroup"
                aria-labelledby="question-text"
                className={`mt-6 flex flex-col gap-4 p-1 ${shake ? 'animate-shake' : ''}`}
                onAnimationEnd={() => setShake(false)}
              >
                {q.choices.map((choice, i) => {
                  const isSelected = a.selected === i;
                  const isAnswer = i === q.answer;
                  let box = 'px-navy bg-white hover:bg-gold-50';
                  let chip = 'bg-navy text-cream';
                  if (answered && isAnswer) {
                    box = 'bg-emerald-50 [--px:#059669]';
                    chip = 'bg-emerald-500 text-navy-950';
                  } else if (answered && isSelected) {
                    box = 'bg-rose-50 [--px:#E11D48]';
                    chip = 'bg-rose-500 text-white';
                  } else if (answered) {
                    box = 'px-navy bg-white opacity-50';
                  } else if (isSelected) {
                    box = 'px-gold bg-gold-50';
                    chip = 'bg-gold text-navy-950';
                  }
                  return (
                    <button
                      key={choice}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={answered}
                      onClick={() => choose(i)}
                      className={`pixel-box-flat flex items-center gap-4 px-4 py-3 text-left transition-colors ${box}`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center font-pixel text-[13px] ${chip}`}>
                        {answered && isAnswer ? (
                          <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                        ) : answered && isSelected ? (
                          <Icon name="close" className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          LETTERS[i]
                        )}
                      </span>
                      <span className="text-[15px] font-medium text-navy-900 sm:text-base">{choice}</span>
                      {isSelected && !answered && <PixelSprite name="arrow" scale={2} className="ml-auto shrink-0 rotate-180 animate-nudge" />}
                    </button>
                  );
                })}
              </div>

              {/* Pinned to the bottom of the scroll area on phones so Submit is always reachable. */}
              <div className="sticky bottom-0 -mx-4 -mb-4 mt-6 flex items-center justify-between gap-3 border-t-4 border-navy-900 bg-cream px-4 py-4 sm:static sm:m-0 sm:mt-8 sm:border-0 sm:p-0">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      play('click');
                      update({ hint: true });
                    }}
                    disabled={answered || a.hint}
                    className={`${iconBtn} bg-gold text-navy-950 hover:bg-gold-300`}
                    aria-label="Show hint"
                    title="Hint"
                  >
                    <Icon name="bulb" className="h-5 w-5" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      play('click');
                      update({ selected: null });
                    }}
                    disabled={answered || a.selected === null}
                    className={`${iconBtn} bg-white text-navy-950 hover:bg-ember-100`}
                    aria-label="Reset answer"
                    title="Reset"
                  >
                    <Icon name="refresh" className="h-5 w-5" strokeWidth={2.25} />
                  </button>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      play('page');
                      setIndex(index - 1);
                    }}
                    disabled={index === 0}
                    className={`${iconBtn} bg-navy text-cream hover:bg-navy-600`}
                    aria-label="Previous question"
                  >
                    <Icon name="chevronLeft" className="h-5 w-5" strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      play('page');
                      setIndex(index + 1);
                    }}
                    disabled={last || !answered}
                    className={`${iconBtn} hidden bg-navy text-cream hover:bg-navy-600 sm:inline-flex`}
                    aria-label="Next question"
                  >
                    <Icon name="chevronRight" className="h-5 w-5" strokeWidth={3} />
                  </button>
                  <button type="button" onClick={submit} className="pixel-btn h-11 bg-emerald-500 px-5 text-navy-950 hover:bg-emerald-400 sm:px-7">
                    {answered ? (last ? 'Finish' : 'Next') : 'Submit'}
                    <PixelSprite name="arrow" scale={2} />
                  </button>
                </div>
              </div>
            </section>
            <p className="hidden pb-2 text-center font-pixel text-[11px] uppercase tracking-widest text-navy-200/80 sm:block">
              Press A&ndash;{LETTERS[q.choices.length - 1]} to choose &middot; Enter to submit
            </p>
          </div>
        </main>
      </Scene>
    </div>
  );
}

export default function QuizWorkstation() {
  const [run, setRun] = useState(0);
  return <Quiz key={run} onRestart={() => setRun((n) => n + 1)} />;
}
