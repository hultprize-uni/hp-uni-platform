# Hult Prize UNI

Plataforma oficial de Hult Prize en la Universidad Nacional de Ingeniería.

## Stack Tecnológico

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Shadcn/UI.
- **Backend & Base de Datos:** Supabase (PostgreSQL), Prisma ORM.
- **Autenticación & Storage:** Supabase Auth, Supabase Storage.
- **Despliegue:** Vercel.

---

## Entorno de Desarrollo Local

Sigue estos pasos para levantar el proyecto en tu computadora.

### 1. Requisitos Previos

- [Node.js](https://www.google.com/search?q=https%3A%2F%2Fnodejs.org%2F) (versión 18 o superior).
- Git instalado.
- Acceso al proyecto en Supabase (solicitar credenciales al Director de TI).

### 2. Instalación y Configuración

1. **Clonar el repositorio:**

```bash
git clone https://github.com/dieg0-29/hult-prize-uni.git
cd hult-prize-uni
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Variables de Entorno:**

- Crea un archivo llamado `.env` en la raíz del proyecto.
- Copia el contenido de `.env.example` y pega los valores proporcionados por el equipo de TI (URLs y claves de Supabase).

4. **Sincronizar la Base de Datos (Prisma):**

```bash
npx prisma generate
```

5. **Levantar el servidor local:**

```bash
npm run dev
```

El proyecto estará corriendo en [http://localhost:3000](http://localhost:3000). El frontend y backend se ejecutan simultáneamente en la misma terminal.

---

## Flujo de Trabajo (Git Flow)

Para mantener el orden y proteger el código de producción, seguimos estas reglas estrictas:

1. **Cero commits directos a `main`:** La rama principal está bloqueada. Todo desarrollo se hace en ramas independientes.
2. **Nomenclatura de ramas:**
   Crea una rama por cada tarea del tablero de GitHub Projects usando el formato `feature/nombre-de-la-tarea` o `fix/nombre-del-error`.

```bash
git checkout -b feature/login-participantes
```

3. **Pull Requests (PR):**
   Cuando termines tu tarea, sube tu rama y abre un Pull Request hacia `main`.
4. **Code Review:**
   Todo PR debe ser revisado y aprobado por el líder de Squad o el Director de TI antes de ser fusionado. Los comentarios en los PRs son para aprender y mejorar el código.
