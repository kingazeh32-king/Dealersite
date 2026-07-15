'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import ResourceForm from '@/components/admin/ResourceForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function EditResourcePage() {
  const { token } = useAuth();
  const params = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!token || !params.id) return;
    api.getAdminResource(token, params.id).then((data) => setItem(data.resource));
  }, [token, params.id]);

  if (!item) return <div className="h-40 animate-pulse bg-slate-200" />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Edit Article"
        description={item.title}
      />
      <AdminPanel className="p-5 sm:p-6">
        <ResourceForm token={token} resource={item} />
      </AdminPanel>
    </div>
  );
}
