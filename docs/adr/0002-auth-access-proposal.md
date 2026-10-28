# Acceso por roles y login único

Fecha: 27/10/2026 (America/Lima). Estado: **propuesta implementada para revisión**, no aprobada todavía.

Fuente: [issue #14](https://github.com/hultprize-uni/hp-uni-platform/issues/14).
Al consultarla no tenía comentarios. La aprobación tácita prevista es el miércoles 28/10
si no hay objeciones; al 27/10 ese plazo no venció.

Se usa un solo `/login`. ADMIN solo entra en `/admin`; JURADO solo en `/jurado`.
ADMIN en `/jurado` vuelve a `/admin`; JURADO en `/admin` vuelve a `/jurado`.
Ambos, al visitar `/login`, van a su panel. Sin sesión se vuelve a `/login`.
Rol ausente/desconocido se deniega con `/login?error=unauthorized`, sin autorredirigir
el login. Se leen roles en mayúsculas desde `app_metadata` de un usuario validado.

POSTULANTE es conocido, pero no tiene permiso en estos paneles. Su login exitoso
regresa provisionalmente a `/`; visitar `/login` no lo redirige automáticamente.
El destino definitivo y `/entregables` corresponden a #9: no se implementan aquí
ni se deduce un equipo desde datos enviados por el navegador.

Si cambia la propuesta, actualizar `lib/auth/roles.ts`, los tests y la matriz.
La integración final será mediante PR hacia `dev`; este trabajo no crea ese PR.
