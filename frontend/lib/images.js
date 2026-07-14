const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(
    '/api',
    ''
  );

function normalizePath(path) {
  if (!path) return '';
  const value = String(path).trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.replace(/^\\+/, '/').replace(/^\/+/, '/');
}

export function resolveImageUrl(path) {
  const normalized = normalizePath(path);
  if (!normalized) return null;
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
  if (normalized.startsWith('/uploads/')) return `${API_BASE}${normalized}`;
  return `${API_BASE}/uploads/properties/${normalized}`;
}
