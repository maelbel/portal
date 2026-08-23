<script setup lang="ts">
import type { ServiceConfig } from '~/services.config'

defineProps<{
  service: ServiceConfig
}>()
</script>

<template>
  <div class="h-full">
    <UCard :ui="{ root: 'h-full' }">
      <template #header>
        <ULink
          :to="service.url ?? undefined"
          :external="Boolean(service.url?.startsWith('http'))"
          :target="'_blank'"
          class="text-left flex-1 min-w-0"
        >
          <span class="font-semibold">{{ service.label }}</span>
        </ULink>
        <div
          v-if="service.tags?.length"
          class="mt-1 flex gap-1"
        >
          <UBadge
            v-for="tag in service.tags"
            :key="tag"
            :label="tag"
            variant="outline"
            color="primary"
          />
        </div>
      </template>
      <ULink
        :to="service.url ?? undefined"
        :external="Boolean(service.url?.startsWith('http'))"
        :target="'_blank'"
        class="block w-full text-left"
      >
        <div
          v-if="service.url"
          class="grid grid-cols-[1fr_auto] justify-between items-center text-muted"
        >
          <p class="text-sm truncate">{{ service.url }}</p>
        </div>
        <div
          v-if="service.containerName"
          class="grid grid-cols-[1fr_auto] justify-between items-center text-muted"
        >
          <p class="text-sm truncate">{{ service.containerName }}</p>
        </div>
      </ULink>
    </UCard>
  </div>
</template>
