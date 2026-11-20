import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "Portal de Postulantes | Hult Prize at UNI",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("POSTULANTE");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/portal/entregables"
              className="flex items-center gap-2 font-semibold text-sm tracking-tight sm:text-base"
            >
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                HULT PRIZE UNI
              </span>
              <span>Portal de Postulante</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/portal/entregables"
                className="font-medium text-foreground transition-colors hover:text-foreground"
              >
                Entregables
              </Link>
            </nav>
            <div className="h-4 w-px bg-border" />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
