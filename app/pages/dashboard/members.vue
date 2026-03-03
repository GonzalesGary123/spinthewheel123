<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold mb-1" :style="{ color: 'var(--text-primary)' }">Members</h1>
          <p class="text-sm" :style="{ color: 'var(--text-muted)' }">{{ members.length }} total members</p>
        </div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Member
        </button>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search members..."
          class="input-base w-full md:w-80"
        />
      </div>

      <!-- Members list -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-sm" :style="{ color: 'var(--text-muted)' }">Loading members...</div>
      </div>

      <div v-else-if="filteredMembers.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" :style="{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <h3 class="text-lg font-bold mb-1" :style="{ color: 'var(--text-primary)' }">
          {{ searchQuery ? 'No members found' : 'No members yet' }}
        </h3>
        <p class="text-sm mb-4" :style="{ color: 'var(--text-muted)' }">
          {{ searchQuery ? 'Try a different search' : 'Add your first member to get started' }}
        </p>
        <button v-if="!searchQuery" class="btn btn-primary" @click="showAddModal = true">Add Member</button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="flex items-center justify-between p-4 rounded-xl transition-all"
          :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" :style="{ backgroundColor: 'var(--accent)', color: '#ffffff' }">
              {{ getInitials(member.name) }}
            </div>
            <div>
              <div class="font-bold text-sm" :style="{ color: 'var(--text-primary)' }">{{ member.name }}</div>
              <div class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ member.email || 'No email' }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
              :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }"
              @click="editMember(member)"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-red-500/10"
              :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }"
              @click="deleteMember(member.id)"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Member Modal -->
      <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center z-[1000] p-4" :style="{ backgroundColor: 'var(--overlay-bg)' }" @click.self="closeModal">
        <div class="rounded-2xl p-6 w-full max-w-md" :style="{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }">
          <h2 class="text-xl font-bold mb-6" :style="{ color: 'var(--text-primary)' }">
            {{ editingMember ? 'Edit Member' : 'Add New Member' }}
          </h2>

          <form @submit.prevent="saveMember" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Name *</label>
              <input v-model="form.name" type="text" required placeholder="Full name" class="input-base" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Email</label>
              <input v-model="form.email" type="email" placeholder="email@example.com" class="input-base" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">Phone</label>
              <input v-model="form.phone" type="text" placeholder="Phone number" class="input-base" />
            </div>

            <div v-if="formError" class="p-3 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
              {{ formError }}
            </div>

            <div class="flex gap-3 mt-2">
              <button type="button" class="btn flex-1" :style="{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary flex-1" :disabled="saving">
                {{ saving ? 'Saving...' : (editingMember ? 'Update' : 'Add Member') }}
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

const members = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showAddModal = ref(false)
const editingMember = ref(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
})

const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value
  const q = searchQuery.value.toLowerCase()
  return members.value.filter(m =>
    m.name.toLowerCase().includes(q) ||
    (m.email && m.email.toLowerCase().includes(q))
  )
})

const getInitials = (name) => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const fetchMembers = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error && data) {
    members.value = data
  }
  loading.value = false
}

const editMember = (member) => {
  editingMember.value = member
  form.name = member.name
  form.email = member.email || ''
  form.phone = member.phone || ''
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingMember.value = null
  form.name = ''
  form.email = ''
  form.phone = ''
  formError.value = ''
}

const saveMember = async () => {
  if (!form.name.trim()) {
    formError.value = 'Name is required'
    return
  }

  saving.value = true
  formError.value = ''

  if (editingMember.value) {
    const { error } = await supabase
      .from('members')
      .update({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
      })
      .eq('id', editingMember.value.id)

    if (error) {
      formError.value = error.message
      saving.value = false
      return
    }
  } else {
    const { error } = await supabase
      .from('members')
      .insert({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        user_id: user.value.id,
      })

    if (error) {
      formError.value = error.message
      saving.value = false
      return
    }
  }

  saving.value = false
  closeModal()
  fetchMembers()
}

const deleteMember = async (id) => {
  if (!confirm('Are you sure you want to delete this member?')) return

  const { error } = await supabase.from('members').delete().eq('id', id)
  if (!error) {
    members.value = members.value.filter(m => m.id !== id)
  }
}

onMounted(() => {
  fetchMembers()
})
</script>
