const styles = {
  unopened: 'bg-white text-ep-ink',
  'in-progress': 'bg-blue-600 text-white',
  finished: 'bg-ep-green text-white',
  locked: 'bg-slate-700/80 text-white',
};
const labels = { unopened: 'Unopened', 'in-progress': 'In Progress', finished: 'Finished', locked: 'Locked' };

export default function StatusBadge({ status, className = '' }) {
  return (
    <span className={`rounded-full px-3 py-1 font-rounded text-xs font-extrabold shadow ${styles[status]} ${className}`}>
      {labels[status]}
    </span>
  );
}
