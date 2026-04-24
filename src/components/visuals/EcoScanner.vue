<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  color?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

interface Particle {
  angle: number
  radius: number
  size: number
  alpha: number
  decay: number
}

const particles: Particle[] = []

const initParticles = (count: number) => {
  for (let i = 0; i < count; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: 50 + Math.random() * 100,
      size: 1 + Math.random() * 2,
      alpha: 0,
      decay: 0.01 + Math.random() * 0.02
    })
  }
}

const draw = () => {
  if (!ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value
  ctx.clearRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = Math.min(width, height) * 0.45
  const time = Date.now() * 0.001
  const accentColor = props.color || '#00ff88'

  // 1. Radar Circular Grids
  if (ctx) {
    ctx.strokeStyle = `${accentColor}11`
    ctx.lineWidth = 1
  }
  for (let r = 1; r <= 3; r++) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, maxRadius * (r / 3), 0, Math.PI * 2)
    ctx?.stroke()
  }

  // 2. Rotating Scanner Beam
  const beamAngle = (time * 1.5) % (Math.PI * 2)
  const gradient = ctx.createConicGradient(beamAngle, centerX, centerY)
  gradient.addColorStop(0, `${accentColor}88`)
  gradient.addColorStop(0.2, `${accentColor}22`)
  gradient.addColorStop(0.5, `${accentColor}00`)
  gradient.addColorStop(1, `${accentColor}00`)

  if (ctx) ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.arc(centerX, centerY, maxRadius, beamAngle - 0.8, beamAngle)
  ctx?.fill()

  // 3. Particles triggered by beam
  particles.forEach(p => {
    // Check if beam is passing over particle
    const angleDiff = Math.abs((p.angle - beamAngle + Math.PI * 2) % (Math.PI * 2))
    if (angleDiff < 0.1) {
      p.alpha = 1
    }

    if (p.alpha > 0) {
      const px = centerX + Math.cos(p.angle) * p.radius
      const py = centerY + Math.sin(p.angle) * p.radius
      
      if (ctx) {
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = accentColor
      }
      ctx?.beginPath()
      ctx?.arc(px, py, p.size, 0, Math.PI * 2)
      ctx?.fill()
      
      p.alpha -= p.decay
    }
  })
  if (ctx) ctx.globalAlpha = 1

  // 4. Center Core
  if (ctx) {
    ctx.shadowBlur = 15
    ctx.shadowColor = accentColor
    ctx.fillStyle = accentColor
  }
  ctx?.beginPath()
  ctx?.arc(centerX, centerY, 3, 0, Math.PI * 2)
  ctx?.fill()
  if (ctx) ctx.shadowBlur = 0

  animationFrameId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.height
    ctx = canvasRef.value.getContext('2d')
    initParticles(100)
    draw()
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="eco-scanner-container w-full h-full relative">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped>
.eco-scanner-container {
  filter: drop-shadow(0 0 5px rgba(0, 255, 136, 0.2));
}
</style>
