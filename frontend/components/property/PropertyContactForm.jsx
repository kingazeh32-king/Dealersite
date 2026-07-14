'use client';

import { useState } from 'react';
import { insertInquiry } from '@/lib/supabaseClient';

const initialForm = { name: '', email: '', phone: '', message: '' };

export default function PropertyContactForm({ property }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    if (!form.name.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!form.email.trim() && !form.phone.trim()) {
      setStatus('error');
      setErrorMsg('Please enter an email or phone number.');
      return;
    }

    try {
      await insertInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        property_id: property.id,
        property_name: property.name,
        inquiry_type: 'property',
      });
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-navy">Thank you!</p>
        <p className="mt-2 text-slate">
          We received your request about <strong>{property.name}</strong>. Our team will
          contact you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-medium text-gold hover:text-gold-hover"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          placeholder="Jane Smith"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-navy">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <p className="text-xs text-slate">* Email or phone required</p>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          placeholder="I'd like to schedule a viewing or learn more about financing..."
        />
      </div>

      {status === 'error' && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? 'Sending...' : 'Request More Information'}
      </button>
    </form>
  );
}
