import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./config";
import { DuplicateJuryError, type JuryAuthAdmin } from "@/lib/auth/jury-registration";

// Server-only Supabase Admin adapter for jury provisioning (RF-37).
export function createJuryAuthAdmin(): JuryAuthAdmin {
  const { url } = getPublicSupabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta configuración de servidor para el alta de jurados.");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  }).auth.admin;
  return {
    async createWithoutRole(input) {
      const { data, error } = await admin.createUser({
        email: input.email, password: input.temporaryPassword, email_confirm: true,
        app_metadata: {}, user_metadata: { name: input.name },
      });
      if (error?.code === "email_exists" || error?.code === "user_already_exists")
        throw new DuplicateJuryError();
      if (error || !data.user) throw new Error("No se pudo crear la cuenta.");
      return { id: data.user.id };
    },
    async grantJuryRole(id) {
      const { error } = await admin.updateUserById(id, { app_metadata: { role: "JURADO" } });
      if (error) throw new Error("No se pudo asignar el rol.");
    },
    async deleteCreatedUser(id) {
      const { error } = await admin.deleteUser(id);
      if (error) {
        // Best effort containment if deletion failed after role assignment.
        await admin.updateUserById(id, { app_metadata: { role: null }, ban_duration: "876000h" });
        throw new Error("La cuenta requiere conciliación manual.");
      }
    },
  };
}
