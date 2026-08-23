<script setup lang="ts">
import { services } from '~/services.config'

const searchQuery = ref('')
const tagFilter = ref<string[]>(['internal'])
const urlFilter = ref<boolean>(true)

const availableTags = computed(() => {
  const tagSet = new Set<string>()
  for (const service of services) {
    for (const tag of service.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet)
    .sort((a, b) => a.localeCompare(b))
    .map(label => ({ label, value: label }))
})

const filteredServices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const selectedTags = tagFilter.value

  const filtered = services.filter((service) => {
    const serviceName = service.label.toLowerCase()
    const serviceUrl = (service.url ?? '').toLowerCase()

    const matchesQuery = !query || serviceName.includes(query) || serviceUrl.includes(query)
    const matchesTags = selectedTags.length === 0
      || selectedTags.every(tag => service.tags.includes(tag))
    const hasUrl = urlFilter.value ? service.url : true

    return matchesQuery && matchesTags && hasUrl
  })

  const sorted = [...filtered]
  sorted.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))

  return sorted
})
</script>

<template>
  <UContainer>
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

        <USelectMenu
          v-model="tagFilter"
          :items="availableTags"
          value-key="value"
          multiple
          placeholder="Filter by tag"
          :disabled="availableTags.length === 0"
        />
      </div>
    </div>

    <div
      v-if="filteredServices.length > 0"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mt-4"
    >
      <ServiceCard
        v-for="service in filteredServices"
        :key="service.label"
        :service="service"
      />
    </div>
    <div
      v-else
      class="rounded-lg border border-default/20 bg-default/5 p-6 text-sm text-default/70"
    >
      No services match the current filters.
    </div>
  </UContainer>
</template>
