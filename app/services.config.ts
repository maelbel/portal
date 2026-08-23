export interface ServiceConfig {
  label: string
  url?: string
  containers?: string[]
  tags: string[]
}

export const services: ServiceConfig[] = [
  { label: 'Adguard Home', url: 'https://adguard.maelbelliard.fr', containers: ['adguardhome'], tags: ['internal', 'network'] },
  { label: 'Affine', url: 'https://affine.maelbelliard.fr', containers: ['affine_server', 'affine_postgres', 'affine_redis'], tags: ['internal', 'productivity'] },
  { label: 'Authentik', url: 'https://authentik.maelbelliard.fr', containers: ['authentik-server', 'authentik-postgresql', 'authentik-redis', 'authentik-worker'], tags: ['internal', 'auth'] },
  { label: 'Beszel', url: 'https://beszel.maelbelliard.fr', containers: ['beszel', 'beszel-agent'], tags: ['internal', 'monitoring'] },
  { label: 'Croesus', url: 'https://croesus.maelbelliard.fr', containers: ['croesus-frontend'], tags: ['internal', 'finance'] },
  { label: 'Croesus API', url: 'https://croesus-api.maelbelliard.fr', containers: ['croesus-backend', 'croesus-postgres'], tags: ['internal', 'finance'] },
  { label: 'Ghostfolio', url: 'https://gf.maelbelliard.fr', containers: ['ghostfolio', 'gf-postgres', 'gf-redis'], tags: ['internal', 'finance'] },
  { label: 'Grafana', url: 'https://grafana.maelbelliard.fr', containers: ['grafana'], tags: ['internal', 'monitoring'] },
  { label: 'Home Assistant', url: 'https://ha.maelbelliard.fr', containers: ['homeassistant'], tags: ['internal', 'home'] },
  { label: 'InfluxDB', url: 'https://influxdb.maelbelliard.fr', containers: ['influxdb'], tags: ['internal', 'monitoring'] },
  { label: 'Mosquitto', containers: ['mosquitto'], tags: ['internal', 'home'] },
  { label: 'Nextcloud', url: 'https://nextcloud.maelbelliard.fr', containers: ['nextcloud', 'nextcloud-cron', 'nextcloud-db', 'nextcloud-redis'], tags: ['internal', 'productivity'] },
  { label: 'Obsidian', url: 'https://obsidian.maelbelliard.fr', containers: ['obsidian'], tags: ['internal', 'productivity'] },
  { label: 'OVH', url: 'https://manager.eu.ovhcloud.com/#/hub/', tags: ['external', 'infra'] },
  { label: 'Paperless', url: 'https://paperless.maelbelliard.fr', containers: ['paperless-ngx', 'paperless-db', 'paperless-gotenberg', 'paperless-redis', 'paperless-tika'], tags: ['internal', 'productivity'] },
  { label: 'Portal', url: 'https://portal.maelbelliard.fr', containers: ['portal'], tags: ['internal', 'infra'] },
  { label: 'Raspberrypi.com', url: 'https://connect.raspberrypi.com/devices', tags: ['external', 'infra'] },
  { label: 'Tailscale', url: 'https://login.tailscale.com/admin/machines', tags: ['external', 'network'] },
  { label: 'Telegraf', containers: ['telegraf'], tags: ['internal', 'monitoring'] },
  { label: 'Traefik', url: 'https://traefik.maelbelliard.fr', containers: ['traefik'], tags: ['internal', 'network'] },
  { label: 'Uptime Kuma', url: 'https://uptime.maelbelliard.fr', containers: ['uptime-kuma'], tags: ['internal', 'monitoring'] },
  { label: 'Zigbee2mqtt', url: 'https://zigbee.maelbelliard.fr', containers: ['zigbee2mqtt'], tags: ['internal', 'home'] }
]
