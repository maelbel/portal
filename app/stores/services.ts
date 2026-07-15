import type { Service } from '~/generated/prisma/client'

export const useServicesStore = defineStore('services', () => {
  const {
    data: services,
    pending: servicesPending,
    refresh: refreshRawServices
  } = useAsyncData<Service[]>('services', () => $fetch<Service[]>('/api/services'), {
    default: () => []
  })

  const loading = computed(() => servicesPending.value)
  const total = computed(() => services.value.length)

  const createService = async (payload: Partial<Service>) => {
    const created = await $fetch<Service>('/api/services', { method: 'POST', body: payload })
    services.value = [created, ...(services.value ?? [])]
    return created
  }

  const updateService = async (id: number, payload: Partial<Service>) => {
    const updated = await $fetch<Service>(`/api/services/${id}`, { method: 'PUT', body: payload })
    services.value = (services.value ?? []).map(s => (s.id === id ? updated : s))
    return updated
  }

  const deleteService = async (id: number) => {
    await $fetch(`/api/services/${id}`, { method: 'DELETE' })
    services.value = (services.value ?? []).filter(s => s.id !== id)
  }

  return {
    services,
    loading,
    total,
    refreshServices: refreshRawServices,
    createService,
    updateService,
    deleteService
  }
})
