<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 5
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-4">
    <div
      v-for="index in count"
      :key="index"
      class="h-full rounded-lg border border-default/20 bg-default/5 p-4 space-y-3"
    >
      <div class="flex items-center justify-between gap-2">
        <USkeleton class="h-5 w-32" />
        <USkeleton class="h-6 w-6 rounded-full" />
      </div>
      <div class="flex gap-2">
        <USkeleton class="h-6 w-16 rounded-full" />
        <USkeleton class="h-6 w-20 rounded-full" />
      </div>
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
    </div>
  </div>
</template>
