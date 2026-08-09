<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  service: Record<string, any>
}>()

const emit = defineEmits<{
  edit: [service: Record<string, any>]
  delete: [service: Record<string, any>]
}>()

const items: DropdownMenuItem[] = [
  {
    label: 'Edit',
    icon: 'i-lucide-pencil',
    onSelect: () => emit('edit', props.service)
  },
  {
    label: 'Delete',
    icon: 'i-lucide-trash-2',
    color: 'error',
    onSelect: () => emit('delete', props.service)
  }
]
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{
      align: 'start',
      side: 'right'
    }"
  >
    <template #default>
      <UButton
        icon="i-lucide-ellipsis"
        color="neutral"
        variant="ghost"
        size="sm"
        @click.stop.prevent
      />
    </template>
  </UDropdownMenu>
</template>
