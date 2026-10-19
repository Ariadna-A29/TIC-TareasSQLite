import { getData } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const data = getData()

  return Response.json(getData())
}
