export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string | undefined
  if (!url) {
    return { success: false, error: 'missing url' }
  }

  const start = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000) // 3 s cap

  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal
    })
    return { success: true, status: res.status, latency: Date.now() - start }
  } catch (e) {
    return { success: false, error: (e as Error).message, latency: Date.now() - start }
  } finally {
    clearTimeout(timeout)
  }
})
