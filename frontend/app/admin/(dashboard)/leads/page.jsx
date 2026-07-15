'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';

function formatPrice(price) {
  if (!price) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export default function AdminLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminLeads(token, { limit: 100 });
      setLeads(data.rows || []);
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Listings & leads"
        title="Leads"
        description="Quote requests and newsletter signups from the public site."
        meta={
          !loading ? (
            <span className="text-sm text-slate">
              <span className="font-semibold tabular-nums text-navy">{leads.length}</span>{' '}
              total
            </span>
          ) : null
        }
      />

      <AdminTable
        columns={['Date', 'Type', 'Name', 'Email', 'Phone', 'Details']}
        loading={loading}
        empty="No leads yet."
      >
        {leads.map((lead) => (
          <tr key={lead.id} className="align-top transition-colors hover:bg-slate-light/40">
            <td className="whitespace-nowrap px-4 py-4 text-slate">
              {new Date(lead.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-4">
              <div className="flex flex-col items-start gap-2">
                <StatusBadge status={lead.type === 'prequalify' ? 'pending' : 'new'} />
                <span className="text-xs capitalize text-slate">{lead.type}</span>
              </div>
            </td>
            <td className="px-4 py-4 font-medium text-navy">{lead.name || '—'}</td>
            <td className="px-4 py-4 text-slate">{lead.email}</td>
            <td className="px-4 py-4 text-slate">{lead.phone || '—'}</td>
            <td className="px-4 py-4 text-xs leading-relaxed text-slate">
              {lead.income_range && <div>Income: {lead.income_range}</div>}
              {lead.credit_range && <div>Credit: {lead.credit_range}</div>}
              {lead.desired_price && <div>Budget: {formatPrice(lead.desired_price)}</div>}
              {!lead.income_range && !lead.credit_range && !lead.desired_price && '—'}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
