'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function EditTestimonialPage() {
  const { token } = useAuth();
  const params = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!token || !params.id) return;
    api.getAdminTestimonial(token, params.id).then((data) => setItem(data.testimonial));
  }, [token, params.id]);

  if (!item) return <div className="h-40 animate-pulse rounded-lg bg-slate-200" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Edit Testimonial</h1>
      <div className="mt-8"><TestimonialForm token={token} testimonial={item} /></div>
    </div>
  );
}
