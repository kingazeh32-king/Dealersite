'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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
    load();
  }, [load]);

  async function handleStatusChange(id, status) {
    await api.updateInquiryStatus(token, id, status);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Inquiries</h1>
      <p className="mt-1 text-sm text-slate">Contact form submissions from the website.</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-light/50">
            <tr>
              <th className="px-4 py-3 font-semibold text-navy">Date</th>
              <th className="px-4 py-3 font-semibold text-navy">Name</th>
              <th className="px-4 py-3 font-semibold text-navy">Contact</th>
              <th className="px-4 py-3 font-semibold text-navy">Property</th>
              <th className="px-4 py-3 font-semibold text-navy">Type</th>
              <th className="px-4 py-3 font-semibold text-navy">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate">Loading...</td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate">No inquiries yet.</td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="align-top hover:bg-slate-light/30">
                  <td className="px-4 py-3 whitespace-nowrap text-slate">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{inq.name}</td>
                  <td className="px-4 py-3 text-slate">
                    {inq.email && <div>{inq.email}</div>}
                    {inq.phone && <div>{inq.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {inq.property_name || '—'}
                    {inq.message && (
                      <p className="mt-1 max-w-xs text-xs text-slate">{inq.message}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate">{inq.inquiry_type}</td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className="rounded border border-slate-200 px-2 py-1 text-xs capitalize"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="resolved">Resolved</option>
                    </select>
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
