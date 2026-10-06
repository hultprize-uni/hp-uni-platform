# Workflow & Tareas - Squad 4: Fullstack
## Sprint 1: Módulo de Registro y Postulación de Equipos

**Squad:** 4 - Fullstack (Lógica de Negocio y Conexión Cliente-Servidor)  
**Líder / Mentor:** Leonel Cruzado  
**Miembro Junior:** Adriano Navarro  
**Objetivo del Sprint:** Implementar el flujo integral de inscripción individual y en equipo para la plataforma Hult Prize at UNI (`RF-20`, `RF-21`, `RF-22`, `RF-23` y `RNF-03`).

---

## 🏗️ Arquitectura y Flujo Técnico del Módulo

1. **Frontend (Cliente):** Formulario modular desarrollado con React Hook Form y Shadcn/UI que realiza validación en tiempo real en el navegador usando Zod.
2. **Capa de Transporte:** Invocación tipada mediante Next.js Server Actions (`"use server"`), evitando la necesidad de endpoints REST tradicionales.
3. **Backend & Base de Datos:** Validación de datos en servidor, manejo de excepciones y persistencia a través de Prisma ORM hacia PostgreSQL (Supabase).

---

## 👨‍💻 Tareas y Estado: Leonel Cruzado (Líder / Backend)

### 📌 Rama de Trabajo
`feature/server-action-teams-register` (apuntando a `dev`)

### 📋 Entregables y Criterios de Aceptación:
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
  - Verificación exitosa mediante `npx tsc --noEmit`.
  - Push de la rama remota al repositorio de GitHub.

---

## 👨‍💻 Tareas y Estado: Adriano Navarro (Junior / Frontend)

### 📌 Rama de Trabajo
`feature/formulario-registro-equipos`  
*(Creada a partir de `origin/feature/server-action-teams-register` o `dev` tras el merge)*

### 📋 Entregables y Criterios de Aceptación:
- [ ] **Configuración de Rama e Integración:**
  - Descargar la rama remota con el esquema Zod y la Server Action ya preparados.
- [ ] **Maquetación del Formulario (`RF-20`, `RNF-01`):**
  - **Ruta sugerida:** `app/registro/page.tsx` (o componente `components/forms/register-team-form.tsx`).
  - Maquetación responsive (Mobile, Tablet, Desktop) con Tailwind CSS y componentes de Shadcn/UI.
  - Selector interactivo para alternar entre tipo `INDIVIDUAL` y `TEAM`.
  - Condicional visual para el campo "Nombre del equipo" (obligatorio solo si es `TEAM`).
- [ ] **Gestión Dinámica de Miembros (`RF-21`):**
  - Implementar integración con `useFieldArray` de React Hook Form.
  - Botón interactivo para **Agregar Integrante** (permitido hasta un máximo de 4 miembros).
  - Botón interactivo para **Eliminar Integrante** (restringido para no permitir menos de 1 miembro).
- [ ] **Integración de React Hook Form + Zod (`RNF-03`):**
  - Conectar el formulario importando `teamRegistrationSchema` y `TeamRegistrationFormValues` desde `@/lib/validations/team-schema`.
  - Mostrar feedback y mensajes de error en tiempo real debajo de cada campo si falla la validación.
  - Mostrar alerta si no se cumple el requisito del integrante UNI.
- [ ] **Conexión de Envío (Submit) con la Server Action (`RF-23`):**
  - Importar e invocar `registerTeamAction` desde `@/lib/actions/team-registration`.
  - Manejo de estados de carga (`isSubmitting` / estado de botón deshabilitado con spinner).
  - Despliegue de mensaje de éxito o alerta de error según la respuesta de `registerTeamAction`.
- [ ] **Pull Request:**
  - Apertura de PR de la rama frontend hacia la rama `dev` para revisión por parte del Líder de Squad.

---

## 🚀 Guía de Integración Rápida para Frontend

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
      // Manejar éxito (modal / redirección / mensaje)
    } else {
      // Mostrar mensaje de error (response.message)
    }
  };

  // ... lógica de renderizado
}
```
