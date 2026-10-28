# Entrega Auth local: revisión pendiente

Evidencias iniciales: 27/10/2026; revisión de contratos y guardado local: 28/10/2026, America/Lima.
Rama conservada: `feature/auth-login-jairo`. **#4 no está terminada.**
La implementación inicial no hizo commits. El 28/10 se autorizó guardarla mediante commits locales;
no se hizo push, PR, merge, rebase ni cambio de rama, ni se incorporó la rama de BD.
Se conservaron y ampliaron los cuatro archivos locales de paneles que estaban sin seguimiento.

## Fuentes y estado de coordinación

Se leyeron AGENTS.md, CLAUDE.md, estructura de rutas/componentes, configuración,
Prisma, README y documentación existente; no se volcaron secretos ni archivos generados.
`docs/architecture.md`, `api.md` y `setup.md` estaban vacíos y ahora documentan Auth.
Se consultaron en GitHub las issues [#4](https://github.com/hultprize-uni/hp-uni-platform/issues/4),
[#9](https://github.com/hultprize-uni/hp-uni-platform/issues/9),
[#10](https://github.com/hultprize-uni/hp-uni-platform/issues/10),
[#13](https://github.com/hultprize-uni/hp-uni-platform/issues/13) y
[#14](https://github.com/hultprize-uni/hp-uni-platform/issues/14), todas sin comentarios al consultarlas.
Se ejecutó `git fetch origin` sin cambiar el remoto, que conserva la URL antigua del
repositorio. GitHub permite consultar las issues bajo el nombre actual `hp-uni-platform`.

La rama remota `feature/auth-ssr-integration` sigue en `acd4070`, sin infraestructura Auth.
No se encontró una rama remota personal de John con implementación reutilizable.
Esto **no prueba** que John no tenga trabajo local. Pedirle antes de integrar:
`lib/supabase/{client,server,proxy}.ts`, `proxy.ts`, helpers de roles/sesión/logout,
y la forma de sus retornos para evitar implementaciones paralelas incompatibles.
No se fusionó ninguna rama ajena.

Se leyó `PLAN_AUTH_HP_UNI.pdf` completo como documento histórico. Sus roles en minúsculas,
PR hacia main/integration y exclusión del alta de jurados quedaron superados por
las issues actuales: roles en mayúsculas, PR hacia dev y alta incluida en #4.
Las tareas de entregables/equipo (#9), modelo de negocio y migraciones (#10/#13),
CMS y evaluación (#11/#12) no se implementaron.

## Archivos y propósito

| Archivos | Propósito |
|---|---|
| `lib/supabase/config.ts`, `client.ts`, `server.ts`, `proxy.ts`; `proxy.ts` raíz | Clientes compartidos, cookies SSR, validación/renovación e interceptación de rutas |
| `lib/auth/roles.ts`, `session.ts`, `validation.ts` | Roles exactos, identidad validada, guard de servidor, validación y errores seguros |
| `app/login/actions.ts`, `page.tsx`, `login-form.tsx` | Login por contraseña con acción de servidor, mensajes, navegación y protección contra doble envío |
| `app/logout/actions.ts`, `components/auth/logout-button.tsx` | Logout de sesión actual y botón reutilizable |
| `app/admin/{layout,page}.tsx`, `app/jurado/{layout,page}.tsx` | Paneles mínimos conservados, comprobación de rol y logout; metadata noindex |
| `app/admin/jurados/actions.ts`, `lib/auth/jury-registration.ts`, `jury-store.ts`, `lib/supabase/admin.ts` | Alta ADMIN, contrato BD, manejo de fallos y adaptador Admin; deshabilitada por dependencia real de BD |
| `app/layout.tsx` | Idioma español para tecnologías de asistencia |
| `package.json`, `package-lock.json`, `tsconfig.json` | Dependencias SSR, scripts de verificación y soporte de imports TS para tests nativos de Node |
| `.gitignore`, `.env.example` | Protección de variantes de entorno y declaración de clave exclusiva del servidor |
| `tests/auth.test.mjs`, `auth-http.mjs`, `auth-browser.mjs` | Pruebas unitarias, HTTP y navegador; sin credenciales versionadas |
| `docs/architecture.md`, `api.md`, `setup.md`, `auth-test-matrix.md`, ADR 0002 y este documento | Contratos, resultados reales, decisiones pendientes y entrega |

## Estado A1–A10 y J1–J10

Implementado no significa aprobado con sesiones reales. No se marcaron pruebas como
superadas por leer código. IDs tomados del PDF histórico, con alcance actual de las issues.

| ID | Estado y evidencia | Pendiente |
|---|---|---|
| A1 login | Implementado; HTTP 200, capturas Edge desktop/móvil revisadas | Login exitoso con cuenta real |
| A2 formulario separado | Implementado; interacción Edge | — |
| A3 validación local | Edge y unitarias pasan | — |
| A4 conectar signIn | Acción real llama a Supabase; intento de cuenta inexistente devuelve error seguro | ADMIN/JURADO exitosos |
| A5 redirección | Política unitaria pasa; destinos internos fijos | Sesiones reales y confirmar propuesta #14 |
| A6 errores | Edge comprueba red offline y cuenta inexistente; unitarias comparan error genérico | Contraseña incorrecta de cuenta existente, sesión caducada, sin rol real |
| A7 paneles | Implementados y protegidos; HTTP anónimo bloqueado | Acceso permitido por rol real |
| A8 logout UI | Botón y acción implementados, compilados | Cerrar sesión real y Atrás/refrescar |
| A9 noindex | HTTP confirma header en paneles/subrutas; metadata conservada | HTML final autenticado |
| A10 pruebas funcionales | Parcial: navegador/HTTP y matriz actualizada | Completar flujos con cuentas reales |
| J1 dependencias | SSR 0.12.7 y supabase-js 2.118.0 instalados; lock actualizado | Integración a dev vía PR aprobado |
| J2 cliente browser | Implementado, compila y solo usa configuración pública | Uso interactivo con sesión si otro squad lo requiere |
| J3 cliente servidor | Implementado; acción real alcanza Auth DEV | Login válido y cookies de sesión |
| J4 refresh SSR | Patrón request/response implementado y compila | Token vencido/renovación reales |
| J5 Proxy raíz | Build reconoce Proxy; HTTP demuestra ejecución para subrutas | — |
| J6 roles | ADMIN/JURADO/POSTULANTE y rechazo exacto probados en unitarias | app_metadata de cuentas reales |
| J7 guard rutas | Anónimo y cookie falsificada bloqueados por HTTP | Roles cruzados reales |
| J8 guard servidor | Layouts/páginas y acción de jurados llaman requireRole | Verificación integrada de acciones con roles reales |
| J9 logout contrato | Acción compartida y botón disponibles | Sesión real; expiración y revocación |
| J10 pruebas técnicas | 27 unitarias pasan; HTTP y navegador pasan | Persistencia, refresh, roles reales, logout |

## Criterios actuales de #4

| Criterio | Cobertura |
|---|---|
| Clientes SSR/cookies | Implementado; renovación real pendiente de cuentas |
| Vistas conectadas | Login único y paneles mínimos; falta login exitoso real. Portal POSTULANTE pertenece a #9 |
| Interceptación | `proxy.ts` por convención instalada; anónimos y JWT falso bloqueados |
| Roles y noindex | Código y unitarias; header real confirmado. Roles reales pendientes |
| Alta de jurados | **Bloqueada parcialmente**: acción ADMIN y servicio preparados; proveedor DB deshabilitado y sin clave privilegiada. No satisface aún el criterio de creación vinculada real |

## Preparación de #14

- Dependencias instaladas localmente; no integradas en dev.
- Convención Proxy confirmada con documentación instalada y build.
- ADR y matriz registran la propuesta de redirecciones, pendiente al 27/10.
- No se publicó PR ni se eliminó/reutilizó una rama remota.
- No se comprobaron ni cambiaron seguridad de contraseñas, SMTP o URLs en los paneles DEV/PROD.
- `.env.example` declara `SUPABASE_SERVICE_ROLE_KEY` solo servidor.

## Evidencias y límites

Revalidación del 28/10 antes de los commits: `npm run test:auth` (27/27), `npm run lint`,
`npm run build` y `npm run typecheck` pasaron sobre el código guardado.
No se repitieron HTTP/navegador: sus evidencias siguientes corresponden al 27/10.
Login exitoso, persistencia, renovación, logout real y alta de jurados siguen pendientes.

- `npm run test:auth`: **27/27**. Incluye roles ausentes/desconocidos, POSTULANTE,
  límites de rutas, redirecciones y compensación de altas con adaptadores de prueba.
  No es prueba de Supabase/Prisma reales.
- `npm run lint`, `npm run build` y `npm run typecheck`: comprobaciones ejecutadas;
  ver matriz para el estado final. El build reconoce paneles/login dinámicos y Proxy.
- `npm run test:auth:http`: redirects anónimos en paneles/subrutas/barra final,
  noindex, no-store, formulario HTML y cookie de ADMIN con firma falsa denegada.
- `npm run test:auth:browser`: Edge real sin ventana; campos vacíos, correo inválido,
  foco, Tab/Enter, botón/campos deshabilitados, mensaje genérico para cuenta ficticia
  inexistente, error offline, reintento habilitado y redirects anónimos.
- Capturas `.auth-artifacts/login-desktop.png` (1280×800) y `login-mobile.png` (375×812),
  inspeccionadas visualmente; sin desbordamiento horizontal. No se probó lector de pantalla.
- Escaneo de `.next/static`: sin valores privados de servidor disponibles en el entorno
  ni referencia al nombre `SUPABASE_SERVICE_ROLE_KEY`. Esa clave estaba ausente;
  no se pudo contrastar su valor real. No equivale a una auditoría completa.
- Git solo versiona `.env.example`; variantes locales ignoradas. Sin secretos mostrados.
  Solo hay variables públicas de URL y ANON_KEY, y su formato público fue comprobado sin imprimir la clave.
- `npm audit` tras instalar dependencias reportó **14 alertas: 4 moderadas, 8 altas y
  2 críticas**. Incluye Next 16.3.5 (audit propone 16.4.3) y proxy-addr transitivo.
  No se ejecutó `npm audit fix --force` ni se cambió el framework en esta entrega.
  Revisar y resolver dependencias afectadas con pruebas antes de publicar.
- Node muestra una advertencia informativa de detección ESM en los tests TS;
  no falla ninguna prueba ni se desactivó ninguna comprobación.

## Dependencias concretas y pasos para terminar

**John / acceso DEV**

1. Confirmar si tiene clientes/guards locales sin publicar y comparar contratos con esta entrega.
2. Facilitar cuentas DEV ADMIN/JURADO por el canal privado, verificar `app_metadata.role`
   exacto y cuentas confirmadas. No pegar contraseñas en chat.
3. Facilitar clave de servidor DEV cuando se pueda habilitar el alta. Ver pasos del panel en setup.
4. Revisar URL Configuration, contraseñas filtradas, confirmación y SMTP; producción queda fuera de esta ejecución.

**Squad BD (#10/#13)**

1. Acordar e integrar el esquema/migraciones reales. La propuesta BD del commit
   `c6e51bfc8cf47ec56962701423bbed02acb4be21` usa `User.id` como UUID de Supabase Auth,
   sin columna `authUserId` separada; el PR #6 sigue abierto y no está integrado en dev/main.
   El schema local sigue sin modelos. Nuestro nombre de parámetro `authUserId` no obliga
   a crear una columna homónima. Acordar campos obligatorios y normalización de email.
   Auth conserva `POSTULANTE/JURADO/ADMIN`; BD publica `APPLICANT/JUDGE/ADMIN`.
   BD debe revisar además `Role.POSTULANTE` y `uniCode` en su `lib/auth.ts`, frente a
   `APPLICANT` y `universityCode` del esquema; no corregimos código ajeno ni cambiamos roles.
2. Confirmar tablas/migraciones de DEV y conexiones DATABASE_URL/DIRECT_URL de DEV.
3. Implementar/revisar adaptador Prisma tipado para `JuryUserStore`; no usar SQL improvisado
   ni `as any`. No mezclar migraciones de negocio de otro squad en esta rama.
4. Tras eso, reemplazar el proveedor deshabilitado, generar cliente Prisma, verificar tipos
   y probar alta real, duplicados, concurrencia y compensación en DEV.

**Conciliación de fallos parciales (antes de habilitar el alta)**

La acción solo crea; nunca convierte una cuenta existente en jurado. Ante
`RECONCILIATION_REQUIRED`, detener reintentos. BD/Auth deben inspeccionar en DEV
el correo solicitado y el UUID nuevo, comprobar Auth y users, retirar el rol/bloquear
si el vínculo no es válido y decidir si eliminar registros nuevos o completar el vínculo.
No borrar una cuenta preexistente por coincidir el correo. Si Auth se eliminó y quedó
el registro DB, retirar únicamente el vínculo nuevo después de verificar su UUID.
Cuando se conoce el UUID recién creado, el resultado de conciliación lo devuelve al
ADMIN autorizado para facilitar esa revisión. Si el timeout no permitió conocerlo,
el administrador ya dispone del correo solicitado para buscarlo de forma privada.
No se registran contraseñas, tokens o claves en logs ni se agrega un esquema de auditoría ajeno.
El proveedor sigue deshabilitado por la falta del contrato Prisma real y su adaptador.

**QA final**

Con perfiles independientes: login ADMIN/JURADO, accesos cruzados/subrutas, refrescar,
expiración/renovación, logout y Atrás/refresco. Con cuentas adicionales: sin rol,
rol inesperado y POSTULANTE. Revisar HTML noindex autenticado y acciones ADMIN
con usuarios anónimos/JURADO. No alterar el único administrador de recuperación.
Completar matriz y evidencias; confirmar propuesta #14 y revisar vulnerabilidades.
Sin estos pasos, no cerrar #4 ni declarar preparación de producción.

## División inicial propuesta de commits (no ejecutada con esta separación)

1. `chore(auth): add supabase dependencies and protect env variants`
2. `feat(auth): add SSR clients session validation and role guards`
3. `feat(auth): connect login logout and private test panels`
4. `feat(auth): prepare guarded jury provisioning contract` (explicar bloqueo DB)
5. `test(auth): add authorization HTTP and browser checks`
6. `docs(auth): record access proposal evidence and pending dependencies`

## Texto propuesto de PR hacia dev (no publicado)

Título: `feat(auth): login SSR, paneles por rol y preparación parcial del alta de jurados`

El login provisional ahora llama a Supabase desde una Server Action. Los paneles
`/admin` y `/jurado`, incluidas subrutas, comprueban identidad y rol; el acceso anónimo
redirige al login. Se agregan clientes SSR, logout visible y respuestas privadas con noindex.

Refs #4 y #14. **Entrega parcial, no cierra #4.** Política de redirecciones propuesta
pendiente según #14. No incluye entregables/equipo ni CMS.

Validación: 27 pruebas unitarias; lint/build/tipos; HTTP anónimo y JWT falso; Edge para
validación, red offline, cuenta inexistente y vistas 375/1280 px. Auth DEV alcanzable.
Sin credenciales de cuentas reales: login exitoso, refresh, persistencia y logout pendientes.

Alta de jurados: acción solo ADMIN y orquestación preparadas; creación deshabilitada
hasta acordar e integrar el vínculo de identidad (#10, propuesta mediante User.id),
la correspondencia de roles, adaptador Prisma tipado, clave de servidor DEV
y validación de compensación real. No se crearon cuentas ni se modificó producción.
Pendiente resolver alertas de dependencias del audit antes de publicar.

Revisión solicitada: John (clientes/cookies/roles), BD (contrato/vínculo/compensación)
y squad UI #12 (consumo de createJury). Ver matriz y `docs/auth-delivery.md`.
