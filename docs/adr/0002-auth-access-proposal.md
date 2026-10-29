# Acceso por roles y login único

Fecha: 28/10/2026 (America/Lima). Estado: **Aprobado por el equipo (John y Jairo)**.

Fuente: [issue #14](https://github.com/hultprize-uni/hp-uni-platform/issues/14) e Issue #4.

Se usa un solo formulario en `/login`.
- `ADMIN` solo entra en `/admin`; `JURADO` solo en `/jurado`.
- `ADMIN` en `/jurado` es redirigido a `/admin`; `JURADO` en `/admin` es redirigido a `/jurado`.
- Ambos, al visitar `/login` con sesión activa, van a su panel correspondiente.
- Sin sesión se redirige a `/login`.
- Rol ausente/desconocido se deniega con `/login?error=unauthorized`, sin autorredirigir el login.
- Se leen roles en mayúsculas y en español (`ADMIN`, `JURADO`, `POSTULANTE`) desde `app_metadata.role` de un usuario validado en el servidor (`getUser()`).

`POSTULANTE` es un rol conocido y unificado también con el esquema Prisma (`enum Role { POSTULANTE, JURADO, ADMIN }`), pero no tiene permiso en `/admin` ni `/jurado`. Su login exitoso regresa provisionalmente a `/`; visitar `/login` no lo redirige automáticamente. El destino definitivo y `/entregables` corresponden a la Issue #9.

Flujo de integración acordado: ramas personales (`feature/auth-ssr-john` y `feature/auth-login-jairo`) → `feature/auth-ssr-integration` → `dev`.
