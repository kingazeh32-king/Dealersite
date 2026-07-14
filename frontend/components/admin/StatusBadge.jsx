const styles = {
  available: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  sold: 'bg-slate-200 text-slate-700',
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-slate-200 text-slate-700',
  resolved: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }) {
  const label = status?.replace('-', ' ') || 'unknown';
  const style = styles[status] || 'bg-slate-100 text-slate-600';

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}
    >
      {label}
    </span>
  );
}
