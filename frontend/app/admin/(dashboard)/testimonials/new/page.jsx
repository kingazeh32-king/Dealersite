'use client';

import { useAuth } from '@/context/AuthContext';
import TestimonialForm from '@/components/admin/TestimonialForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';

export default function Page() {
  const { token } = useAuth();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Add Testimonial"
        description="Add a customer story for the home page carousel."
      />
      <AdminPanel className="p-5 sm:p-6">
        <TestimonialForm token={token} />
      </AdminPanel>
    </div>
  );
}
