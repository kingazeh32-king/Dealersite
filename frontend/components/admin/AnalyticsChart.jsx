'use client';

function formatMonthLabel(value) {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1).toLocaleString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

export function TrendChart({ title, subtitle, data }) {
  const values = data?.map((item) => item.value) || [];
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => {
    const x = 10 + (index / Math.max(values.length - 1, 1)) * 80;
    const y = 80 - (value / max) * 60;
    return `${x},${y}`;
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-navy">{title}</h3>
          <p className="mt-1 text-sm text-slate">{subtitle}</p>
        </div>
      </div>

      {data?.length ? (
        <div className="mt-5">
          <svg viewBox="0 0 90 90" className="h-48 w-full">
            <line x1="10" y1="80" x2="85" y2="80" stroke="#e2e8f0" strokeWidth="1.2" />
            <line x1="10" y1="20" x2="10" y2="80" stroke="#e2e8f0" strokeWidth="1.2" />
            <polyline
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              points={points.join(' ')}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {values.map((value, index) => {
              const x = 10 + (index / Math.max(values.length - 1, 1)) * 80;
              const y = 80 - (value / max) * 60;
              return <circle key={`${title}-${index}`} cx={x} cy={y} r="2.2" fill="#0f2b4f" />;
            })}
          </svg>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate">
            {data.map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-navy" />
                <span>{formatMonthLabel(item.label)}</span>
                <span className="font-semibold text-navy">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate">
          No activity yet.
        </div>
      )}
    </div>
  );
}

export function BarChart({ title, subtitle, data, color = '#d4af37' }) {
  const values = data?.map((item) => item.value) || [];
  const max = Math.max(1, ...values);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-navy">{title}</h3>
          <p className="mt-1 text-sm text-slate">{subtitle}</p>
        </div>
      </div>

      {data?.length ? (
        <div className="mt-5 space-y-3">
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-navy">{item.label}</span>
                <span className="text-slate">{item.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full"
                  style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate">
          No data to display.
        </div>
      )}
    </div>
  );
}
