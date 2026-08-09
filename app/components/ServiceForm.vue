<script setup lang="ts">
import type { ServiceFormValue } from '~/composables/modal/service/useCreateModal'

const props = defineProps<{
  modelValue: ServiceFormValue
  title: string
  submitLabel?: string
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ServiceFormValue): void
  (event: 'submit' | 'cancel'): void
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
</script>

<template>
  <UModal
    :title="title"
    :open="true"
    @update:open="emit('cancel')"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          label="Label"
          required
        >
          <UInput
            v-model="localValue.label"
            placeholder="Example service"
            class="w-full"
          />
        </UFormField>
        <UFormField label="URL">
          <UInput
            v-model="localValue.url"
            placeholder="https://example.com"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Container name">
          <UInput
            v-model="localValue.containerName"
            placeholder="my-container"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Tags">
          <UInput
            v-model="localValue.tags"
            placeholder="docker, internal"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancel"
          @click="emit('cancel')"
        />
        <UButton
          :label="submitLabel || 'Save'"
          @click="emit('submit')"
        />
      </div>
    </template>
  </UModal>
</template>
