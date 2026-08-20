"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { useAdminUi } from "@/components/admin/AdminUi";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/format";

type EmailLog = {
  _id: string;
  type: string;
  toEmail: string;
  replyTo?: string;
  subject: string;
  preview?: string;
  status: string;
  errorMessage?: string;
  createdAt: string;
  payload?: {
    name?: string;
    email?: string;
    services?: string[];
    eventDate?: string;
    about?: string;
    instagram?: string;
  };
};

export default function AdminEmailsPage() {
  const { toast } = useAdminUi();
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<EmailLog | null>(null);

  const load = useCallback(async () => {
    const query = filter ? `?status=${filter}` : "";
    const res = await fetch(`/api/admin/emails${query}`);
    if (!res.ok) {
      toast("Unable to load emails.", "error");
      return;
    }
    const data = await res.json();
    setEmails(data.emails);
  }, [filter, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-charcoal">Emails</h1>
        <p className="mt-1 text-charcoal-muted">
          Contact form messages and delivery status.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          ["", "All"],
          ["sent", "Sent"],
          ["failed", "Failed"],
        ].map(([value, label]) => (
          <AdminButton
            key={label}
            size="sm"
            variant={filter === value ? "filterActive" : "filter"}
            onClick={() => setFilter(value)}
          >
            {label}
          </AdminButton>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-x-auto rounded-xl border border-charcoal/10 bg-cream-soft/80">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-xs uppercase tracking-[0.12em] text-charcoal-muted">
              <tr>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-charcoal-muted">
                    No emails logged yet. New contact form submissions appear
                    here.
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr
                    key={email._id}
                    className="cursor-pointer border-b border-charcoal/8 last:border-0 hover:bg-cream"
                    onClick={() => setSelected(email)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {email.payload?.name || "—"}
                      </p>
                      <p className="text-charcoal-muted">
                        {email.payload?.email || email.replyTo || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-2">{email.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(email.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5">
          <h2 className="font-display text-2xl">Details</h2>
          {!selected ? (
            <p className="mt-3 text-sm text-charcoal-muted">
              Select an email to read the full inquiry.
            </p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <StatusBadge status={selected.status} />
              <p>
                <span className="text-charcoal-muted">To:</span>{" "}
                {selected.toEmail}
              </p>
              <p>
                <span className="text-charcoal-muted">Reply-to:</span>{" "}
                {selected.replyTo || "—"}
              </p>
              <p>
                <span className="text-charcoal-muted">Services:</span>{" "}
                {selected.payload?.services?.join(", ") || "—"}
              </p>
              <p>
                <span className="text-charcoal-muted">Event date:</span>{" "}
                {selected.payload?.eventDate || "—"}
              </p>
              <p>
                <span className="text-charcoal-muted">Instagram:</span>{" "}
                {selected.payload?.instagram || "—"}
              </p>
              <div>
                <p className="text-charcoal-muted">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-charcoal">
                  {selected.payload?.about || selected.preview || "—"}
                </p>
              </div>
              {selected.errorMessage ? (
                <p className="text-terracotta-deep">{selected.errorMessage}</p>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
