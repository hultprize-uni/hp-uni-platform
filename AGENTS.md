<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Instrucciones para agentes de IA - HP UNI Platform

## Contexto del proyecto

Este repositorio corresponde a la plataforma web de Hult Prize at UNI.

Stack principal:

- Next.js 16
- React 19
- TypeScript
- App Router
- Supabase
- Supabase Auth
- Supabase Storage
- Prisma
- Tailwind CSS
- Shadcn/UI
- Vercel

Antes de implementar cambios:

1. inspeccionar el código actual;
2. revisar la documentación local de Next.js si aplica;
3. revisar la issue y requerimientos relacionados;
4. evitar asumir convenciones antiguas del framework.

## Forma de trabajo del agente

Antes de realizar cambios importantes:

- explicar qué se encontró;
- indicar qué archivos se modificarán o crearán;
- explicar por qué;
- mencionar riesgos o dependencias;
- avisar si existen varias soluciones posibles.

Trabajar de forma incremental.

No implementar varias fases grandes de una sola vez salvo instrucción explícita.

Después de cada tarea:

1. listar archivos modificados;
2. resumir lo implementado;
3. explicar cómo probarlo;
4. indicar el resultado esperado;
5. sugerir un mensaje de commit.

No ejecutar automáticamente:

- commit;
- push;
- merge;
- Pull Request;

salvo autorización explícita.

## Seguridad

Nunca:

- hardcodear credenciales;
- versionar `.env`;
- imprimir `access_token`;
- imprimir `refresh_token`;
- exponer `SUPABASE_SERVICE_ROLE_KEY`;
- colocar secretos en Client Components;
- usar datos controlados por el cliente como fuente de autorización;
- debilitar seguridad para hacer que una prueba pase.

El desarrollo actual debe utilizar exclusivamente el proyecto Supabase DEV.

No realizar cambios en producción salvo autorización explícita.

## Autenticación SSR

La autenticación utiliza Supabase Auth.

Para SSR utilizar:

```text
@supabase/ssr
```

Arquitectura prevista:

```text
lib/
  supabase/
    client.ts
    server.ts
    proxy.ts

lib/
  auth/
    roles.ts

proxy.ts
```

Esta estructura es una guía.
Antes de crear archivos, comprobar si ya existe una implementación equivalente.

## Next.js 16

Este proyecto utiliza Next.js 16.

Para interceptación de requests y gestión de sesión:

- priorizar `proxy.ts`;
- no introducir `middleware.ts` automáticamente;
- consultar la documentación local del framework si existe duda.

Si una issue utiliza la palabra "middleware", interpretar el requerimiento funcionalmente y aplicar la convención vigente de Next.js 16.

## Issue actual de autenticación

La issue actual cubre principalmente:

- RF-27: autenticación del jurado;
- RF-33: autenticación del administrador;
- RNF-04: protección y privacidad de `/jurado` y `/admin`.

Rutas privadas:

- `/admin`
- `/jurado`

Roles previstos:

- `ADMIN`
- `JURADO`

Fuente de rol para esta issue:

- `app_metadata.role`

Valores válidos:

- `ADMIN`
- `JURADO`

No utilizar `user_metadata.role` como fuente de autorización.

## Reglas de autorización

La política de acceso fue confirmada por el líder del proyecto.

Usuario no autenticado:

- `/admin`  -> redirigir a `/login`
- `/jurado` -> redirigir a `/login`

Usuario con rol `ADMIN`:

- `/admin`  -> permitir
- `/jurado` -> denegar

Usuario con rol `JURADO`:

- `/jurado` -> permitir
- `/admin`  -> denegar

Usuario autenticado sin rol válido:

- `/admin`  -> denegar
- `/jurado` -> denegar

No confiar únicamente en la interfaz visual para proteger rutas.
La autorización real debe validarse del lado servidor o Proxy cuando corresponda.

## Alcance actual

No ampliar esta issue hacia:

- CMS completo;
- registro de participantes;
- entregables;
- rúbricas;
- CRUD completo de jurados;
- asignación de postulantes;
- modelo completo de usuarios;
- migraciones grandes de Prisma;
- cambios de producción.

Actualmente no crear modelos `User`, `Profile` o tablas de roles en Prisma salvo decisión explícita del equipo.

## División actual de trabajo

### John

Responsable de:

- instalar y configurar `@supabase/ssr`;
- cliente Supabase browser;
- cliente Supabase server;
- manejo de cookies;
- actualización de sesión;
- `proxy.ts`;
- roles;
- protección de `/admin`;
- protección de `/jurado`;
- guards server-side;
- contrato/helper de logout;
- pruebas técnicas de autenticación.

Rama:

- `feature/auth-ssr-john`

Orden de trabajo:

- J1 - Preparar dependencias
- J2 - Cliente browser
- J3 - Cliente server
- J4 - Actualización/refresco de sesión SSR
- J5 - Proxy de Next.js
- J6 - Contrato de roles
- J7 - Protección por rol
- J8 - Protección server-side adicional
- J9 - Logout
- J10 - Pruebas técnicas

Trabajar una tarea J a la vez y esperar confirmación antes de continuar a la siguiente.

### Jairo

Responsable principalmente de:

- `/login`;
- formulario;
- loading;
- mensajes de error;
- experiencia visual;
- redirecciones de UI;
- logout UI;
- páginas visuales de `/admin` y `/jurado`;
- robots/noindex;
- QA funcional.

Evitar modificar archivos de Jairo salvo necesidad real de integración.

## Git

Nunca trabajar directamente sobre `main`.

Ramas previstas:

- `feature/auth-ssr-integration`
- `feature/auth-ssr-john`
- `feature/auth-login-jairo`

Mantener commits pequeños y enfocados.

No incluir:

- secretos;
- archivos accidentales;
- cambios ajenos a la tarea.

## Calidad

Antes de considerar una implementación terminada ejecutar cuando corresponda:

```bash
npm run lint
npm run build
```

No afirmar que una tarea está completa si alguno falla.

## Estado actual

Fase 0 completada:

- 0.1 - misma base del repositorio
- 0.2 - baseline local verificado
- 0.3 - variables apuntando a Supabase DEV
- 0.4 - usuarios de prueba creados y confirmados en Supabase DEV
- 0.5 - contrato de roles aprobado: `ADMIN` y `JURADO`

Siguiente paso:

- 0.6 - asignar `app_metadata.role` a los usuarios de prueba en Supabase DEV

Usuarios DEV mínimos:

- `ADMIN`  -> `app_metadata.role = "ADMIN"`
- `JURADO` -> `app_metadata.role = "JURADO"`

No colocar emails, contraseñas, tokens ni IDs reales dentro de este archivo.

## Objetivo final de la issue

La issue estará terminada cuando:

- un usuario anónimo no pueda acceder a `/admin`;
- un usuario anónimo no pueda acceder a `/jurado`;
- un administrador pueda acceder a `/admin`;
- un jurado pueda acceder a `/jurado`;
- un jurado no pueda acceder a `/admin`;
- un usuario sin rol válido no pueda acceder a rutas privadas;
- la sesión persista correctamente;
- la sesión pueda renovarse;
- logout elimine el acceso;
- las rutas privadas no sean indexables;
- no existan secretos expuestos;
- `npm run lint` pase;
- `npm run build` pase.

## Regla final

Priorizar siempre:

1. seguridad;
2. claridad;
3. mínimo alcance necesario;
4. compatibilidad con el stack actual;
5. facilidad de revisión.

No buscar hacer más de lo que exige la issue.
