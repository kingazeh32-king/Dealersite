'use client';

import { useAuth } from '@/context/AuthContext';
import FaqForm from '@/components/admin/FaqForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function Page() {
  const { token } = useAuth();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Add FAQ"
        description="Add a frequently asked question for the public site."
      />
      <AdminPanel className="p-5 sm:p-6">
        <FaqForm token={token} />
      </AdminPanel>
    </div>
  );
}
