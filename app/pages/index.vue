<script setup>
const { data: containers } = await useFetch("/api/containers")
</script>

<template>
  <UContainer>
    <h1 class="text-2xl font-bold my-6">
      Docker Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ULink
        v-for="container in containers"
        :key="container.id"
        :to="`https://${container.name}.maelbelliard.fr`"
        :external="true"
        target="_blank"
      >
        <UCard>
          <template #header>
            <div class="flex justify-between">
              <span class="font-semibold">
                {{ container.name }}
              </span>

              <UBadge :color="container.state === 'running' ? 'green' : 'red'">
                {{ container.state }}
              </UBadge>
            </div>
          </template>

          <p class="text-sm text-gray-400">
            {{ container.image }}
          </p>

          <p class="text-xs mt-2">
            {{ container.status }}
          </p>
        </UCard>
      </ULink>
    </div>
  </UContainer>
</template>
