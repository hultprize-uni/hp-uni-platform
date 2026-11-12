import { z } from "zod";

// Código de alumno UNI: 8 dígitos (año + correlativo) y una letra. Ej.: 20231234A
export const UNI_CODE_PATTERN = /^\d{8}[A-Za-z]$/;
const UNI_EMAIL_DOMAINS = ["@uni.pe", "@uni.edu.pe"];

export function isUniMember(member: { email: string; universityCode?: string }): boolean {
  const email = member.email.trim().toLowerCase();
  const hasUniEmail = UNI_EMAIL_DOMAINS.some((domain) => email.endsWith(domain));
  const hasUniCode = !!member.universityCode && UNI_CODE_PATTERN.test(member.universityCode.trim());
  return hasUniEmail || hasUniCode;
}

export const memberSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(120, "El nombre es demasiado largo"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un correo electrónico válido")
    .max(254),
  // Opcional: solo los integrantes de la UNI tienen código. Si se llena, debe tener formato UNI.
  universityCode: z
    .string()
    .trim()
    .regex(UNI_CODE_PATTERN, "El código UNI tiene 8 dígitos y una letra (ej. 20231234A)")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(9, "El número de celular debe tener al menos 9 dígitos")
    .max(20)
    .regex(/^[0-9+ ]+$/, "El celular solo debe contener números"),
});

export const teamRegistrationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(3, "El nombre del equipo debe tener al menos 3 caracteres")
      .max(80, "El nombre del equipo es demasiado largo")
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
    (data) => new Set(data.members.map((member) => member.email.trim().toLowerCase())).size === data.members.length,
    {
      message: "Cada integrante debe usar un correo distinto",
      path: ["members"],
    }
  )
  .refine((data) => data.members.some(isUniMember), {
    message:
      "Al menos uno de los integrantes debe pertenecer a la UNI (correo @uni.pe / @uni.edu.pe o código UNI válido)",
    path: ["members"],
  });

export type MemberFormValues = z.infer<typeof memberSchema>;
export type TeamRegistrationFormValues = z.infer<typeof teamRegistrationSchema>;
