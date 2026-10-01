import type { ServiceConfig } from '~/services.config'

// Tags describing where a service lives rather than what it does.
// Every other tag is treated as the service's category.
const SCOPE_TAGS = new Set(['internal', 'external'])

const FALLBACK_GROUP = 'other'

const GROUP_ICONS: Record<string, string> = {
  auth: 'i-lucide-shield-check',
  finance: 'i-lucide-wallet',
  home: 'i-lucide-house',
  infra: 'i-lucide-server',
  monitoring: 'i-lucide-activity',
  network: 'i-lucide-network',
  productivity: 'i-lucide-briefcase',
  [FALLBACK_GROUP]: 'i-lucide-box'
}

export interface ServiceGroup {
  name: string
  icon: string
  services: ServiceConfig[]
}

export const serviceGroup = (service: ServiceConfig) =>
  service.tags.find(tag => !SCOPE_TAGS.has(tag)) ?? FALLBACK_GROUP

export const groupIcon = (group: string) => GROUP_ICONS[group] ?? GROUP_ICONS[FALLBACK_GROUP]!

export const serviceIcon = (service: ServiceConfig) => service.icon ?? groupIcon(serviceGroup(service))

export const isExternal = (service: ServiceConfig) => service.tags.includes('external')

export const serviceHost = (service: ServiceConfig) => {
  if (!service.url) return undefined
  try {
    return new URL(service.url).host
  } catch {
    return service.url
  }
}

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export const groupServices = (services: ServiceConfig[]): ServiceGroup[] => {
  const groups = new Map<string, ServiceConfig[]>()
  for (const service of services) {
    const name = serviceGroup(service)
    groups.set(name, [...(groups.get(name) ?? []), service])
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === FALLBACK_GROUP) return 1
      if (b === FALLBACK_GROUP) return -1
      return a.localeCompare(b)
    })
    .map(([name, items]) => ({
      name,
      icon: groupIcon(name),
      services: [...items].sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
    }))
}
