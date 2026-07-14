'use client';

import { useAuth } from '@/context/AuthContext';
import ResourceForm from '@/components/admin/ResourceForm';

export default function NewResourcePage() {
  const { token } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Article</h1>
      <div className="mt-8"><ResourceForm token={token} /></div>
    </div>
  );
}
