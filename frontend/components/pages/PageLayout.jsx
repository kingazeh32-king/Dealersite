import Link from 'next/link';

export default function PageLayout({ page, eyebrow, children }) {
  if (!page) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm sm:p-10">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        )}
        <h1 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate">{page.subtitle}</p>
        )}
      </header>

      <div className="mx-auto mt-10 max-w-4xl space-y-6">{children}</div>
    </div>
  );
}

export function ContentSections({ sections = [] }) {
  if (!sections.length) return null;

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const isFirstSection = index === 0;
        const isStorySection =
          isFirstSection || (section.heading || '').toLowerCase().includes('story');
        const headingText = section.heading || (isFirstSection ? 'About Us' : '');

        return (
          <section
            key={section.heading || index}
            className={`rounded-3xl p-8 shadow-none sm:p-10 ${isStorySection ? 'bg-slate-50' : 'bg-white'}`}
          >
            {isStorySection ? (
              <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:gap-8 lg:text-left">
                <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:min-w-[220px]">
                  <img
                    src="/logo.svg"
                    alt="Manufactured Mobile Homes of Texas logo"
                    className="h-20 w-auto sm:h-24"
                  />
                </div>
                <div className="flex-1">
                  {headingText && (
                    <h2 className="text-2xl font-semibold text-navy">{headingText}</h2>
                  )}
                  {section.body && (
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate lg:mx-0">{section.body}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                {headingText && (
                  <h2 className="text-xl font-semibold text-navy">{headingText}</h2>
                )}
                {section.body && (
                  <p className="mt-4 text-base leading-8 text-slate">{section.body}</p>
                )}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function HighlightCards({ highlights = [] }) {
  if (!highlights.length) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {highlights.map((item, index) => (
        <div
          key={item.title || index}
          className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
        >
          <h3 className="font-semibold text-navy">{item.title}</h3>
          <p className="mt-3 text-base leading-8 text-slate">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function PageCTA({ href, label, title, description }) {
  return (
    <div className="rounded-2xl bg-navy-deep p-8 text-white shadow-sm sm:p-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover"
      >
        {label}
      </Link>
    </div>
  );
}
