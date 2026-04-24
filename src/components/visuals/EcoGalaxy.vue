<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  color?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  alpha: number
}

const particles: Particle[] = []

const initParticles = (w: number, h: number) => {
  particles.length = 0
  const count = 50
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5 - 0.2, // slight upward drift
      alpha: Math.random() * 0.8 + 0.2
    })
  }
}

const draw = () => {
  if (!ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value
  
  ctx.clearRect(0, 0, width, height)

  const time = Date.now() * 0.001
  const accentColor = props.color || '#00d4ff'

  particles.forEach((p, i) => {
    p.x += p.speedX
    p.y += p.speedY

    // Wrap around
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0
    if (p.y < 0) p.y = height
    if (p.y > height) p.y = 0

    // Twinkling effect
    const twinkle = Math.sin(time * 2 + i) * 0.3 + 0.7

    if (ctx) {
      ctx.fillStyle = accentColor
      ctx.globalAlpha = p.alpha * twinkle
      ctx.shadowBlur = p.size * 2
      ctx.shadowColor = accentColor
      
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.shadowBlur = 0
    }
  })

  // Draw some subtle connections for a "constellation" look
  if (ctx) {
    ctx.lineWidth = 0.5
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 60) {
          ctx.strokeStyle = `${accentColor}${Math.floor((1 - dist / 60) * 40).toString(16).padStart(2, '0')}`
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
    ctx.globalAlpha = 1
  }

  animationFrameId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (canvasRef.value) {
    const rect = canvasRef.value.parentElement?.getBoundingClientRect() || { width: 300, height: 200 }
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.height
    ctx = canvasRef.value.getContext('2d')
    initParticles(rect.width, rect.height)
    draw()
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none mix-blend-screen">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>
