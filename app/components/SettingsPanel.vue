<template>
  <div class="flex flex-col h-[750px] max-h-[85vh] overflow-hidden rounded-xl border shadow-none transition-all duration-300" :style="{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }" :class="{ 'opacity-80': isSpinning }">
    <!-- Header -->
    <div class="px-5 py-4 border-b flex items-center justify-between" :style="{ backgroundColor: 'var(--panel-header-bg)', borderColor: 'var(--border-color)' }">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-bold m-0" :style="{ color: 'var(--text-primary)' }">Settings</h3>
      </div>
      <button 
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border" 
        :style="{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-color)' }"
        @click="$emit('toggle-fullscreen')" 
        :title="isFullscreen ? 'Exit Full Screen' : 'Go Full Screen'"
      >
        <span v-if="isFullscreen">✖️</span>
        <span v-else>🖥️</span>
      </button>
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6">
      
      <!-- Section 1: Interaction Rules -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="text-[10px] font-bold uppercase tracking-widest" :style="{ color: 'var(--text-muted)' }"></h4>
        </div>
        
        <div class="grid grid-cols-1 gap-3">
          <!-- Instant Select -->
          <div class="group flex items-center justify-between p-3 rounded-xl border transition-all duration-300" :style="{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-color)' }">
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <span class="text-xs font-bold" :style="{ color: 'var(--text-primary)' }">Instant Select All</span>
                <span class="text-[9px]" :style="{ color: 'var(--text-muted)' }">Pair all items immediately</span>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="instantSelect" class="sr-only peer">
              <div class="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <!-- Auto Remove -->
          <div class="group flex items-center justify-between p-3 rounded-xl border transition-all duration-300" :style="{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-color)' }">
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <span class="text-xs font-bold" :style="{ color: 'var(--text-primary)' }">Auto-Remove Winners</span>
                <span class="text-[9px]" :style="{ color: 'var(--text-muted)' }">Clean wheels after Instant Select</span>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="removeWinner" class="sr-only peer">
              <div class="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        <!-- Spin Duration Selector -->
        <div class="p-3 rounded-xl border" :style="{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-color)' }">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-bold uppercase tracking-widest" :style="{ color: 'var(--text-muted)' }">Spin Speed</span>
            <span class="text-xs font-bold text-purple-400">{{ spinDuration }}s</span>
          </div>
          <div class="flex gap-1">
            <button 
              v-for="dur in [5, 10, 20, 30, 40]" 
              :key="dur"
              @click="spinDuration = dur"
              class="flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all border"
              :style="{ 
                backgroundColor: spinDuration === dur ? 'var(--accent)' : 'var(--bg-input)',
                color: spinDuration === dur ? '#ffffff' : 'var(--text-muted)',
                borderColor: spinDuration === dur ? 'var(--accent)' : 'var(--border-subtle)',
                transform: spinDuration === dur ? 'scale(1.02)' : 'scale(1)'
              }"
            >
              {{ dur }}s
            </button>
          </div>
        </div>
      </section>

      <!-- Section 2: Wheel Content -->
      <section class="flex-1 flex flex-col gap-3 min-h-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h4 class="text-[10px] font-bold uppercase tracking-widest" :style="{ color: 'var(--text-muted)' }">Wheel Editor</h4>
          </div>
          <div class="flex gap-1.5">
            <button @click="shuffleAll" class="px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all" :style="{ backgroundColor: 'var(--accent)', color: '#ffffff', borderColor: 'var(--accent)' }">
              Shuffle All 🔀
            </button>
            <!-- <button @click="sortCurrent" class="p-1 px-2 rounded-md border text-xs transition-colors" :style="{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }" title="Sort A-Z">⬇️</button> -->
          </div>
        </div>

        <div class="flex-1 flex flex-col rounded-xl border overflow-hidden min-h-[350px]" :style="{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }">
          <!-- Editor Tabs -->
          <div class="flex border-b p-1" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--panel-header-bg)' }">
            <button
              v-for="ring in ['inner', 'outer']"
              :key="ring"
              @click="activeTab = ring"
              class="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-2"
              :style="{ 
                backgroundColor: activeTab === ring ? 'var(--panel-bg)' : 'transparent',
                color: activeTab === ring ? 'var(--text-primary)' : 'var(--text-muted)'
              }"
            >
              <div class="w-1.5 h-1.5 rounded-full" :class="ring === 'inner' ? 'bg-purple-500' : 'bg-green-500'"></div>
              {{ ring === 'inner' ? 'Wheel 1' : 'Wheel 2' }}
              <span class="text-[9px] px-1.5 py-0.5 rounded-md" :style="{ backgroundColor: 'var(--bg-hover)' }">{{ ring === 'inner' ? innerLines.length : outerLines.length }}</span>
            </button>
          </div>

          <!-- Contextual Header -->
          <div class="px-4 py-2 flex flex-col gap-3">
             <input
              v-if="activeTab === 'inner'"
              v-model="innerTitle"
              class="ring-title-input bg-transparent border-b px-0 py-1 text-xs font-bold focus:outline-none transition-colors"
              :style="{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }"
              placeholder="Wheel 1 Name..."
            />
            <input
              v-else
              v-model="outerTitle"
              class="ring-title-input bg-transparent border-b px-0 py-1 text-xs font-bold focus:outline-none transition-colors"
              :style="{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }"
              placeholder="Wheel 2 Name..."
            />
          </div>

          <!-- The Textarea -->
          <div class="flex-1 relative p-2">
            <textarea
              v-if="activeTab === 'inner'"
              v-model="innerText"
              class="entries-textarea w-full h-full p-2 bg-transparent font-mono text-xs leading-relaxed resize-none focus:outline-none custom-scrollbar"
              :style="{ color: 'var(--text-primary)' }"
              placeholder="Enter names here..."
              spellcheck="false"
            ></textarea>
            <textarea
              v-else
              v-model="outerText"
              class="entries-textarea w-full h-full p-2 bg-transparent font-mono text-xs leading-relaxed resize-none focus:outline-none custom-scrollbar"
              :style="{ color: 'var(--text-primary)' }"
              placeholder="Enter items here..."
              spellcheck="false"
            ></textarea>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer Area -->
    <div class="p-3 border-t" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--panel-header-bg)' }">
      <button 
        class="w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-red-500/10 hover:text-red-400 border" 
        :style="{ color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }" 
        @click="resetToDefaults" 
        :disabled="isSpinning"
      >
        Reset Everything
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
  instantSelectAll: Boolean,
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
const instantSelect = ref(props.instantSelectAll || false)
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

