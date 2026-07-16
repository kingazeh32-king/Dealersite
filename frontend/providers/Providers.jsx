'use client';

import { AuthProvider } from '@/context/AuthContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <SiteSettingsProvider>{children}</SiteSettingsProvider>
    </AuthProvider>
  );
}
