import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid tag id' })
  }

  const method = event.node.req.method?.toUpperCase()

  if (method === 'PUT') {
    const body = await readBody(event)
    if (!body || typeof body.label !== 'string' || !body.label.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'label is required' })
    }

    return await prisma.tag.update({
      where: { id },
      data: { label: body.label.trim() }
    })
  }

  if (method === 'DELETE') {
    await prisma.tag.update({
      where: { id },
      data: {
        services: { set: [] }
      }
    })

    await prisma.tag.delete({ where: { id } })
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
