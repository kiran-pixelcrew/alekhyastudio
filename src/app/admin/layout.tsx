import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { getAdminBasePath } from "@/lib/admin-host";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const host = (await headers()).get("host");
  const basePath = getAdminBasePath(host);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminShell adminName={session.name} basePath={basePath}>
      {children}
    </AdminShell>
  );
}
