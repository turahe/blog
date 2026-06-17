import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getHealthStatus, logRequest } from '@/lib/monitoring/health'

export async function GET(request: NextRequest) {
  const start = Date.now()
  const health = await getHealthStatus()
  const duration = Date.now() - start

  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined
  const userAgent = request.headers.get('user-agent') ?? undefined

  await logRequest(
    'GET',
    '/api/health',
    health.status === 'ok' ? 200 : 503,
    duration,
    ip,
    userAgent
  )

  return NextResponse.json(health, {
    status: health.status === 'ok' ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
