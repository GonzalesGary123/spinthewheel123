<template>
  <div class="flex flex-col min-h-screen" id="app-root" :class="{ 'is-fullscreen': isFullscreen }" :style="{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }">
    <!-- Website Header -->
    <header class="h-16 flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300" :style="{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border-color)' }" v-if="!isFullscreen">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :style="{ backgroundColor: 'var(--accent)' }">
          🎡
        </div>
        <div class="flex flex-col">
          <h2 class="text-base font-black tracking-tighter m-0 leading-none" :style="{ color: 'var(--text-primary)' }">
              SPIN MO TO <span :style="{ color: 'var(--accent)' }">WHEELS</span>
            </h2>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]" :style="{ color: 'var(--text-muted)' }">
              PINAIKOT KA LANG KASI!
          </span>
        </div>
      </div>
      
      <div class="flex items-center gap-8">
        <nav class="hidden md:flex items-center gap-2">
          <a
            v-for="page in navPages"
            :key="page.id"
            href="#"
            class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
            :style="{
              backgroundColor: activePage === page.id ? 'var(--accent)' : 'transparent',
              color: activePage === page.id ? '#ffffff' : 'var(--text-muted)',
            }"
            @click.prevent="activePage = page.id"
          >{{ page.label }}</a>
        </nav>
        
        <div class="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>

        <!-- Dark/Light Mode Toggle -->
        <button
          class="w-10 h-10 rounded-xl flex items-center justify-center text-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
          :style="{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </header>

    <!-- Editor Area with scroll -->
    <div class="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8 w-full max-w-[1800px] mx-auto items-start" :class="{ '!p-0 !max-w-none h-screen overflow-hidden': isFullscreen }">
      <!-- Left Side: Wheel & Controls -->
      <div class="w-full md:flex-1 flex flex-col items-center justify-center gap-6 relative min-h-[500px] md:min-h-[600px] rounded-3xl p-6 md:p-8 shadow-none" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }" :class="{ '!p-8 !w-screen !h-screen': isFullscreen }">
        <div class="w-full flex justify-center items-center relative mb-4" v-if="!isFullscreen">
          <div class="text-center">
            <h1 class="text-4xl font-extrabold m-0" :style="{ color: 'var(--text-primary)' }">🎰 {{ gameTitle }} 🎰</h1>
          </div>
        </div>

        <div v-if="isFullscreen" class="absolute right-8 top-8 z-50">
           <button @click="toggleFullScreen" class="px-4 py-2 rounded-lg text-sm font-semibold" :style="{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }">
             Exit Fullscreen
           </button>
        </div>

        <!-- Concentric Wheel -->
        <ConcentricWheel
          ref="wheelRef"
          :inner-segments="innerRingSegments"
          :outer-segments="outerRingSegments"
          :inner-thickness="innerRingSize"
          :outer-thickness="outerRingSize"
          :arrow-multiplier="arrowMultiplier"
          :spin-duration="spinDuration"
          @inner-complete="onInnerComplete"
          @outer-complete="onOuterComplete"
        />

        <!-- Control Button -->
        <div class="mt-8 z-10" :class="{ 'absolute bottom-8': isFullscreen }">
          <button
            class="btn text-xl px-12 py-4 min-w-[280px] relative text-white"
            :style="{ backgroundColor: isSpinning ? 'var(--accent-hover)' : 'var(--accent)' }"
            @click="startSpinSequence"
            :disabled="isSpinning"
          >
            <span v-if="!isSpinning">Spin the Wheel!</span>
            <span v-else-if="currentStep === 1">🟣 Spinning {{ innerRingTitle }}...</span>
            <span v-else-if="currentStep === 2">🟢 Spinning {{ outerRingTitle }}...</span>
          </button>
        </div>
      </div>

      <!-- Right Side: Settings & Logs -->
      <div class="w-full md:w-[340px] lg:w-[400px] flex flex-col gap-4 pr-1 shrink-0 h-auto md:h-[calc(100vh-100px)] md:sticky md:top-20" v-if="!isFullscreen">
        <SettingsPanel
          :wheel1-segments="innerRingSegments"
          :wheel2-segments="outerRingSegments"
          :game-name="gameTitle"
          :wheel1-name="innerRingTitle"
          :wheel2-name="outerRingTitle"
          :wheel1-size="innerRingSize"
          :wheel2-size="outerRingSize"
          :arrow-size="arrowMultiplier"
          :auto-remove-winner="autoRemoveWinner"
          :current-spin-duration="spinDuration"
          :is-spinning="isSpinning"
          :is-fullscreen="isFullscreen"
          @save="handleSettingsSave"
          @toggle-fullscreen="toggleFullScreen"
        />
        <WinnerLog
          :logs="winnerLogs"
          :inner-name="innerRingTitle"
          :outer-name="outerRingTitle"
          @clear="clearLogs"
        />
      </div>
    </div>

    <!-- Website Footer -->
    <footer class="p-10 md:p-16 mt-auto relative overflow-hidden" :style="{ backgroundColor: 'var(--bg-header)', borderTop: '1px solid var(--border-color)' }" v-if="!isFullscreen">
      <div class="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <!-- Brand Column -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :style="{ backgroundColor: 'var(--accent)' }">
          🎡
        </div>
        <div class="flex flex-col">
          <h2 class="text-base font-black tracking-tighter m-0 leading-none" :style="{ color: 'var(--text-primary)' }">
              SPIN MO TO <span :style="{ color: 'var(--accent)' }">WHEELS</span>
            </h2>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]" :style="{ color: 'var(--text-muted)' }">
              PINAIKOT KA LANG KASI!
          </span>
        </div>
      </div>
          </div>
          <p class="text-sm leading-relaxed mb-6" :style="{ color: 'var(--text-muted)' }">
            The ultimate tool for choosing winners, making decisions, and adding extra fun to your events. Fully customizable and high performance.
          </p>
          <!-- <div class="flex gap-4">
            <a href="#" class="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" :style="{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }">🐦</a>
            <a href="#" class="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" :style="{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }">📸</a>
            <a href="#" class="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" :style="{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }">🐙</a>
          </div> -->
        </div>

        <!-- Links Columns -->
        <!-- <div>
          <h4 class="text-xs font-black uppercase tracking-widest mb-6" :style="{ color: 'var(--text-primary)' }">Product</h4>
          <ul class="flex flex-col gap-3 text-sm" :style="{ color: 'var(--text-muted)' }">
            <li><a href="#" class="hover:text-purple-400 transition-colors">Wheel Creator</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Templates</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Features</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">API Docs</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-black uppercase tracking-widest mb-6" :style="{ color: 'var(--text-primary)' }">Support</h4>
          <ul class="flex flex-col gap-3 text-sm" :style="{ color: 'var(--text-muted)' }">
            <li><a href="#" class="hover:text-purple-400 transition-colors">Help Center</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Contact Us</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Feedback</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Privacy</a></li>
          </ul>
        </div> -->

        <!-- Newsletter Column -->
        <!-- <div>
          <h4 class="text-xs font-black uppercase tracking-widest mb-6" :style="{ color: 'var(--text-primary)' }">Newsletter</h4>
          <p class="text-sm mb-4" :style="{ color: 'var(--text-muted)' }">Get notified about new updates and features.</p>
          <div class="flex gap-2">
            <input type="text" placeholder="Your email" class="flex-1 rounded-xl px-4 py-2 text-xs focus:outline-none" :style="{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }" />
            <button class="px-4 py-2 rounded-xl text-xs font-bold text-white" :style="{ backgroundColor: 'var(--accent)' }">Join</button>
          </div>
        </div> -->
      </div>
      
      <div class="max-w-[1600px] mx-auto mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6" :style="{ borderColor: 'var(--border-color)' }">
        <p class="text-[10px] font-bold uppercase tracking-widest" :style="{ color: 'var(--text-muted)' }">
          &copy; 2026 SPINWHEELS. Made with ❤️ for the gaming community.
        </p>
        <!-- <div class="flex gap-8 text-[10px] font-bold uppercase tracking-widest" :style="{ color: 'var(--text-muted)' }">
          <a href="#" class="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-purple-400 transition-colors">Terms of Use</a>
          <a href="#" class="hover:text-purple-400 transition-colors">Cookie Policy</a>
        </div> -->
      </div>
    </footer>

    <!-- Final Results Modal -->
    <div v-if="showFinalResult" class="fixed inset-0 flex items-center justify-center z-[1000] p-4" :style="{ backgroundColor: 'var(--overlay-bg)' }">
      <div class="rounded-3xl p-10 max-w-[500px] w-full text-center shadow-none relative" :style="{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }">
        <h2 class="text-3xl font-bold mb-8" :style="{ color: 'var(--text-accent)' }">🎉 WOWOWIN! 🎉</h2>

        <div class="flex flex-col gap-4 mb-8">
          <div class="rounded-xl p-5" :style="{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)' }">
            <div class="text-xs font-semibold uppercase tracking-widest mb-2" :style="{ color: 'var(--text-muted)' }">🟣 {{ innerRingTitle }}</div>
            <div class="text-2xl font-extrabold" :style="{ color: 'var(--text-primary)' }">{{ finalResults.inner }}</div>
          </div>

          <div class="text-2xl opacity-70" :style="{ color: 'var(--text-accent)' }">⬇️</div>

          <div class="rounded-xl p-5" :style="{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)' }">
            <div class="text-xs font-semibold uppercase tracking-widest mb-2" :style="{ color: 'var(--text-muted)' }">🟢 {{ outerRingTitle }}</div>
            <div class="text-2xl font-extrabold" :style="{ color: 'var(--text-primary)' }">{{ finalResults.outer }}</div>
          </div>
        </div>

        <!-- Remove Winner Buttons -->
        <div class="mb-6 p-4 rounded-xl" :style="{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)' }">
          <p class="text-xs font-semibold uppercase tracking-widest mb-3" :style="{ color: 'var(--text-muted)' }">Remove winner from:</p>
          <div class="flex gap-2">
            <button
              class="flex-1 py-3 px-2 rounded-lg font-bold text-sm transition-none flex items-center justify-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
              @click="removeWinnerFrom('inner')"
              :disabled="innerRingSegments.length === 0"
              :title="'Remove from ' + innerRingTitle"
            >
              🟣 {{ innerRingTitle }}
            </button>
            <button
              class="flex-1 py-3 px-2 rounded-lg font-bold text-sm transition-none flex items-center justify-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
              @click="removeWinnerFrom('outer')"
              :disabled="outerRingSegments.length === 0"
              :title="'Remove from ' + outerRingTitle"
            >
              🟢 {{ outerRingTitle }}
            </button>
            <button
              class="flex-1 py-3 px-2 rounded-lg font-bold text-sm transition-none flex items-center justify-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
              @click="removeWinnerFrom('both')"
              :disabled="innerRingSegments.length === 0 && outerRingSegments.length === 0"
              title="Remove from Both"
            >
              🔴 Both
            </button>
          </div>
        </div>

        <button class="btn w-full py-4 text-lg text-white" :style="{ backgroundColor: 'var(--accent)' }" @click="showFinalResult = false">
          🎲 Spin Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import ConcentricWheel from './ConcentricWheel.vue'
