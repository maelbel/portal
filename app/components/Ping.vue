<script setup lang="ts">
const {
  state
} = defineProps<{
  state: 'up' | 'down'
}>()

const primary = state === 'up' ? 'bg-green-500' : 'bg-red-500'
const accent = state === 'up' ? 'bg-green-400' : 'bg-red-400'
</script>

<template>
  <UBadge
    class="rounded-full"
    color="neutral"
    variant="outline"
  >
    <span>{{ state }}</span>
    <template #trailing>
      <span class="relative flex size-2">
        <span :class="`absolute inline-flex h-full w-full ${ state === 'up' ? 'animate-ping' : ''} rounded-full ${accent} opacity-75`"></span>
        <span :class="`relative inline-flex size-2 rounded-full ${primary}`"></span>
      </span>
    </template>
  </UBadge>
</template>

<style scoped>

</style>
