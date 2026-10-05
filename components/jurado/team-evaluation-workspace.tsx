"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CirclePlay,
  Clock3,
  FileText,
  LoaderCircle,
  Send,
  Users,
  Video,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import type {
  AssignedTeam,
  CriterionAnswer,
  DeliveryStatus,
  EvaluationDraft,
  EvaluationSubmission,
} from "@/lib/jurado/mock-data";
import { evaluationRubric } from "@/lib/jurado/mock-data";

type SaveStatus = "loading" | "saving" | "saved" | "error";

const saveStatusContent: Record<
  SaveStatus,
  { label: string; icon: typeof Check; className: string }
> = {
  loading: {
    label: "Cargando borrador",
    icon: LoaderCircle,
    className: "text-white/45",
  },
  saving: {
    label: "Guardando...",
    icon: LoaderCircle,
    className: "text-brand-pink-3",
  },
  saved: {
    label: "Guardado en este dispositivo",
    icon: CheckCircle2,
    className: "text-brand-cyan",
  },
  error: {
    label: "No se pudo guardar el borrador",
    icon: CircleAlert,
    className: "text-brand-pink-3",
  },
};

function readDraftAnswers(value: unknown, teamId: string): CriterionAnswer[] | null {
  if (!value || typeof value !== "object") return null;

  const draft = value as Partial<EvaluationDraft>;
  if (draft.teamId !== teamId || !Array.isArray(draft.answers)) return null;

  const savedAnswers = new Map(
    draft.answers
      .filter(
        (answer): answer is CriterionAnswer =>
          Boolean(answer) && typeof answer.criterionId === "string",
      )
      .map((answer) => [answer.criterionId, answer]),
  );

  return evaluationRubric.map((criterion) => {
    const saved = savedAnswers.get(criterion.id);
    const score = saved?.score;

    return {
      criterionId: criterion.id,
      weight: criterion.weight,
      score: typeof score === "number" && score >= 1 && score <= 10 ? score : null,
      feedback:
        typeof saved?.feedback === "string" ? saved.feedback.slice(0, 1000) : "",
    };
  });
}

