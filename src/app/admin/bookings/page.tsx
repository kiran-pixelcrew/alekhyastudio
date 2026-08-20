"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { useAdminUi } from "@/components/admin/AdminUi";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

type Booking = {
  _id: string;
  clientName: string;
  email: string;
  phone?: string;
  service: string;
  eventDate?: string;
  location?: string;
  status: string;
  notes?: string;
  amountQuoted?: number;
  source?: string;
  createdAt: string;
};

const statuses = ["inquiry", "confirmed", "completed", "cancelled"] as const;

const emptyForm = {
  clientName: "",
  email: "",
  phone: "",
  service: "",
  eventDate: "",
  location: "",
  status: "inquiry",
  notes: "",
  amountQuoted: "",
};

export default function AdminBookingsPage() {
  const { confirm, toast } = useAdminUi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const query = filter ? `?status=${filter}` : "";
    const res = await fetch(`/api/admin/bookings${query}`);
    if (!res.ok) {
      toast("Unable to load bookings.", "error");
      return;
    }
    const data = await res.json();
    setBookings(data.bookings);
  }, [filter, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amountQuoted: form.amountQuoted
            ? Number(form.amountQuoted)
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Unable to create booking.", "error");
        return;
      }
      setForm(emptyForm);
      toast("Booking saved.", "success");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast("Unable to update booking.", "error");
      return;
    }
    toast("Booking status updated.", "success");
    await load();
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Delete this booking?",
      description: "The booking record will be removed permanently.",
      confirmLabel: "Delete booking",
      tone: "danger",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Unable to delete booking.", "error");
      return;
    }
    toast("Booking deleted.", "success");
    await load();
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-charcoal">Bookings</h1>
        <p className="mt-1 text-charcoal-muted">
          Event inquiries from the contact form and bookings you add manually.
        </p>
      </header>

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5 md:grid-cols-2"
      >
        <h2 className="font-display text-2xl md:col-span-2">Add booking</h2>
        {(
          [
            ["clientName", "Client name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "text"],
            ["service", "Service", "text"],
            ["eventDate", "Event date", "date"],
            ["location", "Location", "text"],
            ["amountQuoted", "Amount quoted (₹)", "number"],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block text-sm">
            <span className="text-charcoal-muted">{label}</span>
            <input
              type={type}
              required={key === "clientName" || key === "email" || key === "service"}
              value={form[key]}
              onChange={(e) =>
                setForm((current) => ({ ...current, [key]: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2 outline-none focus:ring-2 focus:ring-button/30"
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="text-charcoal-muted">Status</span>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((current) => ({ ...current, status: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="text-charcoal-muted">Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm((current) => ({ ...current, notes: e.target.value }))
            }
            rows={3}
            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2"
          />
        </label>
        <div className="md:col-span-2">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save booking"}
          </AdminButton>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <AdminButton
          size="sm"
          variant={!filter ? "filterActive" : "filter"}
          onClick={() => setFilter("")}
        >
          All
        </AdminButton>
        {statuses.map((status) => (
          <AdminButton
            key={status}
            size="sm"
            variant={filter === status ? "filterActive" : "filter"}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </AdminButton>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-charcoal/10 bg-cream-soft/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 text-xs uppercase tracking-[0.12em] text-charcoal-muted">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Quoted</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-charcoal-muted">
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-charcoal/8 align-top last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.clientName}</p>
                    <p className="text-charcoal-muted">{booking.email}</p>
                    <p className="text-xs text-charcoal-muted">
                      {formatDateTime(booking.createdAt)} · {booking.source}
                    </p>
                  </td>
                  <td className="px-4 py-3">{booking.service}</td>
                  <td className="px-4 py-3">
                    {formatDate(booking.eventDate)}
                    {booking.location ? (
                      <p className="text-charcoal-muted">{booking.location}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        void updateStatus(booking._id, e.target.value)
                      }
                      className="mt-2 block rounded border border-charcoal/15 bg-cream px-2 py-1 text-xs"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {typeof booking.amountQuoted === "number"
                      ? formatCurrency(booking.amountQuoted)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AdminButton
                      size="sm"
                      variant="dangerSoft"
                      onClick={() => void remove(booking._id)}
                    >
                      Delete
                    </AdminButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
