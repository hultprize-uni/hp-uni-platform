"use server";

// Issue #8 — Carga y gestión de entregables (RF-24, RF-25, RF-26, RNF-03).
import { unstable_rethrow } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/actions/types";
import {
  DELIVERABLES_BUCKET,
  removeObject,
  signedUrl,
  uploadObject,
} from "@/lib/supabase/storage";
import {
  buildStoragePath,
  checkFile,
  deliverableKeySchema,
  DELIVERABLE_SLOTS,
  findSlot,
  isStoragePath,
  isWithinDeadline,
  parseDeadline,
  videoLinkSchema,
  type DeliverableFileType,
  type DeliverableSlotKey,
  type DeliverableStatusValue,
} from "@/lib/deliverables/rules";

export type DeliverableView = {
  key: DeliverableSlotKey;
  title: string;
  accepts: readonly DeliverableFileType[];
  status: DeliverableStatusValue;
  fileType: string | null;
  uploadedAt: string | null;
  viewUrl: string | null; // URL firmada (archivos) o el enlace de video
  canReplace: boolean;
};

const NO_TEAM: ActionResult = {
  success: false,
  message: "Tu cuenta aún no está vinculada a un equipo. Completa primero tu inscripción.",
};

// El equipo se obtiene SIEMPRE de la sesión verificada; nunca de un teamId enviado por el cliente.
async function currentTeamId(): Promise<string | null> {
  const session = await requireRole("POSTULANTE");
  const user = await prisma.user.findUnique({
    where: { id: session.authUserId },
    select: { teamId: true },
  });
  return user?.teamId ?? null;
}

function deadline(): Date | null {
  return parseDeadline(process.env.DELIVERABLES_DEADLINE);
}

async function toView(
  slot: (typeof DELIVERABLE_SLOTS)[number],
  row: { status: DeliverableStatusValue; fileType: string; fileUrl: string; uploadedAt: Date | null } | undefined,
  open: boolean,
): Promise<DeliverableView> {
  let viewUrl: string | null = null;
  if (row) viewUrl = isStoragePath(row.fileUrl) ? await signedUrl(DELIVERABLES_BUCKET, row.fileUrl) : row.fileUrl;
  return {
    key: slot.key,
    title: slot.title,
    accepts: slot.accepts,
    status: row?.status ?? "PENDIENTE",
    fileType: row?.fileType ?? null,
    uploadedAt: row?.uploadedAt?.toISOString() ?? null,
    viewUrl,
    canReplace: open,
  };
}

/** RF-26: estado de todos los entregables del equipo de la sesión. */
export async function getMyDeliverablesAction(): Promise<ActionResult<DeliverableView[]>> {
  try {
    const teamId = await currentTeamId();
    if (!teamId) return NO_TEAM as ActionResult<DeliverableView[]>;

    const rows = await prisma.deliverable.findMany({
      where: { teamId, title: { in: DELIVERABLE_SLOTS.map((slot) => slot.title) } },
      orderBy: { updatedAt: "desc" },
    });
    const open = isWithinDeadline(new Date(), deadline());
    const views = await Promise.all(
      DELIVERABLE_SLOTS.map((slot) => toView(slot, rows.find((row) => row.title === slot.title), open)),
    );
    return { success: true, message: "Estado de entregables obtenido.", data: views };
  } catch (error) {
    unstable_rethrow(error);
    console.error("[GET_DELIVERABLES_ERROR]", error);
    return { success: false, message: "No se pudo consultar el estado de los entregables." };
  }
}

/** RF-26: estado de un entregable puntual ("PENDIENTE", "SUBIDO" o "RECIBIDO"). */
export async function getDeliverableStatusAction(key: string): Promise<ActionResult<DeliverableView>> {
  const parsedKey = deliverableKeySchema.safeParse(key);
  if (!parsedKey.success) return { success: false, message: "Entregable no reconocido." };
  const all = await getMyDeliverablesAction();
  if (!all.success || !all.data) return { success: false, message: all.message };
  const view = all.data.find((item) => item.key === parsedKey.data);
  return view
    ? { success: true, message: `Estado: ${view.status}.`, data: view }
    : { success: false, message: "Entregable no reconocido." };
}

