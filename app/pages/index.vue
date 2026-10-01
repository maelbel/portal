<script setup lang="ts">
import { services } from '~/services.config'

const searchQuery = ref('')
const showHeadless = ref(false)
const searchInput = useTemplateRef('searchInput')

const headlessCount = services.filter(service => !service.url).length

defineShortcuts({
  '/': () => searchInput.value?.inputRef?.focus()
})

const visibleServices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return services.filter((service) => {
    if (!showHeadless.value && !service.url) return false
    if (!query) return true

    return [service.label, service.url ?? '', ...service.tags]
      .some(value => value.toLowerCase().includes(query))
  })
})

const groups = computed(() => groupServices(visibleServices.value))

// Enter in the filter opens the first match, so the page itself works as a launcher.
const openFirstMatch = () => {
  const first = groups.value.flatMap(group => group.services).find(service => service.url)
  if (first?.url) window.open(first.url, '_blank', 'noopener')
}

const resetFilters = () => {
  searchQuery.value = ''
  showHeadless.value = false
}
</script>

<template>
  <UContainer class="py-6 sm:py-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UInput
        ref="searchInput"
        v-model="searchQuery"
        placeholder="Filter services"
        aria-label="Filter services"
        icon="i-lucide-list-filter"
        size="lg"
        variant="soft"
        class="w-full sm:max-w-sm"
        @keydown.enter="openFirstMatch"
        @keydown.esc="searchQuery = ''"
      >
        <template #trailing>
          <UButton
            v-if="searchQuery"
            icon="i-lucide-x"
            aria-label="Clear filter"
            variant="link"
            color="neutral"
            size="xs"
            @click="searchQuery = ''"
          />
          <UKbd
            v-else
            value="/"
          />
        </template>
      </UInput>

      <USwitch
        v-if="headlessCount"
        v-model="showHeadless"
        :label="`Show background services (${headlessCount})`"
        size="sm"
      />
    </div>

    <div
      v-if="groups.length"
      class="gap-x-6 sm:columns-2 lg:columns-3"
    >
      <section
        v-for="group in groups"
        :key="group.name"
        :aria-labelledby="`group-${group.name}`"
        class="mb-8 break-inside-avoid"
      >
        <h2
          :id="`group-${group.name}`"
          class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"
        >
          <UIcon
            :name="group.icon"
            class="size-4"
          />
          {{ group.name }}
          <span class="font-normal text-dimmed">{{ group.services.length }}</span>
        </h2>

        <div class="flex flex-col gap-2">
          <ServiceTile
            v-for="service in group.services"
            :key="service.label"
            :service="service"
          />
        </div>
      </section>
    </div>

    <UEmpty
      v-else
      icon="i-lucide-search-x"
      title="No services match"
      :description="searchQuery ? `Nothing matches “${searchQuery}”.` : 'No services to show.'"
      :actions="[{ label: 'Reset filters', icon: 'i-lucide-rotate-ccw', color: 'neutral', variant: 'subtle', onClick: resetFilters }]"
    />
  </UContainer>
</template>
