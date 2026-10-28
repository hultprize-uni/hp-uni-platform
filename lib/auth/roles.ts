export type Role = "ADMIN" | "JURADO" | "POSTULANTE";
export type PanelRole = Extract<Role, "ADMIN" | "JURADO">;

// Only pass app_metadata from an identity validated by Supabase on the server.
export function parseRole(value: unknown): Role | null {
  return value === "ADMIN" || value === "JURADO" || value === "POSTULANTE"
    ? value
    : null;
}

export function panelForRole(role: Role | null): "/admin" | "/jurado" | null {
  if (role === "ADMIN") return "/admin";
  if (role === "JURADO") return "/jurado";
  return null;
}

export function requiredPanelRole(pathname: string): PanelRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "ADMIN";
  if (pathname === "/jurado" || pathname.startsWith("/jurado/")) return "JURADO";
  return null;
}

export function accessRedirect(
  pathname: string,
  identity: { role: Role | null } | null,
): string | null {
  const required = requiredPanelRole(pathname);
  if (required) {
    if (!identity) return "/login";
    if (identity.role === required) return null;
    return panelForRole(identity.role) ?? "/login?error=unauthorized";
  }
  if (pathname === "/login" && identity) return panelForRole(identity.role);
  return null;
}
