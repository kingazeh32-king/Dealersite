'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { InquiryStatusSelect } from '@/components/admin/StatusBadge';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminInquiries(token, { limit: 100 });
      setInquiries(data.rows || []);
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

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    try {
      await api.updateInquiryStatus(token, id, status);
      setInquiries((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const newCount = inquiries.filter((item) => item.status === 'new').length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Listings & leads"
        title="Inquiries"
        description="Contact form submissions from the website."
        meta={
          !loading ? (
            <p className="text-sm text-slate">
              <span className="font-semibold tabular-nums text-navy">{newCount}</span> new
              {' · '}
              <span className="font-semibold tabular-nums text-navy">
                {inquiries.length}
              </span>{' '}
              total
            </p>
          ) : null
        }
      />

      <AdminTable
        columns={['Date', 'Name', 'Contact', 'Property', 'Type', 'Status']}
        loading={loading}
        empty="No inquiries yet."
      >
        {inquiries.map((inq) => (
          <tr
            key={inq.id}
            className={`align-top transition-colors hover:bg-slate-light/40 ${
              inq.status === 'new' ? 'bg-gold/[0.03]' : ''
            }`}
          >
            <td className="whitespace-nowrap px-4 py-4 text-slate">
              {new Date(inq.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-4 font-medium text-navy">{inq.name}</td>
            <td className="px-4 py-4 text-slate">
              {inq.email && <div>{inq.email}</div>}
              {inq.phone && <div className="text-xs">{inq.phone}</div>}
            </td>
            <td className="px-4 py-4 text-slate">
              {inq.property_name || '—'}
              {inq.message && (
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate">
                  {inq.message}
                </p>
              )}
            </td>
            <td className="px-4 py-4 capitalize text-slate">{inq.inquiry_type}</td>
            <td className="px-4 py-4">
              <InquiryStatusSelect
                value={inq.status}
                disabled={updatingId === inq.id}
                onChange={(status) => handleStatusChange(inq.id, status)}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
