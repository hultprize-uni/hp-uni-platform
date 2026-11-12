"use server";

import { requireRole } from "@/lib/auth/session";
import { validateNewJury, registerJury } from "@/lib/auth/jury-registration";
import { getJuryUserStore } from "@/lib/auth/jury-store";
import { createJuryAuthAdmin } from "@/lib/supabase/admin";

export async function createJury(input: unknown) {
  await requireRole("ADMIN"); // Always before validation/config/privileged calls.
  const valid = validateNewJury(input);
  if (!valid) return { ok: false as const, code: "INVALID_INPUT" as const,
    message: "Revisa nombre, correo y contraseña temporal (8 a 128 caracteres)." };
  const store = getJuryUserStore();
  if (!store) return { ok: false as const, code: "DEPENDENCY_UNAVAILABLE" as const,
    message: "El alta está pendiente del vínculo de usuarios de BD (#10). No se creó ninguna cuenta." };
  try {
    const result = await registerJury(valid, store, createJuryAuthAdmin());
    if (result.ok) return { ...result, message: "Cuenta de jurado creada y vinculada." };
    const messages = {
      INVALID_INPUT: "Revisa los datos del jurado.",
      DUPLICATE: "Ya existe una cuenta o usuario con ese correo. No se cambió su rol.",
      UNAVAILABLE: "El servicio no está disponible. Inténtalo más tarde.",
      ROLLED_BACK: "No se completó el alta; se revirtieron los registros nuevos.",
      RECONCILIATION_REQUIRED: "No se confirmó el alta. No repitas el envío: solicita a BD y Auth revisar ambas fuentes antes de reintentar.",
    };
    return { ...result, message: messages[result.code] };
  } catch {
    return { ok: false as const, code: "UNAVAILABLE" as const,
      message: "El alta no está configurada para este entorno. No se inició la creación." };
  }
}
