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

const normalizeContainerName = (name: string | null | undefined) => (name ?? '').replace(/^\/+/, '').toLowerCase()

const findContainer = (name: string | null | undefined) => containers.value?.find((container: { name: string | null | undefined }) => normalizeContainerName(container.name) === normalizeContainerName(name))

const enrichedServices = ref<Array<Record<string, any>>>([])
const searchQuery = ref('')
const stateFilter = ref('all')
const sortBy = ref('name-asc')

const { services, loading } = storeToRefs(servicesStore)

const filteredServices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const sourceServices = enrichedServices.value.length > 0 ? enrichedServices.value : (services.value ?? [])

  const filtered = sourceServices.filter((service: Record<string, any>) => {
    const serviceName = String(service.name ?? '').toLowerCase()
    const serviceUrl = String(service.url ?? '').toLowerCase()
    const serviceState = String(service.state ?? 'unknown')

    const matchesQuery = !query || serviceName.includes(query) || serviceUrl.includes(query)
    const matchesState = stateFilter.value === 'all' || serviceState === stateFilter.value

    return matchesQuery && matchesState
  })

  const sorted = [...filtered]
  sorted.sort((a: Record<string, any>, b: Record<string, any>) => {
    const nameA = String(a.name ?? '').toLowerCase()
    const nameB = String(b.name ?? '').toLowerCase()
    const stateA = String(a.state ?? 'unknown')
    const stateB = String(b.state ?? 'unknown')

    switch (sortBy.value) {
      case 'name-desc':
        return nameB.localeCompare(nameA)
      case 'state-up':
        return stateA.localeCompare(stateB)
      case 'state-down':
        return stateB.localeCompare(stateA)
      case 'name-asc':
      default:
        return nameA.localeCompare(nameB)
    }
  })

  return sorted
})

const reachable = async (url: string) => {
  if (!url) return 'unknown'
  try {
    const res = await $fetch('/api/ping', { query: { url } })
    return res.success ? 'up' : 'down'
  } catch {
    return 'down'
  }
}

const computeState = (reachableState: string, container: Record<string, any> | undefined, containerName?: string | null, hasUrl = false) => {
  const hasContainerName = Boolean(containerName?.trim())

  if (!hasUrl && !hasContainerName) return 'unknown'
  if (!hasUrl) return container?.state === 'running' ? 'up' : 'down'
  if (!hasContainerName) return reachableState === 'up' ? 'up' : 'down'
  if (reachableState === 'down' || reachableState === 'unknown') return 'down'
  if (container && container.state !== 'running') return 'down'
  return 'up'
}

const refreshServiceStates = async () => {
  enrichedServices.value = await Promise.all(services.value.map(async (service: Record<string, any>) => {
    const hasUrl = Boolean(service.url?.trim())
    const hasContainerName = Boolean(service.containerName?.trim())
    const reachableState = hasUrl ? await reachable(service.url) : 'unknown'
    const container = hasContainerName ? findContainer(service.containerName) : undefined

    return {
      ...service,
      reachable: reachableState,
      state: computeState(reachableState, container, service.containerName, hasUrl)
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

    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between my-4">
      <UInput
        v-model="searchQuery"
        placeholder="Search services"
        icon="i-heroicons-magnifying-glass"
        class="md:max-w-sm"
      />

      <div class="flex flex-col gap-3 sm:flex-row">
        <USelect
          v-model="stateFilter"
          :items="[
            { label: 'All states', value: 'all' },
            { label: 'Up', value: 'up' },
            { label: 'Down', value: 'down' },
            { label: 'Unknown', value: 'unknown' }
          ]"
          placeholder="Filter by state"
        />

        <USelect
          v-model="sortBy"
          :items="[
            { label: 'Sort by name A-Z', value: 'name-asc' },
            { label: 'Sort by name Z-A', value: 'name-desc' },
            { label: 'Sort by state ↑', value: 'state-up' },
            { label: 'Sort by state ↓', value: 'state-down' }
          ]"
          placeholder="Sort"
        />
      </div>
    </div>

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

    <template v-else>
      <template v-if="filteredServices.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-4">
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :service="service"
            :container="findContainer(service.containerName)"
            @edit="openEditModal"
            @delete="deleteService"
          />
        </div>
      </template>
      <template v-else>
        <div class="rounded-lg border border-default/20 bg-default/5 p-6 text-sm text-default/70">
          No services match the current filters.
        </div>
      </template>
    </template>
  </UContainer>
</template>
