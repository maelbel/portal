import { prisma } from '../../utils/prisma'

const db = prisma as any

async function resolveTagConnections(input: { tagIds?: unknown; tags?: unknown }) {
  const tagIds = Array.isArray(input.tagIds)
    ? input.tagIds.filter((value): value is number => typeof value === 'number')
    : []

  const tagLabels = Array.isArray(input.tags)
    ? input.tags
        .map((tag) => {
          if (typeof tag === 'string') return tag
          if (tag && typeof tag === 'object' && 'label' in tag && typeof tag.label === 'string') {
            return tag.label
          }
          return null
        })
        .filter((value): value is string => Boolean(value))
    : []

  const existingTags = tagIds.length
    ? await db.tag.findMany({ where: { id: { in: tagIds } }, select: { id: true } })
    : []

  const existingTagIds = new Set(existingTags.map((tag: { id: number }) => tag.id))
  const resolvedIds = tagIds.filter((id) => existingTagIds.has(id))

  if (!tagLabels.length) {
    return resolvedIds.map((id) => ({ id }))
  }

  const createdOrConnectedTags = await Promise.all(
    tagLabels.map(async (label) => {
      const existingTag = await db.tag.findUnique({ where: { label } })
      if (existingTag) return { id: existingTag.id }
      const createdTag = await db.tag.create({ data: { label } })
      return { id: createdTag.id }
    })
  )

  return [...resolvedIds.map((id) => ({ id })), ...createdOrConnectedTags]
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid service id' })
  }

  const method = event.node.req.method?.toUpperCase()

  if (method === 'GET') {
    const service = await db.service.findUnique({
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

    const data: Record<string, unknown> = {}

    if (typeof body.label === 'string') data.label = body.label
    if (typeof body.url === 'string') data.url = body.url
    if (typeof body.containerName === 'string' || body.containerName === null) {
      data.containerName = body.containerName
    }

    const service = await db.service.update({
      where: { id },
      data
    })

    if (body.tagIds !== undefined || body.tags !== undefined) {
      await db.service.update({
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
        await db.service.update({
          where: { id },
          data: {
            tags: { connect: tagConnections }
          }
        })
      }
    }

    return await db.service.findUnique({
      where: { id },
      include: { tags: true }
    })
  }

  if (method === 'DELETE') {
    await db.service.delete({ where: { id } })
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
