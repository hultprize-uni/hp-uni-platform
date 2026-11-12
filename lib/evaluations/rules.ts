// Reglas puras de calificación (RF-30, RF-31, RF-39). Sin Prisma: se prueban con node --test.

export type Criterion = { id: string; name: string; maxScore: number; weight: number };
export type ScoreInput = { criterionId: string; score: number };

// Valida que cada puntaje pertenezca a la rúbrica y no supere el máximo del criterio.
// Al finalizar, además, todos los criterios deben estar calificados.
export function checkScores(criteria: Criterion[], scores: ScoreInput[], finalize: boolean): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  const byId = new Map(criteria.map((criterion) => [criterion.id, criterion]));
  for (const score of scores) {
    const criterion = byId.get(score.criterionId);
    if (!criterion) (errors[score.criterionId] ??= []).push("El criterio no pertenece a esta rúbrica.");
    else if (score.score > criterion.maxScore)
      (errors[score.criterionId] ??= []).push(`«${criterion.name}» admite como máximo ${criterion.maxScore} puntos.`);
  }
  if (finalize) {
    const graded = new Set(scores.map((score) => score.criterionId));
    for (const criterion of criteria)
      if (!graded.has(criterion.id)) (errors[criterion.id] ??= []).push(`Falta calificar «${criterion.name}».`);
  }
  return errors;
}

// Puntaje final normalizado a 0–100: suma ponderada de (puntaje / máximo) por el peso de cada criterio.
export function weightedTotal(criteria: Criterion[], scores: ScoreInput[]): number {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (totalWeight === 0) return 0;
  const byId = new Map(scores.map((score) => [score.criterionId, score.score]));
  const sum = criteria.reduce(
    (acc, criterion) => acc + ((byId.get(criterion.id) ?? 0) / criterion.maxScore) * criterion.weight,
    0,
  );
  return Math.round((sum / totalWeight) * 10000) / 100;
}
