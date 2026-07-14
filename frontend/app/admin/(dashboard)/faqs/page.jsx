'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

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

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id, question) {
    if (!confirm(`Delete this FAQ?`)) return;
    await api.deleteFaq(token, id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">FAQs</h1>
          <p className="mt-1 text-sm text-slate">Manage frequently asked questions.</p>
        </div>
        <Link href="/admin/faqs/new" className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy-deep hover:bg-gold-hover">+ Add FAQ</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-light/50">
            <tr>
              <th className="px-4 py-3 font-semibold text-navy">Question</th>
              <th className="px-4 py-3 font-semibold text-navy">Category</th>
              <th className="px-4 py-3 font-semibold text-navy">Order</th>
              <th className="px-4 py-3 font-semibold text-navy">Published</th>
              <th className="px-4 py-3 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate">No FAQs yet.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-light/30">
                <td className="max-w-md truncate px-4 py-3 font-medium text-navy">{item.question}</td>
                <td className="px-4 py-3 capitalize text-slate">{item.category}</td>
                <td className="px-4 py-3 text-slate">{item.sort_order}</td>
                <td className="px-4 py-3 text-slate">{item.is_published ? 'Yes' : 'Hidden'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/faqs/${item.id}/edit`} className="font-medium text-navy hover:text-gold">Edit</Link>
                    <button type="button" onClick={() => handleDelete(item.id, item.question)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
