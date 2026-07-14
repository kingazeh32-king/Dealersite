'use client';

import { useAuthGuard } from '@/context/AuthContext';
import AdminShell from './AdminShell';

export default function AdminGuard({ children }) {
  const { loading, isAuthed } = useAuthGuard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-light/50">
        <p className="text-slate">Loading...</p>
      </div>
    );
  }

  if (!isAuthed) return null;

  return <AdminShell>{children}</AdminShell>;
}
