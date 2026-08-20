import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import {
  adminOrigin,
  isAdminHostname,
  isLocalHostname,
  siteOrigin,
  toAdminInternalPath,
  toAdminPublicPath,
} from "@/lib/admin-host";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function isStaticOrNext(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/icon.svg" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|woff2?)$/i.test(pathname)
  );
}

async function guardAdminAccess(
  request: NextRequest,
  internalPathname: string,
) {
  const isLogin = internalPathname === "/admin/login";
  const isAdminPage = internalPathname.startsWith("/admin");
  const isAdminApi =
    internalPathname.startsWith("/api/admin") ||
    internalPathname.startsWith("/api/auth/me");
  const isAuthApi =
    internalPathname.startsWith("/api/auth/login") ||
    internalPathname.startsWith("/api/auth/logout");

  if (isAuthApi || isStaticOrNext(internalPathname)) {
    return null;
  }

  if (!isAdminPage && !isAdminApi) {
    return null;
  }

  const authed = await hasValidSession(request);
  const onAdminHost = isAdminHostname(request.headers.get("host"));

  if (isLogin) {
    if (authed) {
      const home = onAdminHost
        ? new URL("/", request.url)
        : new URL("/admin", request.url);
      return NextResponse.redirect(home);
    }
    return null;
  }

  if (!authed) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const loginPath = onAdminHost ? "/login" : "/admin/login";
    const loginUrl = new URL(loginPath, request.url);
    const nextPath = onAdminHost
      ? toAdminPublicPath(internalPathname)
      : internalPathname;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;
  const onAdminHost = isAdminHostname(host);
  const local = isLocalHostname(host);

  // Main marketing site: send /admin → admin subdomain (skip on localhost path mode).
  if (!onAdminHost && !local && pathname.startsWith("/admin")) {
    const dest = new URL(
      `${toAdminPublicPath(pathname)}${search}`,
      adminOrigin(request.nextUrl.protocol.replace(":", "") || "https"),
    );
    return NextResponse.redirect(dest, 308);
  }

  // Admin subdomain: clean URLs rewritten to /admin/* internally.
  if (onAdminHost) {
    if (isStaticOrNext(pathname)) {
      return NextResponse.next();
    }

    // API stays at /api/* on the same host.
    if (pathname.startsWith("/api/")) {
      const denied = await guardAdminAccess(request, pathname);
      return denied ?? NextResponse.next();
    }

    // Canonicalize /admin/* → /* on the subdomain.
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const clean = `${toAdminPublicPath(pathname)}${search}`;
      return NextResponse.redirect(new URL(clean, request.url), 308);
    }

    const internalPath = toAdminInternalPath(pathname);

    // Unknown public-site paths on admin host → main site.
    if (
      !internalPath.startsWith("/admin") ||
      internalPath.startsWith("/admin/../")
    ) {
      return NextResponse.redirect(
        new URL(
          `${pathname}${search}`,
          siteOrigin(request.nextUrl.protocol.replace(":", "") || "https"),
        ),
        308,
      );
    }

    const denied = await guardAdminAccess(request, internalPath);
    if (denied) return denied;

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Local / main host path-based /admin (and APIs).
  const denied = await guardAdminAccess(request, pathname);
  return denied ?? NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on pages + admin APIs. Skip large video upload body buffering
     * and Next static assets.
     */
    "/((?!_next/static|_next/image|api/admin/videos/upload|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
