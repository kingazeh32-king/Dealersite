'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await api.forgotPassword(email);
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy">
          Admin email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="admin@dealersite.com"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-navy-deep hover:bg-gold-hover disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-center text-sm text-slate">
        <Link href="/admin/login" className="font-medium text-navy hover:text-gold">
          ← Back to sign in
        </Link>
      </p>
    </form>
  );
}
