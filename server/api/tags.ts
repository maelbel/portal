import { prisma } from '../utils/prisma'

const db = prisma as any

export default defineEventHandler(async (event) => {
  const method = event.node.req.method?.toUpperCase()

  if (method === 'GET') {
    return await db.tag.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    if (!body || typeof body.label !== 'string' || !body.label.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'label is required' })
    }

    return await db.tag.create({
      data: { label: body.label.trim() }
    })
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
