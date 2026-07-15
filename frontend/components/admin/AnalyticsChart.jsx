'use client';

function formatMonthLabel(value) {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1).toLocaleString('en-US', {
    month: 'short',
  });
}

export function TrendChart({ title, subtitle, data, accent = '#c9a227' }) {
  const values = data?.map((item) => item.value) || [];
  const max = Math.max(1, ...values);
  const total = values.reduce((sum, value) => sum + value, 0);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : 8 + (index / Math.max(values.length - 1, 1)) * 84;
    const y = 78 - (value / max) * 58;
    return `${x},${y}`;
  });
  const areaPoints = [`8,78`, ...points, `92,78`].join(' ');

  return (
    <section className="border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate">{subtitle}</p>
        </div>
        <p className="text-2xl font-semibold tabular-nums text-navy">{total}</p>
      </div>

      {data?.length ? (
        <div className="mt-4">
          <svg viewBox="0 0 100 90" className="h-40 w-full" role="img" aria-label={title}>
            <line x1="8" y1="78" x2="92" y2="78" stroke="#e2e8f0" strokeWidth="1" />
            <polygon points={areaPoints} fill={accent} opacity="0.12" />
            <polyline
              fill="none"
              stroke={accent}
              strokeWidth="2.2"
              points={points.join(' ')}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {values.map((value, index) => {
              const x =
                values.length === 1
                  ? 50
                  : 8 + (index / Math.max(values.length - 1, 1)) * 84;
              const y = 78 - (value / max) * 58;
              return (
                <circle
                  key={`${title}-${index}`}
                  cx={x}
                  cy={y}
                  r="2.4"
                  fill="#0f172a"
                />
              );
            })}
          </svg>
          <div className="mt-1 grid grid-cols-6 gap-1 text-center text-[11px] text-slate">
            {data.map((item) => (
              <div key={item.label}>
                <p className="font-medium text-navy">{item.value}</p>
                <p>{formatMonthLabel(item.label)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-8 border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate">
          No activity yet.
        </p>
      )}
    </section>
  );
}

export function BarChart({ title, subtitle, data, color = '#c9a227' }) {
  const values = data?.map((item) => item.value) || [];
  const max = Math.max(1, ...values);
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <section className="border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate">{subtitle}</p>
        </div>
        <p className="text-2xl font-semibold tabular-nums text-navy">{total}</p>
      </div>

      {data?.length ? (
        <div className="mt-5 space-y-4">
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium capitalize text-navy">{item.label}</span>
                <span className="tabular-nums text-slate">{item.value}</span>
              </div>
              <div className="h-1.5 bg-slate-light">
                <div
                  className="h-1.5 transition-[width] duration-500"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate">
          No data to display.
        </p>
      )}
    </section>
  );
}
