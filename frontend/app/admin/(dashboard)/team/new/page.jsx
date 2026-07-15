'use client';

import { useAuth } from '@/context/AuthContext';
import TeamMemberForm from '@/components/admin/TeamMemberForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function Page() {
  const { token } = useAuth();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Add Team Member"
        description="Create the profile first, then upload a photo on the edit page."
      />
      <AdminPanel className="p-5 sm:p-6">
        <TeamMemberForm token={token} />
      </AdminPanel>
    </div>
  );
}
