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

const { isFavorite } = useFavorites()

const favoriteServices = computed(() =>
  visibleServices.value
    .filter(isFavorite)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
)

const groups = computed(() => groupServices(visibleServices.value))

// Enter in the filter opens the first match, so the page itself works as a launcher.
const openFirstMatch = () => {
  const first = [...favoriteServices.value, ...groups.value.flatMap(group => group.services)].find(service => service.url)
  if (first?.url) window.open(first.url, '_blank', 'noopener')
}

const resetFilters = () => {
  searchQuery.value = ''
  showHeadless.value = false
}
</script>

<template>
  <UContainer class="pt-10 pb-16 sm:pt-16 sm:pb-26">
    <div class="mb-10 grid gap-4">
      <div class="flex items-baseline justify-between gap-4">
        <span class="eyebrow text-primary">Homelab</span>
        <span class="font-mono text-xs text-muted">{{ services.length }} services</span>
      </div>
      <h1 class="text-4xl font-medium tracking-[-0.01em] text-highlighted text-balance sm:text-5xl">
        Everything running at home, one click away.
      </h1>
    </div>

    <div class="mb-16 flex flex-col gap-4 border-y border-default py-4 sm:flex-row sm:items-center sm:justify-between">
      <UInput
        ref="searchInput"
        v-model="searchQuery"
        placeholder="Filter services"
        aria-label="Filter services"
        icon="i-lucide-list-filter"
        size="lg"
        variant="outline"
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

    <section
      v-if="favoriteServices.length"
      aria-labelledby="group-favorites"
      class="mb-16"
    >
      <h2
        id="group-favorites"
        class="mb-4 flex items-center gap-2 border-t border-primary pt-4 text-primary"
      >
        <UIcon
          name="i-lucide-star"
          class="size-4"
        />
        <span class="eyebrow">favorites</span>
        <span class="ms-auto font-mono text-xs text-dimmed">{{ String(favoriteServices.length).padStart(2, '0') }}</span>
      </h2>

      <div class="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceTile
          v-for="service in favoriteServices"
          :key="service.label"
          :service="service"
        />
      </div>
    </section>

    <div
      v-if="groups.length"
      class="gap-x-6 sm:columns-2 lg:columns-3"
    >
      <section
        v-for="group in groups"
        :key="group.name"
        :aria-labelledby="`group-${group.name}`"
        class="mb-10 break-inside-avoid"
      >
        <h2
          :id="`group-${group.name}`"
          class="mb-4 flex items-center gap-2 border-t border-default pt-4 text-muted"
        >
          <UIcon
            :name="group.icon"
            class="size-4"
          />
          <span class="eyebrow">{{ group.name }}</span>
          <span class="ms-auto font-mono text-xs text-dimmed">{{ String(group.services.length).padStart(2, '0') }}</span>
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

    <footer class="mt-16 flex items-end justify-between gap-4">
      <AppGradin />
      <span class="font-mono text-xs text-dimmed">maelbelliard.fr</span>
    </footer>
  </UContainer>
</template>
