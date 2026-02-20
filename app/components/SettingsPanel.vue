<template>
  <div class="flex flex-col h-fit max-h-[600px] overflow-hidden rounded-xl border border-white/10 shadow-2xl" :style="{ backgroundColor: 'var(--panel-bg)' }" :class="{ 'opacity-80': isSpinning }">
    <div class="px-5 py-4 border-b" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--panel-header-bg)' }">
      <h3 class="text-lg font-bold m-0" :style="{ color: 'var(--text-accent)' }">⚙️ Settings</h3>
    </div>

    <!-- Toolbar for selection tabs -->
    <div class="flex justify-between items-center gap-2 p-3 border-b" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-hover)' }" :class="{ 'opacity-50 pointer-events-none': isSpinning }">
      <div class="flex gap-2 w-full">
        <button
          v-for="ring in ['inner', 'outer']"
          :key="ring"
          @click="activeTab = ring"
          class="flex-1 py-3 px-2 bg-transparent border-b-2 border-transparent text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 rounded-t-lg"
          :style="{ color: activeTab === ring ? 'var(--text-accent)' : 'var(--text-muted)' }"
          :class="{ '!border-purple-500 bg-purple-500/10': activeTab === ring }"
          :disabled="isSpinning"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :class="ring === 'inner' ? 'bg-purple-500' : 'bg-green-500'"></span>
          {{ ring === 'inner' ? (innerTitle || 'Inner Ring') : (outerTitle || 'Outer Ring') }}
          <span class="bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{{ ring === 'inner' ? innerLines.length : outerLines.length }}</span>
        </button>
      </div>
    </div>

    <!-- Main Toolbar -->
    <div class="flex flex-col gap-3 p-3 border-b" :style="{ borderColor: 'var(--border-subtle)' }">
      <div class="flex gap-2 flex-wrap">
        <button 
          class="px-3 py-1.5 text-white rounded-md text-xs font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-none" 
          :style="{ backgroundColor: 'var(--accent)' }"
          @click="shuffleCurrent" 
          title="Shuffle Lines" 
          :disabled="isSpinning"
        >
          🔀 Shuffle
        </button>
        <button 
          class="px-3 py-1.5 text-white rounded-md text-xs font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-none" 
          :style="{ backgroundColor: 'var(--accent)' }"
          @click="sortCurrent" 
          title="Sort Alphabetically" 
          :disabled="isSpinning"
        >
          ⬇️ Sort
        </button>
        <button 
          class="px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-none ml-auto" 
          :style="{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }"
          @click="$emit('toggle-fullscreen')" 
          :title="isFullscreen ? 'Exit Full Screen' : 'Go Full Screen'"
        >
          {{ isFullscreen ? '✖️ Exit' : '🖥️ Full Screen' }}
        </button>
      </div>
      
      <div class="w-full flex flex-col gap-3 mt-2 p-3 rounded-lg border" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-hover)' }">
        <!-- <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: 'var(--text-accent)' }">📜 Main App Title</label>
          <input v-model="gameTitle" class="game-title-input rounded-md px-3 py-1.5 text-sm focus:outline-none" :style="{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }" placeholder="App Title" />
        </div> -->
        
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: 'var(--text-accent)' }">⏱️ Spin Duration</label>
          <div class="flex gap-1">
            <button 
              v-for="dur in [5, 10, 20, 30, 40]" 
              :key="dur"
              @click="spinDuration = dur"
              class="flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all"
              :style="{ 
                backgroundColor: spinDuration === dur ? 'var(--accent)' : 'var(--bg-input)',
                color: spinDuration === dur ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (spinDuration === dur ? 'var(--accent)' : 'var(--border-subtle)')
              }"
            >
              {{ dur }}s
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Editor Area with scroll -->
    <div class="flex-1 flex flex-col gap-2 p-3 overflow-y-auto min-h-[300px]">
      <input
        v-if="activeTab === 'inner'"
        v-model="innerTitle"
        class="ring-title-input rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 shrink-0"
        :style="{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }"
        placeholder="Inner Ring Title"
      />
      <input
        v-else
        v-model="outerTitle"
        class="ring-title-input rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-500 shrink-0"
        :style="{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }"
        placeholder="Outer Ring Title"
      />

      <textarea
        v-if="activeTab === 'inner'"
        v-model="innerText"
        class="entries-textarea flex-1 p-3 pb-24 rounded-md font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-purple-500 overflow-y-auto min-h-[400px]"
        :style="{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }"
        placeholder="Enter items here (one per line)"
        spellcheck="false"
      ></textarea>
      <textarea
        v-else
        v-model="outerText"
        class="entries-textarea flex-1 p-3 pb-24 rounded-md font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-green-500 overflow-y-auto min-h-[400px]"
        :style="{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }"
        placeholder="Enter items here (one per line)"
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Footer Actions -->
    <div class="p-3 border-t flex gap-2 mt-auto" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-hover)' }">
      <button class="flex-1 py-2 px-4 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed" :style="{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }" @click="resetToDefaults" :disabled="isSpinning">
        Reset to Defaults
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  wheel1Segments: Array,
  wheel2Segments: Array,
  gameName: String,
  wheel1Name: String,
  wheel2Name: String,
  wheel1Size: Number,
  wheel2Size: Number,
  arrowSize: Number,
  autoRemoveWinner: Boolean,
  currentSpinDuration: Number,
  isSpinning: Boolean,
  isFullscreen: Boolean
})

const emit = defineEmits(['save', 'toggle-fullscreen'])

// State
const activeTab = ref('inner')

