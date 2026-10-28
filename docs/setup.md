# Preparación Auth DEV

Actualizado 27/10/2026. Usar Node 24 LTS para repetir las pruebas de TypeScript nativo.
Las versiones verificadas están en `docs/architecture.md`. Ejecutar `npm ci`.

## Variables (sin valores reales)

Mantenerlas en `.env` o `.env.local`, ignorados por Git:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto **hp-uni-dev**.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` **o** `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
  clave pública del mismo proyecto. Se conserva compatibilidad con el nombre antiguo;
  si ambas tienen valor se prioriza publishable.
- `SUPABASE_SERVICE_ROLE_KEY`: solo servidor, para alta de jurados; ausente en la
  revisión local. Obtenerla por canal privado desde las API keys de DEV, nunca pegarla en chat.
- `DATABASE_URL` y `DIRECT_URL`: de DEV, a entregar/validar por BD. Su presencia local
  no prueba el destino ni la conexión; no se conectó Prisma porque el esquema está vacío.

La URL y la clave pública locales sí permitieron consultar Auth DEV (HTTP 200).
No se imprimieron sus valores. La clave privilegiada no debe tener prefijo NEXT_PUBLIC_
ni importarse desde un componente cliente. No copiar credenciales de producción.

## Lo que John o Jairo deben comprobar en el panel DEV

1. Abrir explícitamente **hp-uni-dev**, contrastando su referencia con #13.
2. Authentication → Users: localizar las cuentas de prueba ADMIN y JURADO y confirmar
   que están habilitadas/confirmadas. Compartir sus credenciales solo por el canal privado acordado.
3. Verificar `app_metadata.role` en mayúsculas. El correo no determina el rol.
   Si el panel no permite editarlo, un administrador puede usar la API Admin oficial
   `updateUserById(uuid, { app_metadata: { role: "ADMIN" } })` o JURADO desde un entorno
   exclusivo del servidor. No usar `user_metadata` ni exponer la clave en el navegador.
4. Crear o facilitar cuentas DEV adicionales sin rol, con rol desconocido y POSTULANTE
   para pruebas. No quitar el rol al único ADMIN disponible; conservar una cuenta de recuperación.
5. Authentication → URL Configuration: Site URL local habitual `http://localhost:3000`;
   Redirect URLs para localhost y el preview de dev. Para probar flujos de enlace en
   el puerto 3101, autorizar también ese origen explícitamente. El login por contraseña
   actual no usa invitaciones ni callbacks por correo.
6. Revisar confirmación de correo, límites y configuración SMTP. No declarar verificado
   el envío de invitaciones: no se implementó ese flujo en esta entrega parcial.
7. Revisar protección contra contraseñas filtradas y política mínima. #14 informa que
   estaba desactivada; confirmar disponibilidad en el plan y registrar si no se puede activar.

La configuración de producción de #14 debe revisarla el responsable autorizado por
separado. Esta entrega no entra al panel, no modifica producción y no marca ese criterio como resuelto.

## Pruebas locales

```bash
npm run test:auth
npm run lint
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 3101
```

En otra terminal: `npm run test:auth:http`.
El test de navegador usa Playwright y Edge instalados. En esta ejecución Playwright se
instaló en una carpeta temporal, fuera de las dependencias de la aplicación.
Si no está instalado, prepararlo en una carpeta de herramientas con
`npm install --prefix <carpeta-temporal> --no-save playwright`; en PowerShell establecer
`$env:AUTH_PLAYWRIGHT_MODULE` a `<carpeta-temporal>\node_modules\playwright` y ejecutar
`npm run test:auth:browser`. No hace falta descargar Chromium si Edge está disponible.
Capturas locales en `.auth-artifacts/` (ignoradas por Git).

El test de navegador envía un intento con correo ficticio inexistente a Auth DEV;
no crea una cuenta. No ejecutarlo contra un servidor de producción.
Para cambiar el puerto, establecer `AUTH_TEST_BASE_URL` a otro origen localhost.

Las pruebas completas con cuentas reales se describen en la matriz. Para ADMIN y JURADO
simultáneos, usar perfiles separados o navegadores distintos: ventanas incógnitas del
mismo navegador pueden compartir sesión. No guardar credenciales en scripts versionados.