import { useTheme } from '~/composables/useTheme'

const SettingsPanel = defineAsyncComponent(() => import('./SettingsPanel.vue'))
const WinnerLog = defineAsyncComponent(() => import('./WinnerLog.vue'))

// Theme
const { isDark, toggleTheme } = useTheme()

// Navigation
const navPages = [
  { id: 'wheel', label: '🎡 Wheel' },
  { id: 'about', label: 'About' },
  { id: 'support', label: 'Support' }
]
const activePage = ref('wheel')

// Default configurations
const getDefaultInnerRing = () => [
  { label: 'Camping', color: '#10b981' },
  { label: 'Hiking', color: '#3b82f6' },
  { label: 'Food Tour', color: '#f59e0b' },
  { label: 'Photography', color: '#8b5cf6' },
  { label: 'Surfing', color: '#06b6d4' },
  { label: 'Rock Climbing', color: '#ef4444' },
  { label: 'Stargazing', color: '#6366f1' },
  { label: 'Beach Day', color: '#ec4899' }
]

const getDefaultOuterRing = () => [
  { label: 'Mountains', color: '#7c3aed' },
  { label: 'Beach', color: '#0ea5e9' },
  { label: 'City', color: '#f97316' },
  { label: 'Desert', color: '#eab308' },
  { label: 'Forest', color: '#22c55e' },
  { label: 'Island', color: '#14b8a6' },
  { label: 'Countryside', color: '#84cc16' },
  { label: 'Lake', color: '#3b82f6' }
]

