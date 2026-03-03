<template>
  <div class="concentric-wheel-container">
    <div class="wheel-wrapper" :style="{ maxWidth: (totalRadius * 2 + 100) + 'px' }">
      <svg :viewBox="viewBox" class="concentric-svg">
        <defs>
        </defs>
        
        <g 
          class="outer-ring" 
          :style="{ 
            transform: `rotate(${outerRotation}deg)`, 
            transformOrigin: '400px 400px',
            willChange: 'transform'
          }"
        >
          <g 
            v-for="(segment, index) in outerSegments" 
            :key="'outer-group-' + index"
            :style="getSegmentStyle(index, 'outer')"
            class="segment-group"
          >
            <path
              :d="getOuterSegmentPath(index)"
              :fill="segment.color"
              :class="{ 'ring-segment': true, 'winner-glow': index === winningOuterIndex }"
              stroke="#ffffff"
              stroke-width="3"
            />
            <text
              :transform="getOuterTextTransform(index)"
              class="segment-text"
              :style="{ 
                fontSize: (index === winningOuterIndex ? dynamicOuterFontSize * 1.4 : dynamicOuterFontSize) + 'px',
                fontWeight: index === winningOuterIndex ? '900' : '600'
              }"
              text-anchor="middle"
              dominant-baseline="central"
              alignment-baseline="middle"
            >
              {{ formatLabel(segment.label, outerSegments.length, 'outer') }}
            </text>
          </g>
        </g>
        
        <g 
          class="inner-ring" 
          :style="{ 
            transform: `rotate(${innerRotation}deg)`, 
            transformOrigin: '400px 400px',
            willChange: 'transform'
          }"
        >
          <g
            v-for="(segment, index) in innerSegments"
            :key="'inner-group-' + index"
            :style="getSegmentStyle(index, 'inner')"
            class="segment-group"
          >
            <path
              :d="getInnerSegmentPath(index)"
              :fill="segment.color"
              :class="{ 'ring-segment': true, 'winner-glow': index === winningInnerIndex }"
              stroke="#ffffff"
              stroke-width="3"
            />
            <text
              :transform="getInnerTextTransform(index)"
              class="segment-text"
              :style="{ 
                fontSize: (index === winningInnerIndex ? dynamicInnerFontSize * 1.4 : dynamicInnerFontSize) + 'px',
                fontWeight: index === winningInnerIndex ? '900' : '600'
              }"
              text-anchor="middle"
              dominant-baseline="central"
              alignment-baseline="middle"
            >
              {{ formatLabel(segment.label, innerSegments.length, 'inner') }}
            </text>
          </g>
        </g>
        
        <!-- Center Hub -->
        <circle cx="400" cy="400" r="50" fill="#6d28d9" stroke="#ffffff" stroke-width="4" />
        <circle cx="400" cy="400" r="25" fill="#5b21b6" />
        
        <!-- Fixed Pointer at Top - slides between inner/outer ring -->
        <g 
          class="pointer"
          :style="{ 
            transform: `translateY(${pointerOffset}px) scale(${pointerScale})`,
            transformOrigin: '400px 25px'
          }"
        >
          <path 
            d="M 370 -45 L 430 -45 L 400 25 Z" 
            fill="#facc15" 
            stroke="#ffffff"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </div>
    
    <!-- Results Display -->
    <!-- <div v-if="innerResult || outerResult" class="results-panel fade-in">
      <div v-if="innerResult" class="result-item">
        <div class="result-label">🟣 Inner Ring</div>
        <div class="result-value">{{ innerResult }}</div>
      </div>
      <div v-if="outerResult" class="result-item">
        <div class="result-label">🟢 Outer Ring</div>
        <div class="result-value">{{ outerResult }}</div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAudio } from '~/composables/useAudio'

const props = defineProps({
  innerSegments: { type: Array, required: true },
  outerSegments: { type: Array, required: true },
  innerThickness: { type: Number, default: 150 },
  outerThickness: { type: Number, default: 150 },
  arrowMultiplier: { type: Number, default: 100 },
  spinDuration: { type: Number, default: 5 }
})

const emit = defineEmits(['spinComplete'])

const innerRotation = ref(0)
const outerRotation = ref(0)
const isInnerSpinning = ref(false)
const isOuterSpinning = ref(false)
const innerResult = ref(null)
const outerResult = ref(null)
const winningInnerIndex = ref(-1)
const winningOuterIndex = ref(-1)

