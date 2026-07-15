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

export default function AdminFaqsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminFaqs(token);
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

  async function handleDelete(id) {
    if (!confirm('Delete this FAQ?')) return;
    await api.deleteFaq(token, id);
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="FAQs"
        description="Frequently asked questions shown on the public site."
        actions={
          <Link href="/admin/faqs/new" className={adminPrimaryBtnClass}>
            + Add FAQ
          </Link>
        }
      />

      <AdminTable
        columns={['Question', 'Category', 'Order', 'Published', 'Actions']}
        loading={loading}
        empty="No FAQs yet."
      >
        {items.map((item) => (
          <tr key={item.id} className="transition-colors hover:bg-slate-light/40">
            <td className="max-w-md truncate px-4 py-4 font-medium text-navy">
              {item.question}
            </td>
            <td className="px-4 py-4 capitalize text-slate">{item.category}</td>
            <td className="px-4 py-4 tabular-nums text-slate">{item.sort_order}</td>
            <td className="px-4 py-4">
              <StatusBadge status={item.is_published ? 'published' : 'hidden'} />
            </td>
            <td className="px-4 py-4">
              <div className="flex gap-3">
                <Link href={`/admin/faqs/${item.id}/edit`} className={adminActionLinkClass}>
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
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
