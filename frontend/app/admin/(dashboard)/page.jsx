'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TrendChart, BarChart } from '@/components/admin/AnalyticsChart';

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

export default function AdminOverviewPage() {
  const { token } = useAuth();
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

        setStats({
          totalHomes: properties.total,
          available: homes.filter((h) => h.status === 'available').length,
          pending: homes.filter((h) => h.status === 'pending').length,
          sold: homes.filter((h) => h.status === 'sold').length,
          newInquiries: inquiryRows.filter((i) => i.status === 'new').length,
          totalLeads: leads.total,
          monthlyProperties: buildMonthlySeries(homes),
          monthlyInquiries: buildMonthlySeries(inquiryRows),
          monthlyLeads: buildMonthlySeries(leadRows),
          inquiryTypes: buildCategoryBreakdown(inquiryRows, 'inquiry_type'),
          leadTypes: buildCategoryBreakdown(leadRows, 'type'),
          topCategories: buildCategoryBreakdown(homes, 'category'),
        });
        setRecentInquiries(inquiryRows.filter((item) => item.status === 'new').slice(0, 4));
        setLastUpdated(new Date());
      } finally {
        setRefreshing(false);
      }
    };

    loadStats();
    const intervalId = window.setInterval(loadStats, 30000);

    return () => window.clearInterval(intervalId);
  }, [token]);

  const cards = stats
    ? [
        { label: 'Total Properties', value: stats.totalHomes, href: '/admin/properties' },
        { label: 'Available', value: stats.available, href: '/admin/properties' },
        { label: 'New Inquiries', value: stats.newInquiries, href: '/admin/inquiries' },
        { label: 'Total Leads', value: stats.totalLeads, href: '/admin/leads' },
        { label: 'Site Settings', value: '→', href: '/admin/settings', isLink: true },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
      <p className="mt-1 text-slate">Overview of your dealership activity and lead generation.</p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate">Live dashboard updates every 30 seconds</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${refreshing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {refreshing ? 'Refreshing…' : lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Waiting for data'}
        </div>
      </div>

      {stats && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-r from-navy to-navy-deep p-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-300">New inquiries in the last 5 minutes</p>
              <p className="mt-1 text-3xl font-semibold">{recentInquiries.length}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 text-sm">
              {recentInquiries.length ? 'Activity is flowing in' : 'No new inquiries right now'}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {!stats
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-slate-200" />
            ))
          : cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-sm text-slate">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-navy">
                  {card.isLink ? (
                    <span className="text-gold">{card.value}</span>
                  ) : (
                    card.value
                  )}
                </p>
              </Link>
            ))}
      </div>

      {stats && (
        <>
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-navy">Inventory breakdown</h2>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <span>
                <span className="font-semibold text-green-700">{stats.available}</span> available
              </span>
              <span>
                <span className="font-semibold text-amber-700">{stats.pending}</span> pending
              </span>
              <span>
                <span className="font-semibold text-slate-600">{stats.sold}</span> sold
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <TrendChart
              title="Property activity"
              subtitle="Listings created over the last 6 months"
              data={stats.monthlyProperties}
            />
            <TrendChart
              title="Inquiry activity"
              subtitle="New inquiries received over the last 6 months"
              data={stats.monthlyInquiries}
            />
            <TrendChart
              title="Lead growth"
              subtitle="Newsletter and pre-qualification leads over the last 6 months"
              data={stats.monthlyLeads}
            />
            <BarChart
              title="Inquiry types"
              subtitle="Breakdown of incoming inquiry categories"
              data={stats.inquiryTypes}
            />
            <BarChart
              title="Lead sources"
              subtitle="Newsletter vs pre-qualification leads"
              data={stats.leadTypes}
            />
            <BarChart
              title="Property categories"
              subtitle="Inventory mix by listing category"
              data={stats.topCategories}
              color="#0f2b4f"
            />
          </div>
        </>
      )}
    </div>
  );
}
