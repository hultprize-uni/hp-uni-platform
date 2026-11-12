# Entrega Auth e Integración (Issue #4)

Actualizado: 28/10/2026 (America/Lima).
Ramas de trabajo: `feature/auth-ssr-john` y `feature/auth-login-jairo` → integración en `feature/auth-ssr-integration` → PR hacia `dev`.

## Acuerdos cerrados del equipo (John, Jairo y Squad BD)

1. **Roles unificados en español y mayúsculas:** Tanto en Supabase Auth (`app_metadata.role`) como en el esquema Prisma (`enum Role`) los valores son `POSTULANTE`, `JURADO` y `ADMIN`.
2. **Formulario único de login (`/login`):** Se aprobó un único formulario en `/login` que redirige según el rol (`ADMIN` → `/admin`, `JURADO` → `/jurado`, `POSTULANTE` → `/`) y bloquea accesos cruzados redirigiendo al panel propio (`docs/adr/0002-auth-access-proposal.md`).
3. **Alta de jurados activa (`RF-37`):** Se integró el esquema Prisma (`prisma/schema.prisma`, `lib/prisma.ts`) y se conectó el adaptador tipado en `lib/auth/jury-store.ts` para que `createJury` vincule `User.id` con el UUID de Supabase Auth (`auth.users.id`) y asigne `app_metadata.role = "JURADO"`. Asimismo, se eliminó el hostname hardcodeado en `lib/supabase/admin.ts`.
4. **Flujo de ramas:** El trabajo de John y Jairo se une primero en `feature/auth-ssr-integration` y desde allí se abre el PR hacia `dev` para revisión de dirección.

## Archivos y propósito

| Archivos | Propósito |
|---|---|
| `lib/supabase/config.ts`, `client.ts`, `server.ts`, `proxy.ts`; `proxy.ts` raíz | Clientes compartidos, cookies SSR, validación/renovación e interceptación de rutas |
| `lib/auth/roles.ts`, `session.ts`, `validation.ts` | Roles exactos (`ADMIN`, `JURADO`, `POSTULANTE`), identidad validada, guard de servidor, validación y errores seguros |
| `app/login/actions.ts`, `page.tsx`, `login-form.tsx` | Login por contraseña con Server Action, mensajes seguros, navegación y protección contra doble envío |
| `app/logout/actions.ts`, `components/auth/logout-button.tsx` | Logout de sesión actual y botón reutilizable |
| `app/admin/{layout,page}.tsx`, `app/jurado/{layout,page}.tsx` | Paneles mínimos protegidos con comprobación de rol, logout y metadata `noindex` |
| `prisma/schema.prisma`, `lib/prisma.ts`, `app/admin/jurados/actions.ts`, `lib/auth/jury-registration.ts`, `jury-store.ts`, `lib/supabase/admin.ts` | Alta `ADMIN` (`RF-37`), adaptador Prisma activo sobre `User` (`id` = UUID Auth, `role` = `JURADO`), manejo de fallos/rollback y adaptador Supabase Admin |
| `app/layout.tsx` | Idioma español para tecnologías de asistencia |
| `package.json`, `package-lock.json`, `tsconfig.json` | Dependencias SSR, Prisma Client, scripts de verificación y soporte de imports TS para tests nativos de Node |
| `.gitignore`, `.env.example` | Protección de variantes de entorno y declaración de clave exclusiva del servidor (`SUPABASE_SERVICE_ROLE_KEY`) |
| `tests/auth.test.mjs`, `auth-http.mjs`, `auth-browser.mjs` | Pruebas unitarias, HTTP y navegador; sin credenciales versionadas |
| `docs/architecture.md`, `api.md`, `setup.md`, `auth-test-matrix.md`, `auth-ssr-progress.md`, ADR 0002 y este documento | Contratos, seguimiento de tareas, matriz de pruebas y decisiones cerradas |

## Estado A1–A10 y J1–J10

| ID | Estado y evidencia | Pendiente |
|---|---|---|
| A1 login | Implementado; HTTP 200, capturas Edge desktop/móvil revisadas | Ejecutar prueba con sesión real en DEV |
| A2 formulario separado | Implementado; interacción Edge | — |
| A3 validación local | Edge y unitarias pasan | — |
| A4 conectar signIn | Acción real llama a Supabase; intento de cuenta inexistente devuelve error seguro | Validar login exitoso ADMIN/JURADO en DEV |
| A5 redirección | Política unitaria pasa; destinos internos fijos aprobados | Validar con sesiones reales en DEV |
| A6 errores | Edge comprueba red offline y cuenta inexistente; unitarias comparan error genérico | Contraseña incorrecta de cuenta existente, sesión caducada, sin rol real |
| A7 paneles | Implementados y protegidos; HTTP anónimo bloqueado | Acceso permitido por rol real |
| A8 logout UI | Botón y acción implementados, compilados | Cerrar sesión real y Atrás/refrescar |
| A9 noindex | HTTP confirma header en paneles/subrutas; metadata conservada | HTML final autenticado |
| A10 pruebas funcionales | Parcial: navegador/HTTP y matriz actualizada | Completar flujos con cuentas reales en DEV |
| J1 dependencias | `@supabase/ssr` 0.12.7, `@supabase/supabase-js` 2.118.0 y `@prisma/client` 5.22.0 listos | — |
| J2 cliente browser | Implementado, compila y solo usa configuración pública | — |
| J3 cliente servidor | Implementado con cookies SSR asíncronas (Next.js 16) | — |
| J4 refresh SSR | Patrón request/response implementado en `lib/supabase/proxy.ts` | Probar renovación con sesión real |
| J5 Proxy raíz | `proxy.ts` implementado y reconocido en build | — |
| J6 roles | `ADMIN`/`JURADO`/`POSTULANTE` y rechazo exacto probados en unitarias | — |
| J7 guard rutas | Anónimo y cookie falsificada bloqueados por HTTP | Probar roles cruzados reales en DEV |
| J8 guard servidor | Layouts/páginas y acción `createJury` invocan `requireRole` | — |
| J9 logout contrato | Server Action compartida `signOut` y `LogoutButton` disponibles | Probar revocación con sesión real |
| J10 pruebas técnicas | 27 unitarias pasan; HTTP y navegador pasan; Prisma + RF-37 activos | Completar pruebas manuales/integradas en Supabase DEV |

## Criterios actuales de #4

| Criterio | Cobertura |
|---|---|
| Clientes SSR/cookies | Implementado (`client.ts`, `server.ts`, `proxy.ts`) |
| Vistas conectadas (`RF-27`, `RF-33`) | Login único en `/login` y paneles protegidos en `/admin` y `/jurado` |
| Interceptación (`RNF-04`) | `proxy.ts` por convención de Next.js 16; anónimos y JWT falso bloqueados |
| Roles y noindex (`RNF-04`) | `app_metadata.role` validado con `getUser()`; `X-Robots-Tag: noindex, nofollow` y metadata configurados |
| Alta de jurados (`RF-37`) | **Activa**: Server Action `createJury` exclusiva para `ADMIN`, adaptador Supabase Admin sin URLs hardcodeadas y adaptador Prisma (`JuryUserStore`) vinculado al modelo `User` con rol `JURADO` |
