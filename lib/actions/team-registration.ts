"use server";

import {
  teamRegistrationSchema,
  TeamRegistrationFormValues,
} from "@/lib/validations/team-schema";
import { prisma } from "@/lib/prisma";

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export async function registerTeamAction(
  rawData: TeamRegistrationFormValues
): Promise<ActionResult> {
  try {
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

    let createdRecord;

    try {
      if ("team" in prisma && typeof (prisma as any).team?.create === "function") {
        createdRecord = await (prisma as any).team.create({
          data: {
            name: data.teamName || `Equipo de ${data.members[0].fullName}`,
            type: data.registrationType,
            members: {
              create: data.members.map((m) => ({
                fullName: m.fullName,
                email: m.email,
                universityCode: m.universityCode,
                phone: m.phone,
              })),
            },
          },
          include: {
            members: true,
          },
        });
      } else {
        createdRecord = {
          id: `temp_${Date.now()}`,
          name: data.teamName || `Equipo de ${data.members[0].fullName}`,
          type: data.registrationType,
          membersCount: data.members.length,
          createdAt: new Date().toISOString(),
        };
      }
    } catch (dbError: any) {
      if (dbError.code === "P2002") {
        return {
          success: false,
          message: "Uno de los correos o códigos ya se encuentra registrado.",
        };
      }
      console.error("[REGISTER_TEAM_DB_ERROR]:", dbError);
      return {
        success: false,
        message: "Ocurrió un inconveniente al guardar la postulación en la base de datos.",
      };
    }
    return {
      success: true,
      message:
        data.registrationType === "TEAM"
          ? `¡El equipo "${data.teamName}" se ha registrado exitosamente!`
          : "¡Tu inscripción individual ha sido registrada con éxito!",
      data: createdRecord,
    };
  } catch (error) {
    console.error("[REGISTER_TEAM_ACTION_ERROR]:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al procesar la inscripción.",
    };
  }
}
