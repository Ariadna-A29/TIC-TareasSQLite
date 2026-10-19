import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { INITIAL_RESERVATIONS, INITIAL_TASKS, GROUPS, STUDENTS } from './data'

const globalForDb = globalThis as unknown as { db?: Database.Database }

function createDatabase() {
  const folder = path.join(process.cwd(), '.data')
  fs.mkdirSync(folder, { recursive: true })

  const db = new Database(path.join(folder, 'tic-tareas.db'))
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      game TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      group_id TEXT NOT NULL,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
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

    CREATE TABLE IF NOT EXISTS reservations (
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
  `)
  
  seedDatabase(db)
  return db
}

function seedDatabase(db: Database.Database) {
  const insertGroup = db.prepare('INSERT OR IGNORE INTO groups (id, name, game) VALUES (?, ?, ?)')
  const insertStudent = db.prepare('INSERT OR IGNORE INTO students (id, name, group_id) VALUES (?, ?, ?)')
  const insertTask = db.prepare(`
    INSERT OR IGNORE INTO tasks
      (id, code, title, summary, description, requirements, prerequisites, points, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertReservation = db.prepare(`
    INSERT OR IGNORE INTO reservations
      (id, task_id, student_id, group_id, status, checklist, note, self_assessment, feedback, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const seed = db.transaction(() => {
    for (const group of GROUPS) insertGroup.run(group.id, group.name, group.game)
    for (const student of STUDENTS) insertStudent.run(student.id, student.name, student.groupId)
    for (const task of INITIAL_TASKS) {
      insertTask.run(
        task.id,
        task.code,
        task.title,
        task.summary,
        task.description,
        JSON.stringify(task.requirements),
        JSON.stringify(task.prerequisites),
        task.points,
        task.category,
      )
    }
    for (const reservation of INITIAL_RESERVATIONS) {
      insertReservation.run(
        reservation.id,
        reservation.taskId,
        reservation.studentId,
        reservation.groupId,
        reservation.status,
        JSON.stringify(reservation.checklist),
        reservation.note,
        reservation.selfAssessment ?? null,
        reservation.feedback ?? null,
        reservation.updatedAt,
      )
    }
  })

  seed()
}

export const db = globalForDb.db ?? createDatabase()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

export function getData() {
  const groups = db.prepare('SELECT id, name, game FROM groups ORDER BY id').all()
  const students = db.prepare('SELECT id, name, group_id as groupId FROM students ORDER BY id').all()
  const tasks = db.prepare(`
    SELECT id, code, title, summary, description, requirements, prerequisites, points, category
    FROM tasks ORDER BY code
  `).all() as Array<Record<string, unknown>>
  const reservations = db.prepare(`
    SELECT id, task_id as taskId, student_id as studentId, group_id as groupId,
      status, checklist, note, self_assessment as selfAssessment,
      feedback, updated_at as updatedAt
    FROM reservations ORDER BY id
  `).all() as Array<Record<string, unknown>>

  return {
    groups,
    students,
    tasks: tasks.map((task) => ({
      ...task,
      requirements: JSON.parse(String(task.requirements)),
      prerequisites: JSON.parse(String(task.prerequisites)),
    })),
    reservations: reservations.map((reservation) => ({
      ...reservation,
      checklist: JSON.parse(String(reservation.checklist)),
    })),
  }
}
