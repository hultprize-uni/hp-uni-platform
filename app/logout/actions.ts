"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signOut(): Promise<{ error: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) return { error: "No pudimos cerrar la sesión. Inténtalo de nuevo." };
  } catch {
    return { error: "No pudimos conectar para cerrar la sesión. Inténtalo de nuevo." };
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
