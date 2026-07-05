import { useServicesStore } from '~/stores/services'

export const useServiceModal = () => {
  const toast = useToast()
  const servicesStore = useServicesStore()

  const emptyForm = () => ({
    label: '',
    url: '',
    containerName: '',
    tags: ''
  })

  const isCreateModalOpen = ref(false)
  const isEditModalOpen = ref(false)
  const editingServiceId = ref<number | null>(null)
  const newService = ref(emptyForm())
  const editingService = ref(emptyForm())

  const parseTags = (value: string) => value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  const openCreateModal = () => {
    newService.value = emptyForm()
    isCreateModalOpen.value = true
  }

  const closeCreateModal = () => {
    isCreateModalOpen.value = false
    newService.value = emptyForm()
  }

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

  const createService = async () => {
    if (!newService.value.label.trim()) {
      toast.add({ title: 'Missing fields', description: 'Label is required.', color: 'error' })
      return
    }

    try {
      await servicesStore.createService({
        label: newService.value.label.trim(),
        url: newService.value.url.trim(),
        containerName: newService.value.containerName.trim() || null,
        tags: parseTags(newService.value.tags)
      })

      toast.add({ title: 'Service created', description: 'The new service has been saved.', color: 'success' })
      closeCreateModal()
    } catch {
      toast.add({ title: 'Creation failed', description: 'The service could not be saved.', color: 'error' })
    }
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
    isCreateModalOpen,
    isEditModalOpen,
    newService,
    editingService,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    createService,
    updateService
  }
}
