'use client';

import { useAuth } from '@/context/AuthContext';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function NewTestimonialPage() {
  const { token } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Testimonial</h1>
      <div className="mt-8"><TestimonialForm token={token} /></div>
    </div>
  );
}
