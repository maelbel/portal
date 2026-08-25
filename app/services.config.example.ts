export interface ServiceConfig {
  label: string
  url?: string
  containers?: string[]
  tags: string[]
}

// Copy this file to `services.config.ts` and list your own services.
// `services.config.ts` is gitignored so your real URLs/hostnames never leave your machine.
export const services: ServiceConfig[] = [
  { label: 'Adguard Home', url: 'https://adguard.example.internal', containers: ['adguardhome'], tags: ['internal', 'network'] },
  { label: 'Nextcloud', url: 'https://nextcloud.example.internal', containers: ['nextcloud', 'nextcloud-db', 'nextcloud-redis'], tags: ['internal', 'productivity'] },
  { label: 'Grafana', url: 'https://grafana.example.internal', containers: ['grafana'], tags: ['internal', 'monitoring'] },
  { label: 'Traefik', url: 'https://traefik.example.internal', containers: ['traefik'], tags: ['internal', 'network'] },
  { label: 'OVH', url: 'https://manager.eu.ovhcloud.com/#/hub/', tags: ['external', 'infra'] }
]
