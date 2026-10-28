# Autenticación SSR (entrega local parcial de #4)

Actualizado: 27/10/2026. Next.js instalado 16.3.5, React 19.2.8,
TypeScript 5.9.3, Prisma 5.22.0; agregados `@supabase/ssr` 0.12.7 y
`@supabase/supabase-js` 2.118.0. Validación realizada con Node 24.18.0.

## Interceptación en Next.js 16

Se consultaron las guías instaladas en `node_modules/next/dist/docs/`:
`01-app/01-getting-started/16-proxy.md`,
`01-app/03-api-reference/03-file-conventions/proxy.md`,
`01-app/03-api-reference/04-functions/cookies.md` y
`01-app/02-guides/authentication.md`.
La convención es **`proxy.ts` en la raíz**, exportación `proxy` y objeto
`config.matcher`. Reemplaza la convención antigua `middleware.ts` citada por #4.
Proxy utiliza el runtime Node.js predeterminado. El build reconoce `Proxy (Middleware)`.
`cookies()` es asíncrona. Server Components pueden leer cookies, pero la escritura
corresponde al Proxy, Server Actions o Route Handlers.

## Flujo y límites de seguridad

1. `app/login/login-form.tsx` valida y llama a la Server Action `signIn`.
2. La acción vuelve a validar, ejecuta `signInWithPassword`, comprueba `getUser`
   y devuelve un destino interno fijo. No devuelve tokens ni contraseñas.
3. El cliente servidor usa `createServerClient` y cookies SSR. El cliente browser
   compartido está disponible para otros componentes; el login actual usa la acción.
4. `lib/supabase/proxy.ts` ejecuta `getUser`, permite que el SDK renueve la sesión
   y copia las cookies actualizadas al request y response, incluso al redirigir.
   No se usa `getSession()` para autorizar. Se eligió `getUser` para obtener también
   el rol vigente del servidor, a costa de una petición de red por comprobación.
5. Matcher limitado a `/login`, `/admin/:path*` y `/jurado/:path*`.
   Incluye subrutas; excluye por alcance los assets públicos. #9 ampliará el matcher.
6. Cada panel comprueba rol en layout **y página**. Las futuras consultas y acciones
   deben invocar `requireRole` por sí mismas: un layout o botón oculto no autoriza una operación.
7. Fallos de verificación no permiten servir paneles. Un fallo temporal detectado
   en Proxy entrega 503 con mensaje seguro; login permite reintentar.
8. Logout usa `signOut({ scope: "local" })`, invalida caché de navegación y vuelve al login.
   Cierra la sesión actual, no todos los dispositivos. Supabase puede mantener un JWT
   ya emitido hasta su expiración: no se afirma revocación instantánea de todos los tokens.

Todos los responses interceptados usan `private, no-store`; las rutas privadas,
incluidos redirects y subrutas, usan `X-Robots-Tag: noindex, nofollow`.
Los layouts conservan metadata robots para el HTML autenticado. `noindex` no protege datos.

Los roles se obtienen exclusivamente de `user.app_metadata.role` después de `getUser`.
Nunca se usa `user_metadata` para permisos. La política propuesta está en
`docs/adr/0002-auth-access-proposal.md`. No hay caché global de identidades;
React `cache` solo evita comprobaciones duplicadas dentro del render de una petición.

## Alta de jurados: bloqueo explícito

La Server Action `app/admin/jurados/actions.ts:createJury` exige ADMIN antes de
cualquier operación. El proveedor `getJuryUserStore` está deshabilitado: el esquema
local no tiene modelos. La propuesta BD del commit `c6e51bfc8cf47ec56962701423bbed02acb4be21`
usa `User.id` como UUID de Auth, sin campo `authUserId` separado; el PR #6 sigue abierto.
Falta acordar e integrar ese contrato, no necesariamente añadir otra columna.
Auth mantiene `POSTULANTE/JURADO/ADMIN`; BD publica `APPLICANT/JUDGE/ADMIN`.
También está pendiente que BD revise `Role.POSTULANTE` y `uniCode` en su `lib/auth.ts`
frente a `APPLICANT` y `universityCode` en su esquema. No se adapta el código local todavía.
No se inventan tablas, campos, SQL ni conversiones `as any`.

Se prepararon un contrato `JuryUserStore`, la orquestación y el adaptador real de
Supabase Admin (solo servidor). Hasta integrar el adaptador tipado de Prisma,
la acción responde `DEPENDENCY_UNAVAILABLE` sin crear una cuenta Auth.
La UI de gestión de jurados corresponde al squad de #12; deberá importar esta acción.
Una acción aún no importada por una ruta no constituye un endpoint probado del build.

Estrategia prevista y probada solo con dobles: verificar duplicado; crear Auth sin rol;
crear vínculo DB atómico con el rol acordado (JURADO en el contrato Auth provisional);
asignar rol Auth al final. Ante fallo, eliminar
primero la cuenta Auth recién creada y luego su vínculo DB. Si falla la compensación,
se requiere conciliación manual; no hay éxito falso ni reintento automático.
El adaptador intenta además quitar el rol y bloquear la cuenta si falla su eliminación.
Ante timeout durante creación, no se adopta ni elimina una cuenta por coincidencia de correo.
Ver requisitos de conciliación en `docs/auth-delivery.md`.

Fuentes oficiales consultadas:
- [Supabase: clientes SSR y Proxy](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [Supabase: validación con getUser](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Supabase: creación administrativa](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
- [Supabase: invitaciones](https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail)
