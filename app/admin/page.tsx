import { requireRole } from "@/lib/auth/session";

export default async function AdminPage() {
  await requireRole("ADMIN");
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel de administración
        </h1>
        <p className="text-sm text-muted-foreground">
          Página de prueba de acceso. El contenido real llegará con el CMS.
        </p>
      </div>
    </main>
  );
}
