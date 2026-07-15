export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`text-3xl font-bold tracking-tight text-navy ${
            eyebrow ? 'mt-2' : ''
          }`}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-slate">{description}</p>
        ) : null}
      </div>
      {(actions || meta) && (
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {meta}
          {actions}
        </div>
      )}
    </div>
  );
}
