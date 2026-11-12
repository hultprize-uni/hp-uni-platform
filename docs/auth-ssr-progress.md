# Progreso de autenticación SSR — John

Documento de seguimiento incremental para el trabajo de John (en coordinación con Jairo) en la Issue #4 de autenticación SSR y alta de jurados (`RF-27`, `RF-33`, `RF-37`, `RNF-04`).

Las reglas permanentes de seguridad, alcance y colaboración se encuentran en `AGENTS.md`.

## Contrato confirmado y acuerdos de equipo

- Entorno actual: proyecto Supabase DEV.
- Fuente de autorización: `app_metadata.role` validado en servidor mediante `supabase.auth.getUser()`.
- Roles unificados en español y mayúsculas (tanto en Supabase Auth como en Prisma `enum Role`): `ADMIN`, `JURADO`, `POSTULANTE`.
- Un único formulario de inicio de sesión en `/login` con redirección automática por rol (`ADMIN` → `/admin`, `JURADO` → `/jurado`, `POSTULANTE` → `/`).
- Alta de jurados (`RF-37`) activa mediante Server Action exclusiva para `ADMIN` (`app/admin/jurados/actions.ts`), vinculando `User.id` en Prisma con `auth.users.id` de Supabase Auth.
- Estrategia de ramas: `feature/auth-ssr-john` y `feature/auth-login-jairo` se unen en `feature/auth-ssr-integration` y de ahí se abre PR hacia `dev`.

## Fase 0 — Alineación

- [x] 0.1 Confirmar la misma base del repositorio.
- [x] 0.2 Verificar el baseline local.
- [x] 0.3 Confirmar que las variables locales apuntan al proyecto Supabase DEV.
- [x] 0.4 Crear y confirmar usuarios de prueba `ADMIN` y `JURADO` en Supabase DEV.
- [x] 0.5 Aprobar el contrato de roles `ADMIN`, `JURADO` y `POSTULANTE` en español y mayúsculas.
- [x] 0.6 Asignar `app_metadata.role` a los usuarios de prueba en Supabase DEV.
- [x] 0.7 Inspeccionar y unificar con Jairo la interfaz de los helpers de autenticación (`lib/supabase/*`, `lib/auth/*`).
- [x] 0.8 Registrar la matriz compartida de casos de prueba (`docs/auth-test-matrix.md`).

## J1 — Preparar dependencias

- [x] J1.1 Revisar el estado de `package.json` y `package-lock.json`.
- [x] J1.2 Confirmar e integrar la arquitectura de Supabase SSR y Prisma Client.
- [x] J1.3 Consultar la documentación local relevante de Next.js 16 (`node_modules/next/dist/docs/`).
- [x] J1.4 Instalar/configurar `@supabase/ssr`, `@supabase/supabase-js`, `server-only` y `@prisma/client`.
- [x] J1.5 Revisar el diff de dependencias y configuración (`.env.example`, `.gitignore`, `tsconfig.json`).
- [x] J1.6 Ejecutar las verificaciones aplicables.
- [x] J1.7 Documentar archivos modificados.

## J2 — Cliente Supabase para browser

- [x] J2.1 Confirmar la interfaz en `lib/supabase/client.ts` y `lib/supabase/config.ts`.
- [x] J2.2 Crear `lib/supabase/client.ts` con `createBrowserClient`.
- [x] J2.3 Usar únicamente variables públicas permitidas (`NEXT_PUBLIC_SUPABASE_URL` y clave pública).
- [x] J2.4 Verificar que ningún secreto llegue al cliente.
- [x] J2.5 Documentar el contrato de uso en `docs/api.md`.

## J3 — Cliente Supabase para server

- [x] J3.1 Revisar la API vigente de `cookies()` asíncrona en Next.js 16.
- [x] J3.2 Crear `lib/supabase/server.ts` con `import "server-only"`.
- [x] J3.3 Integrar `createServerClient` con lectura y escritura segura de cookies.
- [x] J3.4 Manejar con `try/catch` los contextos donde Server Components no pueden escribir cookies.
- [x] J3.5 Documentar el contrato de uso en `docs/api.md`.

## J4 — Actualización de sesión SSR

