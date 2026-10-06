import { db } from '@/lib/db'

export const runtime = 'nodejs'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const changes = await request.json()
  const current = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id) as Record<string, unknown> | undefined

  if (!current) return Response.json({ error: 'Reserva no encontrada' }, { status: 404 })

  const checklist = changes.checklist ?? JSON.parse(String(current.checklist))
  const note = changes.note ?? current.note
  const status = changes.status ?? current.status
  const selfAssessment = changes.selfAssessment ?? current.self_assessment ?? null
  const feedback = changes.feedback ?? current.feedback ?? null
  const updatedAt = new Date().toISOString()

  db.prepare(`
    UPDATE reservations
    SET status = ?, checklist = ?, note = ?, self_assessment = ?, feedback = ?, updated_at = ?
    WHERE id = ?
  `).run(status, JSON.stringify(checklist), note, selfAssessment, feedback, updatedAt, id)

  return Response.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  db.prepare('DELETE FROM reservations WHERE id = ?').run(id)
  return new Response(null, { status: 204 })
}
