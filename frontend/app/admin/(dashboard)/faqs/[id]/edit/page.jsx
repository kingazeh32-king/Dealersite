'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import FaqForm from '@/components/admin/FaqForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function EditFaqPage() {
  const { token } = useAuth();
  const params = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!token || !params.id) return;
    api.getAdminFaq(token, params.id).then((data) => setItem(data.faq));
  }, [token, params.id]);

  if (!item) return <div className="h-40 animate-pulse bg-slate-200" />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Edit FAQ"
        description="Update this frequently asked question."
      />
      <AdminPanel className="p-5 sm:p-6">
        <FaqForm token={token} faq={item} />
      </AdminPanel>
    </div>
  );
}
