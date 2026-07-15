'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [siteName, setSiteName] = useState('');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Settings"
        title="Site Settings"
        description={`Manage your dealership name, logo, and contact details shown across the public site.${
          siteName ? ` Currently: ${siteName}.` : ''
        }`}
      />

      <SiteSettingsForm
        token={token}
        onSaved={(settings) => setSiteName(settings.siteName)}
      />
    </div>
  );
}
