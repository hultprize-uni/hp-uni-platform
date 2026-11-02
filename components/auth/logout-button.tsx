"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/logout/actions";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <form action={async () => {
      if (pending) return;
      setPending(true);
      setError("");
      try {
        const result = await signOut();
        if (result?.error) setError(result.error);
        router.refresh();
      } catch {
        setError("No pudimos cerrar la sesión. Inténtalo de nuevo.");
      } finally { setPending(false); }
    }} className="space-y-2">
      <Button type="submit" disabled={pending}>{pending ? "Cerrando sesión..." : "Cerrar sesión"}</Button>
      <p aria-live="polite" className="text-sm text-destructive">{error}</p>
    </form>
  );
}
