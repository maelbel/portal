import type { H3Event, EventHandlerRequest } from 'h3'

export default defineCachedEventHandler(
  async (event: H3Event<EventHandlerRequest>) => {
    const url = getQuery(event).url as string | undefined
    if (!url) {
      return { success: false, error: 'missing url' }
    }

    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return { success: false, error: 'invalid url' }
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { success: false, error: 'unsupported protocol' }
    }

    const start = Date.now()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    try {
      const res = await fetch(parsed, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal
      })
      return { success: true, status: res.status, latency: Date.now() - start }
    } catch (e) {
      return { success: false, error: (e as Error).message, latency: Date.now() - start }
    } finally {
      clearTimeout(timeout)
    }
  },
  {
    maxAge: 10,
    swr: true,
    getKey: (event: H3Event<EventHandlerRequest>) => `ping:${getQuery(event).url ?? ''}`,
    name: 'ping'
  }
)
