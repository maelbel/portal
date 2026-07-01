<script setup lang="ts">
const {
  state,
  label = ''
} = defineProps<{
  state?: 'up' | 'down' | 'unknown'
  label?: string
}>()

const palette = {
  up:      { primary: 'bg-green-500',   accent: 'bg-green-400',   ping: true  },
  down:    { primary: 'bg-red-500',     accent: 'bg-red-400',     ping: false },
  unknown: { primary: 'bg-neutral-500', accent: 'bg-neutral-400', ping: false }
} as const

const colors = palette[state ?? 'unknown'] ?? palette.unknown
</script>

<template>
  <UBadge class="rounded-full" color="neutral" variant="outline">
    <span>{{ label || state || 'unknown' }}</span>
    <template #trailing>
      <span class="relative flex size-2">
        <span :class="[`absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.accent}`, { 'animate-ping': colors.ping }]"></span>
        <span :class="`relative inline-flex size-2 rounded-full ${colors.primary}`"></span>
      </span>
    </template>
  </UBadge>
</template>

<style scoped>
</style>
