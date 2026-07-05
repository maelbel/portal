import { prisma } from '../utils/prisma'

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
  const method = event.node.req.method?.toUpperCase()

  if (method === 'GET') {
    return await db.service.findMany({
      include: { tags: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)

    if (!body || typeof body.label !== 'string' || typeof body.url !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'label and url are required' })
    }

    const data = {
      label: body.label,
      url: body.url,
      containerName: typeof body.containerName === 'string' ? body.containerName : null
    }

    const tagConnections = await resolveTagConnections({
      tagIds: body.tagIds,
      tags: body.tags
    })

    return await db.service.create({
      data: {
        ...data,
        tags: {
          connect: tagConnections
        }
      },
      include: { tags: true }
    })
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
