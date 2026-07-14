'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

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
    load();
  }, [load]);

  async function handleDelete(id, name) {
    if (!confirm(`Remove "${name}" from the team section?`)) return;
    await api.deleteTeamMember(token, id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Team</h1>
          <p className="mt-1 text-sm text-slate">
            Manage staff cards shown on the home page.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy-deep hover:bg-gold-hover"
        >
          + Add Team Member
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-light/50">
            <tr>
              <th className="px-4 py-3 font-semibold text-navy">Name</th>
              <th className="px-4 py-3 font-semibold text-navy">Role</th>
              <th className="px-4 py-3 font-semibold text-navy">Order</th>
              <th className="px-4 py-3 font-semibold text-navy">Published</th>
              <th className="px-4 py-3 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate">
                  No team members yet.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-light/30">
                  <td className="px-4 py-3 font-medium text-navy">{member.name}</td>
                  <td className="px-4 py-3 text-slate">{member.role}</td>
                  <td className="px-4 py-3 text-slate">{member.sort_order}</td>
                  <td className="px-4 py-3 text-slate">
                    {member.is_published ? 'Yes' : 'Hidden'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/team/${member.id}/edit`}
                        className="font-medium text-navy hover:text-gold"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id, member.name)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
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
