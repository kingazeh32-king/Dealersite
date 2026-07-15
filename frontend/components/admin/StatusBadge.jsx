const propertyStyles = {
  available: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-600',
  },
  pending: {
    wrap: 'border-amber-200 bg-amber-50 text-amber-800',
    dot: 'bg-amber-500',
  },
  sold: {
    wrap: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  },
};

const inquiryStyles = {
  new: {
    wrap: 'border-navy/15 bg-navy/[0.04] text-navy',
    dot: 'bg-gold',
  },
  read: {
    wrap: 'border-slate-200 bg-slate-light text-slate',
    dot: 'bg-slate-400',
  },
  resolved: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-600',
  },
  published: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-600',
  },
  hidden: {
    wrap: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  },
  draft: {
    wrap: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  },
};

const leadStyles = {
  new: inquiryStyles.new,
  pending: propertyStyles.pending,
};

const allStyles = {
  ...propertyStyles,
  ...inquiryStyles,
};

function formatLabel(status) {
  return (status || 'unknown').replace(/-/g, ' ');
}

export default function StatusBadge({ status }) {
  const style = allStyles[status] || {
    wrap: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${style.wrap}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} aria-hidden />
      {formatLabel(status)}
    </span>
  );
}

export function InquiryStatusSelect({ value, onChange, disabled = false }) {
  const style = inquiryStyles[value] || inquiryStyles.read;

  return (
    <div className="relative min-w-[8.5rem]">
      <span
        className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${style.dot}`}
        aria-hidden
      />
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Inquiry status"
        className={`w-full appearance-none border py-2 pl-6 pr-8 text-xs font-semibold uppercase tracking-[0.06em] transition-colors focus:outline-none focus:ring-1 focus:ring-navy/30 disabled:opacity-60 ${style.wrap}`}
      >
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="resolved">Resolved</option>
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}

export function PropertyStatusSelect({ value, onChange, disabled = false }) {
  const style = propertyStyles[value] || propertyStyles.pending;

  return (
    <div className="relative min-w-[8.5rem]">
      <span
        className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${style.dot}`}
        aria-hidden
      />
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Property status"
        className={`w-full appearance-none border py-2 pl-6 pr-8 text-xs font-semibold uppercase tracking-[0.06em] transition-colors focus:outline-none focus:ring-1 focus:ring-navy/30 disabled:opacity-60 ${style.wrap}`}
      >
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="sold">Sold</option>
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}

export { leadStyles };
