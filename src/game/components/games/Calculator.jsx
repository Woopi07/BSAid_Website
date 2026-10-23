// In-game calculator (GDD: "Calculator – Computation Tool"). A floating panel that stays open while playing.
// "Use answer" sends the result to the current round's amount field via a `calc:use` window event.
import { useRef, useState } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { useAudio } from '../../context/AudioProvider.jsx';
import Icon from '../Icons.jsx';

const OPS = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => (b === 0 ? NaN : a / b) };
const tidy = (n) => Math.round(n * 1e10) / 1e10;

// Adds thousands separators while keeping what the user typed (e.g. "1234.5" -> "1,234.5").
function pretty(str) {
  if (str === 'Error') return str;
  const [int, dec] = str.split('.');
  const sign = int.startsWith('-') ? '-' : '';
  const digits = sign ? int.slice(1) : int;
  return `${sign}${Number(digits || 0).toLocaleString('en-PH')}${dec !== undefined ? `.${dec}` : ''}`;
}
const toStr = (n) => (Number.isFinite(n) ? String(tidy(n)) : 'Error');

export function useCalculator() {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);
  const [expr, setExpr] = useState('');
  const cur = () => Number(display);

  const digit = (d) => {
    if (display === 'Error' || fresh) {
      setDisplay(d === '.' ? '0.' : d);
      setFresh(false);
      return;
    }
    if (d === '.' && display.includes('.')) return;
    if (display.replace(/[-.]/g, '').length >= 12) return;
    setDisplay(display === '0' && d !== '.' ? d : display + d);
  };

  const operator = (o) => {
    if (display === 'Error') return;
    let base = cur();
    if (acc !== null && op && !fresh) {
      base = tidy(OPS[op](acc, cur()));
      setDisplay(toStr(base));
    }
    setAcc(base);
    setOp(o);
    setFresh(true);
    setExpr(`${pretty(toStr(base))} ${o}`);
  };

  const equals = () => {
    if (acc === null || !op || display === 'Error') return;
    const result = OPS[op](acc, cur());
    setExpr(`${pretty(toStr(acc))} ${op} ${pretty(display)} =`);
    setDisplay(toStr(result));
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay('0');
    setAcc(null);
    setOp(null);
    setFresh(true);
    setExpr('');
  };
  const back = () => {
    if (fresh || display === 'Error') return;
    setDisplay(display.length > 1 && display !== '-0' ? display.slice(0, -1).replace(/^-$/, '0') : '0');
  };
  const percent = () => display !== 'Error' && setDisplay(toStr(cur() / 100));
  const negate = () => display !== 'Error' && display !== '0' && setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`);

  return { display, expr, digit, operator, equals, clear, back, percent, negate };
}

export default function Calculator({ onClose, canUse }) {
  const { play } = useAudio();
  const c = useCalculator();
  const key = (fn) => () => {
    play('click');
    fn();
  };
  const value = Number(c.display);
  // Drag the panel by its title bar (desktop) so it never hides the part of the game you need.
  const panel = useRef(null);
  const [pos, setPos] = useState(null);
  const startDrag = (e) => {
    if (e.button !== 0 || e.target.closest('button') || window.innerWidth < 640) return;
    const rect = panel.current.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    const move = (ev) => {
      const x = Math.min(Math.max(8, ev.clientX - dx), window.innerWidth - rect.width - 8);
      const y = Math.min(Math.max(8, ev.clientY - dy), window.innerHeight - rect.height - 8);
      setPos({ x, y });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    e.preventDefault();
  };
  const usable = canUse && c.display !== 'Error' && value > 0;

  const btn = 'pixel-btn h-11 p-0 text-base';
  const rows = [
    [['C', c.clear, 'bg-rose-100 text-rose-800'], ['±', c.negate, 'bg-navy-100 text-navy-900'], ['%', c.percent, 'bg-navy-100 text-navy-900'], ['÷', () => c.operator('÷'), 'bg-gold text-navy-950']],
    [['7'], ['8'], ['9'], ['×', () => c.operator('×'), 'bg-gold text-navy-950']],
    [['4'], ['5'], ['6'], ['−', () => c.operator('−'), 'bg-gold text-navy-950']],
    [['1'], ['2'], ['3'], ['+', () => c.operator('+'), 'bg-gold text-navy-950']],
    [['⌫', c.back, 'bg-navy-100 text-navy-900'], ['0'], ['.'], ['=', c.equals, 'bg-emerald-500 text-navy-950']],
  ];

  return (
    <aside
      ref={panel}
      aria-label="Calculator"
      style={pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined}
      className="pixel-box px-dark fixed inset-x-3 bottom-3 z-40 animate-pop bg-navy-900 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-72"
    >
      <div
        onPointerDown={startDrag}
        className="flex items-center justify-between border-b-4 border-navy-950 bg-forest-700 px-3 py-2 sm:cursor-move"
        title="Drag to move"
      >
        <p className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-widest text-cream">
          <PixelSprite name="calculator" scale={2} /> Calculator
          <span className="hidden normal-case tracking-normal text-wood-100 sm:inline">· drag me</span>
        </p>
        <button type="button" onClick={onClose} className="text-cream hover:text-gold" aria-label="Close calculator">
          <Icon name="close" className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>
      <div className="p-3">
        <div className="pixel-box-flat bg-[#C9E4B4] px-3 py-2 text-right [--px:#0A0F2C]" aria-live="polite">
          <p className="h-5 truncate text-xs font-semibold text-[#2F4A28]">{c.expr}</p>
          <p className="truncate font-heading text-3xl font-bold tabular-nums text-[#13240F]">{pretty(c.display)}</p>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {rows.flat().map(([label, fn, tone]) => (
            <button
              key={label}
              type="button"
              onClick={key(fn ?? (() => c.digit(label)))}
              className={`${btn} ${tone ?? 'bg-white text-navy-950 hover:bg-wood-100'}`}
              aria-label={{ '−': 'minus', '×': 'times', '÷': 'divided by', '⌫': 'delete digit', '±': 'change sign' }[label] ?? label}
            >
              {label}
            </button>
          ))}
        </div>
        {canUse && (
          <button
            type="button"
            disabled={!usable}
            onClick={() => {
              play('pop');
              window.dispatchEvent(new CustomEvent('calc:use', { detail: Math.round(value) }));
            }}
            className="pixel-btn mt-3 w-full bg-emerald-500 text-navy-950 hover:bg-emerald-400 disabled:opacity-40"
          >
            Use answer{usable ? ` · ₱${Math.round(value).toLocaleString('en-PH')}` : ''}
          </button>
        )}
      </div>
    </aside>
  );
}
