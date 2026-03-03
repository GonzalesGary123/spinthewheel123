<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto">
      <!-- Back button -->
      <NuxtLink to="/dashboard/events" class="inline-flex items-center gap-2 text-sm font-medium mb-6 no-underline hover:underline" :style="{ color: 'var(--text-muted)' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Events
      </NuxtLink>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-sm" :style="{ color: 'var(--text-muted)' }">Loading event...</div>
      </div>

      <div v-else-if="!event" class="flex flex-col items-center justify-center py-16 text-center">
        <h3 class="text-lg font-bold mb-2" :style="{ color: 'var(--text-primary)' }">Event not found</h3>
        <NuxtLink to="/dashboard/events" class="btn btn-primary mt-2">Back to Events</NuxtLink>
      </div>

      <template v-else>
        <!-- Event header -->
        <div class="rounded-xl p-6 mb-6" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ event.name }}</h1>
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :style="{
                    backgroundColor: isPast ? 'rgba(100, 116, 139, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: isPast ? 'var(--text-muted)' : '#10b981',
                  }"
                >
                  {{ isPast ? 'Past' : 'Upcoming' }}
                </span>
              </div>
              <p v-if="event.description" class="text-sm mb-3" :style="{ color: 'var(--text-muted)' }">{{ event.description }}</p>
              <div class="flex flex-wrap items-center gap-4 text-xs" :style="{ color: 'var(--text-muted)' }">
                <span class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ formatDate(event.event_date) }}
                </span>
                <span v-if="event.location" class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ event.location }}
                </span>
              </div>
            </div>
            <button
              class="btn text-sm shrink-0"
              :style="{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }"
              @click="deleteEvent"
            >
              Delete Event
            </button>
          </div>
        </div>

        <!-- Attendance stats -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <div class="rounded-xl p-4 text-center" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
            <div class="text-2xl font-bold" :style="{ color: '#10b981' }">{{ presentCount }}</div>
            <div class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Present</div>
          </div>
          <div class="rounded-xl p-4 text-center" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
            <div class="text-2xl font-bold" :style="{ color: '#ef4444' }">{{ absentCount }}</div>
            <div class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Absent</div>
          </div>
          <div class="rounded-xl p-4 text-center" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
            <div class="text-2xl font-bold" :style="{ color: 'var(--text-muted)' }">{{ pendingCount }}</div>
            <div class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Pending</div>
          </div>
        </div>

        <!-- Attendance section -->
        <div class="rounded-xl overflow-hidden" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }">
          <div class="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3" :style="{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--panel-header-bg)' }">
            <h2 class="text-lg font-bold" :style="{ color: 'var(--text-primary)' }">Attendance</h2>
            <div class="flex items-center gap-2">
              <button
                class="btn text-xs py-2 px-4"
                :style="{ backgroundColor: 'var(--accent)', color: '#ffffff' }"
                @click="showAddMembersModal = true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Members
              </button>
              <button
                class="btn text-xs py-2 px-4"
                :style="{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }"
                @click="markAllPresent"
                v-if="attendance.length > 0"
              >
                Mark All Present
              </button>
            </div>
          </div>

          <div v-if="attendance.length === 0" class="px-6 py-12 text-center">
            <p class="text-sm mb-2" :style="{ color: 'var(--text-muted)' }">No members added to this event yet</p>
            <button class="btn btn-primary text-sm" @click="showAddMembersModal = true">Add Members</button>
          </div>

          <div v-else class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
            <div
              v-for="record in attendance"
              :key="record.id"
              class="flex items-center justify-between px-6 py-4"
              :style="{ borderBottom: '1px solid var(--border-color)' }"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" :style="{ backgroundColor: 'var(--accent)', color: '#ffffff' }">
                  {{ getInitials(record.members?.name || 'N/A') }}
                </div>
                <div>
                  <div class="font-semibold text-sm" :style="{ color: 'var(--text-primary)' }">{{ record.members?.name || 'Unknown' }}</div>
                  <div class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ record.members?.email || '' }}</div>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  v-for="status in ['present', 'absent', 'pending']"
                  :key="status"
                  class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  :style="getStatusStyle(record.status, status)"
                  @click="updateStatus(record.id, status)"
                >
                  {{ status }}
                </button>

                <button
                  class="ml-2 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/10"
                  :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }"
                  @click="removeFromEvent(record.id)"
                  title="Remove from event"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Add Members Modal -->
      <div v-if="showAddMembersModal" class="fixed inset-0 flex items-center justify-center z-[1000] p-4" :style="{ backgroundColor: 'var(--overlay-bg)' }" @click.self="showAddMembersModal = false">
        <div class="rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col" :style="{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }">
          <h2 class="text-xl font-bold mb-4" :style="{ color: 'var(--text-primary)' }">Add Members to Event</h2>

          <input
            v-model="memberSearchQuery"
            type="text"
            placeholder="Search members..."
            class="input-base mb-4"
          />

          <div class="flex-1 overflow-y-auto mb-4">
            <div v-if="availableMembers.length === 0" class="py-8 text-center">
              <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                {{ allMembers.length === 0 ? 'No members created yet. Go to Members page first.' : 'All members are already added to this event.' }}
              </p>
            </div>

            <div v-else class="flex flex-col gap-2">
              <label
                v-for="member in filteredAvailableMembers"
                :key="member.id"
                class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                :style="{
                  backgroundColor: selectedMemberIds.includes(member.id) ? 'rgba(124, 58, 237, 0.1)' : 'var(--bg-hover)',
                  border: selectedMemberIds.includes(member.id) ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                }"
              >
                <input
                  type="checkbox"
                  :value="member.id"
                  v-model="selectedMemberIds"
                  class="w-4 h-4 accent-purple-600"
                />
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" :style="{ backgroundColor: 'var(--accent)', color: '#ffffff' }">
                  {{ getInitials(member.name) }}
                </div>
                <div>
                  <div class="font-semibold text-sm" :style="{ color: 'var(--text-primary)' }">{{ member.name }}</div>
                  <div class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ member.email || 'No email' }}</div>
                </div>
              </label>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="btn flex-1" :style="{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }" @click="showAddMembersModal = false">Cancel</button>
            <button class="btn btn-primary flex-1" :disabled="selectedMemberIds.length === 0 || addingMembers" @click="addMembersToEvent">
              {{ addingMembers ? 'Adding...' : `Add ${selectedMemberIds.length} Member${selectedMemberIds.length !== 1 ? 's' : ''}` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: false,
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const eventId = route.params.id

const event = ref(null)
const attendance = ref([])
const allMembers = ref([])
const loading = ref(true)
const showAddMembersModal = ref(false)
const selectedMemberIds = ref([])
const memberSearchQuery = ref('')
const addingMembers = ref(false)

const isPast = computed(() => event.value ? new Date(event.value.event_date) < new Date() : false)

const presentCount = computed(() => attendance.value.filter(a => a.status === 'present').length)
const absentCount = computed(() => attendance.value.filter(a => a.status === 'absent').length)
const pendingCount = computed(() => attendance.value.filter(a => a.status === 'pending').length)

const attendingMemberIds = computed(() => new Set(attendance.value.map(a => a.member_id)))

const availableMembers = computed(() =>
  allMembers.value.filter(m => !attendingMemberIds.value.has(m.id))
)

const filteredAvailableMembers = computed(() => {
  if (!memberSearchQuery.value) return availableMembers.value
  const q = memberSearchQuery.value.toLowerCase()
  return availableMembers.value.filter(m =>
    m.name.toLowerCase().includes(q) ||
    (m.email && m.email.toLowerCase().includes(q))
  )
})

const getInitials = (name) => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const getStatusStyle = (currentStatus, buttonStatus) => {
  const isActive = currentStatus === buttonStatus
  const colors = {
    present: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#10b981' },
    absent: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444' },
    pending: { bg: 'rgba(100, 116, 139, 0.15)', border: 'var(--border-subtle)', text: 'var(--text-muted)' },
  }
  const c = colors[buttonStatus]

  if (isActive) {
    return {
      backgroundColor: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
    }
  }
  return {
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: 'var(--text-muted)',
    opacity: '0.5',
  }
}

const fetchEvent = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (!error && data) {
    event.value = data
  }
}

const fetchAttendance = async () => {
  const { data, error } = await supabase
    .from('event_attendance')
    .select('*, members(name, email)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })

  if (!error && data) {
    attendance.value = data
  }
}

const fetchAllMembers = async () => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true })

  if (!error && data) {
    allMembers.value = data
  }
}

