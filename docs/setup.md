# Setup y flujo de migraciones

## 1. Setup local

```bash
git clone https://github.com/hultprize-uni/hp-uni-platform
cd hp-uni-platform
cp .env.example .env      # completar con las credenciales de hp-uni-dev
npm install               # ejecuta "prisma generate" automáticamente (postinstall)
npm run dev
```

- `.env` **nunca** se commitea (está en `.gitignore`). Solo se versiona `.env.example`.
- Las credenciales de desarrollo apuntan al proyecto **hp-uni-dev**. Nadie usa credenciales de producción en local.

### Variables de base de datos

| Variable       | Puerto | Uso |
|----------------|--------|-----|
| `DATABASE_URL` | 6543 (pooler, `?pgbouncer=true`) | Conexiones de la app en runtime |
| `DIRECT_URL`   | 5432 (directa) | Migraciones de Prisma (`migrate dev`, `migrate deploy`) |

## 2. Entornos

| Entorno | Proyecto Supabase | Comando permitido | Origen de las migraciones |
|---------|-------------------|-------------------|---------------------------|
| Desarrollo | `hp-uni-dev` | `npx prisma migrate dev` | Tu rama de trabajo |
| Producción | proyecto prod | `npx prisma migrate deploy` | **Solo** lo que ya está en `main` |

## 3. Reglas

1. **No usar `prisma db push` ni SQL directo** para cambiar el esquema, en ningún entorno. Las tablas creadas así no quedan registradas en `_prisma_migrations` y Prisma después pedirá resetear la base.
2. **No editar una migración que ya fue commiteada** (ni su SQL ni su nombre). Si algo está mal, se crea una migración nueva que lo corrige. Editarla cambia su checksum y rompe todas las bases donde ya se aplicó.
3. **Producción solo recibe migraciones que ya estén en `main`**, y siempre con `npx prisma migrate deploy`. Nunca `migrate dev`, `migrate reset` ni `db push` contra producción.
4. Toda migración llega a `main` mediante un Pull Request aprobado.

## 4. Flujo para cambiar el esquema

```bash
# 1. Partir de la rama actualizada
git checkout dev && git pull
git checkout -b feature/mi-cambio

# 2. Editar prisma/schema.prisma

# 3. Crear y aplicar la migración en hp-uni-dev
npx prisma migrate dev --name descripcion_corta

# 4. Commitear schema.prisma + la carpeta nueva de prisma/migrations/
# 5. Abrir el PR
```

Después de que el PR se mergea a `main`, quien despliega ejecuta contra producción:

```bash
npx prisma migrate deploy
```

## 5. Después de un rebase o pull

Si llegaron migraciones nuevas de otros squads:

```bash
npm install                 # regenera el cliente de Prisma (postinstall)
npx prisma migrate dev      # aplica en hp-uni-dev las migraciones pendientes
```

## 6. Diagnóstico

```bash
npx prisma migrate status   # qué migraciones están aplicadas / pendientes
npx prisma validate         # valida schema.prisma
```

### Base sin tabla `_prisma_migrations`

Si las tablas existen pero se crearon con `db push` o SQL directo, primero se verifica que la base coincida con las migraciones:

```bash
npx prisma migrate diff \
  --from-url "$DIRECT_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

Si imprime `-- This is an empty migration.`, la base coincide con el schema.

Si no hay diferencias, se marca la migración como ya aplicada (no ejecuta SQL, solo la registra):

```bash
npx prisma migrate resolve --applied 20261026234500_init
```

Si hay diferencias, **no** usar `resolve`: hay que corregirlas antes de registrar la migración, o en dev recrear la base desde cero con `npx prisma migrate reset`.
