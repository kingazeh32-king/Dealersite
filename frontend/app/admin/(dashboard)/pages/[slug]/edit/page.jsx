'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageEditorForm from '@/components/admin/PageEditorForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

const labels = {
  about: 'About Us',
  financing: 'Financing',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms',
};

export default function EditPagePage() {
  const { token } = useAuth();
  const params = useParams();
  const slug = params.slug;
  const label = labels[slug] || slug;

  if (!labels[slug]) {
    return <p className="text-red-600">Unknown page.</p>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title={`Edit ${label}`}
        description="Changes appear on the public page and home page teaser."
      />
      <AdminPanel className="p-5 sm:p-6">
        <PageEditorForm token={token} slug={slug} pageLabel={label} />
      </AdminPanel>
    </div>
  );
}
