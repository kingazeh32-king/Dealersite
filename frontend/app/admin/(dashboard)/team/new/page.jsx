'use client';

import { useAuth } from '@/context/AuthContext';
import TeamMemberForm from '@/components/admin/TeamMemberForm';

export default function NewTeamMemberPage() {
  const { token } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Team Member</h1>
      <p className="mt-1 text-sm text-slate">
        Create the profile first — you&apos;ll be able to upload a photo on the next screen.
      </p>
      <div className="mt-8">
        <TeamMemberForm token={token} />
      </div>
    </div>
  );
}
