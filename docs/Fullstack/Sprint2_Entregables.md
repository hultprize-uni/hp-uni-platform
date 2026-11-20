# Workflow Squad 4 — Fullstack
## Sprint 2: Carga y gestión de entregables (Issue `#8`)

**Integrantes:** Leonel Cruzado, Adriano Navarro
**Rama:** `feature/deliverables-upload`
**Requerimientos:** `RF-24`, `RF-25`, `RF-26`, `RNF-03`
**Estado:** listo para revisión del líder del squad (Ya se subirá el PR).

---

## Base de la rama
`dev` todavía no tiene el esquema de Prisma ni `requireRole`, así que la rama parte de:
1. `feature/server-action-teams-register` (Sprint 1, ya unificado con `dev`).
2. Merge de `feature/auth-ssr-integration` (Squad Auth: `requireRole`, clientes Supabase y el esquema Prisma real de Squad 1).

Cuando esas ramas entren a `dev`, el diff del PR se reduce solo a los archivos de este sprint.

## Archivos
| Archivo | Qué hace |
|---|---|
| `lib/actions/deliverables.ts` | Server Actions `uploadDeliverableAction`, `getMyDeliverablesAction`, `getDeliverableStatusAction`. |
| `lib/deliverables/rules.ts` | Reglas puras: entregables configurados, validación de archivo y enlace, plazo, rutas de Storage. |
| `lib/supabase/storage.ts` | Cliente de Storage solo servidor (subir, borrar, URL firmada). |
| `lib/actions/types.ts` | Contrato `ActionResult` compartido (pedido en Issue `#15`). |
| `app/portal/layout.tsx` | Layout protegido para postulantes (`requireRole("POSTULANTE")`) con encabezado y navegación. |
| `app/portal/entregables/page.tsx` | Server Component que precarga el estado del equipo y renderiza el portal. |
| `components/deliverables/deliverables-dashboard.tsx` | Dashboard con barra de progreso, alertas de estado y manejo de acciones. |
| `components/deliverables/deliverable-card.tsx` | Tarjeta con validación de archivos en cliente (máx 10 MB), drag & drop, enlaces y reemplazo. |
| `tests/deliverables.test.mjs` | 8 pruebas de las reglas (`npm run test:deliverables`). |
| `next.config.ts` | `serverActions.bodySizeLimit = "11mb"` (el límite por defecto es 1 MB). |

## Criterios de aceptación
- [x] **Server Action de subida:** recibe `FormData` (`key` + `file` o `videoUrl`), sube al bucket y guarda la ruta en `Deliverable.fileUrl`.
- [x] **Validación de archivos (`RF-25`, `RNF-03`):** máximo 10 MB; solo PDF, DOCX o enlace https de YouTube, Vimeo o Google Drive. Se verifica la extensión, el MIME **y la firma real del archivo** (`%PDF-` o ZIP), porque el nombre y el MIME los controla el cliente. Mensajes de error claros en `errors.file` / `errors.videoUrl`.
- [x] **Gestión de estados (`RF-26`):** devuelve `PENDIENTE` (sin archivo), `SUBIDO` o `RECIBIDO` por cada entregable, con una URL firmada de 10 minutos para verlo (`RF-24`).
- [x] **Lógica de reemplazo (`RF-26`):** dentro del plazo (`DELIVERABLES_DEADLINE`), una nueva subida reemplaza la anterior.

## Decisiones de seguridad
- `requireRole("POSTULANTE")` en cada acción, y el equipo se obtiene **de la sesión** (`User.teamId`), nunca de un `teamId` enviado por el cliente.
- Bucket **privado**: los archivos se leen solo con URL firmada de corta duración.
- Reemplazo seguro: se sube un objeto nuevo (`teamId/slot/timestamp.ext`), se actualiza la BD y recién entonces se borra el anterior. Si la BD falla, se borra el archivo nuevo y el anterior sigue vigente.
- `SUPABASE_SERVICE_ROLE_KEY` solo se usa en `lib/supabase/storage.ts` (`server-only`).

## Configuración necesaria (una vez)
1. Supabase → Storage → crear bucket **privado** `deliverables`.
2. En `.env`: `DELIVERABLES_BUCKET`, `DELIVERABLES_DEADLINE` (ISO 8601) y `SUPABASE_SERVICE_ROLE_KEY` (ver `.env.example`).

## Pendientes para revisar con el líder
- **Lista de entregables:** `DELIVERABLE_SLOTS` en `lib/deliverables/rules.ts` es una propuesta (Resumen ejecutivo, Pitch deck, Video pitch). Hay que confirmar los títulos y formatos reales.
- **Esquema (Squad 1):** sugerir `@@unique([teamId, title])` en `Deliverable` para evitar duplicados si dos integrantes suben a la vez.
- **Frontend:** vista completada en `/portal/entregables` consumiendo `getMyDeliverablesAction` y `uploadDeliverableAction` con badges de estado, vista previa vía URL firmada y formulario de carga/reemplazo interactivo.
- Los estados "válido / observado" del admin corresponden al Sprint 3 (`RF-38`, Issue `#11`).

## Verificación
- `npm run test:deliverables` → 8/8 pruebas.
- `npm run test:auth` → 27/27 (no se rompió nada de Auth).
- `npm run typecheck` y `npm run build` → sin errores.
- `npm run lint` → solo los 3 `any` heredados de `lib/actions/team-registration.ts` (Sprint 1). Su corrección es parte del Issue `#11` y ya está hecha en la rama del Sprint 3 (`feature/cms-evaluations`).
