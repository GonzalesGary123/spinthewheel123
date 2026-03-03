<template>
  <div class="min-h-screen flex items-center justify-center p-4" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <div class="text-center">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" :style="{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1 class="text-2xl font-bold mb-2" :style="{ color: 'var(--text-primary)' }">Email Confirmed</h1>
      <p class="text-sm mb-6" :style="{ color: 'var(--text-muted)' }">Your account is ready. Redirecting to dashboard...</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})
</script>
