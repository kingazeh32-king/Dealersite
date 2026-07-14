'use client';

import { useAuth } from '@/context/AuthContext';
import PropertyForm from '@/components/admin/PropertyForm';

export default function NewPropertyPage() {
  const { token } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Property</h1>
      <p className="mt-1 text-sm text-slate">
        Create the listing first — you&apos;ll be able to upload photos on the next screen.
      </p>
      <div className="mt-8">
        <PropertyForm token={token} />
      </div>
    </div>
  );
}
