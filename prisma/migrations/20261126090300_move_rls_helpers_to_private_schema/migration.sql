-- Mueve las funciones auxiliares de RLS a un esquema no expuesto por la Data API.
-- Evita que usuarios autenticados las invoquen como RPC (/rest/v1/rpc/...).
-- Las politicas referencian las funciones por OID, por lo que no es necesario reescribirlas.

CREATE SCHEMA IF NOT EXISTS "private";

ALTER FUNCTION public.current_app_role() SET SCHEMA "private";
ALTER FUNCTION public.current_team_id() SET SCHEMA "private";

GRANT USAGE ON SCHEMA "private" TO authenticated;
GRANT EXECUTE ON FUNCTION private.current_app_role() TO authenticated;
GRANT EXECUTE ON FUNCTION private.current_team_id() TO authenticated;