const isSpinning = computed(() => isInnerSpinning.value || isOuterSpinning.value)

// Dynamic Radii based on props
// Inner ring - Starts from 10, ends at thickness
const INNER_RADIUS_INNER = 10
const INNER_RADIUS_OUTER = computed(() => INNER_RADIUS_INNER + props.innerThickness)

// Outer ring - Starts after inner with a 10px gap
const OUTER_RADIUS_INNER = computed(() => INNER_RADIUS_OUTER.value + 10)
const OUTER_RADIUS_OUTER = computed(() => OUTER_RADIUS_INNER.value + props.outerThickness)

const CENTER_X = 400
const CENTER_Y = 400

// Helper to convert polar to cartesian - angle 0 is at top (12 o'clock)
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  // Convert to radians and rotate so 0° is at top
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

// Generate SVG path for a ring segment (donut slice)
const getRingSegmentPath = (index, totalSegments, innerRadius, outerRadius) => {
  const anglePerSegment = 360 / totalSegments
  const startAngle = index * anglePerSegment
  const endAngle = startAngle + anglePerSegment
  
  // Get the four corner points of the segment
  const p1 = polarToCartesian(CENTER_X, CENTER_Y, outerRadius, startAngle)  // outer start
  const p2 = polarToCartesian(CENTER_X, CENTER_Y, outerRadius, endAngle)    // outer end
  const p3 = polarToCartesian(CENTER_X, CENTER_Y, innerRadius, endAngle)    // inner end
  const p4 = polarToCartesian(CENTER_X, CENTER_Y, innerRadius, startAngle)  // inner start
  
  // Large arc flag: 1 if angle > 180°, 0 otherwise
  const largeArc = anglePerSegment > 180 ? 1 : 0
  
  // Create the path:
  // M: move to outer start
  // A: arc to outer end (clockwise)
  // L: line to inner end
  // A: arc back to inner start (counter-clockwise)
  // Z: close path
  return `
    M ${p1.x},${p1.y}
    A ${outerRadius},${outerRadius} 0 ${largeArc},1 ${p2.x},${p2.y}
    L ${p3.x},${p3.y}
    A ${innerRadius},${innerRadius} 0 ${largeArc},0 ${p4.x},${p4.y}
    Z
  `.replace(/\s+/g, ' ').trim()
}

// Updated helper to use computed radii
const getInnerSegmentPath = (index) => {
  return getRingSegmentPath(index, props.innerSegments.length, INNER_RADIUS_INNER, INNER_RADIUS_OUTER.value)
}

const getOuterSegmentPath = (index) => {
  return getRingSegmentPath(index, props.outerSegments.length, OUTER_RADIUS_INNER.value, OUTER_RADIUS_OUTER.value)
}

// Text positioning utility - Radial/Vertical alignment
const getTextTransform = (index, totalSegments, innerR, outerR) => {
  const anglePerSegment = 360 / totalSegments
  const angle = index * anglePerSegment + anglePerSegment / 2
  const radius = (innerR + outerR) / 2
  const pos = polarToCartesian(CENTER_X, CENTER_Y, radius, angle)
  // Use translate then rotate for better precision
  return `translate(${pos.x}, ${pos.y}) rotate(${angle + 90})`
}

const getInnerTextTransform = (index) => getTextTransform(index, props.innerSegments.length, INNER_RADIUS_INNER, INNER_RADIUS_OUTER.value)
const getOuterTextTransform = (index) => getTextTransform(index, props.outerSegments.length, OUTER_RADIUS_INNER.value, OUTER_RADIUS_OUTER.value)

// X/Y helpers are now integrated into the single transform for better alignment

// Selected/Winner "Rise Above" effect logic
const getSegmentStyle = (index, type) => {
  const isWinner = type === 'inner' ? index === winningInnerIndex.value : index === winningOuterIndex.value
  if (!isWinner) return {}
  
  const totalSegments = type === 'inner' ? props.innerSegments.length : props.outerSegments.length
  const anglePerSegment = 360 / totalSegments
  const angle = index * anglePerSegment + anglePerSegment / 2
  
  // Calculate radial shift (15px outwards)
  const shiftAmount = 15
  const angleRad = ((angle - 90) * Math.PI) / 180
  const tx = shiftAmount * Math.cos(angleRad)
  const ty = shiftAmount * Math.sin(angleRad)
  
  return {
    transform: `translate(${tx}px, ${ty}px) scale(1.02)`,
    zIndex: 10
  }
}