// Color palette for random assignment
const colorPalette = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4',
  '#ef4444', '#6366f1', '#ec4899', '#7c3aed', '#0ea5e9',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#84cc16'
]

// Ensure every segment has a color
const ensureColors = (segments) => {
  return segments.map((s, i) => ({
    ...s,
    color: s.color || colorPalette[i % colorPalette.length]
  }))
}

// Use defaults initially (SSR-safe), override in onMounted
const isFullscreen = ref(false)
const wheelRef = ref(null)

const toggleFullScreen = () => {
  const elem = document.getElementById('app-root')
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// Listen for ESC key to update state
if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
}

const innerRingSegments = ref(getDefaultInnerRing())
const outerRingSegments = ref(getDefaultOuterRing())
const innerRingTitle = ref('Inner Ring')
const outerRingTitle = ref('Outer Ring')
const innerRingSize = ref(150)
const outerRingSize = ref(150)
const arrowMultiplier = ref(100)
const autoRemoveWinner = ref(false)
const spinDuration = ref(5) // Default 5s

const currentStep = ref(0) // 0: idle, 1: inner spinning, 2: outer spinning
const gameTitle = ref('Game Tools')
const showFinalResult = ref(false)

const finalResults = reactive({
  inner: '',
  outer: ''
})

// Winner logs
const winnerLogs = ref([])
let logIdCounter = 0

