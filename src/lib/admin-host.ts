/**
 * Admin dashboard host helpers.
 * Production: admin.alekhyastudio.com (set ADMIN_HOST in env).
 * Local: keep using http://localhost:3000/admin (path mode).
 */

export function getAdminHostname() {
  return (process.env.ADMIN_HOST ?? "admin.alekhyastudio.com")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
}

export function getSiteHostname() {
  return (process.env.SITE_HOST ?? "www.alekhyastudio.com")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
}

export function normalizeHostname(host: string | null | undefined) {
  return (host ?? "")
    .toLowerCase()
    .split(":")[0]
    .replace(/\.$/, "");
}

export function isLocalHostname(host: string | null | undefined) {
  const hostname = normalizeHostname(host);
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".localhost")
  );
}

export function isAdminHostname(host: string | null | undefined) {
  const hostname = normalizeHostname(host);
  if (!hostname) return false;
  if (hostname === getAdminHostname()) return true;
  // Local subdomain testing: admin.localhost:3000
  if (hostname === "admin.localhost") return true;
  return false;
}

/** "" on admin subdomain; "/admin" on main/local path mode. */
export type AdminBasePath = "" | "/admin";

export function getAdminBasePath(host: string | null | undefined): AdminBasePath {
  return isAdminHostname(host) ? "" : "/admin";
}

export function adminHref(basePath: AdminBasePath, segment = "") {
  const clean = segment.replace(/^\/+/, "").replace(/^admin\/?/, "");
  if (!clean) return basePath || "/";
  return basePath ? `${basePath}/${clean}` : `/${clean}`;
}

export function toAdminPublicPath(pathname: string) {
  if (pathname === "/admin" || pathname === "/admin/") return "/";
  if (pathname.startsWith("/admin/")) {
    return pathname.slice("/admin".length) || "/";
  }
  return pathname;
}

export function toAdminInternalPath(pathname: string) {
  if (pathname === "/" || pathname === "") return "/admin";
  if (pathname.startsWith("/admin")) return pathname;
  return `/admin${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function adminOrigin(protocol = "https") {
  return `${protocol}://${getAdminHostname()}`;
}

export function siteOrigin(protocol = "https") {
  return `${protocol}://${getSiteHostname()}`;
}
