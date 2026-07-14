'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageEditorForm from '@/components/admin/PageEditorForm';

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
    <div>
      <h1 className="text-2xl font-bold text-navy">Edit {label}</h1>
      <p className="mt-1 text-sm text-slate">
        Changes appear on the public page and home page teaser.
      </p>
      <div className="mt-8">
        <PageEditorForm token={token} slug={slug} pageLabel={label} />
      </div>
    </div>
  );
}
