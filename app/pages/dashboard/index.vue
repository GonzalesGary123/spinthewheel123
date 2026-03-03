<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-2" :style="{ color: 'var(--text-primary)' }">Dashboard</h1>
      <p class="text-sm mb-8" :style="{ color: 'var(--text-muted)' }">Welcome back! Here is an overview of your data.</p>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="rounded-xl p-6" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="text-xs font-bold uppercase tracking-wider mb-2" :style="{ color: 'var(--text-muted)' }">Total Members</div>
          <div class="text-3xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ memberCount }}</div>
        </div>
        <div class="rounded-xl p-6" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="text-xs font-bold uppercase tracking-wider mb-2" :style="{ color: 'var(--text-muted)' }">Total Events</div>
          <div class="text-3xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ eventCount }}</div>
        </div>
        <div class="rounded-xl p-6" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="text-xs font-bold uppercase tracking-wider mb-2" :style="{ color: 'var(--text-muted)' }">Upcoming Events</div>
          <div class="text-3xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ upcomingCount }}</div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink to="/dashboard/members" class="no-underline rounded-xl p-6 flex items-center gap-4 transition-all hover:scale-[1.01]" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <div class="text-base font-bold" :style="{ color: 'var(--text-primary)' }">Manage Members</div>
            <div class="text-sm" :style="{ color: 'var(--text-muted)' }">Add, edit, or remove members</div>
          </div>
        </NuxtLink>

        <NuxtLink to="/dashboard/events" class="no-underline rounded-xl p-6 flex items-center gap-4 transition-all hover:scale-[1.01]" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <div class="text-base font-bold" :style="{ color: 'var(--text-primary)' }">Manage Events</div>
            <div class="text-sm" :style="{ color: 'var(--text-muted)' }">Create events and track attendance</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const memberCount = ref(0)
const eventCount = ref(0)
const upcomingCount = ref(0)

onMounted(async () => {
  if (!user.value) return

  const [membersRes, eventsRes, upcomingRes] = await Promise.all([
    supabase.from('members').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }).gte('event_date', new Date().toISOString()),
  ])

  memberCount.value = membersRes.count || 0
  eventCount.value = eventsRes.count || 0
  upcomingCount.value = upcomingRes.count || 0
})
</script>
