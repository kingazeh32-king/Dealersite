'use client';

import { useState } from 'react';
import { insertLead } from '@/lib/supabaseClient';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  income_range: '',
  credit_range: '',
  desired_price: '',
};

const incomeOptions = [
  { value: '', label: 'Select income range' },
  { value: 'Under $35k', label: 'Under $35,000' },
  { value: '$35k–$50k', label: '$35,000 – $50,000' },
  { value: '$50k–$75k', label: '$50,000 – $75,000' },
  { value: '$75k–$100k', label: '$75,000 – $100,000' },
  { value: 'Over $100k', label: 'Over $100,000' },
];

const creditOptions = [
  { value: '', label: 'Select credit range' },
  { value: 'Excellent (740+)', label: 'Excellent (740+)' },
  { value: 'Good (670–739)', label: 'Good (670–739)' },
  { value: 'Fair (580–669)', label: 'Fair (580–669)' },
  { value: 'Needs improvement (below 580)', label: 'Needs improvement (below 580)' },
  { value: 'Not sure', label: 'Not sure' },
];

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

export default function RequestQuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
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
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!form.email.trim()) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      await insertLead({
        type: 'prequalify',
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        income_range: form.income_range || null,
        credit_range: form.credit_range || null,
        desired_price: form.desired_price ? Number(form.desired_price) : null,
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
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-xl font-semibold text-navy">Thank you for your request!</p>
        <p className="mt-3 text-slate">
          A member of our team will review your information and contact you within
          one business day to discuss financing options and next steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-gold hover:text-gold-hover"
        >
          Submit another request
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
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Jane Smith"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
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
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="income_range" className="block text-sm font-medium text-navy">
            Annual Income
          </label>
          <select
            id="income_range"
            name="income_range"
            value={form.income_range}
            onChange={handleChange}
            className={inputClass}
          >
            {incomeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="credit_range" className="block text-sm font-medium text-navy">
            Credit Range
          </label>
          <select
            id="credit_range"
            name="credit_range"
            value={form.credit_range}
            onChange={handleChange}
            className={inputClass}
          >
            {creditOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="desired_price" className="block text-sm font-medium text-navy">
          Desired Home Price
        </label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate">
            $
          </span>
          <input
            id="desired_price"
            name="desired_price"
            type="number"
            min="0"
            step="1000"
            value={form.desired_price}
            onChange={handleChange}
            className={`${inputClass} pl-8`}
            placeholder="75000"
          />
        </div>
        <p className="mt-1 text-xs text-slate">Approximate budget for your new home</p>
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
        {status === 'loading' ? 'Submitting...' : 'Request a Quote'}
      </button>

      <p className="text-xs leading-relaxed text-slate">
        By submitting this form, you agree to be contacted about home options and financing.
        This is not a credit application and will not affect your credit score.
      </p>
    </form>
  );
}
