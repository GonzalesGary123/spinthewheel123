<template>
  <div class="min-h-screen flex items-center justify-center p-4" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" :style="{ backgroundColor: 'var(--accent)' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-lg font-black tracking-tighter m-0 leading-none" :style="{ color: 'var(--text-primary)' }">
            SPIN MO TO <span :style="{ color: 'var(--accent)' }">WHEELS</span>
          </h2>
        </div>
      </div>

      <!-- Card -->
      <div class="rounded-2xl p-8" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
        <h1 class="text-2xl font-bold text-center mb-2" :style="{ color: 'var(--text-primary)' }">Welcome back</h1>
        <p class="text-sm text-center mb-8" :style="{ color: 'var(--text-muted)' }">Sign in to manage your events and members</p>

        <!-- Error message -->
        <div v-if="errorMsg" class="mb-4 p-3 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="input-base"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Your password"
              class="input-base"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full mt-2"
            :disabled="loading"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
            {"Don't have an account? "}
            <NuxtLink to="/signup" class="font-bold hover:underline" :style="{ color: 'var(--text-accent)' }">Sign up</NuxtLink>
          </p>
        </div>
      </div>

      <!-- Back to wheel -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-sm font-medium hover:underline" :style="{ color: 'var(--text-muted)' }">
          Back to Spin Wheel
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  loading.value = false
  navigateTo('/dashboard')
}
</script>
