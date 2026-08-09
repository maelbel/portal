<script setup lang="ts">
import type { ServiceWithTags } from '~/stores/services'

const props = defineProps<{
  service: ServiceWithTags
  onEdit?: (service: ServiceWithTags) => void
  onDelete?: (service: ServiceWithTags) => void
}>()

const emit = defineEmits<{
  edit: [service: ServiceWithTags]
  delete: [service: ServiceWithTags]
}>()

const handleEdit = () => {
  emit('edit', props.service)
}

const handleDelete = () => {
  emit('delete', props.service)
}
</script>

<template>
  <div class="h-full">
    <UCard :ui="{ root: 'h-full' }">
      <template #header>
        <div class="flex justify-between items-center gap-2">
          <ULink
            :to="service.url ?? undefined"
            :external="Boolean(service.url?.startsWith('http'))"
            :target="'_blank'"
            class="text-left flex-1 min-w-0"
          >
            <span class="font-semibold">{{ service.label }}</span>
          </ULink>
          <div
            class="flex items-center gap-1"
            @click.stop.prevent
          >
            <ServiceActions
              :service="service"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>
        </div>
        <div
          v-if="service.tags?.length"
          class="mt-1 flex gap-1"
        >
          <UBadge
            v-for="tag in service.tags"
            :key="tag.label"
            :label="tag.label"
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
