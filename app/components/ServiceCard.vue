<script setup lang="ts">
import type { ServiceConfig } from '~/services.config'

const TAG_COLORS: Record<string, string> = {
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

const isExpanded = ref(false)
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
      :ui="{ root: 'h-full', body: 'p-0 sm:p-0' }"
    >
      <template #header>
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
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
          </div>

          <UButton
            v-if="service.containers?.length"
            icon="i-lucide-container"
            :trailing-icon="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            :label="String(service.containers.length)"
            :aria-label="isExpanded ? 'Hide containers' : 'Show containers'"
            color="neutral"
            variant="ghost"
            size="xs"
            class="shrink-0"
            @click.stop.prevent="isExpanded = !isExpanded"
          />
        </div>
      </template>

      <div
        v-if="isExpanded && service.containers?.length"
        class="p-4 sm:p-6"
      >
        <ul class="space-y-1">
          <li
            v-for="container in service.containers"
            :key="container"
            class="text-xs font-mono text-muted truncate"
          >
            {{ container }}
          </li>
        </ul>
      </div>
    </UCard>
  </ULink>
</template>
