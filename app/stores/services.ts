import type { Service } from '~/generated/prisma/client'

export const useServicesStore = defineStore('services', () => {
  const { data, pending } = useAsyncData<Service[] | null>(
    'services',
    () => $fetch<Service[]>('/api/services')
  )

  const services = computed(() => data.value ?? [])
  const loading = computed(() => pending.value)

  const createService = async (payload: Record<string, any>) => {
    const createdService = await $fetch<Service>('/api/services', {
      method: 'POST',
      body: payload
    })

    const currentServices = data.value ?? []
    data.value = [createdService, ...currentServices]
    return createdService
  }

  const updateService = async (id: number, payload: Record<string, any>) => {
    const updatedService = await $fetch<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: payload
    })

    data.value = (data.value ?? []).map((service: Service) => (service.id === id ? updatedService : service))
    return updatedService
  }

  const deleteService = async (id: number) => {
    await $fetch(`/api/services/${id}`, {
      method: 'DELETE'
    })

    data.value = (data.value ?? []).filter((service: Service) => service.id !== id)
  }

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService
  }
})
