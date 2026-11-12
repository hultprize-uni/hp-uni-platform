"use server";

// Issue #11 — Rúbricas (RF-39), asignación de jurados (RF-30) y revisión de entregables (RF-38).
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/actions/types";
import {
  deliverableReviewSchema,
  fieldErrors,
  judgeAssignmentSchema,
  rubricSchema,
} from "@/lib/validations/cms-schema";

const INVALID = "Revisa los datos marcados.";

function fail(error: unknown, tag: string): ActionResult<never> {
  unstable_rethrow(error);
  console.error(`[${tag}]`, error);
  return { success: false, message: "No se pudo guardar el cambio. Inténtalo nuevamente." };
}

// ================================================================= Rúbricas (RF-39)
/** Crea (sin rubricId) o edita una rúbrica con sus criterios. Bloqueado si ya hay evaluaciones finalizadas. */
export async function saveRubricAction(rubricId: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireRole("ADMIN");
  const parsed = rubricSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  const { criteria, ...rubric } = parsed.data;

  try {
    if (!rubricId) {
      const created = await prisma.rubric.create({
        data: {
          ...rubric,
          criteria: {
            create: criteria.map((criterion, order) => ({
              name: criterion.name,
              description: criterion.description,
              maxScore: criterion.maxScore,
              weight: criterion.weight,
              order,
            })),
          },
        },
        select: { id: true },
      });
      return { success: true, message: "Rúbrica creada.", data: created };
    }

    const id = String(rubricId);
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.rubric.findUnique({ where: { id }, select: { criteria: { select: { id: true } } } });
      if (!current) return "NOT_FOUND" as const;
      // Una rúbrica con evaluaciones finalizadas no se puede alterar: cambiaría notas ya emitidas.
      if (await tx.evaluation.count({ where: { rubricId: id, isCompleted: true } })) return "LOCKED" as const;

      const currentIds = new Set(current.criteria.map((criterion) => criterion.id));
      if (criteria.some((criterion) => criterion.id && !currentIds.has(criterion.id))) return "FOREIGN" as const;

      const keep = criteria.flatMap((criterion) => (criterion.id ? [criterion.id] : []));
      await tx.rubricCriterion.deleteMany({ where: { rubricId: id, id: { notIn: keep } } });
      await tx.rubric.update({ where: { id }, data: { ...rubric, description: rubric.description ?? null } });
      for (const [order, { id: criterionId, ...criterion }] of criteria.entries()) {
        const data = { ...criterion, description: criterion.description ?? null, order };
        if (criterionId) await tx.rubricCriterion.update({ where: { id: criterionId }, data });
        else await tx.rubricCriterion.create({ data: { ...data, rubricId: id } });
      }
      return "OK" as const;
    });

    if (result === "NOT_FOUND") return { success: false, message: "La rúbrica ya no existe." };
    if (result === "LOCKED")
      return { success: false, message: "La rúbrica ya tiene evaluaciones finalizadas y no se puede modificar." };
    if (result === "FOREIGN") return { success: false, message: "Un criterio no pertenece a esta rúbrica." };
    revalidatePath("/jurado", "layout");
    return { success: true, message: "Rúbrica actualizada.", data: { id } };
  } catch (error) {
    return fail(error, "SAVE_RUBRIC_ERROR");
  }
}

// ============================================================ Asignación de jurados (RF-30)
export async function assignJudgeAction(input: unknown): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = judgeAssignmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const [judge, team] = await Promise.all([
      prisma.user.findUnique({ where: { id: parsed.data.judgeId }, select: { role: true } }),
      prisma.team.findUnique({ where: { id: parsed.data.teamId }, select: { id: true } }),
    ]);
    if (judge?.role !== "JURADO") return { success: false, message: "El usuario seleccionado no es jurado." };
    if (!team) return { success: false, message: "El equipo no existe." };
    await prisma.judgeAssignment.upsert({
      where: { judgeId_teamId: parsed.data },
      create: parsed.data,
      update: {},
    });
    revalidatePath("/jurado", "layout");
    return { success: true, message: "Equipo asignado al jurado." };
  } catch (error) {
    return fail(error, "ASSIGN_JUDGE_ERROR");
  }
}

export async function unassignJudgeAction(input: unknown): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = judgeAssignmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    await prisma.judgeAssignment.deleteMany({ where: parsed.data });
    revalidatePath("/jurado", "layout");
    return { success: true, message: "Asignación retirada." };
  } catch (error) {
    return fail(error, "UNASSIGN_JUDGE_ERROR");
  }
}

// ======================================================= Revisión de entregables (RF-38)
/** Marca un entregable como VÁLIDO u OBSERVADO; en ambos casos queda RECIBIDO por la organización. */
export async function reviewDeliverableAction(input: unknown): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = deliverableReviewSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: parsed.data.deliverableId },
      select: { status: true },
    });
    if (!deliverable) return { success: false, message: "El entregable ya no existe." };
    if (deliverable.status === "PENDIENTE")
      return { success: false, message: "El equipo aún no ha subido este entregable." };
    await prisma.deliverable.update({
      where: { id: parsed.data.deliverableId },
      data: {
        status: "RECIBIDO",
        reviewStatus: parsed.data.decision,
        reviewNotes: parsed.data.notes ?? null,
        reviewedAt: new Date(),
      },
    });
    revalidatePath("/admin", "layout");
    return {
      success: true,
      message: parsed.data.decision === "VALIDO" ? "Entregable marcado como válido." : "Entregable marcado como observado.",
    };
  } catch (error) {
    return fail(error, "REVIEW_DELIVERABLE_ERROR");
  }
}
