'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import PropertyForm from '@/components/admin/PropertyForm';
import PropertyImageManager from '@/components/admin/PropertyImageManager';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function EditPropertyPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    const data = await api.getAdminProperties(token, { limit: 100 });
    const found = (data.rows || []).find((p) => p.id === Number(id));
    setProperty(found || null);
    setLoading(false);
  }, [token, id]);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) void load();
    };
    queueMicrotask(start);
    return () => {
      cancelled = true;
    };
  }, [load]);

  if (loading) {
    return <p className="text-slate">Loading…</p>;
  }

  if (!property) {
    return <p className="text-red-600">Property not found.</p>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Listings & leads"
        title="Edit Property"
        description={property.name}
      />

      <PropertyImageManager
        property={property}
        token={token}
        onUpdate={setProperty}
      />

      <AdminPanel title="Listing details" className="">
        <div className="p-5 sm:p-6">
          <PropertyForm
            token={token}
            property={property}
            onPropertyUpdate={setProperty}
          />
        </div>
      </AdminPanel>
    </div>
  );
}
