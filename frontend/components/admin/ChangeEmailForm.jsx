'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

export default function ChangeEmailForm() {
  const { token, refreshAdmin } = useAuth();
  const [form, setForm] = useState({
    current_password: '',
    new_email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.changeEmail(token, {
        current_password: form.current_password,
        new_email: form.new_email,
      });

      if (response?.admin) {
        await refreshAdmin();
      }

      setSuccess('Email updated successfully.');
      setForm({ current_password: '', new_email: '' });
    } catch (err) {
      setError(err.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="current_password" className="block text-sm font-medium text-navy">
          Current password
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          required
          autoComplete="current-password"
          value={form.current_password}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="new_email" className="block text-sm font-medium text-navy">
          New email address
        </label>
        <input
          id="new_email"
          name="new_email"
          type="email"
          required
          autoComplete="email"
          value={form.new_email}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep hover:bg-gold-hover disabled:opacity-60"
      >
        {loading ? 'Updating…' : 'Update email'}
      </button>
    </form>
  );
}
