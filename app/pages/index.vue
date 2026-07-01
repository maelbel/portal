<script setup>
const { data: containers } = await useFetch("/api/containers")

const buildURL = (subdomain) => {
  return `https://${subdomain}.maelbelliard.fr`
}

const links = [
  {
    label: 'traefik',
    tag: ['docker'],
    to: buildURL('traefik'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "traefik")
  },
  {
    label: 'homeassistant',
    tag: ['docker'],
    to: buildURL('ha'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "homeassistant")
  },
  {
    label: 'portail',
    tag: ['docker'],
    to: buildURL('portail'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "portail")
  },
  {
    label: 'beszel',
    tag: ['docker'],
    to: buildURL('beszel'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "beszel")
  },
  {
    label: 'beszel-agent',
    tag: ['docker'],
    container: containers.value?.find(c => c.name === "beszel-agent")
  },
  {
    label: 'uptime-kuma',
    tag: ['docker'],
    to: buildURL('uptime'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "uptime-kuma")
  },
  {
    label: 'zigbee2mqtt',
    tag: ['docker'],
    to: buildURL('zigbee'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "zigbee2mqtt")
  },
  {
    label: 'portainer',
    tag: ['docker'],
    to: buildURL('portainer'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "portainer")
  },
  {
    label: 'adguardhome',
    tag: ['docker'],
    to: buildURL('adguard'),
    external: true,
    target: '_blank',
    container: containers.value?.find(c => c.name === "adguardhome")
  },
  {
    label: 'mosquitto',
    tag: ['docker'],
    container: containers.value?.find(c => c.name === "mosquitto")
  },
  {
    label: 'tailscale',
    to: "https://login.tailscale.com/",
    external: true,
    target: '_blank',
  },
  {
    label: 'freebox',
    to: "http://mafreebox.freebox.fr/",
    external: true,
    target: '_blank',
  },
]
</script>

<template>
  <UContainer>
    <h1 class="text-2xl font-bold my-6">
      Links
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ULink
        v-for="link in links"
        :key="link.label"
        :to="link.to"
        :external="link.external"
        :target="link.target"
        class="text-left"
      >
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-semibold">
                {{ link.label }}
              </span>
              <Ping :state="link.state === 'running' ? 'up' : 'down'" />
            </div>
            <div v-if="link.tag" class="mt-1">
              <UBadge
                v-for="tag in link.tag"
                :label="tag"
                variant="outline"
              />
            </div>
          </template>
          <div v-if="link.container" class="grid grid-cols-[1fr_auto] justify-between items-center">
            <p class="text-sm text-gray-400 truncate">
              {{ link.container.image }}
            </p>

            <p class="text-xs ms-4">
              {{ link.container.status }}
            </p>
          </div>
        </UCard>
      </ULink>
    </div>
  </UContainer>
</template>
