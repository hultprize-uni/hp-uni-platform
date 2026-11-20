// Reglas puras de entregables (RF-24, RF-25, RF-26, RNF-03).
// Sin dependencias de Next, Prisma ni Supabase: se prueban con `npm run test:deliverables`.
import { z } from "zod";

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILE_LABEL = "10 MB";

export type DeliverableFileType = "PDF" | "DOCX" | "LINK";
export type DeliverableStatusValue = "PENDIENTE" | "SUBIDO" | "RECIBIDO";

// Entregables que cada equipo debe presentar. PENDIENTE DE CONFIRMAR con el encargado del área:
// los títulos y formatos son una propuesta inicial.
export const DELIVERABLE_SLOTS = [
  { key: "resumen-ejecutivo", title: "Resumen ejecutivo", accepts: ["PDF", "DOCX"] },
  { key: "pitch-deck", title: "Pitch deck", accepts: ["PDF"] },
  { key: "video-pitch", title: "Video pitch", accepts: ["LINK"] },
] as const satisfies readonly {
  key: string;
  title: string;
  accepts: readonly DeliverableFileType[];
}[];

export type DeliverableSlot = (typeof DELIVERABLE_SLOTS)[number];
export type DeliverableSlotKey = DeliverableSlot["key"];

export function findSlot(key: string): DeliverableSlot | undefined {
  return DELIVERABLE_SLOTS.find((slot) => slot.key === key);
}

const FILE_TYPES: Record<"PDF" | "DOCX", { extension: string; mimeTypes: string[] }> = {
  PDF: { extension: "pdf", mimeTypes: ["application/pdf"] },
  DOCX: {
    extension: "docx",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  },
};

// Solo plataformas de video conocidas, para no aceptar enlaces arbitrarios.
const VIDEO_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com", "drive.google.com"];

export const videoLinkSchema = z
  .string()
  .trim()
  .url("Ingresa un enlace válido.")
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && VIDEO_HOSTS.includes(url.hostname.toLowerCase());
    } catch {
      return false;
    }
  }, "El enlace debe ser https de YouTube, Vimeo o Google Drive.");

export const deliverableKeySchema = z.enum(
  DELIVERABLE_SLOTS.map((slot) => slot.key) as [DeliverableSlotKey, ...DeliverableSlotKey[]],
  { message: "Entregable no reconocido." },
);

export type FileCandidate = { name: string; size: number; type: string; head: Uint8Array };

export type FileCheck =
  | { ok: true; fileType: "PDF" | "DOCX"; extension: string; contentType: string }
  | { ok: false; message: string };

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

// Valida peso, extensión, MIME declarado y firma real del archivo (los primeros bytes),
// porque el nombre y el MIME los controla el cliente.
export function checkFile(file: FileCandidate, accepts: readonly DeliverableFileType[]): FileCheck {
  if (file.size <= 0) return { ok: false, message: "El archivo está vacío." };
  if (file.size > MAX_FILE_BYTES)
    return { ok: false, message: `El archivo supera el máximo permitido de ${MAX_FILE_LABEL}.` };

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const match = (Object.entries(FILE_TYPES) as ["PDF" | "DOCX", (typeof FILE_TYPES)["PDF"]][]).find(
    ([, info]) => info.extension === extension,
  );
  const allowedLabel = accepts.filter((type) => type !== "LINK").join(" o ");
  if (!match || !accepts.includes(match[0]))
    return { ok: false, message: `Formato no permitido. Sube un archivo ${allowedLabel}.` };

  const [fileType, info] = match;
  if (file.type && !info.mimeTypes.includes(file.type))
    return { ok: false, message: `El archivo no parece ser un ${fileType} válido.` };

  const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
  const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04]; // DOCX es un ZIP
  const validSignature =
    fileType === "PDF" ? startsWith(file.head, PDF_SIGNATURE) : startsWith(file.head, ZIP_SIGNATURE);
  if (!validSignature) return { ok: false, message: `El archivo no parece ser un ${fileType} válido.` };

  return { ok: true, fileType, extension: info.extension, contentType: info.mimeTypes[0] };
}

// Sin plazo configurado no se bloquea la carga; con plazo, se permite hasta el instante límite inclusive.
export function isWithinDeadline(now: Date, deadline: Date | null): boolean {
  return deadline === null || now.getTime() <= deadline.getTime();
}

export function parseDeadline(raw: string | undefined): Date | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) throw new Error("DELIVERABLES_DEADLINE no es una fecha ISO válida.");
  return date;
}

// La ruta incluye un sello de tiempo: el reemplazo sube un objeto nuevo y luego borra el anterior,
// así nunca se pierde el archivo vigente si falla la subida o la base de datos.
export function buildStoragePath(teamId: string, key: DeliverableSlotKey, extension: string, now: Date): string {
  return `${teamId}/${key}/${now.getTime()}.${extension}`;
}

export function isStoragePath(fileUrl: string): boolean {
  return !/^https?:\/\//i.test(fileUrl);
}
