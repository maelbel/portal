<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Portal'
const description = 'A portal for all homelab services.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const launcherOpen = useState('launcher-open', () => false)
</script>

<template>
  <UApp>
    <UHeader
      :toggle="false"
      :ui="{ center: 'flex', right: 'gap-1' }"
    >
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-3"
        >
          <AppLogo class="h-7 w-auto shrink-0 text-highlighted" />
          <span class="wordmark text-lg leading-none text-highlighted">Portal</span>
        </NuxtLink>
      </template>

      <UButton
        icon="i-lucide-search"
        label="Open a service…"
        color="neutral"
        variant="outline"
        class="hidden w-72 text-muted lg:flex"
        @click="launcherOpen = true"
      >
        <template #trailing>
          <div class="ms-auto flex items-center gap-0.5">
            <UKbd value="meta" />
            <UKbd value="K" />
          </div>
        </template>
      </UButton>

      <template #right>
        <UButton
          icon="i-lucide-search"
          aria-label="Open a service"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          @click="launcherOpen = true"
        />

        <UColorModeButton />

        <UButton
          to="https://github.com/maelbel"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <ServiceLauncher />
  </UApp>
</template>
