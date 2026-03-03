<template>
  <div class="min-h-screen flex flex-col" :style="{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }">
    <!-- Top Nav -->
    <header
      class="h-16 flex items-center justify-between px-6 sticky top-0 z-50"
      :style="{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border-color)' }"
    >
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="flex items-center gap-3 no-underline">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: 'var(--accent)' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          </div>
          <div class="flex flex-col">
            <h2 class="text-base font-black tracking-tighter m-0 leading-none" :style="{ color: 'var(--text-primary)' }">
              SPIN MO TO <span :style="{ color: 'var(--accent)' }">WHEELS</span>
            </h2>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]" :style="{ color: 'var(--text-muted)' }">DASHBOARD</span>
          </div>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <!-- Mobile menu toggle -->
        <button
          class="md:hidden w-10 h-10 rounded-lg flex items-center justify-center"
          :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div class="hidden md:flex items-center gap-2 text-sm" :style="{ color: 'var(--text-muted)' }">
          <span>{{ user?.email }}</span>
        </div>

        <button
          class="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
          :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }"
          @click="toggleTheme"
          :title="isDark ? 'Light Mode' : 'Dark Mode'"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <button
          class="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }"
          @click="handleLogout"
        >
          Sign out
        </button>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <nav
        class="w-60 shrink-0 flex-col gap-1 p-4 hidden md:flex"
        :style="{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all no-underline"
          :style="{
            backgroundColor: isActive(item.to) ? 'var(--accent)' : 'transparent',
            color: isActive(item.to) ? '#ffffff' : 'var(--text-muted)',
          }"
        >
          <component :is="item.icon" />
          {{ item.label }}
        </NuxtLink>

        <div class="mt-auto pt-4 border-t" :style="{ borderColor: 'var(--border-color)' }">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all no-underline"
            :style="{ color: 'var(--text-muted)' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            Spin Wheel
          </NuxtLink>
        </div>
      </nav>

      <!-- Mobile sidebar -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 md:hidden"
        :style="{ backgroundColor: 'var(--overlay-bg)' }"
        @click="mobileMenuOpen = false"
      >
        <nav
          class="w-64 h-full flex flex-col gap-1 p-4"
          :style="{ backgroundColor: 'var(--bg-secondary)' }"
          @click.stop
        >
          <div class="mb-4 text-xs font-bold uppercase tracking-widest px-4" :style="{ color: 'var(--text-muted)' }">
            {{ user?.email }}
          </div>
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline"
            :style="{
              backgroundColor: isActive(item.to) ? 'var(--accent)' : 'transparent',
              color: isActive(item.to) ? '#ffffff' : 'var(--text-muted)',
            }"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" />
            {{ item.label }}
          </NuxtLink>

          <div class="mt-auto pt-4 border-t" :style="{ borderColor: 'var(--border-color)' }">
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer"
              :style="{ color: 'var(--text-muted)', backgroundColor: 'transparent', border: 'none' }"
              @click="handleLogout"
            >
              Sign out
            </button>
          </div>
        </nav>
      </div>

      <!-- Main content -->
      <main class="flex-1 p-6 md:p-8 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()
const mobileMenuOpen = ref(false)

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

// Icon components using render functions
const DashboardIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('rect', { x: 3, y: 3, width: 7, height: 7 }),
      h('rect', { x: 14, y: 3, width: 7, height: 7 }),
      h('rect', { x: 14, y: 14, width: 7, height: 7 }),
      h('rect', { x: 3, y: 14, width: 7, height: 7 }),
    ])
  }
}

const MembersIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: 9, cy: 7, r: 4 }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    ])
  }
}

const EventsIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
      h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
      h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
      h('line', { x1: 3, y1: 10, x2: 21, y2: 10 }),
    ])
  }
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: DashboardIcon },
  { to: '/dashboard/members', label: 'Members', icon: MembersIcon },
  { to: '/dashboard/events', label: 'Events', icon: EventsIcon },
]

const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
