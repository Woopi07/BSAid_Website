const styles = {
  unopened: 'bg-cream text-navy-950',
  'in-progress': 'bg-navy-400 text-cream',
  finished: 'bg-emerald-500 text-navy-950',
  locked: 'bg-navy-950 text-navy-200',
};
const labels = { unopened: 'Unopened', 'in-progress': 'In Progress', finished: 'Finished', locked: 'Locked' };

export default function StatusBadge({ status, className = '' }) {
  return (
    <span className={`pixel-box-flat px-dark px-2 py-1.5 font-pixel text-[11px] uppercase ${styles[status]} ${className}`}>
      {labels[status]}
    </span>
  );
}
