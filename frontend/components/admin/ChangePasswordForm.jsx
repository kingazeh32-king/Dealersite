'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

export default function ChangePasswordForm() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
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
    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    if (form.new_password.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.changePassword(token, {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setSuccess('Password updated successfully.');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password');
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
        <label htmlFor="new_password" className="block text-sm font-medium text-navy">
          New password
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.new_password}
          onChange={handleChange}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate">At least 8 characters</p>
      </div>
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-navy">
          Confirm new password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.confirm_password}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={adminPrimaryBtnClass}
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
