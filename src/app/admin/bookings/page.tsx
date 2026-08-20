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

type BookingForm = {
  clientName: string;
  email: string;
  phone: string;
  service: string;
  eventDate: string;
  location: string;
  status: string;
  notes: string;
  amountQuoted: string;
};

const emptyForm: BookingForm = {
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

function toDateInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function bookingToForm(booking: Booking): BookingForm {
  return {
    clientName: booking.clientName ?? "",
    email: booking.email ?? "",
    phone: booking.phone ?? "",
    service: booking.service ?? "",
    eventDate: toDateInput(booking.eventDate),
    location: booking.location ?? "",
    status: booking.status ?? "inquiry",
    notes: booking.notes ?? "",
    amountQuoted:
      typeof booking.amountQuoted === "number"
        ? String(booking.amountQuoted)
        : "",
  };
}

export default function AdminBookingsPage() {
  const { confirm, toast } = useAdminUi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  function startEdit(booking: Booking) {
    setEditingId(booking._id);
    setForm(bookingToForm(booking));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        amountQuoted: form.amountQuoted
          ? Number(form.amountQuoted)
          : null,
      };

      const res = await fetch(
        editingId ? `/api/admin/bookings/${editingId}` : "/api/admin/bookings",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast(
          data.error ||
            (editingId
              ? "Unable to update booking."
              : "Unable to create booking."),
          "error",
        );
        return;
      }
      cancelEdit();
      toast(editingId ? "Booking updated." : "Booking saved.", "success");
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
    if (editingId === id) cancelEdit();
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
        onSubmit={onSubmit}
        className="grid gap-3 rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5 md:grid-cols-2"
      >
        <div className="md:col-span-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl">
            {editingId ? "Edit booking" : "Add booking"}
          </h2>
          {editingId ? (
            <AdminButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={cancelEdit}
            >
              Cancel edit
            </AdminButton>
          ) : null}
        </div>
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
              required={
                key === "clientName" || key === "email" || key === "service"
              }
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
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <AdminButton type="submit" disabled={saving}>
            {saving
              ? "Saving…"
              : editingId
                ? "Update booking"
                : "Save booking"}
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
                  className={[
                    "border-b border-charcoal/8 align-top last:border-0",
                    editingId === booking._id ? "bg-button/5" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.clientName}</p>
                    <p className="text-charcoal-muted">{booking.email}</p>
                    {booking.phone ? (
                      <p className="text-charcoal-muted">{booking.phone}</p>
                    ) : null}
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
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        onClick={() => startEdit(booking)}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="dangerSoft"
                        onClick={() => void remove(booking._id)}
                      >
                        Delete
                      </AdminButton>
                    </div>
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
