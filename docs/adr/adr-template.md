# ADR 0001: [Título corto de la decisión]

* **Estado:** [Aceptado / Rechazado / Deprecado]
* **Fecha:** [YYYY-MM-DD, ej. 2026-09-12]
* **Autores:** [Tu Nombre]

## Contexto
[Describe el problema técnico o de negocio que están enfrentando y por qué se necesita tomar una decisión en este momento. Ej: "Necesitamos un sistema de base de datos relacional y autenticación rápida para la plataforma de Hult Prize at UNI, contando con un equipo mayoritariamente junior y plazos ajustados a noviembre."]

## Opciones Evaluadas
[Menciona brevemente las alternativas que se consideraron antes de tomar la decisión.]
1. **Opción A:** [Ej. Construir una API REST propia con Node.js/Express + PostgreSQL autohospedado.]
2. **Opción B:** [Ej. Usar Firebase (NoSQL).]
3. **Opción C:** [Ej. Usar Supabase (PostgreSQL + Auth + Storage integrado).]

## Decisión Tomada
[Explica claramente qué opción eligieron y por qué.]
* **Decidimos usar la Opción C (Supabase).**
* **Justificación:** [Ej: Nos permite unificar base de datos relacional (PostgreSQL), autenticación y almacenamiento de archivos de manera nativa, reduciendo la curva de aprendizaje para los miembros en formación y eliminando la necesidad de programar un servidor backend desde cero.]

## Consecuencias
[Analiza el impacto positivo y negativo de esta decisión.]

### Positivas (Pros):
* Aceleración drástica en el desarrollo del MVP para cumplir con los hitos de la junta directiva.
* Integración nativa con TypeScript y Prisma ORM.
* Seguridad garantizada mediante Row Level Security (RLS).

### Negativas (Contras / Riesgos):
* Dependencia de un servicio de terceros (BaaS).
* Límite de correos en el servidor SMTP gratuito por defecto (requiere configurar un proveedor externo como Resend para producción).

## Notas Adicionales
[Cualquier enlace de interés, credenciales de prueba generales, o anotaciones que el equipo deba tener en cuenta.]