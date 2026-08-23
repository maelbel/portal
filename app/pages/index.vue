<script setup lang="ts">
import { services } from '~/services.config'

const DEFAULT_TAG = 'all'

const searchQuery = ref('')
const activeTag = ref(DEFAULT_TAG)
const urlFilter = ref<boolean>(true)

const hasCustomFilters = computed(() =>
  searchQuery.value.trim() !== ''
  || urlFilter.value !== true
  || activeTag.value !== DEFAULT_TAG
)

const resetFilters = () => {
  searchQuery.value = ''
  activeTag.value = DEFAULT_TAG
  urlFilter.value = true
}

const availableTags = computed(() => {
  const tagSet = new Set<string>()
  for (const service of services) {
    for (const tag of service.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
})

const servicesMatchingSearch = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return services.filter((service) => {
    const matchesQuery = !query
      || service.label.toLowerCase().includes(query)
      || (service.url ?? '').toLowerCase().includes(query)
      || (service.containers ?? []).some(container => container.toLowerCase().includes(query))
    const hasUrl = urlFilter.value ? service.url : true

    return matchesQuery && hasUrl
  })
})

const tabItems = computed(() => [
  { label: 'All', value: 'all', badge: servicesMatchingSearch.value.length },
  ...availableTags.value.map(tag => ({
    label: tag[0].toUpperCase() + tag.slice(1),
    value: tag,
    badge: servicesMatchingSearch.value.filter(service => service.tags.includes(tag)).length
  }))
])

const filteredServices = computed(() => {
  const filtered = servicesMatchingSearch.value.filter(service =>
    activeTag.value === 'all' || service.tags.includes(activeTag.value)
  )

  return [...filtered].sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
})
</script>

<template>
  <UContainer>
    <div class="my-4 space-y-3">
      <UTabs
        v-model="activeTag"
        :items="tabItems"
        :content="false"
        size="sm"
        :ui="{ list: 'overflow-x-auto', trigger: 'shrink-0 grow-0' }"
      />

      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <UInput
          v-model="searchQuery"
          placeholder="Search services"
          aria-label="Search services"
          icon="i-heroicons-magnifying-glass"
          class="md:max-w-sm"
        >
          <template
            v-if="searchQuery"
            #trailing
          >
            <UButton
              icon="i-lucide-x"
              aria-label="Clear search"
              variant="link"
              color="neutral"
              size="xs"
              :padded="false"
              @click="searchQuery = ''"
            />
          </template>
        </UInput>

        <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <UCheckbox
            v-model="urlFilter"
            label="Has URL"
          />

          <UButton
            v-if="hasCustomFilters"
            label="Reset filters"
            icon="i-lucide-rotate-ccw"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="resetFilters"
          />
        </div>
      </div>
    </div>

    <div
      v-if="filteredServices.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start mt-4"
    >
      <ServiceCard
        v-for="service in filteredServices"
        :key="service.label"
        :service="service"
      />
    </div>
    <div
      v-else
      class="flex flex-col items-center gap-3 rounded-lg border border-default/20 bg-default/5 p-6 text-sm text-default/70"
    >
      <span>No services match the current filters.</span>
      <UButton
        v-if="hasCustomFilters"
        label="Reset filters"
        icon="i-lucide-rotate-ccw"
        variant="soft"
        color="neutral"
        size="sm"
        @click="resetFilters"
      />
    </div>
  </UContainer>
</template>
