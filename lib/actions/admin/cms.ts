"use server";

// Issue #11 — CRUD de contenido público (RF-06, RF-11, RF-15, RF-34, RF-35, RF-36).
// Cada acción: requireRole("ADMIN") → Zod → Prisma → revalidatePath de las rutas públicas.
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/actions/types";
import { HOME_CONTENT_KEY } from "@/lib/cms/keys";
import { removePublicAsset, uploadPublicAsset } from "@/lib/supabase/public-assets";
import {
  checkLogo,
  fieldErrors,
  homeContentSchema,
  partnerSchema,
  reorderSchema,
  timelineEventSchema,
  type HomeContent,
} from "@/lib/validations/cms-schema";

const INVALID = "Revisa los datos marcados.";
const FAILED = "No se pudo guardar el cambio. Inténtalo nuevamente.";

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/cronograma");
}

function fail(error: unknown, tag: string): ActionResult<never> {
  unstable_rethrow(error);
  console.error(`[${tag}]`, error);
  return { success: false, message: FAILED };
}

function notFound(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2025";
}

// ================================================================== Home (RF-06)
export async function updateHomeContentAction(input: HomeContent): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = homeContentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const value = parsed.data as Prisma.InputJsonObject;
    await prisma.siteContent.upsert({
      where: { key: HOME_CONTENT_KEY },
      create: { key: HOME_CONTENT_KEY, value },
      update: { value },
    });
    refreshPublic();
    return { success: true, message: "Contenido del Home actualizado." };
  } catch (error) {
    return fail(error, "UPDATE_HOME_ERROR");
  }
}

// ============================================================ Cronograma (RF-11, RF-34)
export async function createTimelineEventAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireRole("ADMIN");
  const parsed = timelineEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const last = await prisma.timelineEvent.aggregate({ _max: { order: true } });
    const event = await prisma.timelineEvent.create({
      data: { ...parsed.data, order: (last._max.order ?? -1) + 1 },
      select: { id: true },
    });
    refreshPublic();
    return { success: true, message: "Hito creado.", data: event };
  } catch (error) {
    return fail(error, "CREATE_TIMELINE_ERROR");
  }
}

export async function updateTimelineEventAction(id: string, input: unknown): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = timelineEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    await prisma.timelineEvent.update({ where: { id: String(id) }, data: { ...parsed.data, endDate: parsed.data.endDate ?? null } });
    refreshPublic();
    return { success: true, message: "Hito actualizado." };
  } catch (error) {
    if (notFound(error)) return { success: false, message: "El hito ya no existe." };
    return fail(error, "UPDATE_TIMELINE_ERROR");
  }
}

export async function deleteTimelineEventAction(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  try {
    await prisma.timelineEvent.delete({ where: { id: String(id) } });
    refreshPublic();
    return { success: true, message: "Hito eliminado." };
  } catch (error) {
    if (notFound(error)) return { success: false, message: "El hito ya no existe." };
    return fail(error, "DELETE_TIMELINE_ERROR");
  }
}

export async function reorderTimelineEventsAction(orderedIds: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = reorderSchema.safeParse(orderedIds);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const count = await prisma.timelineEvent.count({ where: { id: { in: parsed.data } } });
    const total = await prisma.timelineEvent.count();
    if (count !== parsed.data.length || count !== total)
      return { success: false, message: "La lista no coincide con los hitos actuales. Recarga la página." };
    await prisma.$transaction(
      parsed.data.map((eventId, order) => prisma.timelineEvent.update({ where: { id: eventId }, data: { order } })),
    );
    refreshPublic();
    return { success: true, message: "Cronograma reordenado." };
  } catch (error) {
    return fail(error, "REORDER_TIMELINE_ERROR");
  }
}

// ======================================================== Aliados (RF-15, RF-35, RF-36)
// FormData: name, type, category?, websiteUrl?, logo (File; obligatorio al crear, opcional al editar).
function partnerFields(formData: FormData) {
  const value = (key: string) => {
    const raw = formData.get(key);
    return typeof raw === "string" ? raw : undefined;
  };
  return partnerSchema.safeParse({
    name: value("name"),
    type: value("type"),
    category: value("category"),
    websiteUrl: value("websiteUrl") ?? "",
  });
}