const shuffleAll = () => {
  const innerLinesArr = innerText.value.split('\n').filter(l => l.trim())
  const outerLinesArr = outerText.value.split('\n').filter(l => l.trim())
  
  innerText.value = shuffleArray([...innerLinesArr]).join('\n')
  outerText.value = shuffleArray([...outerLinesArr]).join('\n')
  
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
    instantSelectAll: instantSelect.value,
    spinDuration: spinDuration.value
  })
}

let saveTimeout = null
watch([innerText, outerText, innerTitle, outerTitle, gameTitle, innerSize, outerSize, arrowSize, removeWinner, instantSelect, spinDuration], (newVals, oldVals) => {
  const [newIn, newOut, newInT, newOutT, newGameT, newInS, newOutS, newArrS, newRem, newIns, newDur] = newVals
  const [oldIn, oldOut, oldInT, oldOutT, oldGameT, oldInS, oldOutS, oldArrS, oldRem, oldIns, oldDur] = oldVals || []
  
  const hasChanged = newIn !== oldIn || newOut !== oldOut || newInT !== oldInT || newOutT !== oldOutT || newGameT !== oldGameT ||
                     newInS !== oldInS || newOutS !== oldOutS || newArrS !== oldArrS || newRem !== oldRem || newIns !== oldIns || newDur !== oldDur
  
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

watch(() => props.instantSelectAll, (newVal) => {
  setIfChanged(instantSelect, newVal)
})

watch(() => props.currentSpinDuration, (newVal) => {
  if (newVal) setIfChanged(spinDuration, newVal)
})
</script>
