# ADR 0001: Server Actions de Next.js, esquema Zod compartido y fallback temporal de Prisma para el registro de equipos

* **Estado:** Aceptado
* **Fecha:** 2026-11-11
* **Autores:** Leonel Cruzado, Adriano Navarro (Squad 4 - Fullstack)

## Contexto
El módulo de inscripción y postulación (`RF-20`, `RF-21`, `RF-22`, `RF-23` y `RNF-03`, Issue `#3`) requiere permitir postulaciones individuales y grupales (1 a 4 integrantes, con al menos un miembro vinculado a la UNI), validando tanto en tiempo real en el cliente como de forma segura en el servidor. Al momento del desarrollo en paralelo, la rama `dev` aún no cuenta con los modelos definidos en `prisma/schema.prisma` (a cargo del Squad 1 - Core BBDD).

## Opciones Evaluadas
1. **Opción A:** Crear endpoints REST tradicionales en `app/api/register/route.ts` y mantener reglas de validación separadas en el cliente y en el servidor.
2. **Opción B:** Usar Next.js Server Actions (`"use server"`) junto con un único esquema de Zod compartido (`lib/validations/team-schema.ts`) para React Hook Form y servidor, bloqueando el desarrollo hasta que Squad 1 publique el esquema de Prisma en `dev`.
3. **Opción C:** Usar Next.js Server Actions (`"use server"`) con un único esquema Zod compartido y un cliente Prisma singleton (`lib/prisma.ts`) acompañado de una ruta de fallback temporal en `registerTeamAction` cuando los modelos aún no existan en Prisma Client.

## Decisión Tomada
* **Decidimos usar la Opción C (Server Actions + Zod compartido + fallback temporal de Prisma).**
* **Justificación:** Permite mantener un solo contrato tipado (`TeamRegistrationFormValues` y `ActionResult`) entre el formulario de Frontend (`RegisterTeamForm`) y la lógica de Backend (`registerTeamAction`), evitando duplicar reglas de negocio y desbloqueando las pruebas del flujo de usuario mientras Squad 1 completa la integración de `prisma/schema.prisma` en `dev`.

## Consecuencias

### Positivas (Pros):
* Validación unificada en cliente (`zodResolver`) y servidor (`safeParse`) bajo un único archivo fuente.
* Desarrollo paralelo efectivo entre Backend (`feature/server-action-teams-register`) y Frontend (`feature/form-teams-register`).
* Respuestas estructuradas (`{ success, message, data, errors }`) listas para mostrar mensajes en pantalla y preparar el envío de correo de confirmación (`RF-23`).

### Negativas (Contras / Riesgos):
* Mientras `prisma/schema.prisma` no tenga modelos en `dev`, la Server Action opera en modo fallback (no persiste aún en PostgreSQL) y `tsc --noEmit` / `npm run build` fallan al importar `PrismaClient` en `lib/prisma.ts`.
* Cuando Squad 1 integre los modelos definitivos en `dev`, se deberá adaptar `registerTeamAction` a los campos reales de `Team` y `User` y eliminar el uso de `any` detectado por ESLint.

## Notas Adicionales
* Archivos involucrados: `lib/validations/team-schema.ts`, `lib/prisma.ts`, `lib/actions/team-registration.ts`, `app/registro/page.tsx`, `components/forms/register-team-form.tsx` y `docs/Fullstack/Workflow_Fullstack.md`.
* Issue relacionado: `#3`.

