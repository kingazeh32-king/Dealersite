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

export default function AdminTestimonialsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminTestimonials(token);
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

  async function handleDelete(id, name) {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    await api.deleteTestimonial(token, id);
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Testimonials"
        description="Customer stories shown in the home page carousel."
        actions={
          <Link href="/admin/testimonials/new" className={adminPrimaryBtnClass}>
            + Add Testimonial
          </Link>
        }
      />

      <AdminTable
        columns={['Name', 'Location', 'Order', 'Published', 'Actions']}
        loading={loading}
        empty="No testimonials yet."
      >
        {items.map((item) => (
          <tr key={item.id} className="transition-colors hover:bg-slate-light/40">
            <td className="px-4 py-4 font-medium text-navy">{item.name}</td>
            <td className="px-4 py-4 text-slate">{item.location || '—'}</td>
            <td className="px-4 py-4 tabular-nums text-slate">{item.sort_order}</td>
            <td className="px-4 py-4">
              <StatusBadge status={item.is_published ? 'published' : 'hidden'} />
            </td>
            <td className="px-4 py-4">
              <div className="flex gap-3">
                <Link
                  href={`/admin/testimonials/${item.id}/edit`}
                  className={adminActionLinkClass}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
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
