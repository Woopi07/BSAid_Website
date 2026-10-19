import { peso } from '../../data/generators.js';

// A small T-account: account name on top, debits on the left, credits on the right.
export function TAccount({ name, debits = [], credits = [], tone = 'navy', compact = false, highlight }) {
  const ring = { navy: 'px-navy', green: '[--px:#059669]', red: '[--px:#E11D48]', gold: 'px-gold' }[tone];
  const cell = compact ? 'text-xs' : 'text-sm';
  return (
    <div className={`pixel-box-flat ${ring} bg-white`}>
      <p className={`border-b-4 border-navy-900 px-2 py-1.5 text-center font-heading font-bold text-navy-900 ${compact ? 'text-sm' : 'text-base'}`}>{name}</p>
      <div className="grid grid-cols-2">
        <div className={`min-h-[2.5rem] border-r-4 border-navy-900 p-1.5 ${highlight === 'debit' ? 'bg-gold-50' : ''}`}>
          {debits.map((a, i) => (
            <p key={i} className={`${cell} font-semibold tabular-nums text-navy-900`}>{peso(a)}</p>
          ))}
        </div>
        <div className={`min-h-[2.5rem] p-1.5 text-right ${highlight === 'credit' ? 'bg-gold-50' : ''}`}>
          {credits.map((a, i) => (
            <p key={i} className={`${cell} font-semibold tabular-nums text-navy-900`}>{peso(a)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Two-line journal entry table (debit first, credit indented).
export function JournalEntry({ dr, cr, amount, tone = 'green' }) {
  const color = tone === 'green' ? 'text-emerald-800' : 'text-rose-800';
  return (
    <table className={`w-full text-sm ${color}`}>
      <thead>
        <tr className="font-pixel text-[11px] uppercase text-slate-500">
          <th className="pb-1 text-left">Account</th>
          <th className="pb-1 text-right">Debit</th>
          <th className="pb-1 text-right">Credit</th>
        </tr>
      </thead>
      <tbody className="font-semibold tabular-nums">
        <tr>
          <td className="py-0.5">{dr}</td>
          <td className="py-0.5 text-right">{peso(amount)}</td>
          <td />
        </tr>
        <tr>
          <td className="py-0.5 pl-6">{cr}</td>
          <td />
          <td className="py-0.5 text-right">{peso(amount)}</td>
        </tr>
      </tbody>
    </table>
  );
}

// On-screen number pad (the GDD's "On-screen Keyboard/Num Pad").
export function NumPad({ value, onChange, disabled }) {
  const press = (k) => {
    if (disabled) return;
    if (k === 'C') return onChange('');
    if (k === '⌫') return onChange(value.slice(0, -1));
    if (value.length >= 9) return;
    onChange((value + k).replace(/^0+(?=\d)/, ''));
  };
  return (
    <div className="grid grid-cols-3 gap-2" aria-label="Number pad">
      {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '⌫'].map((k) => (
        <button
          key={k}
          type="button"
          disabled={disabled}
          onClick={() => press(k)}
          aria-label={k === '⌫' ? 'Delete digit' : k === 'C' ? 'Clear' : k}
          className={`pixel-btn h-11 p-0 text-base ${k === 'C' ? 'bg-rose-100 text-rose-800' : k === '⌫' ? 'bg-gold-100 text-navy-950' : 'bg-white text-navy-950 hover:bg-ember-100'} disabled:opacity-40`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

// Lets digits / Backspace on a physical keyboard drive a NumPad value.
export function numKey(e, value, onChange) {
  if (e.target.closest?.('input, textarea, [role="menu"]')) return false;
  if (/^\d$/.test(e.key)) {
    if (value.length < 9) onChange((value + e.key).replace(/^0+(?=\d)/, ''));
    return true;
  }
  if (e.key === 'Backspace') {
    onChange(value.slice(0, -1));
    return true;
  }
  return false;
}

export function SubmitButton({ onClick, disabled, children = 'Submit' }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="pixel-btn h-11 bg-emerald-500 px-6 text-navy-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
      {children}
    </button>
  );
}

export function Card({ label, tone = 'navy', children }) {
  const tones = { navy: 'px-navy bg-cream text-navy', ember: 'px-ember bg-ember-100 text-ember-800', gold: 'px-gold bg-gold-50 text-gold-700' };
  return (
    <div className={`pixel-box-flat p-4 ${tones[tone]}`}>
      <p className="font-pixel text-[12px] uppercase tracking-wide">{label}</p>
      <div className="mt-2 text-[15px] leading-relaxed text-navy-900">{children}</div>
    </div>
  );
}
