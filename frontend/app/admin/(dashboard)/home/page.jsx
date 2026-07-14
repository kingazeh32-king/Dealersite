'use client';

import { useAuth } from '@/context/AuthContext';
import HomePageForm from '@/components/admin/HomePageForm';

export default function AdminHomePage() {
  const { token } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Home Page</h1>
      <p className="mt-1 text-sm text-slate">Edit the hero banner and trust signals on the landing page.</p>
      <div className="mt-8">
        <HomePageForm token={token} />
      </div>
    </div>
  );
}
