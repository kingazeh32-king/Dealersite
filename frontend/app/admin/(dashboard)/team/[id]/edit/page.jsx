'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import TeamMemberForm from '@/components/admin/TeamMemberForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function EditTeamMemberPage() {
  const { token } = useAuth();
  const params = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !params.id) return;

    api
      .getAdminTeamMember(token, params.id)
      .then((data) => setMember(data.member))
      .catch(() => setError('Team member not found'));
  }, [token, params.id]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!member) {
    return <div className="h-40 animate-pulse bg-slate-200" />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Edit Team Member"
        description={`Update ${member.name}'s profile and photo.`}
      />
      <AdminPanel className="p-5 sm:p-6">
        <TeamMemberForm token={token} member={member} />
      </AdminPanel>
    </div>
  );
}
