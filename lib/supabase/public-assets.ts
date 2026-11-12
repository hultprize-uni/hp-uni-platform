import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./config";

// Bucket PÚBLICO solo para recursos de la web (logos de aliados). Nunca para entregables.
export const PARTNERS_BUCKET = process.env.PARTNERS_BUCKET || "partners";

function storage() {
  const { url } = getPublicSupabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta configuración de servidor para Storage.");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  }).storage.from(PARTNERS_BUCKET);
}

export async function uploadPublicAsset(path: string, body: ArrayBuffer, contentType: string): Promise<string> {
  const bucket = storage();
  const { error } = await bucket.upload(path, body, { contentType, upsert: false });
  if (error) throw new Error("No se pudo subir el logo.");
  return bucket.getPublicUrl(path).data.publicUrl;
}

// Mejor esfuerzo: recibe la URL pública guardada en BD y borra el objeto si es de este bucket.
export async function removePublicAsset(publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${PARTNERS_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return;
  const { error } = await storage().remove([decodeURIComponent(publicUrl.slice(index + marker.length))]);
  if (error) console.error("[PUBLIC_ASSET_REMOVE_ERROR]");
}
