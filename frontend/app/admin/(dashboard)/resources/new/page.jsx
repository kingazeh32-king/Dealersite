'use client';

import { useAuth } from '@/context/AuthContext';
import ResourceForm from '@/components/admin/ResourceForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function Page() {
  const { token } = useAuth();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Add Article"
        description="Create a resource or buying guide for the public site."
      />
      <AdminPanel className="p-5 sm:p-6">
        <ResourceForm token={token} />
      </AdminPanel>
    </div>
  );
}