// Data
const gameTitle = ref(props.gameName || 'Wheels')
const innerTitle = ref(props.wheel1Name)
const outerTitle = ref(props.wheel2Name)
const innerText = ref('')
const outerText = ref('')
const innerSize = ref(props.wheel1Size || 150)
const outerSize = ref(props.wheel2Size || 150)
const arrowSize = ref(props.arrowSize || 100)
const removeWinner = ref(props.autoRemoveWinner || false)
const spinDuration = ref(props.currentSpinDuration || 5)

// Initialize text from props
const initText = () => {
  innerText.value = props.wheel1Segments.map(s => s.label).join('\n')
  outerText.value = props.wheel2Segments.map(s => s.label).join('\n')
}

initText()

// Computed line counts
const innerLines = computed(() => innerText.value.split('\n').filter(l => l.trim()))
const outerLines = computed(() => outerText.value.split('\n').filter(l => l.trim()))

// Palette for generating new colors
const colorPalette = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
  '#f43f5e', '#ec4899', '#14b8a6', '#22c55e', '#eab308'
]

// Utilities
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

const shuffleCurrent = () => {
  if (activeTab.value === 'inner') {
    const lines = innerText.value.split('\n').filter(l => l.trim())
    innerText.value = shuffleArray(lines).join('\n')
  } else {
    const lines = outerText.value.split('\n').filter(l => l.trim())
    outerText.value = shuffleArray(lines).join('\n')
  }
  // Auto-apply to wheel immediately
  saveSettings()
}

const sortCurrent = () => {
  if (activeTab.value === 'inner') {
    const lines = innerText.value.split('\n').filter(l => l.trim())
    innerText.value = lines.sort((a, b) => a.localeCompare(b)).join('\n')
  } else {
    const lines = outerText.value.split('\n').filter(l => l.trim())
    outerText.value = lines.sort((a, b) => a.localeCompare(b)).join('\n')
  }
  // Auto-apply to wheel immediately
  saveSettings()
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset to default settings?')) {
    localStorage.removeItem('wheelSettings')
    window.location.reload()
  }
}

// Logic to convert text back to segment objects, preserving colors if possible
const textToSegments = (text, originalSegments) => {
  const lines = text.split('\n').filter(l => l.trim())

  return lines.map((line, index) => {
    const existingColor = originalSegments[index]?.color
    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]

    return {
      label: line,
      color: existingColor || randomColor
    }
  })
}

const saveSettings = () => {
  const newInner = textToSegments(innerText.value, props.wheel1Segments)
  const newOuter = textToSegments(outerText.value, props.wheel2Segments)

  emit('save', {
    wheel1: newInner,
    wheel2: newOuter,
    gameTitle: gameTitle.value,
    wheel1Title: innerTitle.value,
    wheel2Title: outerTitle.value,
    wheel1Size: innerSize.value,
    wheel2Size: outerSize.value,
    arrowSize: arrowSize.value,
    removeWinner: removeWinner.value,
    spinDuration: spinDuration.value
  })
}

let saveTimeout = null
watch([innerText, outerText, innerTitle, outerTitle, gameTitle, innerSize, outerSize, arrowSize, removeWinner, spinDuration], (newVals, oldVals) => {
  const [newIn, newOut, newInT, newOutT, newGameT, newInS, newOutS, newArrS, newRem, newDur] = newVals
  const [oldIn, oldOut, oldInT, oldOutT, oldGameT, oldInS, oldOutS, oldArrS, oldRem, oldDur] = oldVals || []
  
  const hasChanged = newIn !== oldIn || newOut !== oldOut || newInT !== oldInT || newOutT !== oldOutT || newGameT !== oldGameT ||
                     newInS !== oldInS || newOutS !== oldOutS || newArrS !== oldArrS || newRem !== oldRem || newDur !== oldDur
  
  if (hasChanged) {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveSettings()
    }, 300) // 300ms debounce
  }
})

// Helper to update ref only if value changed (avoids unnecessary watcher triggers)
const setIfChanged = (refObj, val) => {
  if (refObj.value !== val) {
    refObj.value = val
  }
}

// Update watchers to use setIfChanged, but skip if the element is focused
watch(() => props.gameName, (newVal) => {
  if (newVal && !document.activeElement?.className.includes('game-title-input')) {
    setIfChanged(gameTitle, newVal)
  }
})

watch(() => props.wheel1Segments, (newVal) => {
  if (newVal && !document.activeElement?.className.includes('entries-textarea')) {
    setIfChanged(innerText, newVal.map(s => s.label).join('\n'))
  }
}, { deep: true })

watch(() => props.wheel2Segments, (newVal) => {
  if (newVal && !document.activeElement?.className.includes('entries-textarea')) {
    setIfChanged(outerText, newVal.map(s => s.label).join('\n'))
  }
}, { deep: true })

watch(() => props.wheel1Name, (newVal) => {
  if (newVal && !document.activeElement?.className.includes('ring-title-input')) {
    setIfChanged(innerTitle, newVal)
  }
})

watch(() => props.wheel2Name, (newVal) => {
  if (newVal && !document.activeElement?.className.includes('ring-title-input')) {
    setIfChanged(outerTitle, newVal)
  }
})

watch(() => props.wheel1Size, (newVal) => {
  if (newVal) setIfChanged(innerSize, newVal)
})

watch(() => props.wheel2Size, (newVal) => {
  if (newVal) setIfChanged(outerSize, newVal)
})

watch(() => props.arrowSize, (newVal) => {
  if (newVal !== undefined) setIfChanged(arrowSize, newVal)
})

watch(() => props.autoRemoveWinner, (newVal) => {
  setIfChanged(removeWinner, newVal)
})

watch(() => props.currentSpinDuration, (newVal) => {
  if (newVal) setIfChanged(spinDuration, newVal)
})
</script>
