'use client';

import { useLoopingCarousel } from '@/hooks/useLoopingCarousel';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-gold' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <article
      className="flex h-full min-w-[85%] snap-start flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)]"
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-slate">
        <span className="text-gold" aria-hidden="true">
          &ldquo;
        </span>
        {testimonial.quote}
        <span className="text-gold" aria-hidden="true">
          &rdquo;
        </span>
      </blockquote>
      <footer className="mt-6 border-t border-slate-100 pt-4">
        <p className="font-semibold text-navy">{testimonial.name}</p>
        <p className="mt-0.5 text-sm text-slate">{testimonial.location}</p>
        {testimonial.home && (
          <p className="mt-1 text-xs font-medium text-gold">Purchased: {testimonial.home}</p>
        )}
      </footer>
    </article>
  );
}

export default function Testimonials({ items = [] }) {
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
  } = useLoopingCarousel(items);

  if (!items.length) return null;

  return (
    <section
      className="border-y border-slate-200 bg-white py-16 sm:py-20"
      aria-labelledby="testimonials-heading"
      {...pauseProps}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Customer Stories
            </p>
            <h2 id="testimonials-heading" className="mt-2 text-3xl font-bold text-navy">
              What our buyers are saying
            </h2>
            <p className="mt-2 max-w-xl text-slate">
              Real families who found their home through us — from first inquiry to move-in day.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full border border-slate-200 p-2 text-navy transition-colors hover:border-gold hover:text-gold"
              aria-label="Previous testimonial"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-slate-200 p-2 text-navy transition-colors hover:border-gold hover:text-gold"
              aria-label="Next testimonial"
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
          {loopItems.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonial slides">
          {items.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to testimonial ${index + 1}`}
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
