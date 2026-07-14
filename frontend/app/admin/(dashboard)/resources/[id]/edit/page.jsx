'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import ResourceForm from '@/components/admin/ResourceForm';

export default function EditResourcePage() {
  const { token } = useAuth();
  const params = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!token || !params.id) return;
    api.getAdminResource(token, params.id).then((data) => setItem(data.resource));
  }, [token, params.id]);

  if (!item) return <div className="h-40 animate-pulse rounded-lg bg-slate-200" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Edit Article</h1>
      <div className="mt-8"><ResourceForm token={token} resource={item} /></div>
    </div>
  );
}
