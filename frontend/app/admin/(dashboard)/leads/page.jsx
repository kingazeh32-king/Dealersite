'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
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
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Leads</h1>
      <p className="mt-1 text-sm text-slate">Quote requests and newsletter signups.</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-light/50">
            <tr>
              <th className="px-4 py-3 font-semibold text-navy">Date</th>
              <th className="px-4 py-3 font-semibold text-navy">Type</th>
              <th className="px-4 py-3 font-semibold text-navy">Name</th>
              <th className="px-4 py-3 font-semibold text-navy">Email</th>
              <th className="px-4 py-3 font-semibold text-navy">Phone</th>
              <th className="px-4 py-3 font-semibold text-navy">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate">Loading...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate">No leads yet.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="align-top hover:bg-slate-light/30">
                  <td className="px-4 py-3 whitespace-nowrap text-slate">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.type === 'prequalify' ? 'pending' : 'new'} />
                    <span className="ml-1 capitalize text-slate">{lead.type}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{lead.name || '—'}</td>
                  <td className="px-4 py-3 text-slate">{lead.email}</td>
                  <td className="px-4 py-3 text-slate">{lead.phone || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {lead.income_range && <div>Income: {lead.income_range}</div>}
                    {lead.credit_range && <div>Credit: {lead.credit_range}</div>}
                    {lead.desired_price && <div>Budget: {formatPrice(lead.desired_price)}</div>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
