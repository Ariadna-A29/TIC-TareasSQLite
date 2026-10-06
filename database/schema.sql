-- Esquema de la base de datos de TIC Tareas.
-- La aplicación crea estas tablas automáticamente desde lib/db.ts.

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  game TEXT NOT NULL
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  group_id TEXT NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  prerequisites TEXT NOT NULL,
  points INTEGER NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE reservations (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  status TEXT NOT NULL,
  checklist TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  self_assessment TEXT,
  feedback TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (group_id) REFERENCES groups(id)
);
