<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  health: number
  color?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

interface Node {
  x: number
  y: number
  baseX: number
  targetY: number
  children: number[]
  layer: number
}

const nodes: Node[] = []

const initNodes = (w: number, h: number) => {
  nodes.length = 0
  const layers = 6
  // Root origin
  nodes.push({ x: w / 2, y: 0, baseX: w / 2, targetY: 0, children: [], layer: 0 })

  let currentLayerNodes: number[] = [0]

  for (let l = 1; l < layers; l++) {
    const nextLayerNodes: number[] = []
    const ySpacing = h / (layers - 1)

    currentLayerNodes.forEach(parentId => {
      const parent = nodes[parentId]
      const numChildren = Math.floor(Math.random() * 3) + 1 // 1 to 3 branches
      
      for (let c = 0; c < numChildren; c++) {
        const spread = (w / layers) * l * 1.5
        const offsetX = (Math.random() - 0.5) * spread
        const childX = parent.baseX + offsetX
        const childY = l * ySpacing + (Math.random() - 0.5) * (ySpacing * 0.5)

        const childId = nodes.length
        nodes.push({
          x: childX,
          y: childY,
          baseX: childX,
          targetY: childY,
          children: [],
          layer: l
        })
        parent.children.push(childId)
        nextLayerNodes.push(childId)
      }
    })
    currentLayerNodes = nextLayerNodes
  }
}

const draw = () => {
  if (!ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value
  ctx.clearRect(0, 0, width, height)

  const time = Date.now() * 0.001
  const accentColor = props.color || '#ff8800'

  // Draw background grid
  if (ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 1
  }
  for(let i=0; i<width; i+=20) {
    ctx?.beginPath(); ctx?.moveTo(i, 0); ctx?.lineTo(i, height); ctx?.stroke()
  }
  for(let i=0; i<height; i+=20) {
    ctx?.beginPath(); ctx?.moveTo(0, i); ctx?.lineTo(width, i); ctx?.stroke()
  }

  // Draw connections (roots)
  nodes.forEach((node, i) => {
    // Gentle sway in the 'water/soil'
    node.x = node.baseX + Math.sin(time * 1.5 + i) * 8 * (node.layer / 5)
    
    node.children.forEach(childIdx => {
      const child = nodes[childIdx]
      
      ctx?.beginPath()
      ctx?.moveTo(node.x, node.y)
      // Use bezier curve for organic root look
      ctx?.quadraticCurveTo(node.x, child.y - 20, child.x, child.y)
      
      if (ctx) {
        ctx.strokeStyle = accentColor
        ctx.globalAlpha = Math.max(0.1, 0.8 - node.layer * 0.15)
        ctx.lineWidth = Math.max(0.5, 5 - node.layer * 0.8)
        ctx.stroke()
        ctx.globalAlpha = 1.0
      }

      // Flowing nutrients/energy pulse
      const pulsePos = (time * 0.3 + i * 0.1) % 1
      const px = node.x + (child.x - node.x) * pulsePos
      const py = node.y + (child.y - node.y) * pulsePos
      
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = 15
        ctx.shadowColor = accentColor
        ctx.beginPath()
        ctx.arc(px, py, Math.max(1, 3 - node.layer * 0.4), 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    })
  })

  animationFrameId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.height
    ctx = canvasRef.value.getContext('2d')
    initNodes(rect.width, rect.height)
    draw()
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="root-network-container w-full h-full relative">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    <div class="absolute top-2 left-4">
       <span class="text-[9px] text-white/40 font-mono tracking-tighter">NETWORK_ACTIVE: TRUE</span>
    </div>
  </div>
</template>

<style scoped>
.root-network-container {
  mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
}
</style>
