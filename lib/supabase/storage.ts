import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./config";

// Cliente de Storage solo para el servidor (service_role). El bucket debe ser PRIVADO:
// los archivos se leen con URLs firmadas de corta duración, nunca con URLs públicas.
export const DELIVERABLES_BUCKET = process.env.DELIVERABLES_BUCKET || "deliverables";
const SIGNED_URL_SECONDS = 60 * 10;

function storageClient() {
  const { url } = getPublicSupabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta configuración de servidor para Storage.");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  }).storage;
}

export async function uploadObject(bucket: string, path: string, body: ArrayBuffer, contentType: string) {
  const { error } = await storageClient().from(bucket).upload(path, body, { contentType, upsert: false });
  if (error) throw new Error("No se pudo subir el archivo a Storage.");
}

// Borrado de mejor esfuerzo: un objeto huérfano no debe romper la operación del usuario.
export async function removeObject(bucket: string, path: string): Promise<boolean> {
  const { error } = await storageClient().from(bucket).remove([path]);
  if (error) console.error("[STORAGE_REMOVE_ERROR]", { bucket, path });
  return !error;
}

export async function signedUrl(bucket: string, path: string): Promise<string | null> {
  const { data, error } = await storageClient().from(bucket).createSignedUrl(path, SIGNED_URL_SECONDS);
  return error ? null : data.signedUrl;
}
