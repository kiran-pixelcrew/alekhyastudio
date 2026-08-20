"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminButton } from "@/components/admin/AdminButton";
import { adminHref, getAdminBasePath } from "@/lib/admin-host";

function resolveBasePath() {
  if (typeof window === "undefined") return "/admin" as const;
  return getAdminBasePath(window.location.host);
}

function safeNextPath(next: string | null, basePath: "" | "/admin") {
  const fallback = adminHref(basePath);
  if (!next) return fallback;

  // Subdomain mode: allow /, /bookings, etc. Block protocol-relative / external.
  if (next.startsWith("//") || next.includes("://")) return fallback;

  if (basePath === "") {
    if (next.startsWith("/admin")) {
      return next === "/admin" || next === "/admin/"
        ? "/"
        : next.replace(/^\/admin/, "") || "/";
    }
    if (next.startsWith("/")) return next;
    return fallback;
  }

  if (next.startsWith("/admin")) return next;
  if (next.startsWith("/") && next !== "/") {
    // Local path mode: coerce /bookings → /admin/bookings
    return `/admin${next}`;
  }
  return fallback;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Unable to sign in.");
        return;
      }

      const basePath = resolveBasePath();
      const next = safeNextPath(searchParams.get("next"), basePath);
      router.push(next);
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#2b2620_0%,#1f4b4a_55%,#9a3d22_100%)] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-cream/15 bg-cream-soft px-6 py-8 shadow-2xl md:px-8">
        <p className="font-display text-3xl text-charcoal">Alekhya Studio</p>
        <p className="mt-1 text-sm text-charcoal-muted">
          Sign in to manage bookings, payments, emails, and gallery images.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-charcoal-muted">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2.5 outline-none ring-button/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-charcoal-muted">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2.5 outline-none ring-button/30 focus:ring-2"
            />
          </label>

          {error ? (
            <p className="text-sm text-terracotta-deep">{error}</p>
          ) : null}

          <AdminButton type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Signing in…" : "Sign in"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
