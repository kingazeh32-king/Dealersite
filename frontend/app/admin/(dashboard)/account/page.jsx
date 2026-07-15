'use client';

import { useAuth } from '@/context/AuthContext';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import ChangeEmailForm from '@/components/admin/ChangeEmailForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function AdminAccountPage() {
  const { admin } = useAuth();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Settings"
        title="Account"
        description={
          <>
            Signed in as{' '}
            <span className="font-medium text-navy">{admin?.email}</span>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-navy">Change email</h2>
          <p className="mt-1 text-sm text-slate">
            Update the address you use to sign in.
          </p>
          <div className="mt-6">
            <ChangeEmailForm />
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-navy">Change password</h2>
          <p className="mt-1 text-sm text-slate">
            Update your admin password. You will stay signed in after changing it.
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
