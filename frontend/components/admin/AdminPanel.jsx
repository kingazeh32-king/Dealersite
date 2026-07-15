export default function AdminPanel({ children, className = '', title, action }) {
  return (
    <section className={`border border-slate-200 bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
          {title ? (
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
