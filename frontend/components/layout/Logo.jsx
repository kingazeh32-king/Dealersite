'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Logo({
  width = 160,
  height = 40,
  className = '',
}) {
  const { settings } = useSiteSettings();
  const src = settings.logoUrl || '/logo.svg';
  const alt = `${settings.siteName} logo`;

  if (src.endsWith('.svg') && !src.startsWith('http')) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Image src={src} alt={alt} width={width} height={height} priority />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        key={src}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-10 w-auto"
      />
    </div>
  );
}
