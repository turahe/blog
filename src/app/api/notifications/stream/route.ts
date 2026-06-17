import { getSession } from '@/lib/auth/session'
import { countUnread, findNotificationsSince } from '@/modules/notifications/repository'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(request.url)
  const sinceParam = url.searchParams.get('since')
  const since = sinceParam ? new Date(sinceParam) : new Date()

  const encoder = new TextEncoder()
  let closed = false

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        if (closed) return
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      const poll = async () => {
        if (closed) return
        try {
          const [unreadCount, newItems] = await Promise.all([
            countUnread(session.user.id),
            findNotificationsSince(session.user.id, since),
          ])
          send({ type: 'sync', unreadCount, items: newItems })
        } catch {
          send({ type: 'error' })
        }
      }

      void poll()
      const interval = setInterval(() => void poll(), 10000)

      request.signal.addEventListener('abort', () => {
        closed = true
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
