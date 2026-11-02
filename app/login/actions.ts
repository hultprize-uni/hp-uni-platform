"use server";

import { createClient } from "@/lib/supabase/server";
import { panelForRole, parseRole } from "@/lib/auth/roles";
import { loginErrorMessage, validateLogin } from "@/lib/auth/validation";

type LoginResult = { error: string; path?: never } | { path: "/admin" | "/jurado" | "/"; error?: never };

export async function signIn(email: string, password: string): Promise<LoginResult> {
  if (typeof email !== "string" || typeof password !== "string")
    return { error: "Revisa el correo y la contraseña." };
  const normalizedEmail = email.trim();
  if (Object.keys(validateLogin(normalizedEmail, password)).length)
    return { error: "Revisa el correo y la contraseña." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) return { error: loginErrorMessage(error) };
    const { data: { user }, error: identityError } = await supabase.auth.getUser();
    if (identityError || !user) return { error: "No pudimos verificar tu sesión. Inténtalo de nuevo." };
    const role = parseRole(user.app_metadata.role);
    const path = panelForRole(role);
    if (path) return { path };
    // POSTULANTE is a known role; its private portal belongs to issue #9.
    if (role === "POSTULANTE") return { path: "/" };
    await supabase.auth.signOut({ scope: "local" });
    return { error: "Tu cuenta no tiene permiso para acceder a estos paneles." };
  } catch {
    return { error: "No pudimos conectar con el servicio. Revisa tu conexión e inténtalo de nuevo." };
  }
}
