"use server";

import {
  teamRegistrationSchema,
  TeamRegistrationFormValues,
} from "@/lib/validations/team-schema";
import type { ActionResult } from "@/lib/actions/types";
import { registerTeam } from "@/lib/registration/team-registration-service";
import {
  createPostulanteAuthAdmin,
  prismaTeamRegistrationStore,
} from "@/lib/registration/adapters";

// Reexportado para no romper imports existentes (Issue #15: contrato movido a lib/actions/types.ts).
export type { ActionResult };

// Deuda del Sprint 1 saldada en #11: se persiste con el esquema real de Prisma (Team + User),
// sin `prisma as any` y sin el fallback que respondía éxito sin guardar.
export async function registerTeamAction(
  rawData: TeamRegistrationFormValues
): Promise<ActionResult<{ teamId: string; teamName: string }>> {
  const validationResult = teamRegistrationSchema.safeParse(rawData);

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Error de validación en los datos enviados",
      errors: formattedErrors as Record<string, string[]>,
    };
  }

  const data = validationResult.data;

  try {
    const result = await registerTeam(data, prismaTeamRegistrationStore, createPostulanteAuthAdmin());

    if (result.ok) {
      return {
        success: true,
        message:
          data.registrationType === "TEAM"
            ? `¡El equipo "${result.teamName}" se ha registrado exitosamente!`
            : "¡Tu inscripción individual ha sido registrada con éxito!",
        data: { teamId: result.teamId, teamName: result.teamName },
      };
    }

    const messages = {
      DUPLICATE: "Uno de los correos ya se encuentra registrado.",
      UNAVAILABLE: "El servicio no está disponible en este momento. Inténtalo más tarde.",
      ROLLED_BACK: "No se completó la inscripción y no se guardó ningún dato. Inténtalo nuevamente.",
      RECONCILIATION_REQUIRED:
        "No pudimos confirmar tu inscripción. No vuelvas a enviarla: escríbenos para revisarla.",
    };
    if (result.code === "RECONCILIATION_REQUIRED") console.error("[REGISTER_TEAM_RECONCILIATION_REQUIRED]");
    // Mensaje genérico: no se indica qué correo existe (evita enumeración de cuentas).
    return { success: false, message: messages[result.code] };
  } catch (error) {
    // Configuración faltante (p. ej. SUPABASE_SERVICE_ROLE_KEY): no se creó nada.
    console.error("[REGISTER_TEAM_ACTION_ERROR]:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al procesar la inscripción.",
    };
  }
}
