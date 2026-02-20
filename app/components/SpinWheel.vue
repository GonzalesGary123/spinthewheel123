<template>
  <div class="wheel-container">
    <div class="wheel-wrapper">
      <!-- Pointer/Arrow -->
      <div class="wheel-pointer">
        <svg width="40" height="60" viewBox="0 0 40 60">
          <path d="M20 0 L40 20 L25 20 L25 60 L15 60 L15 20 L0 20 Z" fill="#facc15" />
        </svg>
      </div>
      
      <!-- Wheel -->
      <div 
        class="wheel" 
        :style="{ transform: `rotate(${rotation}deg)` }"
        ref="wheelRef"
      >
        <svg viewBox="0 0 400 400" class="wheel-svg">
          <!-- Segments -->
          <g v-for="(segment, index) in segments" :key="index">
            <path
              :d="getSegmentPath(index)"
              :fill="segment.color"
              :stroke="segment.stroke || '#ffffff'"
              stroke-width="2"
              class="wheel-segment"
            />
            <text
              :x="getTextX(index)"
              :y="getTextY(index)"
              :transform="getTextTransform(index)"
              class="segment-text"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ segment.label }}
            </text>
          </g>
          
          <!-- Center Circle -->
          <circle cx="200" cy="200" r="30" fill="#6d28d9" stroke="#ffffff" stroke-width="3" />
          <circle cx="200" cy="200" r="15" fill="#5b21b6" />
        </svg>
      </div>
    </div>
    
    <!-- Result Display -->
    <div v-if="result" class="result-display fade-in">
      <div class="result-label">{{ wheelLabel }}</div>
      <div class="result-value">{{ result }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  segments: {
    type: Array,
    required: true,
    // Each segment: { label: String, color: String }
  },
  wheelLabel: {
    type: String,
    default: 'Result'
  }
})

const emit = defineEmits(['spinComplete'])

const rotation = ref(0)
const isSpinning = ref(false)
const result = ref(null)
const wheelRef = ref(null)

const segmentAngle = computed(() => 360 / props.segments.length)

// Generate SVG path for each segment
const getSegmentPath = (index) => {
  const angle = segmentAngle.value
  const startAngle = (index * angle - 90) * (Math.PI / 180)
  const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180)
  
  const radius = 180
  const centerX = 200
  const centerY = 200
  
  const x1 = centerX + radius * Math.cos(startAngle)
  const y1 = centerY + radius * Math.sin(startAngle)
  const x2 = centerX + radius * Math.cos(endAngle)
  const y2 = centerY + radius * Math.sin(endAngle)
  
  const largeArcFlag = angle > 180 ? 1 : 0
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

// Get text position
const getTextX = (index) => {
  const angle = (index * segmentAngle.value + segmentAngle.value / 2 - 90) * (Math.PI / 180)
  const radius = 130
  return 200 + radius * Math.cos(angle)
}

const getTextY = (index) => {
  const angle = (index * segmentAngle.value + segmentAngle.value / 2 - 90) * (Math.PI / 180)
  const radius = 130
  return 200 + radius * Math.sin(angle)
}

const getTextTransform = (index) => {
  const angle = index * segmentAngle.value + segmentAngle.value / 2
  const x = getTextX(index)
  const y = getTextY(index)
  return `rotate(${angle}, ${x}, ${y})`
}

// Spin the wheel
const spin = () => {
  if (isSpinning.value) return
  
  isSpinning.value = true
  result.value = null
  
  // Random spins (5-8 full rotations) plus a random angle
  const spins = 5 + Math.floor(Math.random() * 4)
  const extraDegrees = Math.floor(Math.random() * 360)
  const totalRotation = spins * 360 + extraDegrees
  
  // Calculate which segment we'll land on
  const finalAngle = (rotation.value + totalRotation) % 360
  const segmentIndex = Math.floor(((360 - finalAngle + 90) % 360) / segmentAngle.value) % props.segments.length
  
  rotation.value += totalRotation
  
  // Wait for animation to complete
  setTimeout(() => {
    isSpinning.value = false
    result.value = props.segments[segmentIndex].label
    emit('spinComplete', props.segments[segmentIndex])
  }, 4000) // Match CSS transition duration
}

// Expose spin method to parent
defineExpose({
  spin,
  isSpinning
})
</script>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.wheel-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
}

.wheel-pointer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}

.wheel-svg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.wheel-segment {
  cursor: pointer;
}

.segment-text {
  font-size: 16px;
  font-weight: 700;
  fill: #ffffff;
  pointer-events: none;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'Outfit', sans-serif;
}

.result-display {
  text-align: center;
  padding: 1.5rem 2rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  min-width: 200px;
}

.result-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #c084fc;
}

@media (max-width: 768px) {
  .wheel-wrapper {
    max-width: 300px;
  }
  
  .segment-text {
    font-size: 12px;
  }
}
</style>
