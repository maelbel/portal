import type { Service } from '~/generated/prisma/client'

type ReachableState = 'up' | 'down' | 'unknown'
type ServiceState = 'up' | 'down' | 'unknown'

interface Container {
  name?: string | null
  state?: string
  status?: string
  [key: string]: unknown
}

interface EnrichedService extends Service {
  container?: Container
  reachable: ReachableState
  state: ServiceState
}

const UP_STATES = new Set([
  'running', 'up', 'ok', 'success', 'online', 'reachable', 'healthy'
])

export const useServicesStore = defineStore('services', () => {
  const {
    data: rawServices,
    pending: servicesPending,
    refresh: refreshRawServices
  } = useAsyncData<Service[]>('services', () => $fetch<Service[]>('/api/services'), {
    default: () => []
  })

  const {
    data: containers,
    pending: containersPending
  } = useAsyncData<Container[]>('containers', () => $fetch<Container[]>('/api/containers'), {
    default: () => []
  })

  const services = ref<EnrichedService[]>([])
  const loading = computed(() => servicesPending.value || containersPending.value)
  const total = computed(() => services.value.length)

  const upCount = computed(
    () => services.value.filter(service => UP_STATES.has(String(service.state ?? '').toLowerCase())).length
  )

  const servicesNotUp = computed(
    () => services.value.filter(service => !UP_STATES.has(String(service.state ?? '').toLowerCase()))
  )

  const normalizeContainerName = (name: string | null | undefined) =>
    (name ?? '').replace(/^\/+/, '').toLowerCase()

  const findContainer = (name: string | null | undefined): Container | undefined => {
    const target = normalizeContainerName(name)
    if (!target) return undefined
    return containers.value?.find(c => normalizeContainerName(c.name) === target)
  }

  const checkReachable = async (url: string | null | undefined): Promise<ReachableState> => {
    if (!url) return 'unknown'
    try {
      const res = await $fetch<{ success: boolean }>('/api/ping', { query: { url } })
      return res.success ? 'up' : 'down'
    } catch {
      return 'down'
    }
  }

  const computeState = (
    reachable: ReachableState,
    container: Container | undefined,
    containerName: string | null | undefined,
    hasUrl: boolean
  ): ServiceState => {
    const hasContainerName = Boolean(containerName?.trim())

    if (!hasUrl && !hasContainerName) return 'unknown'
    if (!hasUrl) return container?.state === 'running' ? 'up' : 'down'
    if (!hasContainerName) return reachable === 'up' ? 'up' : 'down'
    if (reachable !== 'up') return 'down'
    if (container && container.state !== 'running') return 'down'
    return 'up'
  }

  const enrichService = async (service: Service): Promise<EnrichedService> => {
    const hasUrl = Boolean(service.url?.trim())
    const hasContainerName = Boolean(service.containerName?.trim())
    const reachable = hasUrl ? await checkReachable(service.url) : 'unknown'
    const container = hasContainerName ? findContainer(service.containerName) : undefined

    return {
      ...service,
      container,
      reachable,
      state: computeState(reachable, container, service.containerName, hasUrl)
    }
  }

  const refreshServiceStates = async () => {
    const source = rawServices.value ?? []
    services.value = await Promise.all(source.map(enrichService))
  }

  watch([rawServices, containers], refreshServiceStates, { immediate: true })

  const createService = async (payload: Partial<Service>) => {
    const created = await $fetch<Service>('/api/services', { method: 'POST', body: payload })
    rawServices.value = [created, ...(rawServices.value ?? [])]
    return created
  }

  const updateService = async (id: number, payload: Partial<Service>) => {
    const updated = await $fetch<Service>(`/api/services/${id}`, { method: 'PUT', body: payload })
    rawServices.value = (rawServices.value ?? []).map(s => (s.id === id ? updated : s))
    return updated
  }

  const deleteService = async (id: number) => {
    await $fetch(`/api/services/${id}`, { method: 'DELETE' })
    rawServices.value = (rawServices.value ?? []).filter(s => s.id !== id)
  }

  return {
    services,
    containers,
    loading,
    total,
    upCount,
    servicesNotUp,
    findContainer,
    refreshServiceStates,
    refreshServices: refreshRawServices,
    createService,
    updateService,
    deleteService
  }
})
