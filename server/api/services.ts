import { prisma } from '../utils/prisma'
import type { Prisma } from '../../app/generated/prisma/client'

async function resolveTagConnections(input: { tagIds?: unknown; tags?: unknown }): Promise<{ id: number }[]> {
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
    ? await prisma.tag.findMany({ where: { id: { in: tagIds } }, select: { id: true } })
    : []

  const existingTagIds = new Set(existingTags.map((tag) => tag.id))
  const resolvedIds = tagIds.filter((id) => existingTagIds.has(id))

  if (!tagLabels.length) {
    return resolvedIds.map((id) => ({ id }))
  }

  const createdOrConnectedTags = await Promise.all(
    tagLabels.map(async (label) => {
      const existingTag = await prisma.tag.findUnique({ where: { label } })
      if (existingTag) return { id: existingTag.id }
      const createdTag = await prisma.tag.create({ data: { label } })
      return { id: createdTag.id }
    })
  )

  return [...resolvedIds.map((id) => ({ id })), ...createdOrConnectedTags]
}

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
