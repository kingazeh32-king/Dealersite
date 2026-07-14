'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [siteName, setSiteName] = useState('');

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
      <p className="mt-1 text-slate">
        Manage your dealership name, logo, and contact details shown across the public site.
        {siteName ? ` Currently: ${siteName}.` : ''}
      </p>

      <div className="mt-8">
        <SiteSettingsForm token={token} onSaved={(settings) => setSiteName(settings.siteName)} />
      </div>
    </div>
  );
}