const isSpinning = computed(() => wheelRef.value?.isSpinning || false)

// Audio integration
import { useAudio } from '~/composables/useAudio'
const { playWin, playClick } = useAudio()

// Start the sequential spin
const startSpinSequence = () => {
  if (isSpinning.value) return

  playClick() // Sound effect

  currentStep.value = 1
  showFinalResult.value = false
  finalResults.inner = ''
  finalResults.outer = ''

  // Spin inner ring first
  wheelRef.value.startSpin()
}

// Inner ring completed
const onInnerComplete = (segment) => {
  finalResults.inner = segment.label

  // Wait 0.8 seconds then spin outer ring
  setTimeout(() => {
    currentStep.value = 2
    wheelRef.value.spinOuter()
  }, 800)
}

// Helper to save to localStorage
const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const settings = {
      wheel1: innerRingSegments.value,
      wheel2: outerRingSegments.value,
      gameTitle: gameTitle.value,
      wheel1Title: innerRingTitle.value,
      wheel2Title: outerRingTitle.value,
      wheel1Size: innerRingSize.value,
      wheel2Size: outerRingSize.value,
      arrowMultiplier: arrowMultiplier.value,
      removeWinner: autoRemoveWinner.value,
      spinDuration: spinDuration.value
    }
    localStorage.setItem('wheelSettings', JSON.stringify(settings))
  }
}

