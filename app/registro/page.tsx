import type { Metadata } from "next";

import { RegisterTeamForm } from "@/components/forms/register-team-form";

export const metadata: Metadata = {
  title: "Inscripción | Hult Prize UNI",
  description: "Inscríbete de forma individual o con tu equipo en Hult Prize UNI.",
};

export default function RegistroPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Hult Prize UNI
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Inscripción y postulación
        </h1>
        <p className="text-muted-foreground">
          Completa los datos de cada integrante. Validamos la información mientras escribes.
        </p>
      </header>

      <RegisterTeamForm />
    </main>
  );
}
