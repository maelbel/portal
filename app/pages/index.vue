<script setup lang="ts">
import { useServicesStore } from '~/stores/services'

const { data: containers } = await useFetch('/api/containers')
const toast = useToast()
const servicesStore = useServicesStore()
const {
  isCreateModalOpen,
  isEditModalOpen,
  newService,
  editingService,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  createService,
  updateService
} = useServiceModal()

const normalizeContainerName = (name: string) => name.replace(/^\/+/, '').toLowerCase()

const findContainer = (name: string) => containers.value?.find((container: { name: string }) => normalizeContainerName(container.name) === normalizeContainerName(name))

const enrichedServices = ref<Array<Record<string, any>>>([])

const { services, loading } = storeToRefs(servicesStore)

const reachable = async (url: string) => {
  if (!url) return 'unknown'
  try {
    const res = await $fetch('/api/ping', { query: { url } })
    return res.success ? 'up' : 'down'
  } catch {
    return 'down'
  }
}

const computeState = (reachableState: string, container: Record<string, any> | undefined, containerName?: string | null) => {
  if (reachableState === 'down' || reachableState === 'unknown') return 'down'
  if (containerName && !container) return 'down'
  if (container && container.state !== 'running') return 'down'
  return 'up'
}

const refreshServiceStates = async () => {
  enrichedServices.value = await Promise.all(services.value.map(async (service: Record<string, any>) => {
    const reachableState = await reachable(service.url)
    const container = service.containerName ? findContainer(service.containerName) : undefined

    return {
      ...service,
      reachable: reachableState,
      state: computeState(reachableState, container, service.containerName)
    }
  }))
}

watch([services, containers], () => {
  void refreshServiceStates()
}, { deep: true, immediate: true })

const deleteService = async (service: Record<string, any>) => {
  try {
    await servicesStore.deleteService(service.id)
    toast.add({ title: 'Service deleted', description: 'The service has been removed.', color: 'success' })
  } catch {
    toast.add({ title: 'Deletion failed', description: 'The service could not be removed.', color: 'error' })
  }
}
</script>

<template>
  <UContainer>
    <div class="flex items-center justify-between my-6">
      <h1 class="text-2xl font-bold">Services</h1>
      <UButton label="Add service" color="primary" @click="openCreateModal" />
    </div>

    <USeparator />

    <ServiceForm
      v-if="isCreateModalOpen"
      v-model="newService"
      title="Add a service"
      submit-label="Create"
      @submit="createService"
      @cancel="closeCreateModal"
    />

    <ServiceForm
      v-if="isEditModalOpen"
      v-model="editingService"
      title="Edit service"
      submit-label="Update"
      @submit="updateService"
      @cancel="closeEditModal"
    />

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-4">
      <div v-for="index in 3" :key="index" class="h-full rounded-lg border border-default/20 bg-default/5 p-4 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <USkeleton class="h-5 w-32" />
          <USkeleton class="h-6 w-6 rounded-full" />
        </div>
        <div class="flex gap-2">
          <USkeleton class="h-6 w-16 rounded-full" />
          <USkeleton class="h-6 w-20 rounded-full" />
        </div>
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-3/4" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-4">
      <ServiceCard
        v-for="service in enrichedServices"
        :key="service.id"
        :service="service"
        :container="findContainer(service.containerName)"
        @edit="openEditModal"
        @delete="deleteService"
      />
    </div>
  </UContainer>
</template>
