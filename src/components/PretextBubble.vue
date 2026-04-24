<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { prepareWithSegments, walkLineRanges, layoutWithLines } from '@chenglou/pretext'

const props = defineProps<{
  text: string
  fontSize?: string
  maxWidth?: number
  paddingX?: number
  paddingY?: number
  theme?: 'green' | 'blue' | 'gold' | 'purple'
  className?: string
  shrinkwrap?: boolean
}>()

const FONT_SIZE = props.fontSize || '14px "Noto Sans SC", sans-serif'
const MAX_WIDTH = props.maxWidth || 400
const LINE_HEIGHT = 20
const PADDING_X = props.paddingX ?? 24
const PADDING_Y = props.paddingY ?? 12

const bubbleWidth = ref<number | null>(null)
const bubbleHeight = ref<number | null>(null)

const calculateSize = () => {
  const prepared = prepareWithSegments(props.text, FONT_SIZE)
  
  const { lines } = layoutWithLines(prepared, MAX_WIDTH, LINE_HEIGHT)
  
  const maxLineWidth = Math.max(...lines.map(l => l.width))
  const totalHeight = lines.length * LINE_HEIGHT
  
  bubbleWidth.value = Math.ceil(maxLineWidth + PADDING_X * 2)
  bubbleHeight.value = Math.ceil(totalHeight + PADDING_Y * 2)
}

onMounted(() => {
  calculateSize()
})

watch(() => props.text, () => {
  calculateSize()
})

const themes = {
  green: 'border-eco-green-400/40 shadow-[0_0_20px_rgba(0,255,136,0.2)] text-eco-green-400 glow-green',
  blue: 'border-smart-blue-400/40 shadow-[0_0_20px_rgba(0,212,255,0.2)] text-smart-blue-400 glow-blue',
  gold: 'border-earth-gold-400/40 shadow-[0_0_20px_rgba(255,204,51,0.2)] text-earth-gold-400 glow-gold',
  purple: 'border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.2)] text-purple-400 glow-purple'
}
</script>

<template>
  <div 
    class="glass-panel rounded-2xl border backdrop-blur-xl transition-all duration-700 ease-out hover:scale-110 active:scale-95 group overflow-hidden flex flex-col justify-center"
    :class="[themes[theme || 'green'], className]"
    :style="{ 
      width: bubbleWidth ? `${bubbleWidth}px` : 'fit-content',
      height: bubbleHeight ? `${bubbleHeight}px` : 'auto',
      padding: `${PADDING_Y}px ${PADDING_X}px`
    }"
  >
    <div class="relative z-10 flex flex-col">
      <span class="opacity-60 mb-1 block font-['Noto_Sans_SC'] text-[10px] uppercase tracking-[2px] group-hover:opacity-100 transition-opacity">
        <slot name="label">Metrics</slot>
      </span>
      <div class="flex items-baseline gap-1.5">
        <span class="font-['Orbitron'] font-bold text-2xl leading-none">
          {{ text }}
        </span>
        <span class="font-['Noto_Sans_SC'] font-bold text-xs opacity-70 mb-0.5">
          <slot name="unit"></slot>
        </span>
      </div>
    </div>
    
    <!-- Animated Border Glow -->
    <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    
    <!-- Core Pulse -->
    <div class="absolute -inset-2 bg-current opacity-[0.03] group-hover:opacity-10 rounded-full blur-2xl transition-all duration-500"></div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(15, 23, 42, 0.6);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05);
}

.glow-green { text-shadow: 0 0 10px rgba(0, 255, 136, 0.5); }
.glow-blue { text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
.glow-gold { text-shadow: 0 0 10px rgba(255, 204, 51, 0.5); }
.glow-purple { text-shadow: 0 0 10px rgba(168, 85, 247, 0.5); }

@keyframes pulse-slow {
  0%, 100% { opacity: 0.03; transform: scale(1); }
  50% { opacity: 0.08; transform: scale(1.05); }
}

.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.05));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
</style>
