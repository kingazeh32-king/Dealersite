import ForgotPasswordForm from '@/components/admin/ForgotPasswordForm';
import Link from 'next/link';

export const metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-light/50 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Reset password</h1>
        <p className="mt-2 text-sm text-slate">
          Enter your admin email and we will send you a link to choose a new password.
        </p>
        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
        <Link href="/" className="mt-6 block text-center text-sm text-slate hover:text-navy">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
