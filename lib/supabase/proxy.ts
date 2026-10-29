import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { accessRedirect, parseRole, requiredPanelRole } from "@/lib/auth/roles";
import { getPublicSupabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectHeaders = (target: NextResponse) => {
    target.headers.set("Cache-Control", "private, no-store, max-age=0");
    target.headers.set("Pragma", "no-cache");
    target.headers.set("Expires", "0");
    if (requiredPanelRole(request.nextUrl.pathname))
      target.headers.set("X-Robots-Tag", "noindex, nofollow");
    return target;
  };
  try {
    const { url, key } = getPublicSupabaseConfig();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          const previous = response.cookies.getAll();
          response = NextResponse.next({ request });
          previous.forEach(cookie => response.cookies.set(cookie));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    // getUser validates with Auth and reads the CURRENT server-controlled role.
    // Never authorize using getSession() or unverified cookie contents.
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && (error.status === 0 || (error.status ?? 0) >= 500 || error.name === "AuthRetryableFetchError"))
      throw new Error("Auth unavailable");
    const target = accessRedirect(request.nextUrl.pathname,
      !error && user ? { role: parseRole(user.app_metadata.role) } : null);
    if (target) {
      const redirected = NextResponse.redirect(new URL(target, request.url));
      response.cookies.getAll().forEach(cookie => redirected.cookies.set(cookie));
      response = redirected;
    }
    return protectHeaders(response);
  } catch {
    // Never serve a panel when identity cannot be verified. Login can still show
    // its form; submitting it will display a safe error and allow a retry.
    if (request.nextUrl.pathname === "/login") return protectHeaders(response);
    const failed = new NextResponse("No pudimos verificar tu sesión. Inténtalo de nuevo en unos momentos.", {
      status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    response.cookies.getAll().forEach(cookie => failed.cookies.set(cookie));
    return protectHeaders(failed);
  }
}
