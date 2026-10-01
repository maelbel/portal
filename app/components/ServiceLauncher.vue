<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { services } from '~/services.config'

const open = useState('launcher-open', () => false)

defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  }
})

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() =>
  groupServices(services.filter(service => service.url)).map(group => ({
    id: group.name,
    label: capitalize(group.name),
    items: group.services.map(service => ({
      label: service.label,
      suffix: serviceHost(service),
      icon: serviceIcon(service),
      to: service.url,
      target: '_blank',
      onSelect: () => {
        open.value = false
      }
    }))
  }))
)
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
