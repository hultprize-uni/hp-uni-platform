# Workflow Squad 4 — Fullstack
## Sprint 2: Carga y gestión de entregables (Issue `#8`)

**Integrantes:** Leonel Cruzado, Adriano Navarro
**Rama:** `feature/deliverables-upload`
**Requerimientos:** `RF-24`, `RF-25`, `RF-26`, `RNF-03`
**Estado:** listo para revisión del líder del squad (aún sin PR).

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
- **Frontend:** la vista del portal del postulante consume estas acciones; no está en este issue (`[BACK]`).
- Los estados "válido / observado" del admin corresponden al Sprint 3 (`RF-38`, Issue `#11`).

## Verificación
- `npm run test:deliverables` → 8/8 pruebas.
- `npm run typecheck`, `npm run lint` y `npm run build`: correr tras `npm install` (ver la guía de presentación).
