import type { ServiceConfig } from '~/services.config'

const STORAGE_KEY = 'portal:favorites'

// Favorites are per-browser: the page is prerendered and has no backend,
// so they live in localStorage and are hydrated on the client.
export const useFavorites = () => {
  const favorites = useState<string[]>('favorites', () => [])
  const loaded = useState('favorites-loaded', () => false)

  onMounted(() => {
    if (loaded.value) return
    loaded.value = true
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      if (Array.isArray(stored)) favorites.value = stored.filter(item => typeof item === 'string')
    } catch {
      // Storage unavailable or corrupted: start with no favorites.
    }
  })

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch {
      // Storage unavailable: favorites only last for this visit.
    }
  }

  const isFavorite = (service: ServiceConfig) => favorites.value.includes(service.label)

  const toggleFavorite = (service: ServiceConfig) => {
    favorites.value = isFavorite(service)
      ? favorites.value.filter(label => label !== service.label)
      : [...favorites.value, service.label]
    persist()
  }

  return { favorites, isFavorite, toggleFavorite }
}
