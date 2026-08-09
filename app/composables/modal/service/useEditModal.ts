import type { ServiceWithTags } from '~/stores/services'
import { useServicesStore } from '~/stores/services'

export const useEditServiceModal = () => {
  const toast = useToast()
  const servicesStore = useServicesStore()

  const emptyForm = () => ({
    label: '',
    url: '',
    containerName: '',
    tags: ''
  })

  const isEditModalOpen = ref(false)
  const editingServiceId = ref<number | null>(null)
  const editingService = ref(emptyForm())

  const parseTags = (value: string) => value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  const openEditModal = (service: ServiceWithTags) => {
    editingServiceId.value = service.id
    editingService.value = {
      label: service.label,
      url: service.url ?? '',
      containerName: service.containerName || '',
      tags: service.tags.map(tag => tag.label).join(', ')
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

  return {
    isEditModalOpen,
    editingService,
    openEditModal,
    closeEditModal,
    updateService
  }
}
