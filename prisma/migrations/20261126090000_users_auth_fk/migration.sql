-- Vincula public.users con las cuentas de Supabase Auth.
-- El id de cada usuario debe ser el mismo UUID de auth.users (ver comentario en schema.prisma).
-- La tabla users no tiene filas en el momento de la migracion, por lo que la restriccion no falla.

ALTER TABLE "public"."users"
  ADD CONSTRAINT "users_id_auth_users_fkey"
  FOREIGN KEY ("id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE;