// Save logs to localStorage
const saveLogsToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('winnerLogs', JSON.stringify(winnerLogs.value))
  }
}

// Helper to remove winner if enabled
const handleAutoRemove = () => {
  if (autoRemoveWinner.value) {
    removeWinnerFrom('both')
  }
}

// Remove winner from specific ring(s)
const removeWinnerFrom = (target) => {
  let removed = false

  if (target === 'inner' || target === 'both') {
    if (innerRingSegments.value.length > 0) {
      const idx = innerRingSegments.value.findIndex(s => s.label === finalResults.inner)
      if (idx !== -1) {
        innerRingSegments.value.splice(idx, 1)
        removed = true
      }
    }
  }

  if (target === 'outer' || target === 'both') {
    if (outerRingSegments.value.length > 0) {
      const idx = outerRingSegments.value.findIndex(s => s.label === finalResults.outer)
      if (idx !== -1) {
        outerRingSegments.value.splice(idx, 1)
        removed = true
      }
    }
  }

  if (removed) {
    saveToLocalStorage()
    showFinalResult.value = false
  }
}

// Outer ring completed
const onOuterComplete = (segment) => {
  finalResults.outer = segment.label

  // Show final results
  setTimeout(() => {
    currentStep.value = 0
    showFinalResult.value = true
    playWin() // Win sound

    // Add to winner log
    winnerLogs.value.push({
      id: ++logIdCounter,
      inner: finalResults.inner,
      outer: finalResults.outer,
      timestamp: Date.now()
    })
    saveLogsToLocalStorage()

    handleAutoRemove() // Remove winners if setting enabled
  }, 500)
}

// Clear logs
const clearLogs = () => {
  winnerLogs.value = []
  saveLogsToLocalStorage()
}

// Handle settings save
const handleSettingsSave = (settings) => {
  innerRingSegments.value = settings.wheel1
  outerRingSegments.value = settings.wheel2
  gameTitle.value = settings.gameTitle || 'Wheels'
  innerRingTitle.value = settings.wheel1Title
  outerRingTitle.value = settings.wheel2Title
  innerRingSize.value = settings.wheel1Size
  outerRingSize.value = settings.wheel2Size
  arrowMultiplier.value = settings.arrowMultiplier || 100
  autoRemoveWinner.value = settings.removeWinner
  spinDuration.value = settings.spinDuration

  saveToLocalStorage()
}

// Load from localStorage on client mount (avoids SSR mismatch)
onMounted(() => {
  const saved = localStorage.getItem('wheelSettings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.wheel1) innerRingSegments.value = ensureColors(parsed.wheel1)
      if (parsed.wheel2) outerRingSegments.value = ensureColors(parsed.wheel2)
      if (parsed.gameTitle) gameTitle.value = parsed.gameTitle
      if (parsed.wheel1Title) innerRingTitle.value = parsed.wheel1Title
      if (parsed.wheel2Title) outerRingTitle.value = parsed.wheel2Title
      if (parsed.wheel1Size) innerRingSize.value = parsed.wheel1Size
      if (parsed.wheel2Size) outerRingSize.value = parsed.wheel2Size
      if (parsed.arrowMultiplier) arrowMultiplier.value = parsed.arrowMultiplier
      if (parsed.removeWinner) autoRemoveWinner.value = parsed.removeWinner
      if (parsed.spinDuration) spinDuration.value = parsed.spinDuration
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }

  const savedLogs = localStorage.getItem('winnerLogs')
  if (savedLogs) {
    try {
      winnerLogs.value = JSON.parse(savedLogs)
      if (winnerLogs.value.length > 0) {
        logIdCounter = Math.max(...winnerLogs.value.map(l => l.id))
      }
    } catch (e) {
      console.error('Failed to load logs:', e)
    }
  }
})
</script>

<style>
/* Global style adjustments that are specific to this component but not scoped */
</style>
