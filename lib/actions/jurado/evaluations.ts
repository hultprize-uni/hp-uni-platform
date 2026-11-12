"use server";

// Issue #11 — Guardado de calificaciones del jurado (RF-30, RF-31, RNF-03, RNF-05).
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/actions/types";
import { checkScores, weightedTotal } from "@/lib/evaluations/rules";
import { evaluationSchema, fieldErrors, type EvaluationInput } from "@/lib/validations/cms-schema";

type SavedEvaluation = { evaluationId: string; isCompleted: boolean; total: number };

// Se lanza dentro de la transacción para revertirla si falta calificar algún criterio.
class IncompleteEvaluationError extends Error {
  constructor(readonly errors: Record<string, string[]>) {
    super("INCOMPLETE");
  }
}

/**
 * Guarda un borrador (`finalize: false`) o finaliza la evaluación (`finalize: true`).
 * El jurado sale de la sesión verificada; solo puede calificar equipos asignados y
 * una evaluación finalizada ya no se puede modificar.
 */
export async function saveEvaluationAction(input: EvaluationInput): Promise<ActionResult<SavedEvaluation>> {
  const session = await requireRole("JURADO");
  const parsed = evaluationSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los puntajes.", errors: fieldErrors(parsed.error) };
  const { teamId, rubricId, feedback, finalize, scores } = parsed.data;
  const judgeId = session.authUserId;

  try {
    const assigned = await prisma.judgeAssignment.findUnique({
      where: { judgeId_teamId: { judgeId, teamId } },
      select: { id: true },
    });
    // Mismo mensaje si el equipo no existe o no está asignado: no revela otros equipos.
    if (!assigned) return { success: false, message: "Este equipo no está asignado a tu cuenta." };

    const rubric = await prisma.rubric.findUnique({
      where: { id: rubricId },
      select: { isActive: true, criteria: { select: { id: true, name: true, maxScore: true, weight: true } } },
    });
    if (!rubric || !rubric.isActive) return { success: false, message: "La rúbrica no está disponible." };

    const scoreErrors = checkScores(rubric.criteria, scores, false);
    if (Object.keys(scoreErrors).length)
      return { success: false, message: "Revisa los puntajes.", errors: scoreErrors };

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.evaluation.findUnique({
        where: { judgeId_teamId_rubricId: { judgeId, teamId, rubricId } },
        select: { id: true, isCompleted: true },
      });
      if (existing?.isCompleted) return null;

      const evaluation = existing
        ? await tx.evaluation.update({
            where: { id: existing.id },
            data: { feedback: feedback ?? null, isCompleted: finalize },
            select: { id: true },
          })
        : await tx.evaluation.create({
            data: { judgeId, teamId, rubricId, feedback: feedback ?? null, isCompleted: finalize },
            select: { id: true },
          });

      for (const score of scores) {
        const data = { score: score.score, comments: score.comments ?? null };
        await tx.evaluationScore.upsert({
          where: { evaluationId_criterionId: { evaluationId: evaluation.id, criterionId: score.criterionId } },
          create: { ...data, evaluationId: evaluation.id, criterionId: score.criterionId },
          update: data,
        });
      }
      const stored = await tx.evaluationScore.findMany({
        where: { evaluationId: evaluation.id },
        select: { criterionId: true, score: true },
      });
      // Al finalizar cuentan también los puntajes guardados antes como borrador.
      if (finalize) {
        const missing = checkScores(rubric.criteria, stored, true);
        if (Object.keys(missing).length) throw new IncompleteEvaluationError(missing);
      }
      return { evaluationId: evaluation.id, stored };
    });

    if (!result) return { success: false, message: "Esta evaluación ya fue finalizada y no se puede modificar." };

    revalidatePath("/jurado");
    revalidatePath("/jurado/equipos/[id]", "page");
    return {
      success: true,
      message: finalize ? "Evaluación finalizada." : "Borrador guardado.",
      data: {
        evaluationId: result.evaluationId,
        isCompleted: finalize,
        total: weightedTotal(rubric.criteria, result.stored),
      },
    };
  } catch (error) {
    if (error instanceof IncompleteEvaluationError)
      return { success: false, message: "Califica todos los criterios antes de finalizar.", errors: error.errors };
    unstable_rethrow(error);
    console.error("[SAVE_EVALUATION_ERROR]", error);
    return { success: false, message: "No se pudo guardar la evaluación. Inténtalo nuevamente." };
  }
}
