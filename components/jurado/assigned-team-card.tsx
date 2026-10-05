import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDashed,
  Clock3,
  FileText,
  Users,
  Video,
} from "lucide-react";
import type {
  AssignedTeam,
  DeliveryStatus,
  EvaluationStatus,
} from "@/lib/jurado/mock-data";

const evaluationStatusLabels: Record<EvaluationStatus, string> = {
  pending: "Pendiente",
  "in-progress": "En progreso",
  completed: "Completado",
};

const evaluationStatusStyles: Record<EvaluationStatus, string> = {
  pending: "border-white/10 bg-white/[0.04] text-white/60",
  "in-progress": "border-brand-pink/25 bg-brand-pink/10 text-brand-pink-3",
  completed: "border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan",
};

function DeliveryItem({
  label,
  status,
  icon: Icon,
}: {
  label: string;
  status: DeliveryStatus;
  icon: typeof FileText;
}) {
  const isReceived = status === "received";

  return (
    <li className="flex min-w-0 items-center gap-2 text-xs">
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-white/40" />
      <span className="truncate text-white/60">{label}</span>
      <span
        className={`ml-auto shrink-0 font-medium ${isReceived ? "text-brand-cyan" : "text-brand-pink-3"}`}
      >
        {isReceived ? "Recibido" : "No recibido"}
      </span>
    </li>
  );
}

export function AssignedTeamCard({ team }: { team: AssignedTeam }) {
  const StatusIcon =
    team.evaluationStatus === "completed"
      ? Check
      : team.evaluationStatus === "in-progress"
        ? Clock3
        : CircleDashed;

  return (
    <article className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] active:translate-y-0 motion-reduce:transition-none sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-semibold text-white">{team.name}</h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium ${evaluationStatusStyles[team.evaluationStatus]}`}
            >
              <StatusIcon aria-hidden="true" className="size-3" />
              {evaluationStatusLabels[team.evaluationStatus]}
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">{team.project}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/45">
            <span>{team.category}</span>
            <span className="inline-flex items-center gap-1.5">
              <Users aria-hidden="true" className="size-3.5" />
              {team.members} {team.members === 1 ? "integrante" : "integrantes"}
            </span>
          </div>
        </div>

        <Link
          aria-label={`Abrir evaluacion de ${team.name}`}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-brand-pink px-4 text-sm font-semibold text-white outline-none transition-[transform,background-color,box-shadow] duration-200 hover:bg-brand-pink-2 hover:shadow-[0_8px_24px_rgba(234,72,153,0.2)] active:translate-y-px focus-visible:ring-2 focus-visible:ring-brand-pink-3 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink motion-reduce:transition-none sm:w-auto"
          href={`/jurado/equipos/${team.id}`}
        >
          Abrir evaluacion
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </div>

      <ul
        aria-label={`Entregas de ${team.name}`}
        className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2 sm:gap-6"
      >
        <DeliveryItem label="Propuesta" status={team.proposalStatus} icon={FileText} />
        <DeliveryItem label="Video pitch" status={team.pitchStatus} icon={Video} />
      </ul>
    </article>
  );
}
