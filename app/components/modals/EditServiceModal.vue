<script setup lang="ts">
const toast = useToast()

const emptyForm = () => ({
  label: '',
  url: '',
  containerName: '',
  tags: ''
})

const isEditModalOpen = ref(false)
const editingService = ref(emptyForm())
const editingServiceId = ref<number | null>(null)

const openEditModal = (service: Record<string, any>) => {
  editingServiceId.value = service.id
  editingService.value = {
    label: service.label,
    url: service.url,
    containerName: service.containerName || '',
    tags: service.tags?.map((tag: Record<string, any>) => tag.label).join(', ') || ''
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingServiceId.value = null
  editingService.value = emptyForm()
}

const updateService = async () => {
  if (!editingServiceId.value) return

  if (!editingService.value.label.trim()) {
    toast.add({ title: 'Missing fields', description: 'Label is required.', color: 'error' })
    return
  }

  try {
    await servicesStore.updateService(editingServiceId.value, {
      label: editingService.value.label.trim(),
      url: editingService.value.url.trim(),
      containerName: editingService.value.containerName.trim() || null,
      tags: parseTags(editingService.value.tags)
    })

    toast.add({ title: 'Service updated', description: 'The service has been updated.', color: 'success' })
    closeEditModal()
  } catch {
    toast.add({ title: 'Update failed', description: 'The service could not be updated.', color: 'error' })
  }
}
</script>

<template>
  <ServiceForm
    v-if="isEditModalOpen"
    v-model="editingService"
    title="Edit service"
    submit-label="Update"
    @submit="updateService"
    @cancel="closeEditModal"
  />
</template>