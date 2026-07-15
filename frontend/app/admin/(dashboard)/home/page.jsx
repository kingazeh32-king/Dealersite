'use client';

import { useAuth } from '@/context/AuthContext';
import HomePageForm from '@/components/admin/HomePageForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function AdminHomePage() {
  const { token } = useAuth();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Home Page"
        description="Edit the hero banner, trust signals, and homepage sections."
      />
      <HomePageForm token={token} />
    </div>
  );
}
