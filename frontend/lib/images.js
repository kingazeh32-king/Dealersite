/**
 * Resolve backend media paths to absolute URLs for <img> / next/image.
 * NEXT_PUBLIC_API_URL looks like https://host/api — strip only the trailing /api.
 */

function getApiOrigin() {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return raw.replace(/\/api\/?$/, '');
}

function normalizePath(path) {
  if (!path) return '';
  const value = String(path).trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.replace(/^\\+/, '/').replace(/^\/+/, '/');
}

/** Recover /uploads/... from mangled absolute URLs produced by older clients. */
function extractUploadsPath(url) {
  const match = String(url).match(/\/uploads\/[^\s?#]+/);
  return match ? match[0] : null;
}

export function resolveImageUrl(path) {
  const normalized = normalizePath(path);
  if (!normalized) return null;

  const origin = getApiOrigin();

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    const uploadsPath = extractUploadsPath(normalized);
    let hostOk = false;
    try {
      const parsed = new URL(normalized);
      hostOk = Boolean(parsed.hostname) && !parsed.hostname.startsWith('-');
    } catch {
      hostOk = false;
    }
    if (uploadsPath && !hostOk) {
      return `${origin}${uploadsPath}`;
    }
    return normalized;
  }

  // Frontend public assets (default logo, etc.)
  if (
    normalized === '/logo.svg' ||
    normalized.startsWith('/logo.') ||
    normalized.startsWith('/icons/')
  ) {
    return normalized;
  }

  if (normalized.startsWith('/uploads/')) {
    return `${origin}${normalized}`;
  }

  // Legacy mistaken /api/uploads/... paths
  if (normalized.startsWith('/api/uploads/')) {
    return `${origin}${normalized.slice(4)}`;
  }

  return `${origin}/uploads/properties/${normalized.replace(/^\//, '')}`;
}
