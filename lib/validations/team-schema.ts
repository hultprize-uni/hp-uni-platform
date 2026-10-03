import { z } from "zod";

export const memberSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido"),
  universityCode: z
    .string()
    .min(2, "Ingresa un código o nombre de universidad válido"),
  phone: z
    .string()
    .min(9, "El número de celular debe tener al menos 9 dígitos")
    .regex(/^[0-9+ ]+$/, "El celular solo debe contener números"),
});

export const teamRegistrationSchema = z
  .object({
    teamName: z
      .string()
      .min(3, "El nombre del equipo debe tener al menos 3 caracteres")
      .optional()
      .or(z.literal("")),
    registrationType: z.enum(["INDIVIDUAL", "TEAM"], {
      message: "Debes seleccionar el tipo de inscripción",
    }),
    members: z
      .array(memberSchema)
      .min(1, "Debe registrarse al menos 1 integrante")
      .max(4, "Un equipo no puede tener más de 4 integrantes"),
  })
  .refine(
    (data) => {
      if (data.registrationType === "TEAM") {
        return !!data.teamName && data.teamName.trim().length >= 3;
      }
      return true;
    },
    {
      message: "El nombre del equipo es obligatorio para inscripciones grupales",
      path: ["teamName"],
    }
  )
  .refine(
    (data) => {
      return data.members.some((member) => {
        const isUniEmail =
          member.email.endsWith("@uni.pe") || member.email.endsWith("@uni.edu.pe");
        const isUniCodeOrUni = member.universityCode
          .toLowerCase()
          .includes("uni");

        return isUniEmail || isUniCodeOrUni;
      });
    },
    {
      message:
        "Al menos uno de los integrantes debe pertenecer a la UNI (correo @uni.pe / @uni.edu.pe o código/universidad UNI)",
      path: ["members"],
    }
  );

export type MemberFormValues = z.infer<typeof memberSchema>;
export type TeamRegistrationFormValues = z.infer<typeof teamRegistrationSchema>;
