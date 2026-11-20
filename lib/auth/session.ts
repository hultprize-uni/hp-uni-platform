import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { panelForRole, parseRole, type Role } from "./roles";

export type SessionUser = { authUserId: string; email: string | null; role: Role | null };

// React cache deduplicates within a render, never across different users/requests.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null; // Fail closed, including service failures.
  return { authUserId: user.id, email: user.email ?? null, role: parseRole(user.app_metadata.role) };
});

// Call inside EVERY protected server operation, before any DB or privileged work.
export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== role) redirect(panelForRole(user.role) ?? "/login?error=unauthorized");
  return user;
}