// New responsive pointer logic
const totalRadius = computed(() => OUTER_RADIUS_OUTER.value)

// Dynamic scale for the arrow so it doesn't look tiny on thick wheels
const pointerScale = computed(() => {
  const thickness = isOuterSpinning.value ? props.outerThickness : props.innerThickness
  const userScale = props.arrowMultiplier / 100
  // Combine thickness scaling with user manual scaling
  const baseScale = Math.min(0.8, Math.max(0.8, thickness / 150))
  return baseScale * userScale
})

const pointerOffset = computed(() => {
  const currentOuterRadius = isOuterSpinning.value ? OUTER_RADIUS_OUTER.value : INNER_RADIUS_OUTER.value
  // The tip of our arrow is at Y=25 relative to the pointer group
  // To have the tip land exactly on the ring edge: pointerOffset + 25 = 400 - currentOuterRadius
  return 375 - currentOuterRadius + 5 // +5 for a nice overlap onto the color
})

// Dynamic viewBox to ensure "surroundings" adjust
const viewBox = computed(() => {
  const padding = 120 // Extra padding for larger arrow
  const size = (totalRadius.value * 2) + padding
  const x = 400 - (size / 2)
  const y = 400 - totalRadius.value - padding 
  return `${x} ${y} ${size} ${size}`
})

const innerSegmentAngle = computed(() => props.innerSegments.length > 0 ? 360 / props.innerSegments.length : 0)
const outerSegmentAngle = computed(() => props.outerSegments.length > 0 ? 360 / props.outerSegments.length : 0)

// Readability enhancements
const formatLabel = (label, total, type) => {
  if (!label) return ''
  
  // Both rings now have approx 190px thickness
  let maxLength = 18
  
  if (total > 45) maxLength = Math.floor(maxLength * 0.5)
  else if (total > 35) maxLength = Math.floor(maxLength * 0.7)
  else if (total > 25) maxLength = Math.floor(maxLength * 0.85)
  
  if (label.length > maxLength) {
    return label.substring(0, Math.max(1, maxLength - 1)) + '…'
  }
  return label
}

const dynamicInnerFontSize = computed(() => {
  const count = props.innerSegments.length
  if (count > 50) return 6
  if (count > 40) return 8
  if (count > 30) return 10
  if (count > 20) return 12
  if (count > 10) return 14
  return 15
})

const dynamicOuterFontSize = computed(() => {
  const count = props.outerSegments.length
  if (count > 60) return 6
  if (count > 45) return 8
  if (count > 30) return 11
  if (count > 20) return 13
  if (count > 10) return 15
  return 16
})

const { playTick, initAudio } = useAudio()

// Physics-based Animation Function
const animateRotation = (duration, startRot, totalRot, isInner, onComplete) => {
  const startTime = performance.now()
  const segmentAngle = isInner ? innerSegmentAngle.value : outerSegmentAngle.value
  let lastTickAngle = startRot

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing: easeOutQuart (1 - (1 - progress)^4)
    const easingProgress = 1 - Math.pow(1 - progress, 4)
    const currentRot = startRot + (totalRot * easingProgress)

    // Update the ref
    if (isInner) {
      innerRotation.value = currentRot
    } else {
      outerRotation.value = currentRot
    }

    // Audio Tick Logic: Play sound when crossing a segment boundary
    if (Math.abs(currentRot - lastTickAngle) >= segmentAngle) {
      playTick()
      lastTickAngle = currentRot
    }

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      if (onComplete) onComplete()
    }
  }

  requestAnimationFrame(step)
}

