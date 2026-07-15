/** @type {import('next').NextConfig} */

function parseUrlOrigin(raw) {
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function buildRemotePatterns() {
  const patterns = [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '5000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '5000',
      pathname: '/uploads/**',
    },
  ];

  const apiOrigin = parseUrlOrigin(process.env.NEXT_PUBLIC_API_URL);
  if (apiOrigin) {
    patterns.push({
      protocol: apiOrigin.protocol.replace(':', ''),
      hostname: apiOrigin.hostname,
      ...(apiOrigin.port ? { port: apiOrigin.port } : {}),
      pathname: '/uploads/**',
    });
  }

  const extraHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  for (const host of extraHosts) {
    const asUrl = parseUrlOrigin(
      host.includes('://') ? host : `https://${host}`
    );
    if (!asUrl) continue;

    patterns.push({
      protocol: asUrl.protocol.replace(':', ''),
      hostname: asUrl.hostname,
      ...(asUrl.port ? { port: asUrl.port } : {}),
      pathname: '/**',
    });
  }

  return patterns;
}

const nextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

export default nextConfig;
