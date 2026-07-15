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

export default function AdminTeamPage() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminTeamMembers(token);
      setMembers(data.rows || []);
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
    if (!confirm(`Remove "${name}" from the team section?`)) return;
    await api.deleteTeamMember(token, id);
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Team"
        description="Staff cards shown on the home page."
        actions={
          <Link href="/admin/team/new" className={adminPrimaryBtnClass}>
            + Add Team Member
          </Link>
        }
      />

      <AdminTable
        columns={['Name', 'Role', 'Order', 'Published', 'Actions']}
        loading={loading}
        empty="No team members yet."
      >
        {members.map((member) => (
          <tr key={member.id} className="transition-colors hover:bg-slate-light/40">
            <td className="px-4 py-4 font-medium text-navy">{member.name}</td>
            <td className="px-4 py-4 text-slate">{member.role}</td>
            <td className="px-4 py-4 tabular-nums text-slate">{member.sort_order}</td>
            <td className="px-4 py-4">
              <StatusBadge status={member.is_published ? 'published' : 'hidden'} />
            </td>
            <td className="px-4 py-4">
              <div className="flex gap-3">
                <Link
                  href={`/admin/team/${member.id}/edit`}
                  className={adminActionLinkClass}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id, member.name)}
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