async function uploadLogo(formData: FormData): Promise<{ url?: string; error?: string }> {
  const logo = formData.get("logo");
  if (!(logo instanceof File) || logo.size === 0) return {};
  const bytes = await logo.arrayBuffer();
  const check = checkLogo({ name: logo.name, size: logo.size, head: new Uint8Array(bytes.slice(0, 8)) });
  if (!check.ok) return { error: check.message };
  const path = `logos/${crypto.randomUUID()}.${check.extension}`;
  return { url: await uploadPublicAsset(path, bytes, check.contentType) };
}

export async function createPartnerAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireRole("ADMIN");
  const parsed = partnerFields(formData);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  let logoUrl: string | undefined;
  try {
    const logo = await uploadLogo(formData);
    if (logo.error) return { success: false, message: logo.error, errors: { logo: [logo.error] } };
    if (!logo.url) return { success: false, message: "Sube el logo del aliado.", errors: { logo: ["Sube el logo del aliado."] } };
    logoUrl = logo.url;
    const last = await prisma.partner.aggregate({ _max: { order: true } });
    const partner = await prisma.partner.create({
      data: { ...parsed.data, logoUrl, order: (last._max.order ?? -1) + 1 },
      select: { id: true },
    });
    refreshPublic();
    return { success: true, message: "Aliado creado.", data: partner };
  } catch (error) {
    if (logoUrl) await removePublicAsset(logoUrl); // compensación: no dejar el logo huérfano
    return fail(error, "CREATE_PARTNER_ERROR");
  }
}

export async function updatePartnerAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = partnerFields(formData);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  let newLogo: string | undefined;
  try {
    const current = await prisma.partner.findUnique({ where: { id: String(id) }, select: { logoUrl: true } });
    if (!current) return { success: false, message: "El aliado ya no existe." };
    const logo = await uploadLogo(formData);
    if (logo.error) return { success: false, message: logo.error, errors: { logo: [logo.error] } };
    newLogo = logo.url;
    await prisma.partner.update({
      where: { id: String(id) },
      data: {
        ...parsed.data,
        category: parsed.data.category ?? null,
        websiteUrl: parsed.data.websiteUrl ?? null,
        ...(newLogo ? { logoUrl: newLogo } : {}),
      },
    });
    if (newLogo) await removePublicAsset(current.logoUrl); // el logo anterior se borra solo tras guardar
    refreshPublic();
    return { success: true, message: "Aliado actualizado." };
  } catch (error) {
    if (newLogo) await removePublicAsset(newLogo);
    return fail(error, "UPDATE_PARTNER_ERROR");
  }
}

export async function deletePartnerAction(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  try {
    const deleted = await prisma.partner.delete({ where: { id: String(id) }, select: { logoUrl: true } });
    await removePublicAsset(deleted.logoUrl);
    refreshPublic();
    return { success: true, message: "Aliado eliminado." };
  } catch (error) {
    if (notFound(error)) return { success: false, message: "El aliado ya no existe." };
    return fail(error, "DELETE_PARTNER_ERROR");
  }
}

export async function reorderPartnersAction(orderedIds: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = reorderSchema.safeParse(orderedIds);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const [count, total] = await Promise.all([
      prisma.partner.count({ where: { id: { in: parsed.data } } }),
      prisma.partner.count(),
    ]);
    if (count !== parsed.data.length || count !== total)
      return { success: false, message: "La lista no coincide con los aliados actuales. Recarga la página." };
    await prisma.$transaction(
      parsed.data.map((partnerId, order) => prisma.partner.update({ where: { id: partnerId }, data: { order } })),
    );
    refreshPublic();
    return { success: true, message: "Aliados reordenados." };
  } catch (error) {
    return fail(error, "REORDER_PARTNERS_ERROR");
  }
}
