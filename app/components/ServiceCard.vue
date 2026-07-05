<script setup lang="ts">
const props = defineProps<{
  service: Record<string, any>
  container?: Record<string, any>
  onEdit?: (service: Record<string, any>) => void
  onDelete?: (service: Record<string, any>) => void
}>()

const emit = defineEmits<{
  edit: [service: Record<string, any>]
  delete: [service: Record<string, any>]
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
            :to="service.url"
            :external="Boolean(service.url?.startsWith('http'))"
            :target="'_blank'"
            class="text-left flex-1 min-w-0"
          >
            <span class="font-semibold">{{ service.label }}</span>
          </ULink>
          <div class="flex items-center gap-1" @click.stop.prevent>
            <Ping :state="service.state" />
            <ServiceActions :service="service" @edit="handleEdit" @delete="handleDelete" />
          </div>
        </div>
        <div v-if="service.tags?.length" class="mt-1 flex gap-1">
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
        :to="service.url"
        :external="Boolean(service.url?.startsWith('http'))"
        :target="'_blank'"
        class="block w-full text-left"
      >
        <div v-if="service.url" class="grid grid-cols-[1fr_auto] justify-between items-center text-muted">
          <p class="text-sm truncate">{{ service.url }}</p>
          <p class="text-xs ms-4">{{ service.reachable }}</p>
        </div>
        <div v-if="service.containerName" class="grid grid-cols-[1fr_auto] justify-between items-center text-muted">
          <p class="text-sm truncate">{{ service.containerName }}</p>
          <p class="text-xs ms-4">{{ container?.status || 'unknown' }}</p>
        </div>
      </ULink>
    </UCard>
  </div>
</template>
