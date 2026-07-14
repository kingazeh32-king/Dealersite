'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          placeholder="admin@dealersite.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {resetSuccess && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          Password reset successfully. Sign in with your new password.
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-navy-deep hover:bg-gold-hover disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="text-center text-sm">
        <Link href="/admin/forgot-password" className="text-slate hover:text-navy">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
