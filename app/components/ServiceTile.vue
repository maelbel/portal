<script setup lang="ts">
import type { ServiceConfig } from '~/services.config'

const props = defineProps<{
  service: ServiceConfig
}>()

const { isFavorite, toggleFavorite } = useFavorites()

const host = computed(() => serviceHost(props.service))
const subtitle = computed(() => host.value ?? props.service.containers?.[0] ?? 'No web UI')
const favorite = computed(() => isFavorite(props.service))
</script>

<template>
  <div class="group relative">
    <component
      :is="service.url ? 'a' : 'div'"
      :href="service.url"
      :target="service.url ? '_blank' : undefined"
      :rel="service.url ? 'noopener noreferrer' : undefined"
      class="flex items-center gap-4 rounded-sm border-b p-3 pe-12 transition-colors"
      :class="service.url
        ? 'border-default hover:border-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        : 'border-dashed border-default text-muted'"
    >
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-sm border border-default bg-elevated"
        :class="service.url ? 'text-highlighted' : ''"
      >
        <UIcon
          :name="serviceIcon(service)"
          class="size-5"
        />
      </span>

      <span class="min-w-0 flex-1">
        <span
          class="block truncate font-medium"
          :class="service.url ? 'text-highlighted' : ''"
        >
          {{ service.label }}
        </span>
        <span class="block truncate font-mono text-xs text-muted">{{ subtitle }}</span>
      </span>

      <UIcon
        v-if="service.url && isExternal(service)"
        name="i-lucide-arrow-up-right"
        class="size-4 shrink-0 text-dimmed group-hover:text-highlighted"
        aria-label="External service"
      />
    </component>

    <!-- Sibling of the link, not a child: a button can't live inside an <a>. -->
    <UButton
      icon="i-lucide-star"
      :aria-label="favorite ? `Remove ${service.label} from favorites` : `Add ${service.label} to favorites`"
      :aria-pressed="favorite"
      :variant="favorite ? 'soft' : 'ghost'"
      :color="favorite ? 'primary' : 'neutral'"
      size="sm"
      class="absolute end-2 top-1/2 -translate-y-1/2 transition-opacity"
      :class="favorite ? '' : 'text-dimmed sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100'"
      @click="toggleFavorite(service)"
    />
  </div>
</template>
