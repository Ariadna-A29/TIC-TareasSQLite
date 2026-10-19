import { db } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: Request){
  const reservation = await request.json()

  const id = reservation.id || crypto.randomUUID()

  db.prepare(`INSERT INTO reservations
    (
    id,
    task_id,
    student_id,
    group_id,
    status,
    ckecklist,
    note,
    self_assessment,
    feedback,
    updated_at
    )
    VALUES ('?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      reservation.taskId,
      reservation.studentId,
      reservation.groupId,
      reservation.status,
      JSON.stringify(
        reservation.checklist
      ),
      reservation.note ?? '',
      reservation.selfAssessment ?? null,
      reservation.feedback ?? null,
      reservation.updateAt ||
      new Date().toISOString()
    )

    return Response.json(
      {
        ok: true,
        id,
      },
      {
        status: 201,
      }
    )
  }