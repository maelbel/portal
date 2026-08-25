<script setup lang="ts">
import type { ServiceConfig } from '~/services.config'

type TagColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const TAG_COLORS: Record<string, TagColor> = {
  external: 'warning',
  internal: 'neutral',
  auth: 'error',
  finance: 'success',
  home: 'secondary',
  infra: 'primary',
  monitoring: 'info',
  network: 'primary',
  productivity: 'secondary'
}

defineProps<{
  service: ServiceConfig
}>()
</script>

<template>
  <ULink
    :to="service.url ?? undefined"
    :external="Boolean(service.url?.startsWith('http'))"
    target="_blank"
    class="block h-full"
    :class="service.url ? 'cursor-pointer' : 'cursor-default'"
  >
    <UCard
      class="h-full transition-colors"
      :class="service.url ? 'hover:border-primary/50' : ''"
      :ui="{ root: 'h-full' }"
    >
      <template #header>
        <span class="font-semibold">{{ service.label }}</span>
        <div
          v-if="service.tags?.length"
          class="mt-1 flex gap-1"
        >
          <UBadge
            v-for="tag in service.tags"
            :key="tag"
            :label="tag"
            variant="outline"
            :color="TAG_COLORS[tag] ?? 'primary'"
          />
        </div>
      </template>
    </UCard>
  </ULink>
</template>
