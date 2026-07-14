'use client';

import { useAuth } from '@/context/AuthContext';
import FaqForm from '@/components/admin/FaqForm';

export default function NewFaqPage() {
  const { token } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add FAQ</h1>
      <div className="mt-8"><FaqForm token={token} /></div>
    </div>
  );
}
