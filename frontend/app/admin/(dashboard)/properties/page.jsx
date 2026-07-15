'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import { PropertyStatusSelect } from '@/components/admin/StatusBadge';
import {
  adminActionLinkClass,
  adminDangerLinkClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export default function AdminPropertiesPage() {
  const { token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminProperties(token, { limit: 100 });
      setProperties(data.rows || []);
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
      await api.updatePropertyStatus(token, id, status);
      setProperties((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.deleteProperty(token, id);
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Listings & leads"
        title="Properties"
        description="Manage home listings, status, and featured inventory."
        actions={
          <Link href="/admin/properties/new" className={adminPrimaryBtnClass}>
            + Add Property
          </Link>
        }
        meta={
          !loading ? (
            <span className="text-sm text-slate">
              <span className="font-semibold tabular-nums text-navy">
                {properties.length}
              </span>{' '}
              listings
            </span>
          ) : null
        }
      />

      <AdminTable
        columns={['Name', 'Category', 'Price', 'Status', 'Featured', 'Actions']}
        loading={loading}
        empty="No properties yet."
      >
        {properties.map((p) => (
          <tr key={p.id} className="align-middle transition-colors hover:bg-slate-light/40">
            <td className="px-4 py-4 font-medium text-navy">{p.name}</td>
            <td className="px-4 py-4 capitalize text-slate">{p.category}</td>
            <td className="px-4 py-4 tabular-nums text-navy">{formatPrice(p.price)}</td>
            <td className="px-4 py-4">
              <PropertyStatusSelect
                value={p.status}
                disabled={updatingId === p.id}
                onChange={(status) => handleStatusChange(p.id, status)}
              />
            </td>
            <td className="px-4 py-4 text-slate">{p.is_featured ? 'Yes' : '—'}</td>
            <td className="px-4 py-4">
              <div className="flex gap-3">
                <Link href={`/admin/properties/${p.id}/edit`} className={adminActionLinkClass}>
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
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
