export interface ServiceConfig {
  label: string
  url?: string
  containerName?: string
  tags: string[]
}

export const services: ServiceConfig[] = [
  { label: 'Adguard Home', url: 'https://adguard.maelbelliard.fr', containerName: 'adguardhome', tags: ['internal', 'docker'] },
  { label: 'Affine', url: 'https://affine.maelbelliard.fr', tags: ['internal', 'docker'] },
  { label: 'Authentik', url: 'https://authentik.maelbelliard.fr', containerName: 'authentik-server', tags: ['internal', 'docker'] },
  { label: 'authentik-postgresql', containerName: 'authentik-postgresql', tags: ['internal', 'docker'] },
  { label: 'authentik-redis', containerName: 'authentik-redis', tags: ['internal', 'docker'] },
  { label: 'authentik-worker', containerName: 'authentik-worker', tags: ['internal', 'docker'] },
  { label: 'Beszel', url: 'https://beszel.maelbelliard.fr', containerName: 'beszel', tags: ['internal', 'docker'] },
  { label: 'beszel-agent', containerName: 'beszel-agent', tags: ['internal', 'docker'] },
  { label: 'Home Assistant', url: 'https://ha.maelbelliard.fr', containerName: 'homeassistant', tags: ['internal', 'docker'] },
  { label: 'Mosquitto', containerName: 'mosquitto', tags: ['internal', 'docker'] },
  { label: 'Obsidian', url: 'https://obsidian.maelbelliard.fr', containerName: 'obsidian', tags: ['internal', 'docker'] },
  { label: 'OVH', url: 'https://manager.eu.ovhcloud.com/#/hub/', tags: ['external'] },
  { label: 'Paperless', url: 'https://paperless.maelbelliard.fr', tags: ['internal', 'docker'] },
  { label: 'Portal', url: 'https://portal.maelbelliard.fr', containerName: 'portal', tags: ['internal', 'docker'] },
  { label: 'Raspberrypi.com', url: 'https://connect.raspberrypi.com/devices', tags: ['external'] },
  { label: 'Tailscale', url: 'https://login.tailscale.com/admin/machines', tags: ['external'] },
  { label: 'Traefik', url: 'https://traefik.maelbelliard.fr', containerName: 'traefik', tags: ['internal', 'docker'] },
  { label: 'Uptime Kuma', url: 'https://uptime.maelbelliard.fr', containerName: 'uptime-kuma', tags: ['internal', 'docker'] },
  { label: 'Zigbee2mqtt', url: 'https://zigbee.maelbelliard.fr', containerName: 'zigbee2mqtt', tags: ['internal', 'docker'] }
]
