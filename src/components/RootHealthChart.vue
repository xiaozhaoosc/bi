<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrameId: number | null = null

const rootHealth = ref(93)

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const baseNodes = Array.from({ length: 15 }, (_, i) => ({
    name: `根节点${i + 1}`,
    baseX: 50 + (Math.random() - 0.5) * 70,
    baseY: 50 + (Math.random() - 0.5) * 70,
    symbolSize: 8 + Math.random() * 12,
    baseAlpha: 0.4 + Math.random() * 0.6,
    floatOffset: Math.random() * Math.PI * 2
  }))
  
  const nodes = baseNodes.map(node => ({
    name: node.name,
    x: node.baseX,
    y: node.baseY,
    symbolSize: node.symbolSize,
    itemStyle: {
      color: `rgba(34, 197, 94, ${node.baseAlpha})`,
      shadowBlur: 10 + Math.random() * 10,
      shadowColor: '#22c55e'
    }
  }))
  
  const links: Array<{
    source: number
    target: number
    lineStyle: {
      color: string
      width: number
      curveness: number
      opacity?: number
    }
    animation: boolean
  }> = []
  for (let i = 0; i < baseNodes.length; i++) {
    for (let j = i + 1; j < baseNodes.length; j++) {
      if (Math.random() > 0.6) {
        links.push({
          source: i,
          target: j,
          lineStyle: {
            color: 'rgba(34, 197, 94, 0.25)',
            width: 1,
            curveness: 0.1 + Math.random() * 0.2
          },
          animation: true
        })
      }
    }
  }
  
  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#22c55e',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: (params: any) => {
        return `${params.name}: 健康度 <strong>${93 + Math.floor(Math.random() * 5)}%</strong>`
      }
    },
    series: [
      {
        name: '根系网络',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: nodes,
        links: links,
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 2,
            color: '#22c55e'
          },
          itemStyle: {
            shadowBlur: 20
          }
        },
        roam: false,
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut'
      },
      {
        name: '脉冲节点',
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: baseNodes.map((node, i) => ({
          name: `脉冲${i + 1}`,
          x: node.baseX,
          y: node.baseY,
          symbolSize: node.symbolSize + 20,
          itemStyle: {
            color: 'rgba(34, 197, 94, 0)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            borderWidth: 1
          }
        })),
        animationDuration: 2000,
        animationEasing: 'elasticOut',
        animationDelay: (idx: number) => idx * 200
      }
    ],
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { left: 0, right: 0, top: 0, bottom: 0 }
  }
  
  chartInstance.setOption(option)
  
  const animate = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const updatedNodes = baseNodes.map((node) => ({
      name: node.name,
      x: node.baseX + Math.sin(time * 1.5 + node.floatOffset) * 3,
      y: node.baseY + Math.cos(time * 1.2 + node.floatOffset) * 3,
      symbolSize: node.symbolSize + Math.sin(time * 2 + node.floatOffset) * 2,
      itemStyle: {
        color: `rgba(34, 197, 94, ${node.baseAlpha + Math.sin(time * 2 + node.floatOffset) * 0.2})`,
        shadowBlur: 10 + Math.sin(time * 2 + node.floatOffset) * 5,
        shadowColor: '#22c55e'
      }
    }))
    
    const updatedLinks = links.map((link, i) => ({
      ...link,
      lineStyle: {
        ...link.lineStyle,
        opacity: 0.15 + Math.sin(time * 3 + i) * 0.15,
        width: 0.5 + Math.sin(time * 3 + i) * 0.5
      }
    }))
    
    chartInstance.setOption({
      series: [{
        data: updatedNodes,
        links: updatedLinks
      }]
    })
    
    rootHealth.value = 91 + Math.floor(Math.sin(time * 0.5) * 4)
    
    animationFrameId = requestAnimationFrame(animate)
  }
  
  animate()
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', handleResize)
    setTimeout(() => {
      chartInstance?.resize()
    }, 100)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  chartInstance?.dispose()
})
</script>

<template>
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 320px;">
    <h3 class="text-sm font-semibold text-eco-green-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-eco-green-400 animate-pulse"></span>
      根系健康网络
    </h3>
    <div ref="chartRef" class="flex-1 min-h-[220px]"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">菌根共生指数</p>
      <p class="text-lg font-bold text-eco-green-400">{{ rootHealth }}%</p>
    </div>
  </div>
</template>
