'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getInitials, normalizeTeamMember, toTeamPayload } from '@/lib/team';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from '@/lib/adminUi';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  email: '',
  sortOrder: '0',
  isPublished: true,
};

function toForm(member) {
  if (!member) return emptyForm;
  const normalized = normalizeTeamMember(member);
  return {
    name: normalized.name || '',
    role: normalized.role || '',
    bio: normalized.bio || '',
    email: normalized.email || '',
    sortOrder: String(normalized.sortOrder ?? 0),
    isPublished: normalized.isPublished ?? true,
  };
}

export default function TeamMemberForm({ token, member }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const isEdit = !!member;
  const [form, setForm] = useState(() => toForm(member));
  const [photoUrl, setPhotoUrl] = useState(
    member?.photo_url ? normalizeTeamMember(member).photoUrl : null
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file || !token || !member?.id) return;

    setUploading(true);
    setError('');

    try {
      const data = await api.uploadTeamPhoto(token, member.id, file);
      setPhotoUrl(normalizeTeamMember(data.member).photoUrl);
    } catch (err) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const payload = toTeamPayload(form);

      if (isEdit) {
        await api.updateTeamMember(token, member.id, payload);
        router.push('/admin/team');
      } else {
        const data = await api.createTeamMember(token, payload);
        router.push(`/admin/team/${data.member.id}/edit`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save team member');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {isEdit && (
        <div className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium text-navy">Photo</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={form.name}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gold/30"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                {getInitials(form.name)}
              </div>
            )}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handlePhotoChange}
                className="text-sm text-slate"
              />
              <p className="mt-1 text-xs text-slate">
                {uploading ? 'Uploading…' : 'JPEG, PNG, WebP, or GIF'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Role / title</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            placeholder="e.g. Sales Manager"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy">Sort order</label>
          <input
            type="number"
            name="sortOrder"
            min="0"
            value={form.sortOrder}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="border-slate-300 text-gold focus:ring-gold"
          />
          <label htmlFor="isPublished" className="text-sm text-navy">
            Published on website
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className={adminPrimaryBtnClass}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create & add photo'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/team')}
          className={adminSecondaryBtnClass}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
