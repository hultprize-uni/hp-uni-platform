# Workflow Squad 4 — Fullstack
## Sprint 1: Módulo de Registro y Postulación de Equipos (Issue `#3`)

**Integrantes:** Leonel Cruzado, Adriano Navarro  
**Rama:** `feature/server-action-teams-register` (PR #20 unificado con `feature/form-teams-register`)  
**Requerimientos:** `RF-20`, `RF-21`, `RF-22`, `RF-23`, `RNF-03`  
**Estado:** Entregado en Pull Request #20 (en revisión).

---

## Base de la rama
La implementación del Sprint 1 se desarrolló y unificó a partir de:
1. `feature/server-action-teams-register` (Backend: esquemas Zod, singleton de Prisma y Server Action).
2. `feature/form-teams-register` (Frontend: formulario interactivo React Hook Form y componentes UI).
3. Sincronización limpia con `origin/dev`.

---

## Archivos
| Archivo | Qué hace |
|---|---|
| `lib/validations/team-schema.ts` | Esquema de validación en Zod para inscripciones individuales y de equipos (1 a 4 miembros, validación UNI). |
| `lib/actions/team-registration.ts` | Server Action `registerTeamAction` con `"use server"`, manejo de excepciones (`P2002`) y fallback resiliente. |
| `lib/prisma.ts` | Singleton de Prisma Client para evitar saturación de conexiones en desarrollo. |
| `app/registro/page.tsx` | Página pública de registro de postulantes. |
| `components/forms/register-team-form.tsx` | Formulario interactivo con `useFieldArray`, React Hook Form y validación en tiempo real. |
| `components/ui/` (`alert`, `card`, `input`, `label`, `radio-group`) | Componentes base de interfaz (Shadcn UI / Tailwind CSS). |
| `docs/adr/ADR-0001-registro-server-actions-zod.md` | Registro de decisión arquitectónica (ADR) sobre Server Actions y Zod. |

---

## Criterios de aceptación
- [x] **Esquema de Validación en Zod (`RF-21`, `RF-22`, `RNF-03`):** Validación por integrante (nombre, email, código UNI, celular) y límite estricto de 1 a 4 integrantes.
- [x] **Regla UNI (`RF-21`):** Se exige que al menos un integrante pertenezca a la Universidad Nacional de Ingeniería (correo `@uni.pe` / `@uni.edu.pe` o universidad UNI).
- [x] **Server Action tipada (`RF-20`, `RF-23`, `RNF-03`):** Invocación segura mediante `"use server"` devolviendo contrato estandarizado `ActionResult`.
- [x] **Formulario React Hook Form (`RF-20`, `RNF-01`):** Selector dinámico entre inscripción Individual y Equipo, campos condicionales y control dinámico de miembros (`useFieldArray`).
- [x] **Manejo de estados y feedback:** Alertas visuales de error de validación, regla UNI y estado de envío con spinner.

---

## Decisiones de seguridad y arquitectura
- **Server Actions con re-validación en servidor:** Aunque el formulario valida con Zod en el navegador (`mode: "onTouched"`), la Server Action ejecuta `safeParse` en el backend para evitar inyecciones o bypasses por peticiones directas.
- **Singleton de Prisma Client:** Implementado en `lib/prisma.ts` siguiendo el estándar oficial de Next.js para evitar el agotamiento del pool de conexiones con Hot Reload en desarrollo.
- **Fallback resiliente:** Implementado para permitir pruebas funcionales mientras Squad 1 completaba la migración de modelos en `schema.prisma`.
- **Documentación de Decisiones:** Registro formal de arquitectura mediante el `ADR-0001`.

---

## Pendientes para etapas posteriores
- Conexión con los modelos definitivos de Prisma cuando Squad 1 haga merge a `dev`.
- Limpieza de tipos `any` en `team-registration.ts` (programada y abordada en el Issue `#11` de CMS).
- Integración del servicio de envío de correos de confirmación de postulación.

---

## Verificación
- Instalación de dependencias limpias con `npm ci`.
- Pruebas funcionales en entorno local (`npm run dev`) en `/registro`.
- Validación interactiva probada para 1 a 4 integrantes y la regla de correo UNI.
- Pull Request #20 abierto hacia `dev` vinculando `Closes #3`.
