'use client';

import { useAuth } from '@/context/AuthContext';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import ChangeEmailForm from '@/components/admin/ChangeEmailForm';

export default function AdminAccountPage() {
  const { admin } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Account</h1>
      <p className="mt-1 text-slate">
        Signed in as <span className="font-medium text-navy">{admin?.email}</span>
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Change email</h2>
          <p className="mt-1 text-sm text-slate">
            Update the address you use to sign in.
          </p>
          <div className="mt-6">
            <ChangeEmailForm />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Change password</h2>
          <p className="mt-1 text-sm text-slate">
            Update your admin password. You will stay signed in after changing it.
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
