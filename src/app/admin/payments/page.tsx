"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
  status: string;
  amountQuoted?: number;
  createdAt: string;
};

type PaymentBookingRef =
  | string
  | {
      _id: string;
      clientName?: string;
      service?: string;
      eventDate?: string;
      status?: string;
      amountQuoted?: number;
    }
  | null;

type Payment = {
  _id: string;
  bookingId?: PaymentBookingRef;
  clientName: string;
  email?: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  paidAt?: string;
  reference?: string;
  notes?: string;
  createdAt: string;
};

const statuses = ["pending", "paid", "partial", "refunded"] as const;
const methods = ["upi", "bank_transfer", "cash", "card", "other"] as const;

const emptyForm = {
  bookingId: "",
  clientName: "",
  email: "",
  amount: "",
  method: "upi",
  status: "paid",
  paidAt: "",
  reference: "",
  notes: "",
};

function bookingIdOf(payment: Payment): string {
  const ref = payment.bookingId;
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return ref._id;
}

function countsTowardPaid(status: string) {
  return status === "paid" || status === "partial";
}

export default function AdminPaymentsPage() {
  const { confirm, toast } = useAdminUi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    const [bookingsRes, paymentsRes] = await Promise.all([
      fetch("/api/admin/bookings"),
      fetch("/api/admin/payments"),
    ]);

    if (!bookingsRes.ok || !paymentsRes.ok) {
      toast("Unable to load bookings and payments.", "error");
      return;
    }

    const bookingsData = await bookingsRes.json();
    const paymentsData = await paymentsRes.json();
    setBookings(bookingsData.bookings);
    setPayments(paymentsData.payments);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredPayments = useMemo(() => {
    if (!filter) return payments;
    return payments.filter((payment) => payment.status === filter);
  }, [filter, payments]);

  const paidByBooking = useMemo(() => {
    const map = new Map<string, number>();
    for (const payment of payments) {
      const id = bookingIdOf(payment);
      if (!id || !countsTowardPaid(payment.status)) continue;
      map.set(id, (map.get(id) ?? 0) + payment.amount);
    }
    return map;
  }, [payments]);

  const bookingRows = useMemo(() => {
    type PaymentState = "unpaid" | "partial" | "no_quote" | "paid";
    const rank: Record<PaymentState, number> = {
      unpaid: 0,
      partial: 1,
      no_quote: 2,
      paid: 3,
    };

    return bookings
      .filter((booking) => booking.status !== "cancelled")
      .map((booking) => {
        const quoted = booking.amountQuoted ?? 0;
        const paid = paidByBooking.get(booking._id) ?? 0;
        const remaining = Math.max(quoted - paid, 0);
        const paymentState: PaymentState =
          quoted <= 0 && paid <= 0
            ? "no_quote"
            : paid <= 0
              ? "unpaid"
              : remaining > 0
                ? "partial"
                : "paid";
        return { booking, quoted, paid, remaining, paymentState };
      })
      .sort((a, b) => rank[a.paymentState] - rank[b.paymentState]);
  }, [bookings, paidByBooking]);

  function selectBooking(booking: Booking, suggestAmount?: number) {
    const paid = paidByBooking.get(booking._id) ?? 0;
    const remaining =
      booking.amountQuoted != null
        ? Math.max(booking.amountQuoted - paid, 0)
        : 0;
    const amount =
      suggestAmount != null
        ? String(suggestAmount)
        : remaining > 0
          ? String(remaining)
          : booking.amountQuoted
            ? String(booking.amountQuoted)
            : "";

    const nextStatus = remaining > 0 && paid > 0 ? "partial" : "paid";
    setForm({
      ...emptyForm,
      bookingId: booking._id,
      clientName: booking.clientName,
      email: booking.email,
      amount,
      status: nextStatus,
      paidAt: new Date().toISOString().slice(0, 10),
    });
    setFormOpen(true);
  }

  function onStatusChange(status: string) {
    setForm((current) => ({
      ...current,
      status,
      paidAt:
        status === "paid" || status === "partial"
          ? current.paidAt || new Date().toISOString().slice(0, 10)
          : "",
    }));
  }

  function clearBookingLink() {
    setForm((current) => ({
      ...current,
      bookingId: "",
    }));
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          paidAt:
            form.status === "paid" || form.status === "partial"
              ? form.paidAt || undefined
              : "",
          bookingId: form.bookingId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Unable to create payment.", "error");
        return;
      }
      setForm(emptyForm);
      setFormOpen(false);
      toast("Payment saved.", "success");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast("Unable to update payment.", "error");
      return;
    }
    toast("Payment status updated.", "success");
    await load();
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Delete this payment?",
      description: "The payment log entry will be removed permanently.",
      confirmLabel: "Delete payment",
      tone: "danger",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/payments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Unable to delete payment.", "error");
      return;
    }
    toast("Payment deleted.", "success");
    await load();
  }

  const fieldClass =
    "mt-1 h-11 w-full rounded-lg border border-charcoal/15 bg-cream px-3 text-sm text-charcoal outline-none focus:border-charcoal/35";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-charcoal">Payments</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-muted md:text-base">
            Review each booking, see what is still due, and log UPI, bank, or
            cash payments against it.
          </p>
        </div>
        <AdminButton
          onClick={() => {
            setForm(emptyForm);
            setFormOpen(true);
          }}
        >
          Add payment
        </AdminButton>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">
            Bookings &amp; dues
          </h2>
          <p className="mt-1 text-sm text-charcoal-muted">
            Unpaid and partially paid bookings appear first. Record a payment
            when money comes in.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-charcoal/10 bg-cream-soft/80">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-xs uppercase tracking-[0.12em] text-charcoal-muted">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Quoted</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-charcoal-muted">
                    No active bookings yet. New inquiries from the contact form
                    will show up here so you can ask for and log payments.
                  </td>
                </tr>
              ) : (
                bookingRows.map(
                  ({ booking, quoted, paid, remaining, paymentState }) => (
                    <tr
                      key={booking._id}
                      className="border-b border-charcoal/8 align-top last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-charcoal">
                          {booking.clientName}
                        </p>
                        <p className="text-charcoal-muted">{booking.email}</p>
                        <p className="mt-1 text-xs text-charcoal-muted">
                          {booking.service}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={booking.status} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(booking.eventDate)}
                      </td>
                      <td className="px-4 py-3">
                        {quoted > 0 ? formatCurrency(quoted) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {paid > 0 ? formatCurrency(paid) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {paymentState === "no_quote" ? (
                          <span className="text-charcoal-muted">Set quote</span>
                        ) : remaining > 0 ? (
                          <span className="font-medium text-terracotta-deep">
                            {formatCurrency(remaining)}
                          </span>
                        ) : (
                          <span className="text-teal">Settled</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs capitalize ${
                            paymentState === "paid"
                              ? "bg-teal/15 text-teal"
                              : paymentState === "partial"
                                ? "bg-button/15 text-button-deep"
                                : paymentState === "unpaid"
                                  ? "bg-terracotta/15 text-terracotta-deep"
                                  : "bg-charcoal/10 text-charcoal-muted"
                          }`}
                        >
                          {paymentState === "no_quote"
                            ? "No quote"
                            : paymentState}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminButton
                          size="sm"
                          variant="charcoal"
                          onClick={() => selectBooking(booking)}
                        >
                          {paymentState === "paid"
                            ? "Add payment"
                            : paymentState === "partial"
                              ? "Record balance"
                              : "Ask / record payment"}
                        </AdminButton>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {formOpen ? (
        <form
          onSubmit={onCreate}
          className="space-y-5 rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5 md:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-charcoal">
                Record payment
              </h2>
              <p className="mt-1 text-sm text-charcoal-muted">
                Link the payment to a booking so dues stay accurate.
              </p>
            </div>
            <AdminButton
              size="sm"
              variant="ghost"
              onClick={() => {
                setFormOpen(false);
                setForm(emptyForm);
              }}
            >
              Close
            </AdminButton>
          </div>

          <label className="block text-sm">
            <span className="text-charcoal-muted">Booking</span>
            <select
              value={form.bookingId}
              onChange={(e) => {
                const id = e.target.value;
                if (!id) {
                  clearBookingLink();
                  return;
                }
                const booking = bookings.find((item) => item._id === id);
                if (booking) selectBooking(booking);
              }}
              className={fieldClass}
            >
              <option value="">No linked booking</option>
              {bookings
                .filter((booking) => booking.status !== "cancelled")
                .map((booking) => {
                  const paid = paidByBooking.get(booking._id) ?? 0;
                  const due =
                    booking.amountQuoted != null
                      ? Math.max(booking.amountQuoted - paid, 0)
                      : null;
                  return (
                    <option key={booking._id} value={booking._id}>
                      {booking.clientName} · {booking.service}
                      {due != null && due > 0
                        ? ` · due ${formatCurrency(due)}`
                        : booking.amountQuoted
                          ? ` · quoted ${formatCurrency(booking.amountQuoted)}`
                          : ""}
                    </option>
                  );
                })}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
            <label className="block text-sm">
              <span className="text-charcoal-muted">Client name</span>
              <input
                required
                value={form.clientName}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    clientName: e.target.value,
                  }))
                }
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="text-charcoal-muted">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({ ...current, email: e.target.value }))
                }
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="text-charcoal-muted">Amount (₹)</span>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(e) =>
                  setForm((current) => ({ ...current, amount: e.target.value }))
                }
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="text-charcoal-muted">Method</span>
              <select
                value={form.method}
                onChange={(e) =>
                  setForm((current) => ({ ...current, method: e.target.value }))
                }
                className={`${fieldClass} capitalize`}
              >
                {methods.map((method) => (
                  <option key={method} value={method}>
                    {method.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-charcoal-muted">Status</span>
              <select
                value={form.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className={`${fieldClass} capitalize`}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-charcoal-muted">Paid on</span>
              <input
                type="date"
                value={form.paidAt}
                onChange={(e) =>
                  setForm((current) => ({ ...current, paidAt: e.target.value }))
                }
                disabled={form.status === "pending"}
                className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
              />
              {form.status === "pending" ? (
                <span className="mt-1 block text-xs text-charcoal-muted">
                  Left blank while payment is pending.
                </span>
              ) : null}
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-charcoal-muted">Reference / UPI txn id</span>
            <input
              value={form.reference}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  reference: e.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="text-charcoal-muted">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((current) => ({ ...current, notes: e.target.value }))
              }
              rows={2}
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2 text-sm outline-none focus:border-charcoal/35"
              placeholder="Advance received, balance due after event, etc."
            />
          </label>

          <AdminButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save payment"}
          </AdminButton>
        </form>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">Payment log</h2>
          <p className="mt-1 text-sm text-charcoal-muted">
            All recorded payments, newest first.
          </p>
        </div>

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
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-charcoal-muted">
                    No payments logged yet. Choose a booking above and record
                    the first payment.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const linked = payment.bookingId;
                  const bookingLabel =
                    linked && typeof linked !== "string"
                      ? `${linked.service || "Booking"}${
                          linked.eventDate
                            ? ` · ${formatDate(linked.eventDate)}`
                            : ""
                        }`
                      : linked
                        ? "Linked booking"
                        : "—";

                  return (
                    <tr
                      key={payment._id}
                      className="border-b border-charcoal/8 align-top last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{payment.clientName}</p>
                        <p className="text-charcoal-muted">
                          {payment.email || "—"}
                        </p>
                        {payment.reference ? (
                          <p className="text-xs text-charcoal-muted">
                            Ref: {payment.reference}
                          </p>
                        ) : null}
                        <p className="text-xs text-charcoal-muted">
                          Logged {formatDateTime(payment.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-charcoal-muted">
                        {bookingLabel}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {payment.method.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={payment.status} />
                        <select
                          value={payment.status}
                          onChange={(e) =>
                            void updateStatus(payment._id, e.target.value)
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
                        {payment.status === "pending"
                          ? "—"
                          : formatDate(payment.paidAt)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminButton
                          size="sm"
                          variant="dangerSoft"
                          onClick={() => void remove(payment._id)}
                        >
                          Delete
                        </AdminButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
