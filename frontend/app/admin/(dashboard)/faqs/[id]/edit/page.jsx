'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import FaqForm from '@/components/admin/FaqForm';

export default function EditFaqPage() {
  const { token } = useAuth();
  const params = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!token || !params.id) return;
    api.getAdminFaq(token, params.id).then((data) => setItem(data.faq));
  }, [token, params.id]);

  if (!item) return <div className="h-40 animate-pulse rounded-lg bg-slate-200" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Edit FAQ</h1>
      <div className="mt-8"><FaqForm token={token} faq={item} /></div>
    </div>
  );
}
