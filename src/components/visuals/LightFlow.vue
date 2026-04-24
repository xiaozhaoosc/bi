<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  intensity: number
  color?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

interface Path {
  points: {x: number, y: number}[]
  progress: number
  speed: number
  width: number
}

const paths: Path[] = []

const initPaths = (w: number, h: number) => {
  for (let i = 0; i < 8; i++) {
    const startY = Math.random() * h
    paths.push({
      points: [
        { x: 0, y: startY },
        { x: w * 0.3, y: startY + (Math.random() - 0.5) * 50 },
        { x: w * 0.6, y: startY + (Math.random() - 0.5) * 100 },
        { x: w, y: startY + (Math.random() - 0.5) * 20 }
      ],
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.005,
      width: 1 + Math.random() * 2
    })
  }
}

const draw = () => {
  if (!ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value
  ctx.clearRect(0, 0, width, height)

  const accentColor = props.color || '#00d4ff'

  paths.forEach(path => {
    path.progress += path.speed
    if (path.progress > 1.2) path.progress = -0.2

    // Draw base path (faint)
    ctx?.beginPath()
    ctx?.moveTo(path.points[0].x, path.points[0].y)
    for(let i=1; i<path.points.length; i++) {
        ctx?.lineTo(path.points[i].x, path.points[i].y)
    }
    if (ctx) {
      ctx.strokeStyle = `${accentColor}11`
      ctx.lineWidth = path.width
    }
    ctx?.stroke()

    // Draw glowing head
    const headIdx = Math.max(0, Math.min(path.points.length - 1, Math.floor(path.progress * (path.points.length - 1))))
    const nextIdx = Math.min(path.points.length - 1, headIdx + 1)
    const segmentProgress = (path.progress * (path.points.length - 1)) % 1
    
    const posX = path.points[headIdx].x + (path.points[nextIdx].x - path.points[headIdx].x) * segmentProgress
    const posY = path.points[headIdx].y + (path.points[nextIdx].y - path.points[headIdx].y) * segmentProgress

    if (path.progress >= 0 && path.progress <= 1) {
        const grad = ctx?.createRadialGradient(posX, posY, 0, posX, posY, 20)
        if (grad && ctx) {
          grad.addColorStop(0, accentColor)
          grad.addColorStop(0.5, `${accentColor}44`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
        }
        ctx?.beginPath()
        ctx?.arc(posX, posY, 15, 0, Math.PI * 2)
        ctx?.fill()
        
        // Tron Line Core
        if (ctx) ctx.fillStyle = '#fff'
        ctx?.beginPath()
        ctx?.arc(posX, posY, 2, 0, Math.PI * 2)
        ctx?.fill()
    }
  })

  // Scanning bar
  const scanY = (Date.now() % 4000 / 4000) * height
  const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
  scanGrad.addColorStop(0, 'transparent')
  scanGrad.addColorStop(0.5, `${accentColor}22`)
  scanGrad.addColorStop(1, 'transparent')
  if (ctx) ctx.fillStyle = scanGrad
  ctx.fillRect(0, scanY - 20, width, 40)

  animationFrameId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.height
    ctx = canvasRef.value.getContext('2d')
    initPaths(rect.width, rect.height)
    draw()
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="light-flow-container w-full h-full relative overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    <div class="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl"></div>
  </div>
</template>

<style scoped>
.light-flow-container {
  background: rgba(0, 0, 0, 0.2);
}
</style>
