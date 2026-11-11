# Workflow & Tareas - Squad 4: Fullstack
## Sprint 1: Módulo de Registro y Postulación de Equipos

**Squad:** 4 - Fullstack (Lógica de Negocio y Conexión Cliente-Servidor)  
**Integrantes** Leonel Cruzado, Adriano Navarro  
**Objetivo del Sprint:** Implementar el flujo integral de inscripción individual y en equipo para la plataforma Hult Prize at UNI (`RF-20`, `RF-21`, `RF-22`, `RF-23` y `RNF-03`).

---

## Arquitectura y Flujo Técnico del Módulo

1. **Frontend (Cliente):** Formulario modular desarrollado con React Hook Form y Shadcn/UI que realiza validación en tiempo real en el navegador usando Zod.
2. **Capa de Transporte:** Invocación tipada mediante Next.js Server Actions (`"use server"`), evitando la necesidad de endpoints REST tradicionales.
3. **Backend & Base de Datos:** Validación de datos en servidor, manejo de excepciones y persistencia a través de Prisma ORM hacia PostgreSQL (Supabase).

---

## Tareas y Estado: Leonel Cruzado (Líder / Backend)

### Rama de Trabajo
`feature/server-action-teams-register` (apuntando a `dev`)

### Entregables y Criterios de Aceptación:
- [x] **Instalación de dependencias de validación:**
  - Inclusión de `zod` en `package.json` y `package-lock.json`.
- [x] **Esquema de Validación en Zod (`RF-21`, `RF-22`, `RNF-03`):**
  - **Archivo:** `lib/validations/team-schema.ts`
  - Soporte para inscripciones de tipo `INDIVIDUAL` y `TEAM`.
  - Validación por integrante: Nombre completo (mínimo 3 caracteres), correo electrónico válido, código/universidad obligatorio y teléfono celular (mínimo 9 dígitos).
  - Regla de equipo: Restricción de 1 a 4 integrantes máximo.
  - **Regla UNI:** Validación estricta que exige que al menos un integrante pertenezca a la Universidad Nacional de Ingeniería (correo institucional `@uni.pe` / `@uni.edu.pe` o universidad/código asociado a la UNI).
- [x] **Configuración del Singleton de Base de Datos:**
  - **Archivo:** `lib/prisma.ts`
  - Instancia singleton de `PrismaClient` para prevenir el agotamiento del pool de conexiones en el entorno de desarrollo con Hot Reload.
- [x] **Server Action de Inscripción (`RF-20`, `RF-23`, `RNF-03`):**
  - **Archivo:** `lib/actions/team-registration.ts`
  - Directiva `"use server"` para ejecución en entorno seguro de backend.
  - Validación del payload entrante con `safeParse`.
  - Transacción de inserción en Prisma ORM con fallback resiliente para trabajo en paralelo con Squad 1 (Core BBDD).
  - Manejo de excepciones controlado (detección de registros duplicados como error `P2002`).
  - Retorno de contrato estandarizado `ActionResult` (`{ success, message, data, errors }`).
- [x] **Verificación y Compilación:**
  - Verificación inicial de tipos en la implementación backend (`npx tsc --noEmit` previo a la sincronización de `node_modules`).
  - Push de la rama remota al repositorio de GitHub y sincronización posterior con `origin/dev` y `origin/feature/form-teams-register`.

---

## Tareas y Estado: Adriano Navarro (Junior / Frontend)

### Rama de Trabajo
`feature/form-teams-register`  
*(Creada a partir de `feature/server-action-teams-register`, actualizada con `origin/dev` e integrada en `feature/server-action-teams-register` para el PR unificado del Issue `#3`)*

### Entregables y Criterios de Aceptación:
- [x] **Configuración de Rama e Integración:**
  - Descarga de la rama backend, merge con `origin/dev` e instalación de `react-hook-form` y `@hookform/resolvers`.
- [x] **Maquetación del Formulario (`RF-20`, `RNF-01`):**
  - **Archivos:** `app/registro/page.tsx`, `components/forms/register-team-form.tsx` y componentes Shadcn UI (`components/ui/alert.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `radio-group.tsx`).
  - Maquetación responsive con Tailwind CSS y Shadcn/UI.
  - Selector interactivo (`RadioGroup`) para alternar entre `INDIVIDUAL` y `TEAM`.
  - Condicional visual para el campo "Nombre del equipo" (limpieza automática al pasar a `INDIVIDUAL`).
- [x] **Gestión Dinámica de Miembros (`RF-21`):**
  - Integración con `useFieldArray` de React Hook Form.
  - Botón para **Agregar Integrante** (hasta un máximo de 4 miembros).
  - Botón para **Quitar** integrante (mínimo 1 miembro).
- [x] **Integración de React Hook Form + Zod (`RNF-03`):**
  - Conexión directa con `teamRegistrationSchema` y `TeamRegistrationFormValues` desde `@/lib/validations/team-schema` (`mode: "onTouched"`).
  - Mensajes de error por campo (`FieldError`) y alerta grupal para la regla UNI.
- [x] **Conexión de Envío (Submit) con la Server Action (`RF-23`):**
  - Invocación de `registerTeamAction` desde `@/lib/actions/team-registration`.
  - Estado de carga (`isSubmitting` con spinner) y alertas de éxito/error según la respuesta.
- [x] **Pull Request y Cierre de Issue (`#3`):**
  - Apertura de PR unificado desde `feature/server-action-teams-register` hacia `dev` para revisión del encargado del área.
  - Pendientes a revisar en etapas posteriores: conexión definitiva con los modelos de `prisma/schema.prisma` (cuando Squad 1 haga merge a `dev`), limpieza de `any` en `team-registration.ts` y ajustes de validación/correo de confirmación.

---

## Guía de Integración Rápida para Frontend

Adriano puede consumir el módulo de Leonel utilizando la siguiente estructura:

```typescript
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  teamRegistrationSchema, 
  TeamRegistrationFormValues 
} from "@/lib/validations/team-schema";
import { registerTeamAction } from "@/lib/actions/team-registration";

export function RegisterForm() {
  const form = useForm<TeamRegistrationFormValues>({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues: {
      registrationType: "TEAM",
      teamName: "",
      members: [
        { fullName: "", email: "", universityCode: "", phone: "" }
      ],
    },
  });

  const onSubmit = async (values: TeamRegistrationFormValues) => {
    const response = await registerTeamAction(values);
    if (response.success) {

    } else {

    }
  };
}
```
