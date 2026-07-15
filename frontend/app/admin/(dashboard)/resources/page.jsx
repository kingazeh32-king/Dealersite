'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  adminActionLinkClass,
  adminDangerLinkClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

export default function AdminResourcesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminResources(token);
      setItems(data.rows || []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) void load();
    };
    queueMicrotask(start);
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    await api.deleteResource(token, id);
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Resources"
        description="Buying guides and articles on the public resources section."
        actions={
          <Link href="/admin/resources/new" className={adminPrimaryBtnClass}>
            + Add Article
          </Link>
        }
      />

      <AdminTable
        columns={['Title', 'Type', 'Published', 'Actions']}
        loading={loading}
        empty="No articles yet."
      >
        {items.map((item) => (
          <tr key={item.id} className="transition-colors hover:bg-slate-light/40">
            <td className="px-4 py-4 font-medium text-navy">{item.title}</td>
            <td className="px-4 py-4 capitalize text-slate">{item.type}</td>
            <td className="px-4 py-4">
              <StatusBadge status={item.is_published ? 'published' : 'hidden'} />
            </td>
            <td className="px-4 py-4">
              <div className="flex gap-3">
                <Link
                  href={`/admin/resources/${item.id}/edit`}
                  className={adminActionLinkClass}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className={adminDangerLinkClass}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
