'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import TeamMemberForm from '@/components/admin/TeamMemberForm';

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
    return <div className="h-40 animate-pulse rounded-lg bg-slate-200" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Edit Team Member</h1>
      <p className="mt-1 text-sm text-slate">Update {member.name}&apos;s profile and photo.</p>
      <div className="mt-8">
        <TeamMemberForm token={token} member={member} />
      </div>
    </div>
  );
}
