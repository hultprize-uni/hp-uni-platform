import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { AssignedTeamCard } from "@/components/jurado/assigned-team-card";
import { assignedTeams } from "@/lib/jurado/mock-data";

export const metadata: Metadata = {
  title: "Equipos asignados",
};

export default function JuryDashboardPage() {
  const pendingCount = assignedTeams.filter(
    (team) => team.evaluationStatus === "pending",
  ).length;
  const inProgressCount = assignedTeams.filter(
    (team) => team.evaluationStatus === "in-progress",
  ).length;
  const completedCount = assignedTeams.filter(
    (team) => team.evaluationStatus === "completed",
  ).length;

  const metrics = [
    { label: "Equipos asignados", value: assignedTeams.length, tone: "text-white" },
    { label: "Pendientes", value: pendingCount, tone: "text-white/75" },
    { label: "En progreso", value: inProgressCount, tone: "text-brand-pink-3" },
    { label: "Completados", value: completedCount, tone: "text-brand-cyan" },
  ];

  return (
    <div className="min-h-dvh bg-brand-ink">
      <header className="relative border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-brand-cyan/0 via-brand-pink/60 to-brand-cyan/0"
        />
        <div className="mx-auto flex min-h-[72px] w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <BrandLogo />
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-pink" />
            Datos de demostracion
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <section aria-labelledby="dashboard-title">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1
                className="max-w-2xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl"
                id="dashboard-title"
              >
                Equipos asignados
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Revisa las entregas y continua las evaluaciones de tus equipos.
              </p>
            </div>
            <p className="text-sm tabular-nums text-white/50">
              {assignedTeams.length} {assignedTeams.length === 1 ? "equipo" : "equipos"}
            </p>
          </div>
        </section>

        <section
          aria-label="Resumen de evaluaciones"
          className="mt-8 grid grid-cols-2 divide-x divide-y divide-white/10 border-y border-white/10 sm:mt-10 sm:grid-cols-4 sm:divide-y-0"
        >
          <dl className="contents">
            {metrics.map((metric) => (
              <div className="flex items-center justify-between gap-2 px-4 py-4 first:pl-0 sm:px-5 sm:py-5 sm:first:pl-0" key={metric.label}>
                <dt className="text-xs leading-5 text-white/55 sm:text-sm">{metric.label}</dt>
                <dd className={`text-xl font-semibold tabular-nums ${metric.tone}`}>
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="teams-heading" className="mt-9 sm:mt-11">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-lg font-semibold text-white" id="teams-heading">
              Tus equipos
            </h2>
            <span className="text-xs text-white/45">Estados de evaluacion</span>
          </div>

          {assignedTeams.length > 0 ? (
            <ul className="space-y-3">
              {assignedTeams.map((team) => (
                <li key={team.id}>
                  <AssignedTeamCard team={team} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
              <h3 className="text-base font-semibold text-white">Aun no tienes equipos asignados</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
                Cuando el equipo organizador te asigne propuestas, apareceran aqui para su evaluacion.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
