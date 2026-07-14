import Link from 'next/link';

export default function ResourceNotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-navy">Article Not Found</h1>
      <p className="mt-4 text-slate">This resource may have been removed or is unavailable.</p>
      <Link
        href="/resources"
        className="mt-8 inline-block rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-hover"
      >
        Back to Resources
      </Link>
    </div>
  );
}
