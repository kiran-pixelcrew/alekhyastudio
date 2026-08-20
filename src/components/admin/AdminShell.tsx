"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminUiProvider, useAdminUi } from "@/components/admin/AdminUi";
import {
  adminHref,
  type AdminBasePath,
} from "@/lib/admin-host";

const navSegments = [
  { segment: "", label: "Overview" },
  { segment: "bookings", label: "Bookings" },
  { segment: "payments", label: "Payments" },
  { segment: "emails", label: "Emails" },
  { segment: "images", label: "Images" },
  { segment: "videos", label: "Videos" },
] as const;

export function AdminShell({
  adminName,
  basePath,
  children,
}: {
  adminName: string;
  basePath: AdminBasePath;
  children: React.ReactNode;
}) {
  return (
    <AdminUiProvider>
      <AdminShellFrame adminName={adminName} basePath={basePath}>
        {children}
      </AdminShellFrame>
    </AdminUiProvider>
  );
}

function isActive(pathname: string, href: string, isOverview: boolean) {
  if (isOverview) {
    return pathname === href || pathname === "/admin" || pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminShellFrame({
  adminName,
  basePath,
  children,
}: {
  adminName: string;
  basePath: AdminBasePath;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { confirm } = useAdminUi();
  const loginHref = adminHref(basePath, "login");

  async function logout() {
    const ok = await confirm({
      title: "Sign out?",
      description: "You’ll need to sign in again to manage the studio CRM.",
      confirmLabel: "Sign out",
      cancelLabel: "Stay signed in",
      tone: "default",
    });
    if (!ok) return;

    await fetch("/api/auth/logout", { method: "POST" });
    router.push(loginHref);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(160deg,#faf6f0_0%,#ebe0d0_45%,#e8d9c4_100%)] md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-charcoal/10 bg-charcoal text-cream md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r md:border-charcoal/20">
        <div className="px-5 py-6">
          <p className="font-display text-2xl tracking-wide">Alekhya</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/60">
            Admin
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-1 md:flex-col md:overflow-visible">
          {navSegments.map((item) => {
            const href = adminHref(basePath, item.segment);
            const active = isActive(pathname, href, item.segment === "");
            return (
              <Link
                key={item.segment || "overview"}
                href={href}
                className={`flex items-center whitespace-nowrap rounded-lg px-3 py-2.5 text-sm leading-none transition ${
                  active
                    ? "bg-button text-cream shadow-sm shadow-button/30"
                    : "text-cream/75 hover:bg-cream/10 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-cream/10 px-5 py-4 md:block">
          <p className="truncate text-sm text-cream/80">{adminName}</p>
          <AdminButton
            size="sm"
            variant="ghost"
            onClick={() => void logout()}
            className="mt-2 !px-0 text-cream/55 hover:!bg-transparent hover:!text-cream"
          >
            Sign out
          </AdminButton>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between md:hidden">
          <p className="text-sm text-charcoal-muted">{adminName}</p>
          <AdminButton size="sm" variant="ghost" onClick={() => void logout()}>
            Sign out
          </AdminButton>
        </div>
        <main id="main" className="mx-auto w-full max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
