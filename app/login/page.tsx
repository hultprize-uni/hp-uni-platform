import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { getSessionUser } from "@/lib/auth/session";
import { panelForRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "Iniciar sesión | Hult Prize at UNI",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getSessionUser();
  const panel = panelForRole(user?.role ?? null);
  if (panel) redirect(panel);
  const params = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-muted-foreground">
            Acceso para jurado y administración.
          </p>
        </div>
        {params.error === "unauthorized" && (
          <p role="alert" className="text-sm text-destructive">
            Tu cuenta no tiene permiso para acceder a estos paneles.
          </p>
        )}
        {user?.role === "POSTULANTE" && (
          <p className="text-sm text-muted-foreground">Tu cuenta de postulante no tiene acceso a los paneles de jurado o administración.</p>
        )}
        <LoginForm />
        {user && <LogoutButton />}
      </div>
    </main>
  );
}
