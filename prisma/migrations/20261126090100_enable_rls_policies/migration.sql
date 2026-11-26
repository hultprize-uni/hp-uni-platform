-- Habilita Row Level Security en todas las tablas de public y define politicas por rol.
--
-- Roles de aplicacion (enum "Role"): POSTULANTE, JURADO, ADMIN.
-- Prisma se conecta con el rol de base de datos del proyecto, que omite RLS;
-- estas politicas protegen la Data API de Supabase (anon y authenticated).

-- ------------------------------------------
-- Funciones auxiliares
-- ------------------------------------------
-- SECURITY DEFINER evita la recursion de RLS al leer public.users dentro de politicas de public.users.

CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS "Role"
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u."role" FROM public.users u WHERE u.id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.current_team_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u."teamId" FROM public.users u WHERE u.id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.current_app_role() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.current_team_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_app_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_team_id() TO authenticated;

-- ------------------------------------------
-- users
-- ------------------------------------------
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON "public"."users"
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "users_select_teammates" ON "public"."users"
  FOR SELECT TO authenticated
  USING ("teamId" IS NOT NULL AND "teamId" = public.current_team_id());

CREATE POLICY "users_insert_own" ON "public"."users"
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()) AND "role" = 'POSTULANTE' AND "teamId" IS NULL AND "isLeader" = false);

-- El usuario puede editar sus datos de contacto, pero no su rol, equipo ni liderazgo.
CREATE POLICY "users_update_own" ON "public"."users"
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (
    id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.users o
      WHERE o.id = users.id
        AND o."role" = users."role"
        AND o."teamId" IS NOT DISTINCT FROM users."teamId"
        AND o."isLeader" = users."isLeader"
    )
  );

CREATE POLICY "users_admin_all" ON "public"."users"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- teams
-- ------------------------------------------
ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams_select_member" ON "public"."teams"
  FOR SELECT TO authenticated
  USING (id = public.current_team_id());

CREATE POLICY "teams_select_staff" ON "public"."teams"
  FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('JURADO', 'ADMIN'));

CREATE POLICY "teams_admin_all" ON "public"."teams"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- deliverables
-- ------------------------------------------
-- Los miembros del equipo gestionan sus entregables hasta que el administrador marca RECIBIDO.
ALTER TABLE "public"."deliverables" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deliverables_select_team" ON "public"."deliverables"
  FOR SELECT TO authenticated
  USING ("teamId" = public.current_team_id());

CREATE POLICY "deliverables_select_jury" ON "public"."deliverables"
  FOR SELECT TO authenticated
  USING (public.current_app_role() = 'JURADO');

CREATE POLICY "deliverables_team_insert" ON "public"."deliverables"
  FOR INSERT TO authenticated
  WITH CHECK ("teamId" = public.current_team_id() AND status <> 'RECIBIDO');

CREATE POLICY "deliverables_team_update" ON "public"."deliverables"
  FOR UPDATE TO authenticated
  USING ("teamId" = public.current_team_id() AND status <> 'RECIBIDO')
  WITH CHECK ("teamId" = public.current_team_id() AND status <> 'RECIBIDO');

CREATE POLICY "deliverables_team_delete" ON "public"."deliverables"
  FOR DELETE TO authenticated
  USING ("teamId" = public.current_team_id() AND status <> 'RECIBIDO');

CREATE POLICY "deliverables_admin_all" ON "public"."deliverables"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- timeline_events y partners (contenido publico del CMS)
-- ------------------------------------------
ALTER TABLE "public"."timeline_events" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "timeline_events_public_select" ON "public"."timeline_events"
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "timeline_events_admin_all" ON "public"."timeline_events"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

ALTER TABLE "public"."partners" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners_public_select" ON "public"."partners"
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "partners_admin_all" ON "public"."partners"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- rubrics y rubric_criteria (visibles para jurados)
-- ------------------------------------------
ALTER TABLE "public"."rubrics" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rubrics_staff_select" ON "public"."rubrics"
  FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('JURADO', 'ADMIN'));

CREATE POLICY "rubrics_admin_all" ON "public"."rubrics"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

ALTER TABLE "public"."rubric_criteria" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rubric_criteria_staff_select" ON "public"."rubric_criteria"
  FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('JURADO', 'ADMIN'));

CREATE POLICY "rubric_criteria_admin_all" ON "public"."rubric_criteria"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- evaluations (cada jurado solo ve y escribe sus evaluaciones)
-- ------------------------------------------
ALTER TABLE "public"."evaluations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evaluations_judge_select" ON "public"."evaluations"
  FOR SELECT TO authenticated
  USING ("judgeId" = (SELECT auth.uid()));

CREATE POLICY "evaluations_judge_insert" ON "public"."evaluations"
  FOR INSERT TO authenticated
  WITH CHECK ("judgeId" = (SELECT auth.uid()) AND public.current_app_role() = 'JURADO');

CREATE POLICY "evaluations_judge_update" ON "public"."evaluations"
  FOR UPDATE TO authenticated
  USING ("judgeId" = (SELECT auth.uid()) AND public.current_app_role() = 'JURADO')
  WITH CHECK ("judgeId" = (SELECT auth.uid()) AND public.current_app_role() = 'JURADO');

CREATE POLICY "evaluations_admin_all" ON "public"."evaluations"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- evaluation_scores (heredan el acceso de su evaluacion)
-- ------------------------------------------
ALTER TABLE "public"."evaluation_scores" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evaluation_scores_judge_select" ON "public"."evaluation_scores"
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.evaluations e
    WHERE e.id = "evaluation_scores"."evaluationId" AND e."judgeId" = (SELECT auth.uid())
  ));

CREATE POLICY "evaluation_scores_judge_write" ON "public"."evaluation_scores"
  FOR ALL TO authenticated
  USING (
    public.current_app_role() = 'JURADO' AND EXISTS (
      SELECT 1 FROM public.evaluations e
      WHERE e.id = "evaluation_scores"."evaluationId" AND e."judgeId" = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    public.current_app_role() = 'JURADO' AND EXISTS (
      SELECT 1 FROM public.evaluations e
      WHERE e.id = "evaluation_scores"."evaluationId" AND e."judgeId" = (SELECT auth.uid())
    )
  );

CREATE POLICY "evaluation_scores_admin_all" ON "public"."evaluation_scores"
  FOR ALL TO authenticated
  USING (public.current_app_role() = 'ADMIN')
  WITH CHECK (public.current_app_role() = 'ADMIN');

-- ------------------------------------------
-- Tabla interna de Prisma: sin politicas, bloqueada para la Data API
-- ------------------------------------------
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
