<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold mb-1" :style="{ color: 'var(--text-primary)' }">Events</h1>
          <p class="text-sm" :style="{ color: 'var(--text-muted)' }">{{ events.length }} total events</p>
        </div>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Event
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in ['all', 'upcoming', 'past']"
          :key="tab"
          class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          :style="{
            backgroundColor: activeTab === tab ? 'var(--accent)' : 'var(--bg-secondary)',
            color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
            border: activeTab === tab ? 'none' : '1px solid var(--border-color)',
          }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Events list -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-sm" :style="{ color: 'var(--text-muted)' }">Loading events...</div>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" :style="{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3 class="text-lg font-bold mb-1" :style="{ color: 'var(--text-primary)' }">No events yet</h3>
        <p class="text-sm mb-4" :style="{ color: 'var(--text-muted)' }">Create your first event to start tracking attendance</p>
        <button class="btn btn-primary" @click="showCreateModal = true">Create Event</button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <NuxtLink
          v-for="event in filteredEvents"
          :key="event.id"
          :to="`/dashboard/events/${event.id}`"
          class="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.005] no-underline"
          :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center shrink-0"
              :style="{
                backgroundColor: isPast(event.event_date) ? 'rgba(100, 116, 139, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                color: isPast(event.event_date) ? 'var(--text-muted)' : 'var(--accent)',
              }"
            >
              <span class="text-[10px] font-bold uppercase leading-none">{{ formatMonth(event.event_date) }}</span>
              <span class="text-lg font-black leading-none">{{ formatDay(event.event_date) }}</span>
            </div>
            <div>
              <div class="font-bold text-base" :style="{ color: 'var(--text-primary)' }">{{ event.name }}</div>
              <div class="text-xs flex items-center gap-3" :style="{ color: 'var(--text-muted)' }">
                <span v-if="event.location">{{ event.location }}</span>
                <span>{{ formatDate(event.event_date) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :style="{
                backgroundColor: isPast(event.event_date) ? 'rgba(100, 116, 139, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: isPast(event.event_date) ? 'var(--text-muted)' : '#10b981',
              }"
            >
              {{ isPast(event.event_date) ? 'Past' : 'Upcoming' }}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="'var(--text-muted)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </NuxtLink>
      </div>

      <!-- Create Event Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center z-[1000] p-4" :style="{ backgroundColor: 'var(--overlay-bg)' }" @click.self="showCreateModal = false">
        <div class="rounded-2xl p-6 w-full max-w-md" :style="{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }">
          <h2 class="text-xl font-bold mb-6" :style="{ color: 'var(--text-primary)' }">Create New Event</h2>

          <form @submit.prevent="createEvent" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Event Name *</label>
              <input v-model="form.name" type="text" required placeholder="e.g. Team Meeting" class="input-base" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Description</label>
              <textarea v-model="form.description" placeholder="Event details..." class="input-base" rows="3" style="resize: none;"></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Date & Time *</label>
              <input v-model="form.event_date" type="datetime-local" required class="input-base" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Location</label>
              <input v-model="form.location" type="text" placeholder="Where is the event?" class="input-base" />
            </div>

            <div v-if="formError" class="p-3 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
              {{ formError }}
            </div>

            <div class="flex gap-3 mt-2">
              <button type="button" class="btn flex-1" :style="{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }" @click="showCreateModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary flex-1" :disabled="saving">
                {{ saving ? 'Creating...' : 'Create Event' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'

definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const events = ref([])
const loading = ref(true)
const activeTab = ref('all')
const showCreateModal = ref(false)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  description: '',
  event_date: '',
  location: '',
})

const isPast = (dateStr) => new Date(dateStr) < new Date()

const filteredEvents = computed(() => {
  if (activeTab.value === 'upcoming') return events.value.filter(e => !isPast(e.event_date))
  if (activeTab.value === 'past') return events.value.filter(e => isPast(e.event_date))
  return events.value
})

const formatMonth = (dateStr) => new Date(dateStr).toLocaleDateString('en', { month: 'short' })
const formatDay = (dateStr) => new Date(dateStr).getDate()
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

const fetchEvents = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  if (!error && data) {
    events.value = data
  }
  loading.value = false
}

const createEvent = async () => {
  if (!form.name.trim() || !form.event_date) {
    formError.value = 'Name and date are required'
    return
  }

  saving.value = true
  formError.value = ''

  const { error } = await supabase.from('events').insert({
    name: form.name.trim(),
    description: form.description.trim() || null,
    event_date: new Date(form.event_date).toISOString(),
    location: form.location.trim() || null,
    user_id: user.value.id,
  })

  if (error) {
    formError.value = error.message
    saving.value = false
    return
  }

  saving.value = false
  showCreateModal.value = false
  form.name = ''
  form.description = ''
  form.event_date = ''
  form.location = ''
  fetchEvents()
}

onMounted(() => {
  fetchEvents()
})
</script>
