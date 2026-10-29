<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Estándar y Reglas de Desarrollo — Squad Auth & Sec

## 1. Contexto y Rol del Squad

Este documento establece las directrices permanentes para los agentes de IA y desarrolladores del squad de **Autenticación y Seguridad (Auth & Sec)** en la plataforma web de Hult Prize at UNI.

**Objetivo del Squad:**
Garantizar la gestión segura de identidades, sesiones SSR, control de acceso basado en roles (RBAC), protección de endpoints/rutas privadas y orquestación de permisos contra Supabase Auth y la base de datos relacional (Prisma/PostgreSQL).

**Stack Principal del Squad:**
- Next.js (App Router, Server Actions, Server Components, `proxy.ts`)
- TypeScript
- Supabase Auth & `@supabase/ssr`
- Supabase Admin SDK (`@supabase/supabase-js` con `service_role` en servidor)
- Prisma ORM (`prisma/schema.prisma` y `@prisma/client`)

---

## 2. Principios y Reglas de Seguridad (No Negociables)

1. **Gestión de Secretos y Variables de Entorno:**
   - Nunca hardcodear credenciales, tokens o UUIDs en el código ni en la documentación.
   - Variables públicas (`NEXT_PUBLIC_*`) únicamente para la URL y la clave pública/anon de Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY` es **exclusiva del servidor**. Nunca debe tener prefijo público, ni importarse en Client Components, ni exponerse en respuestas al cliente o logs.
   - `.env` y variantes locales (`.env.local`, `.env.development`) jamás se versionan en Git.

2. **Fuente de Verdad para Autorización:**
   - La autorización en servidor debe basarse **únicamente** en `user.app_metadata.role` verificado mediante `supabase.auth.getUser()`.
   - **Nunca** utilizar `user_metadata` para tomar decisiones de acceso ni confiar en `getSession()` en el servidor (no valida el token contra la API de Auth).
   - Todo rol no reconocido, ausente o sin permiso debe fallar de forma cerrada (*fail-closed*).

3. **Defensa en Profundidad (Zero Trust en el Servidor):**
   - Ocultar botones o elementos en el frontend **no equivale** a seguridad.
   - Toda Server Action o endpoint privado debe ejecutar `requireRole(...)` de forma independiente antes de leer, escribir o ejecutar lógica de negocio.

4. **Respuestas Seguras y Privacidad:**
   - Las rutas y respuestas privadas deben incluir cabeceras de no almacenamiento en caché (`Cache-Control: private, no-store, max-age=0`) y directivas de motores de búsqueda (`X-Robots-Tag: noindex, nofollow`).
   - Los mensajes de error de autenticación deben ser genéricos (evitar la enumeración de cuentas o confirmar la existencia de correos).

---

## 3. Convenciones Técnicas de Arquitectura

### 3.1 Next.js App Router & Interceptación
- La interceptación global de solicitudes y refresco de sesión SSR se maneja mediante `proxy.ts` en la raíz (convención vigente en Next.js 16+, no usar `middleware.ts`).
- Las cookies en servidor (`cookies()`) son asíncronas (`await cookies()`).
- Los clientes Supabase deben seguir la separación estricta:
  - `lib/supabase/client.ts`: Cliente Browser para componentes interactivos.
  - `lib/supabase/server.ts`: Cliente Server con `cookies()` y `import "server-only"`.
  - `lib/supabase/proxy.ts`: Lógica de sincronización de cookies en request/response durante el routing.

### 3.2 Roles del Sistema
Los roles del sistema están unificados en **español y mayúsculas** tanto en Supabase Auth como en el `enum Role` de Prisma:
- `ADMIN`: Acceso a paneles de administración y operaciones privilegiadas de servidor.
- `JURADO`: Acceso exclusivo al panel de jurado y rúbricas de evaluación.
- `POSTULANTE`: Participante registrado, sin acceso a paneles administrativos ni de evaluación.

### 3.3 Integración con Base de Datos (Prisma)
- El identificador del usuario en PostgreSQL (`User.id`) corresponde exactamente al UUID de Supabase Auth (`auth.users.id`).
- Las altas administrativas de usuarios que involucren Auth y BD deben orquestarse con patrones de compensación (rollback) para garantizar la coherencia en caso de fallos de red.

---

## 4. Flujo de Trabajo del Squad (Git & Colaboración)

1. **Ramas de Trabajo:**
   - Nunca trabajar directamente sobre `main` ni `dev`.
   - Desarrollo en parejas mediante ramas temáticas o personales (`feature/auth-*`).
   - Integración local previa en una rama común de integración (`feature/auth-*-integration`) antes de abrir PR formal.
   - El Pull Request definitivo de cada issue se abre siempre hacia `dev` para revisión del Director/Líder de TI.

2. **Criterios de Calidad antes de cada Commit / PR:**
   - Ejecutar pruebas automatizadas: `npm run test:auth`.
   - Comprobar tipado estático: `npm run typecheck` (`tsc --noEmit`).
   - Comprobar formato y sintaxis: `npm run lint`.
   - Validar compilación de producción: `npm run build`.
   - No considerar una tarea terminada si alguno de estos comandos falla.

---

## 5. Regla Final para Agentes de IA

Priorizar siempre:
1. **Seguridad y privacidad.**
2. **Claridad del código y preservación de comentarios existentes.**
3. **Mínimo alcance necesario para la issue en curso (evitar scope creep).**
4. **Verificación incremental con el usuario antes de realizar cambios de impacto.**
