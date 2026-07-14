'use client';

import { getInitials } from '@/lib/team';
import { useLoopingCarousel } from '@/hooks/useLoopingCarousel';

function TeamCard({ member }) {
  return (
    <article
      className="flex h-full min-w-[85%] snap-start flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md sm:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)]"
      aria-label={`Team member ${member.name}`}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mx-auto">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-gold/30"
            />
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white ring-2 ring-gold/30"
              aria-hidden="true"
            >
              {getInitials(member.name)}
            </div>
          )}
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-lg font-semibold text-navy">{member.name}</h3>
          <p className="mt-1 text-sm font-medium text-gold">{member.role}</p>
        </div>

        {member.bio && (
          <p className="mt-4 flex-1 text-center text-sm leading-relaxed text-slate">
            {member.bio}
          </p>
        )}
      </div>
    </article>
  );
}

export default function TeamSection({ members = [] }) {
  const {
    scrollRef,
    loopItems,
    activeIndex,
    goNext,
    goPrev,
    goTo,
    handleScroll,
    handleScrollEnd,
    pauseProps,
  } = useLoopingCarousel(members);

  if (!members.length) return null;

  return (
    <section
      className="bg-slate-light/40 py-16 sm:py-20"
      aria-labelledby="team-heading"
      {...pauseProps}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our Team</p>
            <h2 id="team-heading" className="mt-2 text-3xl font-bold text-navy">
              People who guide you home
            </h2>
            <p className="mt-2 text-slate">
              From your first visit to move-in day, our specialists are here to answer
              questions and make the process straightforward.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full border border-slate-200 bg-white p-2 text-navy transition-colors hover:border-gold hover:text-gold"
              aria-label="Previous team member"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-slate-200 bg-white p-2 text-navy transition-colors hover:border-gold hover:text-gold"
              aria-label="Next team member"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onScrollEnd={handleScrollEnd}
          className="testimonial-track mt-10 flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loopItems.map((member, index) => (
            <TeamCard key={`${member.id}-${index}`} member={member} />
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Team member slides">
          {members.map((member, index) => (
            <button
              key={member.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to ${member.name}`}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-6 bg-gold' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