function DocumentPreview({
  team,
  status,
}: {
  team: AssignedTeam;
  status: DeliveryStatus;
}) {
  const received = status === "received";

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileText aria-hidden="true" className="size-4 shrink-0 text-brand-pink-3" />
          <h2 className="truncate text-sm font-semibold text-white">Propuesta del equipo</h2>
        </div>
        <span className="shrink-0 text-[0.7rem] text-white/45">PDF / DOCX</span>
      </header>

      <div
        aria-label={
          received
            ? `Vista previa simulada de la propuesta de ${team.name}`
            : "La propuesta aun no ha sido recibida"
        }
        className="flex aspect-[16/9] items-center justify-center bg-[#201d2e] p-5 sm:p-7"
        role="img"
      >
        {received ? (
          <div className="w-full max-w-[260px] rounded-sm border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <p className="text-[0.65rem] font-semibold uppercase text-brand-pink-3">
              Vista previa simulada
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-white">{team.name}</p>
            <p className="mt-1 line-clamp-2 text-[0.7rem] leading-4 text-white/55">
              {team.project}
            </p>
            <div aria-hidden="true" className="mt-4 space-y-2">
              <span className="block h-1 w-full rounded-full bg-white/10" />
              <span className="block h-1 w-4/5 rounded-full bg-white/10" />
              <span className="block h-1 w-3/5 rounded-full bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FileText aria-hidden="true" className="mx-auto size-7 text-white/30" />
            <p className="mt-2 text-sm font-medium text-white/70">Propuesta pendiente</p>
            <p className="mt-1 text-xs text-white/45">El equipo organizador aun no la ha cargado.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function PitchPreview({ status }: { status: DeliveryStatus }) {
  const received = status === "received";

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Video aria-hidden="true" className="size-4 shrink-0 text-brand-cyan" />
          <h2 className="truncate text-sm font-semibold text-white">Video pitch</h2>
        </div>
        <span className="text-[0.7rem] text-white/45">Vista simulada</span>
      </header>

      <div
        aria-label={received ? "Reproductor simulado de video pitch" : "Video pitch pendiente"}
        className="flex aspect-video items-center justify-center bg-[#15151b] p-5"
        role="img"
      >
        {received ? (
          <div className="text-center">
            <CirclePlay aria-hidden="true" className="mx-auto size-10 text-brand-pink" />
            <p className="mt-2 text-sm font-medium text-white/80">Reproductor de demostracion</p>
            <p className="mt-1 text-xs text-white/45">El video real se conectara al servicio de entregas.</p>
          </div>
        ) : (
          <div className="text-center">
            <Video aria-hidden="true" className="mx-auto size-7 text-white/30" />
            <p className="mt-2 text-sm font-medium text-white/70">Video pendiente</p>
            <p className="mt-1 text-xs text-white/45">El equipo aun no ha enviado su pitch.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function TeamEvaluationWorkspace({ team }: { team: AssignedTeam }) {
  const storageKey = `jury-evaluation:${team.id}`;
  const [answers, setAnswers] = useState<CriterionAnswer[]>(() =>
    evaluationRubric.map((criterion) => ({
      criterionId: criterion.id,
      weight: criterion.weight,
      score: null,
      feedback: "",
    })),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(storageKey);
      if (rawDraft) {
        const restoredAnswers = readDraftAnswers(JSON.parse(rawDraft), team.id);
        if (restoredAnswers) setAnswers(restoredAnswers);
      }
      setSubmitted(window.localStorage.getItem(`${storageKey}:submitted`) === "true");
    } catch {
      setSaveStatus("error");
    }

    setHasHydrated(true);
  }, [storageKey, team.id]);

  useEffect(() => {
    if (!hasHydrated || submitted) return;

    setSaveStatus("saving");
    const timeoutId = window.setTimeout(() => {
      const draft: EvaluationDraft = {
        teamId: team.id,
        answers,
        updatedAt: new Date().toISOString(),
      };

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(draft));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 550);

    return () => window.clearTimeout(timeoutId);
  }, [answers, hasHydrated, storageKey, submitted, team.id]);

  const answeredCount = answers.filter((answer) => answer.score !== null).length;
  const allAnswered = answeredCount === evaluationRubric.length;
  const weightedScore = allAnswered
    ? answers.reduce(
        (total, answer) => total + (answer.score ?? 0) * (answer.weight / 100),
        0,
      )
    : null;
  const currentSaveStatus = saveStatusContent[saveStatus];
  const SaveStatusIcon = currentSaveStatus.icon;

  function updateAnswer(
    criterionId: string,
    changes: Partial<Pick<CriterionAnswer, "score" | "feedback">>,
  ) {
    setAnswers((current) =>
      current.map((answer) =>
        answer.criterionId === criterionId ? { ...answer, ...changes } : answer,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allAnswered || saveStatus === "saving") return;

    try {
      const submittedAt = new Date().toISOString();
      const submission: EvaluationSubmission = {
        teamId: team.id,
        answers,
        updatedAt: submittedAt,
        submittedAt,
      };
      window.localStorage.setItem(`${storageKey}:final`, JSON.stringify(submission));
      window.localStorage.setItem(`${storageKey}:submitted`, "true");
      setSubmitted(true);
      setSubmitError("");
    } catch {
      setSubmitError(
        "No se pudo confirmar el envio. Revisa el almacenamiento del navegador e intenta nuevamente.",
      );
    }
  }

  return (
    <div className="min-h-dvh bg-brand-ink">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/jurado" aria-label="Hult Prize at UNI, equipos asignados" className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-pink">
            <BrandLogo />
          </Link>
          <Link
            href="/jurado"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-white/65 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-brand-pink"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span>Equipos asignados</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 sm:pt-11">
        <section aria-labelledby="team-title" className="mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/45">
            <span>{team.category}</span>
            <span aria-hidden="true" className="size-1 rounded-full bg-white/25" />
            <span className="inline-flex items-center gap-1.5">
              <Users aria-hidden="true" className="size-3.5" />
              {team.members} integrantes
            </span>
          </div>
          <h1
            className="mt-2 break-words text-3xl font-bold leading-tight text-white sm:text-4xl"
            id="team-title"
          >
            {team.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">
            {team.project}
          </p>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8">
          <div className="space-y-5">
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">Contexto del equipo</h2>
              <dl className="mt-4 grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 pt-4">
                <div className="pr-4">
                  <dt className="text-xs text-white/45">Categoria</dt>
                  <dd className="mt-1 break-words text-sm font-medium text-white/85">{team.category}</dd>
                </div>
                <div className="pl-4">
                  <dt className="text-xs text-white/45">Integrantes</dt>
                  <dd className="mt-1 text-sm font-medium text-white/85">{team.members}</dd>
                </div>
              </dl>
            </section>

            <DocumentPreview team={team} status={team.proposalStatus} />
            <PitchPreview status={team.pitchStatus} />
          </div>

          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:sticky lg:top-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Rubrica de evaluacion</h2>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Criterios y pesos de demostracion
                </p>
              </div>
              <div
                aria-live="polite"
                className={`inline-flex items-center gap-1.5 text-xs ${currentSaveStatus.className}`}
                role="status"
              >
                <SaveStatusIcon
                  aria-hidden="true"
                  className={`size-3.5 ${saveStatus === "saving" || saveStatus === "loading" ? "animate-spin motion-reduce:animate-none" : ""}`}
                />
                {currentSaveStatus.label}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <p className="text-xs text-white/55">
                {answeredCount} de {evaluationRubric.length} criterios puntuados
              </p>
              <p className="shrink-0 text-xs text-white/55">
                Puntaje ponderado{" "}
                <span className="font-semibold tabular-nums text-white">
                  {weightedScore === null ? "--" : `${weightedScore.toFixed(1)} / 10`}
                </span>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {evaluationRubric.map((criterion) => {
                const answer = answers.find((item) => item.criterionId === criterion.id);
                const scoreId = `${team.id}-${criterion.id}-score`;
                const feedbackId = `${team.id}-${criterion.id}-feedback`;

                return (
                  <fieldset
                    className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                    disabled={submitted || !hasHydrated}
                    key={criterion.id}
                  >
                    <legend className="sr-only">{criterion.category}</legend>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase text-brand-pink-3">
                          {criterion.category}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-white">{criterion.title}</h3>
                      </div>
                      <span className="text-xs tabular-nums text-white/50">
                        Peso {criterion.weight}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-white/50">
                      {criterion.description}
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(100px,0.32fr)_minmax(0,1fr)]">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/70" htmlFor={scoreId}>
                          Puntaje
                        </label>
                        <div className="relative">
                          <select
                            className="h-11 w-full appearance-none rounded-md border border-white/10 bg-[#201d2e] px-3 pr-9 text-base text-white outline-none transition-colors hover:border-white/20 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/35 disabled:cursor-not-allowed disabled:opacity-50"
                            id={scoreId}
                            onChange={(event) =>
                              updateAnswer(
                                criterion.id,
                                { score: event.target.value ? Number(event.target.value) : null },
                              )
                            }
                            value={answer?.score ?? ""}
                          >
                            <option value="">Elegir</option>
                            {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
                              <option key={score} value={score}>
                                {score} / 10
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/45"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/70" htmlFor={feedbackId}>
                          Comentario <span className="font-normal text-white/40">(opcional)</span>
                        </label>
                        <textarea
                          className="min-h-11 w-full resize-y rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-base leading-5 text-white outline-none transition-colors placeholder:text-white/35 hover:border-white/20 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/35 disabled:cursor-not-allowed disabled:opacity-50"
                          id={feedbackId}
                          maxLength={1000}
                          onChange={(event) =>
                            updateAnswer(criterion.id, { feedback: event.target.value })
                          }
                          placeholder="Anota una observacion..."
                          rows={2}
                          value={answer?.feedback ?? ""}
                        />
                      </div>
                    </div>
                  </fieldset>
                );
              })}

              <div className="border-t border-white/10 pt-5">
                {submitted ? (
                  <p className="mb-3 flex items-center gap-2 text-sm text-brand-cyan" role="status">
                    <CheckCircle2 aria-hidden="true" className="size-4" />
                    Evaluacion enviada y confirmada en este dispositivo.
                  </p>
                ) : (
                  <p
                    className={`mb-3 min-h-5 text-xs leading-5 ${submitError ? "text-brand-pink-3" : "text-white/55"}`}
                    role={submitError ? "alert" : undefined}
                  >
                    {submitError ||
                      (allAnswered
                        ? "El envio quedara registrado como una confirmacion de demostracion."
                        : "Puntua todos los criterios para habilitar el envio definitivo.")}
                  </p>
                )}
                <button
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-pink px-4 text-sm font-semibold text-white outline-none transition-[background-color,box-shadow,transform] duration-200 hover:bg-brand-pink-2 hover:shadow-[0_8px_24px_rgba(234,72,153,0.18)] active:translate-y-px focus-visible:ring-2 focus-visible:ring-brand-pink-3 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:shadow-none motion-reduce:transition-none"
                  disabled={!hasHydrated || !allAnswered || saveStatus === "saving" || submitted}
                  type="submit"
                >
                  {submitted ? (
                    <>
                      Evaluacion confirmada
                      <Check aria-hidden="true" className="size-4" />
                    </>
                  ) : (
                    <>
                      Enviar evaluacion definitiva
                      <Send aria-hidden="true" className="size-4" />
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-[0.7rem] leading-5 text-white/40">
                  El borrador se guarda localmente; no se envia a un servidor.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
