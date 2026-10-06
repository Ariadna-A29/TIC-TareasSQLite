# TIC Tareas + SQLite

Esta versión mantiene el diseño de v0 y agrega persistencia con SQLite.

## 1. Instalar las dependencias

Desde la terminal de VS Code, dentro del proyecto:

```bash
pnpm install
```

Se agregó `better-sqlite3` para trabajar con SQLite desde el servidor de Next.js.

## 2. Ejecutar

```bash
pnpm dev
```

Abrí la dirección que muestre Next.js, normalmente `http://localhost:3000`.

## 3. Base de datos

Al iniciar por primera vez se crea automáticamente:

```text
.data/tic-tareas.db
```

También se crean automáticamente las tablas:

- `groups`
- `students`
- `tasks`
- `reservations`

Los datos iniciales que antes estaban solo en `lib/data.ts` se cargan en SQLite la primera vez.

## 4. Qué cambió

La interfaz de v0 no se rediseñó.

- `lib/data.ts`: conserva los tipos y los datos iniciales.
- `lib/db.ts`: abre SQLite, crea tablas y carga los datos iniciales.
- `app/api/data/route.ts`: devuelve grupos, alumnos, tareas y reservas.
- `app/api/tasks/route.ts`: guarda nuevas tareas.
- `app/api/reservations/route.ts`: crea reservas.
- `app/api/reservations/[id]/route.ts`: modifica o elimina reservas.
- `lib/store.tsx`: mantiene el estado de React y guarda los cambios en SQLite.

## 5. Importante

SQLite guarda los datos en un archivo local. Es ideal para desarrollar y presentar el proyecto en una PC. Si más adelante se quiere publicar en un servicio como Vercel y conservar los datos de forma permanente, conviene migrar la base de datos a un servicio externo.