// Spin the inner ring
const spinInner = (forcedIndex = null) => {
  if (isInnerSpinning.value || isOuterSpinning.value) return
  
  initAudio()
  
  if (props.innerSegments.length === 0) {
    innerResult.value = 'None'
    emit('innerComplete', { label: 'None' })
    return
  }
  
  isInnerSpinning.value = true
  innerResult.value = null
  outerResult.value = null
  winningInnerIndex.value = -1
  winningOuterIndex.value = -1
  
  // Physics Calculation: 5-8 whole rotations

  
  // Choose a winning index (random if not forced)
  const segmentIndex = forcedIndex !== null ? forcedIndex : Math.floor(Math.random() * props.innerSegments.length)
  
  // Land anywhere inside the segment (not just the middle!)
  // Avoid the exact edges (leave 1 degree buffer)
  const angleBuffer = Math.min(2, innerSegmentAngle.value / 4)
  const randomOffsetInSegment = angleBuffer + Math.random() * (innerSegmentAngle.value - (angleBuffer * 2))
  const targetAngleInSegment = (segmentIndex * innerSegmentAngle.value) + randomOffsetInSegment
  
  const currentRotModulo = innerRotation.value % 360
  const desiredFinalRotModulo = (360 - targetAngleInSegment) % 360
  
  // Scale spins based on duration to maintain speed feel
  // Add an extra random "chaos" factor (±2 whole rotations)
  const chaosSpins = Math.floor(Math.random() * 5) - 2
  const baseSpins = Math.max(5, Math.floor(props.spinDuration * 1.8))
  const fullSpins = Math.max(3, Math.floor(baseSpins + Math.random() * (baseSpins * 0.4)) + chaosSpins)
  
  let extraDegrees = desiredFinalRotModulo - currentRotModulo
  if (extraDegrees <= 0) extraDegrees += 360
  
  const totalRotation = fullSpins * 360 + extraDegrees
  const startRot = innerRotation.value
  
  // Vary the actual duration slightly (±0.5s) for a more organic feel
  const actualDuration = (props.spinDuration * 1000) + (Math.random() * 1000 - 500)

  animateRotation(actualDuration, startRot, totalRotation, true, () => {
    isInnerSpinning.value = false
    winningInnerIndex.value = segmentIndex
    innerResult.value = props.innerSegments[segmentIndex].label
    emit('innerComplete', props.innerSegments[segmentIndex])
  })
}

// Spin the outer ring
const spinOuter = (forcedIndex = null) => {
  if (isOuterSpinning.value) return
  
  if (props.outerSegments.length === 0) {
    outerResult.value = 'None'
    emit('outerComplete', { label: 'None' })
    return
  }
  
  isOuterSpinning.value = true
  
  // Physics Calculation: 5-8 whole rotations

  // Choose a winning index (random if not forced)
  const segmentIndex = forcedIndex !== null ? forcedIndex : Math.floor(Math.random() * props.outerSegments.length)
  
  // Land anywhere inside the segment (not just the middle!)
  const angleBuffer = Math.min(2, outerSegmentAngle.value / 4)
  const randomOffsetInSegment = angleBuffer + Math.random() * (outerSegmentAngle.value - (angleBuffer * 2))
  const targetAngleInSegment = (segmentIndex * outerSegmentAngle.value) + randomOffsetInSegment
  
  const currentRotModulo = outerRotation.value % 360
  const desiredFinalRotModulo = (360 - targetAngleInSegment) % 360
  
  // Scale spins based on duration
  const chaosSpins = Math.floor(Math.random() * 5) - 2
  const baseSpins = Math.max(5, Math.floor(props.spinDuration * 2.0))
  const fullSpins = Math.max(3, Math.floor(baseSpins + Math.random() * (baseSpins * 0.4)) + chaosSpins)
  
  let extraDegrees = desiredFinalRotModulo - currentRotModulo
  if (extraDegrees <= 0) extraDegrees += 360
  
  const totalRotation = fullSpins * 360 + extraDegrees
  const startRot = outerRotation.value
  
  const actualDuration = (props.spinDuration * 1000) + (Math.random() * 1000 - 500)
  
  animateRotation(actualDuration, startRot, totalRotation, false, () => {
    isOuterSpinning.value = false
    winningOuterIndex.value = segmentIndex
    outerResult.value = props.outerSegments[segmentIndex].label
    emit('outerComplete', props.outerSegments[segmentIndex])
  })
}

// Start sequential spin
const startSpin = (innerForced = null) => {
  spinInner(innerForced)
}

// Expose methods
defineExpose({
  startSpin,
  spinOuter,
  isSpinning
})
</script>

<style scoped>
.concentric-wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.wheel-wrapper {
  width: 100%;
  max-height: 70vh;
  aspect-ratio: 1;
  position: relative;
}

.concentric-svg {
  width: 100%;
  height: 100%;
  text-rendering: optimizeSpeed;
  shape-rendering: geometricPrecision;
}

.inner-ring,
.outer-ring {
  /* Removed CSS transition to allow programmatic control via requestAnimationFrame */
  will-change: transform;
  transform: translateZ(0); /* Hardware acceleration */
}



.segment-group {
  cursor: pointer;
  transform-origin: 400px 400px;
}

.winner-glow {
  stroke-width: 4;
  stroke: #ffffff !important;
  z-index: 10;
}



.segment-text {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  fill: #ffffff;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
}



</style>