/**
 * RF-24, RF-25, RF-26, RNF-03: sube o reemplaza un entregable.
 * FormData esperado: `key` (slot) y `file` (PDF/DOCX) o `videoUrl` (enlace).
 */
export async function uploadDeliverableAction(formData: FormData): Promise<ActionResult<DeliverableView>> {
  try {
    const teamId = await currentTeamId();
    if (!teamId) return NO_TEAM as ActionResult<DeliverableView>;

    const parsedKey = deliverableKeySchema.safeParse(formData.get("key"));
    if (!parsedKey.success)
      return { success: false, message: "Entregable no reconocido.", errors: { key: ["Entregable no reconocido."] } };
    const slot = findSlot(parsedKey.data)!;

    const now = new Date();
    if (!isWithinDeadline(now, deadline()))
      return { success: false, message: "El plazo de entrega terminó. Ya no se pueden subir ni reemplazar archivos." };

    const existing = await prisma.deliverable.findFirst({
      where: { teamId, title: slot.title },
      orderBy: { updatedAt: "desc" },
    });

    // --- Enlace de video ---------------------------------------------------
    const rawLink = formData.get("videoUrl");
    if ((slot.accepts as readonly string[]).includes("LINK")) {
      const link = videoLinkSchema.safeParse(typeof rawLink === "string" ? rawLink : "");
      if (!link.success) {
        const message = link.error.issues[0]?.message ?? "Enlace inválido.";
        return { success: false, message, errors: { videoUrl: [message] } };
      }
      const saved = await saveRow(existing?.id, { teamId, title: slot.title, fileType: "LINK", fileUrl: link.data, now });
      if (existing && isStoragePath(existing.fileUrl)) await removeObject(DELIVERABLES_BUCKET, existing.fileUrl);
      return {
        success: true,
        message: existing ? "Enlace reemplazado correctamente." : "Enlace registrado correctamente.",
        data: await toView(slot, saved, true),
      };
    }

    // --- Archivo PDF / DOCX ------------------------------------------------
    const file = formData.get("file");
    if (!(file instanceof File))
      return { success: false, message: "Selecciona un archivo.", errors: { file: ["Selecciona un archivo."] } };

    const bytes = await file.arrayBuffer();
    const check = checkFile(
      { name: file.name, size: file.size, type: file.type, head: new Uint8Array(bytes.slice(0, 8)) },
      slot.accepts,
    );
    if (!check.ok) return { success: false, message: check.message, errors: { file: [check.message] } };

    const path = buildStoragePath(teamId, slot.key, check.extension, now);
    await uploadObject(DELIVERABLES_BUCKET, path, bytes, check.contentType);

    let saved;
    try {
      saved = await saveRow(existing?.id, { teamId, title: slot.title, fileType: check.fileType, fileUrl: path, now });
    } catch (dbError) {
      // Compensación: si la BD falla, no dejamos el archivo nuevo huérfano y el anterior sigue vigente.
      await removeObject(DELIVERABLES_BUCKET, path);
      throw dbError;
    }
    // Solo después de guardar la nueva referencia se borra el archivo reemplazado.
    if (existing && isStoragePath(existing.fileUrl)) await removeObject(DELIVERABLES_BUCKET, existing.fileUrl);

    return {
      success: true,
      message: existing ? "Archivo reemplazado correctamente." : "Archivo subido correctamente.",
      data: await toView(slot, saved, true),
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error("[UPLOAD_DELIVERABLE_ERROR]", error);
    return { success: false, message: "No se pudo subir el entregable. Inténtalo nuevamente." };
  }
}

async function saveRow(
  existingId: string | undefined,
  input: { teamId: string; title: string; fileType: string; fileUrl: string; now: Date },
) {
  const data = { fileType: input.fileType, fileUrl: input.fileUrl, status: "SUBIDO" as const, uploadedAt: input.now };
  return existingId
    ? prisma.deliverable.update({ where: { id: existingId }, data })
    : prisma.deliverable.create({ data: { ...data, teamId: input.teamId, title: input.title } });
}

