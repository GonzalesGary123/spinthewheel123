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

      <!-- Success state -->
      <div v-if="success" class="rounded-2xl p-8 text-center" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" :style="{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 class="text-2xl font-bold mb-2" :style="{ color: 'var(--text-primary)' }">Check your email</h1>
        <p class="text-sm mb-6" :style="{ color: 'var(--text-muted)' }">
          We sent a confirmation link to <strong :style="{ color: 'var(--text-primary)' }">{{ email }}</strong>. Click the link to activate your account.
        </p>
        <NuxtLink to="/login" class="btn btn-primary w-full text-white">Go to Login</NuxtLink>
      </div>

      <!-- Sign up form -->
      <div v-else class="rounded-2xl p-8" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
        <h1 class="text-2xl font-bold text-center mb-2" :style="{ color: 'var(--text-primary)' }">Create an account</h1>
        <p class="text-sm text-center mb-8" :style="{ color: 'var(--text-muted)' }">Sign up to manage events and track attendance</p>

        <div v-if="errorMsg" class="mb-4 p-3 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleSignup" class="flex flex-col gap-4">
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
              minlength="6"
              placeholder="At least 6 characters"
              class="input-base"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              placeholder="Repeat your password"
              class="input-base"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full mt-2"
            :disabled="loading"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
            Already have an account?
            <NuxtLink to="/login" class="font-bold hover:underline" :style="{ color: 'var(--text-accent)' }">Sign in</NuxtLink>
          </p>
        </div>
      </div>

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

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const success = ref(false)

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match'
    return
  }

  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  loading.value = false
  success.value = true
}
</script>
