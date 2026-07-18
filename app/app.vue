<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Portail'
const description = 'A portail for all homelab services.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const {
  isCreateModalOpen,
  newService,
  openCreateModal,
  closeCreateModal,
  createService,
} = useCreateServiceModal()
</script>

<template>
  <UApp>
    <UHeader :toggle="false" :ui="{ right: 'gap-3'}">
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-4">
          <NuxtImg src="logo.png" width="32" height="32" alt="Logo" />
          <span class="font-semibold">Portail - Homelab</span>
	      </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/maelbel"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />

        <UButton
          icon="i-lucide-plus"
          aria-label="Add service"
          color="primary"
          @click="openCreateModal"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter />

    <ServiceForm
      v-if="isCreateModalOpen"
      v-model="newService"
      title="Add a service"
      submit-label="Create"
      @submit="createService"
      @cancel="closeCreateModal"
    />
  </UApp>
</template>
