'use client';

import { useState } from 'react';
import { insertInquiry } from '@/lib/supabaseClient';

const initialForm = { name: '', email: '', phone: '', message: '' };

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-4 py-2.5 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
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

    setStatus('loading');

    try {
      await insertInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        inquiry_type: 'general',
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
        <p className="text-lg font-semibold text-navy">Message sent!</p>
        <p className="mt-2 text-slate">
          Thank you for reaching out. A member of our team will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-semibold text-gold hover:text-gold-hover"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-navy">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-navy">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <p className="text-xs text-slate">* Email or phone required</p>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-navy">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={inputClass}
          placeholder="How can we help you?"
        />
      </div>

      {status === 'error' && errorMsg && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-hover disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
