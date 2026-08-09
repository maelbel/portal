import { prisma } from '../../utils/prisma'
import { resolveTagConnections } from '../../utils/resolveTagConnections'
import type { Prisma } from '../../../app/generated/prisma/client'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid service id' })
  }

  const method = event.node.req.method?.toUpperCase()

  if (method === 'GET') {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { tags: true }
    })

    if (!service) {
      throw createError({ statusCode: 404, statusMessage: 'Service not found' })
    }

    return service
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    if (!body) {
      throw createError({ statusCode: 400, statusMessage: 'No body provided' })
    }

    const data: Prisma.ServiceUpdateInput = {}

    if (typeof body.label === 'string') data.label = body.label
    if (typeof body.url === 'string') data.url = body.url
    if (typeof body.containerName === 'string' || body.containerName === null) {
      data.containerName = body.containerName
    }

    await prisma.service.update({
      where: { id },
      data
    })

    if (body.tagIds !== undefined || body.tags !== undefined) {
      await prisma.service.update({
        where: { id },
        data: {
          tags: { set: [] }
        }
      })

      const tagConnections = await resolveTagConnections({
        tagIds: body.tagIds,
        tags: body.tags
      })

      if (tagConnections.length) {
        await prisma.service.update({
          where: { id },
          data: {
            tags: { connect: tagConnections }
          }
        })
      }
    }

    return await prisma.service.findUnique({
      where: { id },
      include: { tags: true }
    })
  }

  if (method === 'DELETE') {
    await prisma.service.delete({ where: { id } })
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
