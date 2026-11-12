// Esquemas Zod del CMS, rúbricas, calificaciones y revisión de entregables (Issue #11).
// Sin dependencias de Next/Prisma: se reutilizan en formularios y Server Actions, y se prueban con node --test.
import { z } from "zod";

const text = (max: number, label: string) =>
  z.string().trim().min(1, `${label} es obligatorio.`).max(max, `${label} admite hasta ${max} caracteres.`);
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((value) => (value ? value : undefined));
const httpsUrl = z
  .string()
  .trim()
  .url("Ingresa un enlace válido.")
  .refine((value) => value.startsWith("https://"), "El enlace debe empezar con https://");
const id = z.string().trim().min(1, "Identificador inválido.").max(64);
const uuid = z.string().uuid("Identificador inválido.");

// ---------------------------------------------------------------- Home (RF-06)
export const homeContentSchema = z.object({
  heroTitle: text(120, "El título"),
  heroSubtitle: text(300, "El subtítulo"),
  ctaLabel: text(40, "El texto del botón"),
  // Ruta interna (/registro) o enlace https externo.
  ctaHref: z
    .string()
    .trim()
    .refine((value) => /^\/(?!\/)[\w\-/#?=&.]*$/.test(value) || value.startsWith("https://"), "Usa una ruta interna (/registro) o un enlace https."),
  aboutText: text(2000, "La descripción"),
  registrationOpen: z.boolean(),
});
export type HomeContent = z.infer<typeof homeContentSchema>;

// --------------------------------------------------------- Cronograma (RF-11, RF-34)
export const timelineEventSchema = z
  .object({
    title: text(120, "El título"),
    description: text(1000, "La descripción"),
    date: z.coerce.date({ message: "Fecha inválida." }),
    endDate: z.coerce.date({ message: "Fecha inválida." }).optional(),
    isBootcamp: z.boolean().default(false),
  })
  .refine((data) => !data.endDate || data.endDate >= data.date, {
    message: "La fecha de fin no puede ser anterior a la de inicio.",
    path: ["endDate"],
  });
export type TimelineEventInput = z.infer<typeof timelineEventSchema>;

// Lista completa de ids en el nuevo orden; sin repetidos.
export const reorderSchema = z
  .array(id)
  .min(1, "No hay elementos para ordenar.")
  .max(200)
  .refine((ids) => new Set(ids).size === ids.length, "La lista tiene elementos repetidos.");

// ----------------------------------------------------------- Aliados (RF-15, RF-35, RF-36)
export const partnerSchema = z.object({
  name: text(120, "El nombre"),
  type: z.enum(["SPONSOR", "ALIADO"], { message: "Tipo de aliado inválido." }),
  category: optionalText(60),
  websiteUrl: httpsUrl.optional().or(z.literal("").transform(() => undefined)),
});
export type PartnerInput = z.infer<typeof partnerSchema>;

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
// SVG excluido a propósito: puede contener scripts.
const LOGO_TYPES = {
  png: { mime: "image/png", signature: [0x89, 0x50, 0x4e, 0x47] },
  jpg: { mime: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
  jpeg: { mime: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
  webp: { mime: "image/webp", signature: [0x52, 0x49, 0x46, 0x46] },
} as const;

export function checkLogo(file: { name: string; size: number; head: Uint8Array }):
  | { ok: true; extension: string; contentType: string }
  | { ok: false; message: string } {
  if (file.size <= 0) return { ok: false, message: "El logo está vacío." };
  if (file.size > MAX_LOGO_BYTES) return { ok: false, message: "El logo supera el máximo de 2 MB." };
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const info = LOGO_TYPES[extension as keyof typeof LOGO_TYPES];
  if (!info) return { ok: false, message: "El logo debe ser PNG, JPG o WEBP." };
  if (!info.signature.every((byte, index) => file.head[index] === byte))
    return { ok: false, message: "El archivo no parece ser una imagen válida." };
  return { ok: true, extension, contentType: info.mime };
}

// ---------------------------------------------------------------- Rúbricas (RF-39)
export const rubricSchema = z
  .object({
    title: text(120, "El título"),
    description: optionalText(1000),
    isActive: z.boolean().default(true),
    criteria: z
      .array(
        z.object({
          id: id.optional(), // presente al editar un criterio existente
          name: text(120, "El nombre del criterio"),
          description: optionalText(1000),
          maxScore: z.number({ message: "Puntaje inválido." }).positive("El puntaje máximo debe ser mayor a 0.").max(100),
          weight: z.number({ message: "Peso inválido." }).positive("El peso debe ser mayor a 0.").max(100),
        }),
      )
      .min(1, "La rúbrica necesita al menos un criterio.")
      .max(30),
  })
  .refine((data) => new Set(data.criteria.map((c) => c.name.toLowerCase())).size === data.criteria.length, {
    message: "Hay criterios con el mismo nombre.",
    path: ["criteria"],
  });
export type RubricInput = z.infer<typeof rubricSchema>;

// ----------------------------------------------------------- Calificaciones (RF-30, RF-31)
export const evaluationSchema = z.object({
  teamId: id,
  rubricId: id,
  feedback: optionalText(4000),
  finalize: z.boolean().default(false),
  scores: z
    .array(
      z.object({
        criterionId: id,
        score: z.number({ message: "Puntaje inválido." }).min(0, "El puntaje no puede ser negativo."),
        comments: optionalText(2000),
      }),
    )
    .max(30)
    .refine((list) => new Set(list.map((s) => s.criterionId)).size === list.length, "Hay criterios repetidos."),
});
export type EvaluationInput = z.infer<typeof evaluationSchema>;

export const judgeAssignmentSchema = z.object({ judgeId: uuid, teamId: id });

// ------------------------------------------------- Revisión de entregables (RF-38)
export const deliverableReviewSchema = z
  .object({
    deliverableId: id,
    decision: z.enum(["VALIDO", "OBSERVADO"], { message: "Decisión inválida." }),
    notes: optionalText(2000),
  })
  .refine((data) => data.decision === "VALIDO" || !!data.notes, {
    message: "Indica qué debe corregir el equipo.",
    path: ["notes"],
  });

export function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_form";
    (result[key] ??= []).push(issue.message);
  }
  return result;
}
