<template>
  <div class="flex flex-col h-[300px] shrink-0 rounded-xl overflow-hidden" :style="{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border-color)' }">
    <div class="px-5 py-3 border-b flex justify-between items-center" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--panel-header-bg)' }">
      <h3 class="text-lg font-bold m-0" :style="{ color: 'var(--text-primary)' }">📋 Recent Winners</h3>
      <button v-if="logs.length > 0" class="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-md text-xs font-bold cursor-pointer" @click="$emit('clear')">
        🗑️ Clear
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2 min-h-0" ref="logListRef">
      <div v-if="logs.length === 0" class="flex flex-col items-center justify-center py-8 text-center" :style="{ color: 'var(--text-muted)' }">
        <div class="text-4xl mb-3">🎲</div>
        <p class="font-bold text-sm">No spins yet!</p>
        <p class="text-xs mt-1">Spin the wheel to see results here</p>
      </div>

      <div class="flex flex-col gap-2">
        <div
          v-for="(log, index) in reversedLogs"
          :key="log.id"
          class="rounded-lg p-3"
          :style="{ backgroundColor: index === 0 ? 'rgba(139, 92, 246, 0.05)' : 'var(--bg-hover)', border: index === 0 ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border-color)' }"
        >
          <div class="text-[10px] font-bold uppercase tracking-wider mb-1" :style="{ color: 'var(--text-muted)' }">#{{ logs.length - index }}</div>
          <div class="flex items-center gap-2">
            <div class="flex-1 min-w-0">
              <span class="block text-[10px] uppercase font-bold tracking-wider" :style="{ color: 'var(--text-muted)' }">🟣 {{ innerName }}</span>
              <span class="block text-sm font-bold truncate" :style="{ color: 'var(--text-primary)' }">{{ log.inner }}</span>
            </div>
            <div class="font-extrabold text-sm" :style="{ color: 'var(--text-muted)' }">→</div>
            <div class="flex-1 min-w-0">
              <span class="block text-[10px] uppercase font-bold tracking-wider" :style="{ color: 'var(--text-muted)' }">🟢 {{ outerName }}</span>
              <span class="block text-sm font-bold truncate" :style="{ color: 'var(--text-primary)' }">{{ log.outer }}</span>
            </div>
          </div>
          <div class="text-[10px] text-right mt-1" :style="{ color: 'var(--text-muted)' }">{{ formatTime(log.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  },
  innerName: {
    type: String,
    default: 'Inner Ring'
  },
  outerName: {
    type: String,
    default: 'Outer Ring'
  }
})

defineEmits(['clear'])

const logListRef = ref(null)

const reversedLogs = computed(() => [...props.logs].reverse())

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Auto-scroll to top when new log added
watch(() => props.logs.length, async () => {
  await nextTick()
  if (logListRef.value) {
    logListRef.value.scrollTop = 0
  }
})
</script>