- [x] J4.1 Revisar el patrón vigente de Supabase SSR para actualización de sesión.
- [x] J4.2 Crear `lib/supabase/proxy.ts` (`updateSession`).
- [x] J4.3 Copiar correctamente las cookies entre `request`, `response` y respuestas de redirección (`NextResponse.redirect`).
- [x] J4.4 Validar la identidad mediante `supabase.auth.getUser()`.
- [x] J4.5 Evitar usar `getSession()` como decisión de autorización del servidor.
- [x] J4.6 Verificar renovación, errores seguros (503 fail-closed en paneles) y ausencia de logs sensibles.

## J5 — Proxy de Next.js

- [x] J5.1 Revisar la documentación local de `proxy.ts` en Next.js 16.
- [x] J5.2 Crear el `proxy.ts` raíz exportando `proxy(request: NextRequest)`.
- [x] J5.3 Conectar el helper `updateSession`.
- [x] J5.4 Definir `config.matcher` para `/admin/:path*`, `/jurado/:path*` y `/login`.
- [x] J5.5 Confirmar que `/login` no produzca ciclos de redirección.
- [x] J5.6 Ejecutar las verificaciones aplicables.

## J6 — Contrato de roles

- [x] J6.1 Definir el tipo `Role` (`"ADMIN" | "JURADO" | "POSTULANTE"`) y `PanelRole` (`"ADMIN" | "JURADO"`).
- [x] J6.2 Crear `lib/auth/roles.ts`.
- [x] J6.3 Leer el rol exclusivamente desde `app_metadata.role` validado.
- [x] J6.4 Rechazar valores ausentes, en minúsculas o desconocidos en los paneles privados.
- [x] J6.5 Exponer `parseRole`, `panelForRole`, `requiredPanelRole` y `accessRedirect`.
- [x] J6.6 Ejecutar pruebas unitarias del contrato de roles (`tests/auth.test.mjs`).

## J7 — Protección por rol

- [x] J7.1 Redirigir usuarios no autenticados de `/admin` y `/jurado` hacia `/login`.
- [x] J7.2 Permitir `/admin` únicamente a `ADMIN`.
- [x] J7.3 Permitir `/jurado` únicamente a `JURADO`.
- [x] J7.4 Redirigir el acceso cruzado entre ambos roles hacia su propio panel (`/admin` o `/jurado`).
- [x] J7.5 Denegar usuarios autenticados sin un rol de panel válido (`/login?error=unauthorized`).
- [x] J7.6 Unificar con Jairo el contrato de destinos y errores de redirección (`docs/adr/0002-auth-access-proposal.md`).
- [x] J7.7 Verificar URLs directas, subrutas y ausencia de ciclos.

## J8 — Protección server-side adicional y Alta de Jurados (RF-37)

- [x] J8.1 Proteger layouts y páginas privadas (`app/admin/{layout,page}.tsx`, `app/jurado/{layout,page}.tsx`) con `requireRole`.
- [x] J8.2 Implementar `getSessionUser` y `requireRole` en `lib/auth/session.ts` con `server-only` y React `cache`.
- [x] J8.3 Integrar el esquema Prisma (`prisma/schema.prisma`, `lib/prisma.ts`) con `enum Role { POSTULANTE, JURADO, ADMIN }` y modelo `User`.
- [x] J8.4 Conectar el adaptador Prisma en `lib/auth/jury-store.ts` y eliminar el hostname hardcodeado en `lib/supabase/admin.ts` para dejar activo el alta de jurados (`RF-37` en `app/admin/jurados/actions.ts`).
- [x] J8.5 Ejecutar las verificaciones aplicables.

## J9 — Contrato de logout

- [x] J9.1 Implementar la Server Action `signOut` en `app/logout/actions.ts`.
- [x] J9.2 Integrar con `components/auth/logout-button.tsx`.
- [x] J9.3 Eliminar la sesión local (`signOut({ scope: "local" })`), revalidar caché y redirigir a `/login`.
- [x] J9.4 Asegurar cabeceras `Cache-Control: private, no-store, max-age=0` en rutas protegidas.
- [x] J9.5 Documentar la interfaz en `docs/api.md`.

## J10 — Pruebas técnicas

- [x] J10.1 Ejecutar pruebas unitarias (`npm run test:auth` — 27/27 en verde).
- [x] J10.2 Ejecutar `npm run lint` y `npm run typecheck`.
- [x] J10.3 Ejecutar `npm run build`.
- [ ] J10.4 Completar matriz de pruebas con sesiones reales (`ADMIN`, `JURADO`, sin rol) y alta de jurado en Supabase DEV (`docs/auth-test-matrix.md`).
