import { useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import Icon from '../Icons.jsx';

const randomWrong = (d) => {
  let r;
  do r = String(Math.floor(Math.random() * 10));
  while (r === d);
  return r;
};

function CodeDisplay({ digits, wrong = [], label = 'Vault code progress' }) {
  return (
    <div className="flex items-center gap-2" aria-label={`${label}: ${digits.map((d) => d ?? 'unknown').join(' ')}`}>
      <span aria-hidden="true">🔐</span>
      {digits.map((d, i) => (
        <span
          key={i}
          className={`flex h-12 w-10 items-center justify-center border-2 font-heading text-2xl font-extrabold tabular-nums ${
            wrong.includes(i) ? 'border-rose-500 bg-rose-950 text-rose-300' : d !== undefined ? 'border-forest-300 bg-navy-950 text-forest-300' : 'border-navy-600 bg-navy-950 text-navy-600'
          }`}
        >
          {d ?? '?'}
        </span>
      ))}
    </div>
  );
}

// Crack the Vault: answer accounting questions to reveal the vault's 5-digit code, then key it in.
//  mode 'set'  — answer all five, then try; a wrong answer shows a random digit (Special Case 4)
//  mode 'each' — retry each question until it is right; each correct answer reveals a digit (Special Case 6)
export default function Vault({ game, onDone }) {
  const { play } = useAudio();
  const qs = game.questions;
  const code = game.code.split('');
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState(null);
  const [answers, setAnswers] = useState([]); // current attempt: chosen index per question
  const [digits, setDigits] = useState([]);
  const [first, setFirst] = useState({}); // question -> first answer chosen
  const [wrongTries, setWrongTries] = useState(0);
  const [sets, setSets] = useState(1);
  const [msg, setMsg] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [stage, setStage] = useState('questions'); // questions | check | keypad
  const [typed, setTyped] = useState('');
  const [keyMsg, setKeyMsg] = useState(null);
  const q = qs[idx];
  const answeredHere = answers[idx] !== undefined && (game.mode === 'set' || answers[idx] === q.answer);

  const submit = () => {
    if (choice === null) return;
    const ok = choice === q.answer;
    setFirst((f) => (f[idx] === undefined ? { ...f, [idx]: choice } : f));
    if (game.mode === 'set') {
      play('click');
      setAnswers((a) => Object.assign([...a], { [idx]: choice }));
      setDigits((d) => Object.assign([...d], { [idx]: ok ? code[idx] : randomWrong(code[idx]) }));
      setMsg(null);
    } else if (ok) {
      play('chime');
      setAnswers((a) => Object.assign([...a], { [idx]: choice }));
      setDigits((d) => Object.assign([...d], { [idx]: code[idx] }));
      setMsg({ ok: true, text: game.right });
    } else {
      play('warning');
      setWrongTries((n) => n + 1);
      setMsg({ ok: false, text: game.wrong });
    }
  };

  const next = () => {
    play('page');
    setChoice(null);
    setMsg(null);
    if (idx === qs.length - 1) setStage(game.mode === 'set' ? 'check' : 'keypad');
    else setIdx((i) => i + 1);
  };

  const allRight = answers.length === qs.length && answers.every((a, i) => a === qs[i].answer);
  const wrongIdx = answers.map((a, i) => (a === qs[i].answer ? null : i)).filter((i) => i !== null);

  const finish = () => {
    const review = qs.map((qq, i) => ({
      q: qq.q,
      topic: qq.topic,
      yours: qq.choices[first[i] ?? qq.answer],
      answer: qq.choices[qq.answer],
      steps: qq.steps,
      principle: qq.principle,
      correct: first[i] === qq.answer,
    }));
    const correct = review.filter((r) => r.correct).length;
    onDone({ total: qs.length, correct, digits: correct, attempts: game.mode === 'set' ? sets : qs.length + wrongTries, review });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6">
      <div className="pixel-box px-dark flex flex-wrap items-center justify-between gap-4 bg-navy-900 p-4">
        <div>
          <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Steel vault · 5-digit security code</p>
          <p className="mt-1 text-xs text-navy-200">{game.mode === 'set' ? `Attempt ${sets}` : `${digits.filter(Boolean).length} of 5 digits revealed`}</p>
        </div>
        <CodeDisplay digits={code.map((_, i) => digits[i])} wrong={showHint ? wrongIdx : []} />
      </div>

      {stage === 'questions' && (
        <div className="pixel-box px-dark bg-white p-5 sm:p-6">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-wood-600">
            Question {idx + 1} of {qs.length} · {q.topic}
          </p>
          <p className="mt-2 text-lg font-semibold text-navy-900">{q.q}</p>
          <div role="radiogroup" aria-label="Choices" className="mt-4 grid gap-3">
            {q.choices.map((c, i) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={choice === i}
                disabled={answeredHere}
                onClick={() => {
                  play('click');
                  setChoice(i);
                  setMsg(null);
                }}
                className={`pixel-box-flat flex items-center gap-3 p-3 text-left text-navy-900 ${choice === i ? 'px-gold bg-gold-50' : 'px-navy bg-white hover:bg-cream'} disabled:opacity-70`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-navy font-pixel text-[12px] text-white">{'ABCD'[i]}</span>
                {c}
              </button>
            ))}
          </div>
          {msg && <p className={`mt-4 text-sm font-semibold ${msg.ok ? 'text-forest-700' : 'text-rose-700'}`}>{msg.ok ? '✅' : '❌'} {msg.text}</p>}
          {game.mode === 'set' && answers[idx] !== undefined && <p className="mt-4 text-sm font-semibold text-navy-600">A digit appeared on the vault display.</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            {answeredHere ? (
              <button type="button" autoFocus onClick={next} className="pixel-btn bg-forest text-white hover:bg-forest-700">
                {idx === qs.length - 1 ? (game.mode === 'set' ? 'Check the code' : 'Go to keypad') : 'Next Question'} <PixelSprite name="arrow" scale={2} />
              </button>
            ) : (
              <>
                <button type="button" onClick={submit} disabled={choice === null} className="pixel-btn bg-forest text-white hover:bg-forest-700 disabled:opacity-40">
                  Submit Answer
                </button>
                <button type="button" onClick={() => setChoice(null)} disabled={choice === null} className="pixel-btn bg-white text-navy-950 hover:bg-cream disabled:opacity-40">
                  <Icon name="refresh" className="h-4 w-4" strokeWidth={2.5} /> Clear Answer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === 'check' && (
        <div className="pixel-box px-dark bg-white p-5 text-center sm:p-6">
          <p className="text-lg font-semibold text-navy-900">All five digits are on the display. Try the code?</p>
          {msg && <p className={`mt-3 text-sm font-semibold ${msg.ok ? 'text-forest-700' : 'text-rose-700'}`}>{msg.ok ? '✅' : '❌'} {msg.text}</p>}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {!msg && (
              <button
                type="button"
                onClick={() => {
                  if (allRight) {
                    play('unlock');
                    setStage('keypad');
                  } else {
                    play('locked');
                    setMsg({ ok: false, text: game.wrong });
                  }
                }}
                className="pixel-btn bg-forest text-white hover:bg-forest-700"
              >
                <Icon name="lock" className="h-4 w-4" strokeWidth={2.5} /> Unlock Vault
              </button>
            )}
            {msg && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    play('click');
                    setSets((n) => n + 1);
                    setAnswers([]);
                    setDigits([]);
                    setIdx(0);
                    setChoice(null);
                    setMsg(null);
                    setShowHint(false);
                    setStage('questions');
                  }}
                  className="pixel-btn bg-forest text-white hover:bg-forest-700"
                >
                  <Icon name="refresh" className="h-4 w-4" strokeWidth={2.5} /> Retry Puzzle
                </button>
                <button type="button" onClick={() => setShowHint(true)} disabled={showHint} className="pixel-btn bg-gold text-navy-950 hover:bg-gold-300 disabled:opacity-50">
                  <Icon name="bulb" className="h-4 w-4" strokeWidth={2.5} /> {showHint ? `Digit${wrongIdx.length > 1 ? 's' : ''} ${wrongIdx.map((i) => i + 1).join(', ')} wrong` : 'Hint: which digits?'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === 'keypad' && (
        <div className="pixel-box px-dark mx-auto w-full max-w-sm bg-navy-950 p-5">
          <p className="text-center font-pixel text-[11px] uppercase tracking-widest text-gold">Enter the security code</p>
          <div className="mt-3 flex justify-center">
            <CodeDisplay digits={code.map((_, i) => typed[i])} label="Entered code" />
          </div>
          {keyMsg && <p className={`mt-3 text-center text-sm font-semibold ${keyMsg.ok ? 'text-forest-300' : 'text-rose-300'}`}>{keyMsg.text}</p>}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  play('click');
                  setKeyMsg(null);
                  if (k === 'C') setTyped('');
                  else if (k === '⌫') setTyped((t) => t.slice(0, -1));
                  else setTyped((t) => (t.length < 5 ? t + k : t));
                }}
                className="sp-key pixel-btn h-12 bg-navy-800 p-0 text-lg text-cream hover:bg-navy-600"
                aria-label={k === 'C' ? 'Clear' : k === '⌫' ? 'Delete digit' : k}
              >
                {k}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={typed.length < 5}
            onClick={() => {
              if (typed === game.code) {
                play('unlock');
                setKeyMsg({ ok: true, text: 'BEEP... ACCESS GRANTED' });
                setTimeout(finish, 900);
              } else {
                play('locked');
                setKeyMsg({ ok: false, text: 'Wrong code — check the digits on the display.' });
              }
            }}
            className="pixel-btn mt-4 w-full bg-forest text-white hover:bg-forest-700 disabled:opacity-40"
          >
            <Icon name="lock" className="h-4 w-4" strokeWidth={2.5} /> Unlock Vault
          </button>
        </div>
      )}
    </div>
  );
}
