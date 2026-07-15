'use client';

import { useAuth } from '@/context/AuthContext';
import PropertyForm from '@/components/admin/PropertyForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function NewPropertyPage() {
  const { token } = useAuth();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Listings & leads"
        title="Add Property"
        description="Create the listing first, then upload photos, tour video, and floor plan on the edit page."
      />
      <AdminPanel className="p-5 sm:p-6">
        <PropertyForm token={token} />
      </AdminPanel>
    </div>
  );
}
