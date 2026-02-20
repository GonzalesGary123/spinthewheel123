<template>
  <div id="app-root">
    <DualWheelGame />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style>
/* Global styles if any */
</style>
