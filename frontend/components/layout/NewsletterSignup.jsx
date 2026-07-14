'use client';

import { useState } from 'react';
import { insertLead } from '@/lib/supabaseClient';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      await insertLead({
        type: 'newsletter',
        email: email.trim(),
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-gold/30 bg-white/5 p-4">
        <p className="font-medium text-white">You&apos;re subscribed!</p>
        <p className="mt-1 text-sm text-slate-300">
          Thanks for joining — we&apos;ll send updates on new inventory and buying tips.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-3 text-sm font-medium text-gold hover:text-gold-hover"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
      <label htmlFor="newsletter-email" className="block text-sm font-semibold text-white">
        Stay in the loop
      </label>
      <p className="mt-1 text-sm text-slate-400">
        New inventory, buying guides, and financing tips — no spam.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && error && (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
