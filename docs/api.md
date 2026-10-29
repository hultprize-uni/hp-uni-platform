# Contratos Auth para otros squads

Actualizado: 28/10/2026. No se agrega una API REST ni el CMS completo.

| Importación | Contrato y uso |
|---|---|
| `@/lib/supabase/client` | `createClient()` browser, solo configuración pública. No usar su identidad como prueba de autorización en servidor. |
| `@/lib/supabase/server` | `await createClient()` por petición con cookies SSR; para Server Components, acciones y handlers. |
| `@/lib/auth/session` | `getSessionUser(): Promise<SessionUser \| null>` devuelve `authUserId`, `email`, `role` validados con Auth. No incluye tokens. |
| `@/lib/auth/session` | `requireRole(role)` devuelve identidad válida o redirige. Invocarlo antes de leer/escribir datos protegidos en CADA Server Action/consulta. Para endpoints JSON, comprobar la identidad y devolver 401/403 en vez de depender del layout. |
| `@/lib/auth/roles` | Roles exactos `ADMIN`, `JURADO`, `POSTULANTE`; valor inesperado → null. `panelForRole` solo devuelve destinos internos conocidos. |
| `@/app/login/actions` | `signIn(email, password)` → `{ path }` o `{ error }`. La contraseña no se guarda en documentos/logs ni se devuelve. |
| `@/app/logout/actions` | `signOut()` cierra la sesión actual y redirige; si falla devuelve `{ error }`. |
| `@/app/admin/jurados/actions` | `createJury(input: unknown)` exige `ADMIN`. Entrada: nombre, correo, contraseña temporal; nunca un rol seleccionable. Crea la cuenta en Supabase Auth, la vincula en la tabla `users` con Prisma y asigna `app_metadata.role = "JURADO"`. |

`SessionUser.authUserId` nombra el UUID de Supabase Auth en nuestro contrato de aplicación y se vincula directamente con `User.id` (`@id @db.Uuid`) en el modelo Prisma `User`.
La Issue #9 deberá resolver el usuario/equipo mediante este vínculo (`User.id = auth.users.id`).
No aceptar `teamId`, `authUserId` o rol enviados por el cliente como permiso.

Contrato implementado con Prisma para `JuryUserStore` (`lib/auth/jury-store.ts`):
- `existsByEmail(email)` consulta unicidad en `prisma.user`.
- `createLinked({ authUserId, email, name, role: "JURADO" })` inserta en `users` asignando `id: authUserId` y `role: "JURADO"`.
- `deleteLinked(authUserId)` es idempotente y restringida al registro `JURADO` de ese UUID en caso de rollback.

Tanto Supabase Auth (`app_metadata.role`) como el esquema Prisma (`enum Role`) están unificados en español y mayúsculas: `POSTULANTE`, `JURADO`, `ADMIN`.

Para el alta (`RF-37`) se utiliza **creación de cuenta con contraseña temporal**:
Supabase Auth crea el usuario sin rol y con email confirmado administrativamente; tras vincular el registro en `public.users` mediante Prisma, se asigna `app_metadata.role = "JURADO"`. La contraseña temporal se entrega al jurado por canal privado, nunca por respuesta del servidor, repositorio o logs.
