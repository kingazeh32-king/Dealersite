'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import PropertyForm from '@/components/admin/PropertyForm';
import PropertyImageManager from '@/components/admin/PropertyImageManager';

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
    load();
  }, [load]);

  if (loading) {
    return <p className="text-slate">Loading...</p>;
  }

  if (!property) {
    return <p className="text-red-600">Property not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Edit Property</h1>
        <p className="mt-1 text-sm text-slate">{property.name}</p>
      </div>

      <PropertyImageManager
        property={property}
        token={token}
        onUpdate={setProperty}
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy">Listing Details</h2>
        <div className="mt-6">
          <PropertyForm token={token} property={property} />
        </div>
      </div>
    </div>
  );
}
