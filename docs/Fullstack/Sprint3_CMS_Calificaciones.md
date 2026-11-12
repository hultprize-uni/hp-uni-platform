# Workflow Squad 4 — Fullstack
## Sprint 3: Server Actions del CMS y guardado de calificaciones (Issue `#11`)

**Integrantes:** Leonel Cruzado, Adriano Navarro
**Rama:** `feature/cms-evaluations`
**Requerimientos:** `RF-06`, `RF-11`, `RF-15`, `RF-30`, `RF-31`, `RF-34`, `RF-35`, `RF-36`, `RF-38`, `RF-39`, `RNF-03`, `RNF-05`
**Estado:** listo para revisión del líder del squad (aún sin PR).

---

## Base de la rama
Igual que el Sprint 2: `feature/server-action-teams-register` + merge de `feature/auth-ssr-integration` (para `requireRole` y el esquema Prisma). **Es independiente de la rama del Sprint 2**: se puede revisar y fusionar por separado. Si se fusionan ambas, solo hay que resolver dos conflictos triviales (una línea de `package.json` y el final de `.env.example`: quedarse con las dos partes).

## Archivos
| Archivo | Qué hace |
|---|---|
| `lib/actions/admin/cms.ts` | Home, Cronograma (crear/editar/eliminar/reordenar) y Aliados con logo. Revalida `/` y `/cronograma`. |
| `lib/actions/admin/evaluation.ts` | Rúbricas con criterios, asignación de jurados a equipos y revisión de entregables. |
| `lib/actions/jurado/evaluations.ts` | Borrador y finalización de la evaluación del jurado. |
| `lib/validations/cms-schema.ts` | Esquemas Zod de todo lo anterior + validación de logos. |
| `lib/evaluations/rules.ts` | Reglas puras: puntaje ≤ máximo, criterios completos al finalizar, puntaje ponderado 0–100. |
| `lib/registration/*` | Registro de equipos con el esquema real (deuda del Sprint 1). |
| `lib/supabase/public-assets.ts` | Subida y borrado de logos en un bucket público. |
| `prisma/schema.prisma` + `prisma/migrations/20261111000000_sprint3_cms_evaluaciones` | **Propuesta** de cambios al esquema (ver abajo). |
| `tests/cms-evaluations.test.mjs` | 15 pruebas (`npm run test:cms`). |

## Criterios de aceptación
- [x] **CRUD de contenido público:** Home (`updateHomeContentAction`), hitos (`create/update/delete/reorderTimelineEventsAction`) y aliados (`create/update/delete/reorderPartnersAction`, logo PNG/JPG/WEBP ≤ 2 MB a Storage). Cada guardado llama a `revalidatePath`.
- [x] **Rúbricas (`RF-39`):** `saveRubricAction` crea o edita la rúbrica con criterios (`maxScore`, `weight`, orden). Rechaza el cambio si la rúbrica ya tiene evaluaciones finalizadas.
- [x] **Calificaciones (`RF-30`, `RF-31`):** `saveEvaluationAction` guarda un borrador o finaliza. Valida que el puntaje no supere el máximo, que el jurado tenga el equipo asignado, y que al finalizar estén todos los criterios (también los guardados antes en borrador). Una evaluación finalizada ya no se edita.
- [x] **Entregables por admin (`RF-38`):** `reviewDeliverableAction` marca VÁLIDO u OBSERVADO (con comentario obligatorio) y deja el estado en RECIBIDO.
- [x] **Validación y autorización (`RNF-03`):** todas las acciones llaman primero a `requireRole("ADMIN")` o `requireRole("JURADO")`, validan con Zod y devuelven `ActionResult`. El jurado sale de la sesión, nunca del cliente.
- [x] **Deuda del Sprint 1 (`#3`):**
  - Se quitaron `prisma as any` y el fallback que respondía éxito sin guardar.
  - `registerTeamAction` crea las cuentas en Supabase Auth (rol `POSTULANTE`, sin contraseña) y luego `Team` + `User` en una sola escritura. Si algo falla, borra las cuentas creadas.
  - La regla UNI ya no usa `includes("uni")`: exige correo `@uni.pe` / `@uni.edu.pe` o código UNI con formato `20231234A`. El formulario muestra el campo como «Código UNI (opcional)».
  - Se rechazan correos repetidos dentro del mismo equipo, y el mensaje de duplicado es genérico (no revela qué correo existe).

## Propuesta de esquema para Squad 1 (necesaria para cumplir el issue)
El esquema actual no tiene dónde guardar algunos datos que pide el issue:
| Cambio | Para qué |
|---|---|
| `RubricCriterion.weight` (Float, por defecto 1) | El peso de cada criterio (`RF-39`). |
| Modelo `JudgeAssignment` (jurado ↔ equipo, único) | Saber qué equipos tiene asignados cada jurado (`RF-30`). |
| `Deliverable.reviewStatus` (`SIN_REVISAR`/`VALIDO`/`OBSERVADO`), `reviewNotes`, `reviewedAt` | La revisión del admin (`RF-38`). |
| Modelo `SiteContent` (clave → JSON) | Textos editables del Home (`RF-06`). |

La migración SQL se generó con `prisma migrate diff` y **no se aplicó a ninguna base de datos**.

## Puntos a decidir con el líder
1. **Cuentas de postulantes:** el registro crea usuarios en Supabase Auth porque `User.id` debe ser el UUID de Auth. Falta definir cómo crean su contraseña (correo de invitación o recuperación, que podría cubrir el correo de confirmación de `RF-23`).
2. **Abuso del formulario público:** como el registro crea cuentas, conviene agregar captcha o límite de envíos.
3. **Esquema:** confirmar con Squad 1 los cambios de la tabla anterior.

## Configuración necesaria
- Supabase Storage: bucket **público** `partners` (solo logos).
- `.env`: `PARTNERS_BUCKET` y `SUPABASE_SERVICE_ROLE_KEY`.
- Aplicar la migración en el entorno de desarrollo cuando Squad 1 la apruebe: `npx prisma migrate deploy`.

## Verificación
- `npm run test:cms` → 15/15 pruebas.
- `npm run typecheck`, `npm run lint` y `npm run build`: correr tras `npm install`.
