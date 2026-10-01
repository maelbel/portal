<script setup lang="ts">
import type { ServiceConfig } from '~/services.config'

const props = defineProps<{
  service: ServiceConfig
}>()

const host = computed(() => serviceHost(props.service))
const subtitle = computed(() => host.value ?? props.service.containers?.[0] ?? 'No web UI')
</script>

<template>
  <component
    :is="service.url ? 'a' : 'div'"
    :href="service.url"
    :target="service.url ? '_blank' : undefined"
    :rel="service.url ? 'noopener noreferrer' : undefined"
    class="group relative flex items-center gap-3 rounded-lg border p-3 transition"
    :class="service.url
      ? 'border-default bg-default hover:border-primary/60 hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary'
      : 'border-dashed border-default text-muted'"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-md bg-elevated transition-colors"
      :class="service.url ? 'text-highlighted group-hover:bg-primary/10 group-hover:text-primary' : ''"
    >
      <UIcon
        :name="serviceIcon(service)"
        class="size-5"
      />
    </span>

    <span class="min-w-0 flex-1">
      <span
        class="block truncate text-sm font-medium"
        :class="service.url ? 'text-highlighted' : ''"
      >
        {{ service.label }}
      </span>
      <span class="block truncate text-xs text-muted">{{ subtitle }}</span>
    </span>

    <UIcon
      v-if="service.url && isExternal(service)"
      name="i-lucide-arrow-up-right"
      class="size-4 shrink-0 text-dimmed group-hover:text-primary"
      aria-label="External service"
    />
  </component>
</template>
