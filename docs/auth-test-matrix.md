# Matriz de pruebas: Auth SSR (Issue #4)

Cubre RF-27, RF-33, RF-37 y RNF-04. Las pruebas de Auth se hacen **solo contra Supabase DEV**.

## Ejecución local: 27/10/2026 (America/Lima)

Aplicación compilada con `npm run build` y servida con `npm run start -- --hostname 127.0.0.1 --port 3101`.
URL de Supabase local comprobada contra la referencia DEV de #13; `/auth/v1/settings` respondió 200.
No hubo credenciales locales de ADMIN/JURADO disponibles. No se crearon cuentas ni se modificó Supabase.

Métodos: **HTTP** = petición real al servidor; **Edge** = navegador real sin ventana con Playwright;
**unitaria** = lógica aislada, con dobles solo para probar fallos del alta; **código** = inspección, no prueba funcional.
Un ✅ cubre solo el alcance descrito. Las pruebas de sesión real siguen pendientes.
Ver comandos, dependencias y entrega parcial en `docs/auth-delivery.md`.

Revalidación previa al guardado local (28/10/2026): 27 pruebas unitarias, lint, build
y tipos pasaron sobre el código actual. No se repitieron HTTP/navegador ni se añadieron
pruebas exitosas de login, persistencia, renovación, logout real o alta de jurados.

> **Importante:** este repo es público. Aquí nunca van credenciales, ni siquiera las de prueba.
> Las cuentas de prueba se comparten por un canal privado entre John y Jairo.

## Cuentas de prueba necesarias (DEV)

| Cuenta | `app_metadata.role` | Para qué |
|---|---|---|
| Admin de prueba | `ADMIN` | Probar acceso a `/admin` |
| Jurado de prueba | `JURADO` | Probar acceso a `/jurado` |
| Usuario sin rol | (ninguno) | Probar "autenticado pero sin permiso" |

Los roles de Auth se escriben en **mayúsculas**: `POSTULANTE`, `JURADO`, `ADMIN`.
No coinciden con el enum publicado por BD (`APPLICANT`, `JUDGE`, `ADMIN`) en
`c6e51bfc8cf47ec56962701423bbed02acb4be21`. El PR #6 sigue abierto; la correspondencia
y el vínculo mediante `User.id` (UUID de Auth, sin `authUserId` separado) están pendientes
de coordinación e integración. Esta matriz no demuestra compatibilidad con ese esquema.

## Cómo probar
- Para sesiones simultáneas independientes, usar **navegadores distintos o perfiles separados**.
- Dos ventanas de incógnito del mismo navegador pueden compartir cookies; no sirven para aislar dos roles.
- Marcar el resultado: ✅ pasa · ❌ falla · ⏳ pendiente.
- Los casos marcados **(decisión pendiente)** dependen de lo que confirme el líder (sección 16 del plan).

## A. Acceso a rutas

| ID | Estado del usuario | Ruta | Resultado esperado | Resultado |
|---|---|---|---|---|
| A-01 | No autenticado | `/login` | Muestra el formulario | ✅ HTTP 200 + Edge |
| A-02 | No autenticado | `/admin` | Redirige a `/login` | ✅ HTTP 307 + Edge |
| A-03 | No autenticado | `/jurado` | Redirige a `/login` | ✅ HTTP 307 + Edge |
| A-04 | ADMIN | `/admin` | Acceso permitido | ⏳ |
| A-05 | ADMIN | `/jurado` | Propuesta #14: redirige a `/admin`; pendiente hasta 28/10 | ⏳ DEV; unitaria pasa |
| A-06 | JURADO | `/jurado` | Acceso permitido | ⏳ |
| A-07 | JURADO | `/admin` | Propuesta #14: redirige a `/jurado`; pendiente hasta 28/10 | ⏳ DEV; unitaria pasa |
| A-08 | Autenticado sin rol | `/admin` | Denegado (`/login?error=unauthorized`) | ⏳ |
| A-09 | Autenticado sin rol | `/jurado` | Denegado (`/login?error=unauthorized`) | ⏳ |
| A-10 | ADMIN o JURADO | `/login` | Propuesta #14: redirige a su panel; nunca entra en bucle | ⏳ DEV; unitaria pasa |
| A-11 | No autenticado | `/admin/cualquier-cosa` | Redirige a `/login` (las subrutas también están protegidas) | ✅ HTTP: probado con `/admin/nested` |
| A-12 | No autenticado | `/jurado/cualquier-cosa` | Redirige a `/login` | ✅ HTTP: probado con `/jurado/nested` |
| A-13 | No autenticado | `/admin/` (con barra final) | Redirige a `/login`, igual que A-02 | ✅ HTTP: 308 normaliza barra, después 307 a login |
| A-14 | No autenticado | `/jurado/` (con barra final) | Redirige a `/login`, igual que A-03 | ✅ HTTP: 308 normaliza barra, después 307 a login |

