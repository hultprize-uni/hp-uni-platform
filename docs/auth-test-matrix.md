# Matriz de pruebas: Auth SSR (Issue #4)

Cubre RF-27, RF-33 y RNF-04. Todas las pruebas se hacen **solo contra Supabase DEV**.

> **Importante:** este repo es público. Aquí nunca van credenciales, ni siquiera las de prueba.
> Las cuentas de prueba se comparten por un canal privado entre John y Jairo.

## Cuentas de prueba necesarias (DEV)

| Cuenta | `app_metadata.role` | Para qué |
|---|---|---|
| Admin de prueba | `ADMIN` | Probar acceso a `/admin` |
| Jurado de prueba | `JURADO` | Probar acceso a `/jurado` |
| Usuario sin rol | (ninguno) | Probar "autenticado pero sin permiso" |

Los roles se escriben en **mayúsculas**, igual que el enum `Role` de la base de datos.

## Cómo probar
- Usar una ventana de **incógnito** por cada sesión, para que no se mezclen cookies.
- Para probar dos roles a la vez, usar dos ventanas de incógnito o dos navegadores distintos.
- Marcar el resultado: ✅ pasa · ❌ falla · ⏳ pendiente.
- Los casos marcados **(decisión pendiente)** dependen de lo que confirme el líder (sección 16 del plan).

## A. Acceso a rutas

| ID | Estado del usuario | Ruta | Resultado esperado | Resultado |
|---|---|---|---|---|
| A-01 | No autenticado | `/login` | Muestra el formulario | ⏳ |
| A-02 | No autenticado | `/admin` | Redirige a `/login` | ⏳ |
| A-03 | No autenticado | `/jurado` | Redirige a `/login` | ⏳ |
| A-04 | ADMIN | `/admin` | Acceso permitido | ⏳ |
| A-05 | ADMIN | `/jurado` | Denegado o redirigido a `/admin` (decisión pendiente) | ⏳ |
| A-06 | JURADO | `/jurado` | Acceso permitido | ⏳ |
| A-07 | JURADO | `/admin` | Denegado o redirigido a `/jurado` (decisión pendiente) | ⏳ |
| A-08 | Autenticado sin rol | `/admin` | Denegado (`/login?error=unauthorized`) | ⏳ |
| A-09 | Autenticado sin rol | `/jurado` | Denegado (`/login?error=unauthorized`) | ⏳ |
| A-10 | ADMIN o JURADO | `/login` | Opcional: redirige a su panel; nunca entra en bucle | ⏳ |
| A-11 | No autenticado | `/admin/cualquier-cosa` | Redirige a `/login` (las subrutas también están protegidas) | ⏳ |
| A-12 | No autenticado | `/jurado/cualquier-cosa` | Redirige a `/login` | ⏳ |
| A-13 | No autenticado | `/admin/` (con barra final) | Redirige a `/login`, igual que A-02 | ⏳ |
| A-14 | No autenticado | `/jurado/` (con barra final) | Redirige a `/login`, igual que A-03 | ⏳ |

## B. Formulario de login

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| B-01 | Login correcto como ADMIN | Entra y va a `/admin` | ⏳ |
| B-02 | Login correcto como JURADO | Entra y va a `/jurado` | ⏳ |
| B-03 | Contraseña incorrecta | Mensaje genérico, sin detalles técnicos | ⏳ |
| B-04 | Email que no existe | **El mismo** mensaje genérico que B-03 (no revela si el email existe) | ⏳ |
| B-05 | Campos vacíos | Validación local: email y contraseña requeridos | ⏳ |
| B-06 | Email con formato inválido | Validación local, sin llamar al servidor | ⏳ |
| B-07 | Mientras se envía | Estado "cargando" y botón deshabilitado (evita doble envío) | ⏳ |
| B-08 | Sin conexión (simular offline) | Mensaje amigable de error de red | ⏳ |
| B-09 | Consola del navegador (F12) | No se imprime ningún token ni sesión | ⏳ |
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
| D-01 | `/admin`: ver el HTML o los headers | Tiene `noindex` (meta robots o `X-Robots-Tag`) | ⏳ |
| D-02 | `/jurado`: ver el HTML o los headers | Tiene `noindex` | ⏳ |
| D-03 | `/robots.txt` (si existe) | No filtra rutas sensibles sin necesidad | ⏳ |

> `noindex` solo le pide a los buscadores que no listen la página. **No es seguridad**.
> La protección real es la de la sección A.

## E. Seguridad

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| E-01 | Revisar el código y el bundle del cliente | No hay `service_role` ni claves secret | ⏳ |
| E-02 | Variables `NEXT_PUBLIC_*` | Solo la URL y la clave publishable | ⏳ |
| E-03 | `git status` antes de cada commit | `.env` no aparece (no se sube) | ⏳ |
| E-04 | Un usuario intenta cambiarse el rol desde su `user_metadata` | El acceso no cambia (la autorización usa `app_metadata`) | ⏳ |
| E-05 | Rol con valor inesperado (por ejemplo `admin` en minúsculas) | Se trata como "sin rol" | ⏳ |

## F. Calidad y accesibilidad

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| F-01 | `/login` en móvil (ancho ~375 px) | Se ve y funciona bien | ⏳ |
| F-02 | `/login` en escritorio | Se ve y funciona bien | ⏳ |
| F-03 | Navegar solo con teclado (Tab y Enter) | Se puede completar el login | ⏳ |
| F-04 | Campos del formulario | Tienen etiqueta (label) y foco visible | ⏳ |
| F-05 | Errores de login | Se anuncian con `aria-live` | ⏳ |
| F-06 | `npm run lint` y `npm run build` | Sin errores | ⏳ |

## Evidencias para el PR final
Capturas o video corto de: login admin → `/admin`, login jurado → `/jurado`, jurado bloqueado en `/admin`,
anónimo bloqueado (incógnito), `noindex` visible y la salida del build.
