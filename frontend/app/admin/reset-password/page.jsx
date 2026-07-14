import { Suspense } from 'react';
import ResetPasswordForm from '@/components/admin/ResetPasswordForm';
import Link from 'next/link';

export const metadata = {
  title: 'Set New Password',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-light/50 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Choose a new password</h1>
        <p className="mt-2 text-sm text-slate">
          Enter your new password below. This link expires after one hour.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-slate">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
        <Link href="/" className="mt-6 block text-center text-sm text-slate hover:text-navy">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