## B. Formulario de login

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| B-01 | Login correcto como ADMIN | Entra y va a `/admin` | ⏳ |
| B-02 | Login correcto como JURADO | Entra y va a `/jurado` | ⏳ |
| B-03 | Contraseña incorrecta | Mensaje genérico, sin detalles técnicos | ⏳ |
| B-04 | Email que no existe | **El mismo** mensaje genérico que B-03 (no revela si el email existe) | ⏳ comparación con B-03; Edge sí comprobó mensaje genérico con cuenta inexistente en DEV |
| B-05 | Campos vacíos | Validación local: email y contraseña requeridos | ✅ Edge + unitaria |
| B-06 | Email con formato inválido | Validación local, sin llamar al servidor | ✅ Edge + unitaria; ausencia de llamada revisada en código |
| B-07 | Mientras se envía | Estado "cargando" y botón deshabilitado (evita doble envío) | ✅ Edge: petición real retrasada 700 ms, campos y botón deshabilitados |
| B-08 | Sin conexión (simular offline) | Mensaje amigable de error de red | ✅ Edge offline; botón vuelve a permitir reintentar |
| B-09 | Consola del navegador (F12) | No se imprime ningún token ni sesión | ⏳ sesión real; Edge no observó referencias sensibles en los flujos anónimos/de error probados |
| B-10 | Login con usuario sin rol | Se bloquea con el mensaje de "no autorizado" | ⏳ |

## C. Sesión y logout

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| C-01 | Refrescar (F5) dentro de una ruta autorizada | La sesión persiste | ⏳ |
| C-02 | Cerrar sesión | Vuelve a `/login` | ⏳ |
| C-03 | Tras cerrar sesión: botón Atrás + refrescar | La ruta sigue protegida | ⏳ |
| C-04 | Sesión expirada | Se renueva si procede; si no, va a `/login` | ⏳ |
| C-05 | Quitar o cambiar el rol en DEV y renovar el token | El permiso se actualiza tras el refresh | ⏳ |

## D. Privacidad (noindex)

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| D-01 | `/admin`: ver el HTML o los headers | Tiene `noindex` (meta robots o `X-Robots-Tag`) | ✅ HTTP: `X-Robots-Tag: noindex, nofollow` en redirección; HTML autenticado pendiente |
| D-02 | `/jurado`: ver el HTML o los headers | Tiene `noindex` | ✅ HTTP: mismo header, también en subrutas; HTML autenticado pendiente |
| D-03 | `/robots.txt` (si existe) | No filtra rutas sensibles sin necesidad | ⏳ |

> `noindex` solo le pide a los buscadores que no listen la página. **No es seguridad**.
> La protección real es la de la sección A.

## E. Seguridad

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| E-01 | Revisar el código y el bundle del cliente | No hay `service_role` ni claves secret | ✅ revisión y escaneo de `.next/static`: sin valores privados locales ni referencia a la variable privilegiada. Clave service role ausente, no se pudo contrastar su valor |
| E-02 | Variables `NEXT_PUBLIC_*` | Solo la URL y la clave pública publishable o anon | ✅ comprobación local sin valores: solo URL y ANON_KEY; formato de clave pública confirmado |
| E-03 | `git status` antes de cada commit | `.env` no aparece (no se sube) | ✅ Git: solo `.env.example` versionado; `.env`, `.env.local` y `.env.development` ignorados. Sin commit realizado |
| E-04 | Un usuario intenta cambiarse el rol desde su `user_metadata` | El acceso no cambia (la autorización usa `app_metadata`) | ⏳ |
| E-05 | Rol con valor inesperado (por ejemplo `admin` en minúsculas) | Se trata como "sin rol" | ⏳ |

## F. Calidad y accesibilidad

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| F-01 | `/login` en móvil (ancho ~375 px) | Se ve y funciona bien | ⏳ login exitoso; Edge 375×812 sin desbordamiento y captura revisada |
| F-02 | `/login` en escritorio | Se ve y funciona bien | ⏳ login exitoso; Edge 1280×800, validación y errores comprobados |
| F-03 | Navegar solo con teclado (Tab y Enter) | Se puede completar el login | ⏳ login exitoso; Edge sí probó Tab/Enter, envío y foco de error |
| F-04 | Campos del formulario | Tienen etiqueta (label) y foco visible | ⏳ revisión visual del foco; Edge comprobó etiquetas y elemento enfocado |
| F-05 | Errores de login | Se anuncian con `aria-live` | ⏳ lector de pantalla; atributo comprobado en Edge |
| F-06 | `npm run lint` y `npm run build` | Sin errores | ✅ comandos ejecutados; build incluye comprobación TypeScript |

## G. Alta de jurados y verificaciones adicionales

| Caso | Método y resultado al 27/10/2026 |
|---|---|
| Cookie de ADMIN falsificada con firma JWT inválida | ✅ HTTP: acceso a `/admin` redirigido a login |
| Roles cruzados, ausente, desconocido, POSTULANTE | ✅ unitarias; ⏳ sesiones reales DEV |
| Alta sin ADMIN | Guard `requireRole("ADMIN")` revisado en código; ⏳ prueba de Server Action con sesión real |
| Alta válida, duplicado, fallo al vincular, fallo al asignar rol, fallo al compensar | ✅ unitarias con dobles de prueba; ⏳ integración DEV |
| Alta vinculada a Prisma | ⏳ schema local sin `User`; acordar/integrar contrato BD, vínculo vía `User.id` propuesto y correspondencia de roles; no se exige columna `authUserId` |
| Clave privilegiada para alta | ⏳ no configurada; no se intentó crear ninguna cuenta |
| Renovación, persistencia, logout real | ⏳ faltan cuentas DEV disponibles de forma segura |
| Caché de paneles y subrutas | ✅ HTTP: respuestas `private, no-store` |

## Evidencias para el PR final
Capturas o video corto de: login admin → `/admin`, login jurado → `/jurado`, jurado bloqueado en `/admin`,
anónimo bloqueado (incógnito), `noindex` visible y la salida del build.
