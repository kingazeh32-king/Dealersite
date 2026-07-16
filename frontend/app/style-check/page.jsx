export const metadata = {
  title: 'Style check',
  robots: { index: false, follow: false },
};

/**
 * Diagnostic page for phones where the main site looks unstyled.
 * - Red box = browser can render CSS at all (inline)
 * - Navy/gold box = Tailwind stylesheet loaded
 */
export default function StyleCheckPage() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Style check</h1>

      <div
        style={{
          background: '#dc2626',
          color: '#fff',
          padding: 16,
          marginBottom: 16,
          fontWeight: 700,
        }}
      >
        INLINE OK — if you see a red box, basic CSS works on this phone.
      </div>

      <div className="mb-4 bg-navy-deep p-4 font-bold text-white">
        TAILWIND OK — navy box means the site stylesheet loaded.
      </div>

      <div className="border border-slate-200 bg-gold p-4 font-semibold text-navy-deep">
        Gold panel — also from Tailwind.
      </div>

      <p style={{ marginTop: 24, color: '#64748b', fontSize: 14, lineHeight: 1.5 }}>
        If the red box shows but the navy/gold boxes look plain (no background), Chrome
        is blocking or failing to load <code>/_next/static/...css</code>. Try Incognito
        with extensions off, or disable data saver / ad blockers for this site.
      </p>
    </main>
  );
}
