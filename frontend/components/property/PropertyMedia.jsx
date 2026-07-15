import { resolveImageUrl } from '@/lib/images';

function resolveMediaUrl(path) {
  if (!path) return null;
  return resolveImageUrl(path);
}

function isVideoSource(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('/uploads/tours/') ||
    /\.(mp4|webm|mov)(\?|$)/i.test(lower)
  );
}

export default function PropertyMedia({ virtualTour, pdfFloorplan }) {
  const tourUrl = resolveMediaUrl(virtualTour);
  const pdfUrl = resolveMediaUrl(pdfFloorplan);
  const tourIsVideo = isVideoSource(tourUrl || virtualTour);

  if (!tourUrl && !pdfUrl) return null;

  return (
    <section className="mt-8 space-y-8">
      {tourUrl && (
        <div>
          <h2 className="text-xl font-semibold text-navy">Virtual Tour</h2>
          <p className="mt-2 text-sm text-slate">
            {tourIsVideo
              ? 'Watch a walkthrough of this home.'
              : 'Explore this home with our interactive 360° walkthrough.'}
          </p>
          <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-light">
            {tourIsVideo ? (
              <video
                src={tourUrl}
                controls
                playsInline
                className="h-full w-full object-cover"
                title="Virtual tour"
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <iframe
                src={tourUrl}
                title="Virtual tour"
                className="h-full w-full"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}

      {pdfUrl && (
        <div>
          <h2 className="text-xl font-semibold text-navy">Floor Plan</h2>
          <p className="mt-2 text-sm text-slate">
            Download or view the detailed floor plan for this home.
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            View Floor Plan (PDF)
          </a>
        </div>
      )}
    </section>
  );
}
