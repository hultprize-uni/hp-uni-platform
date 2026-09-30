# Progreso de autenticación SSR — John

Documento de seguimiento incremental para el trabajo de John en la issue de autenticación SSR.

Las reglas permanentes de seguridad, alcance y colaboración se encuentran en `AGENTS.md`. Este archivo registra progreso y puede actualizarse durante la implementación.

## Reglas de seguimiento

- Trabajar una tarea `J` a la vez.
- Solicitar autorización antes de iniciar la siguiente tarea `J`.
- No registrar emails, contraseñas, tokens, claves, UUID de usuarios ni valores de `.env`.
- No modificar el trabajo de Jairo salvo una necesidad de integración acordada.
- No hacer commits, push, merges ni Pull Requests sin autorización explícita.
- Una tarea técnica no se considera terminada si fallan las verificaciones que le correspondan.

## Contrato confirmado

- Entorno actual: proyecto Supabase DEV.
- Fuente de autorización: `app_metadata.role`.
- Roles reconocidos en esta issue: `ADMIN` y `JURADO`.
- `POSTULANTE` y cualquier valor ausente o desconocido no acceden a `/admin` ni `/jurado`.
- La vinculación futura entre `auth.users.id` y el modelo Prisma `User` está fuera del alcance de esta issue.
- La sincronización futura entre el rol de Prisma y `app_metadata.role` está fuera del alcance de esta issue.

## Fase 0 — Alineación

- [x] 0.1 Confirmar la misma base del repositorio.
- [x] 0.2 Verificar el baseline local.
- [x] 0.3 Confirmar que las variables locales apuntan al proyecto Supabase DEV.
- [x] 0.4 Crear y confirmar usuarios de prueba `ADMIN` y `JURADO` en Supabase DEV.
- [x] 0.5 Aprobar el contrato de roles `ADMIN` y `JURADO` con el líder.
- [ ] 0.6 Asignar `app_metadata.role` a los usuarios de prueba en Supabase DEV.
- [ ] 0.7 Acordar con Jairo la interfaz de los helpers de autenticación.
- [ ] 0.8 Registrar la matriz compartida de casos de prueba.

### Próximo paso autorizado

Completar 0.6 exclusivamente en Supabase DEV:

- Usuario administrador: `app_metadata.role = "ADMIN"`.
- Usuario jurado: `app_metadata.role = "JURADO"`.
- Conservar cualquier metadata existente.
- No escribir el rol en `user_metadata`.

## J1 — Preparar dependencias

- [ ] J1.1 Revisar el estado de `package.json` y `package-lock.json`.
- [ ] J1.2 Confirmar que no existe una instalación o arquitectura Supabase equivalente.
- [ ] J1.3 Consultar la documentación local relevante de Next.js 16.
- [ ] J1.4 Instalar `@supabase/ssr` y `@supabase/supabase-js`.
- [ ] J1.5 Revisar el diff de dependencias y descartar cambios accidentales.
- [ ] J1.6 Ejecutar las verificaciones aplicables.
- [ ] J1.7 Documentar archivos modificados, prueba, resultado esperado y commit sugerido.

## J2 — Cliente Supabase para browser

- [ ] J2.1 Confirmar la interfaz que consumirá el login de Jairo.
- [ ] J2.2 Crear `lib/supabase/client.ts` o reutilizar una implementación equivalente.
- [ ] J2.3 Usar únicamente variables públicas permitidas.
- [ ] J2.4 Verificar que ningún secreto llegue al cliente.
- [ ] J2.5 Ejecutar las verificaciones aplicables y documentar el contrato de uso.

## J3 — Cliente Supabase para server

- [ ] J3.1 Revisar la API vigente de cookies en la documentación local de Next.js 16.
- [ ] J3.2 Crear `lib/supabase/server.ts` o reutilizar una implementación equivalente.
- [ ] J3.3 Integrar `createServerClient` con lectura y escritura segura de cookies.
- [ ] J3.4 Considerar los contextos donde Server Components no pueden escribir cookies.
- [ ] J3.5 Ejecutar las verificaciones aplicables y documentar el contrato de uso.

## J4 — Actualización de sesión SSR

