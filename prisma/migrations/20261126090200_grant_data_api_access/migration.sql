-- Concede acceso a la Data API de Supabase (roles anon y authenticated).
-- Las filas visibles dependen de las politicas RLS definidas en 20261126090100_enable_rls_policies.
-- Prisma no usa estos roles, por lo que no se ve afectado por estos grants.

GRANT USAGE ON SCHEMA "public" TO anon, authenticated;

-- Contenido publico del CMS: lectura para cualquier visitante.
GRANT SELECT ON "public"."timeline_events", "public"."partners" TO anon;

-- Tablas de la aplicacion: el acceso por fila lo limita RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON
  "public"."users",
  "public"."teams",
  "public"."deliverables",
  "public"."timeline_events",
  "public"."partners",
  "public"."rubrics",
  "public"."rubric_criteria",
  "public"."evaluations",
  "public"."evaluation_scores"
TO authenticated;

-- La tabla interna de Prisma no se expone a la Data API.
REVOKE ALL ON "public"."_prisma_migrations" FROM anon, authenticated;
