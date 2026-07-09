<script setup lang="ts">
import { useServicesStore } from '~/stores/services'

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

const { services, loading, total, upCount, servicesNotUp } = storeToRefs(servicesStore)

const searchQuery = ref('')
const stateFilter = ref('all')
const tagFilter = ref<string[]>([])
const urlFilter = ref<boolean>(false)
const sortBy = ref('name-asc')

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const availableTags = computed(() => {
  const tagSet = new Set<string>()
  for (const service of services.value) {
    const tags = (service as Record<string, any>).tags as Array<{ label?: string }> | undefined
    if (!tags) continue
    for (const tag of tags) {
      if (tag?.label) tagSet.add(tag.label)
    }
  }
  return Array.from(tagSet)
    .sort((a, b) => a.localeCompare(b))
    .map(label => ({ label, value: label }))
})

const filteredServices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const selectedTags = tagFilter.value

  const filtered = services.value.filter((service: Record<string, any>) => {
    const serviceName = String(service.name ?? '').toLowerCase()
    const serviceUrl = String(service.url ?? '').toLowerCase()
    const serviceState = String(service.state ?? 'unknown')
    const serviceTagLabels: string[] = Array.isArray(service.tags)
      ? service.tags.map((tag: { label?: string }) => tag?.label).filter(Boolean)
      : []

    const matchesQuery = !query || serviceName.includes(query) || serviceUrl.includes(query)
    const matchesState = stateFilter.value === 'all' || serviceState === stateFilter.value
    const matchesTags = selectedTags.length === 0
      || selectedTags.every(tag => serviceTagLabels.includes(tag))
    const hasUrl = urlFilter.value ? service.url : true

    return matchesQuery && matchesState && matchesTags && hasUrl
  })

  const sorted = [...filtered]
  sorted.sort((a: Record<string, any>, b: Record<string, any>) => {
    const nameA = String(a.label ?? '').toLowerCase()
    const nameB = String(b.label ?? '').toLowerCase()
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
      <div class="flex items-center justify-center gap-4">
        <h1 class="text-2xl font-bold">
          Services
        </h1>
        <div class="flex items-center gap-2">
          <UBadge
            :color="upCount === total && total > 0 ? 'success' : upCount === 0 ? 'error' : 'warning'"
            variant="subtle"
            size="lg"
          >
            <UIcon
              name="i-lucide-activity"
              class="me-1"
            />
            {{ upCount }} / {{ total }} services up
            <UTooltip
              v-if="upCount !== total"
              arrow
              :content="{ side: 'right' }"
            >
              <template #content>
                <div class="p-4">
                    <span v-for="service in servicesNotUp" :key="service.id">
                      {{ service.label }}{{ servicesNotUp.indexOf(service) !== servicesNotUp.length - 1 ? ', ' : '' }}
                    </span>
                </div>
              </template>
              <UIcon
                name="i-lucide-info"
                class="ms-1"
              />
            </UTooltip>
          </UBadge>
        </div>
      </div>
      <UButton
        label="Add service"
        color="primary"
        @click="openCreateModal"
      />
    </div>

    <USeparator />

    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between my-4">
      <UInput
        v-model="searchQuery"
        placeholder="Search services"
        icon="i-heroicons-magnifying-glass"
        class="md:max-w-sm"
      />

      <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <UCheckbox
          v-model="urlFilter"
          label="Has URL"
        />

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

        <USelectMenu
          v-model="tagFilter"
          :items="availableTags"
          value-key="value"
          multiple
          placeholder="Filter by tag"
          :disabled="availableTags.length === 0"
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

    <ClientOnly>
      <template #fallback>
        <ServiceCardSkeleton />
      </template>

      <ServiceCardSkeleton v-if="loading" />

      <template v-else>
        <div
          v-if="filteredServices.length > 0"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-4"
        >
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :service="service"
            :container="service.container"
            @edit="openEditModal"
            @delete="deleteService"
          />
        </div>
        <div
          v-else
          class="rounded-lg border border-default/20 bg-default/5 p-6 text-sm text-default/70"
        >
          No services match the current filters.
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>
