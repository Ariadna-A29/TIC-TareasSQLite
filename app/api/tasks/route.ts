import { db } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const task = await request.json()

  const id = task.id || crypto.randomUUID()
  const lastTask = db.prepare('SELECT code FROM tasks ORDER BY code DESC LIMIT 1').get() as { code?: string } | undefined
  const lastNumber = lastTask?.code?.match(/M-(\d+)/)?.[1]
  const nextNumber = (lastNumber ? Number(lastNumber) : 0) + 1
  const code = task.code || `M-${String(nextNumber).padStart(2, '0')}`

  db.prepare(`
    INSERT INTO tasks
      (id, code, title, summary, description, requirements, prerequisites, points, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    code,
    task.title,
    task.summary,
    task.description,
    JSON.stringify(task.requirements),
    JSON.stringify(task.prerequisites),
    task.points,
    task.category,
  )

  return Response.json({ ...task, id, code }, { status: 201 })
}
