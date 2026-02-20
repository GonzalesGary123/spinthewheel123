<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Wheel Settings</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-body">
        <!-- Sidebar / Tabs -->
        <div class="sidebar">
          <div 
            class="tab-btn" 
            :class="{ active: activeTab === 'inner' }"
            @click="activeTab = 'inner'"
          >
            <div class="tab-icon" style="color: #a855f7">🟣</div>
            <div class="tab-info">
              <span class="tab-title">Inner Ring</span>
              <span class="tab-count">{{ innerLines.length }} entries</span>
            </div>
          </div>
          
          <div 
            class="tab-btn" 
            :class="{ active: activeTab === 'outer' }"
            @click="activeTab = 'outer'"
          >
            <div class="tab-icon" style="color: #22c55e">🟢</div>
            <div class="tab-info">
              <span class="tab-title">Outer Ring</span>
              <span class="tab-count">{{ outerLines.length }} entries</span>
            </div>
          </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="main-content">
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="toolbar-group">
              <button class="tool-btn" @click="shuffleCurrent" title="Shuffle Lines">
                🔀 Shuffle
              </button>
              <button class="tool-btn" @click="sortCurrent" title="Sort Alphabetically">
                ⬇️ Sort
              </button>
            </div>
            
            <!-- <div class="toolbar-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="removeWinner"> Remove Winner
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="advancedMode"> Advanced
              </label>
            </div> -->
          </div>
          
          <!-- Text Area Editor -->
          <div class="editor-container">
            <input 
              v-if="activeTab === 'inner'"
              v-model="innerTitle"
              class="ring-title-input"
              placeholder="Inner Ring Title"
            />
            <input 
              v-else
              v-model="outerTitle"
              class="ring-title-input"
              placeholder="Outer Ring Title"
            />
            
            <textarea
              v-if="activeTab === 'inner'"
              v-model="innerText"
              class="entries-textarea"
              placeholder="Enter items here (one per line)"
              spellcheck="false"
            ></textarea>
            <textarea
              v-else
              v-model="outerText"
              class="entries-textarea"
              placeholder="Enter items here (one per line)"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="resetToDefaults">
          Reset Defaults
        </button>
        <button class="btn btn-primary" @click="saveSettings">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  wheel1Segments: Array,
  wheel2Segments: Array,
  wheel1Name: String,
  wheel2Name: String,
  autoRemoveWinner: Boolean
})

const emit = defineEmits(['close', 'save'])

// State
const activeTab = ref('inner')
const advancedMode = ref(false)

// Data
const innerTitle = ref(props.wheel1Name)
const outerTitle = ref(props.wheel2Name)
const innerText = ref('')
const outerText = ref('')
const removeWinner = ref(props.autoRemoveWinner || false)

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
}

const sortCurrent = () => {
  if (activeTab.value === 'inner') {
    const lines = innerText.value.split('\n').filter(l => l.trim())
    innerText.value = lines.sort((a, b) => a.localeCompare(b)).join('\n')
  } else {
    const lines = outerText.value.split('\n').filter(l => l.trim())
    outerText.value = lines.sort((a, b) => a.localeCompare(b)).join('\n')
  }
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
    // Try to keep existing color if index matches, otherwise random
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
  
  // validation: ensure at least 2 items
  if (newInner.length < 2 || newOuter.length < 2) {
    alert('Both rings must have at least 2 items!')
    return
  }

  emit('save', {
    wheel1: newInner,
    wheel2: newOuter,
    wheel1Title: innerTitle.value,
    wheel2Title: outerTitle.value,
    removeWinner: removeWinner.value
  })
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background: var(--modal-bg);
  width: 900px;
  max-width: 95vw;
  height: 600px;
  max-height: 90vh;
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  overflow: hidden;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--panel-header-bg);
}

.modal-header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-accent);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: var(--panel-header-bg);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.tab-btn {
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 3px solid transparent;
}

.tab-btn:hover {
  background: var(--bg-hover);
}

.tab-btn.active {
  background: rgba(139, 92, 246, 0.1);
  border-left-color: var(--accent);
}

.tab-info {
  display: flex;
  flex-direction: column;
}

.tab-title {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
}

.tab-count {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--modal-bg);
  padding: 1rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
}

.toolbar-group {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  background: var(--accent);
  border: none;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tool-btn:hover {
  background: var(--accent-hover);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
}

.ring-title-input {
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
}

.ring-title-input:focus {
  outline: none;
  border-color: var(--accent);
}

.entries-textarea {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 1rem;
  border-radius: 6px;
  resize: none;
  font-family: monospace;
  font-size: 0.95rem;
  line-height: 1.6;
}

.entries-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-subtle);
  background: var(--panel-header-bg);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--bg-input);
  color: var(--text-primary);
}

.btn-primary {
  background: var(--accent);
  color: #ffffff;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-body {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #2f334d;
    padding: 0;
  }
  
  .tab-btn {
    flex: 1;
    justify-content: center;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .tab-btn.active {
    border-left-color: transparent;
    border-bottom-color: var(--accent);
  }
}
</style>
