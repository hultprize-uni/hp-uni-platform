import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getMyDeliverablesAction } from "@/lib/actions/deliverables";
import { DeliverablesDashboard } from "@/components/deliverables/deliverables-dashboard";

export const metadata: Metadata = {
  title: "Gestión de Entregables | Hult Prize at UNI",
  description:
    "Sube, visualiza y gestiona los entregables de tu equipo para la competencia Hult Prize at UNI.",
  robots: { index: false, follow: false },
};

export default async function EntregablesPage() {
  await requireRole("POSTULANTE");
  const result = await getMyDeliverablesAction();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Competencia 2026</span>
          <span>•</span>
          <span>Fase On-Campus</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Entregables del Equipo
        </h1>
        <p className="max-w-2xl text-muted-foreground text-sm sm:text-base">
          Sube los documentos y enlaces requeridos para tu postulación. Puedes reemplazarlos
          libremente antes del cierre del plazo de entrega.
        </p>
      </header>

      <DeliverablesDashboard
        initialDeliverables={result.data ?? []}
        initialError={result.success ? null : result.message}
      />
    </div>
  );
}