- [ ] J4.1 Revisar el patrón vigente de Supabase SSR para actualización de sesión.
- [ ] J4.2 Crear `lib/supabase/proxy.ts` o reutilizar una implementación equivalente.
- [ ] J4.3 Copiar correctamente las cookies entre request y response.
- [ ] J4.4 Validar la identidad mediante una API apropiada de Supabase.
- [ ] J4.5 Evitar usar `getSession()` como decisión de autorización del servidor.
- [ ] J4.6 Verificar renovación, errores seguros y ausencia de logs sensibles.

## J5 — Proxy de Next.js

- [ ] J5.1 Revisar la documentación local de `proxy.ts` y su configuración en Next.js 16.
- [ ] J5.2 Crear el `proxy.ts` raíz.
- [ ] J5.3 Conectar el helper de actualización de sesión.
- [ ] J5.4 Definir un matcher que excluya assets y rutas que no necesitan interceptación.
- [ ] J5.5 Confirmar que `/login` no produzca ciclos de redirección.
- [ ] J5.6 Ejecutar las verificaciones aplicables.

## J6 — Contrato de roles

- [ ] J6.1 Definir el tipo `Role` con `ADMIN | JURADO`.
- [ ] J6.2 Crear `lib/auth/roles.ts` o reutilizar una implementación equivalente.
- [ ] J6.3 Leer el rol exclusivamente desde `app_metadata.role` validado.
- [ ] J6.4 Rechazar valores ausentes, `POSTULANTE` y valores desconocidos.
- [ ] J6.5 Exponer helpers y constantes sin duplicar lógica entre John y Jairo.
- [ ] J6.6 Ejecutar las verificaciones aplicables y documentar el contrato.

## J7 — Protección por rol

- [ ] J7.1 Redirigir usuarios no autenticados de `/admin` y `/jurado` hacia `/login`.
- [ ] J7.2 Permitir `/admin` únicamente a `ADMIN`.
- [ ] J7.3 Permitir `/jurado` únicamente a `JURADO`.
- [ ] J7.4 Denegar el acceso cruzado entre ambos roles.
- [ ] J7.5 Denegar usuarios autenticados sin un rol reconocido.
- [ ] J7.6 Definir con Jairo el contrato de destinos y errores de redirección.
- [ ] J7.7 Verificar URLs directas y ausencia de ciclos.

## J8 — Protección server-side adicional

- [ ] J8.1 Identificar páginas, layouts o acciones privadas que requieran guard adicional.
- [ ] J8.2 Implementar validación server-side sin depender únicamente del Proxy o de la UI.
- [ ] J8.3 Reutilizar el contrato de roles de J6.
- [ ] J8.4 Confirmar que las respuestas no filtren información sensible.
- [ ] J8.5 Ejecutar las verificaciones aplicables.

## J9 — Contrato de logout

- [ ] J9.1 Definir una función o Server Action reutilizable para cerrar sesión.
- [ ] J9.2 Evitar duplicar clientes o lógica en la interfaz de Jairo.
- [ ] J9.3 Eliminar la sesión y redirigir de forma segura a `/login`.
- [ ] J9.4 Verificar que volver atrás y refrescar no recupere acceso privado.
- [ ] J9.5 Documentar para Jairo la interfaz de integración.

## J10 — Pruebas técnicas

- [ ] J10.1 Verificar acceso anónimo a `/admin` y `/jurado`.
- [ ] J10.2 Verificar acceso correcto de `ADMIN` a `/admin`.
- [ ] J10.3 Verificar que `ADMIN` no acceda a `/jurado`.
- [ ] J10.4 Verificar acceso correcto de `JURADO` a `/jurado`.
- [ ] J10.5 Verificar que `JURADO` no acceda a `/admin`.
- [ ] J10.6 Verificar rechazo de usuarios sin rol o con rol desconocido.
- [ ] J10.7 Verificar persistencia y renovación de sesión.
- [ ] J10.8 Verificar sesión expirada y logout.
- [ ] J10.9 Verificar actualización del permiso después de renovar el JWT.
- [ ] J10.10 Ejecutar `npm run lint`.
- [ ] J10.11 Ejecutar `npm run build`.
- [ ] J10.12 Registrar resultados y evidencias sin datos sensibles.

## Historial de decisiones

- El líder confirmó que los valores compartidos de rol serán `ADMIN`, `JURADO` y, fuera del alcance actual, `POSTULANTE`.
- Para esta issue, la autorización usa `app_metadata.role` y reconoce solamente `ADMIN` y `JURADO`.
- Se utilizará `proxy.ts` por la convención vigente de Next.js 16.
- No se copiará ni modificará el schema Prisma desarrollado en otra rama.
