'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) {
      router.replace('/admin');
    }
  }, [loading, token, router]);

  if (loading || token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-light/50">
        <p className="text-slate">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-light/50 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Sign in</h1>
        <p className="mt-2 text-sm text-slate">
          Manage inventory, inquiries, and leads.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-slate">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
        <Link href="/" className="mt-6 block text-center text-sm text-slate hover:text-navy">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
