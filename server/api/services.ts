import { prisma } from '../utils/prisma'
import { resolveTagConnections } from '../utils/resolveTagConnections'
import type { Prisma } from '../../app/generated/prisma/client'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method?.toUpperCase()

  if (method === 'GET') {
    return await prisma.service.findMany({
      include: { tags: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)

    if (!body || typeof body.label !== 'string' || typeof body.url !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'label and url are required' })
    }

    const tagConnections = await resolveTagConnections({
      tagIds: body.tagIds,
      tags: body.tags
    })

    const data: Prisma.ServiceCreateInput = {
      label: body.label,
      url: body.url,
      containerName: typeof body.containerName === 'string' ? body.containerName : null,
      tags: { connect: tagConnections }
    }

    return await prisma.service.create({
      data,
      include: { tags: true }
    })
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
