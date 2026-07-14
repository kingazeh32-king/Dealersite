'use client';

import { useSiteSettings } from '@/context/SiteSettingsContext';
import { phoneHref, emailHref } from '@/lib/siteSettings';

export default function ContactInfo({ className = '' }) {
  const { settings } = useSiteSettings();
  const contact = settings.contact;

  return (
    <address className={`not-italic ${className}`}>
      <p className="text-sm font-semibold text-white">Contact us</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        <li>
          <a href={phoneHref(contact.phone)} className="hover:text-gold">
            {contact.phone}
          </a>
        </li>
        <li>
          <a href={emailHref(contact.email)} className="hover:text-gold">
            {contact.email}
          </a>
        </li>
        <li>
          {contact.address}
          <br />
          {contact.city}
        </li>
        <li className="text-slate-400">{contact.hours}</li>
      </ul>
    </address>
  );
}
