<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { services, type ServiceConfig } from '~/services.config'

const open = useState('launcher-open', () => false)

defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  }
})

const { isFavorite } = useFavorites()

const toItem = (service: ServiceConfig): CommandPaletteItem => ({
  label: service.label,
  suffix: serviceHost(service),
  icon: serviceIcon(service),
  to: service.url,
  target: '_blank',
  onSelect: () => {
    open.value = false
  }
})

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  const launchable = services.filter(service => service.url)
  const favorites = launchable
    .filter(isFavorite)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))

  return [
    // Distinct ids so a favorite can appear both here and in its category.
    ...(favorites.length
      ? [{ id: 'favorites', label: 'Favorites', items: favorites.map(service => ({ ...toItem(service), id: `favorite-${service.label}` })) }]
      : []),
    ...groupServices(launchable).map(group => ({
      id: group.name,
      label: capitalize(group.name),
      items: group.services.map(toItem)
    }))
  ]
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Open a service"
    description="Search services and open one in a new tab"
    :ui="{ content: 'sm:max-w-xl' }"
  >
    <template #content>
      <UCommandPalette
        :groups="groups"
        placeholder="Open a service…"
        :close="true"
        class="max-h-[min(28rem,70vh)]"
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
