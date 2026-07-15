'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TrendChart, BarChart } from '@/components/admin/AnalyticsChart';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

function buildMonthlySeries(rows, key = 'created_at') {
  const months = new Map();
  const now = new Date();

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.set(label, 0);
  }

  (rows || []).forEach((item) => {
    const created = item[key] ? new Date(item[key]) : null;
    if (!created || Number.isNaN(created.getTime())) return;
    const label = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
    if (months.has(label)) {
      months.set(label, months.get(label) + 1);
    }
  });

  return Array.from(months.entries()).map(([label, value]) => ({ label, value }));
}

function buildCategoryBreakdown(rows, field) {
  const counts = new Map();
  (rows || []).forEach((item) => {
    const value = item[field] || 'Other';
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function formatWhen(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const quickActions = [
  { href: '/admin/properties/new', label: 'Add property' },
  { href: '/admin/inquiries', label: 'Review inquiries' },
  { href: '/admin/leads', label: 'View leads' },
  { href: '/admin/home', label: 'Edit home page' },
  { href: '/admin/settings', label: 'Site settings' },
];

export default function AdminOverviewPage() {
  const { token, admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    if (!token) return;

    const loadStats = async () => {
      setRefreshing(true);
      try {
        const [properties, inquiries, leads] = await Promise.all([
          api.getAdminProperties(token, { limit: 200 }),
          api.getAdminInquiries(token, { limit: 200 }),
          api.getAdminLeads(token, { limit: 200 }),
        ]);

        const homes = properties.rows || [];
        const inquiryRows = inquiries.rows || [];
        const leadRows = leads.rows || [];
        const newInquiries = inquiryRows.filter((item) => item.status === 'new');

        setStats({
          totalHomes: properties.total,
          available: homes.filter((h) => h.status === 'available').length,
          pending: homes.filter((h) => h.status === 'pending').length,
          sold: homes.filter((h) => h.status === 'sold').length,
          newInquiries: newInquiries.length,
          totalLeads: leads.total,
          monthlyInquiries: buildMonthlySeries(inquiryRows),
          monthlyLeads: buildMonthlySeries(leadRows),
          inquiryTypes: buildCategoryBreakdown(inquiryRows, 'inquiry_type'),
          topCategories: buildCategoryBreakdown(homes, 'category'),
        });
        setRecentInquiries(newInquiries.slice(0, 5));
        setLastUpdated(new Date());
      } finally {
        setRefreshing(false);
      }
    };

    loadStats();
    const intervalId = window.setInterval(loadStats, 30000);
    return () => window.clearInterval(intervalId);
  }, [token]);

  const inventoryTotal = stats
    ? Math.max(stats.available + stats.pending + stats.sold, 1)
    : 1;

  const kpis = stats
    ? [
        {
          label: 'Properties',
          value: stats.totalHomes,
          detail: `${stats.available} available`,
          href: '/admin/properties',
        },
        {
          label: 'New inquiries',
          value: stats.newInquiries,
          detail: 'Needs a reply',
          href: '/admin/inquiries',
          emphasize: stats.newInquiries > 0,
        },
        {
          label: 'Leads',
          value: stats.totalLeads,
          detail: 'Quotes & newsletter',
          href: '/admin/leads',
        },
        {
          label: 'Pending listings',
          value: stats.pending,
          detail: 'In review',
          href: '/admin/properties',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title={admin?.name ? `Welcome back, ${admin.name.split(' ')[0]}` : 'Dashboard'}
        description="Inventory, inquiries, and leads at a glance — so you know what needs attention."
        meta={
          <div className="flex items-center gap-2 text-sm text-slate">
            <span
              className={`h-2 w-2 rounded-full ${refreshing ? 'bg-amber-500' : 'bg-emerald-500'}`}
              aria-hidden
            />
            <span>
              {refreshing
                ? 'Refreshing…'
                : lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : 'Loading…'}
            </span>
          </div>
        }
      />

      <section aria-label="Key metrics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {!stats
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse bg-slate-200" />
              ))
            : kpis.map((kpi) => (
                <Link
                  key={kpi.label}
                  href={kpi.href}
                  className={`group border bg-white p-5 transition-colors hover:border-navy ${
                    kpi.emphasize ? 'border-gold' : 'border-slate-200'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                    {kpi.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums text-navy">
                    {kpi.value}
                  </p>
                  <p className="mt-2 text-sm text-slate group-hover:text-navy">
                    {kpi.detail}
                  </p>
                </Link>
              ))}
        </div>
      </section>

      <section aria-label="Quick actions">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {stats && (
        <>
          <section
            aria-label="Inventory status"
            className="border border-slate-200 bg-white p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate">
                  Inventory status
                </h2>
                <p className="mt-1 text-sm text-slate">
                  How your current listings are split across the pipeline.
                </p>
              </div>
              <Link
                href="/admin/properties"
                className="text-sm font-medium text-navy hover:text-gold"
              >
                Manage properties →
              </Link>
            </div>

            <div className="mt-5 flex h-3 overflow-hidden bg-slate-light">
              <div
                className="bg-emerald-600"
                style={{ width: `${(stats.available / inventoryTotal) * 100}%` }}
                title={`${stats.available} available`}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${(stats.pending / inventoryTotal) * 100}%` }}
                title={`${stats.pending} pending`}
              />
              <div
                className="bg-slate-400"
                style={{ width: `${(stats.sold / inventoryTotal) * 100}%` }}
                title={`${stats.sold} sold`}
              />
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="flex items-center justify-between border border-slate-200 px-3 py-2.5">
                <span className="text-slate">Available</span>
                <span className="font-semibold tabular-nums text-emerald-700">
                  {stats.available}
                </span>
              </div>
              <div className="flex items-center justify-between border border-slate-200 px-3 py-2.5">
                <span className="text-slate">Pending</span>
                <span className="font-semibold tabular-nums text-amber-700">
                  {stats.pending}
                </span>
              </div>
              <div className="flex items-center justify-between border border-slate-200 px-3 py-2.5">
                <span className="text-slate">Sold</span>
                <span className="font-semibold tabular-nums text-slate-600">
                  {stats.sold}
                </span>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section
              aria-label="Recent inquiries"
              className="border border-slate-200 bg-white"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate">
                    Needs attention
                  </h2>
                  <p className="mt-1 text-sm text-slate">Newest inquiries waiting for a response.</p>
                </div>
                <Link
                  href="/admin/inquiries"
                  className="text-sm font-medium text-navy hover:text-gold"
                >
                  View all →
                </Link>
              </div>

              {recentInquiries.length ? (
                <ul className="divide-y divide-slate-200">
                  {recentInquiries.map((inquiry) => (
                    <li key={inquiry.id}>
                      <Link
                        href="/admin/inquiries"
                        className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-light/60 sm:px-6"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-navy">
                            {inquiry.name || 'Unknown'}
                          </p>
                          <p className="mt-0.5 truncate text-sm text-slate">
                            {inquiry.email || 'No email'}
                            {inquiry.inquiry_type ? ` · ${inquiry.inquiry_type}` : ''}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <StatusBadge status={inquiry.status} />
                          <span className="text-xs text-slate">
                            {formatWhen(inquiry.created_at)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-10 text-center text-sm text-slate sm:px-6">
                  No new inquiries right now. You’re caught up.
                </p>
              )}
            </section>

            <BarChart
              title="Inventory mix"
              subtitle="Listings by category"
              data={stats.topCategories}
              color="#0f172a"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <TrendChart
              title="Inquiries"
              subtitle="Last 6 months"
              data={stats.monthlyInquiries}
            />
            <TrendChart
              title="Leads"
              subtitle="Last 6 months"
              data={stats.monthlyLeads}
              accent="#0f172a"
            />
          </div>

          <BarChart
            title="Inquiry types"
            subtitle="Where interest is coming from"
            data={stats.inquiryTypes}
          />
        </>
      )}
    </div>
  );
}
