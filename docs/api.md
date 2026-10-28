# Contratos Auth para otros squads

Entrega local parcial, 27/10/2026. No se agrega una API REST ni el CMS completo.

| Importación | Contrato y uso |
|---|---|
| `@/lib/supabase/client` | `createClient()` browser, solo configuración pública. No usar su identidad como prueba de autorización en servidor. |
| `@/lib/supabase/server` | `await createClient()` por petición con cookies SSR; para Server Components, acciones y handlers. |
| `@/lib/auth/session` | `getSessionUser(): Promise<SessionUser \| null>` devuelve `authUserId`, `email`, `role` validados con Auth. No incluye tokens. |
| `@/lib/auth/session` | `requireRole(role)` devuelve identidad válida o redirige. Invocarlo antes de leer/escribir datos protegidos en CADA Server Action/consulta. Para endpoints JSON, comprobar la identidad y devolver 401/403 en vez de depender del layout. |
| `@/lib/auth/roles` | Roles exactos `ADMIN`, `JURADO`, `POSTULANTE`; valor inesperado → null. `panelForRole` solo devuelve destinos internos conocidos. |
| `@/app/login/actions` | `signIn(email, password)` → `{ path }` o `{ error }`. La contraseña no se guarda en documentos/logs ni se devuelve. |
| `@/app/logout/actions` | `signOut()` cierra la sesión actual y redirige; si falla devuelve `{ error }`. |
| `@/app/admin/jurados/actions` | `createJury(input: unknown)` exige ADMIN. Entrada: nombre, correo, contraseña temporal; nunca un rol seleccionable. Actualmente devuelve bloqueo de BD sin crear cuentas. |

`SessionUser.authUserId` nombra el UUID de Supabase Auth en nuestro contrato de aplicación;
no exige una columna Prisma con ese nombre. La propuesta BD de `c6e51bfc8cf47ec56962701423bbed02acb4be21`
usa ese UUID directamente en `User.id`. El PR #6 sigue abierto, sin contrato integrado en dev/main.
#9 deberá resolver el usuario/equipo mediante el vínculo definitivo acordado con BD.
No aceptar `teamId`, `authUserId` o rol enviados por el cliente como permiso.

Contrato pendiente con BD para `JuryUserStore`:
- `existsByEmail(email)` con normalización acordada y unicidad en DB.
- `createLinked({ authUserId, email, name, role: "JURADO" })`, operación atómica y
  con unicidad de correo e identidad Auth; el adaptador podría escribir el UUID en `User.id`,
  sin requerir una columna `authUserId` ni asociar jurados a un equipo.
- `deleteLinked(authUserId)`, idempotente y restringida al nuevo registro JURADO de ese UUID.

Auth conserva `POSTULANTE`, `JURADO`, `ADMIN`; el esquema BD publicado usa `APPLICANT`,
`JUDGE`, `ADMIN`. La correspondencia debe acordarse antes de implementar el adaptador;
`role: "JURADO"` en esta interfaz no describe directamente el enum Prisma publicado.
BD debe revisar además su `lib/auth.ts`: usa `Role.POSTULANTE` y `uniCode`, mientras
su esquema usa `APPLICANT` y `universityCode`. No se modifica esa rama desde Auth.

Para el alta se eligió **crear cuenta con contraseña temporal**, no invitación por email.
Supabase se crea sin rol y se confirma el email administrativamente; solo tras vincular DB
se asigna `app_metadata.role = JURADO`. La contraseña se entrega al jurado por canal privado,
nunca por respuesta del servidor, repositorio o logs. Esta operación sigue deshabilitada
hasta coordinar el esquema y verificarla en DEV. No se ha comprobado SMTP ni envío de invitaciones.
