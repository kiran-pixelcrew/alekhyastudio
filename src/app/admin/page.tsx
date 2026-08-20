"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/format";

type StatsResponse = {
  stats: {
    bookingsTotal: number;
    bookingsInquiry: number;
    bookingsConfirmed: number;
    paymentsPaid: number;
    paymentsPending: number;
    revenue: number;
    emailsTotal: number;
    emailsFailed: number;
    imagesTotal: number;
    imagesSelected: number;
  };
  recentBookings: Array<{
    _id: string;
    clientName: string;
    service: string;
    status: string;
    createdAt: string;
  }>;
  recentEmails: Array<{
    _id: string;
    subject: string;
    status: string;
    createdAt: string;
    payload?: { name?: string };
  }>;
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Unable to load dashboard stats."));
  }, []);

  if (error) {
    return <p className="text-terracotta-deep">{error}</p>;
  }

  if (!data) {
    return <p className="text-charcoal-muted">Loading dashboard…</p>;
  }

  const { stats } = data;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-charcoal">Overview</h1>
        <p className="mt-1 text-charcoal-muted">
          Track inquiries, payments, emails, and published gallery images.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bookings"
          value={stats.bookingsTotal}
          hint={`${stats.bookingsInquiry} inquiry · ${stats.bookingsConfirmed} confirmed`}
        />
        <StatCard
          label="Revenue logged"
          value={formatCurrency(stats.revenue)}
          hint={`${stats.paymentsPaid} paid · ${stats.paymentsPending} pending`}
        />
        <StatCard
          label="Emails"
          value={stats.emailsTotal}
          hint={
            stats.emailsFailed
              ? `${stats.emailsFailed} failed`
              : "All deliveries logged"
          }
        />
        <StatCard
          label="Images"
          value={stats.imagesSelected}
          hint={`${stats.imagesTotal} uploaded · selected on site`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-xs uppercase tracking-[0.16em] text-teal"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {data.recentBookings.length === 0 ? (
              <li className="text-sm text-charcoal-muted">No bookings yet.</li>
            ) : (
              data.recentBookings.map((booking) => (
                <li
                  key={booking._id}
                  className="flex items-start justify-between gap-3 border-b border-charcoal/8 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      {booking.clientName}
                    </p>
                    <p className="text-sm text-charcoal-muted">
                      {booking.service}
                    </p>
                    <p className="text-xs text-charcoal-muted">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent emails</h2>
            <Link
              href="/admin/emails"
              className="text-xs uppercase tracking-[0.16em] text-teal"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {data.recentEmails.length === 0 ? (
              <li className="text-sm text-charcoal-muted">No emails logged.</li>
            ) : (
              data.recentEmails.map((email) => (
                <li
                  key={email._id}
                  className="flex items-start justify-between gap-3 border-b border-charcoal/8 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      {email.payload?.name || "Contact"}
                    </p>
                    <p className="line-clamp-1 text-sm text-charcoal-muted">
                      {email.subject}
                    </p>
                    <p className="text-xs text-charcoal-muted">
                      {formatDateTime(email.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={email.status} />
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
