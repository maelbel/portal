export interface ServiceConfig {
  label: string
  url?: string
  // Iconify name, e.g. 'i-simple-icons-grafana'. Falls back to the category icon.
  icon?: string
  containers?: string[]
  tags: string[]
}

// Copy this file to `services.config.ts` and list your own services.
// `services.config.ts` is gitignored so your real URLs/hostnames never leave your machine.
export const services: ServiceConfig[] = [
  { label: 'Adguard Home', icon: 'i-simple-icons-adguard', url: 'https://adguard.example.internal', containers: ['adguardhome'], tags: ['internal', 'network'] },
  { label: 'Nextcloud', icon: 'i-simple-icons-nextcloud', url: 'https://nextcloud.example.internal', containers: ['nextcloud', 'nextcloud-db', 'nextcloud-redis'], tags: ['internal', 'productivity'] },
  { label: 'Grafana', icon: 'i-simple-icons-grafana', url: 'https://grafana.example.internal', containers: ['grafana'], tags: ['internal', 'monitoring'] },
  { label: 'Traefik', icon: 'i-simple-icons-traefikproxy', url: 'https://traefik.example.internal', containers: ['traefik'], tags: ['internal', 'network'] },
  { label: 'OVH', icon: 'i-simple-icons-ovh', url: 'https://manager.eu.ovhcloud.com/#/hub/', tags: ['external', 'infra'] }
]
