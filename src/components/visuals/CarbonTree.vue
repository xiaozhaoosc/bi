<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  value: number
  color?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  size: number
}

const particles: Particle[] = []

const initParticles = (width: number, height: number) => {
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: height + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 1.5 - 0.5,
      alpha: Math.random(),
      size: Math.random() * 2 + 1
    })
  }
}

const draw = () => {
  if (!ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value
  ctx.clearRect(0, 0, width, height)

  // 1. Draw "Tree" Structure (Abstract Data Tree)
  const centerX = width / 2
  const baseY = height - 20
  const treeHeight = (props.value / 200) * (height * 0.8)

  // Base Glow
  const gradient = ctx.createRadialGradient(centerX, baseY, 0, centerX, baseY, 50)
  gradient.addColorStop(0, `${props.color || '#00ff88'}33`)
  gradient.addColorStop(1, 'transparent')
  if (ctx) {
    ctx.fillStyle = gradient
    ctx.fillRect(centerX - 50, baseY - 50, 100, 100)
  }

  // Main Trunk
  ctx.beginPath()
  ctx.moveTo(centerX, baseY)
  ctx.bezierCurveTo(centerX - 20, baseY - treeHeight / 2, centerX + 20, baseY - treeHeight / 2, centerX, baseY - treeHeight)
  if (ctx) {
    ctx.strokeStyle = props.color || '#00ff88'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
  }
  ctx?.stroke()

  // Branches based on value
  const branches = Math.floor(props.value / 20)
  for (let i = 0; i < branches; i++) {
    const angle = (i / branches) * Math.PI - Math.PI / 2
    const branchLen = 30 + Math.random() * 20
    ctx.beginPath()
    ctx.moveTo(centerX, baseY - (i / branches) * treeHeight)
    ctx.lineTo(
      centerX + Math.cos(angle) * branchLen, 
      baseY - (i / branches) * treeHeight + Math.sin(angle) * branchLen
    )
    if (ctx) {
      ctx.strokeStyle = `${props.color || '#00ff88'}88`
      ctx.lineWidth = 2
    }
    ctx?.stroke()
  }

  // 2. Draw Flowing Particles (Carbon absorption)
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    p.alpha -= 0.005
    
    if (p.alpha <= 0 || p.y < 0) {
      p.y = height + 10
      p.x = Math.random() * width
      p.alpha = Math.random()
      p.vy = -Math.random() * 1.5 - 0.5
    }

    if (ctx) {
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = props.color || '#00ff88'
    }
    ctx?.beginPath()
    ctx?.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx?.fill()
  })
  if (ctx) ctx.globalAlpha = 1

  animationFrameId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
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
  <div class="carbon-tree-container w-full h-full relative">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    <div class="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none">
       <div class="text-[10px] text-eco-green-500/50 uppercase tracking-[0.2em] font-bold">Carbon Dynamic</div>
    </div>
  </div>
</template>

<style scoped>
.carbon-tree-container {
  filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.3));
}
</style>
