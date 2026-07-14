export default function TrustSignals({ signals = [] }) {
  if (!signals.length) return null;

  return (
    <section className="border-b border-slate-200 bg-white" aria-label="Trust signals">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {signals.map((signal) => (
            <div key={signal.label} className="text-center lg:text-left">
              <p className="text-3xl font-bold text-navy sm:text-4xl">{signal.value}</p>
              <p className="mt-1 text-sm font-semibold text-navy">{signal.label}</p>
              <p className="mt-0.5 text-xs text-slate">{signal.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
