export default function HowItWorks({ content }) {
  if (!content) return null;

  const { eyebrow, title, description, steps = [] } = content;
  if (!steps.length) return null;

  return (
    <section className="py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              {eyebrow}
            </p>
          )}
          <h2 id="how-heading" className="mt-2 text-3xl font-bold text-navy">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-3 max-w-2xl text-slate">{description}</p>
          )}
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <li
              key={item.step || index}
              className="relative rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
            >
              <span className="text-4xl font-bold text-gold/30">{item.step}</span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
