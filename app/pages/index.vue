<script setup>
const { data: containers } = await useFetch("/api/containers")

const buildURL = subdomain => `https://${subdomain}.maelbelliard.fr`

const findContainer = name => containers.value?.find(c => c.name === name)

const tags = {
  docker: {
    label: 'docker',
    color: 'info'
  }
}

const links = [
  {
    label: 'traefik',
    tag: [tags.docker],
    to: buildURL('traefik'),
    external: true,
    target: '_blank',
    container: findContainer("traefik")
  },
  {
    label: 'homeassistant',
    tag: [tags.docker],
    to: buildURL('ha'),
    external: true,
    target: '_blank',
    container: findContainer("homeassistant")
  },
  {
    label: 'portail',
    tag: [tags.docker],
    to: buildURL('portail'),
    external: true,
    target: '_blank',
    container: findContainer("portail")
  },
  {
    label: 'beszel',
    tag: [tags.docker],
    to: buildURL('beszel'),
    external: true,
    target: '_blank',
    container: findContainer("beszel")
  },
  {
    label: 'beszel-agent',
    tag: [tags.docker],
    container: findContainer("beszel-agent")
  },
  {
    label: 'uptime-kuma',
    tag: [tags.docker],
    to: buildURL('uptime'),
    external: true,
    target: '_blank',
    container: findContainer("uptime-kuma")
  },
  {
    label: 'zigbee2mqtt',
    tag: [tags.docker],
    to: buildURL('zigbee'),
    external: true,
    target: '_blank',
    container: findContainer("zigbee2mqtt")
  },
  {
    label: 'portainer',
    tag: [tags.docker],
    to: buildURL('portainer'),
    external: true,
    target: '_blank',
    container: findContainer("portainer")
  },
  {
    label: 'adguardhome',
    tag: [tags.docker],
    to: buildURL('adguard'),
    external: true,
    target: '_blank',
    container: findContainer("adguardhome")
  },
  {
    label: 'mosquitto',
    tag: [tags.docker],
    container: findContainer("mosquitto")
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

const reachable = async (url) => {
  if (!url) return 'unknown'
  try {
    const res = await $fetch('/api/ping', { query: { url } })
    return res.success ? 'up' : 'down'
  } catch {
    return 'down'
  }
}

const computeState = (reachableState, container) => {
  if (container) {
    const containerUp = container.state === 'running'
    if (!containerUp) return 'down'
    if (reachableState === 'unknown') return 'up'
    return reachableState
  }
  return reachableState
}

const { data: enrichedLinks } = useAsyncData(
  'links-state',
  () => Promise.all(links.map(async (link) => {
    const reachableState = await reachable(link.to)
    return {
      ...link,
      reachable: reachableState,
      state: computeState(reachableState, link.container)
    }
  })),
  {
    default: () => links.map(l => ({
      ...l,
      reachable: 'unknown',
      state: 'unknown'
    }))
  }
)
</script>

<template>
  <UContainer>
    <h1 class="text-2xl font-bold my-6">Links</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <ULink
        v-for="link in enrichedLinks"
        :key="link.label"
        :to="link.to"
        :external="link.external"
        :target="link.target"
        class="text-left h-full"
      >
        <UCard :ui="{ root: 'h-full'}">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ link.label }}</span>
              <Ping :state="link.state" />
            </div>
            <div v-if="link.tag" class="mt-1 flex gap-1">
              <UBadge
                v-for="tag in link.tag"
                :key="tag"
                :label="tag.label"
                variant="outline"
                :color="tag.color"
              />
            </div>
          </template>
          <div v-if="link.to" class="grid grid-cols-[1fr_auto] justify-between items-center text-muted">
            <p class="text-sm truncate">{{ link.to }}</p>
            <p class="text-xs ms-4">{{ link.reachable }}</p>
          </div>
          <div v-if="link.container" class="grid grid-cols-[1fr_auto] justify-between items-center text-muted">
            <p class="text-sm truncate">{{ link.container.image }}</p>
            <p class="text-xs ms-4">{{ link.container.status }}</p>
          </div>
        </UCard>
      </ULink>
    </div>
  </UContainer>
</template>
