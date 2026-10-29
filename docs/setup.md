# Preparación Auth DEV

Actualizado: 28/10/2026. Usar Node 24 LTS para repetir las pruebas de TypeScript nativo.
Las versiones verificadas están en `docs/architecture.md`.

## Variables (sin valores reales)

Mantenerlas en `.env` o `.env.local`, ignorados por Git:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto **hp-uni-dev**.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` **o** `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
  clave pública del mismo proyecto. Se conserva compatibilidad con el nombre antiguo;
  si ambas tienen valor se prioriza publishable.
- `SUPABASE_SERVICE_ROLE_KEY`: solo servidor, necesaria para alta de jurados (`RF-37`).
  Obtenerla por canal privado desde las API keys de DEV, nunca pegarla en chat ni usar `NEXT_PUBLIC_`.
- `DATABASE_URL` y `DIRECT_URL`: conexión Prisma a la base de datos PostgreSQL de DEV.

## Lo que John y Jairo deben comprobar en el panel DEV

1. Abrir explícitamente **hp-uni-dev**.
2. Authentication → Users: localizar las cuentas de prueba `ADMIN` y `JURADO` y confirmar
   que están habilitadas/confirmadas. Compartir sus credenciales solo por el canal privado acordado.
3. Verificar `app_metadata.role` en mayúsculas y en español (`ADMIN`, `JURADO`, `POSTULANTE`).
   Nunca usar `user_metadata` para permisos.
4. Crear o facilitar cuentas DEV adicionales sin rol, con rol desconocido y `POSTULANTE`
   para pruebas. No quitar el rol al único `ADMIN` disponible; conservar una cuenta de recuperación.
5. Authentication → URL Configuration: Site URL local habitual `http://localhost:3000`;
   Redirect URLs para localhost y el preview de dev.

## Pruebas locales

```bash
npx prisma generate
npm run test:auth
npm run lint
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 3101
```

En otra terminal: `npm run test:auth:http`.
Para las pruebas de navegador automatizadas con Playwright/Edge: `npm run test:auth:browser`.
Capturas locales en `.auth-artifacts/` (ignoradas por Git).

Para probar `ADMIN` y `JURADO` simultáneamente de forma manual, usar perfiles separados o navegadores distintos: ventanas incógnitas del mismo navegador pueden compartir sesión. No guardar credenciales en scripts versionados.
