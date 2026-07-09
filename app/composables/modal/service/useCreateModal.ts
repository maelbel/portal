import { useServicesStore } from '~/stores/services'

export const useCreateServiceModal = () => {
  const toast = useToast()
  const servicesStore = useServicesStore()

  const emptyForm = () => ({
    label: '',
    url: '',
    containerName: '',
    tags: ''
  })

  const isCreateModalOpen = ref(false)
  const newService = ref(emptyForm())

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

  return {
    isCreateModalOpen,
    newService,
    openCreateModal,
    closeCreateModal,
    createService,
  }
}