const updateStatus = async (attendanceId, status) => {
  const { error } = await supabase
    .from('event_attendance')
    .update({ status })
    .eq('id', attendanceId)

  if (!error) {
    const record = attendance.value.find(a => a.id === attendanceId)
    if (record) record.status = status
  }
}

const markAllPresent = async () => {
  const ids = attendance.value.map(a => a.id)
  const { error } = await supabase
    .from('event_attendance')
    .update({ status: 'present' })
    .in('id', ids)

  if (!error) {
    attendance.value.forEach(a => { a.status = 'present' })
  }
}

const addMembersToEvent = async () => {
  addingMembers.value = true

  const records = selectedMemberIds.value.map(memberId => ({
    event_id: eventId,
    member_id: memberId,
    user_id: user.value.id,
    status: 'pending',
  }))

  const { error } = await supabase.from('event_attendance').insert(records)

  if (!error) {
    selectedMemberIds.value = []
    showAddMembersModal.value = false
    fetchAttendance()
  }

  addingMembers.value = false
}

const removeFromEvent = async (attendanceId) => {
  const { error } = await supabase.from('event_attendance').delete().eq('id', attendanceId)
  if (!error) {
    attendance.value = attendance.value.filter(a => a.id !== attendanceId)
  }
}

const deleteEvent = async () => {
  if (!confirm('Are you sure you want to delete this event? All attendance records will be removed.')) return

  const { error } = await supabase.from('events').delete().eq('id', eventId)
  if (!error) {
    navigateTo('/dashboard/events')
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchEvent(), fetchAttendance(), fetchAllMembers()])
  loading.value = false
})
</script>
